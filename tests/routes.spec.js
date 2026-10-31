const {test,expect}=require('@playwright/test');
for(const theme of ['traditional','monochrome'])for(const key of ['c6','c7'])test(`pending route ${key} ${theme}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(t=>localStorage.setItem('kuranpo-design',t),theme);await page.goto(`/knowledge/${key}.html`);
 await expect(page.locator('.story')).toContainText('再確認中');await expect(page.locator('.dist')).toContainText('再確認中');
 expect(await page.locator('.spot-list .leg').allTextContents()).toEqual(expect.arrayContaining(['区間距離・所要時間は再確認中']));
 await page.screenshot({path:`test-results/pending-${key}-${theme}.png`,fullPage:true});
});
test('pending routes excluded from time filter',async({page})=>{
 await page.goto('/index.html');await page.locator('[data-mode="time"]').click();await page.locator('.opts[data-for="time"] button').first().click();
 for(const key of ['c6','c7'])await expect(page.locator(`.route:has(a[href="knowledge/${key}.html"])`)).toBeHidden();
});
