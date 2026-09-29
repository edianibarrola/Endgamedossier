"""Render reviewed local assets into static HTML. No browser-side fetch required."""
from pathlib import Path
import json
import re
from html import escape

ROOT = Path(__file__).resolve().parents[1]


def image_markup(asset, css_class=''):
    return (f'<img class="{css_class}" src="./{escape(asset["path"], quote=True)}" '
            f'width="{asset["width"]}" height="{asset["height"]}" '
            f'alt="{escape(asset["alt"], quote=True)}" loading="lazy" decoding="async">')


def figure(asset, name, comic=False):
    label = 'COMICS REFERENCE' if comic else ('PERFORMER PORTRAIT' if asset['kind'] == 'actor' else 'MCU CHARACTER REFERENCE')
    return (f'<figure class="evidence-figure"><div class="evidence-image {"comic" if comic else "mcu"}">'
            f'{image_markup(asset)}<span class="image-type">{label}</span></div>'
            f'<figcaption><b>{escape(asset["caption"])}</b>'
            f'<details class="image-credit"><summary>Image source &amp; credit</summary>'
            f'<p>{escape(asset["credit"])}</p><p>{escape(asset["rightsLabel"])}</p>'
            f'<a href="{escape(asset["sourcePage"], quote=True)}" target="_blank" rel="noopener noreferrer">Source / character reference ↗</a>'
            f'<a href="{escape(asset["filePage"], quote=True)}" target="_blank" rel="noopener noreferrer">Original image and usage details ↗</a>'
            '</details></figcaption></figure>')


def render():
    media = json.loads((ROOT/'data/media.json').read_text(encoding='utf-8'))
    by_id = {row['characterId']:row for row in media}
    text = (ROOT/'index.html').read_text(encoding='utf-8')
    def dossier(match):
        card = match[0]
        row = by_id[re.search(r'id="(dossier-\d+)"',card)[1]]
        visuals = '<div class="visuals media-pair">'
        if row.get('screen'):
            visuals += figure(row['screen'],row['name'])
        else:
            visuals += (f'<div class="identity-plate"><span>TVA PERSONNEL RECORD</span><b>{escape(row["name"])}</b>'
                        '<p>No verified portrait available. Identity retained in the archive.</p></div>')
        if row.get('comic'):
            visuals += figure(row['comic'],row['name'],True)
        else:
            if row.get('comicPage'):
                message='Comic correspondence is recorded; artwork is not available in this edition.'
                link=f'<a href="{escape(row["comicPage"],quote=True)}" target="_blank" rel="noopener noreferrer">Explore comics reference ↗</a>'
            else:
                message='No direct comic counterpart is assigned in this archive.'
                link=''
            visuals += f'<div class="identity-plate comic-note"><span>COMICS CORRESPONDENCE</span><b>IDENTITY NOTES</b><p>{message}</p>{link}</div>'
        visuals += '<div class="compare">SCREEN IDENTITY <i></i> COMICS CORRESPONDENCE</div></div>'
        card = re.sub(r'<div class="visuals.*?<div class="rail">',lambda _:visuals+'<div class="rail">',card,flags=re.S)
        return card
    text = re.sub(r'<details class="card.*?</div></details>',dossier,text,flags=re.S)
    # Cards and map nodes reuse the same verified subject image, never remote URLs.
    def hero(match):
        tag,body=match[1],match[2]
        row=by_id[re.search(r'data-target="([^"]+)"',tag)[1]]
        body=re.sub(r'<img[^>]*>','',body)
        if row.get('screen'):body=image_markup(row['screen'],'hero-image')+body
        return tag+body+'</a>'
    text=re.sub(r'(<a class="heroCard"[^>]*>)(.*?)</a>',hero,text,flags=re.S)
    def chip(match):
        tag,body=match[1],match[2]
        row=by_id[re.search(r'data-target="([^"]+)"',tag)[1]]
        body=re.sub(r'<img[^>]*>','',body)
        if row.get('screen'):body=body.replace('<span class="avatar">','<span class="avatar">'+image_markup(row['screen']))
        return tag+body+'</button>'
    text=re.sub(r'(<button[^>]*class="subjectchip"[^>]*>)(.*?)</button>',chip,text,flags=re.S)
    if './css/media.css' not in text:text=text.replace('</head>','<link rel="stylesheet" href="./css/media.css">\n</head>')
    if './js/media.js' not in text:text=text.replace('</body>','<script src="./js/media.js"></script>\n</body>')
    (ROOT/'index.html').write_text(text,encoding='utf-8')
    print('Rendered media for',len(media),'dossiers')


if __name__ == '__main__':
    render()
