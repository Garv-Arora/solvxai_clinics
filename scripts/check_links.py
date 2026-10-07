"""Check every external link in dist/ (sources, citations, docs).

Usage: python scripts/check_links.py
Prints each URL that does not return 2xx/3xx. Some publishers (Forbes, Gartner,
BizBuySell, Axios) block scripted requests with 403 even though the page works in a
browser; those are reported separately so a human can spot-check them.
"""
from __future__ import annotations

import concurrent.futures as cf
import re
import sys
import urllib.request
from pathlib import Path

DIST = Path(__file__).resolve().parent.parent / "dist"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
BOT_WALLED = ("openai.com", "forbes.com", "gartner.com", "bizbuysell.com", "axios.com", "linkedin.com", "x.com", "developers.facebook.com")
SKIP = ("cal.com", "fonts.googleapis.com", "fonts.gstatic.com", "schema.org", "creativecommons.org")


def urls() -> set[str]:
    found: set[str] = set()
    for f in DIST.rglob("*.html"):
        # The audit page records what engines cited, dead links included, on purpose.
        if "/print/" in f.as_posix() or "ai-answer-audit-2026" in f.as_posix():
            continue
        for m in re.finditer(r'href="(https?://[^"#]+)', f.read_text(encoding="utf-8", errors="ignore")):
            u = m.group(1).replace("&amp;", "&")
            if not any(s in u for s in SKIP) and "solvx-ai.pages.dev" not in u:
                found.add(u)
    return found


def check(u: str) -> tuple[str, int | str]:
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(u, method=method, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
            with urllib.request.urlopen(req, timeout=20) as r:
                return u, r.status
        except urllib.error.HTTPError as e:
            if method == "GET":
                return u, e.code
        except Exception as e:  # noqa: BLE001
            if method == "GET":
                return u, type(e).__name__
    return u, "?"


def main() -> int:
    all_urls = sorted(urls())
    bad, walled = [], []
    with cf.ThreadPoolExecutor(12) as ex:
        for u, status in ex.map(check, all_urls):
            if isinstance(status, int) and status < 400:
                continue
            (walled if any(w in u for w in BOT_WALLED) else bad).append((u, status))
    print(f"{len(all_urls)} external URLs checked")
    if walled:
        print(f"\n{len(walled)} blocked to scripts (spot-check in a browser):")
        for u, s in walled:
            print(f"  ~ {s} {u}")
    if bad:
        print(f"\n{len(bad)} failing:")
        for u, s in bad:
            print(f"  x {s} {u}")
        return 1
    print("\nNo failing links.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
