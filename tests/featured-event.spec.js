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
  const amadera=section.locator('#event-amadera');
  await expect(amadera).toBeVisible();
  await page.clock.runFor(1000);
  await expect(amadera).toBeHidden();
  await expect(section.locator('#event-hasedera')).toBeVisible();
  await page.reload();
  await expect(amadera).toBeHidden();
  await page.goto('/kuranpo/knowledge/g10.html#amadera-exhibition-2026');
  await expect(page.locator('#amadera-exhibition-2026')).toBeVisible();
});
test('promotion does not show before the opening day in Japan', async ({page})=>{
  await page.clock.setFixedTime(new Date(visibleFrom-1));
  await page.goto(home);
  await expect(page.locator('#local-events')).toBeHidden();
});

test('home advertises active and upcoming visits separately while remaining compact', async ({page})=>{
  await page.setViewportSize({width:320,height:820});
  await page.clock.setFixedTime(new Date('2026-11-24T12:00:00+09:00'));
  await page.goto(home);
  const section=page.locator('#local-events');
  await expect(section.locator('article:visible')).toHaveCount(6);
  for(const id of ['hasedera','hasedera-kaicho','kenchoji']) await expect(section.locator('#event-'+id+' [data-event-status]')).toHaveText('会期中');
  for(const id of ['kakuonji','hokokuji']) await expect(section.locator('#event-'+id+' [data-event-status]')).toHaveText('開催予定');
  const layout=await section.evaluate(el=>({
    width:document.documentElement.clientWidth,
    height:el.getBoundingClientRect().height,
    boxes:[...el.querySelectorAll('.local-event')].map(a=>a.getBoundingClientRect().toJSON()),
    minLinkHeight:Math.min(...[...el.querySelectorAll('.event-links a,.local-event--brief h3 a')].map(a=>a.getBoundingClientRect().height))
  }));
  expect(layout.boxes.every(b=>b.left>=0&&b.right<=layout.width),JSON.stringify(layout)).toBe(true);
  expect(layout.height).toBeLessThan(720);
  expect(layout.minLinkHeight).toBeGreaterThanOrEqual(44);
  await section.locator('#event-hasedera').getByRole('link',{name:'コースを見る'}).click();
  await expect(page).toHaveURL(/knowledge\/g11\.html#event-at-hasedera$/);
  await expect(page.locator('#event-at-hasedera')).toBeVisible();
  await expect(page.locator('#event-at-hasedera').locator('xpath=..')).toContainText('長谷寺');
});

test('JST independently switches temple notices and expiries on home and direct routes', async ({page})=>{
  const freeze=date=>page.clock.setFixedTime(new Date(date+'+09:00'));
  await freeze('2026-11-25T00:00:00');
  await page.goto('/kuranpo/knowledge/ti9.html');
  await expect(page.locator('#event-at-kakuonji [data-event-status]')).toHaveText('会期中');
  await expect(page.locator('#event-at-hokokuji [data-event-status]')).toHaveText('開催予定');
  await freeze('2026-12-06T23:59:59');
  await page.goto(home);
  for(const id of ['hasedera','kenchoji','kakuonji']) await expect(page.locator('#event-'+id)).toBeVisible();
  await freeze('2026-12-07T00:00:00');
  await page.reload();
  for(const id of ['hasedera','kenchoji']) await expect(page.locator('#event-'+id)).toBeHidden();
  await expect(page.locator('#event-kakuonji')).toBeVisible();
  await page.goto('/kuranpo/knowledge/re2.html');
  await expect(page.locator('#event-at-kenchoji')).toBeHidden();
  await expect(page.locator('.spot-list')).toContainText('建長寺');
  await freeze('2026-12-10T23:59:59');
  await page.goto('/kuranpo/knowledge/ti9.html');
  await expect(page.locator('#event-at-kakuonji')).toBeVisible();
  await freeze('2026-12-11T00:00:00');
  await page.reload();
  await expect(page.locator('#event-at-kakuonji')).toBeHidden();
  await expect(page.locator('#event-at-hokokuji [data-event-status]')).toHaveText('本日開催');
  await freeze('2026-12-12T00:00:00');
  await page.reload();
  const hokokuji=page.locator('#event-at-hokokuji');
  await expect(hokokuji.locator('[data-event-day="2026-12-11"]')).toBeHidden();
  await expect(hokokuji.locator('[data-event-day="2026-12-19"]')).toBeVisible();
  await expect(hokokuji.locator('[data-event-status]')).toHaveText('開催予定');
  await freeze('2026-12-19T23:59:59');
  await page.goto(home);
  await expect(page.locator('#event-hokokuji [data-event-status]')).toHaveText('本日開催');
  await freeze('2026-12-20T00:00:00');
  await page.reload();
  await expect(page.locator('#local-events')).toBeHidden();
  expect(await page.locator('#local-events').evaluate(el=>el.getBoundingClientRect().height)).toBe(0);
});

test('Hasedera full viewing is distinct and stays visible through its own JST last day', async ({page})=>{
  const freeze=date=>page.clock.setFixedTime(new Date(date+'+09:00'));
  await page.setViewportSize({width:320,height:820});
  const card=page.locator('#event-hasedera-kaicho');
  const notice=page.locator('#event-at-hasedera-kaicho');
  await freeze('2026-11-17T23:59:59');
  await page.goto(home);
  await expect(card).toBeHidden();
  await freeze('2026-11-18T00:00:00');
  await page.reload();
  await expect(card).toBeVisible();
  await expect(card.locator('[data-event-status]')).toHaveText('会期中');
  await expect(card).toContainText('12月18日まで');
  await freeze('2026-12-07T00:00:00');
  await page.reload();
  await expect(page.locator('#event-hasedera')).toBeHidden();
  await expect(card).toBeVisible();
  await card.getByRole('link',{name:'長谷寺 十一面観音の全身総開帳'}).click();
  await expect(page).toHaveURL(/knowledge\/g11\.html#event-at-hasedera-kaicho$/);
  await expect(notice).toBeVisible();
  await expect(notice.locator('xpath=..')).toContainText('長谷寺');
  await expect(notice).toContainText('別の行事');
  await expect(notice.getByRole('link',{name:'総開帳の公式案内'})).toHaveAttribute('href','https://www.hasedera.jp/2026/10/20867/');
  await expect(notice).toContainText('駐車場は終日利用できません');
  await expect(notice.getByRole('link',{name:'最終日の公式案内'})).toHaveAttribute('href','https://www.hasedera.jp/2026/11/14826/');
  for(const path of [home,'/kuranpo/knowledge/g11.html','/kuranpo/knowledge/re10.html']){
    const visible=path===home ? card : notice;
    await freeze('2026-12-18T23:59:59');
    await page.goto(path);
    await expect(visible).toBeVisible();
    await freeze('2026-12-19T00:00:00');
    await page.reload();
    await expect(visible).toBeHidden();
    if(path===home) await expect(page.locator('#event-hokokuji [data-event-status]')).toHaveText('本日開催');
  }
});
