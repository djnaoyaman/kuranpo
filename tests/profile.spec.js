const {test,expect}=require('@playwright/test');
for(const width of [320,390,768,1440])for(const theme of ['traditional','monochrome'])test(`compact profile ${width} ${theme}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.route('https://www.googletagmanager.com/**',r=>r.abort());await page.addInitScript(t=>localStorage.setItem('kuranpo-design',t),theme);await page.goto('/profile.html');
 await expect(page.getByText('鎌倉を歩く楽しみから、このサイトは始まりました。道の先にある歴史も、散歩と一緒に楽しめたら。',{exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'作者について',exact:true})).toHaveAttribute('href','https://djnaoyaman.github.io/profile.html');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);await page.screenshot({path:`test-results/profile-${theme}-${width}.png`,fullPage:true});
});
