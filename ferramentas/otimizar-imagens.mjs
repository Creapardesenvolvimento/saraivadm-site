// Reduz imagens-fonte muito grandes (máx. 2400px de largura, qualidade 82) para manter o repositório leve.
// O Astro ainda gera as versões WebP otimizadas para o site; isto só diminui os originais.
// uso: node ferramentas/otimizar-imagens.mjs src/assets/img
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
sharp.cache(false);
import { join, extname } from 'node:path';

const LIMITE_BYTES = 1.5 * 1024 * 1024;
const MAX_LARGURA = 2400;
let antes = 0, depois = 0, n = 0;

function percorrer(dir) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    const st = statSync(caminho);
    if (st.isDirectory()) { percorrer(caminho); continue; }
    const ext = extname(nome).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;
    fila.push({ caminho, ext, tamanho: st.size });
  }
}
const fila = [];
percorrer(process.argv[2] ?? 'src/assets/img');

for (const { caminho, ext, tamanho } of fila) {
  const original = readFileSync(caminho);
  const meta = await sharp(original).metadata();
  if (tamanho < LIMITE_BYTES && (meta.width ?? 0) <= MAX_LARGURA) continue;
  let img = sharp(original).rotate().resize({ width: MAX_LARGURA, withoutEnlargement: true });
  if (ext === '.png') img = meta.hasAlpha ? img.png({ compressionLevel: 9, palette: true, quality: 85 }) : img.jpeg({ quality: 82, mozjpeg: true });
  else if (ext === '.webp') img = img.webp({ quality: 82 });
  else if (ext === '.avif') img = img.avif({ quality: 60 });
  else img = img.jpeg({ quality: 82, mozjpeg: true });
  const buf = await img.toBuffer();
  if (buf.length < tamanho) {
    writeFileSync(caminho, buf);
    antes += tamanho; depois += buf.length; n++;
  }
}
console.log(`${n} imagens reduzidas: ${(antes / 1048576).toFixed(1)} MB -> ${(depois / 1048576).toFixed(1)} MB`);
