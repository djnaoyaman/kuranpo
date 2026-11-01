const {test,expect}=require('./local-fixture');
async function open(page,width=390){await page.setViewportSize({width,height:width===768?500:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/index.html');await expect(page.locator('.walk-select option')).toHaveCount(67);await page.locator('.walk-gallery').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('.walk-current img').count()).toBe(1);}
async function index(page,n){await expect(page.locator('.walk-gallery')).toHaveAttribute('data-index',String(n));}
async function drag(page,dx,dy=0){const b=await page.locator('.walk-current .walk-photo').boundingBox();const x=b.x+b.width/2,y=b.y+Math.min(100,b.height/2);await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:8});await page.mouse.up();}
for(const width of [320,390,768,1440])test('gallery screen and 67-course ring '+width,async({page})=>{
 await open(page,width);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const hrefs=await page.locator('#routes .route>a').evaluateAll(a=>a.map(a=>a.getAttribute('href')));expect(hrefs.length).toBe(67);expect(new Set(hrefs).size).toBe(67);
 const reached=[];for(let i=0;i<67;i++){await index(page,i);const link=page.locator('.walk-current');const href=await link.getAttribute('href');expect(href).toBe(hrefs[i]);reached.push(href);await page.locator('.walk-next').click();}
 await index(page,0);expect(new Set(reached).size).toBe(67);await page.locator('.walk-prev').click();await index(page,66);await page.locator('.walk-next').click();await index(page,0);
 await expect(page.locator('.walk-current')).toHaveCount(1);await expect(page.locator('.walk-preview[aria-hidden=true][inert]')).toHaveCount(2);
 await expect(page.locator('.walk-gallery img')).toHaveCount(3);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 await page.locator('.walk-gallery').screenshot({path:`test-results/walk-gallery-${width}.png`});expect(errors).toEqual([]);
});
test('drag, vertical movement, keyboard and repeated input',async({page})=>{
 await open(page);await drag(page,-85);await index(page,1);await expect(page).toHaveURL(/index.html/);await drag(page,85);await index(page,0);await drag(page,5,90);await index(page,0);
 await page.locator('.walk-viewport').focus();await page.keyboard.press('ArrowLeft');await index(page,66);await page.keyboard.press('Home');await index(page,0);await page.keyboard.press('End');await index(page,66);await page.keyboard.press('ArrowRight');await index(page,0);
 await page.locator('.walk-next').evaluate(b=>{for(let i=0;i<135;i++)b.click()});await index(page,1);
 await page.locator('.walk-viewport').dispatchEvent('pointerdown',{pointerId:3,isPrimary:true,button:2,clientX:200,clientY:100});await page.locator('.walk-viewport').dispatchEvent('pointermove',{pointerId:3,isPrimary:true,clientX:50,clientY:100});await page.locator('.walk-viewport').dispatchEvent('pointerup',{pointerId:3,isPrimary:true,button:2,clientX:50,clientY:100});await index(page,1);
 await page.locator('.walk-viewport').dispatchEvent('pointerdown',{pointerId:4,isPrimary:true,button:0,clientX:200,clientY:100});await page.locator('.walk-viewport').dispatchEvent('pointercancel',{pointerId:4,isPrimary:true});await index(page,1);
 expect(await page.evaluate(()=>document.querySelector('.walk-current').getAnimations().length)).toBe(0);
});
test('selected link, back, resize, themes and missing photo course',async({page})=>{
 await open(page);await page.locator('.walk-select').selectOption('knowledge/c15.html');await expect(page.locator('.walk-current')).toHaveAttribute('href','knowledge/c15.html');await expect(page.locator('.walk-current .walk-no-photo')).toBeVisible();
 const selected=await page.locator('.walk-gallery').getAttribute('data-index');
 await page.getByLabel('サイトのデザイン').selectOption('traditional');await expect(page.locator('.walk-gallery')).toHaveCount(0);await expect(page.locator('.hero-title')).toBeVisible();await page.getByLabel('サイトのデザイン').selectOption('monochrome');await index(page,Number(selected));
 for(let i=0;i<4;i++){await page.getByLabel('サイトのデザイン').selectOption('traditional');await page.getByLabel('サイトのデザイン').selectOption('monochrome');}await expect(page.locator('.walk-gallery')).toHaveCount(1);await page.locator('.walk-next').click();await index(page,Number(selected)+1);
 await page.locator('.walk-select').selectOption('knowledge/c1.html');await page.locator('.walk-current').click();await expect(page).toHaveURL(/knowledge\/c1.html/);await page.goBack();await expect(page.locator('.walk-current')).toHaveAttribute('href','knowledge/c1.html');await page.setViewportSize({width:1440,height:900});await expect(page.locator('.walk-current')).toHaveAttribute('href','knowledge/c1.html');
});
test('real touch swipe and vertical scroll',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const page=await context.newPage();await open(page);const cdp=await context.newCDPSession(page);const b=await page.locator('.walk-current .walk-photo').boundingBox();const x=b.x+b.width/2,y=b.y+100;
 async function touch(dx,dy){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y:y+dy*i/8}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 await touch(-90,0);await index(page,1);await expect(page).toHaveURL(/index.html/);await touch(0,-90);await index(page,1);await page.locator('.walk-current').tap();await expect(page).toHaveURL(/knowledge\/g2.html/);await context.close();
});
