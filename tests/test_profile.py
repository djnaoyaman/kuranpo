from pathlib import Path
import unittest,re,json,subprocess
R=Path(__file__).resolve().parents[1];BASE='90f9f7d5fa1a89e2f2ba09f820f10d4f796b1ad0';URL='https://djnaoyaman.github.io/profile.html'
def walk(o):
 if isinstance(o,dict):
  yield o
  for v in o.values():yield from walk(v)
 elif isinstance(o,list):
  for v in o:yield from walk(v)
class Profile(unittest.TestCase):
 def test_compact_intro(self):
  s=(R/'profile.html').read_text();self.assertIn('鎌倉を歩く楽しみから、このサイトは始まりました。道の先にある歴史も、散歩と一緒に楽しめたら。',s);self.assertIn('史料で確かめられることと、語り継がれた話を分けて紹介しています。',s);self.assertIn(f'href="{URL}">作者について</a>',s)
  main=re.search(r'<main>(.*?)</main>',s,re.S)[1];self.assertEqual(main.count('<section'),1);self.assertLess(main.index('class="lead'),main.index('<figure'))
 def test_no_duplicate_signature(self):
  s=(R/'profile.html').read_text();self.assertNotIn('class="editor-mark-section"',s);self.assertNotIn('企画・編集・デザイン・制作・文責',s)
 def test_author_schema(self):
  count=0
  for p in [*R.glob('*.html'),*(R/'knowledge').glob('*.html')]:
   for text in re.findall(r'<script type="application/ld\+json">(.*?)</script>',p.read_text(),re.S):
    for o in walk(json.loads(text)):
     if o.get('@type')=='Person' and o.get('name')=='クランポック':
      count+=1;self.assertEqual(set(o),{'@type','name','url','description'});self.assertEqual(o['url'],URL)
  self.assertGreaterEqual(count,69)
 def test_credits_and_assets(self):
  old=subprocess.check_output(['git','show',BASE+':profile.html'],cwd=R,text=True);new=(R/'profile.html').read_text()
  self.assertEqual(re.search(r'<figure class="plate">.*?</figure>',old,re.S)[0],re.search(r'<figure class="plate">.*?</figure>',new,re.S)[0])
  for n in ['assets/kuranpo-logo.svg','assets/brand.css','assets/monochrome.css','assets/monochrome.js']:
   self.assertEqual((R/n).read_bytes(),subprocess.check_output(['git','show',BASE+':'+n],cwd=R))
 def test_reference_ledger(self):
  entries=[e for e in json.loads((R/'notes/editorial/edits.json').read_text()) if e.get('before_ref')==BASE];self.assertTrue(entries);self.assertTrue(all('before' not in e for e in entries))
