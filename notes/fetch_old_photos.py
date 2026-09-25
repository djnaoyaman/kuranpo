# -*- coding: utf-8 -*-
"""
古写真7枚を所蔵館からダウンロードして img/old/ に保存し、
ページの画像の住所を、サイト内の画像に書き換えます。

使い方（サイトのフォルダ kuranpo/ で実行）:
    python3 notes/fetch_old_photos.py            # ダウンロードして書き換える
    python3 notes/fetch_old_photos.py --dry-run  # 何をするかだけ表示する

書き換えたあとの画像は、3段構えで表示されます。
  1. サイト内の画像（img/old/）
  2. 見つからない時は、所蔵館の画像
  3. それも読めない時は、所蔵館のページへの案内
"""
import os, re, sys, glob, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"

# 表示中の画像の住所 → サイト内の置き場所
PHOTOS = [
    ("https://media.getty.edu/iiif/image/0e79db7a-96de-4ee0-807f-04457a415d7a/full/!900,900/0/default.jpg",
     "img/old/tsurugaoka-daito-1868.jpg", "https://www.getty.edu/art/collection/object/109BY7"),
    ("https://commons.wikimedia.org/wiki/Special:FilePath/KITLV_-_89895_-_Beato,_Felice_-_Buddha_at_Kamakura_in_Japan_-_presumably_1863-1865.tif?width=900",
     "img/old/daibutsu-beato-1863.jpg", None),
    ("https://commons.wikimedia.org/wiki/Special:FilePath/KITLV_-_110621_-_Kusakabe,_Kimbei_-_Buddha_statue_at_Daibutsu,_Kamakura,_Japan_-_circa_1890.tif?width=900",
     "img/old/daibutsu-kusakabe-1890.jpg", None),
    ("https://commons.wikimedia.org/wiki/Special:FilePath/KITLV_-_89897_-_Beato,_Felice_-_Village_at_Kamakura_in_Japan_-_presumably_1863-1865.tif?width=900",
     "img/old/kamakura-village-beato-1863.jpg", None),
    ("https://onlinecollections.syr.edu/internal/media/dispatcher/18393/preview",
     "img/old/tsurugaoka-kusakabe-19c.jpg", None),
    ("https://commons.wikimedia.org/wiki/Special:FilePath/Japan_and_her_people_(1902)_(14773933184).jpg?width=900",
     "img/old/daibutsu-1902.jpg", None),
    ("https://commons.wikimedia.org/wiki/Special:FilePath/Plate_14_-_Sights_and_scenes_in_fair_Japan,_by_Kazumasa_Ogawa_(1860-1930),_published_in_1914,_from_The_Clark_Digital_Collections_-_p1325coll1_3417_full.jpg?width=900",
     "img/old/daibutsu-ogawa-1914.jpg", None),
]

PAGES = ["photos.html", "religions.html", "knowledge/g11.html", "knowledge/re10.html", "knowledge/re11.html"]

ONERROR_OLD = "this.closest('figure').classList.add('pl-fail')"
ONERROR_NEW = ("if(this.dataset.remote&&!this.dataset.tried){this.dataset.tried=1;this.src=this.dataset.remote}"
               "else{this.closest('figure').classList.add('pl-fail')}")


def download(url, dest, dry):
    path = os.path.join(ROOT, dest)
    if os.path.exists(path) and os.path.getsize(path) > 10_000:
        print(f"  すでにあります: {dest}")
        return True
    if dry:
        print(f"  （試しのみ）保存します: {dest}  ←  {url[:80]}…")
        return True
    os.makedirs(os.path.dirname(path), exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/*,*/*;q=0.8"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            ctype = r.headers.get("Content-Type", "")
            data = r.read()
        if not ctype.startswith("image/") or len(data) < 10_000:
            print(f"  × 画像ではない応答でした（{ctype}、{len(data)}バイト）: {dest}")
            return False
        with open(path, "wb") as f:
            f.write(data)
        print(f"  ○ 保存しました: {dest}（{len(data)//1024}KB）")
        return True
    except Exception as e:
        print(f"  × 取得できませんでした: {dest}（{e}）")
        return False


def rewrite(page, remote, local, dry):
    path = os.path.join(ROOT, page)
    h = open(path, encoding="utf-8").read()
    prefix = "../" if page.startswith("knowledge/") else ""
    old = f'<img src="{remote}"'
    if old not in h:
        return 0
    new = f'<img src="{prefix}{local}" data-remote="{remote}"'
    n = h.count(old)
    h = h.replace(old, new).replace(ONERROR_OLD, ONERROR_NEW)
    if not dry:
        open(path, "w", encoding="utf-8").write(h)
    return n


def main():
    dry = "--dry-run" in sys.argv
    print("1. 画像をダウンロードします")
    ok = {}
    for remote, local, page in PHOTOS:
        ok[remote] = download(remote, local, dry)
        time.sleep(1)
    print("2. ページの画像の住所を書き換えます")
    total = 0
    for remote, local, page in PHOTOS:
        if not ok[remote]:
            print(f"  書き換えません（画像がないため）: {local}")
            continue
        for p in PAGES:
            n = rewrite(p, remote, local, dry)
            if n:
                total += n
                print(f"  {p}: {local} に {n}か所")
    print(f"完了: {total}か所を書き換えました" + ("（試しのみ。ファイルは変更していません）" if dry else ""))
    failed = [local for (remote, local, page) in PHOTOS if not ok[remote]]
    if failed:
        print("取得できなかった画像は、所蔵館のページからブラウザで保存し、次の置き場所に入れてから、もう一度実行してください:")
        for remote, local, page in PHOTOS:
            if not ok[remote]:
                print(f"  - {local}  （所蔵館のページ: {page or remote}）")


if __name__ == "__main__":
    main()
