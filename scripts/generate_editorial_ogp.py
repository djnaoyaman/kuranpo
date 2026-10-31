#!/usr/bin/env python3
"""Generate code-native monochrome sharing cards; existing icons are never inputs/outputs."""
from pathlib import Path
import json,html,subprocess
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'notes/editorial/ogp-corrections.json'
def text(x,y,s,size=24,weight=400):
 return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}">{html.escape(s)}</text>'
def main():
 out=ROOT/'ogp/source';out.mkdir(exist_ok=True)
 for key,d in json.loads(DATA.read_text()).items():
  pieces=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#fff"/><g fill="#111" font-family="Noto Sans CJK JP, sans-serif">',text(56,64,'鎌・くらんぽ',34,700),text(480,62,d['category'],22),'<path d="M444 0V630 M0 106H1200 M0 550H1200" fill="none" stroke="#111" stroke-width="1"/>']
  for y in [106,550]:pieces.append(f'<rect x="440" y="{y-4}" width="8" height="8"/>')
  for i,line in enumerate(['鎌倉を','歩く。','読む、','確かめる。']):pieces.append(text(56+(0 if i%2==0 else 36),215+i*77,line,54,900))
  for i,line in enumerate(d['title']):pieces.append(text(480,230+i*86,line,64,900))
  for i,line in enumerate(d['summary']):pieces.append(text(484,438+i*39,line,28))
  pieces += [text(56,597,'KAMAKURA + SANPO',21),text(480,597,'歩く前に、歴史の要点を。',24),'</g></svg>']
  svg=out/f'{key}.svg';svg.write_text(''.join(pieces))
  subprocess.run(['inkscape',str(svg),'--export-type=png',f'--export-filename={ROOT/"ogp"/(key+".png")}'],check=True,stdout=subprocess.DEVNULL)
if __name__=='__main__':main()
