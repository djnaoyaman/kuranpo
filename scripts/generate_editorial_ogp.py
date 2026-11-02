#!/usr/bin/env python3
"""Render restrained, article-first monochrome OGP. Icons are never changed."""
from pathlib import Path
import json,html,subprocess,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'notes/editorial/ogp-corrections.json'
def text(x,y,s,size=24,weight=400,spacing=0,anchor='start'):
 return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}" text-anchor="{anchor}">{html.escape(s)}</text>'
def logo():
 s=(ROOT/'assets/kuranpo-logo.svg').read_text()
 scale=190/float(ET.fromstring(s).get('width'))
 s=s[s.index('>')+1:s.rindex('</svg>')]
 return f'<g transform="translate(930,22) scale({scale})">'+s+'</g>'
def main():
 out=ROOT/'ogp/source';out.mkdir(exist_ok=True)
 for key,d in json.loads(DATA.read_text()).items():
  pieces=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#fafaf8"/><g fill="#111" font-family="Noto Sans CJK JP, sans-serif">',text(80,68,'KAMAKURA / WALKING NOTES',19,400,2.6),logo(),'<path d="M80 145H111" stroke="#111" stroke-width="3"/>',text(130,153,d['category'],21,400,2)]
  for i,line in enumerate(d['title']):pieces.append(text(75,270+i*108,line,89,900,-3))
  for i,line in enumerate(d['summary']):pieces.append(text(80,454+i*42,line,28,400,1))
  pieces += ['<path d="M80 550H1120" stroke="#111" stroke-width="1"/>',text(80,594,key.upper(),18,400,2),text(1120,594,'鎌倉を歩く、歴史を読む。',20,400,1,'end'),'</g></svg>']
  svg=out/f'{key}.svg';svg.write_text(''.join(pieces))
  subprocess.run(['inkscape',str(svg),'--export-type=png',f'--export-filename={ROOT/"ogp"/(key+".png")}'],check=True,stdout=subprocess.DEVNULL)
if __name__=='__main__':main()
