"""Extrai o conteúdo de uma página do WordPress/Elementor do site atual para um JSON de blocos.
uso: python extrai.py pagina.html slug saida.json pasta_css
"""
import sys, re, json, os
from collections import Counter
from bs4 import BeautifulSoup, NavigableString, Tag

html_path, slug, out_path, css_dir = sys.argv[1:5]
raw = open(html_path, encoding='utf-8').read()
s = BeautifulSoup(raw, 'html.parser')

# ---------- imagens de fundo definidas no CSS do Elementor ----------
bg = {}
for css_url in sorted(set(re.findall(r"(https?://[^'\"]*?/elementor/css/post-\d+\.css)", raw))):
    fn = os.path.join(css_dir, os.path.basename(css_url))
    if not os.path.exists(fn):
        os.system(f'curl -s "{css_url}" -o "{fn}"')
    css = open(fn, encoding='utf-8', errors='ignore').read()
    css_desk = re.sub(r'@media[^{]*max-width[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}', '', css)
    for m in re.finditer(r'\.elementor-element-([0-9a-f]{6,8})[^{]*\{[^}]*?background-image:\s*url\("?([^")]+)"?\)', css_desk):
        bg.setdefault(m.group(1), m.group(2))


def bg_inline(el):
    st = el.get('style') or ''
    m = re.search(r"background(?:-image)?:[^;]*url\(['\"]?([^'\")]+)", st)
    return m.group(1) if m else None


main = s.find('main') or s.body
for t in main.select('script, style, noscript, .elementor-location-header, .elementor-location-footer, footer, form'):
    t.decompose()

YT = re.compile(r'(?:youtube(?:-nocookie)?\.com/(?:embed/|watch\?v=|vi/)|youtu\.be/|img\.youtube\.com/vi/|i\.ytimg\.com/vi/)([\w-]{11})')


def abs_url(u):
    if not u:
        return u
    u = u.strip()
    if u.startswith('//'):
        u = 'https:' + u
    if u.startswith('/'):
        u = 'https://saraivadm.com.br' + u
    u = re.sub(r'https?://saraivadm\.com\.br//+', 'https://saraivadm.com.br/', u)
    return u.replace('tuca-saraivanovo.5c97ew.easypanel.host', 'saraivadm.com.br')


ALLOWED = {'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'h3', 'h4', 'br'}


def clean(node):
    out = []
    for ch in node.children:
        if isinstance(ch, NavigableString):
            out.append(re.sub(r'\s+', ' ', str(ch)).replace('<', '&lt;'))
            continue
        if not isinstance(ch, Tag):
            continue
        name = ch.name
        if name in ('img', 'style', 'script', 'button', 'figure', 'iframe', 'svg'):
            continue
        name = {'b': 'strong', 'i': 'em', 'h5': 'h4', 'h6': 'h4'}.get(name, name)
        inner = clean(ch)
        if name in ALLOWED:
            if name == 'a':
                href = (ch.get('href') or '').strip()
                href = re.sub(r'^https?://saraivadm\.com\.br/+', '/', href)
                if 'cdn-cgi/l/email-protection' in href:
                    out.append('<a href="mailto:contato@saraivadm.com.br">contato@saraivadm.com.br</a>')
                    continue
                if not href or href == '#' or 'seusite.com' in href or 'whatsapp' in href or 'wa.me' in href:
                    out.append(inner)
                    continue
                ext = href.startswith('http')
                out.append(f'<a href="{href}"' + (' target="_blank" rel="noopener"' if ext else '') + f'>{inner}</a>')
            elif name == 'br':
                out.append('<br>')
            else:
                inner = inner.strip()
                if inner:
                    out.append(f'<{name}>{inner}</{name}>')
        else:
            out.append(inner)
    return ''.join(out)


def is_kw_list(t):
    parts = [x.strip() for x in t.split(',')]
    return len(parts) >= 6 and sum(1 for x in parts if re.search(r'\b(em|no|na)\b', x)) >= len(parts) * 0.7 and t.count('. ') == 0


def txt(el):
    return re.sub(r'[\sㅤ ]+', ' ', el.get_text(' ', strip=True)).strip()


CTA = re.compile(r'^(or[çc]amento imediato|solicitar or[çc]amento|fale com (um|nosso) especialista.*|quero saber mais.*|saiba mais|download aqui!?|clique aqui|ver mais|leia mais|solicite.*or[çc]amento.*|gostaria de mais informa[çc][õo]es ?\??)$', re.I)

blocos = []
vistos_txt, vistas_img, vistos_vid = set(), set(), set()


def add_img(url, alt=''):
    url = abs_url(url)
    if not url or url.startswith('data:'):
        return
    low = url.lower()
    if any(k in low for k in ('.svg', 'logo', 'icone', 'icon', 'whatsapp', 'emoji', 'gravatar', 'bege-scaled', 'youtube')):
        return
    base = re.sub(r'-\d+x\d+(?=\.\w+$)', '', url)
    if base in vistas_img:
        return
    vistas_img.add(base)
    blocos.append({'tipo': 'img', 'src': url, 'alt': (alt or '').strip()})


def add_vid(vid):
    if vid in vistos_vid:
        return
    vistos_vid.add(vid)
    blocos.append({'tipo': 'video', 'id': vid})


def walk(el):
    for ch in el.children:
        if not isinstance(ch, Tag):
            continue
        classes = ch.get('class') or []
        if 'elementor-hidden-desktop' in classes:
            continue
        if ch.name in ('script', 'style', 'noscript', 'svg', 'form', 'select', 'input', 'textarea', 'button', 'nav'):
            continue
        did = ch.get('data-id')
        if did and did in bg:
            add_img(bg[did])
        b = bg_inline(ch)
        if b:
            m = YT.search(b)
            add_vid(m.group(1)) if m else add_img(b)
        for attr in ('data-yt', 'data-video', 'data-settings', 'data-src'):
            v = ch.get(attr)
            if v:
                m = YT.search(v)
                if m:
                    add_vid(m.group(1))
                elif attr == 'data-yt' and re.fullmatch(r'[\w-]{11}', v):
                    add_vid(v)
        if 'faq-item' in classes:
            trig, cont = ch.select_one('.faq-trigger'), ch.select_one('.faq-content')
            if trig and cont:
                q = txt(trig)
                imgs = [abs_url(i.get('src')) for i in cont.find_all('img') if i.get('src')]
                body = clean(cont)
                partes = re.findall(r'<(?:p|ul|ol|h3|h4)>.*?</(?:p|ul|ol|h3|h4)>', body, flags=re.S)
                body = ''.join(x for x in partes if not is_kw_list(re.sub('<[^>]+>', '', x))) or body
                if ('faq', q) not in vistos_txt:
                    vistos_txt.add(('faq', q))
                    blocos.append({'tipo': 'faq', 'q': q, 'html': body.strip(), 'img': imgs[0] if imgs else None})
            continue
        if ch.name in ('h1', 'h2'):
            t = txt(ch)
            if t and not CTA.match(t):
                blocos.append({'tipo': 'h', 'nivel': 1 if ch.name == 'h1' else 2, 'texto': t})
            continue
        if ch.name in ('p', 'ul', 'ol', 'h3', 'h4', 'h5', 'h6', 'blockquote'):
            t = txt(ch)
            for im in ch.find_all('img'):
                add_img(im.get('src'), im.get('alt'))
            if not t or CTA.match(t) or is_kw_list(t):
                continue
            name = {'h5': 'h4', 'h6': 'h4', 'blockquote': 'p'}.get(ch.name, ch.name)
            if (name, t) in vistos_txt:
                continue
            vistos_txt.add((name, t))
            if ch.name in ('h3', 'h4', 'h5', 'h6') and len(t) < 140:
                blocos.append({'tipo': 'sub', 'texto': t})
            else:
                blocos.append({'tipo': 'html', 'html': f'<{name}>{clean(ch).strip()}</{name}>', 'n': len(t)})
            continue
        if ch.name == 'img':
            best = ch.get('data-src') or ch.get('src')
            srcset = ch.get('srcset') or ''
            if srcset:
                cands = [c.strip().split(' ') for c in srcset.split(',') if c.strip()]
                try:
                    best = max(cands, key=lambda c: int(re.sub(r'\D', '', c[1]) or 0))[0]
                except Exception:
                    pass
            m = YT.search(best or '')
            if m:
                add_vid(m.group(1))
            else:
                add_img(best, ch.get('alt'))
            continue
        if ch.name == 'iframe':
            m = YT.search(ch.get('src') or ch.get('data-src') or '')
            if m:
                add_vid(m.group(1))
            continue
        if ch.name == 'a':
            href = ch.get('href') or ''
            m = YT.search(href)
            if m:
                add_vid(m.group(1))
            if href.lower().split('?')[0].endswith('.pdf'):
                blocos.append({'tipo': 'pdf', 'href': abs_url(href), 'texto': txt(ch)})
            # galerias do Elementor: o link aponta para a foto grande
            if re.search(r'/wp-content/uploads/.+\.(jpe?g|png|webp|avif)$', href.lower().split('?')[0]):
                add_img(href, ch.get('data-elementor-lightbox-title') or '')
        walk(ch)


walk(main)
title = (s.title.string if s.title else '').strip()
json.dump({'slug': slug, 'titleOriginal': title, 'blocos': blocos}, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(slug, dict(Counter(b['tipo'] for b in blocos)))
