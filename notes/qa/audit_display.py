# 表示の監査：python3 audit_display.py 360 390 768 1280（画面幅を並べる）
import json, glob, sys
import os, glob, sys, json
ROOT = os.environ.get("SITE_ROOT", os.getcwd())          # サイトのフォルダ（index.htmlのある場所）
pages = sorted(os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True))
BASE = "file://" + ROOT.rstrip("/") + "/"
from playwright.sync_api import sync_playwright

AUDIT_JS = r"""
() => {
  const vw = window.innerWidth;
  const res = {overflow: document.documentElement.scrollWidth - vw, narrow: [], tiny: [], low: [], clipped: []};
  const rgb = s => { const m = s && s.match(/rgba?\(([^)]+)\)/); return m ? m[1].split(',').map(x=>parseFloat(x)) : null; };
  const lum = c => { const a = c.slice(0,3).map(v=>{v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4)}); return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]; };
  const bgOf = el => { while(el){ const c = rgb(getComputedStyle(el).backgroundColor); if(c && (c.length<4 || c[3]>0.5)) return c; el = el.parentElement;} return [244,241,234]; };
  const inScroller = el => { let p = el.parentElement; while(p){ const o = getComputedStyle(p).overflowX; if(o==='auto'||o==='scroll'||o==='hidden') return true; p = p.parentElement;} return false; };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set(); let n;
  while(n = w.nextNode()){
    const t = n.textContent.replace(/\s+/g,'').trim(); if(!t) continue;
    const el = n.parentElement; if(!el || seen.has(el)) continue; seen.add(el);
    if(el.closest('script,style,noscript,.drawer')) continue;
    const cs = getComputedStyle(el);
    if(cs.visibility==='hidden') continue;
    const r = el.getBoundingClientRect(); if(r.width===0 || r.height===0) continue;
    const fs = parseFloat(cs.fontSize);
    if(t.length>=5 && r.width < 2.2*fs && r.height > 3*fs) res.narrow.push(t.slice(0,18));
    const eff = (el instanceof SVGElement) ? r.height*0.8 : fs;
    if(eff < 10.5 && !el.closest('rt')) res.tiny.push(t.slice(0,14)+'@'+(Math.round(eff*10)/10));
    const fg = rgb(cs.color), bg = bgOf(el);
    if(fg && bg){ const L1=lum(fg), L2=lum(bg); const cr=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
      const large = fs>=24 || (fs>=18.66 && parseInt(cs.fontWeight)>=700);
      if(cr < (large?3:4.5)) res.low.push(t.slice(0,12)+' '+(Math.round(cr*100)/100)+' '+cs.color); }
    if(r.right > vw+1 && !inScroller(el)) res.clipped.push(t.slice(0,18)+'@'+Math.round(r.right));
  }
  return res;
}
"""
widths = [int(x) for x in sys.argv[1:]] or [360, 1200]
out = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for wdt in widths:
        pg = b.new_page(viewport={"width": wdt, "height": 900})
        for path in pages:
            try:
                pg.goto(BASE+path, wait_until="domcontentloaded", timeout=30000)
                pg.wait_for_timeout(250)
                pg.add_style_tag(content="*{animation:none!important;transition:none!important} .card,.ch,.reveal-line{opacity:1!important;transform:none!important}")
                pg.wait_for_timeout(50)
                out[f"{wdt}:{path}"] = pg.evaluate(AUDIT_JS)
            except Exception as e:
                out[f"{wdt}:{path}"] = {"error": str(e)}
        pg.close()
    b.close()
json.dump(out, open('audit_display_result.json','w'), ensure_ascii=False)
