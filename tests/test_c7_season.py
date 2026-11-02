from pathlib import Path
import unittest,json,re
ROOT=Path(__file__).resolve().parents[1]
class C7Season(unittest.TestCase):
 def test_paragraph_and_sources(self):
  s=(ROOT/'knowledge/c7.html').read_text();p=re.search(r'<div class="note-item note-season">.*?</div>',s,re.S).group()
  for t in ['https://www.trip-kamakura.com/facility/detail.php?id=22','春のカイドウ','夏のヤマアジサイ','冬のロウバイ','置かれている場合','開花状況や混雑は訪問時']:self.assertIn(t,p)
  for t in ['すぐ隣','穴場','もらって歩く','比較的落ち着いて']:self.assertNotIn(t,p)
 def test_coupled_drill(self):
  s=(ROOT/'knowledge/c7.html').read_text();qs=json.loads(re.search(r'initMiniDrill\("miniDrill_c7", (\[.*?\])\);',s,re.S)[1]);self.assertEqual(len(qs),2)
  for q in qs:self.assertEqual(len(set(q['choices'])),4);self.assertIn(q['answer'],range(4))
  self.assertIn('日朗',qs[0]['q']);self.assertIn('季節と花',qs[1]['q']);self.assertEqual(qs[1]['choices'][qs[1]['answer']],'春はカイドウ、夏はヤマアジサイ、冬はロウバイ');self.assertNotIn('対照的な静けさ',s)
 def test_limits_and_ledger(self):
  s=(ROOT/'knowledge/c7.html').read_text();self.assertIn('再確認中',s);self.assertIn('立ち入らない',s);self.assertIn('市指定',s)
  d=json.loads((ROOT/'notes/editorial/c7-season-drill-20261102.json').read_text());self.assertEqual(len(d['changes']),3);self.assertTrue(d['limitations'])
  for e in d['changes']:self.assertTrue(e['sources']);self.assertTrue(e['reason']);self.assertEqual(e['occurrences'],len(e['before_offsets']))
