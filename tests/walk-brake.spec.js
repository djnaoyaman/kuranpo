const {test,expect}=require('./local-fixture');
for(const reduced of ['no-preference','reduce'])test('fast and slow swipes advance exactly one course: '+reduced,async({browser})=>{
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:reduced}),p=await c.newPage();
 await p.goto('http://127.0.0.1:4173/index.html');await expect(p.locator('.walk-card')).toHaveCount(5);await p.waitForTimeout(1400);
 const cdp=await c.newCDPSession(p);
 for(const dx of [-95,-230,95,230]){
  await p.locator('.walk-select').selectOption('knowledge/g1.html');await p.locator('.walk-gallery').evaluate(e=>scrollTo({top:scrollY+e.getBoundingClientRect().top-90,behavior:'instant'}));
  const box=await p.locator('.walk-current .walk-photo').boundingBox(),x=box.x+box.width/2+(dx<0?40:-40),y=box.y+70,stamp=Date.now()/1000;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',timestamp:stamp,touchPoints:[{x,y}]});
  for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',timestamp:stamp+i/60,touchPoints:[{x:x+dx*i/5,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',timestamp:stamp+6/60,touchPoints:[]});
  await expect(p.locator('.walk-gallery')).toHaveAttribute('data-motion','idle',{timeout:1500});await expect(p.locator('.walk-gallery')).toHaveAttribute('data-index',dx<0?'1':'66');await expect(p).toHaveURL(/index.html/);
  const index=await p.locator('.walk-gallery').getAttribute('data-index');await p.waitForTimeout(350);await expect(p.locator('.walk-gallery')).toHaveAttribute('data-index',index);
 }
 await c.close();
});
