// Número de colunas de uma grade a partir da quantidade de itens, para não sobrar item sozinho na última linha.
// Preferência: dividir certinho; senão, a coluna mais próxima da preferida que deixe a última linha com 2 ou mais.
export function colunasPara(n: number, preferida = 3, maximo = 4): number {
  if (n <= 1) return 1;
  if (n <= maximo) return n;
  const opcoes = [preferida, preferida + 1, preferida - 1, preferida - 2].filter((c) => c >= 2 && c <= maximo);
  return opcoes.find((c) => n % c === 0) ?? opcoes.find((c) => n % c >= 2) ?? preferida;
}

/** Divide itens (pela proporção largura/altura) em fileiras de altura parecida, sem fileira com 1 item só. */
export function fileiras(proporcoes: number[], largura = 1180, altura = 250): number[][] {
  const total = proporcoes.reduce((a, b) => a + b, 0);
  const n = proporcoes.length;
  let linhas = Math.max(1, Math.round((total * altura) / largura));
  linhas = Math.min(linhas, Math.floor(n / 2) || 1);
  const alvo = total / linhas;
  const grupos: number[][] = [];
  let atual: number[] = [];
  let soma = 0;
  proporcoes.forEach((p, i) => {
    const restantesItens = n - i;
    const restantesLinhas = linhas - grupos.length;
    // fecha a fileira quando passar do alvo, se ainda sobrarem itens suficientes (2 por fileira)
    if (atual.length >= 2 && soma + p / 2 > alvo && restantesLinhas > 1 && restantesItens >= 2 * (restantesLinhas - 1)) {
      grupos.push(atual);
      atual = [];
      soma = 0;
    }
    atual.push(i);
    soma += p;
  });
  if (atual.length) grupos.push(atual);
  // última fileira com 1 item: junta com a anterior
  if (grupos.length > 1 && grupos[grupos.length - 1].length === 1) grupos[grupos.length - 2].push(...grupos.pop()!);
  return grupos;
}
