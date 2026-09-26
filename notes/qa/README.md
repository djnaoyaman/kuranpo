# 検査（qa）の使い方

Playwright（Chromium）が必要です。

    pip install playwright --break-system-packages && playwright install chromium

SITE_ROOT に、サイトの本体だけが入ったフォルダ（index.html のある場所）を指定して実行します。試作ファイルなど、サイト以外のHTMLが同じフォルダにあると、それも検査の対象になります。

    SITE_ROOT=/path/to/site python3 audit_display.py 320 390 768 1024 1280 1920
    SITE_ROOT=/path/to/site python3 audit_design.py
    SITE_ROOT=/path/to/site python3 audit_tone.py

結果は、実行したフォルダに audit_*_result.json として保存されます。

- audit_display.py：横のはみ出し・1文字ずつの縦折れ・画面外・小さすぎる文字・コントラスト不足。縦組みの題字は、意図したものでも縦折れとして数えられます。
- audit_design.py：等幅フォント・配色外の色・破線・角丸・影・大文字化・字間・絵文字。使う配色は、先頭の PAL に登録してください（鎌・くらんぽの配色が入っています）。
- audit_tone.py：本文の中の、丁寧語でない文。
