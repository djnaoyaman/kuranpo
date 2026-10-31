"""Counts describe published pages, not verified walking routes."""
import json,re,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class CourseInventory(unittest.TestCase):
 def test_top_inventory_matches_files(self):
  s=(ROOT/'index.html').read_text();files={p.name for p in (ROOT/'knowledge').glob('*.html')}
  links=set(re.findall(r'knowledge/([a-z]+\d+\.html)',s));self.assertEqual(links,files);self.assertEqual(len(files),67)
  data=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S)]
  listing=next(x for x in data if x.get('@type')=='ItemList')
  self.assertEqual(listing['numberOfItems'],len(files));self.assertEqual({x['url'].split('/')[-1] for x in listing['itemListElement']},files)
  self.assertNotIn('全30コース',s)
 def test_history_is_explicit_subset(self):
  s=(ROOT/'history.html').read_text();links=set(re.findall(r'knowledge/([a-z]+\d+\.html)',s))
  self.assertEqual(links,{f'g{i}.html' for i in range(1,15)}|{f'c{i}.html' for i in range(1,17)})
  self.assertIn('エリア別14コースとコンプリート版16コース',s)
  for name in ['history.html','llms.txt','llms-full.txt']:self.assertNotIn('全30コース',(ROOT/name).read_text())
