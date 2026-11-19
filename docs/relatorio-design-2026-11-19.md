# Relatório de ajustes de design (19/11/2026): o que foi feito

Relatório recebido: "RELATORIO AJUSTES DESIGN SITE NOVO SARAIVA.pdf" (20 páginas).

## Aplicado

1. **Vídeos da equipe em obra (os "GIFs")**: os vídeos curtos que já estavam no site oficial foram copiados,
   comprimidos (máx. 15 s, sem som, 28 MB no total) e entram logo abaixo do bloco vídeo + texto, como GIF
   (tocam sozinhos, em repetição, só quando aparecem na tela). Páginas: Pergolado de madeira, Pergolado metálico,
   Cobertura, PergoConfort, PergoConfort Max, Forro de palha, Forro de bambu, Forro de lambril, Deck, Painel ripado
   e Pergokit. Arquivos em `public/videos/obras/`, lista em `src/data/videosObra.ts`.
2. **Seção vídeo + texto**: o vídeo fica alinhado ao topo do texto, maior, e acompanha a rolagem quando o texto é longo.
   Infográficos (ex.: Cobertura) com margem dentro do bloco bege e coluna maior, para o texto da imagem ficar legível.
3. **Forro de madeira**: página oculta (sai do menu Forros, rodapé, "Nossos produtos", "Complete seu projeto",
   folder em Catálogos, sitemap e Google). O menu Forros fica com 4 cards numa linha.
4. **Grades sem card sozinho**: produtos (Início e "Complete seu projeto"), vídeos (Instalação da cobertura: 4 em linha),
   galerias de fotos (fileiras equilibradas; Lambril com as 6 fotos numa fileira), Catálogos (9 folders, 3x3).
5. **Blog** (Início e /blog/): com 1 post, o card fica largo (foto + texto lado a lado), sem espaço vazio.
6. **Início**: "Garantias certificadas" trocado por "Garantia e pós-venda".
7. **Institucional**: página refeita na ordem do folder: abertura, linha do tempo 2017-2026, números, posicionamento,
   missão/visão/valores, especialidades, showroom atual e novo, responsabilidade ambiental, estrutura, diferenciais,
   projetos residenciais e corporativos, depoimentos e contato. Os blocos longos por produto saíram.
8. **PergoConfort**: os cards de vantagens eram cópia da PergoConfort Max. Ficaram só os que valem para a PergoConfort,
   e os itens da Max (núcleo de EPS, granizo, resistência mecânica) deram lugar à proteção UV do filme Melinex.
9. **Forro de bambu**: os 6 modelos viraram uma grade de cards (a página encurtou de ~19.700 px para ~17.300 px).
10. **Pergokit**: os 2 vídeos do topo ocupam a largura toda; "Metais selecionados" com foto ao lado do texto.
11. **Contato**: cards maiores, com ícone. **Parcerias**: bloco "O que a Saraiva Design oferece ao seu escritório".
12. Link vazio ("#") do pop-up de folder corrigido.

## Depende da Saraiva

- **Números e telefone**: resolvidos pelo folder (decisão de 19/11/2026: o folder é a correção do cliente e vale sobre
  o site). Início com +10 mil projetos e +30 anos; WhatsApp principal 19 99436 4575 (e 19 4141 2204) em todo o site.
- **Fotos da Institucional**: equipe, oficina, frota e showroom foram recortadas do folder 2025 (resolução baixa).
  Mandar as fotos originais do folder 2026 (linha do tempo, showroom novo, projetos) para trocar.
- **Textos novos para aprovar**: frase de posicionamento, descrições da linha do tempo e bloco de Parcerias.
- **Vídeos**: MLC, Pisos de madeira e Forro ripado não tinham vídeo no site antigo. Mandar se houver.
- **Blog**: só 1 post publicado. O layout já não fica vazio, mas vale publicar mais.
- **Imagens sem alt**: são as miniaturas do menu (o nome do produto está escrito ao lado), por isso ficam com alt vazio
  de propósito, para o leitor de tela não repetir o nome.
