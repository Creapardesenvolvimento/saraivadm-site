// Dados da empresa para o assistente de IA (lidos por public/assistente/chat.php).
import { site, menuPrincipal, mapsUrl } from '../../data/site';

export function GET() {
  const produtos = menuPrincipal.flatMap((item) =>
    item.filhos ? item.filhos.map((f) => ({ nome: f.label, url: f.href, grupo: item.label })) : [{ nome: item.label, url: item.href ?? '', grupo: item.label }],
  );
  return new Response(
    JSON.stringify({
      nome: site.nome,
      nomeCurto: site.nomeCurto,
      descricao: site.descricao,
      email: site.email,
      telefones: site.telefones.map((t) => t.exibicao),
      whatsapp: site.telefones[0].whatsapp,
      endereco: `${site.endereco.rua}, ${site.endereco.bairro}, ${site.endereco.cidade}-${site.endereco.uf}`,
      mapa: mapsUrl,
      redes: Object.fromEntries(Object.entries(site.redes).filter(([, v]) => v)),
      produtos,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}
