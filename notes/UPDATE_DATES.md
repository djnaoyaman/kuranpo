# Page update dates

`page-updates.json` is the single source for visible 最終更新, existing JSON-LD dateModified and sitemap lastmod. These are site/page release dates, not claims that all historical facts were re-researched.

After a real change, run `python3 scripts/update_page_dates.py --date YYYY-MM-DD --paths index.html knowledge/c1.html` with the actual Asia/Tokyo release date. Shared design changes affect all pages: use `--all`. Then run `python3 scripts/generate_sitemap.py`. Never advance every date just because CI/build runs. Existing datePublished and historical changelog entries must not be touched.

CI fingerprints every public page (excluding managed date values) plus shared theme assets, failing when an edit has not been stamped. CI also checks all visible/structured/sitemap dates agree.

2026-10-31: all 78 pages received the Traditional/Monochrome shared-design release; correct the stale September footer dates. 404 remains outside the 77-route sitemap.
