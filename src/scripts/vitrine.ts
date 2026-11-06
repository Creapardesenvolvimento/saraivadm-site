// Recursos do Portfólio e do Antes e depois: aparecer ao rolar, comparador antes/depois
// e visualizador em tela cheia. Sem bibliotecas.

import { whatsappUrl } from '../data/site';

const SETAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>';
const reduzido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- aparecer ao rolar ---------- */
let io: IntersectionObserver | null = null;
export function revelar(raiz: ParentNode = document) {
  const itens = raiz.querySelectorAll<HTMLElement>('.vt-revela:not(.is-in)');
  if (!('IntersectionObserver' in window) || reduzido()) {
    itens.forEach((el) => el.classList.add('is-in'));
    return;
  }
  io ??= new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io!.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  itens.forEach((el) => io!.observe(el));
}

/* ---------- comparador antes/depois ---------- */
export interface Comparador extends HTMLElement {
  varrer?: (atraso?: number) => void;
}

export function comparador(el: Comparador, { seguirMouse = true } = {}) {
  if (el.dataset.pronto) return el;
  el.dataset.pronto = '1';
  if (!el.querySelector('.cmp__linha')) {
    el.insertAdjacentHTML('beforeend', `<div class="cmp__linha" aria-hidden="true"><span class="cmp__knob">${SETAS}</span></div>`);
  }
  el.tabIndex = 0;
  el.setAttribute('role', 'slider');
  el.setAttribute('aria-valuemin', '0');
  el.setAttribute('aria-valuemax', '100');
  let p = 50;
  let raf = 0;
  const pos = (v: number) => {
    p = Math.max(0, Math.min(100, v));
    el.style.setProperty('--p', p + '%');
    el.setAttribute('aria-valuenow', String(Math.round(p)));
  };
  const parar = () => cancelAnimationFrame(raf);
  const doX = (x: number) => {
    const r = el.getBoundingClientRect();
    pos(((x - r.left) / r.width) * 100);
  };
  let arrastando = false;
  el.addEventListener('pointerdown', (e) => {
    parar();
    arrastando = true;
    el.classList.add('is-arrastando');
    el.setPointerCapture(e.pointerId);
    doX(e.clientX);
  });
  el.addEventListener('pointermove', (e) => {
    if (arrastando || (seguirMouse && e.pointerType === 'mouse')) {
      parar();
      doX(e.clientX);
    }
  });
  const soltar = () => {
    arrastando = false;
    el.classList.remove('is-arrastando');
  };
  el.addEventListener('pointerup', soltar);
  el.addEventListener('pointercancel', soltar);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      parar();
      pos(p + (e.key === 'ArrowLeft' ? -5 : 5));
      e.preventDefault();
      e.stopPropagation();
    }
  });
  // Varredura automática: mostra o antes e o depois sem a pessoa precisar mexer
  el.varrer = (atraso = 0) => {
    if (reduzido()) return;
    parar();
    const t0 = performance.now() + atraso;
    const chaves = [
      [0, 50],
      [0.28, 10],
      [0.7, 90],
      [1, 50],
    ];
    const dur = 3600;
    const passo = (agora: number) => {
      const t = Math.max(0, Math.min(1, (agora - t0) / dur));
      let i = 0;
      while (i < chaves.length - 2 && t > chaves[i + 1][0]) i++;
      const [ta, va] = chaves[i];
      const [tb, vb] = chaves[i + 1];
      const k = Math.max(0, Math.min(1, (t - ta) / (tb - ta)));
      const s = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      pos(va + (vb - va) * s);
      if (t < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
  };
  pos(50);
  return el;
}

/* ---------- visualizador em tela cheia ---------- */
interface ItemVisualizador {
  titulo: string;
  sub: string;
  /** elemento a mostrar (é clonado) */
  midia: HTMLElement;
}

export function visualizador({ textoBotao }: { textoBotao: string }) {
  const raiz = document.createElement('div');
  raiz.className = 'vz';
  raiz.setAttribute('role', 'dialog');
  raiz.setAttribute('aria-modal', 'true');
  raiz.setAttribute('aria-label', 'Fotos em tela cheia');
  raiz.innerHTML = `
    <div class="vz__topo"><span class="vz__conta"></span><button type="button" class="vz__btn vz__fechar" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="vz__palco">
      <button type="button" class="vz__btn vz__nav vz__nav--ant" aria-label="Anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="vz__midia"></div>
      <button type="button" class="vz__btn vz__nav vz__nav--prox" aria-label="Próxima"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
    <div class="vz__barra"><div><h3 class="vz__titulo"></h3><p class="vz__sub"></p></div>
      <a class="btn vz__cta" target="_blank" rel="noopener">${textoBotao}</a></div>`;
  document.body.appendChild(raiz);
  const $ = <T extends HTMLElement>(s: string) => raiz.querySelector<T>(s)!;
  let i = 0;
  let itens: ItemVisualizador[] = [];
  let antes: HTMLElement | null = null;

  const mostrar = (n: number) => {
    i = (n + itens.length) % itens.length;
    const it = itens[i];
    const m = it.midia.cloneNode(true) as HTMLElement;
    m.classList.remove('vt-revela');
    m.removeAttribute('data-pronto');
    (m instanceof HTMLImageElement ? [m] : [...m.querySelectorAll('img')]).forEach((img) => {
      // força o navegador a escolher de novo o tamanho da foto, agora em tela cheia
      const ss = img.srcset;
      img.removeAttribute('srcset');
      img.loading = 'eager';
      img.sizes = '100vw';
      if (ss) img.srcset = ss;
    });
    $('.vz__midia').replaceChildren(m);
    $('.vz__conta').textContent = `${String(i + 1).padStart(2, '0')} / ${String(itens.length).padStart(2, '0')}`;
    $('.vz__titulo').textContent = it.titulo;
    $('.vz__sub').textContent = it.sub;
    $<HTMLAnchorElement>('.vz__cta').href = whatsappUrl(`Olá! Vi "${it.titulo}" no site e quero um projeto parecido com a Saraiva Design.`);
    if (m.classList.contains('cmp')) comparador(m, { seguirMouse: false }).varrer?.(300);
  };
  const abrir = (lista: ItemVisualizador[], n: number) => {
    itens = lista;
    antes = document.activeElement as HTMLElement;
    raiz.classList.add('is-aberto');
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.classList.add('vz-aberto');
    mostrar(n);
    requestAnimationFrame(() => raiz.classList.add('is-visivel'));
    $('.vz__fechar').focus();
  };
  const fechar = () => {
    raiz.classList.remove('is-visivel');
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('vz-aberto');
    setTimeout(() => {
      raiz.classList.remove('is-aberto');
      $('.vz__midia').replaceChildren();
    }, 250);
    antes?.focus();
  };
  $('.vz__fechar').addEventListener('click', fechar);
  $('.vz__nav--ant').addEventListener('click', () => mostrar(i - 1));
  $('.vz__nav--prox').addEventListener('click', () => mostrar(i + 1));
  raiz.addEventListener('click', (e) => {
    const alvo = e.target as HTMLElement;
    if (alvo === raiz || alvo.classList.contains('vz__palco') || alvo.classList.contains('vz__midia')) fechar();
  });
  addEventListener('keydown', (e) => {
    if (!raiz.classList.contains('is-aberto')) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    if (e.key === 'ArrowRight') mostrar(i + 1);
    if (e.key === 'Tab') {
      // mantém o foco dentro do visualizador
      const foco = [...raiz.querySelectorAll<HTMLElement>('button, a, [tabindex="0"]')].filter((x) => x.offsetParent);
      const pri = foco[0];
      const ult = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === pri) (ult.focus(), e.preventDefault());
      else if (!e.shiftKey && document.activeElement === ult) (pri.focus(), e.preventDefault());
    }
  });
  let x0 = 0;
  raiz.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  raiz.addEventListener('touchend', (e) => {
    if ((e.target as HTMLElement).closest('.cmp')) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 60) mostrar(i + (dx < 0 ? 1 : -1));
  });
  return { abrir };
}

/* ---------- filtros por categoria (botões) ---------- */
export function filtros(
  grupo: HTMLElement,
  aoMudar: (categoria: string) => void,
) {
  grupo.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-cat]');
    if (!b) return;
    grupo.querySelectorAll('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    aoMudar(b.dataset.cat!);
  });
}
