// Devolve a foto de capa de uma página do site a partir do endereço (ex.: '/forro-de-palha/').
// Usado no mega menu. Páginas geradas usam a capa do JSON; as feitas à mão estão listadas abaixo.
import pergoladoMadeira from '../assets/img/pergolado-de-madeira/hero.jpg';
import pergoladoMetalico from '../assets/img/pergolado-metalico/hero.jpg';

const fixas: Record<string, ImageMetadata> = {
  '/pergolado-de-madeira/': pergoladoMadeira,
  '/pergolado-metalico/': pergoladoMetalico,
};

const paginas = import.meta.glob<{ default: { slug: string; hero: { imagem?: string | null } } }>('../data/paginas/*.json', {
  eager: true,
});
const imagens = import.meta.glob<{ default: ImageMetadata }>('../assets/img/paginas/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export function imagemDaPagina(href: string): ImageMetadata | undefined {
  if (fixas[href]) return fixas[href];
  const slug = href.replace(/\//g, '');
  const pg = Object.values(paginas).find((m) => m.default.slug === slug)?.default;
  const daPasta = Object.entries(imagens).filter(([k]) => k.includes(`/paginas/${slug}/`) && !k.includes('/yt-'));
  const arquivo = pg?.hero.imagem;
  // capa da página; se não houver, a primeira foto da página
  return (arquivo && daPasta.find(([k]) => k.endsWith('/' + arquivo))?.[1].default) || daPasta.sort(([a], [b]) => a.localeCompare(b))[0]?.[1].default;
}
