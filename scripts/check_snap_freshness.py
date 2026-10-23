#!/usr/bin/env python3
"""Freshness check: the SNAP guide's state-restriction table vs the backend rules table.

Compares src/pages/guide-what-snap-covers.html with the backend's
data/snap_state_restrictions.json (default: ../bag-guy-backend-compliance/...; or pass --rules):

FAIL  a state is in one table but not the other (vacated states excluded)
FAIL  a state's first start date differs
FAIL  the caption's "checked <date>" differs from the rules table checked_at
FAIL  the rules table is older than --max-age-days (default 45, same as the backend fail-safe)
Exit 1 on any FAIL. No network. Meant for CI / a daily scheduled run.
"""
import argparse, datetime, html, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "src" / "pages" / "guide-what-snap-covers.html"
DEFAULT_RULES = ROOT.parent / "bag-guy-backend-compliance" / "data" / "snap_state_restrictions.json"


def parse_page(text):
    rows = re.findall(r"<tr><td>([^<]+)</td><td>([A-Z][a-z]{2} \d{1,2}, \d{4})</td>", text)
    m = re.search(r"checked ([A-Z][a-z]+ \d{1,2}, \d{4})", text)
    checked = datetime.datetime.strptime(m.group(1), "%B %d, %Y").date() if m else None
    return {html.unescape(n).strip(): datetime.datetime.strptime(d, "%b %d, %Y").date() for n, d in rows}, checked


def check(page_text, rules, today):
    fails = []
    page_rows, page_checked = parse_page(page_text)
    backend = {s["name"]: min(datetime.date.fromisoformat(r["start"]) for r in s["rules"])
               for s in rules["states"] if s.get("rules")}
    for name in sorted(set(backend) - set(page_rows)):
        fails.append(f"{name} is in the backend rules but not on the guide page")
    for name in sorted(set(page_rows) - set(backend)):
        fails.append(f"{name} is on the guide page but not in the backend rules")
    for name in sorted(set(page_rows) & set(backend)):
        if page_rows[name] != backend[name]:
            fails.append(f"{name}: page start {page_rows[name]} != backend {backend[name]}")
    checked_at = datetime.date.fromisoformat(rules["checked_at"])
    if page_checked != checked_at:
        fails.append(f"page caption checked {page_checked} != rules checked_at {checked_at}")
    return fails, checked_at


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--rules", default=str(DEFAULT_RULES))
    ap.add_argument("--max-age-days", type=int, default=45)
    ap.add_argument("--today", default="")
    a = ap.parse_args(argv)
    today = datetime.date.fromisoformat(a.today) if a.today else datetime.date.today()
    rules = json.loads(pathlib.Path(a.rules).read_text())
    fails, checked_at = check(PAGE.read_text(), rules, today)
    age = (today - checked_at).days
    if age > a.max_age_days:
        fails.append(f"rules table is {age} days old (max {a.max_age_days}); re-check USDA and update both")
    for f in fails:
        print(f"FAIL {f}")
    print(f"{'FAIL' if fails else 'OK'}: {len(fails)} problem(s); rules checked {checked_at} ({age} days ago)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
