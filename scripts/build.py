#!/usr/bin/env python3
"""Static site build for bagguyapp.com.

Source pages live in src/pages/*.html. Each starts with a metadata block:
    <!--meta
    title: Page title
    description: Meta description
    out: index.html            (comma-separated list of output paths)
    path: /                    (canonical path)
    nav: home                  (nav key for aria-current)
    -->
The build wraps each page in src/layout.html, then writes the output files at the repo root
(Vercel and GitHub Pages serve the repo root as static files, so no hosting change is needed),
plus sitemap.xml and robots.txt. Run: python3 scripts/build.py
"""
import datetime, html, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
SITE = "https://www.bagguyapp.com"
APP_STORE_URL = "https://apps.apple.com/us/app/bag-guy/id6763378440"

def parse(path):
    raw = path.read_text()
    m = re.match(r"<!--meta\n(.*?)\n-->\n", raw, re.S)
    if not m:
        sys.exit(f"{path}: missing meta block")
    meta = {k.strip(): v.strip() for k, _, v in (l.partition(":") for l in m.group(1).splitlines() if l.strip())}
    for k in ("title", "description", "out", "path"):
        if k not in meta:
            sys.exit(f"{path}: meta '{k}' missing")
    return meta, raw[m.end():]

def main():
    layout = (SRC / "layout.html").read_text()
    pages = sorted((SRC / "pages").glob("*.html"))
    sitemap, written = [], []
    for p in pages:
        meta, body = parse(p)
        nav = meta.get("nav", "")
        out_html = layout
        for key in ("home", "how", "guide", "about", "support"):
            out_html = out_html.replace(f'data-nav="{key}"', 'aria-current="page"' if key == nav else "")
        title = meta["title"] if meta["path"] == "/" else f'{meta["title"]} · Bag Guy'
        repl = {
            "{{title}}": html.escape(title),
            "{{description}}": html.escape(meta["description"]),
            "{{canonical}}": SITE + meta["path"],
            "{{robots}}": meta.get("robots", "index,follow"),
            "{{year}}": str(datetime.date.today().year),
            "{{app_store_url}}": APP_STORE_URL,
        }
        for k, v in repl.items():
            out_html = out_html.replace(k, v)
        out_html = out_html.replace("{{content}}", body.replace("{{app_store_url}}", APP_STORE_URL))
        if "{{" in out_html:
            sys.exit(f"{p}: unreplaced placeholder")
        for out in [o.strip() for o in meta["out"].split(",")]:
            dest = ROOT / out
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(out_html)
            written.append(out)
        if meta.get("robots", "index").startswith("index"):
            sitemap.append(SITE + meta["path"])
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url><loc>{u}</loc></url>\n" for u in sitemap) + "</urlset>\n")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
    print(f"built {len(written)} files from {len(pages)} pages; sitemap {len(sitemap)} urls")
    for w in written:
        print("  ", w)

if __name__ == "__main__":
    main()
