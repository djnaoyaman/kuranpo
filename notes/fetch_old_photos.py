# -*- coding: utf-8 -*-
"""
古写真・図版（notes/old-photos.json の全点）を所蔵館からダウンロードして img/old/ に保存し、
全ページの画像の住所を、サイト内の画像に書き換えます。

使い方（サイトのフォルダ kuranpo/ で実行）:
    python3 notes/fetch_old_photos.py            # ダウンロードして書き換える
    python3 notes/fetch_old_photos.py --dry-run  # 何をするかだけ表示する

書き換えたあとの画像は、サイト内の画像 → 所蔵館の画像 → 所蔵館のページへの案内 の順に表示されます。
"""
import os, sys, glob, json, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
ITEMS = json.load(open(os.path.join(ROOT, "notes", "old-photos.json"), encoding="utf-8"))
PAGES = [os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, "*.html")) + glob.glob(os.path.join(ROOT, "knowledge", "*.html"))]


def fetch(urls, dest, dry):
    path = os.path.join(ROOT, dest)
    if os.path.exists(path) and os.path.getsize(path) > 5_000:
        print(f"  すでにあります: {dest}"); return True
    if dry:
        print(f"  （試しのみ）保存します: {dest}"); return True
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/*,*/*;q=0.8"})
            with urllib.request.urlopen(req, timeout=40) as r:
                ctype = r.headers.get("Content-Type", ""); data = r.read()
            if ctype.startswith("image/") and len(data) > 5_000:
                open(path, "wb").write(data)
                print(f"  ○ 保存しました: {dest}（{len(data)//1024}KB）"); return True
        except Exception as e:
            pass
        time.sleep(0.5)
    print(f"  × 取得できませんでした: {dest}"); return False


def rewrite(item, dry):
    first, fb = item["urls"][0], "|".join(item["urls"][1:])
    old = f'<img src="{first}" data-fb="{fb}"'
    n = 0
    for page in PAGES:
        path = os.path.join(ROOT, page); h = open(path, encoding="utf-8").read()
        if old not in h: continue
        prefix = "../" if page.startswith("knowledge" + os.sep) or page.startswith("knowledge/") else ""
        new = f'<img src="{prefix}{item["local"]}" data-fb="{"|".join(item["urls"])}"'
        k = h.count(old); n += k
        if not dry: open(path, "w", encoding="utf-8").write(h.replace(old, new))
    return n


def main():
    dry = "--dry-run" in sys.argv
    print(f"1. 画像をダウンロードします（{len(ITEMS)}点）")
    ok = {i["key"]: fetch(i["urls"], i["local"], dry) for i in ITEMS}
    print("2. ページの画像の住所を書き換えます")
    total = 0
    for i in ITEMS:
        if ok[i["key"]]: total += rewrite(i, dry)
    print(f"完了: {total}か所を書き換えました" + ("（試しのみ。ファイルは変更していません）" if dry else ""))
    miss = [i for i in ITEMS if not ok[i["key"]]]
    if miss:
        print("取得できなかった画像は、出典のページをブラウザで開いて保存し、次の置き場所に入れてから、もう一度実行してください:")
        for i in miss: print(f"  - {i['local']}  （出典のページ: {i['page']}）")


if __name__ == "__main__":
    main()
