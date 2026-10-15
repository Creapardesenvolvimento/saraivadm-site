// Animações do site: elementos surgem ao rolar a página e os números contam até o valor final.
// Sem JavaScript (ou com "reduzir movimento" ativado no aparelho) tudo aparece normalmente, sem animação.

// Elementos que surgem ao entrar na tela. Para animar algo novo, adicione o seletor aqui
// ou coloque o atributo data-revelar direto no HTML.
const SELETORES = [
  '[data-revelar]',
  // home
  '.sar-tradicao__grid > *',
  '.sar-stats li',
  '.sar-produtos__head',
  '.sar-projetos__head',
  '.sar-projetos__grid > *',
  '.sar-projetos__rodape',
  '.sar-dif__title',
  '.sar-dif__item',
  '.sar-dif__btn',
  '.sar-blog__head',
  '.sar-blog__grid > li',
  '.sar-showroom__bar',
  // comuns
  '.sar-produtos__grid > li',
  '.sar-form__inner',
  '.gal__grid > li',
  '.acd__item',
  '.blog-lista__grid > li',
  // páginas de produto
  '.pm-head',
  '.pm-intro__grid > *',
  '.pm-modelo__fotos',
  '.pm-modelo__texto',
  '.pm-madeira > *',
  '.pm-uso',
  '.pm-videos > *',
  '.pm-folder__grid > *',
].join(',');

const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function iniciarRevelar() {
  if (reduzir) return;
  // O que já está na tela ao abrir a página não é escondido (evita "piscar").
  let pendentes = Array.from(document.querySelectorAll<HTMLElement>(SELETORES)).filter(
    (el) => el.getBoundingClientRect().top > window.innerHeight,
  );
  pendentes.forEach((el) => el.setAttribute('data-revelar', ''));
  document.documentElement.classList.add('js-anima');

  const revelar = (el: HTMLElement, ordem: number) => {
    // Itens que entram juntos aparecem em sequência (efeito cascata).
    el.style.setProperty('--atraso', `${Math.min(ordem, 6) * 90}ms`);
    el.classList.add('is-visivel');
    // Depois da animação, devolve o elemento ao estilo normal (para os efeitos de hover).
    const limpar = () => {
      el.removeAttribute('data-revelar');
      el.classList.remove('is-visivel');
      el.style.removeProperty('--atraso');
    };
    el.addEventListener('transitionend', limpar, { once: true });
    setTimeout(limpar, 1800);
  };

  let agendado = false;
  const verificar = () => {
    agendado = false;
    const limite = window.innerHeight * 0.92;
    let ordem = 0;
    pendentes = pendentes.filter((el) => {
      // Revela o que entrou na tela e também o que já ficou para trás (ex.: pulo por link interno).
      if (el.getBoundingClientRect().top < limite) {
        revelar(el, ordem++);
        return false;
      }
      return true;
    });
    if (pendentes.length === 0) {
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
    }
  };
  const agendar = () => {
    if (agendado) return;
    agendado = true;
    setTimeout(verificar, 60);
  };
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar, { passive: true });
  verificar();
}

// Números que contam: "+100mil", "+5mil", "+25", "100%"
function iniciarContadores() {
  if (reduzir) return;
  let pendentes = Array.from(document.querySelectorAll<HTMLElement>('[data-contador], .sar-stats strong'));

  const contar = (el: HTMLElement) => {
    const original = el.textContent ?? '';
    const m = original.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return;
    const [, antes, numero, depois] = m;
    const alvo = parseInt(numero, 10);
    const duracao = 1400;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = `${antes}${Math.round(alvo * suave)}${depois}`;
      if (t < 1) requestAnimationFrame(passo);
      else el.textContent = original;
    };
    requestAnimationFrame(passo);
    // Garantia: o valor final sempre aparece, mesmo se a aba ficar em segundo plano.
    setTimeout(() => (el.textContent = original), duracao + 300);
  };

  const verificar = () => {
    pendentes = pendentes.filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
        contar(el);
        return false;
      }
      return true;
    });
    if (pendentes.length === 0) window.removeEventListener('scroll', verificar);
  };
  window.addEventListener('scroll', verificar, { passive: true });
  verificar();
}

iniciarRevelar();
iniciarContadores();
