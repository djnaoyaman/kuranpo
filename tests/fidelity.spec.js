const {test,expect}=require('@playwright/test');
async function geometry(page){return page.locator('.type-hero').evaluate(e=>{const base=e.getBoundingClientRect();return [...e.querySelectorAll('h1 span,.type-intro,.type-go')].map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return {text:n.textContent,x:r.x-base.x,y:r.y-base.y,w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,spacing:s.letterSpacing}})});}
for(const width of [390,1440])test('selected B exact hero geometry '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/tests/fixtures/selected-b/index.html');const original=await geometry(page);
 await page.locator('.type-hero').screenshot({path:`test-results/original-B-hero-${width}.png`});
 await page.locator('.type-work').screenshot({path:`test-results/original-B-orbit-${width}.png`});
 await page.goto('/index.html');const revised=await geometry(page);
 await page.locator('.type-hero').screenshot({path:`test-results/revised-B-hero-${width}.png`});
 await page.locator('.type-work').screenshot({path:`test-results/revised-B-orbit-${width}.png`});
 for(let i=0;i<original.length;i++){expect(revised[i].text).toBe(original[i].text);for(const k of ['x','y','w','h'])expect(Math.abs(revised[i][k]-original[i][k]),JSON.stringify({width,i,k,original:original[i],revised:revised[i]})).toBeLessThan(2);}
 await expect(page.locator('.b-scene .orbit .feature img')).toHaveCount(4);
 await page.getByLabel('サイトのデザイン').selectOption('traditional');await expect(page.locator('.b-scene')).toHaveCount(0);await expect(page.locator('.hero-title')).toBeVisible();
 await page.getByLabel('サイトのデザイン').selectOption('monochrome');await expect(page.locator('.b-scene')).toHaveCount(1);
});
for(const mobile of [false,true])test('normal motion recording '+(mobile?'mobile':'desktop'),async({browser})=>{
 const width=mobile?390:1440,height=mobile?844:900;
 const context=await browser.newContext({viewport:{width,height},hasTouch:mobile,isMobile:mobile,reducedMotion:'no-preference',recordVideo:{dir:'test-results/motion-'+(mobile?'mobile':'desktop'),size:{width,height}}});
 const p=await context.newPage();await p.route('https://www.googletagmanager.com/**',r=>r.abort());
 await p.goto('http://127.0.0.1:4173/index.html');
 await expect.poll(()=>p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBeGreaterThan(0);
 const animated=await p.evaluate(()=>document.getAnimations().filter(a=>a.effect?.target?.matches('.type-hero h1 span')).map(a=>a.effect.getTiming().delay));expect(animated.length).toBe(4);expect(new Set(animated).size).toBe(4);
 await p.waitForTimeout(2300);await p.screenshot({path:`test-results/normal-motion-settled-${width}.jpg`});
 await p.evaluate(()=>document.querySelector('.type-statement').scrollIntoView({behavior:'smooth'}));await p.waitForTimeout(1500);
 await p.evaluate(()=>document.querySelector('.type-work').scrollIntoView({behavior:'smooth'}));await p.waitForTimeout(1000);
 await p.evaluate(()=>document.querySelector('.orbit').scrollIntoView({behavior:'smooth',block:'center'}));await p.waitForTimeout(1600);
 if(!mobile){await p.locator('.orbit .feature').first().hover();await p.waitForTimeout(900);}
 await p.locator('.choose').scrollIntoViewIfNeeded();await p.locator('[data-mode="place"]').click();await p.waitForTimeout(800);
 await p.getByLabel('サイトのデザイン').selectOption('traditional');await p.waitForTimeout(700);await p.getByLabel('サイトのデザイン').selectOption('monochrome');
 await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(60);expect(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
 await context.close();
});
