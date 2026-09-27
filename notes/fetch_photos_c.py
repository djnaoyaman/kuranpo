# -*- coding: utf-8 -*-
"""
作業C（現在の写真・14ページ）で採用した写真13点を、ウィキメディア・コモンズから
ダウンロードして img/photo/ に保存します。

使い方（サイトのフォルダ kuranpo/ で実行）:
    python3 notes/fetch_photos_c.py
"""
import os, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"

ITEMS = [
    {
        "local": "img/photo/c1-zeniarai.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Row_of_Timber_Torii_at_the_Zeniarai_Benzaiten_Shrine.jpg",
    },
    {
        "local": "img/photo/c3-yakuoji.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Yakuouji_kamakura_01.JPG",
    },
    {
        "local": "img/photo/g12-ofuna-kannon.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Approach_to_Ofuna_Kannonji_Temple.jpg",
    },
    {
        "local": "img/photo/pe5-jorakuji.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/J%C5%8Draku-ji_%C5%8Dfuna_Kamakura,_Main_hall_(2015-03-31).jpg",
    },
    {
        "local": "img/photo/pe7-ryuhoji-sanmon.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ryuhouji01.jpg",
    },
    {
        "local": "img/photo/ti10-ryuhoji-hondo.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ryuhouji03.jpg",
    },
    {
        "local": "img/photo/c11-enkoji.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Enko-ji,_Kamakura.jpg",
    },
    {
        "local": "img/photo/c16-suwa.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Suwa-jinja,_Kamakura-Ueki.jpg",
    },
    {
        "local": "img/photo/c10-shomyoji.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sh%C5%8Dmy%C5%8D-ji_Imaizumi_Kamakura,_Acala_hall_(2015-09-20).jpg",
    },
    {
        "local": "img/photo/c12-tamonin.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tamon-in_%C5%8Dfuna_Kamakura,_Main_hall_(2025-08-20).jpg",
    },
    {
        "local": "img/photo/c13-seirenji.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/P4280005_Seirenji_temple_main_gate.JPG",
    },
    {
        "local": "img/photo/c14-bukkoji.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/%E4%BB%8F%E8%A1%8C%E5%AF%BA.jpg",
    },
    {
        "local": "img/photo/c15-shinmei.jpg",
        "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Shinmei_Shrine_in_Kamakura_city.jpg",
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
