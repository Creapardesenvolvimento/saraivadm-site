"""
Divide as fotos de "antes e depois" (montagens com o antes em cima e o depois embaixo)
em duas imagens do mesmo tamanho, para o comparador com a linha que arrasta.

Uso (na raiz do projeto):  python ferramentas/dividir-antes-depois.py

Lê:   src/assets/img/paginas/antes-depois/NNN-*.jpg
Grava: src/assets/img/paginas/antes-depois/comparar/NNN-antes.jpg e NNN-depois.jpg

O selo redondo da Saraiva no meio da montagem e a faixa branca que separa as fotos
ficam de fora; o resto da foto é mantido.
"""
import glob
import os
import sys

import numpy as np
from PIL import Image

PASTA = 'src/assets/img/paginas/antes-depois'
SAIDA = os.path.join(PASTA, 'comparar')


def linhas_brancas(a, x0, x1, limite):
    """Fração de pixels quase brancos por linha, entre as colunas x0 e x1."""
    trecho = a[:, x0:x1]
    return ((trecho > 228).all(axis=2)).mean(axis=1) > limite


def dividir(caminho):
    im = Image.open(caminho).convert('RGB')
    a = np.asarray(im).astype(int)
    h, w, _ = a.shape
    meio = h // 2
    janela = range(int(h * 0.42), int(h * 0.58))

    # Faixa branca entre as fotos (fora do selo central)
    branca = linhas_brancas(a, 0, int(w * 0.3), 0.9) & linhas_brancas(a, int(w * 0.7), w, 0.9)
    faixa = [y for y in janela if branca[y]]
    if faixa:
        topo_fim, base_ini = min(faixa), max(faixa) + 1
    else:
        # Sem faixa: procura a maior mudança entre linhas vizinhas perto do meio
        dif = np.abs(np.diff(a[:, :, :].mean(axis=(1, 2))))
        y = max(janela, key=lambda k: dif[k])
        topo_fim, base_ini = y + 1, y + 1

    # Selo no centro: as margens brancas dele (logo à esquerda e à direita do desenho),
    # encostadas na divisão. Selo grande (redondo) ou pequeno (quadrado), conforme o modelo.
    def margem(x0, x1):
        return ((a[:, int(w * x0):int(w * x1)] > 225).all(axis=2)).mean(axis=1) > 0.9

    selo = (margem(0.455, 0.465) & margem(0.535, 0.545)) | (
        ((a[:, int(w * 0.42):int(w * 0.58)] > 215).all(axis=2)).mean(axis=1) > 0.6
    )
    cima = topo_fim
    while cima > meio - h * 0.12 and selo[cima - 1]:
        cima -= 1
    baixo = base_ini
    while baixo < meio + h * 0.12 and selo[baixo]:
        baixo += 1
    # Margem de segurança para a sombra e a borda do selo
    cima = max(0, cima - 6)
    baixo = min(h, baixo + 6)

    # As duas metades precisam do mesmo tamanho. A maior perde o excesso no lado da divisão,
    # para manter as etiquetas "Antes" (no alto) e "Depois" (embaixo).
    altura = min(cima, h - baixo)
    antes = im.crop((0, 0, w, altura))
    depois = im.crop((0, h - altura, w, h))
    return antes, depois, (cima, baixo, altura)


def main():
    os.makedirs(SAIDA, exist_ok=True)
    arquivos = sorted(glob.glob(os.path.join(PASTA, '[0-9][0-9][0-9]-*.jpg')))
    arquivos = [f for f in arquivos if 'capa' not in os.path.basename(f)]
    for f in arquivos:
        n = os.path.basename(f)[:3]
        antes, depois, info = dividir(f)
        antes.save(os.path.join(SAIDA, f'{n}-antes.jpg'), quality=95, subsampling=0)
        depois.save(os.path.join(SAIDA, f'{n}-depois.jpg'), quality=95, subsampling=0)
        print(n, antes.size, 'corte', info)
    print(len(arquivos), 'montagens divididas em', SAIDA)


if __name__ == '__main__':
    sys.exit(main())
