# -*- coding: utf-8 -*-
"""
写真の見直し（Request 1・2）で新しく必要になった3点を取得します。
使い方（サイトのフォルダ kuranpo/ で実行）:
    python3 notes/fetch_photos_c2.py
"""
import os, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"

ITEMS = [
    {
        "local": "img/photo/c10-daichoji.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Daich%C5%8D-ji_Iwase_Kamakura,_Main_hall_(2016-10-31).jpg",
    },
    {
        "local": "img/photo/ti4-jorakuji-sakura.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/J%C5%8Draku-ji_%C5%8Dfuna_Kamakura,_Main_hall_with_Sakura_(2015-03-31).jpg",
    },
    {
        "local": "img/photo/c13-seirenji-hondo.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kusaridaishi01.jpg",
    },
]


def fetch(url, dest, tries=5):
    path = os.path.join(ROOT, dest)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    wait = 8
    for attempt in range(1, tries + 1):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
                "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
                "Referer": "https://commons.wikimedia.org/",
            })
            with urllib.request.urlopen(req, timeout=40) as r:
                ctype = r.headers.get("Content-Type", "")
                data = r.read()
            if ctype.startswith("image/") and len(data) > 5_000:
                open(path, "wb").write(data)
                print(f"  ○ 保存しました: {dest}（{len(data)//1024}KB）")
                return True
            print(f"  × 想定外の応答: {dest} (content-type={ctype}, size={len(data)})")
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < tries:
                print(f"  … 429（混み合っています）。{wait}秒待って再試行します（{attempt}/{tries}）")
                time.sleep(wait)
                wait = min(wait * 2, 60)
                continue
            print(f"  × エラー: {dest} (HTTP {e.code})")
        except Exception as e:
            print(f"  × エラー: {dest} ({e})")
        if attempt < tries:
            time.sleep(wait)
    print(f"  × 取得できませんでした: {dest}")
    return False


def main():
    print(f"写真をダウンロードします（{len(ITEMS)}点）")
    ok_count = 0
    for n, i in enumerate(ITEMS):
        if n > 0:
            time.sleep(3)
        if fetch(i["url"], i["local"]):
            ok_count += 1
    print(f"完了: {ok_count}/{len(ITEMS)} 件を保存しました")


if __name__ == "__main__":
    main()
