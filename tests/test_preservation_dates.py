"""Date updates must not invalidate reversible editorial offsets."""
from pathlib import Path
import unittest,re
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'tests/preservation.py'
ns={'__file__':str(source)}
exec(source.read_text().split('files=sorted(ROOT.glob')[0],ns)
class PreservationDates(unittest.TestCase):
 def test_managed_date_length_change(self):
  for p in [*ROOT.glob('*.html'),*(ROOT/'knowledge').glob('*.html')]:
   rel=p.relative_to(ROOT).as_posix();s=p.read_text()
   future=re.sub(r'(最終更新</dt><dd>)[^<]+',r'\g<1>2027年1月1日',s)
   future=re.sub(r'(最終更新：)\d{4}年\d+月\d+日',r'\g<1>2027年1月1日',future)
   future=re.sub(r'("dateModified"\s*:\s*")[^"]+',r'\g<1>2027-01-01',future)
   self.assertEqual(ns['before_editorial'](rel,s),ns['before_editorial'](rel,future),rel)
 def test_original_publication_date_is_not_ignored(self):
  a='{"datePublished":"2026-09-25","dateModified":"2026-10-31"}'
  b=a.replace('2026-09-25','2027-01-01')
  self.assertNotEqual(ns['before_editorial']('__date_test__',a),ns['before_editorial']('__date_test__',b))
