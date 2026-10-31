#!/usr/bin/env python3
"""Explicit release dates, not build dates. Run --date YYYY-MM-DD --all or --paths ... ."""
from pathlib import Path
import argparse,datetime,hashlib,json,re
ROOT=Path(__file__).resolve().parents[1]
MANIFEST=ROOT/'page-updates.json'
def pages():return sorted([p.relative_to(ROOT).as_posix() for p in ROOT.glob('*.html')]+[p.relative_to(ROOT).as_posix() for p in (ROOT/'knowledge').glob('*.html')])
def normalize(s):
 s=re.sub(r'(最終更新</dt><dd>)[^<]+',r'\1@UPDATE_DATE@',s)
 s=re.sub(r'(最終更新：)\d{4}年\d+月\d+日',r'\1@UPDATE_DATE@',s)
 return re.sub(r'("dateModified"\s*:\s*")[^"]+',r'\1@UPDATE_DATE@',s)
def fingerprint(path):
 h=hashlib.sha256(normalize((ROOT/path).read_text()).encode())
 for shared in ['assets/monochrome.css','assets/monochrome.js']:
  h.update(shared.encode());h.update((ROOT/shared).read_bytes())
 return h.hexdigest()
def stamp(path,date):
 d=datetime.date.fromisoformat(date);label=f'{d.year}年{d.month}月{d.day}日';p=ROOT/path;s=p.read_text()
 s=re.sub(r'(最終更新</dt><dd>)[^<]+',lambda m:m[1]+label,s)
 s=re.sub(r'(最終更新：)\d{4}年\d+月\d+日',lambda m:m[1]+label,s)
 s=re.sub(r'("dateModified"\s*:\s*")[^"]+',lambda m:m[1]+date,s);p.write_text(s)
def check():
 data=json.loads(MANIFEST.read_text())['pages'];assert set(data)==set(pages()),'Update manifest route set'
 for path,entry in data.items():
  s=(ROOT/path).read_text();d=datetime.date.fromisoformat(entry['modified']);label=f'{d.year}年{d.month}月{d.day}日'
  assert re.findall(r'最終更新</dt><dd>([^<]+)',s)==[label],path+' visible date mismatch'
  assert all(v==label for v in re.findall(r'最終更新：(\d{4}年\d+月\d+日)',s)),path+' secondary date mismatch'
  assert all(v==entry['modified'] for v in re.findall(r'"dateModified"\s*:\s*"([^"]+)"',s)),path+' JSON-LD date mismatch'
  assert fingerprint(path)==entry['source_sha256'],path+' changed: stamp its real release date before publication'
 print('PASS: 78 page dates, existing JSON-LD and source fingerprints agree')
def main():
 a=argparse.ArgumentParser(description=__doc__);a.add_argument('--check',action='store_true');a.add_argument('--date');g=a.add_mutually_exclusive_group();g.add_argument('--all',action='store_true');g.add_argument('--paths',nargs='+');args=a.parse_args()
 if args.check:return check()
 if not args.date or not (args.all or args.paths):a.error('Explicit --date and --all / --paths required; dates never advance merely on build')
 datetime.date.fromisoformat(args.date)
 data=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {'schema':1,'pages':{}}
 for path in (pages() if args.all else args.paths):
  if path not in pages():a.error('Not a public page: '+path)
  stamp(path,args.date);data['pages'][path]={'modified':args.date,'source_sha256':fingerprint(path)}
 MANIFEST.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');check()
if __name__=='__main__':main()
