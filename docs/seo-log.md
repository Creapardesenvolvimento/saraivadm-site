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
