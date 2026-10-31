"""Targeted factual/structural regressions; not proof of all historical claims."""
import unittest,json,re,subprocess,hashlib,struct
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE='e68acbf5b5767ff9218813edd66b47f7d1228b87'
def old(p):return subprocess.check_output(['git','show',BASE+':'+p],cwd=ROOT,text=True)
def quizzes(s):
 m=re.search(r'const CHAPTERS = (.*?);\n',s)
 if m:
  d=json.loads(m[1]);return {(k,c['id']):c['q'] for k,cs in d.items() for c in cs}
 return {m[1]:json.loads(m[2]) for m in re.finditer(r'initMiniDrill\("([^"]+)", (\[.*?\])\);',s)}
class Editorial(unittest.TestCase):
 def test_quizzes(self):
  total=0
  for p in [ROOT/'quiz.html',*(ROOT/'knowledge').glob('*.html')]:
   rel=p.relative_to(ROOT).as_posix();new=quizzes(p.read_text());before=quizzes(old(rel));self.assertEqual(new.keys(),before.keys(),rel)
   for key,qs in new.items():
    self.assertEqual(len(qs),len(before[key]),(rel,key));total+=len(qs)
    for q in qs:
     self.assertEqual(len(q['choices']),4);self.assertEqual(len(set(q['choices'])),4);self.assertIn(q['answer'],range(4));self.assertTrue(q['q'] and q['note'])
  self.assertEqual(total,254)
 def test_genealogy(self):
  s=(ROOT/'persons.html').read_text()
  for edge in ['政子の甥（弟・義時の子）','泰時の孫（時氏の子）','貞時の子']:self.assertIn(edge,s)
  self.assertNotIn('1336年に征夷大将軍',s)
 def test_icons(self):
  for p,h in json.loads((ROOT/'notes/editorial/icon-hashes.json').read_text()).items():self.assertEqual(hashlib.sha256((ROOT/p).read_bytes()).hexdigest(),h,p)
  for p in [*ROOT.glob('*.html'),*(ROOT/'knowledge').glob('*.html')]:
   links=lambda s:[t for t in re.findall(r'<link\b[^>]+>',s) if re.search(r'rel="(?:icon|shortcut icon|apple-touch-icon)"',t)]
   tags=links(p.read_text());self.assertEqual(len(tags),6)
   for tag in tags:
    href=re.search(r'href="([^"]+)"',tag)[1].split('?')[0];self.assertTrue((p.parent/href).is_file(),str(p))
 def test_sharing_cards(self):
  for key,card in json.loads((ROOT/'notes/editorial/ogp-corrections.json').read_text()).items():
   b=(ROOT/'ogp'/f'{key}.png').read_bytes();self.assertEqual(b[:8],b'\x89PNG\r\n\x1a\n');self.assertEqual(struct.unpack('>II',b[16:24]),(1200,630))
   p=ROOT/(f'{key}.html' if (ROOT/f'{key}.html').exists() else f'knowledge/{key}.html');self.assertIn(f"ogp/{key}.png?v={card.get('version','20261031-kura119')}",p.read_text())
 def test_ledger_sources(self):
  for e in json.loads((ROOT/'notes/editorial/edits.json').read_text()):self.assertTrue(e['sources']);self.assertEqual(len(e['before_offsets']),e['occurrences'])
if __name__=='__main__':unittest.main()
