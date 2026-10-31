import importlib.util,json,unittest,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("dates",ROOT/"scripts/update_page_dates.py")
dates=importlib.util.module_from_spec(spec);spec.loader.exec_module(dates)
class DatesTests(unittest.TestCase):
 def test_manifest_and_visible_metadata_dates(self):dates.check()
 def test_sitemap_dates(self):
  manifest=json.loads((ROOT/"page-updates.json").read_text())["pages"]
  tree=ET.parse(ROOT/"sitemap.xml");ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
  for url in tree.findall("s:url",ns):
   path=url.find("s:loc",ns).text.removeprefix("https://djnaoyaman.github.io/kuranpo/") or "index.html"
   self.assertEqual(url.find("s:lastmod",ns).text,manifest[path]["modified"])
 def test_normalization_preserves_publication_history(self):
  old='"datePublished": "2026-09-24", "dateModified": "2026-09-25"; 2026年9月25日の記録'
  normalized=dates.normalize(old)
  self.assertIn('"datePublished": "2026-09-24"',normalized)
  self.assertIn('2026年9月25日の記録',normalized)
if __name__=="__main__":unittest.main()
