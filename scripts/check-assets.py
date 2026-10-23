"""Catch missing static assets and incorrect GitHub Pages base paths after build."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / 'dist'
BASE = '/civontology-notebooks/'


class Assets(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        ref = None
        if tag in ('script', 'img'):
            ref = attrs.get('src')
        elif tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon', 'shortcut icon', 'modulepreload'):
            ref = attrs.get('href')
        if not ref or urlsplit(ref).scheme or ref.startswith('//'):
            return
        path = unquote(urlsplit(ref).path)
        if path.startswith('/'):
            assert path.startswith(BASE), f'{self.page}: asset missing base path: {ref}'
            target = ROOT / path[len(BASE):]
        else:
            target = self.page.parent / path
        assert target.is_file(), f'{self.page}: missing asset: {ref}'
        self.count += 1


parser = Assets()
parser.count = 0
pages = list(ROOT.rglob('*.html'))
assert pages, 'No built HTML to check'
for parser.page in pages:
    parser.feed(parser.page.read_text())
assert parser.count, 'No local assets were checked'
assert 'https://giscus.app/client.js' in (ROOT / 'forum/index.html').read_text(), 'Forum embed missing'
print(f'Checked {parser.count} local asset references across {len(pages)} pages.')
