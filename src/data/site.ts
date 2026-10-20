// Dados gerais da empresa. Alterar aqui atualiza o site inteiro
// (cabeçalho, rodapé, botões de WhatsApp e dados estruturados do Google).

export const site = {
  nome: 'Saraiva Design em Madeiras e Aço',
  nomeCurto: 'Saraiva Design',
  url: 'https://saraivadm.com.br',
  cnpj: '29.200.478/0001-47',
  email: 'contato@saraivadm.com.br',
  descricao:
    'Projetos sob medida em madeira e aço para transformar áreas externas. Pergolados, coberturas e forros, Piso de madeira desenvolvidos com técnica, qualidade e atenção aos detalhes.',

  telefones: [
    { exibicao: '11 5194 3920', whatsapp: '551151943920', tel: '+551151943920' },
    { exibicao: '19 4141 2204', whatsapp: '551941412204', tel: '+551941412204' },
  ],

  endereco: {
    rua: 'Av. Francisco Alfredo Júnior, 557',
    bairro: 'Swiss Park',
    cidade: 'Campinas',
    uf: 'SP',
    pais: 'BR',
    lat: -22.96106548984442,
    lng: -47.06469526309858,
  },

  // Perfis oficiais (copiados do site atual). Os preenchidos aparecem no rodapé e entram no schema (sameAs).
  redes: {
    instagram: 'https://www.instagram.com/saraivadesignoficial/',
    facebook: '',
    youtube: 'https://www.youtube.com/@saraivadesignoficial',
    pinterest: 'https://br.pinterest.com/saraivadesignoficial/',
    google: 'https://maps.google.com/?cid=9687738465255098180',
    tiktok: 'https://www.tiktok.com/@saraivadesignoficial',
    linkedin: 'https://www.linkedin.com/company/saraiva-design-em-madeirass/',
  },
};

/** Link de WhatsApp do atendimento principal, com mensagem pronta. */
export const whatsappUrl = (
  mensagem = 'Olá! Vim pelo site e gostaria de um orçamento.',
) => `https://wa.me/${site.telefones[0].whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.endereco.rua} - ${site.endereco.bairro}, ${site.endereco.cidade} - ${site.endereco.uf}`,
)}`;

export const wazeUrl = `https://waze.com/ul?ll=${site.endereco.lat},${site.endereco.lng}&navigate=yes`;

export interface ItemMenu {
  label: string;
  href?: string;
  /** Texto curto do mega menu (desktop) */
  descricao?: string;
  filhos?: { label: string; href: string; descricao?: string }[];
}

// Menu do topo. Os endereços são os mesmos do site antigo (preserva o SEO).
export const menuPrincipal: ItemMenu[] = [
  {
    label: 'Pergolados',
    descricao: 'Estruturas sob medida em madeira nobre, aço carbono e madeira laminada colada.',
    filhos: [
      { label: 'Pergolado de madeira', href: '/pergolado-de-madeira/', descricao: 'Garapeira tipo exportação, sob medida' },
      { label: 'Pergolado metálico', href: '/pergolado-metalico/', descricao: 'Aço carbono com tratamento anticorrosivo' },
      { label: 'Pergolado em MLC', href: '/mlc/', descricao: 'Madeira engenheirada para grandes vãos' },
    ],
  },
  {
    label: 'Coberturas',
    descricao: 'Proteção contra sol, chuva e calor com telhas exclusivas Saraiva Design.',
    filhos: [
      { label: 'Cobertura para pergolado', href: '/cobertura-para-pergolado/', descricao: 'Sistema completo com calhas e vedação' },
      { label: 'Telha para pergolado', href: '/telha-para-pergolado/', descricao: 'Translúcida, com proteção UV' },
      { label: 'PergoConfort', href: '/pergoconfort/', descricao: 'Telha exclusiva com 10 anos de garantia' },
      { label: 'PergoConfort Max', href: '/pergoconfort-max/', descricao: 'Termoacústica, máximo conforto' },
      { label: 'PergoPlac', href: '/pergoplac/', descricao: 'Placa térmica entre forro e cobertura' },
    ],
  },
  {
    label: 'Forros',
    descricao: 'Acabamentos naturais que trazem sombra, conforto térmico e beleza ao ambiente.',
    filhos: [
      { label: 'Forro de palha', href: '/forro-de-palha/', descricao: 'Natural e sintético, coleções exclusivas' },
      { label: 'Forro de bambu', href: '/forro-em-esteiras-de-bambu/', descricao: 'Esteiras artesanais tratadas' },
      { label: 'Forro de madeira', href: '/forro-de-madeira/', descricao: 'Madeira nobre sob medida' },
      { label: 'Forro ripado', href: '/forro-ripado/', descricao: 'Visual moderno com ripas de madeira' },
      { label: 'Forro de lambril', href: '/forro-de-lambril/', descricao: 'Clássico e aconchegante' },
    ],
  },
  { label: 'Piso de Madeira', href: '/pisos-de-madeira/' },
  { label: 'Deck', href: '/deck-de-madeira/' },
  {
    label: 'Outros',
    descricao: 'Soluções em madeira para completar o seu projeto de área externa.',
    filhos: [
      { label: 'Brise de madeira', href: '/brise-de-madeira/', descricao: 'Controle de luz e ventilação' },
      { label: 'Painel ripado', href: '/painel-ripado/', descricao: 'Paredes, fachadas e muros' },
      { label: 'Caramanchão', href: '/caramanchao/', descricao: 'Charme para jardins e piscinas' },
      { label: 'Gazebo', href: '/gazebo/', descricao: 'Estrutura independente para lazer' },
      { label: 'Pergokit', href: '/pergokit/', descricao: 'Kit completo para todo o Brasil' },
      { label: 'Deck modular', href: '/deck-modular/', descricao: 'Cumaru com fixação oculta' },
      { label: 'Deck hidro-spa', href: '/deck-hidro-spa/', descricao: 'Deck sob medida para hidro e spa' },
    ],
  },
];

export const rodapeProdutos = [
  { label: 'Pergolado de madeira', href: '/pergolado-de-madeira/' },
  { label: 'Pergolado metálico', href: '/pergolado-metalico/' },
  { label: 'Pergolado MLC', href: '/mlc/' },
  { label: 'Cobertura para pergolado', href: '/cobertura-para-pergolado/' },
  { label: 'Telha para pergolado', href: '/telha-para-pergolado/' },
  { label: 'Forro de palha', href: '/forro-de-palha/' },
  { label: 'Forro de bambu', href: '/forro-em-esteiras-de-bambu/' },
  { label: 'Forro de madeira', href: '/forro-de-madeira/' },
  { label: 'Piso de madeira', href: '/pisos-de-madeira/' },
  { label: 'Deck de madeira', href: '/deck-de-madeira/' },
  { label: 'Pergokit', href: '/pergokit/' },
  { label: 'Brise de madeira', href: '/brise-de-madeira/' },
  { label: 'Pergoconfort', href: '/pergoconfort/' },
  { label: 'Pergoconfort Max', href: '/pergoconfort-max/' },
  { label: 'PergoPlac', href: '/pergoplac/' },
  { label: 'Forro ripado', href: '/forro-ripado/' },
  { label: 'Forro de lambril', href: '/forro-de-lambril/' },
  { label: 'Painel ripado', href: '/painel-ripado/' },
  { label: 'Caramanchão', href: '/caramanchao/' },
  { label: 'Gazebo', href: '/gazebo/' },
  { label: 'Deck modular', href: '/deck-modular/' },
  { label: 'Deck hidro-spa', href: '/deck-hidro-spa/' },
];

export const rodapeInstitucional = [
  { label: 'Sobre nós', href: '/institucional/' },
  { label: 'Portfólio', href: '/portfolio/' },
  { label: 'Antes e depois', href: '/antes-depois/' },
  { label: 'Catálogos', href: '/catalogos/' },
  { label: 'Parcerias', href: '/parcerias/' },
  { label: 'Trabalhe conosco', href: '/trabalhe-conosco/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Mídias', href: '/redes-sociais/' },
  { label: 'Contato', href: '/contato/' },
];
