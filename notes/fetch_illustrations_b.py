# -*- coding: utf-8 -*-
"""
作業B（19ページの図版探し）で採用した挿絵3点を、国立国会図書館デジタルコレクションから
ダウンロードして img/old/ に保存します。

使い方（サイトのフォルダ kuranpo/ で実行）:
    python3 notes/fetch_illustrations_b.py
"""
import os, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"

ITEMS = [
    {
        # 「淨妙寺圖」『新編鎌倉志』貞享2[1685]、pid2563542、コマ158
        "local": "img/old/ndl-g9-jomyoji.jpg",
        "url": "https://dl.ndl.go.jp/api/iiif/2563542/R0000158/pct:1,22,47,58/2000,2178/0/default.jpg",
    },
    {
        # 「壽福寺圖」『新編鎌倉志』貞享2[1685]、pid2563543、コマ103
        "local": "img/old/ndl-pe3-jufukuji.jpg",
        "url": "https://dl.ndl.go.jp/api/iiif/2563543/R0000103/pct:54,12,38,72/1800,2939/0/default.jpg",
    },
    {
        # 「英勝寺圖」『新編鎌倉志』貞享2[1685]、pid2563543、コマ111
        "local": "img/old/ndl-re7-eishoji.jpg",
        "url": "https://dl.ndl.go.jp/api/iiif/2563543/R0000111/pct:6,13,46,71/2000,2660/0/default.jpg",
    },
]


def fetch(url, dest, tries=5):
    path = os.path.join(ROOT, dest)
    if os.path.exists(path) and os.path.getsize(path) > 5_000:
        print(f"  すでにあります: {dest}")
        return True
    os.makedirs(os.path.dirname(path), exist_ok=True)
    wait = 8
    for attempt in range(1, tries + 1):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
                "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
                "Referer": "https://dl.ndl.go.jp/",
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
    print(f"図版をダウンロードします（{len(ITEMS)}点）")
    ok_count = 0
    for n, i in enumerate(ITEMS):
        if n > 0:
            time.sleep(5)
        if fetch(i["url"], i["local"]):
            ok_count += 1
    print(f"完了: {ok_count}/{len(ITEMS)} 件を保存しました")


if __name__ == "__main__":
    main()
