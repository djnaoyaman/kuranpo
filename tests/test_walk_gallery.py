import json,re,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class WalkGallery(unittest.TestCase):
 def test_photos_are_existing_and_credited(self):
  data=json.loads((ROOT/'assets/walk-photos.json').read_text())
  files={'knowledge/'+p.name for p in (ROOT/'knowledge').glob('*.html')}
  self.assertEqual(set(data),files);self.assertEqual(len(data),67)
  for path,photo in data.items():
   s=(ROOT/path).read_text();m=re.search(r'<figure class="plate">(.*?)</figure>',s,re.S)
   if photo is None:self.assertIsNone(m,path);continue
   self.assertIsNotNone(m,path);self.assertIn('../'+photo['src'],m[1]);self.assertIn(photo['credit'],m[1]);self.assertTrue((ROOT/photo['src']).is_file(),path)
 def test_original_routes_supply_all_cards(self):
  s=(ROOT/'index.html').read_text();routes=re.findall(r'<li class="route"[^>]*><a href="(knowledge/[^\"]+)"',s)
  self.assertEqual(len(routes),67);self.assertEqual(set(routes),set(json.loads((ROOT/'assets/walk-photos.json').read_text())))
 def test_home_only_integration(self):
  for p in (ROOT/'knowledge').glob('*.html'):self.assertNotIn('assets/walk-gallery',p.read_text())
  self.assertEqual((ROOT/'index.html').read_text().count('src="assets/walk-gallery.js"'),1)
