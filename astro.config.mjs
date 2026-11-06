import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import indiceAssistente from './ferramentas/indice-assistente.mjs';

export default defineConfig({
  site: 'https://saraivadm.com.br',
  // URLs terminando em "/" (ex.: /pergolado-metalico/), igual ao WordPress antigo
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Necessário quando o projeto está numa pasta redirecionada pelo Windows (AppData do app Claude).
  // Não afeta o site publicado.
  vite: { resolve: { preserveSymlinks: true } },
  integrations: [
    sitemap({
      // Páginas de projeto do portfólio ficam fora enquanto os textos estão em aprovação
      // (ver `provisorio` em src/data/projetos.ts). Depois de aprovados, apague a última condição.
      filter: (page) => !page.includes('/obrigado/') && !page.includes('/assistente/') && !/\/portfolio\/[^/]+\/$/.test(page),
    }),
    indiceAssistente(),
  ],
});
