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
 def test_moss_stairs_access(self):
  s=(ROOT/'knowledge/c4.html').read_text()
  self.assertNotIn('苔むした石段の一段一段は、実際に上って',s)
  self.assertIn('苔の石段は、保護のため通行できません',s)
  self.assertIn('苔の石段は通行不可。脇の迂回路',s)
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

class RouteStatus(unittest.TestCase):
 def test_pending_routes_have_no_actionable_distances(self):
  for key in ['c6','c7']:
   s=(ROOT/f'knowledge/{key}.html').read_text();spots=re.search(r'<ul class="spot-list">.*?</ul>',s,re.S)[0]
   self.assertNotRegex(spots,r'徒歩\d|約\d+分');self.assertIn('経路・距離を再確認中',s);self.assertNotIn('観光ガイド記事の実測値',s)
   for label in re.findall(r'<span class="leg">(.*?)</span>',spots):self.assertEqual(label,'区間距離・所要時間は再確認中')
 def test_removed_stops_and_maps(self):
  for key,names in [('c6',['熊野新宮']),('c7',['五所神社','巽神社','第六天社'])]:
   s=(ROOT/f'knowledge/{key}.html').read_text();spots=re.search(r'<ul class="spot-list">.*?</ul>',s,re.S)[0]
   for name in names:self.assertNotIn(name,spots)
   self.assertNotIn('/maps/dir/',s)
  s=(ROOT/'knowledge/c7.html').read_text();self.assertIn('通常非公開',s);self.assertIn('立ち入らず',s)
 def test_cards_do_not_promise_durations(self):
  s=(ROOT/'index.html').read_text()
  for key in ['c6','c7']:
   card=re.search(r'<li class="route"[^>]*><a href="knowledge/'+key+r'.html">.*?</li>',s,re.S)[0]
   self.assertIn('data-dur="unknown"',card);self.assertNotIn('徒歩約',card);self.assertIn('所要時間を再確認中',card)

class KosokujiSource(unittest.TestCase):
 def test_confirmed_designation_not_disputed_age(self):
  s=(ROOT/'knowledge/c7.html').read_text()
  self.assertIn('光則寺の海棠（カイドウ）は、鎌倉市指定の天然記念物です。',s)
  self.assertNotIn('樹齢200年以上',s)
  self.assertNotIn('樹齢約150年',s)
  self.assertIn('経路・距離を再確認中',s)
  self.assertIn('通常非公開',s)
  ledger=json.loads((ROOT/'notes/editorial/c7-kaido-source-20261102.json').read_text())
  self.assertEqual({e['path'] for e in ledger},{'knowledge/c7.html','changelog.html'})
  self.assertTrue(all(len(e['sources'])==2 for e in ledger))

class C6VisitSources(unittest.TestCase):
 def test_stop_name_and_reading_consistent(self):
  s=(ROOT/'knowledge/c6.html').read_text()
  self.assertIn('出発地点：大塔宮（鎌倉宮）バス停',s)
  self.assertIn('じゅうにそじんじゃ',s);self.assertNotIn('じゅうにそうじんじゃ',s)
  for file in ['index.html','history.html','knowledge/c5.html']:
   a=re.findall(r'<a\b[^>]*href="(?:knowledge/)?c6.html".*?</a>',(ROOT/file).read_text(),re.S)
   self.assertEqual(len(a),1);self.assertIn('大塔宮（',a[0]);self.assertNotIn('じゅうにそうじんじゃ',a[0]);self.assertIn('再確認中',a[0])
 def test_admission_caveats_are_dated_and_narrow(self):
  s=(ROOT/'knowledge/c6.html').read_text()
  for t in ['2025年7月22日付案内','完全予約制・雨天休止','最新の拝観条件','本尊は','通常非公開','公開日・予約条件']:self.assertIn(t,s)
  for u in ['https://www.trip-kamakura.com/helpful/pamphlet/img/data/jisyahaikanryou20250722.pdf','https://www.trip-kamakura.com/facility/detail.php?id=21','https://kousokuji.com/access/']:self.assertIn(u,s)
  self.assertNotIn('本尊拝観は要予約。',s);self.assertNotIn('2026年6月13日',s)
 def test_source_ledger_and_release_note(self):
  d=json.loads((ROOT/'notes/editorial/c6-visit-sources-20261102.json').read_text());self.assertEqual(d['checkedDate'],'2026-11-02');self.assertTrue(d['limitations'])
  for e in d['changes']:self.assertTrue(e['sources']);self.assertEqual(e['occurrences'],len(e['before_offsets']));self.assertNotEqual(e['path'],'knowledge/c7.html')
  self.assertIn('C6の出発停留所名を大塔宮（鎌倉宮）',(ROOT/'changelog.html').read_text())

from test_c7_season import C7Season
