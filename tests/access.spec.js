const {test,expect}=require('@playwright/test');
for(const theme of ['traditional','monochrome'])test(`Myohoji access warning ${theme}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(t=>localStorage.setItem('kuranpo-design',t),theme);await page.goto('/knowledge/c4.html');
 await expect(page.locator('.story')).toContainText('妙法寺の苔の石段は、保護のため通行できません');
 await expect(page.locator('.snote').filter({hasText:'苔の石段は通行不可。脇の迂回路'})).toBeVisible();
 await page.screenshot({path:`test-results/myohoji-access-${theme}.png`,fullPage:true});
});
