# 古写真の一覧（サイト内に画像を置く時のために）

いまは所蔵館の画像を直接表示しています。サイト内に置く場合は、各画像を保存して「置き場所」に入れ、HTMLの src をその置き場所に書き換えてください。


## Claude Cowork での使い方

1. Coworkで、サイトのフォルダ（kuranpo）を接続します。
2. 次のように頼みます。

   > notes/fetch_old_photos.py を実行して、古写真（全47点）を img/old/ に保存し、ページの画像をサイト内のものに書き換えてください。取得できなかった画像があれば、表示される所蔵館のページをブラウザで開いて画像を保存し、同じ置き場所に入れてから、もう一度実行してください。

3. ネットワークの許可を求められたら、次の住所を許可します。
   - commons.wikimedia.org / upload.wikimedia.org（ウィキメディア・コモンズ）
   - media.getty.edu（ゲッティ美術館）
   - onlinecollections.syr.edu（シラキュース大学美術館）

先に `python3 notes/fetch_old_photos.py --dry-run` を実行すると、ファイルを変えずに、何をするかだけを確かめられます。Claude Code でも同じコマンドで動きます。

書き換えたあとの画像は、3段構えで表示されます。サイト内の画像がない時は所蔵館の画像を、それも読めない時は所蔵館のページへの案内を出します。



## daito
- 表示中の画像: https://media.getty.edu/iiif/image/0e79db7a-96de-4ee0-807f-04457a415d7a/full/!900,900/0/default.jpg
- 代わりの画像: なし
- 出典のページ: https://www.getty.edu/art/collection/object/109BY7
- 置き場所（案）: img/old/tsurugaoka-daito-1868.jpg
- クレジット: フェリーチェ・ベアト撮影、1867〜68年。J・ポール・ゲッティ美術館所蔵（パブリックドメイン）

## daibutsu_beato
- 表示中の画像: https://commons.wikimedia.org/wiki/Special:FilePath/KITLV_-_89895_-_Beato,_Felice_-_Buddha_at_Kamakura_in_Japan_-_presumably_1863-1865.tif?width=900
- 代わりの画像: なし
- 出典のページ: https://commons.wikimedia.org/wiki/File:KITLV_-_89895_-_Beato,_Felice_-_Buddha_at_Kamakura_in_Japan_-_presumably_1863-1865.tif
- 置き場所（案）: img/old/daibutsu-beato-1863.jpg
- クレジット: フェリーチェ・ベアト撮影、1863〜65年ごろ。ライデン大学図書館（KITLV 89895）所蔵、パブリックドメイン

## daibutsu_kusakabe
- 表示中の画像: https://commons.wikimedia.org/wiki/Special:FilePath/KITLV_-_110621_-_Kusakabe,_Kimbei_-_Buddha_statue_at_Daibutsu,_Kamakura,_Japan_-_circa_1890.tif?width=900
- 代わりの画像: なし
- 出典のページ: https://commons.wikimedia.org/wiki/File:KITLV_-_110621_-_Kusakabe,_Kimbei_-_Buddha_statue_at_Daibutsu,_Kamakura,_Japan_-_circa_1890.tif
- 置き場所（案）: img/old/daibutsu-kusakabe-1890.jpg
- クレジット: 日下部金兵衛撮影、1890年ごろ。ライデン大学図書館（KITLV 110621）所蔵、パブリックドメイン

## village
- 表示中の画像: https://commons.wikimedia.org/wiki/Special:FilePath/KITLV_-_89897_-_Beato,_Felice_-_Village_at_Kamakura_in_Japan_-_presumably_1863-1865.tif?width=900
- 代わりの画像: なし
- 出典のページ: https://commons.wikimedia.org/wiki/File:KITLV_-_89897_-_Beato,_Felice_-_Village_at_Kamakura_in_Japan_-_presumably_1863-1865.tif
- 置き場所（案）: img/old/kamakura-village-beato-1863.jpg
- クレジット: フェリーチェ・ベアト撮影、1863〜65年ごろ。ライデン大学図書館（KITLV 89897）所蔵、パブリックドメイン

## hachiman_kusakabe
- 表示中の画像: https://onlinecollections.syr.edu/internal/media/dispatcher/18393/preview
- 代わりの画像: なし
- 出典のページ: https://onlinecollections.syr.edu/objects/31184/shinto-temple-hachiman-kamakura
- 置き場所（案）: img/old/tsurugaoka-kusakabe-19c.jpg
- クレジット: 日下部金兵衛撮影、19世紀。シラキュース大学美術館所蔵（1986.475、パブリックドメイン）

## daibutsu_1902
- 表示中の画像: https://commons.wikimedia.org/wiki/Special:FilePath/Japan_and_her_people_(1902)_(14773933184).jpg?width=900
- 代わりの画像: なし
- 出典のページ: https://commons.wikimedia.org/wiki/File:Japan_and_her_people_(1902)_(14773933184).jpg
- 置き場所（案）: img/old/daibutsu-1902.jpg
- クレジット: 『Japan and her people』（1902年）より。パブリックドメイン

## daibutsu_ogawa
- 表示中の画像: https://commons.wikimedia.org/wiki/Special:FilePath/Plate_14_-_Sights_and_scenes_in_fair_Japan,_by_Kazumasa_Ogawa_(1860-1930),_published_in_1914,_from_The_Clark_Digital_Collections_-_p1325coll1_3417_full.jpg?width=900
- 代わりの画像: なし
- 出典のページ: https://commons.wikimedia.org/wiki/File:Plate_14_-_Sights_and_scenes_in_fair_Japan,_by_Kazumasa_Ogawa_(1860-1930),_published_in_1914,_from_The_Clark_Digital_Collections_-_p1325coll1_3417_full.jpg
- 置き場所（案）: img/old/daibutsu-ogawa-1914.jpg
- クレジット: 小川一真撮影、写真集『Sights and Scenes in Fair Japan』（1914年）の図版14。クラーク美術館所蔵、パブリックドメイン

## ndl_meisho_enkakuji_sanmon
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762809/R0000181/1418,1831,910,600/,600/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762809/R0000181/1418,1831,910,600/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/181
- 置き場所（案）: img/old/ndl-meisho-enkakuji-sanmon.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_kenchoji_sanmon
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762809/R0000181/1406,1083,920,606/,606/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762809/R0000181/1406,1083,920,606/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/181
- 置き場所（案）: img/old/ndl-meisho-kenchoji-sanmon.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_hase
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/762809_180b.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/762809_180b.webp
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/180
- 置き場所（案）: img/old/ndl-meisho-hase.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_daibutsu
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/762809_180a.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/762809_180a.webp
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/180
- 置き場所（案）: img/old/ndl-meisho-daibutsu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_hachiman
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/762809_179a.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/762809_179a.webp
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/179
- 置き場所（案）: img/old/ndl-meisho-hachiman.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_yuigahama
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762809/R0000176/2616,1843,894,604/,604/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762809/R0000176/2616,1843,894,604/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/176
- 置き場所（案）: img/old/ndl-meisho-yuigahama.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_inamura
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762809/R0000176/2632,1091,910,614/,614/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762809/R0000176/2632,1091,910,614/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/176
- 置き場所（案）: img/old/ndl-meisho-inamura.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_shichiri
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762809/R0000184/3636,1857,910,620/,620/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762809/R0000184/3636,1857,910,620/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/184
- 置き場所（案）: img/old/ndl-meisho-shichiri.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_meisho_ryukoji
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/762809_182a.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/762809_182a.webp
- 出典のページ: https://dl.ndl.go.jp/pid/762809/1/182
- 置き場所（案）: img/old/ndl-meisho-ryukoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_hyakkei_kane
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/762810_38.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/762810_38.webp
- 出典のページ: https://dl.ndl.go.jp/pid/762810/1/38
- 置き場所（案）: img/old/ndl-hyakkei-kane.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_hyakkei_daibutsu
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/762810_36.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/762810_36.webp
- 出典のページ: https://dl.ndl.go.jp/pid/762810/1/36
- 置き場所（案）: img/old/ndl-hyakkei-daibutsu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_hyakkei_hachiman
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762810/R0000037/1434,1017,2020,1322/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762810/R0000037/1434,1017,2020,1322/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762810/1/37
- 置き場所（案）: img/old/ndl-hyakkei-hachiman.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_chiri_daibutsu
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/761460_14.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/761460_14.webp
- 出典のページ: https://dl.ndl.go.jp/pid/761460/1/14
- 置き場所（案）: img/old/ndl-chiri-daibutsu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zufu_daibutsu
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/762837_13.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/762837_13.webp
- 出典のページ: https://dl.ndl.go.jp/pid/762837/1/13
- 置き場所（案）: img/old/ndl-zufu-daibutsu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zufu_hachiman
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762837/R0000012/1104,874,2356,1792/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762837/R0000012/1104,874,2356,1792/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762837/1/12
- 置き場所（案）: img/old/ndl-zufu-hachiman.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_fuzoku_daibutsu
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/762817/R0000021/1420,862,2616,1760/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/762817/R0000021/1420,862,2616,1760/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/762817/1/21
- 置き場所（案）: img/old/ndl-fuzoku-daibutsu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_kanto_daibutsu
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/12767897_54.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/12767897_54.webp
- 出典のページ: https://dl.ndl.go.jp/pid/12767897/1/54
- 置き場所（案）: img/old/ndl-kanto-daibutsu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_kanto_enkakuji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000053/1096,498,2292,1596/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000053/1096,498,2292,1596/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12767897/1/53
- 置き場所（案）: img/old/ndl-kanto-enkakuji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_kanto_kenchoji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000052/1168,478,2280,1596/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000052/1168,478,2280,1596/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12767897/1/52
- 置き場所（案）: img/old/ndl-kanto-kenchoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_kanto_kamakuragu
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000051/1172,490,2280,1616/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000051/1172,490,2280,1616/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12767897/1/51
- 置き場所（案）: img/old/ndl-kanto-kamakuragu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_kanto_hachiman
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/12767897_50.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/12767897_50.webp
- 出典のページ: https://dl.ndl.go.jp/pid/12767897/1/50
- 置き場所（案）: img/old/ndl-kanto-hachiman.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_kanto_koshigoe
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000062/1080,534,2284,1548/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000062/1080,534,2284,1548/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12767897/1/62
- 置き場所（案）: img/old/ndl-kanto-koshigoe.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_kanto_yugyoji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000049/1136,478,2288,1572/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12767897/R0000049/1136,478,2288,1572/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12767897/1/49
- 置き場所（案）: img/old/ndl-kanto-yugyoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_dai_kamakuragu
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/4568,1778,1344,1028/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/4568,1778,1344,1028/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12984526/1/34
- 置き場所（案）: img/old/ndl-dai-kamakuragu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_dai_enkakuji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/4576,666,1768,1072/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/4576,666,1768,1072/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12984526/1/34
- 置き場所（案）: img/old/ndl-dai-enkakuji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_dai_kenchoji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/6372,690,1360,1060/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/6372,690,1360,1060/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12984526/1/34
- 置き場所（案）: img/old/ndl-dai-kenchoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_dai_hachiman
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/5936,1774,1784,1056/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000034/5936,1774,1784,1056/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12984526/1/34
- 置き場所（案）: img/old/ndl-dai-hachiman.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_dai_enoshima
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000029/1040,622,3128,2132/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/12984526/R0000029/1040,622,3128,2132/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/12984526/1/29
- 置き場所（案）: img/old/ndl-dai-enoshima.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zue_hachiman
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000022/full/!1000,1000/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000022/full/!500,500/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2559319/1/22
- 置き場所（案）: img/old/ndl-zue-hachiman.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zue_ichinotorii
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000023/full/!1000,1000/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000023/full/!500,500/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2559319/1/23
- 置き場所（案）: img/old/ndl-zue-ichinotorii.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zue_yuihama
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000024/full/!1000,1000/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000024/full/!500,500/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2559319/1/24
- 置き場所（案）: img/old/ndl-zue-yuihama.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zue_kenchoji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000035/full/!1000,1000/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000035/full/!500,500/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2559319/1/35
- 置き場所（案）: img/old/ndl-zue-kenchoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zue_enkakuji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000038/full/!1000,1000/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000038/full/!500,500/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2559319/1/38
- 置き場所（案）: img/old/ndl-zue-enkakuji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zue_komyoji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000046/full/!1000,1000/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000046/full/!500,500/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2559319/1/46
- 置き場所（案）: img/old/ndl-zue-komyoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_zue_yugyoji
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000053/full/!1000,1000/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2559319/R0000053/full/!500,500/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2559319/1/53
- 置き場所（案）: img/old/ndl-zue-yugyoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_hasui_daibutsu
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/2586549_30.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/2586549_30.webp
- 出典のページ: https://dl.ndl.go.jp/pid/2586549/1/30
- 置き場所（案）: img/old/ndl-hasui-daibutsu.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_hasui_kenchoji
- 表示中の画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc/2586549_51.jpg
- 代わりの画像: https://ndlsearch.ndl.go.jp/files/imagebank/dc_t/2586549_51.webp
- 出典のページ: https://dl.ndl.go.jp/pid/2586549/1/51
- 置き場所（案）: img/old/ndl-hasui-kenchoji.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_hasui_shichiri
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2586549/R0000033/1112,1412,6048,3984/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2586549/R0000033/1112,1412,6048,3984/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2586549/1/33
- 置き場所（案）: img/old/ndl-hasui-shichiri.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_hasui_hachiman
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2586550/R0000021/1104,937,5184,7872/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2586550/R0000021/1104,937,5184,7872/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2586550/1/21
- 置き場所（案）: img/old/ndl-hasui-hachiman.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」

## ndl_fukei_yuigahama
- 表示中の画像: https://dl.ndl.go.jp/api/iiif/2550826/R0000017/852,738,3416,2520/,900/0/default.jpg
- 代わりの画像: https://dl.ndl.go.jp/api/iiif/2550826/R0000017/852,738,3416,2520/,200/0/default.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2550826/1/17
- 置き場所（案）: img/old/ndl-fukei-yuigahama.jpg
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館「錦絵と写真でめぐる日本の名所」


## 作業B：no-photoページ用の挿絵（3点。notes/fetch_illustrations_b.py で取得済み）

「no-photo」だった19ページのうち、資料に採否の根拠（書名・出版年・pid・コマ・挿絵の題）を明記できたのは次の3点。他16ページは、該当する挿絵が資料に見つからず空欄のまま（採用しない方が、誤った図版を載せるより害が小さいため）。

### ndl_g9_jomyoji（浄妙寺図）
- 使用ページ: knowledge/g9.html, knowledge/re3.html, knowledge/pe13.html
- 資料: 『新編鎌倉志』8巻[1]（河井恒久友水纂述・松村清之伯胤考訂・力石忠一叔貫參補、貞享2年[1685]、柳枝軒）
- pid: 2563542／コマ158
- 挿絵の題: 淨妙寺圖（浄妙寺図）
- 権利: インターネット公開（保護期間満了）
- 置き場所: img/old/ndl-g9-jomyoji.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2563542/1/158
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館デジタルコレクション

### ndl_pe3_jufukuji（寿福寺図）
- 使用ページ: knowledge/pe3.html
- 資料: 『新編鎌倉志』8巻[2]（同上編者、貞享2年[1685]、柳枝軒）
- pid: 2563543／コマ103
- 挿絵の題: 壽福寺圖（寿福寺図）
- 権利: インターネット公開（保護期間満了）
- 置き場所: img/old/ndl-pe3-jufukuji.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2563543/1/103
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館デジタルコレクション

### ndl_re7_eishoji（英勝寺図）
- 使用ページ: knowledge/re7.html
- 資料: 『新編鎌倉志』8巻[2]（同上編者、貞享2年[1685]、柳枝軒）
- pid: 2563543／コマ111
- 挿絵の題: 英勝寺圖（英勝寺図）
- 権利: インターネット公開（保護期間満了）
- 置き場所: img/old/ndl-re7-eishoji.jpg
- 出典のページ: https://dl.ndl.go.jp/pid/2563543/1/111
- クレジット: 国立国会図書館所蔵。出典：国立国会図書館デジタルコレクション
