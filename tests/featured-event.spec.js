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
  await expect(section.locator('article:visible')).toHaveCount(7);
  expect((await section.locator('article:visible').evaluateAll(els=>els.map(e=>e.id))).sort()).toEqual(['amadera','chojuji-autumn','hasedera','hasedera-kaicho','hokokuji','kakuonji','kenchoji'].map(id=>'event-'+id).sort());
  for(const id of ['hasedera','hasedera-kaicho','kenchoji','chojuji-autumn']) await expect(section.locator('#event-'+id+' [data-event-status]')).toHaveText('会期中');
  for(const id of ['kakuonji','hokokuji']) await expect(section.locator('#event-'+id+' [data-event-status]')).toHaveText('開催予定');
  const layout=await section.evaluate(el=>({
    width:document.documentElement.clientWidth,
    height:el.getBoundingClientRect().height,
    boxes:[...el.querySelectorAll('.local-event')].map(a=>a.getBoundingClientRect().toJSON()),
    minLinkHeight:Math.min(...[...el.querySelectorAll('.event-links a,.local-event--brief h3 a')].filter(a=>a.getClientRects().length>0).map(a=>a.getBoundingClientRect().height))
  }));
  expect(layout.boxes.every(b=>b.left>=0&&b.right<=layout.width),JSON.stringify(layout)).toBe(true);
  expect(layout.height,JSON.stringify(layout)).toBeLessThan(720);
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
  await expect(page.locator('#event-hokokuji')).toBeHidden();
  await expect(page.locator('#local-events article:visible h3')).toHaveText(['生誕800年 無住がみた鎌倉','鶴岡八幡宮の古神宝展']);
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


test('Sugimoto-dera shows only the four official dates, in the four stopping routes and compact home', async ({page})=>{
  const freeze=date=>page.clock.setFixedTime(new Date(date+'+09:00'));
  const card=page.locator('#event-sugimotodera-kaicho');
  const note=page.locator('#event-at-sugimotodera-kaicho');
  await page.setViewportSize({width:320,height:820});
  await freeze('2026-11-24T23:59:59');
  await page.goto(home);
  await expect(card).toBeHidden();
  await freeze('2026-11-25T00:00:00');
  await page.reload();
  await expect(card.locator('[data-event-day]:visible')).toHaveCount(4);
  await expect(card.locator('[data-event-status]')).toHaveText('開催予定');
  expect(await card.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=document.documentElement.clientWidth;})).toBe(true);
  expect((await card.getByRole('link').boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.setViewportSize({width:768,height:820});
  await page.evaluate(()=>document.documentElement.style.zoom='2');
  const zoom=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('.local-events *')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().right>innerWidth+1).slice(0,12).map(e=>[e.className,e.textContent.trim().slice(0,35)])}));
  expect(zoom.page,JSON.stringify(zoom)).toBeLessThanOrEqual(zoom.viewport+1);
  await page.evaluate(()=>{document.documentElement.style.zoom='';});
  await card.getByRole('link').click();
  await expect(page).toHaveURL(/knowledge\/g1\.html#event-at-sugimotodera-kaicho$/);
  for(const route of ['g1','re10','pe1','ti1']){
    await page.goto('/kuranpo/knowledge/'+route+'.html');
    await expect(note).toBeVisible();
    await expect(note.locator('xpath=..').locator('.sname')).toHaveText('杉本寺');
    await expect(note.getByRole('link',{name:'杉本寺の公式案内'})).toHaveAttribute('href',/^https:\/\/sugimotodera\.com\//);
  }
  for(const day of ['05','06','12','13']){
    await freeze('2026-12-'+day+'T12:00:00');
    await page.goto(home);
    await expect(card.locator('[data-event-status]')).toHaveText('本日開催');
  }
  await freeze('2026-12-07T12:00:00');
  await page.reload();
  await expect(card.locator('[data-event-status]')).toHaveText('開催予定');
  await expect(card.locator('[data-event-day]:visible')).toHaveCount(2);
  await freeze('2026-12-14T00:00:00');
  await page.reload();
  await expect(card).toBeHidden();
  await page.goto('/kuranpo/knowledge/g1.html');
  await expect(note).toBeHidden();
});


test('C2: Chōjuji dates, walking loop time and temple history agree across the public paths', async ({page})=>{
  const freeze=d=>page.clock.setFixedTime(new Date(d+'+09:00'));
  await page.setViewportSize({width:320,height:820});
  await freeze('2026-12-07T12:00:00');
  await page.goto(home);
  const card=page.locator('#event-chojuji-autumn');
  await expect(card).toBeVisible();
  await expect(card).toContainText('12月7日まで');
  await card.getByRole('link').click();
  await expect(page).toHaveURL(/knowledge\/c2\.html#event-at-chojuji-autumn$/);
  const stop=page.locator('#event-at-chojuji-autumn');
  await expect(stop).toContainText(/10:00〜15:00.*雨天中止/);
  await expect(page.locator('.leg').last()).toContainText('徒歩約900m・約15分');
  await expect(page.locator('article .dist')).toContainText('約2.8km');
  await expect(page.locator('#c2 .story')).toContainText('古先印元');
  await expect(page.locator('#c2 .story')).not.toContainText('蘭渓道隆');
  await freeze('2026-12-08T00:00:00');
  await page.reload();
  await expect(stop).toBeHidden();
  await page.goto(home);
  await expect(card).toBeHidden();
  await expect(page.locator('li.route a[href="knowledge/c2.html"]')).toContainText('徒歩約2.8km');
  await page.goto('/kuranpo/history.html');
  await expect(page.locator('a.card-link[href="knowledge/c2.html"]')).toContainText('徒歩約2.8km');
  await page.goto('/kuranpo/knowledge/c1.html');
  await expect(page.locator('a.pg-next[href="c2.html"]')).toContainText('徒歩約2.8km');
});

test('瑞泉寺七百年 links the exhibit venue to both walks through the last JST day', async ({page})=>{
  const freeze=stamp=>page.clock.setFixedTime(new Date(stamp+'+09:00'));
  const card=page.locator('#event-zuisenji700');
  await page.setViewportSize({width:320,height:820});
  await freeze('2026-11-24T23:59:59');
  await page.goto(home);
  await expect(card).toBeHidden();
  await freeze('2026-11-25T00:00:00');
  await page.reload();
  await expect(card).toBeVisible();
  await expect(card).toContainText('鎌倉国宝館');
  expect(await card.getByRole('link').evaluate(el=>{
    const r=el.getBoundingClientRect();
    return r.left>=0&&r.right<=document.documentElement.clientWidth&&r.height>=44;
  })).toBe(true);
  await card.getByRole('link').click();
  await expect(page).toHaveURL(/knowledge\/g2\.html#event-at-zuisenji700$/);
  const notice=page.locator('#event-at-zuisenji700');
  await expect(notice).toBeVisible();
  await expect(notice.locator('xpath=..').locator('.sname')).toHaveText('鶴岡八幡宮');
  await expect(notice).toContainText('11月30日（月）休館');
  await expect(notice).toContainText('11月28日（土）10:30');
  await expect(notice.getByRole('link',{name:'展覧会の公式案内'})).toHaveAttribute('href','https://www.city.kamakura.kanagawa.jp/kokuhoukan/2026-zuisenji.html');
  await notice.getByRole('link',{name:'夢窓疎石の庭を歩く'}).click();
  const other=page.locator('#zuisenji700-separate-visit');
  await expect(other).toBeVisible();
  await expect(other).toContainText('会場は瑞泉寺ではありません');
  for(const [path,node] of [[home,card],['/kuranpo/knowledge/g2.html',notice],['/kuranpo/knowledge/pe11.html',other]]){
    await freeze('2026-12-06T23:59:59');
    await page.goto(path);
    await expect(node).toBeVisible();
    await freeze('2026-12-07T00:00:00');
    await page.reload();
    await expect(node).toBeHidden();
  }
});


test('Hasedera museum exhibition is a separate daytime visit and expires after December 6 JST', async ({page})=>{
  const freeze=stamp=>page.clock.setFixedTime(new Date(stamp+'+09:00'));
  const card=page.locator('#event-hasedera-kannon-pilgrimage');
  const notice=page.locator('#event-at-hasedera-kannon-pilgrimage');
  await page.setViewportSize({width:320,height:820});
  await freeze('2026-11-24T23:59:59');
  await page.goto(home);
  await expect(card).toBeHidden();
  await freeze('2026-11-25T00:00:00');
  await page.reload();
  await expect(card).toBeVisible();
  await expect(card.locator('[data-event-status]')).toHaveText('会期中');
  await expect(card).toContainText('12月6日まで');
  expect(await card.getByRole('link').evaluate(el=>{
    const {left,right,height}=el.getBoundingClientRect();
    return left>=0&&right<=document.documentElement.clientWidth&&height>=44;
  })).toBe(true);
  await card.getByRole('link').click();
  await expect(page).toHaveURL(/knowledge\/g11\.html#event-at-hasedera-kannon-pilgrimage$/);
  await expect(notice).toBeVisible();
  await expect(notice.locator('xpath=..').locator('.sname')).toHaveText('長谷寺');
  await expect(notice).toContainText('最終入館16:00');
  await expect(notice).toContainText('拝観料（大人400円・小学生200円）は別途');
  await expect(notice).toContainText('御朱印');
  await expect(notice.getByRole('link',{name:'展覧会の公式案内'})).toHaveAttribute('href','https://www.kannon-museum.jp/2026/07/2453/');
  for(const path of ['/kuranpo/knowledge/g11.html','/kuranpo/knowledge/re10.html',home]){
    const target=path===home?card:notice;
    await freeze('2026-12-06T23:59:59');
    await page.goto(path);
    await expect(target).toBeVisible();
    await freeze('2026-12-07T00:00:00');
    await page.reload();
    await expect(target).toBeHidden();
    await expect(page.locator(path===home?'#event-hasedera-kaicho':'#event-at-hasedera-kaicho')).toBeVisible();
  }
});

test('Tsurugaoka sacred treasures listing links to G2, shows closures and lasts through Jan 24 JST', async ({page})=>{
  const freeze=date=>page.clock.setFixedTime(new Date(date+'+09:00'));
  await page.setViewportSize({width:320,height:820});
  await freeze('2026-11-24T23:59:59');
  await page.goto(home);
  const card=page.locator('#event-koshinpo');
  await expect(card).toBeHidden();
  await freeze('2026-11-26T10:00:00');
  await page.reload();
  const link=card.getByRole('link',{name:'鶴岡八幡宮の古神宝展'});
  await expect(link).toBeVisible();
  const box=await link.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x+box.width).toBeLessThanOrEqual(320);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await link.click();
  await expect(page).toHaveURL(/knowledge\/g2\.html#event-at-koshinpo$/);
  const note=page.locator('#event-at-koshinpo');
  await expect(note).toContainText('11月26日（木）は展示替えのため休館');
  await expect(note).toContainText('12月28日（月）〜2027年1月5日（火）も休館');
  await expect(note).toContainText('鎌倉国宝館とは別の会場');
  await expect(note.getByRole('link',{name:'展覧会の公式案内'})).toHaveAttribute('href','https://tsurugaokamuseum.jp/tanoshimu/index.html');
  await freeze('2027-01-24T23:59:59');
  await page.reload();
  await expect(note).toBeVisible();
  await page.goto(home);
  await expect(card).toBeVisible();
  await freeze('2027-01-25T00:00:00');
  await page.reload();
  const section=page.locator('#local-events');
  await expect(card).toBeHidden();
  await expect(section.locator('article:visible h3')).toHaveText(['生誕800年 無住がみた鎌倉']);
  await page.goto('/kuranpo/knowledge/g2.html#event-at-koshinpo');
  await expect(note).toBeHidden();
});

test('Muju notice follows Amadera and expires after its own JST last day', async ({page})=>{
  const freeze=date=>page.clock.setFixedTime(new Date(date+'+09:00'));
  await page.setViewportSize({width:320,height:820});
  const muju=page.locator('#event-muju');
  const amadera=page.locator('#event-amadera');
  await freeze('2026-11-28T23:59:59');
  await page.goto(home);
  await expect(amadera).toBeVisible();
  await expect(muju).toBeHidden();
  await freeze('2026-11-29T00:00:00');
  await page.reload();
  await expect(amadera).toBeHidden();
  await expect(muju.locator('[data-event-status]')).toHaveText('開催予定');
  const link=muju.getByRole('link',{name:'生誕800年 無住がみた鎌倉'});
  const box=await link.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.x+box.width).toBeLessThanOrEqual(320);
  await link.click();
  await expect(page).toHaveURL(/knowledge\/ti2\.html#event-muju-kamakura$/);
  const note=page.locator('#event-muju-kamakura');
  await expect(note).toContainText('12月29日〜1月3日は休館');
  await expect(note).toContainText('会場は散策コースとは別');
  await freeze('2026-12-12T00:00:00');
  await page.goto(home);
  await expect(muju.locator('[data-event-status]')).toHaveText('会期中');
  await freeze('2027-02-27T23:59:59');
  await page.reload();
  await expect(muju).toBeVisible();
  await freeze('2027-02-28T00:00:00');
  await page.reload();
  await expect(muju).toBeHidden();
  await expect(page.locator('#local-events')).toBeHidden();
});

test('Reigenkaku is a dated Hase detour, not a course stop, and expires in JST', async ({page})=>{
  const freeze=date=>page.clock.setFixedTime(new Date(date+'+09:00'));
  await page.setViewportSize({width:320,height:820});
  const card=page.locator('#event-reigenkaku');
  const note=page.locator('#event-near-reigenkaku');
  await freeze('2026-11-27T23:59:59');
  await page.goto(home);
  await expect(card).toBeHidden();
  await freeze('2026-11-28T00:00:00');
  await page.reload();
  await expect(page.locator('#event-amadera')).toBeVisible();
  const link=card.getByRole('link',{name:/霊源閣 特別公開/});
  await expect(link).toBeVisible();
  const box=await link.boundingBox();
  expect(box.x+box.width).toBeLessThanOrEqual(320);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await link.click();
  await expect(page).toHaveURL(/knowledge\/g11\.html#event-near-reigenkaku$/);
  await expect(note).toBeVisible();
  await expect(note).toContainText('最終入館15:00');
  await expect(note.getByRole('link',{name:'主催者ガイド（PDF）'})).toHaveAttribute('href',/^https:/);
  await expect(page.locator('.spot-list')).not.toContainText('霊源閣');
  await freeze('2026-11-29T23:59:59');
  await page.reload();
  await expect(note).toBeVisible();
  await page.goto(home);
  await expect(card).toBeVisible();
  await expect(page.locator('#event-muju')).toBeVisible();
  await freeze('2026-11-30T00:00:00');
  await page.reload();
  await expect(card).toBeHidden();
  await page.goto('/kuranpo/knowledge/g11.html#event-near-reigenkaku');
  await expect(note).toBeHidden();
  await expect(page.locator('#event-at-hasedera')).toBeVisible();
});
