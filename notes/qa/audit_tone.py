# 文体の監査（丁寧語でない本文の文を探す）：python3 audit_tone.py
from playwright.sync_api import sync_playwright
import glob, json, re, sys
import os, glob, sys, json
ROOT = os.environ.get("SITE_ROOT", os.getcwd())          # サイトのフォルダ（index.htmlのある場所）
pages = sorted(os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True))
BASE = "file://" + ROOT.rstrip("/") + "/"
from collections import defaultdict
JS=r"""()=>{
 const EX='.card,.ch,article.course,.spot-list,.meta-row,nav,.drawer,footer,.kicker,.tag,.qc-label,.ft-tag,.sc-when,.dl-course,.md-choice,.quiz-choice,.co-list,.g-wrong,.back,.crumb,.editor-mark-section,.share-buttons,.maplinks,.lens-tags,h1,h2,h3,h4,dt,script,style,noscript,svg,button';
 const out=[]; const seen=new Set();
 document.querySelectorAll('p,dd,li,div,span').forEach(el=>{
   if(el.closest(EX)) return;
   const own=[...el.childNodes].some(n=>n.nodeType===3 && n.textContent.trim().length>1); if(!own) return;
   if(seen.has(el)) return; seen.add(el);
   const c=el.cloneNode(true); c.querySelectorAll('rt').forEach(r=>r.remove());
   const t=c.textContent.replace(/\s+/g,'');
   t.split(/(?<=[。！？])/).forEach(s=>{ if(s.length>=8) out.push([el.className||el.tagName.toLowerCase(), s]); });
 });
 return out;}"""
PLAIN=re.compile(r'(る|た|だ|ない|い|う|く|す|つ|む|ぶ|ぐ|ず|である|だった|ている|ていた|てある|ておく|ほしい)[」』）)]*[。！]$')
POLITE=re.compile(r'(です|ます|ました|でした|ません|ください|ましょう|でしょう|ませんか|ございます)[」』）)]*[。！？]$')
res=defaultdict(list)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1200,"height":900})
    for path in pages:
        pg.goto(BASE+path); pg.wait_for_timeout(250)
        for cls,s in pg.evaluate(JS):
            if PLAIN.search(s) and not POLITE.search(s): res[s].append((path,cls))
    b.close()
json.dump({k:v for k,v in res.items()}, open('audit_tone_result.json','w'), ensure_ascii=False)
bypage=defaultdict(int)
for s,v in res.items():
    for path,_ in v: bypage[path.split('/')[0] if '/' in path else path]+=1
print("である調の文（種類）:", len(res), "/ 出現:", sum(len(v) for v in res.values()))
print("ページ別の出現:", dict(sorted(bypage.items(), key=lambda x:-x[1])))
