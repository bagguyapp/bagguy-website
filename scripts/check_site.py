#!/usr/bin/env python3
"""Content compliance scan for the built site (run after scripts/build.py).

FAIL rules: retailer trademarks, crypto/token language, Store Credit, savings claims,
banned compliance words (COMPLIANCE.md / check_content.py list), dollar amounts outside
blocks marked <!-- check:example-start/end --> (must contain "Example") or
<!-- check:pricing-start/end -->, and required elements on every page (non-affiliation
disclaimer, FTC affiliate line, App Store link, privacy/terms/support/delete links).
WARN rules print context for human review (e.g. "official" referring to USDA sources).
Exit code 1 on any FAIL.
"""
import html, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(p for p in ROOT.rglob("*.html")
               if not any(part in {"src", "node_modules", ".git", "docs"} for part in p.relative_to(ROOT).parts))

RETAILERS = ["walmart", "publix", "target", "kroger", "aldi", "costco", "safeway", "instacart", "whole foods",
             "trader joe", "albertsons", "h-e-b", r"\bheb\b", "meijer", "dollar general", "family dollar", "cvs",
             "walgreens", "shoprite", "food lion", "hy-vee", "wegmans", "sprouts", "amazon fresh", "doordash",
             "uber eats", "ibotta", "fetch rewards", "propel"]
FAIL = {
    "retailer/brand name": RETAILERS,
    "crypto": [r"crypto", r"\btokens?\b", r"\$bag\b", r"\bbgt\b", "whitepaper", "blockchain", "wallet", r"\bnft"],
    "store credit / auto rewards": [r"store credit", r"automatic", r"cash ?back"],
    "savings claim": [r"you saved", r"save up to", r"saved \$", r"\bsave \$\d", r"\d+% off", r"guarantee"],
    "compliance word": [r"food stamps", r"struggling", r"free money", r"pay with ebt", r"are you on", r"leaderboard",
                         r"referr", r"\bapproved by\b", r"endorsed by (the )?usda(?! ?,? ?snap)"],
}
WARN = {"official": [r"official"], "percent": [r"\d+%"], "approved": [r"approved"]}
ALLOW = [r"amazon textract"]  # OCR vendor named in the privacy policy (not a retailer)
REQUIRED = {
    "non-affiliation disclaimer": r"not affiliated with, endorsed by, or sponsored by the USDA, SNAP, or any state agency",
    "FTC affiliate line": r"may be affiliate links\. If you shop through one, Bag Guy may earn a commission",
    "App Store link": r"https://apps\.apple\.com/us/app/bag-guy/id6763378440",
    "privacy link": r'href="/privacy/"', "terms link": r'href="/terms/"', "support link": r'href="/support/"',
    "delete link": r'href="/delete-account/"', "affiliate link": r'href="/affiliate-disclosure/"',
}

def visible_text(s):
    s = re.sub(r"<!--meta.*?-->", " ", s, flags=re.S)
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    attrs = " ".join(re.findall(r'(?:alt|title|aria-label|content)="([^"]*)"', s))
    s = re.sub(r"<!--.*?-->", " ", s, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    return html.unescape(re.sub(r"\s+", " ", s + " " + attrs))

fails, warns = [], []
for p in PAGES:
    rel = p.relative_to(ROOT)
    raw = p.read_text()
    if re.search(r'http-equiv="refresh"', raw):
        continue
    for k, pat in REQUIRED.items():
        if not re.search(pat, raw):
            fails.append(f"{rel}: missing {k}")
    # example blocks must be labeled; then removed from the price scan
    for blk in re.findall(r"<!-- check:example-start -->(.*?)<!-- check:example-end -->", raw, re.S):
        if "Example" not in blk and "example" not in blk:
            fails.append(f"{rel}: example block without an 'Example' label")
    body = re.sub(r"<!-- check:(example|pricing)-start -->.*?<!-- check:\1-end -->", " ", raw, flags=re.S)
    text = visible_text(raw)
    low = text.lower()
    for a in ALLOW:
        low = re.sub(a, " ", low)
    for cat, pats in FAIL.items():
        for pat in pats:
            for m in re.finditer(pat, low):
                fails.append(f"{rel}: {cat}: '{low[max(0,m.start()-40):m.end()+40]}'")
    for m in re.finditer(r"\$\s?\d[\d,.]*", visible_text(body)):
        t = visible_text(body)
        fails.append(f"{rel}: dollar amount outside an Example/pricing block: '{t[max(0,m.start()-40):m.end()+30]}'")
    for cat, pats in WARN.items():
        for pat in pats:
            for m in re.finditer(pat, low):
                warns.append(f"{rel}: {cat}: '{low[max(0,m.start()-50):m.end()+40]}'")

print(f"Scanned {len(PAGES)} HTML files")
print(f"WARN ({len(warns)}) - review context:")
for w in warns: print("  ", w)
print(f"FAIL ({len(fails)}):")
for f in fails: print("  ", f)
reviews = sorted({(str(p.relative_to(ROOT)), m) for p in PAGES for m in re.findall(r"<!-- (OWNER REVIEW[^>]*?) -->", p.read_text(), re.S)})
print(f"Owner-review flags ({len(reviews)}):")
for r, m in reviews: print(f"   {r}: {m[:160]}")
sys.exit(1 if fails else 0)
