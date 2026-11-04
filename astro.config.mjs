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
      filter: (page) => !page.includes('/obrigado/') && !page.includes('/assistente/'),
    }),
    indiceAssistente(),
  ],
});
