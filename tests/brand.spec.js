const {test,expect}=require('./local-fixture');
for(const width of [320,375,390,768,844,1440])for(const theme of ['traditional','monochrome'])test(`selected logo ${theme} ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===844?390:900});await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('https://www.googletagmanager.com/**',r=>r.abort());await page.route('https://fonts.googleapis.com/**',r=>r.abort());
 await page.addInitScript(t=>localStorage.setItem('kuranpo-design',t),theme);await page.goto('/index.html');
 const logo=page.locator('.topbar-brand img');await expect(logo).toHaveAttribute('alt','鎌・くらんぽ');
 expect(await logo.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);const logoBox=await logo.boundingBox();expect(logoBox.width).toBe(width<360?96:width<=1000?104:128);const headerBox=await page.locator('.topbar-inner').boundingBox();expect(headerBox.height).toBe(theme==='monochrome'&&width>1000?64:56);for(const selector of ['.theme-switch select','.hamburger']){const el=page.locator(selector);if(await el.isVisible()){const b=await el.boundingBox();expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);}}
 const boxes=await page.locator('.topbar-brand,.topbar-nav,.theme-switch,.hamburger').evaluateAll(es=>es.filter(e=>getComputedStyle(e).display!=='none').map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}}));
 for(const b of boxes){expect(b.left).toBeGreaterThanOrEqual(0);expect(b.right).toBeLessThanOrEqual(width+1)}
 for(let i=1;i<boxes.length;i++)expect(boxes[i].left).toBeGreaterThanOrEqual(boxes[i-1].right-1);
 for(const a of await page.locator('.topbar-nav a').all()){if(await a.isVisible())expect(await a.evaluate(e=>e.getBoundingClientRect().height)).toBeLessThanOrEqual(30);}
 await page.screenshot({path:`test-results/logo-${theme}-${width}.png`});
 await page.getByLabel('サイトのデザイン').selectOption(theme==='traditional'?'monochrome':'traditional');await expect(logo).toBeVisible();
 await page.goto('/knowledge/c1.html');await expect(page.locator('.topbar-brand')).toHaveAttribute('href','../index.html');expect(await page.locator('.brand-logo').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
});
for(const theme of ['traditional','monochrome'])test(`logo and header at 200 percent ${theme}`,async({page})=>{
 await page.setViewportSize({width:768,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(t=>localStorage.setItem('kuranpo-design',t),theme);await page.goto('/index.html');
 await page.evaluate(()=>document.documentElement.style.zoom='2');await expect(page.locator('.brand-logo')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await page.screenshot({path:`test-results/logo-${theme}-zoom200.png`});
});
