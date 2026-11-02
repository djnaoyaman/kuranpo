const {test,expect}=require('./local-fixture');
// Reflow at half the CSS viewport models the layout part of 200% browser zoom.
// CSS style.zoom is a separate synthetic stress case, not browser UI zoom.
for(const width of [320,375,384,390,640,720])test(`hero text fits reduced CSS viewport ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('https://www.googletagmanager.com/**',r=>r.abort());await page.route('https://fonts.googleapis.com/**',r=>r.abort());
 await page.addInitScript(()=>localStorage.setItem('kuranpo-design','monochrome'));await page.goto('/index.html');
 const lines=page.locator('.b-scene .type-hero h1 span');await expect(lines).toHaveCount(4);
 const boxes=await lines.evaluateAll(es=>es.map(e=>{const range=document.createRange();range.selectNodeContents(e);const r=range.getBoundingClientRect();return {text:e.textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom}}));
 expect(boxes.map(b=>b.text)).toEqual(['鎌倉を','歩く。','読む、','確かめる。']);
 for(const b of boxes){expect(b.left,JSON.stringify(b)).toBeGreaterThanOrEqual(0);expect(b.right,JSON.stringify(b)).toBeLessThanOrEqual(width+1);}
 expect(await page.evaluate(()=>matchMedia('(max-width:600px)').matches)).toBe(width<=600);
 if([384,640,720].includes(width))await page.screenshot({path:`test-results/browser-zoom-layout-${width}.png`,fullPage:false});
});
