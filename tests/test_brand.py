from pathlib import Path
import unittest,hashlib,re,xml.etree.ElementTree as ET
R=Path(__file__).resolve().parents[1]
class Brand(unittest.TestCase):
 def test_all_headers(self):
  pages=list(R.glob('*.html'))+list((R/'knowledge').glob('*.html'));self.assertEqual(len(pages),78)
  for p in pages:
   s=p.read_text();self.assertEqual(s.count('class="brand-logo"'),1,p);self.assertEqual(s.count('assets/brand.css'),1,p);self.assertIn('alt="鎌・くらんぽ"',s);self.assertIn('鎌・くらんぽ',re.search(r'<title>(.*?)</title>',s)[1])
 def test_adopted_icon_assets(self):
  import json
  for p,h in json.loads((R/'notes/editorial/icon-hashes.json').read_text()).items():self.assertEqual(hashlib.sha256((R/p).read_bytes()).hexdigest(),h)
 def test_logo_outlines(self):
  x=ET.parse(R/'assets/kuranpo-logo.svg');self.assertEqual(len(x.findall('.//{http://www.w3.org/2000/svg}path')),5);self.assertEqual(len(x.findall('.//{http://www.w3.org/2000/svg}text')),0)

 def test_kura_size_pair(self):
  paths=ET.parse(R/'assets/kuranpo-logo.svg').findall('.//{http://www.w3.org/2000/svg}path')
  for p in paths[:2]:self.assertIn('scale(0.119,-0.119)',p.attrib['transform'])
  for p in paths[2:4]:self.assertIn('scale(0.1,-0.1)',p.attrib['transform'])

 def test_single_po_mark(self):
  x=ET.parse(R/'assets/kuranpo-logo.svg');c=x.find('.//{http://www.w3.org/2000/svg}g/{http://www.w3.org/2000/svg}circle');self.assertEqual(c.get('stroke-width'),'4.2');self.assertEqual(c.get('cx'),'368.117');self.assertEqual(c.get('fill'),'none')
