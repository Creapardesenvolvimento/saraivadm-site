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
  filhos?: { label: string; href: string }[];
}

// Menu do topo. Os endereços são os mesmos do site antigo (preserva o SEO).
export const menuPrincipal: ItemMenu[] = [
  {
    label: 'Pergolados',
    filhos: [
      { label: 'Pergolado de madeira', href: '/pergolado-de-madeira/' },
      { label: 'Pergolado metálico', href: '/pergolado-metalico/' },
      { label: 'Pergolado em MLC', href: '/mlc/' },
    ],
  },
  {
    label: 'Coberturas',
    filhos: [
      { label: 'Cobertura para pergolado', href: '/cobertura-para-pergolado/' },
      { label: 'Telha para pergolado', href: '/telha-para-pergolado/' },
      { label: 'PergoConfort', href: '/pergoconfort/' },
      { label: 'PergoConfort Max', href: '/pergoconfort-max/' },
      { label: 'PergoPlac', href: '/pergoplac/' },
    ],
  },
  {
    label: 'Forros',
    filhos: [
      { label: 'Forro de palha', href: '/forro-de-palha/' },
      { label: 'Forro de bambu', href: '/forro-em-esteiras-de-bambu/' },
      { label: 'Forro de madeira', href: '/forro-de-madeira/' },
      { label: 'Forro ripado', href: '/forro-ripado/' },
      { label: 'Forro de lambril', href: '/forro-de-lambril/' },
    ],
  },
  { label: 'Piso de Madeira', href: '/pisos-de-madeira/' },
  { label: 'Deck', href: '/deck-de-madeira/' },
  {
    label: 'Outros',
    filhos: [
      { label: 'Brise de madeira', href: '/brise-de-madeira/' },
      { label: 'Painel ripado', href: '/painel-ripado/' },
      { label: 'Caramanchão', href: '/caramanchao/' },
      { label: 'Gazebo', href: '/gazebo/' },
      { label: 'Pergokit', href: '/pergokit/' },
      { label: 'Deck modular', href: '/deck-modular/' },
      { label: 'Deck hidro-spa', href: '/deck-hidro-spa/' },
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
