import importlib.util,tempfile,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location("sitemap",Path(__file__).resolve().parents[1]/"scripts/generate_sitemap.py")
sitemap=importlib.util.module_from_spec(spec);spec.loader.exec_module(sitemap)
class SitemapTests(unittest.TestCase):
 def test_public_routes_retained_test_artifacts_excluded(self):
  old=sitemap.ROOT
  try:
   with tempfile.TemporaryDirectory() as root:
    sitemap.ROOT=root
    for name in ["index.html","404.html","photos.html","knowledge/c1.html","tests/fixtures/selected-b/index.html","test-results/report.html","playwright-report/index.html"]:
     p=Path(root)/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text("<!doctype html>")
    self.assertEqual(sitemap.find_html_files(),["index.html","knowledge/c1.html","photos.html"])
  finally:sitemap.ROOT=old
 def test_actual_public_route_set(self):
  root=Path(sitemap.ROOT)
  expected=sorted([p.name for p in root.glob("*.html") if p.name!="404.html"]+["knowledge/"+p.name for p in (root/"knowledge").glob("*.html")])
  self.assertEqual(len(expected),77)
  self.assertEqual(sitemap.find_html_files(),expected)
if __name__=="__main__":unittest.main()
