from pathlib import Path
from html.parser import HTMLParser
import subprocess,os,re,json,hashlib
ROOT=Path(__file__).resolve().parents[1];BASE=os.environ.get('BASE_REF','65fd428ac08878258ee3bcbbdd1d7b5ec225978a')
def normalize_update_dates(s):
 s=re.sub(r'(最終更新</dt><dd>)[^<]+',r'\1@UPDATE_DATE@',s)
 s=re.sub(r'(最終更新：)\d{4}年\d+月\d+日',r'\1@UPDATE_DATE@',s)
 return re.sub(r'("dateModified"\s*:\s*")[^"]+',r'\1@UPDATE_DATE@',s)
# Each authorized editorial replacement is reversible, scoped and source-linked.
EDITS=json.loads((ROOT/'notes/editorial/edits.json').read_text())
EDITS+=json.loads((ROOT/'notes/editorial/profile-footer-edits.json').read_text())
EDITS+=json.loads((ROOT/'notes/editorial/po-brand-edits.json').read_text())
EDITS+=json.loads((ROOT/'notes/editorial/access-corrections.json').read_text())
EDITS+=json.loads((ROOT/'notes/editorial/route-corrections.json').read_text())
EDITS+=json.loads((ROOT/'notes/editorial/course-inventory-corrections.json').read_text())
EDITS+=json.loads((ROOT/'notes/editorial/sharing-metadata.json').read_text())
def before_editorial(path,s):
 # Ledgers were recorded against the 2026-10-31 release-date rendering.
 # Date content is checked separately by the date contract; stabilize its
 # length before replaying positional edits, without touching historical dates.
 s=re.sub(r'("dateModified"\s*:\s*")[^"]+',r'\g<1>2026-10-31',s)
 s=re.sub(r'(最終更新</dt><dd>)[^<]+',r'\g<1>2026年10月31日',s)
 s=re.sub(r'(最終更新：)\d{4}年\d+月\d+日',r'\g<1>2026年10月31日',s)
 for e in reversed(EDITS):
  if e['path']!=path:continue
  assert e['sources'] and e['reason'], 'Unexplained editorial change: '+path
  assert len(e['before_offsets'])==e['occurrences'], 'Editorial scope count: '+path
  before=e.get('before')
  if before is None:
   source=subprocess.check_output(['git','show',e['before_ref']+':'+path],cwd=ROOT,text=True)
   before=source[e['before_source_start']:e['before_source_start']+e['before_length']]
   assert hashlib.sha256(before.encode()).hexdigest()==e['before_sha256'], 'Historical reference mismatch: '+path
  delta=len(e['after'])-len(before)
  for i,pos in reversed(list(enumerate(e['before_offsets']))):
   start=pos+i*delta; end=start+len(e['after'])
   assert s[start:end]==e['after'], 'Editorial ledger position mismatch: '+path
   s=s[:start]+before+s[end:]
 return s
class Audit(HTMLParser):
 def __init__(self,s):super().__init__(convert_charrefs=True);self.tokens=[];self.skip=0;self.feed(normalize_update_dates(s))
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='script' and ('data-theme-bootstrap'in a or a.get('src','').endswith('assets/monochrome.js')):self.skip=1;return
  if t=='link' and a.get('href','').endswith('assets/monochrome.css'):return
  if self.skip:return
  if t=='body':a.pop('data-page',None)
  self.tokens.append(('open',t,tuple(sorted(a.items()))))
 def handle_endtag(self,t):
  if self.skip:
   if t=='script':self.skip=0
   return
  self.tokens.append(('close',t))
 def handle_data(self,s):
  if not self.skip and s.strip():self.tokens.append(('text',s.strip()))
files=sorted(ROOT.glob('*.html'))+sorted((ROOT/'knowledge').glob('*.html'));assert len(files)==78
for f in files:
 old=subprocess.check_output(['git','show',BASE+':'+str(f.relative_to(ROOT))],cwd=ROOT,text=True);new=f.read_text()
 assert Audit(old).tokens==Audit(before_editorial(str(f.relative_to(ROOT)),new)).tokens,f
 assert new.count('assets/monochrome.css')==new.count('assets/monochrome.js')==1
print('PASS: all 78 pages exact original parsed markup, content, scripts, metadata, links and image references, excluding only theme integration, explicitly managed update dates and source-linked reversible editorial ledger entries; datePublished and historical entries unchanged.')
