// Imagens com fundo branco (lista gerada por ferramentas/fundo-branco.py): o espaço em volta delas fica branco,
// em vez do bege, para a imagem não aparecer como um retângulo branco sobre o fundo da seção.
import lista from '../data/fundoBranco.json';

const nomes = new Set((lista as string[]).map((n) => n.replace(/\.[a-z0-9]+$/i, '')));

/** Aceita o nome do arquivo ("modelo-caixa-1.avif") ou uma imagem importada (ImageMetadata) */
export function fundoBranco(img?: string | { src: string } | null): boolean {
  if (!img) return false;
  const caminho = typeof img === 'string' ? img : img.src;
  const arquivo = decodeURIComponent(caminho.split('?')[0].split('/').pop() || '');
  // no site gerado o nome ganha um código: "modelo-caixa-1.Bx12ab.avif"
  const base = arquivo.replace(/\.[a-z0-9]+$/i, '').replace(/\.[\w-]{6,12}$/, '');
  return nomes.has(base);
}
