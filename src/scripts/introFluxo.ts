// Seção texto + vídeo (ou foto) das páginas de produto: o texto corre em duas colunas e o vídeo fica no topo da
// coluna da direita, com o restante do texto continuando logo abaixo dele.
// O ponto em que o texto passa para a direita é escolhido medindo a página, para as duas colunas terminarem
// na mesma altura: primeiro entre parágrafos e, para o acerto fino, partindo um parágrafo entre duas palavras
// sempre no fim de uma frase (a leitura continua normalmente embaixo do vídeo). Sem JavaScript, a seção fica no layout antigo (texto | vídeo).

const CELULAR = '(max-width: 900px)';
const continuacoes = new WeakMap<HTMLElement, HTMLElement>(); // parte de baixo -> parágrafo original

function blocosDe(conteudo: HTMLElement, midia: HTMLElement): HTMLElement[] {
  const lista: HTMLElement[] = [];
  for (const filho of Array.from(conteudo.children) as HTMLElement[]) {
    if (filho === midia || filho.tagName === 'SCRIPT') continue;
    if (filho.classList.contains('pm-texto')) {
      for (const p of Array.from(filho.children) as HTMLElement[]) if (p !== midia) lista.push(p);
    } else lista.push(filho);
  }
  return lista;
}

function colocar(conteudo: HTMLElement, midia: HTMLElement, blocos: HTMLElement[], k: number) {
  if (k >= blocos.length) conteudo.appendChild(midia);
  else blocos[k].parentNode!.insertBefore(midia, blocos[k]);
}

/** Altura (base) da coluna da esquerda e da direita */
function colunas(grade: HTMLElement, midia: HTMLElement): [number, number] {
  const meio = midia.getBoundingClientRect().left - 2;
  let esq = 0;
  let dir = 0;
  grade.querySelectorAll<HTMLElement>('.pm-intro__midia, h2, p, .pm-selo, .pm-btn').forEach((e) => {
    const r = e.getBoundingClientRect();
    if (r.height === 0) return;
    if (r.left < meio) esq = Math.max(esq, r.bottom);
    else dir = Math.max(dir, r.bottom);
  });
  return [esq, dir];
}

/** Pontos em que o parágrafo pode ser partido: início de cada frase (depois de . ! ?), para a leitura
 *  não ser cortada no meio de uma frase ao passar de uma coluna para a outra */
function palavras(p: HTMLElement): { no: Text; pos: number }[] {
  const lista: { no: Text; pos: number }[] = [];
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  let no: Text | null;
  let anteriorEspaco = true;
  let fimDeFrase = false;
  while ((no = walker.nextNode() as Text | null)) {
    const t = no.data;
    for (let i = 0; i < t.length; i++) {
      const espaco = /\s/.test(t[i]);
      if (!espaco && anteriorEspaco && fimDeFrase) lista.push({ no, pos: i });
      if (!espaco) fimDeFrase = /[.!?]/.test(t[i]);
      anteriorEspaco = espaco;
    }
  }
  return lista;
}

/** Parte o parágrafo na palavra n: a parte de baixo vai logo depois do vídeo */
function partir(p: HTMLElement, n: number, midia: HTMLElement): HTMLElement | null {
  const pos = palavras(p)[n];
  if (!pos) return null;
  const r = document.createRange();
  r.setStart(pos.no, pos.pos);
  r.setEndAfter(p.lastChild!);
  const baixo = p.cloneNode(false) as HTMLElement;
  baixo.appendChild(r.extractContents());
  baixo.classList.add('pm-continua');
  midia.after(baixo);
  continuacoes.set(baixo, p);
  return baixo;
}

function juntar(baixo: HTMLElement) {
  const p = continuacoes.get(baixo);
  if (!p) return;
  while (baixo.firstChild) p.appendChild(baixo.firstChild);
  baixo.remove();
  p.normalize();
}

function desfazer(grade: HTMLElement) {
  grade.querySelectorAll<HTMLElement>('.pm-continua').forEach(juntar);
}

function organizar(grade: HTMLElement) {
  const conteudo = grade.firstElementChild as HTMLElement | null;
  const midia = grade.querySelector<HTMLElement>('.pm-intro__midia');
  if (!conteudo || !midia) return;
  desfazer(grade);
  const blocos = blocosDe(conteudo, midia);
  const lead = blocos.findIndex((b) => b.classList.contains('pm-lead'));
  const titulo = blocos.findIndex((b) => b.matches('h2'));
  const inicio = (lead >= 0 ? lead : titulo) + 1;

  // Celular: uma coluna, vídeo logo depois do subtítulo
  if (window.matchMedia(CELULAR).matches) {
    colocar(conteudo, midia, blocos, inicio);
    return;
  }

  // 1) Entre parágrafos: fica com o ponto que deixa a seção mais baixa
  let melhor = blocos.length;
  let menor = Infinity;
  for (let k = inicio + 1; k <= blocos.length; k++) {
    colocar(conteudo, midia, blocos, k);
    const altura = grade.offsetHeight;
    if (altura < menor - 1) {
      menor = altura;
      melhor = k;
    }
  }
  colocar(conteudo, midia, blocos, melhor);

  // 2) Acerto fino: parte o parágrafo da divisa entre duas palavras para as colunas terminarem juntas
  const [esq, dir] = colunas(grade, midia);
  if (Math.abs(esq - dir) < 30) return;
  const p = dir > esq ? blocos[melhor] : blocos[melhor - 1];
  if (!p || p.tagName !== 'P' || p.classList.contains('pm-lead')) return;
  if (dir > esq) p.after(midia); // o parágrafo de baixo sobe para a esquerda e é partido
  const total = palavras(p).length;
  if (total < 1) {
    colocar(conteudo, midia, blocosDe(conteudo, midia), melhor);
    return;
  }
  const diferenca = (n: number) => {
    const baixo = partir(p, n, midia);
    const [e, d] = colunas(grade, midia);
    if (baixo) juntar(baixo);
    return { e, d, altura: Math.max(e, d) };
  };
  // n = em qual início de frase partir; procura o ponto em que a esquerda alcança a direita
  let lo = 0;
  let hi = total - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    const { e, d } = diferenca(m);
    if (e >= d) hi = m;
    else lo = m + 1;
  }
  const candidatos = [lo - 1, lo].filter((n) => n >= 0 && n < total);
  let escolhido = candidatos[0];
  let melhorAltura = Infinity;
  for (const n of candidatos) {
    const { altura } = diferenca(n);
    if (altura < melhorAltura) {
      melhorAltura = altura;
      escolhido = n;
    }
  }
  // só parte se ficar melhor que sem partir
  if (melhorAltura < Math.max(esq, dir) - 10) partir(p, escolhido, midia);
  else colocar(conteudo, midia, blocosDe(conteudo, midia), melhor);
}

export function introFluxo() {
  const grades = Array.from(document.querySelectorAll<HTMLElement>('.pm-intro__grid'));
  grades.forEach((g) => {
    // scripts embutidos (ex.: o do vídeo do YouTube) não contam
    const filhos = (Array.from(g.children) as HTMLElement[]).filter((c) => c.tagName !== 'SCRIPT');
    if (filhos.length !== 2) return;
    const [conteudo, midia] = filhos;
    midia.classList.add('pm-intro__midia');
    conteudo.appendChild(midia);
    if (conteudo !== g.firstElementChild) g.insertBefore(conteudo, g.firstElementChild);
    g.classList.add('is-fluxo');
  });
  const tudo = () => grades.forEach(organizar);
  tudo();
  document.fonts?.ready.then(tudo);
  let espera = 0;
  let largura = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === largura) return; // barra do navegador do celular não conta
    largura = window.innerWidth;
    clearTimeout(espera);
    espera = window.setTimeout(tudo, 150);
  });
}
