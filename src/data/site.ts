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

  // Preencha as URLs reais. Os perfis preenchidos também entram no schema (sameAs).
  redes: {
    instagram: '',
    facebook: '',
    youtube: '',
    pinterest: '',
    google: '',
    tiktok: '',
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

export const menuPrincipal = [
  { label: 'Pergolados', href: '/pergolados/' },
  { label: 'Coberturas', href: '/coberturas/' },
  { label: 'Forros', href: '/forros/' },
  { label: 'Piso de Madeira', href: '/piso-de-madeira/' },
  { label: 'Deck', href: '/deck/' },
  { label: 'Outros', href: '/outros/' },
];

export const rodapeProdutos = [
  { label: 'Pergolado de madeira', href: '/pergolado-de-madeira/' },
  { label: 'Pergolado metálico', href: '/pergolado-metalico/' },
  { label: 'Pergolado MLC', href: '/pergolado-mlc/' },
  { label: 'Cobertura para pergolado', href: '/cobertura-para-pergolado/' },
  { label: 'Telha para pergolado', href: '/telha-para-pergolado/' },
  { label: 'Forro de palha', href: '/forro-de-palha/' },
  { label: 'Forro de bambu', href: '/forro-de-bambu/' },
  { label: 'Forro de madeira', href: '/forro-de-madeira/' },
  { label: 'Piso de madeira', href: '/piso-de-madeira/' },
  { label: 'Deck de madeira', href: '/deck-de-madeira/' },
  { label: 'MLC', href: '/mlc/' },
  { label: 'Pergokit', href: '/pergokit/' },
  { label: 'Brise de madeira', href: '/brise-de-madeira/' },
  { label: 'Pergoconfort', href: '/pergoconfort/' },
  { label: 'Pergoconfort Max', href: '/pergoconfort-max/' },
];

export const rodapeInstitucional = [
  { label: 'Sobre nós', href: '/sobre-nos/' },
  { label: 'Portfólio', href: '/portfolio/' },
  { label: 'Antes e depois', href: '/antes-e-depois/' },
  { label: 'Catálogos', href: '/catalogos/' },
  { label: 'Parcerias', href: '/parcerias/' },
  { label: 'Trabalhe conosco', href: '/trabalhe-conosco/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Mídias', href: '/midias/' },
  { label: 'Contato', href: '/contato/' },
];
