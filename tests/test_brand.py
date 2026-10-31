from pathlib import Path
import unittest,hashlib,re,xml.etree.ElementTree as ET
R=Path(__file__).resolve().parents[1]
class Brand(unittest.TestCase):
 def test_all_headers(self):
  pages=list(R.glob('*.html'))+list((R/'knowledge').glob('*.html'));self.assertEqual(len(pages),78)
  for p in pages:
   s=p.read_text();self.assertEqual(s.count('class="brand-logo"'),1,p);self.assertEqual(s.count('assets/brand.css'),1,p);self.assertIn('alt="鎌・くらんぽ"',s);self.assertIn('鎌・くらんぽ',re.search(r'<title>(.*?)</title>',s)[1])
 def test_icons_unchanged(self):
  for p,h in {'favicon.ico':'7a5624144c8f73758d0b9f81b3aa035863abda2834874fb00099f08515751439','favicon-32x32.png':'9d69fa0718b0181f59e3ba0bee783b6c6d0f1191a0eddf869da994b71350abad','apple-touch-icon.png':'f75181033a3d3522bf473bb2ad4ad907963d6289242a23b0a6b69ce33f03442c'}.items():self.assertEqual(hashlib.sha256((R/p).read_bytes()).hexdigest(),h)
 def test_logo_outlines(self):
  x=ET.parse(R/'assets/kuranpo-logo.svg');self.assertEqual(len(x.findall('.//{http://www.w3.org/2000/svg}path')),5);self.assertEqual(len(x.findall('.//{http://www.w3.org/2000/svg}text')),0)

 def test_kura_size_pair(self):
  paths=ET.parse(R/'assets/kuranpo-logo.svg').findall('.//{http://www.w3.org/2000/svg}path')
  for p in paths[1:3]:self.assertIn('scale(0.119,-0.119)',p.attrib['transform'])
  for p in paths[3:]:self.assertIn('scale(0.1,-0.1)',p.attrib['transform'])
