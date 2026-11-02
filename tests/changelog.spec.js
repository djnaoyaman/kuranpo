const {test,expect}=require('./local-fixture');
for(const width of [320,390,768,1440])test('published changelog is readable and source-linked '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/changelog.html');
 for(const theme of ['monochrome','traditional']){
  await page.getByLabel('サイトのデザイン').selectOption(theme);
  const log=page.locator('section.log');await log.scrollIntoViewIfNeeded();
  await expect(log).toContainText('確認が完了したという意味ではありません');
  await expect(log).toContainText('C6・C7');await expect(log).toContainText('苔の石段');
  for(let n=1;n<=5;n++)await expect(log.locator(`a[href="https://github.com/djnaoyaman/kuranpo/pull/${n}"]`)).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
  const bad=await log.locator('p,li,h2,h3').evaluateAll(es=>es.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left < -2||r.right>innerWidth+2)}).map(e=>e.tagName));expect(bad).toEqual([]);
  const heading=await page.locator('header.site h1').evaluate(el=>{const s=getComputedStyle(el),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),chars=[];let node;while(node=walker.nextNode())for(let i=0;i<node.length;i++){const r=document.createRange();r.setStart(node,i);r.setEnd(node,i+1);const b=r.getBoundingClientRect();chars.push({x:b.x,y:b.y,w:b.width,h:b.height});}return {fontSize:parseFloat(s.fontSize),mode:s.writingMode,feature:s.fontFeatureSettings,chars};});
  expect(heading.chars).toHaveLength(4);const axis=theme==='traditional'?'y':'x';for(let i=1;i<heading.chars.length;i++)expect(heading.chars[i][axis]-heading.chars[i-1][axis],JSON.stringify(heading)).toBeGreaterThan(heading.fontSize*.6);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`test-results/changelog-${theme}-${width}.png`});
  await log.locator('li').filter({has:page.locator('a[href="https://github.com/djnaoyaman/kuranpo/pull/5"]')}).evaluate(e=>e.scrollIntoView({block:"center"}));
  await page.screenshot({path:`test-results/changelog-published-${theme}-${width}.png`});
 }
});
