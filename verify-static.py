"""Check runtime file references before publishing the static Pages site."""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent
errors = []
checked = 0


def check(source, value):
    global checked
    value = value.strip()
    if not value or value.startswith(("#", "//", "data:", "blob:")):
        return
    parts = urlsplit(value)
    if parts.scheme or parts.netloc or not parts.path:
        return
    path = unquote(parts.path)
    if path.startswith("/"):
        errors.append(f"{source.relative_to(ROOT)}: root-relative path fails on project Pages: {value}")
        return
    target = (source.parent / path).resolve()
    checked += 1
    if not target.exists():
        errors.append(f"{source.relative_to(ROOT)}: missing {value}")


class References(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("src", "href", "poster"):
            if attrs.get(key):
                check(self.source, attrs[key])
        if attrs.get("srcset"):
            for item in attrs["srcset"].split(","):
                check(self.source, item.strip().split(" ")[0])


for source in ROOT.rglob("*"):
    if any(part in {".git", "node_modules"} for part in source.parts):
        continue
    if source.suffix == ".html":
        References(source).feed(source.read_text(encoding="utf-8"))
    elif source.suffix == ".css":
        for value in re.findall(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", source.read_text(encoding="utf-8")):
            check(source, value)

for error in errors:
    print(error)
print(f"Checked {checked} local file references; {len(errors)} errors.")
sys.exit(bool(errors))
