# Importar páginas do site antigo (WordPress/Elementor)

Gera uma página de produto nova a partir da página equivalente em saraivadm.com.br.
O conteúdo vira `src/data/paginas/<slug>.json` e as fotos vão para `src/assets/img/paginas/<slug>/`.
O visual vem do template `src/pages/[slug].astro`.

## Passo a passo

1. Adicione a página em `config.json` (nome, artigo, SEO, faixa e produtos relacionados).
2. Baixe o HTML e extraia os blocos:

```bash
mkdir -p /d/saraiva-site-import/css /d/saraiva-site-import/json
cd /d/saraiva-site-import
curl -sL https://saraivadm.com.br/SLUG/ -o SLUG.html
python /d/saraiva-site/ferramentas/importar/extrai.py SLUG.html SLUG json/SLUG.json css
python /d/saraiva-site/ferramentas/importar/resumo.py json/SLUG.json   # confere a estrutura
```

3. Monte a página (baixa as imagens e gera o JSON final):

```bash
python /d/saraiva-site/ferramentas/importar/monta.py json/SLUG.json /d/saraiva-site/ferramentas/importar/config.json /d/saraiva-site
```

4. `npx astro build` e confira a página.

O que a importação faz sozinha: remove as versões duplicadas de celular do Elementor, listas de
palavras-chave (keyword stuffing), o aviso "Você não pode copiar conteúdo", corrige e-mail protegido
pelo Cloudflare, transforma títulos EM CAIXA ALTA em frase normal e agrupa aplicações, galerias,
vantagens (cards), dúvidas, dicas e cidades.
