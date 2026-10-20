// Folders e tabelas de preço em PDF. Os arquivos ainda estão no WordPress atual.
// TODO: antes de desligar o WordPress, copiar (e comprimir) os PDFs para public/downloads/ e trocar os links.
import capaPergoladoMadeira from '../assets/img/institucional/cat-pergolado-de-madeira.jpg';
import capaInstitucional from '../assets/img/institucional/cat-institucional.jpg';
import capaPergoladoMetalico from '../assets/img/institucional/cat-pergolado-metalico.jpg';
import capaBambu from '../assets/img/institucional/cat-forro-de-bambu.jpg';
import capaDeck from '../assets/img/institucional/cat-deck-de-madeira.jpg';
import capaForroMadeira from '../assets/img/institucional/cat-forro-de-madeira.jpg';
import capaCobertura from '../assets/img/institucional/cat-cobertura.jpg';
import capaPalha from '../assets/img/institucional/cat-forro-de-palha.jpg';
import capaPainel from '../assets/img/institucional/cat-painel-ripado.jpg';
import capaPergoconfortMax from '../assets/img/institucional/cat-pergoconfort-max.png';
import tabBambu from '../assets/img/institucional/tab-bambu.jpg';
import tabPalhaNatural from '../assets/img/institucional/tab-palha-natural.jpg';
import tabPergoconfort from '../assets/img/institucional/tab-pergoconfort.jpg';
import tabPalhaSintetica from '../assets/img/institucional/tab-palha-sintetica.jpg';

const U = 'https://saraivadm.com.br/wp-content/uploads/';

export interface Catalogo {
  titulo: string;
  capa: ImageMetadata;
  pdf: string;
  produto?: string;
}

export const folders: Catalogo[] = [
  { titulo: 'Institucional', capa: capaInstitucional, pdf: U + '2025/03/FOLDER-INSTITUCIONAL-2025.pdf', produto: '/institucional/' },
  { titulo: 'Pergolado de madeira', capa: capaPergoladoMadeira, pdf: U + '2025/03/FOLDER-PERGOLADO-DE-MADEIRA-2025.pdf', produto: '/pergolado-de-madeira/' },
  { titulo: 'Pergolado metálico', capa: capaPergoladoMetalico, pdf: U + '2026/07/PERGOLADO-METALICO-2026_compressed.pdf', produto: '/pergolado-metalico/' },
  { titulo: 'Cobertura para pergolado', capa: capaCobertura, pdf: U + '2025/03/FOLDER-COBERTURA-PERGOLADO-2025.pdf', produto: '/cobertura-para-pergolado/' },
  { titulo: 'PergoConfort Max', capa: capaPergoconfortMax, pdf: U + '2026/07/PERGOCONFORT-MAX-2026_compressed.pdf', produto: '/pergoconfort-max/' },
  { titulo: 'Forro de palha', capa: capaPalha, pdf: U + '2026/07/FORRO-DE-PALHA-2026_compressed.pdf', produto: '/forro-de-palha/' },
  { titulo: 'Forro de bambu', capa: capaBambu, pdf: U + '2026/05/Folder-Forro-de-Bambu.pdf', produto: '/forro-em-esteiras-de-bambu/' },
  { titulo: 'Forro de madeira', capa: capaForroMadeira, pdf: U + '2025/03/FOLDER-FORRO-DE-MADEIRA-2025.pdf', produto: '/forro-de-madeira/' },
  { titulo: 'Deck de madeira', capa: capaDeck, pdf: U + '2025/03/FOLDER-DECK-DE-MADEIRA-2025.pdf', produto: '/deck-de-madeira/' },
  { titulo: 'Painel ripado', capa: capaPainel, pdf: U + '2025/05/FOLDER-PAINEL-RIPADO-2025.pdf', produto: '/painel-ripado/' },
];

export const tabelas: Catalogo[] = [
  { titulo: 'Tabela de preços: PergoConfort', capa: tabPergoconfort, pdf: U + '2026/08/TABELA-DE-PRECOS-PERGOCONFORT-1-ATUALIZADA.pdf', produto: '/pergoconfort/' },
  { titulo: 'Tabela de preços: forro de bambu', capa: tabBambu, pdf: U + '2026/08/TABELA-DE-PRECOS-BAMBU-2-ATUALIZADA.pdf', produto: '/forro-em-esteiras-de-bambu/' },
  { titulo: 'Tabela de preços: palha natural', capa: tabPalhaNatural, pdf: U + '2025/03/TABELA-DE-PRECOS-PALHA-NATURAL-1-1.pdf', produto: '/forro-de-palha/' },
  { titulo: 'Tabela de preços: palha sintética', capa: tabPalhaSintetica, pdf: U + '2025/03/TABELA-DE-PRECOS-PALHA-SINTETICO-1.pdf', produto: '/forro-de-palha/' },
];
