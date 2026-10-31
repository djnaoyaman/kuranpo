import importlib.util,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('release_gate',ROOT/'scripts/check_release_changelog.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class ReleaseNotes(unittest.TestCase):
 def test_published_releases(self):
  s=(ROOT/'changelog.html').read_text()
  for n in range(1,6):self.assertIn(f'https://github.com/djnaoyaman/kuranpo/pull/{n}',s)
  self.assertNotIn('全コースの記述を事実の面から確かめ直し',s)
 def test_public_change_requires_note(self):
  for path in ['index.html','knowledge/c1.html','assets/monochrome.js','ogp/c1.png','llms-full.txt']:
   with self.assertRaises(AssertionError):m.validate([path])
   m.validate([path,'changelog.html'])
 def test_internal_change_does_not_invent_release(self):
  m.validate(['tests/test_dates.py','notes/editorial/audit.md','page-updates.json'])
