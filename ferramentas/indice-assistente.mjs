// Integração do Astro: depois do build, junta o texto de todas as páginas geradas em
// dist/assistente/indice.json. O assistente de IA (public/assistente/chat.php) busca nesse arquivo.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Páginas que não ajudam a responder o visitante
const IGNORAR = ['/obrigado/', '/404/', '/assistente/'];

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…' };

function decodificar(texto) {
  return texto.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTIDADES[e.toLowerCase()] ?? m;
  });
}

function textoDoHtml(html) {
  return decodificar(
    html
      .replace(/<(script|style|svg|noscript|template|dialog|iframe)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<(br|\/p|\/h[1-6]|\/li|\/div|\/section|\/article|\/header|\/figure|\/summary|\/details|\/tr)\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

async function paginasHtml(pasta) {
  const lista = [];
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, item.name);
    if (item.isDirectory() && item.name !== '_astro') lista.push(...(await paginasHtml(caminho)));
    else if (item.name === 'index.html') lista.push(caminho);
  }
  return lista;
}

export default function indiceAssistente() {
  return {
    name: 'indice-assistente',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const raiz = fileURLToPath(dir);
        const paginas = [];
        for (const arquivo of (await paginasHtml(raiz)).sort()) {
          const url = '/' + relative(raiz, arquivo).split(sep).slice(0, -1).join('/') + '/';
          const caminho = url.replace(/\/+/g, '/');
          if (IGNORAR.includes(caminho)) continue;
          const html = (await readFile(arquivo, 'utf8'))
            // Conteúdo provisório (ainda em aprovação) não entra no que o assistente responde
            .replace(/<section\b[^>]*data-provisorio[^>]*>[\s\S]*?<\/section>/gi, ' ');
          if (/<meta name="robots" content="noindex/i.test(html)) continue;
          const titulo = decodificar(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
          const descricao = decodificar(html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '').trim();
          const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
          const texto = textoDoHtml(main);
          if (!texto) continue;
          paginas.push({ id: paginas.length + 1, titulo, url: caminho, descricao, texto });
        }
        await mkdir(join(raiz, 'assistente'), { recursive: true });
        await writeFile(join(raiz, 'assistente', 'indice.json'), JSON.stringify({ gerado: new Date().toISOString(), paginas }));
        logger.info(`${paginas.length} páginas no índice do assistente`);
      },
    },
  };
}
