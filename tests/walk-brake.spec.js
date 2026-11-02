const {test,expect}=require('./local-fixture'),fs=require('fs');
const current=fs.readFileSync('assets/walk-motion.js','utf8');
test('same timed touch gesture keeps release velocity and modestly shortens coast',async({browser})=>{
 const results=[];
 for(const dx of [-105,-195]){
  const pair=[];
  for(const baseline of [true,false]){
   const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'no-preference'});
   const p=await c.newPage();
   if(baseline)await p.route('**/assets/walk-motion.js?*',r=>r.fulfill({status:200,contentType:'application/javascript',body:current.replace('FRICTION=.35','FRICTION=.30')}));
   await p.goto('/index.html');await expect(p.locator('.walk-card')).toHaveCount(5);
   await p.locator('.walk-gallery').evaluate(e=>scrollTo({top:scrollY+e.getBoundingClientRect().top-90,behavior:'instant'}));
   await p.waitForTimeout(1400);
   await p.evaluate(()=>{const original=WalkMotion.Motion.prototype.release;WalkMotion.Motion.prototype.release=function(v,reduced){const start=this.position;original.call(this,v,reduced);window.brakeRelease={start,inputVelocity:v,velocity:this.velocity,target:this.target,duration:this.duration,phase:this.phase,friction:WalkMotion.FRICTION};};});
   const box=await p.locator('.walk-viewport').boundingBox(),x=box.x+box.width/2+40,y=250,stamp=Date.now()/1000,cdp=await c.newCDPSession(p);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',timestamp:stamp,touchPoints:[{x,y}]});
   for(let i=1;i<=3;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',timestamp:stamp+i/60,touchPoints:[{x:x+dx*i/3,y}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',timestamp:stamp+4/60,touchPoints:[]});
   const release=await p.evaluate(()=>window.brakeRelease);expect(release.phase).toBe('coast');expect(release.velocity).toBe(Math.max(-18,Math.min(18,release.inputVelocity)));expect(release.friction).toBe(baseline?.30:.35);
   await p.waitForTimeout(600);await expect(p.locator('.walk-gallery')).toHaveAttribute('data-motion','coast');
   const observed=await p.locator('.walk-gallery').evaluate(e=>({position:+e.dataset.position,velocity:+e.dataset.velocity}));expect(observed.position).toBeGreaterThan(release.start);expect(observed.velocity).toBeGreaterThan(0);expect(observed.velocity).toBeLessThan(release.velocity);
   if(!baseline)await p.screenshot({path:`test-results/walk-brake-${-dx}-600ms.png`});pair.push({baseline,dx,release,observed});await c.close();
  }
  // Separate real browser contexts quantize event timestamps slightly differently (observed 0.29%).
  // Require exact within-event release continuity above; permit <1% cross-context input jitter, not a changed fling gain.
  fs.writeFileSync('test-results/walk-brake-real-touch.json',JSON.stringify([...results,{dx,pair}],null,2));
  const [a,b]=pair;expect(Math.abs(a.release.start-b.release.start)).toBeLessThan(.001);expect(Math.abs(a.release.velocity-b.release.velocity)/Math.abs(a.release.velocity)).toBeLessThan(.01);
  const ratio=(b.release.target-b.release.start)/(a.release.target-a.release.start);expect(ratio).toBeGreaterThanOrEqual(.8);expect(ratio).toBeLessThanOrEqual(.91);expect(b.release.duration/a.release.duration).toBeGreaterThanOrEqual(.8);expect(b.release.duration/a.release.duration).toBeLessThanOrEqual(.91);results.push({dx,pair,distanceRatio:ratio});
 }
 fs.writeFileSync('test-results/walk-brake-real-touch.json',JSON.stringify(results,null,2));
});
