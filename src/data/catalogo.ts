// Catálogo de produtos: usado nos cards da home e em "Outros produtos" das páginas internas.
import imgPergoladoMetalico from '../assets/img/pergolado-metalico.png';
import imgForroMadeira from '../assets/img/forro-de-madeira.png';
import imgForroBambu from '../assets/img/forro-de-bambu.png';
import imgForroPalha from '../assets/img/forro-de-palha.webp';
import imgBrises from '../assets/img/brises.png';
import imgCoberturas from '../assets/img/coberturas.png';
import imgDecks from '../assets/img/decks.png';
import imgMlc from '../assets/img/pergolado-mlc.png';
import imgPergoladoMadeira from '../assets/img/pergolado-de-madeira.jpg';

export interface ProdutoCatalogo {
  nome: string;
  href: string;
  img: ImageMetadata;
  alt: string;
}

export const catalogo: ProdutoCatalogo[] = [
  { nome: 'Pergolado metálico', href: '/pergolado-metalico/', img: imgPergoladoMetalico, alt: 'Pergolado metálico com cobertura em área de lazer' },
  { nome: 'Forro de madeira', href: '/forro-de-madeira/', img: imgForroMadeira, alt: 'Forro de madeira ripado em varanda' },
  { nome: 'Forro de bambu', href: '/forro-em-esteiras-de-bambu/', img: imgForroBambu, alt: 'Forro de bambu natural em área externa' },
  { nome: 'Forro de palha', href: '/forro-de-palha/', img: imgForroPalha, alt: 'Forro de palha em pergolado de madeira' },
  { nome: 'Brises', href: '/brise-de-madeira/', img: imgBrises, alt: 'Brises de madeira em fachada' },
  { nome: 'Coberturas', href: '/cobertura-para-pergolado/', img: imgCoberturas, alt: 'Cobertura para pergolado em área gourmet' },
  { nome: 'Decks', href: '/deck-de-madeira/', img: imgDecks, alt: 'Deck de madeira ao redor de piscina' },
  { nome: 'Pergolados MLC', href: '/mlc/', img: imgMlc, alt: 'Pergolado em madeira laminada colada (MLC)' },
  { nome: 'Pergolado de madeira', href: '/pergolado-de-madeira/', img: imgPergoladoMadeira, alt: 'Pergolado de madeira em jardim' },
];
