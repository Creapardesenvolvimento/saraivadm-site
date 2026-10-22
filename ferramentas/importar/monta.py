"""Transforma os blocos extraídos em dados de página (seções) e baixa as imagens.
uso: python monta.py blocos.json config.json projeto_dir
"""
import sys, re, json, os, subprocess, unicodedata

blocos_path, config_path, projeto = sys.argv[1:4]
dados = json.load(open(blocos_path, encoding='utf-8'))
slug = dados['slug']
cfg = json.load(open(config_path, encoding='utf-8'))[slug]
nome = cfg['nome']
img_dir = os.path.join(projeto, 'src', 'assets', 'img', 'paginas', slug)
os.makedirs(img_dir, exist_ok=True)

LIXO = re.compile(r'você não pode copiar|etiqueta-com-sombra', re.I)
SIGLAS = ['MLC', 'TV', 'UV', 'UVB', 'PVC', 'SP', 'IBAMA', 'LED', 'DuPont', 'Melinex', 'PergoConfort', 'Pergoconfort', 'Triângulo', 'Saraiva', 'Design', 'Manoa']


CORRECOES = {'/portfolio-pergolado-de-madeira/': '/portfolio/', 'Duvidas pergoplac': 'Dúvidas sobre a PergoPlac', '/cobertura-para-pergolados-2/': '/cobertura-para-pergolado/', 'lazerz': 'lazer', 'CHURRASQUERIA': 'CHURRASQUEIRA', 'Churrasqueria': 'Churrasqueira', 'churrasqueria': 'churrasqueira'}


def corrigir(t):
    for a, b in CORRECOES.items():
        t = t.replace(a, b)
    return t


def frase(t):
    t = corrigir(re.sub(r'\s+', ' ', t).strip().rstrip(':.').strip())
    letras = [c for c in t if c.isalpha()]
    if letras and sum(c.isupper() for c in letras) / len(letras) > 0.7:
        t = t.lower()
        t = t[0].upper() + t[1:]
        for s in SIGLAS:
            t = re.sub(r'\b' + re.escape(s.lower()) + r'\b', s, t)
    return t[:1].upper() + t[1:]


def slugify(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:50]


# ---------- imagens: baixa e devolve o nome do arquivo ----------
mapa_img = {}


def baixar(url):
    if url in mapa_img:
        return mapa_img[url]
    base = os.path.basename(url.split('?')[0])
    nome_arq, ext = os.path.splitext(base)
    ext = ext.lower() if ext.lower() in ('.jpg', '.jpeg', '.png', '.webp', '.avif') else '.jpg'
    raiz = f'{len(mapa_img) + 1:03d}-{slugify(nome_arq)}'
    # reaproveita o arquivo já existente (mesmo que tenha sido convertido para outra extensão)
    for e in ('.jpg', '.jpeg', '.png', '.webp', '.avif'):
        if os.path.exists(os.path.join(img_dir, raiz + e)):
            mapa_img[url] = raiz + e
            return raiz + e
    arq = raiz + ext
    destino = os.path.join(img_dir, arq)
    original = re.sub(r'-\d+x\d+(?=\.\w+$)', '', url)
    ok = False
    for u in ([original, url] if original != url else [url]):
        if subprocess.run(['curl', '-sfL', u, '-o', destino]).returncode == 0 and os.path.getsize(destino) > 2000:
            ok = True
            break
    if not ok:
        if os.path.exists(destino):
            os.remove(destino)
        mapa_img[url] = None
        return None
    arq = otimizar(destino, arq)
    mapa_img[url] = arq
    return arq


def otimizar(destino, arq):
    """Reduz fotos muito grandes (máx. 2400px) e converte PNG sem transparência em JPG."""
    try:
        from PIL import Image as PImg
        im = PImg.open(destino)
        im.load()
    except Exception:
        return arq
    grande = os.path.getsize(destino) > 1.5 * 1024 * 1024 or im.width > 2400
    png_opaco = arq.endswith('.png') and im.mode in ('RGB', 'P', 'L') and 'transparency' not in im.info
    if not grande and not png_opaco:
        return arq
    if im.width > 2400:
        im = im.resize((2400, round(im.height * 2400 / im.width)), PImg.LANCZOS)
    if png_opaco or arq.endswith(('.jpg', '.jpeg')):
        novo = os.path.splitext(arq)[0] + '.jpg'
        im.convert('RGB').save(os.path.join(img_dir, novo), 'JPEG', quality=82, optimize=True, progressive=True)
        if novo != arq:
            os.remove(destino)
        return novo
    if arq.endswith('.webp'):
        im.save(destino, 'WEBP', quality=82)
    elif arq.endswith('.png'):
        im.save(destino, 'PNG', optimize=True)
    return arq


def baixar_thumb_yt(vid):
    arq = f'yt-{vid}.jpg'
    destino = os.path.join(img_dir, arq)
    if not os.path.exists(destino):
        for q in ('maxresdefault', 'hqdefault'):
            r = subprocess.run(['curl', '-sfL', f'https://i.ytimg.com/vi/{vid}/{q}.jpg', '-o', destino])
            if r.returncode == 0 and os.path.getsize(destino) > 2000:
                break
    return arq


bl = [b for b in dados['blocos'] if not (b['tipo'] == 'html' and LIXO.search(b['html'])) and not (b['tipo'] == 'img' and LIXO.search(b['src']))]

# ---------- topo (hero) ----------
hero_img, hero_titulo, hero_texto = None, nome, None
i = 0
while i < len(bl) and bl[i]['tipo'] != 'h':
    if bl[i]['tipo'] == 'img' and not hero_img:
        hero_img = bl[i]['src']
    i += 1
if i < len(bl) and bl[i]['nivel'] == 1:
    i += 1
    if i < len(bl) and bl[i]['tipo'] == 'h' and bl[i]['nivel'] == 2 and len(bl[i]['texto']) > 50 and i + 1 < len(bl) and bl[i + 1]['tipo'] == 'h':
        hero_texto = bl[i]['texto']
        i += 1
resto = bl[i:]

# imagem única logo antes de um título pertence à seção seguinte
for k in range(len(resto) - 1):
    if resto[k]['tipo'] == 'img' and resto[k + 1]['tipo'] == 'h' and resto[k + 1]['nivel'] == 2 and (k == 0 or resto[k - 1]['tipo'] != 'img'):
        resto[k]['_proxima'] = True

# ---------- seções ----------
secoes, atual, pendente = [], None, []


def nova(titulo):
    global atual
    atual = {'titulo': titulo, 'itens': [], 'faq': []}
    secoes.append(atual)
    if pendente:
        atual['itens'].extend(pendente)
        pendente.clear()


nova(None)
for b in resto:
    t = b['tipo']
    if t == 'h':
        nova(b['texto'])
        continue
    if t == 'img' and b.get('_proxima'):
        pendente.append({'t': 'img', 'src': b['src'], 'alt': b.get('alt', '')})
        continue
    if t == 'faq':
        atual['faq'].append(b)
    elif t == 'html':
        atual['itens'].append({'t': 'html', 'html': b['html'], 'n': b['n']})
    elif t == 'sub':
        atual['itens'].append({'t': 'sub', 'texto': b['texto']})
    elif t == 'img':
        atual['itens'].append({'t': 'img', 'src': b['src'], 'alt': b.get('alt', '')})
    elif t == 'video':
        atual['itens'].append({'t': 'video', 'id': b['id']})
    elif t == 'pdf':
        if not any(x.get('href') == b['href'] for s in secoes for x in s['itens']):
            atual['itens'].append({'t': 'pdf', 'href': b['href'], 'texto': b.get('texto', '')})
if pendente:
    atual['itens'].extend(pendente)


def parece_sub(html):
    puro = re.sub('<[^>]+>', '', html).strip()
    return len(puro) < 70 and html.count('<p>') == 1 and '<strong>' in html


def agrupar(itens, titulo_secao):
    """Junta itens em blocos de exibição, preservando a ordem."""
    out = []
    k = 0
    while k < len(itens):
        it = itens[k]
        if it['t'] == 'html':
            html = corrigir(it['html'])
            k += 1
            if not parece_sub(html):
                while k < len(itens) and itens[k]['t'] == 'html' and not parece_sub(itens[k]['html']):
                    html += corrigir(itens[k]['html'])
                    k += 1
            # parágrafo curto só com destaque vira subtítulo
            puro = re.sub('<[^>]+>', '', html).strip()
            if parece_sub(html):
                out.append({'t': 'sub', 'texto': frase(puro)})
            else:
                out.append({'t': 'html', 'html': html})
        elif it['t'] == 'sub':
            # pares subtítulo + texto em sequência viram cards
            pares, j = [], k
            while j + 1 < len(itens) and itens[j]['t'] == 'sub' and itens[j + 1]['t'] == 'html':
                pares.append({'titulo': frase(itens[j]['texto']), 'html': itens[j + 1]['html']})
                j += 2
            if len(pares) >= 3:
                out.append({'t': 'cards', 'itens': pares})
                k = j
            else:
                out.append({'t': 'sub', 'texto': frase(it['texto'])})
                k += 1
        elif it['t'] == 'img':
            run = []
            while k < len(itens) and itens[k]['t'] == 'img':
                arq = baixar(itens[k]['src'])
                if arq:
                    run.append({'arquivo': arq, 'alt': itens[k]['alt']})
                k += 1
            if len(run) == 1:
                out.append({'t': 'img', **run[0]})
            elif run:
                # logos de clientes/parceiros: maioria PNG ou texto anterior fala de empresas/clientes
                anterior = ' '.join(x.get('texto', '') + x.get('html', '') for x in out[-2:])
                pngs = sum(f['arquivo'].endswith('.png') for f in run)
                logos = len(run) >= 3 and (pngs >= len(run) * 0.7 or re.search(r'empresas que|clientes|parceiros', anterior, re.I))
                out.append({'t': 'logos' if logos else 'galeria', 'fotos': run})
        elif it['t'] == 'video':
            run = []
            while k < len(itens) and itens[k]['t'] == 'video':
                run.append({'id': itens[k]['id'], 'capa': baixar_thumb_yt(itens[k]['id'])})
                k += 1
            out.append({'t': 'videos', 'videos': run})
        elif it['t'] == 'pdf':
            out.append({'t': 'pdf', 'href': it['href'], 'texto': it['texto']})
            k += 1
    # foto seguida de texto (ou texto seguido de foto) vira linha lado a lado
    final_out = []
    for x in out:
        ant = final_out[-1] if final_out else None
        if ant and ((ant['t'] == 'img' and x['t'] == 'html') or (ant['t'] == 'html' and x['t'] == 'img' and len(final_out) >= 2 and final_out[-2]['t'] == 'linha')):
            img = ant if ant['t'] == 'img' else x
            html = x if x['t'] == 'html' else ant
            final_out[-1] = {'t': 'linha', 'arquivo': img['arquivo'], 'alt': img['alt'], 'html': html['html']}
        else:
            final_out.append(x)
    return final_out


final = []
for s in secoes:
    titulo = frase(s['titulo']) if s['titulo'] else None
    blocos_exib = agrupar(s['itens'], titulo)
    if titulo and re.search(r'download.*folder', titulo, re.I):
        pdf = next((x['href'] for x in blocos_exib if x['t'] == 'pdf'), None)
        capa = next((x['arquivo'] for x in blocos_exib if x['t'] == 'img'), None)
        if pdf:
            final.append({'tipo': 'folder', 'href': pdf, 'capa': capa})
        if not s['faq']:
            continue
        titulo = f"{nome} nas cidades que atendemos"
    if s['faq'] and not titulo:
        titulo = f"{nome} nas cidades que atendemos" if sum(1 for f in s['faq'] if re.search(r' (em|no|na) [A-ZÁÉ]', f['q'])) > len(s['faq']) / 2 else f"Mais sobre {nome.lower()}"
    if s['faq']:
        itens = []
        for f in s['faq']:
            arq = baixar(f['img']) if f.get('img') else None
            itens.append({'titulo': frase(f['q']), 'html': corrigir(f['html']), 'imagem': {'arquivo': arq, 'alt': frase(f['q'])} if arq else None})
        intro = [x for x in blocos_exib if x['t'] == 'html']
        final.append({'tipo': 'acordeao', 'titulo': titulo, 'intro': intro[0]['html'] if intro else None, 'itens': itens})
        continue
    if not blocos_exib:
        continue
    lead = None
    if titulo and len(titulo) > 85:
        lead, titulo = titulo, None
    tipos = [x['t'] for x in blocos_exib]
    texto_total = sum(len(re.sub('<[^>]+>', '', x.get('html', ''))) for x in blocos_exib)
    def como_uso(linha):
        return {'tipo': 'uso', 'titulo': titulo, 'html': linha['html'], 'imagem': {'arquivo': linha['arquivo'], 'alt': linha['alt'] or titulo}}

    usa_usos = not cfg.get('semUsos')
    # aplicação: um texto + uma foto
    if usa_usos and titulo and tipos == ['linha'] and texto_total < 1400:
        final.append(como_uso(blocos_exib[0]))
        continue
    # "texto + foto" seguido de "Algumas obras..." + galeria: separa em aplicação + galeria
    if usa_usos and titulo and len(tipos) >= 3 and tipos[0] == 'linha' and tipos[1] == 'sub' and 'galeria' in tipos[2:]:
        final.append(como_uso(blocos_exib[0]))
        titulo, blocos_exib = blocos_exib[1]['texto'], blocos_exib[2:]
    for x in blocos_exib:
        if x['t'] == 'galeria':
            for n, f in enumerate(x['fotos'], 1):
                f['alt'] = f['alt'] or f'{nome}: projeto Saraiva Design {n}'
        if x['t'] == 'img':
            x['alt'] = x['alt'] or (titulo or nome)
    final.append({'tipo': 'conteudo', 'titulo': titulo, 'lead': lead, 'blocos': blocos_exib})

# seção sem título no começo (texto de introdução)
for s in final:
    if s['tipo'] == 'conteudo' and not s['titulo']:
        s['titulo'] = cfg.get('tituloIntro') or f"Conheça {cfg.get('artigo', 'o')} {nome.lower()}"
        break

# agrupa aplicações consecutivas
agrupado = []
for s in final:
    if s['tipo'] == 'uso':
        if agrupado and agrupado[-1]['tipo'] == 'usos':
            agrupado[-1]['itens'].append(s)
        else:
            tit = cfg.get('tituloUsos') or f"Onde usar {cfg.get('artigo', 'o')} {nome.lower()}"
            if any(g.get('titulo') == tit for g in agrupado):
                tit = f"Mais ideias com {nome.lower()}"
            agrupado.append({'tipo': 'usos', 'titulo': tit, 'itens': [s]})
    else:
        agrupado.append(s)

hero_arq = baixar(hero_img) if hero_img else None
saida = {
    'slug': slug,
    'nome': nome,
    'seo': cfg['seo'],
    'hero': {'titulo': cfg.get('h1') or nome, 'texto': cfg.get('textoHero') or hero_texto, 'imagem': hero_arq},
    'faixa': cfg.get('faixa'),
    'tipo': cfg.get('tipo', 'produto'),
    'botoes': cfg.get('botoes'),
    'tituloForm': cfg.get('tituloForm'),
    'relacionados': cfg.get('relacionados', []),
    'secoes': agrupado,
}
os.makedirs(os.path.join(projeto, 'src', 'data', 'paginas'), exist_ok=True)
json.dump(saida, open(os.path.join(projeto, 'src', 'data', 'paginas', f'{slug}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
from collections import Counter
print(slug, '| seções:', dict(Counter(s['tipo'] for s in agrupado)), '| imagens:', sum(1 for v in mapa_img.values() if v), '| falhas:', sum(1 for v in mapa_img.values() if not v))
