import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada post do blog é um arquivo .md em src/content/blog/.
// O nome do arquivo vira a URL: manutencao-pergolado.md -> /blog/manutencao-pergolado/
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      /** <title> para o Google (opcional, até ~60 caracteres). Padrão: titulo */
      seoTitulo: z.string().max(70).optional(),
      /** Meta description (até ~155 caracteres) */
      descricao: z.string().max(170),
      /** Resumo curto mostrado nos cards */
      resumo: z.string(),
      imagem: image(),
      imagemAlt: z.string(),
      publicado: z.coerce.date(),
      atualizado: z.coerce.date().optional(),
      autor: z.string().default('Saraiva Design'),
      /** true = não publica (rascunho) */
      rascunho: z.boolean().default(false),
    }),
});

export const collections = { blog };
