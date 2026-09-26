# デザインの決まりの監査：python3 audit_design.py（PALに配色を登録してから使う）
from playwright.sync_api import sync_playwright
import glob, json, re
import os, glob, sys, json
ROOT = os.environ.get("SITE_ROOT", os.getcwd())          # サイトのフォルダ（index.htmlのある場所）
pages = sorted(os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True))
BASE = "file://" + ROOT.rstrip("/") + "/"
from collections import defaultdict
JS=r"""()=>{
 const PAL=new Set(['244,241,234','251,249,244','38,34,32','107,96,88','220,213,196','168,64,46','238,220,207','110,109,28','46,74,99','184,147,90','134,101,47','238,240,220','63,56,51','234,228,216','42,37,33','189,179,166','224,138,112','211,202,184']);
 const rgb=s=>{const m=s&&s.match(/rgba?\(([^)]+)\)/); if(!m) return null; const p=m[1].split(',').map(x=>parseFloat(x)); return p;};
 const key=p=>p.slice(0,3).map(Math.round).join(',');
 const EMO=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
 const out=[]; const add=(el,kind,val)=>{ const t=(el.textContent||'').replace(/\s+/g,'').slice(0,14);
   const k=el.tagName.toLowerCase()+(typeof el.className==='string'&&el.className?'.'+el.className.trim().split(/\s+/)[0]:''); out.push([k,kind,val,t]); };
 document.querySelectorAll('body *').forEach(el=>{
   if(el.closest('.drawer,svg,script,style,noscript,.back-to-top,#footprintTrail,.footprint')) return;
   const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') return;
   const r=el.getBoundingClientRect(); if(r.width===0||r.height===0) return;
   const own=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
   if(own && /IBM Plex Mono/.test(cs.fontFamily.split(',')[0])) add(el,'等幅フォント',cs.fontFamily.split(',')[0]);
   const bg=rgb(cs.backgroundColor); if(bg && (bg.length<4||bg[3]>0.05) && !PAL.has(key(bg))) add(el,'配色外の背景',key(bg)+(bg.length>3?' a'+bg[3]:''));
   if(own){ const c=rgb(cs.color); if(c && !PAL.has(key(c))) add(el,'配色外の文字色',key(c)); }
   for(const s of ['Top','Right','Bottom','Left']){ const st=cs['border'+s+'Style']; if(st==='dashed'||st==='dotted') { add(el,'破線・点線',s+':'+st); break; } }
   const br=parseFloat(cs.borderTopLeftRadius)||0; if(br>0.5){ const circle=Math.abs(r.width-r.height)<2 && br>=r.width/2-1; if(!circle) add(el,'角丸',br+'px'); }
   if(cs.boxShadow && cs.boxShadow!=='none') add(el,'影',cs.boxShadow.slice(0,24));
   if(own && cs.textTransform==='uppercase') add(el,'大文字化','uppercase');
   if(own && parseFloat(cs.letterSpacing)/parseFloat(cs.fontSize)>0.11) add(el,'字間が広すぎ',(parseFloat(cs.letterSpacing)/parseFloat(cs.fontSize)).toFixed(2)+'em');
   for(const pe of ['::before','::after']){ const ct=getComputedStyle(el,pe).content; if(ct && ct!=='none' && EMO.test(ct)) add(el,'絵文字の装飾',pe+' '+ct); }
   if(own && EMO.test([...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(''))) add(el,'絵文字の装飾','本文');
 });
 return out;}"""
res=defaultdict(lambda: {'pages':set(),'sample':''})
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":390,"height":844})
    def scan(label):
        for k,kind,val,t in pg.evaluate(JS):
            d=res[(kind,k,val)]; d['pages'].add(label); d['sample']=d['sample'] or t
    for path in pages:
        try:
            pg.goto(BASE+path, wait_until="domcontentloaded", timeout=30000)
            pg.wait_for_timeout(200)
            pg.add_style_tag(content="*{animation:none!important;transition:none!important} .card,.ch,.reveal-line{opacity:1!important;transform:none!important}")
            scan(path)
        except Exception as e:
            print(f"  × スキップ: {path} ({e})")
    b.close()
out=[(kind,k,val,len(d['pages']),sorted(d['pages'])[0],d['sample']) for (kind,k,val),d in res.items()]
json.dump(out, open('audit_design_result.json','w'), ensure_ascii=False)
for kind in ['等幅フォント','配色外の背景','配色外の文字色','破線・点線','角丸','影','大文字化','字間が広すぎ','絵文字の装飾']:
    rows=sorted([o for o in out if o[0]==kind], key=lambda x:-x[3])
    print(f"■ {kind}：{len(rows)}種類")
    for _,k,val,n,ex,t in rows[:18]: print(f"   [{n:2d}] {k:24s} {val:22s} 例:{ex:22s} 「{t}」")
