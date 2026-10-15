import { getCollection } from 'astro:content';

/**
 * Posts do blog, do mais novo para o mais antigo.
 * Rascunhos aparecem só no ambiente local (npm run dev), nunca no site publicado.
 */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.rascunho);
  return posts.sort((a, b) => b.data.publicado.valueOf() - a.data.publicado.valueOf());
}

export const formatarData = (d: Date) =>
  d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
