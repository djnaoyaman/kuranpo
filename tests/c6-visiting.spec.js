const {test,expect}=require('./local-fixture');
for(const width of [320,390,768,1280])for(const theme of ['traditional','monochrome'])test(`C6 sourced cautions ${width} ${theme}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(t=>localStorage.setItem('kuranpo-design',t),theme);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/knowledge/c6.html');
 await expect(page.locator('.spot-list')).toContainText('出発地点：大塔宮（鎌倉宮）バス停');await expect(page.locator('.spot-list')).toContainText('2025年7月22日付案内');await expect(page.locator('.spot-list')).toContainText('完全予約制・雨天休止');await expect(page.locator('.spot-list')).toContainText('通常非公開');await expect(page.locator('.spot-list')).toContainText('公開日・予約条件');await expect(page.locator('.story')).toContainText('再確認中');
 const link=page.locator('.spot-list a[href="https://kousokuji.com/access/"]');await link.focus();await expect(link).toBeFocused();await expect(link).toHaveAttribute('rel','noopener');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);await page.locator('.spot-list').screenshot({path:`test-results/c6-visits-${width}-${theme}.png`});
 await page.getByLabel('サイトのデザイン').selectOption(theme==='traditional'?'monochrome':'traditional');await expect(page.locator('.spot-list')).toContainText('完全予約制・雨天休止');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);expect(errors).toEqual([]);
});
