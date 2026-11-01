// Engine-level synthetic touch-shaped DOM event contract (WebKit disallows Touch constructor), NOT a physical iPhone/Safari gesture test.
const {test,expect}=require('./local-fixture');const {webkit}=require('playwright');
test('WebKit touch cancellation and pinch handoff contract',async()=>{
 const browser=await webkit.launch(),c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'no-preference'});
 await c.route('**/*',r=>new URL(r.request().url()).origin==='http://127.0.0.1:4173'?r.continue():r.abort());const p=await c.newPage();await p.goto('http://127.0.0.1:4173/index.html');await expect(p.locator('.walk-card')).toHaveCount(7);
 await p.evaluate(()=>{window.touchTarget=document.querySelector('.walk-current .walk-photo');window.sendTouch=(type,x,y,extra=false)=>{const t={identifier:11,target:touchTarget,clientX:x,clientY:y},second={identifier:12,target:touchTarget,clientX:x+50,clientY:y};const points=type==='touchend'||type==='touchcancel'?[]:(extra?[t,second]:[t]);const e=new Event(type,{bubbles:true,cancelable:true});Object.defineProperties(e,{touches:{value:points},targetTouches:{value:points},changedTouches:{value:[t]}});touchTarget.dispatchEvent(e);return e.defaultPrevented;};});
 expect(await p.evaluate(()=>sendTouch('touchstart',250,250))).toBe(false);
 expect(await p.evaluate(()=>sendTouch('touchmove',225,265))).toBe(true);
 await p.evaluate(()=>sendTouch('touchcancel',225,265));await expect(p.locator('.walk-viewport')).not.toHaveClass(/is-dragging/);await expect(p.locator('.walk-gallery')).toHaveAttribute('data-motion','idle');
 await p.evaluate(()=>sendTouch('touchstart',250,250));expect(await p.evaluate(()=>sendTouch('touchmove',245,210))).toBe(false);await p.evaluate(()=>sendTouch('touchend',245,210));
 await p.evaluate(()=>sendTouch('touchstart',250,250));expect(await p.evaluate(()=>sendTouch('touchmove',220,250))).toBe(true);expect(await p.evaluate(()=>sendTouch('touchmove',215,250,true))).toBe(false);await expect(p.locator('.walk-viewport')).not.toHaveClass(/is-dragging/);await p.evaluate(()=>sendTouch('touchend',215,250));
 await p.screenshot({path:'test-results/webkit-touch-contract.png'});await browser.close();
});
