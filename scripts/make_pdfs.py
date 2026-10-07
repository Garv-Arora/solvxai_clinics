"""Render the SolvX playbooks to PDF.

Pipeline: serve ./dist locally -> print the dark cover (full bleed) and the light
interior (with running footer + page numbers) in headless Chromium -> merge with
pypdf -> write to public/playbooks/ (source of truth) and dist/playbooks/.

Run after `astro build`:  python scripts/make_pdfs.py
"""
from __future__ import annotations

import functools
import http.server
import io
import shutil
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
OUT_PUBLIC = ROOT / "public" / "playbooks"
OUT_DIST = DIST / "playbooks"
PORT = 4399

FOOTER = """
<div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;color:#A8A29E;
            padding:0 17mm;display:flex;justify-content:space-between;letter-spacing:.06em;">
  <span>SOLVX<span style="color:#C8814A">.AI</span> &nbsp;·&nbsp; {title}</span>
  <span>cal.com/solvx-ai/15min &nbsp;·&nbsp; <span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>
"""


def serve() -> socketserver.TCPServer:
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args, **kwargs):  # keep the console readable
            pass
    handler = functools.partial(Quiet, directory=str(DIST))
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main() -> int:
    print_root = DIST / "playbooks" / "print"
    if not print_root.exists():
        print("dist/playbooks/print not found — run `astro build` first", file=sys.stderr)
        return 1
    slugs = sorted(p.name for p in print_root.iterdir() if p.is_dir())
    OUT_PUBLIC.mkdir(parents=True, exist_ok=True)
    OUT_DIST.mkdir(parents=True, exist_ok=True)

    httpd = serve()
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            page = browser.new_page()
            for slug in slugs:
                base = f"http://127.0.0.1:{PORT}/playbooks/print/{slug}"
                # Cover
                page.goto(f"{base}/cover/", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                cover = page.pdf(format="A4", print_background=True, prefer_css_page_size=True,
                                 margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
                # Interior
                page.goto(f"{base}/", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                title = page.evaluate("document.querySelector('.kick')?.textContent || ''").strip()
                interior = page.pdf(format="A4", print_background=True, prefer_css_page_size=True,
                                    display_header_footer=True, header_template="<span></span>",
                                    footer_template=FOOTER.format(title=title),
                                    margin={"top": "18mm", "right": "17mm", "bottom": "20mm", "left": "17mm"})
                writer = PdfWriter()
                for blob in (cover, interior):
                    for p in PdfReader(io.BytesIO(blob)).pages:
                        writer.add_page(p)
                writer.add_metadata({"/Title": title or slug, "/Author": "SolvX.AI",
                                     "/Subject": "SolvX field playbook", "/Creator": "SolvX.AI"})
                name = f"solvx-{slug}.pdf"
                with open(OUT_PUBLIC / name, "wb") as fh:
                    writer.write(fh)
                shutil.copy2(OUT_PUBLIC / name, OUT_DIST / name)
                pages = len(PdfReader(OUT_PUBLIC / name).pages)
                print(f"  {name}: {pages} pages, {(OUT_PUBLIC / name).stat().st_size // 1024} KB")
            browser.close()
    finally:
        httpd.shutdown()
    print(f"Done: {len(slugs)} playbooks -> {OUT_PUBLIC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
