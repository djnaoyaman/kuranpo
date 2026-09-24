#!/usr/bin/env python3
"""
sitemap.xml 自動生成スクリプト
リポジトリ直下のHTMLファイルを走査し、sitemap.xmlを再生成する。
ページの追加・削除があっても、このスクリプトを実行するだけで最新化される。

使い方:
  python3 scripts/generate_sitemap.py
  （リポジトリのルートディレクトリで実行する想定）
"""
import os
import re
import datetime
import xml.etree.ElementTree as ET

BASE_URL = "https://djnaoyaman.github.io/kamakura-kurampo"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 除外するディレクトリ・ファイル
EXCLUDE_DIRS = {".git", "scripts", "node_modules", ".github"}
EXCLUDE_FILES = {"404.html"}  # 404ページはインデックス対象外

# 優先度とページ更新頻度の目安（パスの先頭一致で判定、無ければデフォルト）
PRIORITY_RULES = [
    (r"^index\.html$", 1.0, "weekly"),
    (r"^(basics|history)\.html$", 0.8, "monthly"),
    (r"^knowledge/", 0.7, "monthly"),
    (r"^profile\.html$", 0.5, "monthly"),
    (r"^changelog\.html$", 0.3, "weekly"),
]
DEFAULT_PRIORITY, DEFAULT_FREQ = 0.5, "monthly"


def find_html_files():
    result = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            if fn in EXCLUDE_FILES and os.path.dirname(dirpath) == ROOT:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT).replace(os.sep, "/")
            if fn in EXCLUDE_FILES and "/" not in rel:
                continue
            result.append(rel)
    return sorted(result)


def priority_for(rel_path):
    for pattern, prio, freq in PRIORITY_RULES:
        if re.match(pattern, rel_path):
            return prio, freq
    return DEFAULT_PRIORITY, DEFAULT_FREQ


def build_sitemap(rel_paths):
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    today = datetime.date.today().isoformat()
    for rel in rel_paths:
        prio, freq = priority_for(rel)
        url_el = ET.SubElement(urlset, "url")
        ET.SubElement(url_el, "loc").text = f"{BASE_URL}/{rel}"
        ET.SubElement(url_el, "lastmod").text = today
        ET.SubElement(url_el, "changefreq").text = freq
        ET.SubElement(url_el, "priority").text = f"{prio:.1f}"
    return urlset


def main():
    rel_paths = find_html_files()
    urlset = build_sitemap(rel_paths)
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ")
    out_path = os.path.join(ROOT, "sitemap.xml")
    tree.write(out_path, encoding="UTF-8", xml_declaration=True)
    print(f"sitemap.xml generated with {len(rel_paths)} URLs -> {out_path}")


if __name__ == "__main__":
    main()
