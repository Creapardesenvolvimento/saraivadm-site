// Vídeos curtos da equipe em obra (os "GIFs" do site antigo), em public/videos/obras/<pagina>-<n>.mp4 (+ .jpg de capa).
// Rodam sozinhos, sem som e em repetição, só quando aparecem na tela.
// Para trocar ou acrescentar: coloque o arquivo na pasta e ajuste a quantidade aqui.

import capaBambuShort from '../assets/img/paginas/forro-em-esteiras-de-bambu/yt-yO7H140JuYE.jpg';

export type Formato = 'vertical' | 'horizontal' | 'quadrado';

/** youtube: vídeos do YouTube (Shorts) que entram na mesma faixa, depois dos vídeos de obra */
export const videosObra: Record<string, { quantidade: number; formato: Formato; youtube?: { id: string; capa: ImageMetadata }[] }> = {
  'pergolado-de-madeira': { quantidade: 4, formato: 'vertical' },
  'pergolado-metalico': { quantidade: 4, formato: 'vertical' },
  'cobertura-para-pergolado': { quantidade: 4, formato: 'vertical' },
  pergoconfort: { quantidade: 4, formato: 'vertical' },
  'pergoconfort-max': { quantidade: 4, formato: 'vertical' },
  'forro-de-palha': { quantidade: 4, formato: 'vertical' },
  'forro-em-esteiras-de-bambu': { quantidade: 3, formato: 'vertical', youtube: [{ id: 'yO7H140JuYE', capa: capaBambuShort }] },
  'forro-de-lambril': { quantidade: 4, formato: 'vertical' },
  'deck-de-madeira': { quantidade: 4, formato: 'vertical' },
  'painel-ripado': { quantidade: 4, formato: 'vertical' },
  pergokit: { quantidade: 1, formato: 'quadrado' },
};
