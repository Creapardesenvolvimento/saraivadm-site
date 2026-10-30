# Registro de alterações de SEO — saraivadm.com.br

Cada entrada: data, página, o que mudou e por quê. O histórico completo de arquivos fica nos commits do GitHub.

---

## 2026-10-15 — Home recriada sem WordPress/Elementor

**Página:** `/` (home) e estrutura geral do site

### Técnico / performance
| Antes | Depois | Por quê |
|---|---|---|
| WordPress + Elementor + jQuery, ~20 arquivos CSS/JS | HTML estático, CSS e JS mínimos | Carregamento mais rápido (Core Web Vitals) |
| Imagens PNG de 2 a 3 MB cada (~33 MB na home) | WebP em vários tamanhos (30 a 260 KB), carregamento sob demanda | Velocidade, principalmente no celular |
| Foto do topo como `background` CSS | `<img>` com `fetchpriority="high"` | Melhora o LCP (maior elemento visível) |
| Vídeos do YouTube | Capa leve; o player só carrega no clique (youtube-nocookie) | Velocidade e privacidade |
| Fontes do Google Fonts carregadas 5 vezes | Fontes hospedadas no próprio site, uma vez | Velocidade e LGPD |
| Duas versões da home (desktop e celular) no mesmo HTML | Uma versão responsiva | Evita conteúdo e H1 duplicados |
| — | `.htaccess` com HTTPS, sem www, barra final, GZIP e cache | Uma única URL canônica por página |
| — | `sitemap-index.xml` automático + `robots.txt` | Indexação |

### On-page
| Item | Antes | Depois |
|---|---|---|
| `<title>` | "saraiva novo" | "Pergolados de Alto Padrão em Madeira e Aço \| Saraiva Design" |
| Meta description | (nenhuma) | "Pergolados de madeira e aço, forros de palha e bambu, decks, coberturas e piso de madeira sob medida. Projeto 3D e atendimento em todo o Brasil." |
| H1 | Dois H1: "Página de exemplo" + "Pergolados de alto padrão" (e outro na versão mobile) | Um H1: "Pergolados de alto padrão" |
| Canonical | URL do easypanel | `https://saraivadm.com.br/` |
| Open Graph | (nenhum) | Título, descrição e imagem para WhatsApp/Facebook |
| Textos ALT dos produtos | Só o nome ("Brises") | Descritivos ("Brises de madeira em fachada") |
| Blog na home | 3 cards "Lorem ipsum" sem link | Cards gerados dos posts reais, com link |
| Links do rodapé | 26 links com `href="#"` | URLs definitivas de cada produto/página |

### Dados estruturados (schema.org)
- `HomeAndConstructionBusiness`: nome, CNPJ, telefones, e-mail, endereço, coordenadas do showroom e área de atendimento (Brasil).
- `WebSite`
- Posts do blog: `BlogPosting` + `BreadcrumbList`.

### Conversão
- Botões "Atendimento" apontavam para `wa.me/5500000000000` (número inválido) → agora usam o WhatsApp 11 5194 3920 com mensagem pronta.
- Botões Maps/Waze apontavam para a página inicial dos apps → agora abrem o endereço do showroom.
- Formulário envia direto para contato@saraivadm.com.br (PHP no cPanel), com proteção anti-spam e página `/obrigado/` (útil para medir conversões no Google Ads/GA4).

### Pendências
- [ ] URLs reais das redes sociais (`src/data/site.ts`) — também entram no schema.
- [ ] Confirmar o endereço (o original estava "Av. Franscisco Alfredo Júnior"; foi corrigido para "Francisco").
- [ ] Confirmar qual número deve receber o botão "Atendimento".
- [ ] Mapear as URLs do site atual saraivadm.com.br e criar redirecionamentos 301 antes de publicar.
- [ ] Criar as páginas de produto (os links já apontam para elas).
- [ ] Revisar o texto do post "Pergolado de madeira precisa de manutenção?" (primeiro post real, substitui os cards "Lorem ipsum").

---

## 2026-10-15 — Página "Pergolado de madeira" recriada

**Página:** `/pergolado-de-madeira/` (mesma URL do site atual)
**Conteúdo:** todo o texto do site atual foi mantido (introdução, modelos caixa e com beiral, 9 aplicações, 23 dúvidas, 21 dicas, 32 cidades, vídeos, galeria e folder). Arquivo de conteúdo: `src/data/produtos/pergolado-de-madeira.json`.

### On-page
| Item | Antes | Depois |
|---|---|---|
| `<title>` | "Pergolado de Madeira - Saraivadm" | "Pergolado de Madeira Sob Medida em Garapeira \| Saraiva Design" |
| Meta description | (nenhuma) | "Pergolado de madeira de alto padrão, sob medida, em garapeira tipo exportação, com forro de palha ou bambu e telha Pergoconfort. Atendemos SP e todo o Brasil." |
| H1 | 4 H1 ("PERGOLADO DE MADEIRA" duas vezes, "Dúvidas…", "Dicas…") e um H1 vazio | 1 H1: "Pergolado de madeira" |
| H2/H3 | Títulos duplicados (versão desktop + celular) e com caracteres invisíveis ("Pergolado comㅤㅤㅤ Academia") | Hierarquia limpa: 11 H2 por seção, H3 em cada aplicação, modelo, dúvida, dica e cidade |
| Dúvidas, dicas e cidades | Acordeões em JavaScript, duplicados para desktop e celular | `<details>` nativo: o Google lê o texto mesmo fechado e sem JavaScript |
| Textos ALT | Vazios na galeria e nos modelos | Descritivos em todas as imagens |
| Trilha (breadcrumb) | (nenhuma) | Início › Pergolados › Pergolado de madeira (visível e no schema) |
| Links internos | Sem links para outros produtos | Bloco "Complete seu projeto" com 6 produtos relacionados |

### Dados estruturados
- `Service`: pergolado de madeira sob medida, fornecido pela empresa, com área atendida (Brasil + 32 cidades).
- `FAQPage` com as 23 perguntas e respostas.
- `BreadcrumbList`.

### Limpeza de conteúdo
- Removidos os parágrafos de lista de palavras-chave das cidades (ex.: "Pergolado em Campinas, Pergolado de madeira em Campinas, Pérgola em Campinas…"). O Google trata isso como *keyword stuffing*.
- Corrigidos erros: "telha ouvidro", "sensação de intimidação" (→ intimidade), "graças especiais" (→ ocasiões especiais), "Garulhos", "Santana Parnaíba", "Os melhores pelos de São José" (→ pergolados), entre outros.
- E-mail quebrado na dúvida sobre cidades atendidas (proteção do Cloudflare, "[email protected]") → contato@saraivadm.com.br. Telefone incompleto "(19) 4141-220" → números completos.
- Link quebrado `seusite.com/cobertura-pergolado` removido; `/cobertura-para-pergolados-2/` → `/cobertura-para-pergolado/`.

### Performance
- No site atual, as imagens de dúvidas, dicas e cidades vinham de outro servidor (`tuca-saraivanovo…easypanel.host`) com **certificado SSL vencido**: os navegadores podem bloquear essas fotos. Agora todas são servidas pelo próprio site, em WebP, e só carregam quando o item é aberto.
- Vídeos do YouTube só carregam no clique.

### Conversão
- Botões de WhatsApp com mensagem específica (modelo caixa, modelo com beiral, cada aplicação).
- Formulário de contato no fim da página.

### Pendências desta página
- [ ] O folder em PDF tem **98 MB** (pesado demais para baixar no celular e para o GitHub). Comprimir para menos de 10 MB e hospedar no site. Por enquanto o botão aponta para o PDF no WordPress atual.
- [ ] Links para posts do blog atual (`/5-dicas-para-montar-seu-pergolado/`, `/habitos-saudaveis-para-curtir-seu-pergolado/`) e páginas futuras (`/pergolados/`, `/cobertura-para-pergolado/`) precisam existir antes de publicar.
- [ ] A página tem ~25 mil palavras. Recomendação: transformar as 21 dicas em posts do blog e as 32 cidades em páginas locais próprias (ex.: `/pergolado-de-madeira-em-campinas/`), deixando aqui um resumo com links. Isso tende a ranquear melhor do que um único texto gigante.

---

## 2026-10-15 — Página "Pergolado metálico" recriada

**Página:** `/pergolado-metalico/` (mesma URL do site atual)
**Conteúdo:** todo o texto do site atual foi mantido (introdução, tipos, 7 aplicações, 23 dúvidas, 24 cidades, 3 vídeos, galeria de 8 projetos e folder). Arquivo de conteúdo: `src/data/produtos/pergolado-metalico.json`.

### On-page
| Item | Antes | Depois |
|---|---|---|
| `<title>` | "Pergolado Metálico - Saraivadm" | "Pergolado Metálico Sob Medida em Aço Carbono \| Saraiva Design" |
| Meta description | (nenhuma) | "Pergolado metálico sob medida em aço carbono com tratamento anticorrosivo, telha Pergoconfort e forro de palha ou bambu. Atendemos SP e todo o Brasil." |
| H1 | Mais de um H1 (incluindo os títulos dos blocos de dúvidas e cidades) | 1 H1: "Pergolado metálico" |
| Títulos das cidades | "Pergolado **de** metálico em Campinas" (erro de digitação em 24 títulos) | "Pergolado metálico em Campinas" |
| Link para a própria página | "os pergolados metálicos" apontava para a própria URL | Removido (link para a mesma página não ajuda o SEO) |
| Textos ALT | Vazios na galeria | Descritivos |
| Trilha (breadcrumb) | (nenhuma) | Início › Pergolados › Pergolado metálico |
| Links internos | — | "Complete seu projeto" com 6 produtos relacionados, incluindo o pergolado de madeira |

### Dados estruturados
- `Service` (pergolado metálico sob medida) com área atendida: Brasil + 24 cidades.
- `FAQPage` com 23 perguntas.
- `BreadcrumbList`.

### Limpeza de conteúdo
- Removidos os parágrafos de lista de palavras-chave das cidades (*keyword stuffing*).
- E-mail quebrado em 2 respostas (proteção do Cloudflare, "[email protected]") → contato@saraivadm.com.br.
- Telefone "(19) 4141-2200" (errado) → (19) 4141-2204 e (11) 5194-3920.

### Técnico
- Os estilos das páginas de produto foram centralizados em `src/styles/produto.css`. As próximas páginas de produto já saem com a mesma identidade.

### Pendências desta página
- [ ] O folder em PDF tem **133 MB**. Comprimir e hospedar no site; por enquanto o botão aponta para o PDF no WordPress atual.
- [ ] Confirmar os títulos dos vídeos 1 e 2 (usei títulos genéricos; o terceiro é "Pergolado metálico na casa de Daniel Zukerman", conforme a capa).
- [ ] Revisar o texto das aplicações: o original diz "feito de alumínio ou aço", mas a empresa trabalha com aço carbono.

---

## 2026-10-15 — Animações no site todo

**Páginas:** todas (home, produtos, blog)

- **Topo:** título, texto e botões sobem em sequência e a foto faz um leve zoom ao abrir a página.
- **Ao rolar:** seções, cards, fotos, dúvidas e vídeos surgem suavemente, em cascata.
- **Números da home** (+100mil, +5mil, +25, 100%) contam até o valor final.
- **Cabeçalho fixo:** depois de rolar a página, ele fica preso no topo, menor e com fundo marrom translúcido (o menu e o botão de WhatsApp ficam sempre à mão).
- **Dúvidas** abrem e fecham com altura animada (Chrome/Edge recentes; nos outros navegadores abrem direto).
- **Rolagem suave** nos links internos (ex.: "Ver projetos").

### Cuidados de SEO e acessibilidade
- O texto continua todo no HTML: o Google lê o conteúdo mesmo sem rodar as animações.
- O que já aparece na tela ao abrir a página nunca é escondido (sem "piscar" e sem atrasar o carregamento).
- Quem ativa "reduzir movimento" no celular ou computador vê o site sem animações.
- Sem bibliotecas externas: o script tem ~2 KB. Arquivo: `src/scripts/animacoes.ts` (para animar um elemento novo, basta incluir o seletor na lista do topo do arquivo ou usar o atributo `data-revelar`).

---

## 2026-10-15 — Padrão único de acabamento e espaçamento

**Páginas:** todas

- **Cantos quadrados em todo o site** (`--raio: 2px`): cards do blog (antes 20px), caixas internas (14px), botões (6px), campos do formulário, dúvidas, galeria, vídeos, botões Maps/Waze (antes totalmente arredondados) e ícones.
- **Espaçamento padronizado** (definido em `src/styles/global.css`):
  | Medida | Desktop | Tablet | Celular |
  |---|---|---|---|
  | Espaço de cada seção (em cima e embaixo) | 96px | 72px | 56px |
  | Título da seção → conteúdo | 56px | 40px | 32px |
  | Entre cards, fotos e itens | 24px | 16px | 16px |
  | Entre texto e imagem lado a lado | 64px | 36px | 36px |
  | Largura máxima do conteúdo | 1180px | — | — |
- Antes, as seções variavam entre 50px e 96px e as larguras entre 1180px, 1200px e 84% da tela. Agora todo o conteúdo começa na mesma linha em todas as páginas.
- Duas seções brancas seguidas (ex.: showroom + formulário) não somam espaço duplo.

---

## 2026-10-17 — Topo da home em tela cheia e botão padrão

- **Topo da home** ocupa a primeira dobra inteira (100% da altura da tela, em qualquer monitor). Título e texto maiores, conforme o layout desktop. A faixa marrom de diferenciais fica logo abaixo da dobra.
- **Dois botões no topo:** "Produtos" (leva à seção de produtos) e "Atendimento" com ícone do WhatsApp.
- **Botão padrão único** (`.btn` em `src/styles/global.css`): cantos quadrados, mesma tipografia e a mesma animação em todos — a cor de destaque preenche o botão da esquerda para a direita e ele sobe levemente.
- Aplicado em: botão do menu (agora com ícone do WhatsApp), topo da home e das páginas de produto, diferenciais, YouTube, blog, Maps/Waze, formulário, folder, "Fale com um especialista", 404 e página de obrigado.

---

## 2026-10-17 — Títulos padronizados, nome dos produtos e formulário centralizado

- **Todos os títulos de seção** seguem o padrão de "Nossos produtos": Montserrat semibold, 44px no desktop (30px no celular), marrom (claro sobre fundos escuros). Classe `.titulo-secao` em `src/styles/global.css`. Vale para home, páginas de produto, blog e formulário.
- **Nome dos produtos nos cards:** 20% maior (13px → 15,6px) e em negrito.
- **Formulário de contato:** título e campos centralizados, com largura máxima de 760px.

---

## 2026-10-17 — Depoimentos reais do Google na home

- Nova seção **"Depoimentos dos nossos clientes"** logo abaixo dos vídeos do YouTube, com nota **4,9 ★ e 158 avaliações** (link para o perfil no Google Maps).
- **10 avaliações reais de 5 estrelas** do Perfil da Empresa no Google, copiadas sem alterar o texto (`src/data/depoimentos.ts`).
- Carrossel com setas, barra de progresso e arraste no celular; textos longos com "Ler mais".
- Os textos estão no HTML da página (o Google lê), sem widget externo e sem carregar scripts do Google.
- **Não** foi adicionado schema de avaliações (`AggregateRating`/`Review`): o Google não exibe estrelas para avaliações que a própria empresa publica no site e pode tratar como marcação enganosa. As estrelas continuam aparecendo no Perfil da Empresa.
- Para atualizar: trocar/adicionar avaliações e a nota/total em `src/data/depoimentos.ts`.

---

## 2026-10-20 — 8 páginas de produto importadas do site atual + menu com submenus

**Páginas (mesmas URLs do site atual):** `/forro-de-palha/`, `/forro-em-esteiras-de-bambu/`, `/brise-de-madeira/`,
`/cobertura-para-pergolado/`, `/deck-de-madeira/`, `/mlc/`, `/pisos-de-madeira/`, `/forro-de-madeira/`.

- Conteúdo integral do site atual (textos, fotos, vídeos, PDFs, dúvidas, dicas e cidades), na identidade nova.
- Cada página: 1 H1, `<title>` e meta description novos (antes: "Nome - Saraivadm" e sem description), trilha,
  dados estruturados `Service` + `BreadcrumbList` + `FAQPage` (quando há dúvidas).
- Limpeza automática: versões duplicadas de celular do Elementor, listas de palavras-chave das cidades,
  aviso "Você não pode copiar conteúdo desta página", e-mail protegido do Cloudflare, títulos em caixa alta,
  erros como "lazerz" e "churrasqueria".
- Fotos convertidas para WebP em vários tamanhos; dúvidas, dicas e cidades em `<details>` (texto indexável).
- Template único `src/pages/[slug].astro` + importador em `ferramentas/importar/` para as próximas páginas.

**Links corrigidos para as URLs reais** (preserva o SEO e evita redirecionamentos):
- Cards da home e rodapé: `/forro-de-bambu/` → `/forro-em-esteiras-de-bambu/`, `/brises/` → `/brise-de-madeira/`,
  `/coberturas/` → `/cobertura-para-pergolado/`, `/decks/` → `/deck-de-madeira/`, `/pergolado-mlc/` → `/mlc/`,
  `/piso-de-madeira/` → `/pisos-de-madeira/`, `/sobre-nos/` → `/institucional/`, `/antes-e-depois/` → `/antes-depois/`.
- **Menu do topo com submenus** (como no site atual): Pergolados, Coberturas, Forros e Outros abrem a lista de produtos;
  Piso de madeira e Deck vão direto para a página. No celular, os submenus aparecem abertos dentro do menu.

### Pendências
- [ ] Páginas ainda não criadas (links do menu/rodapé já apontam para elas): telha-para-pergolado, pergoconfort,
  pergoconfort-max, forro-ripado, forro-de-lambril, painel-ripado, caramanchao, gazebo, pergokit, deck-modular,
  institucionais (institucional, portfolio, antes-depois, catalogos, contato, parcerias, trabalhe-conosco, redes-sociais),
  políticas e os 101 posts do blog.
- [ ] `/forro-de-madeira/` no site atual tem pouco texto (~300 caracteres). Vale enriquecer ou apontar para forro ripado/lambril.
- [ ] Folders e tabelas em PDF continuam apontando para o WordPress atual; precisam ser copiados (e comprimidos) antes de desligar o WordPress.

---

## 2026-10-20 — Mais 12 páginas de produto importadas (todas as de produto do site atual)

**Páginas (mesmas URLs do site atual):** `/telha-para-pergolado/`, `/pergoconfort/`, `/pergoconfort-max/`, `/pergoplac/`,
`/forro-ripado/`, `/forro-de-lambril/`, `/painel-ripado/`, `/caramanchao/`, `/gazebo/`, `/pergokit/`, `/deck-modular/`, `/deck-hidro-spa/`.

- Mesmo tratamento das anteriores: conteúdo integral, 1 H1, title/description novos, trilha, `Service` + `BreadcrumbList` + `FAQPage`.
- Menu e rodapé: PergoPlac (Coberturas) e Deck hidro-spa (Outros) incluídos; rodapé lista todos os produtos.
- **Imagens-fonte reduzidas:** 74 fotos acima de 2400px/1,5 MB foram redimensionadas (113 MB → 24 MB) com
  `ferramentas/otimizar-imagens.mjs`. O site continua servindo WebP otimizado; isso só deixa o repositório e o build leves.
- Links corrigidos: trilha "Início › Pergolados" (página inexistente) → "Início › Pergolado de madeira/metálico";
  `/cobertura-para-pergolados-2/` → `/cobertura-para-pergolado/` dentro dos textos.
- Título "Duvidas pergoplac" → "Dúvidas sobre a PergoPlac".

### Observações de conteúdo (site atual)
- `/deck-modular/` e `/deck-hidro-spa/` têm o **mesmo texto de introdução** (conteúdo duplicado). Vale reescrever um deles.
- `/pergoplac/` tem pouco conteúdo (1 parágrafo + dúvidas). Vale enriquecer.
- `/deck-modular/` tem duas seções com o mesmo título "Deck de madeira na piscina".

### Links internos ainda sem página (próximas etapas)
Institucionais (`/institucional/`, `/portfolio/`, `/antes-depois/`, `/catalogos/`, `/parcerias/`, `/trabalhe-conosco/`,
`/redes-sociais/`, `/contato/`), `/politica-de-privacidade/`, `/termos-de-uso/` e posts antigos do blog citados nos textos
(`/5-dicas-para-montar-seu-pergolado/`, `/habitos-saudaveis-para-curtir-seu-pergolado/`).

---

## 2026-10-20 — Páginas institucionais, políticas e redes sociais

**Páginas (mesmas URLs do site atual):** `/institucional/`, `/sustentabilidade/`, `/portfolio/`, `/antes-depois/`,
`/parcerias/`, `/catalogos/`, `/contato/`, `/trabalhe-conosco/`, `/redes-sociais/`.
**Novas:** `/politica-de-privacidade/` e `/termos-de-uso/` (o site atual não tinha; os links redirecionavam para a home).

- Institucional, sustentabilidade, portfólio (75 fotos de projetos + logos de clientes), antes e depois (67 fotos)
  e parcerias: importados com o mesmo template das páginas de produto, com dados estruturados `AboutPage`/`WebPage`.
- Catálogos: grade com capa, "Baixar PDF" e link para o produto (10 folders + 4 tabelas de preço).
- Contato: WhatsApp, telefones, e-mail, showroom com Maps/Waze, mapa e formulário (`ContactPage`).
- Trabalhe conosco: 21 áreas + candidatura pelo LinkedIn ou por e-mail.
- Redes sociais: YouTube, Instagram, TikTok, Pinterest, Google e LinkedIn com os textos do site atual.
- **Redes no rodapé e no schema (`sameAs`)**: perfis oficiais @saraivadesignoficial (Instagram, YouTube, TikTok,
  Pinterest), LinkedIn e Google Maps. O ícone do Facebook foi removido (o site atual não tem página no Facebook).
- Política de privacidade (LGPD) descrevendo o que o site faz (formulário, WhatsApp, YouTube sem cookies, Google Maps,
  sem rastreamento) e termos de uso. Aviso com link para a política abaixo do botão do formulário.
- Link antigo `/portfolio-pergolado-de-madeira/` → `/portfolio/`.
- Site completo: **36 páginas**, todas com 1 H1. Único link interno quebrado restante: posts antigos do blog citados
  nos textos (serão resolvidos na migração do blog).

### Pendências
- [ ] **Revisão jurídica** da Política de privacidade e dos Termos de uso antes da publicação definitiva.
- [ ] Confirmar o e-mail para currículos (hoje: contato@saraivadm.com.br).
- [ ] PDFs (folders e tabelas) ainda hospedados no WordPress atual.

---

## 2026-10-20 — Mega menu no desktop

- Ao passar o mouse (ou navegar pelo teclado) em **Pergolados, Coberturas, Forros e Outros**, abre um painel com
  todos os produtos do grupo: foto, nome e descrição curta, além de um texto do grupo e botão "Fale com um especialista"
  (WhatsApp com mensagem do grupo).
- Fotos vêm automaticamente da capa de cada página (`src/lib/imagemDaPagina.ts`); descrições em `src/data/site.ts`.
- No celular o menu continua em lista simples (as fotos nem são carregadas).
- SEO: os links continuam sendo links HTML comuns (rastreáveis), agora com texto descritivo.

---

## 2026-10-22 — Primeira dobra em tela cheia em todas as páginas

- O topo de todas as páginas internas (produtos, institucionais, catálogos, contato, redes sociais) agora ocupa a
  primeira dobra inteira, igual à home, com o mesmo tamanho de título (86px em 1920px), texto e botões.
- A faixa marrom de diferenciais fica logo abaixo da dobra, como na home.
- Página Institucional ganhou o texto de apoio no topo ("Atendendo todo o Brasil com projetos em madeira, aço, bambu e palha…").

---

## 2026-10-22 — Botão flutuante de WhatsApp em todas as páginas

- Botão verde fixo no canto inferior direito, em todas as páginas, com a mensagem dizendo de onde o cliente veio:
  - Home: "Olá, estou no site principal, quero saber mais informações"
  - Demais: "Olá, estou na página **[nome da página]** do site, quero saber mais informações"
    (ex.: "Forro de palha", "Pergolado metálico", "Contato", título do post no blog).
- Link no formato `api.whatsapp.com/send/?phone=551151943920&text=…&type=phone_number&app_absent=0`.
- Nome da página: campo `nome` do JSON (páginas geradas), fixo nas páginas de pergolado, ou o início do `<title>`
  (antes de "|" ou ":"). Para trocar em uma página, passe `pagina="..."` no `<Base>`.
- Código: `src/components/WhatsAppFlutuante.astro`, mensagem em `src/data/site.ts` (`mensagemFlutuante`).

---

## 2026-10-22 — Qualidade das imagens

- As fotos eram geradas pequenas demais (ex.: 700px para um card de 380px em tela retina) e com compressão alta
  (qualidade 70). Agora: qualidade 82, versões maiores para telas retina (cards até 1200px, blocos até 1600px,
  topo até 2400px, galeria ampliada 2000px a 85). O navegador continua baixando só o tamanho necessário.
- `sizes` corrigido nas fotos grandes dos modelos (pergolado de madeira), que eram exibidas maiores que o declarado.
- Limite restante: algumas fotos do topo são menores que a tela no arquivo original (home 1494px, pergolado metálico
  1280px em retrato, demais 1600px). Para ficarem nítidas em 1920px+, é preciso foto original maior (2400px+).

---

## 2026-10-29 — Tamanho único dos botões

- Todos os botões do conteúdo têm agora o mesmo tamanho do "Conhecer blog" (54px de altura, texto 14px), inclusive
  os do topo das páginas e os dos cards de contato, catálogos e redes sociais. Só o botão do menu continua menor.
- No celular, os botões dos cards de contato ocupam a largura do card, para não estourar a tela.

---

## 2026-10-29 — Mascote sem fundo branco (pergolado metálico)

- A imagem do mascote na seção "Tipos de pergolado metálico" (`src/assets/img/pergolado-metalico/tipos.png`) agora
  tem fundo transparente, com uma sombra suave nos pés, e fica direto sobre o fundo marrom da seção.

---

## 2026-10-29 — Popup para baixar folders + "Complete seu projeto" sempre completo

- **Download com cadastro:** todo link para PDF do site (folders das páginas de produto, folders e tabelas da página
  Catálogos) abre um popup pedindo **nome, WhatsApp e e-mail**. Ao enviar, o pedido chega por e-mail
  ("Download de folder pelo site - Nome", com a página e o arquivo) e o botão "Baixar o PDF" é liberado.
  Depois de preencher uma vez, o visitante baixa os outros PDFs direto (fica salvo no navegador dele).
- Código: `src/components/FolderPopup.astro` (incluído em todas as páginas pelo `Base`) e `public/enviar.php`
  (modo `tipo=folder`, responde em JSON). **Depende do SMTP configurado no Easypanel** para os e-mails chegarem;
  se o envio falhar, o download é liberado mesmo assim, para não travar o visitante.
- **Complete seu projeto:** as páginas de pergolado de madeira e metálico mostravam só 2 produtos porque apontavam
  para endereços antigos; agora mostram 6, como as demais. Páginas geradas completam automaticamente até no mínimo 3.

---

## 2026-10-29 — Textos na largura da página

- Nos textos corridos das páginas de produto e institucionais (ex.: MLC), a coluna de texto tinha 820px enquanto as
  fotos ocupavam 1132px. Agora textos, subtítulos e o parágrafo de abertura das seções ocupam a largura inteira do
  conteúdo, alinhados com as fotos. Colunas lado a lado (texto + foto, dúvidas) continuam como estavam.

---

## 2026-10-30 — Logos Google Maps e Waze no showroom

- Na home, em "Visite nosso showroom", os botões agora mostram as logos oficiais enviadas (cortadas e salvas em
  `src/assets/img/showroom/`), no tamanho padrão dos botões. O texto alternativo e o `aria-label` foram mantidos.

---

## 2026-10-30 — Selo PEFC menor na página MLC

- O selo PEFC, que ocupava metade da largura, agora é um logo pequeno (72×88px) ao lado do texto, na altura da escrita.
  Regra: blocos cuja imagem tem "selo" no nome usam esse formato (`.pm-uso--selo`).

---

## 2026-10-30 — Imagens inteiras e botões lado a lado

- Imagens ao lado do texto (infográficos da cobertura, composição da telha etc.) agora aparecem inteiras, sem corte.
- Botões de PDF em sequência ("Tabela de preço" e "Catálogo") ficam um ao lado do outro; no celular quebram linha se
  não couberem.

---

## 2026-10-30 — Pergokit: limpeza do texto

- Removido o subtítulo "O ChatGPT disse", que veio junto na importação, e centralizado o texto sobre aço carbono.

---

## 2026-10-30 — Imagens de produto sempre inteiras e nítidas

- As fotos ao lado do texto eram esticadas para acompanhar a altura do texto: cortavam as laterais e ficavam borradas
  (ex.: Deck de madeira). Agora todas aparecem inteiras, na proporção original, sem ampliação.
