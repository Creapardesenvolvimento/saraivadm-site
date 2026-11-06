// Portfólio: projetos em destaque e "Projetos detalhados".
//
// ATENÇÃO: os textos, locais e fichas dos projetos detalhados abaixo são PROVISÓRIOS
// (vieram do protótipo) e ainda precisam ser conferidos pela Saraiva.
// Enquanto `provisorio` for true:
//  - a seção mostra um aviso de "textos em aprovação";
//  - as páginas de projeto ficam fora do Google (noindex), do sitemap e do assistente de IA.
// Depois de aprovados, corrija os textos e troque para false.

/** As fotos são as da galeria do portfólio (src/data/paginas/portfolio.json), pela posição (0 = primeira). */
export const provisorio = true;

/** Fotos que abrem o portfólio, no carrossel "Projetos em destaque" */
export const destaques = [4, 12, 8, 0, 18, 21, 14, 2];

export interface Projeto {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  material: string;
  tamanho: string;
  tipo: string;
  local: string;
  /** posição da foto de capa na galeria do portfólio */
  capa: number;
  /** posições das fotos do projeto na galeria do portfólio */
  fotos: number[];
  texto: string[];
}

export const projetos: Projeto[] = [
  {
    slug: 'pergolado-madeira-deck-piscina',
    titulo: 'Pergolado de madeira e deck: o lazer completo ao redor da piscina',
    resumo: 'Como um pergolado de madeira e um deck transformaram a área da piscina em um espaço de convivência para o dia inteiro.',
    categoria: 'Pergolado de madeira',
    material: 'Madeira',
    tamanho: 'Grande (acima de 50 m²)',
    tipo: 'Piscina e lazer',
    local: 'Campinas/SP',
    capa: 4,
    fotos: [4, 6, 16, 22, 7, 2],
    texto: [
      'Neste projeto, a proposta era criar uma área de lazer que funcionasse em qualquer horário: sombra para o sol forte, conforto para receber e um visual que acompanhasse o paisagismo.',
      'O pergolado de madeira foi dimensionado para cobrir a área de estar sem tirar a luz natural, e o deck conecta a piscina aos ambientes internos com um piso confortável e de baixa manutenção.',
      'Todo o projeto foi apresentado antes em 3D, para o cliente aprovar medidas, acabamentos e posição das peças antes da fabricação.',
    ],
  },
  {
    slug: 'area-gourmet-pergolado-metalico',
    titulo: 'Área gourmet com pergolado metálico: sofisticação para receber',
    resumo: 'Estrutura em aço com acabamento refinado para cobrir a churrasqueira e o espaço de convivência, com leveza e durabilidade.',
    categoria: 'Pergolado metálico',
    material: 'Aço',
    tamanho: 'Médio (20 a 50 m²)',
    tipo: 'Área gourmet',
    local: 'Jundiaí/SP',
    capa: 9,
    fotos: [9, 23, 0, 1, 3],
    texto: [
      'A área gourmet pedia uma cobertura resistente, de linhas limpas, que valorizasse a arquitetura da casa.',
      'O pergolado metálico entrega vãos amplos com poucos apoios, deixando a circulação livre ao redor da bancada e do espaço de estar.',
      'O acabamento foi escolhido para combinar com as esquadrias e com o restante da fachada.',
    ],
  },
  {
    slug: 'deck-madeira-lago',
    titulo: 'Deck de madeira com lago: um cantinho de descanso no jardim',
    resumo: 'Um deck integrado ao paisagismo que cria um novo ponto de contemplação na área externa.',
    categoria: 'Deck',
    material: 'Madeira',
    tamanho: 'Pequeno (até 20 m²)',
    tipo: 'Residencial',
    local: 'Itupeva/SP',
    capa: 8,
    fotos: [8, 11, 27, 10],
    texto: [
      'O deck foi desenhado para acompanhar o contorno do lago e criar um lugar de descanso no meio do jardim.',
      'A madeira tratada garante resistência ao sol e à chuva, com o toque natural que combina com o paisagismo.',
    ],
  },
  {
    slug: 'pergolado-hidro-relaxar',
    titulo: 'Pergolado com hidro: relaxar o ano todo, com sombra e privacidade',
    resumo: 'A cobertura certa para aproveitar a hidromassagem em qualquer época do ano, com conforto e proteção.',
    categoria: 'Pergolado de madeira',
    material: 'Madeira',
    tamanho: 'Médio (20 a 50 m²)',
    tipo: 'Piscina e lazer',
    local: 'Limeira/SP',
    capa: 12,
    fotos: [12, 17, 5, 15],
    texto: [
      'O desafio era unir deck, hidromassagem e cobertura em um único conjunto, sem perder o ar leve do espaço.',
      'O pergolado de madeira dá sombra e privacidade, e o deck integra tudo com o mesmo acabamento.',
    ],
  },
  {
    slug: 'pergolado-puc-campinas',
    titulo: 'Pergolado na PUC-Campinas: áreas de convivência para o campus',
    resumo: 'Um projeto de maior escala, pensado para receber muita gente com conforto, resistência e baixa manutenção.',
    categoria: 'Pergolado de madeira',
    material: 'Madeira',
    tamanho: 'Grande (acima de 50 m²)',
    tipo: 'Institucional',
    local: 'Campinas/SP',
    capa: 18,
    fotos: [18, 19, 13, 20],
    texto: [
      'Espaços de uso coletivo exigem estrutura reforçada e manutenção simples. Esse foi o ponto de partida do projeto.',
      'A madeira foi tratada para uso intenso ao ar livre, e o dimensionamento seguiu as exigências de segurança para áreas públicas.',
    ],
  },
  {
    slug: 'pergolado-vinicola',
    titulo: 'Pergolado em vinícola: sofisticação entre as videiras',
    resumo: 'Uma cobertura que valoriza a experiência de quem visita, harmonizando com a paisagem do local.',
    categoria: 'Pergolado de madeira',
    material: 'Madeira',
    tamanho: 'Grande (acima de 50 m²)',
    tipo: 'Comercial',
    local: 'Interior de SP',
    capa: 21,
    fotos: [21, 24, 25, 26],
    texto: [
      'Para a vinícola, o pergolado precisava ser elegante e discreto, deixando a paisagem como protagonista.',
      'A estrutura cria um ambiente acolhedor para degustações e eventos, com sombra e ventilação natural.',
    ],
  },
  {
    slug: 'pergolado-quadra-tenis',
    titulo: 'Pergolado para quadra de tênis: sombra e conforto para o jogo',
    resumo: 'Um espaço de apoio coberto, para assistir e descansar ao lado da quadra.',
    categoria: 'Pergolado de madeira',
    material: 'Madeira',
    tamanho: 'Médio (20 a 50 m²)',
    tipo: 'Esporte e lazer',
    local: 'Campinas/SP',
    capa: 14,
    fotos: [14, 15, 28, 26],
    texto: [
      'O espaço de apoio da quadra pedia uma cobertura que oferecesse sombra sem bloquear a visão do jogo.',
      'O pergolado cria um ponto de encontro confortável, integrado ao paisagismo e ao entorno.',
    ],
  },
];

/** Categoria de uma foto, a partir do texto alternativo dela */
export function categoriaDaFoto(alt: string): string {
  const t = alt.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (/forro|pergoconfort|cobertura pergo|telha/.test(t)) return 'Coberturas e forros';
  if (/metalic|ferro|aco|branco/.test(t)) return 'Pergolado metálico';
  if (/^deck/.test(t.trim())) return 'Deck';
  if (/madeira|mix|maneira|rustico/.test(t)) return 'Pergolado de madeira';
  return 'Pergolado de madeira';
}
