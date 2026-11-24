const {test, expect}=require('@playwright/test');

const home='/kuranpo/';
const visibleFrom=Date.parse('2026-09-19T00:00:00+09:00');
const expires=Date.parse('2026-11-29T00:00:00+09:00');

test.use({timezoneId:'America/Los_Angeles'});
for (const width of [320,1024]) {
  test(`featured event fits the ${width}px viewport and opens the archived note`, async ({page})=>{
    await page.setViewportSize({width,height:820});
    await page.clock.setFixedTime(new Date('2026-11-24T12:00:00+09:00'));
    await page.goto(home);
    const section=page.getByRole('region',{name:'鎌倉の催し'});
    await expect(section).toBeVisible();
    await expect(section.getByText('2026年11月28日（土）まで')).toBeVisible();
    await expect(section.getByRole('link',{name:'展示案内'})).toHaveAttribute('href','https://www.shonan-sh.jp/events/amadera/');
    expect(await section.evaluate(el=>{
      const card=el.querySelector('.local-event').getBoundingClientRect();
      return el.parentElement.querySelector('header.hero').nextElementSibling===el
        && card.left>=0 && card.right<=document.documentElement.clientWidth && card.width>0;
    })).toBe(true);
    await section.getByRole('link',{name:'「尼寺と女性たちの鎌倉」を読む'}).click();
    await expect(page).toHaveURL(/knowledge\/g10\.html#amadera-exhibition-2026$/);
    await expect(page.locator('#amadera-exhibition-2026')).toContainText('離縁状');
  });
}
test('promotion hides at the midnight after the last day in Japan, even while open', async ({page})=>{
  await page.clock.install({time:new Date(expires-60000)});
  await page.clock.pauseAt(new Date(expires-1000));
  await page.goto(home);
  const section=page.locator('#local-events');
  await expect(section).toBeVisible();
  await page.clock.runFor(1000);
  await expect(section).toBeHidden();
  expect(await section.evaluate(el=>el.getBoundingClientRect().height)).toBe(0);
  await page.reload();
  await expect(section).toBeHidden();
  await page.goto('/kuranpo/knowledge/g10.html#amadera-exhibition-2026');
  await expect(page.locator('#amadera-exhibition-2026')).toBeVisible();
});
test('promotion does not show before the opening day in Japan', async ({page})=>{
  await page.clock.setFixedTime(new Date(visibleFrom-1));
  await page.goto(home);
  await expect(page.locator('#local-events')).toBeHidden();
});
