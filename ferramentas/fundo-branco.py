"""Lista as imagens com fundo branco (cantos e bordas brancos) em src/assets/img.

O site usa a lista (src/data/fundoBranco.json) para deixar branco o espaço em volta dessas imagens,
em vez do bege, para a imagem não aparecer como um retângulo branco sobre o bege.

Rodar depois de acrescentar imagens:  python ferramentas/fundo-branco.py
"""
import glob
import json
import os

from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


def fundo_branco(caminho: str) -> bool:
    try:
        im = Image.open(caminho).convert('RGBA')
    except Exception:
        return False
    w, h = im.size
    pontos = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3), (w // 2, 2), (w // 2, h - 3), (2, h // 2), (w - 3, h // 2)]
    for p in pontos:
        r, g, b, a = im.getpixel(p)
        if a > 10 and min(r, g, b) < 245:
            return False
    return True


lista = sorted(
    os.path.basename(f)
    for f in glob.glob(os.path.join(RAIZ, 'src', 'assets', 'img', '**', '*.*'), recursive=True)
    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif')) and fundo_branco(f)
)
with open(os.path.join(RAIZ, 'src', 'data', 'fundoBranco.json'), 'w', encoding='utf-8') as arq:
    json.dump(lista, arq, ensure_ascii=False, indent=1)
print(len(lista), 'imagens com fundo branco')
