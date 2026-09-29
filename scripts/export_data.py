"""Export reviewable data from the canonical static HTML; no dependencies.

Run: python scripts/export_data.py [--check]
Never fetches media or certifies inherited research claims.
"""
from html.parser import HTMLParser
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())


class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def text(self):
        return ''.join(child.text() if isinstance(child, Node) else child for child in self.children).strip()

    def find(self, tag=None, cls=None):
        result = []
        for child in self.children:
            if not isinstance(child, Node):
                continue
            if (tag is None or child.tag == tag) and (cls is None or cls in child.attrs.get('class', '').split()):
                result.append(child)
            result.extend(child.find(tag, cls))
        return result


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack)-1, 0, -1):
            if self.stack[index].tag == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def export():
    document = Document((ROOT/'index.html').read_text(encoding='utf-8')).root
    characters, sources, images = [], [], []
    source_ids = {}
    for card in document.find('details', 'card'):
        who = card.find(cls='who')[0]
        body = card.find(cls='body')[0]
        sections = body.find('section')
        evidence = next(link for link in body.find('a') if link.text().startswith('OPEN EVIDENCE'))
        url = evidence.attrs['href']
        if url not in source_ids:
            source_ids[url] = f'source-{len(sources)+1:03d}'
            sources.append({'id': source_ids[url], 'url': url,
                            'label': evidence.find('small')[0].text(),
                            'verification': 'pending-source-audit'})
        item = {
            'id': card.attrs['id'], 'caseNumber': card.find(cls='num')[0].text(),
            'name': who.find('b')[0].text(), 'alias': who.find('small')[0].text(),
            'status': card.find(cls='status')[0].text(), 'statusKey': card.attrs['data-k'],
            'branch': card.attrs['data-b'] == '1', 'encore': card.attrs['data-e'] == '1',
            'endgame': sections[0].find('p')[0].text(),
            'endpoint': sections[1].find('p')[0].text(),
            'endpointEra': sections[1].find('label')[0].text().split(' · ',1)[1],
            'reality': card.find(cls='meta')[0].find('b')[0].text(),
            'legacyConfidence': card.find(cls='meta')[0].find('b')[1].text(),
            'sourceIds': [source_ids[url]], 'verification': 'inherited-prototype-pending-audit',
        }
        characters.append(item)
        legacy_images = [{'url': image.attrs['src'], 'alt': image.attrs.get('alt','')}
                         for image in card.find('img')]
        images.append({'characterId': item['id'], 'localMcuAsset': None, 'localComicAsset': None,
                       'rightsStatus': 'not-cleared', 'provenanceStatus': 'pending',
                       'legacyRemoteImages': legacy_images})
    assert len(characters) == 88, 'Unexpected dossier loss or addition'
    assert len({item['id'] for item in characters}) == 88, 'Duplicate dossier ID'
    ids = {node.attrs['id'] for node in document.find() if 'id' in node.attrs}
    for node in document.find():
        if 'data-target' in node.attrs:
            assert node.attrs['data-target'] in ids, f'Broken target: {node.attrs}'
    reviewed_path = ROOT/'data/media.json'
    if reviewed_path.exists():
        reviewed = {row['characterId']:row for row in json.loads(reviewed_path.read_text(encoding='utf-8'))}
        for image in images:
            row = reviewed[image['characterId']]
            image.update(localMcuAsset=row.get('screen',{}).get('path'),
                         localComicAsset=row.get('comic',{}).get('path'),
                         provenanceStatus='source-recorded',
                         rightsStatus='see-per-asset-rights-in-media-json',legacyRemoteImages=[])
            for kind in ['screen','comic']:
                if kind in row:
                    assert (ROOT/row[kind]['path']).is_file(), 'Missing local image'
    return {'characters': characters, 'sources': sources, 'images': images}


if __name__ == '__main__':
    for name, rows in export().items():
        content = json.dumps(rows, ensure_ascii=False, indent=2) + '\n'
        path = ROOT/'data'/f'{name}.json'
        if '--check' in sys.argv:
            assert path.read_text(encoding='utf-8') == content, f'Stale export: {path}'
        else:
            path.write_text(content, encoding='utf-8')
        print(f'{name}: {len(rows)} records')
