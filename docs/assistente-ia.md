# Assistente de IA (chat no canto esquerdo)

Adaptado do plugin "Creapar Assistente de Vendas IA" (WordPress) para o site estático.
O visitante tira dúvidas por texto, foto ou voz. O assistente responde com base no conteúdo
do site e encaminha para o WhatsApp com um resumo pronto quando a pessoa quer orçamento.

## Como funciona

| Parte | Arquivo |
| --- | --- |
| Chat na tela | `public/assistente/widget.js`, `widget.css` e `saraiva.css` (cores e cantos da marca) |
| Carregador e configurações | `src/components/Assistente.astro` e `assistente` em `src/data/site.ts` |
| Servidor | `public/assistente/chat.php` (conversa), `transcrever.php` (voz no iPhone), `nucleo.php` (funções) |
| Conteúdo que o assistente consulta | `dist/assistente/indice.json`, gerado a cada build por `ferramentas/indice-assistente.mjs` com o texto de todas as páginas |
| Dados da empresa | `dist/assistente/empresa.json`, gerado de `src/data/site.ts` |
| Conversas | SQLite em `/var/www/dados/assistente.sqlite`, apagadas depois de 30 dias |

Ao alterar uma página, o assistente passa a usar o texto novo no próximo deploy.

## Variáveis de ambiente no Easypanel

| Variável | Obrigatória | O que é |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | sim | Chave da API da Anthropic. Sem ela o chat fica desativado. |
| `ASSISTENTE_TESTE_CHAVE` | no modo de teste | Senha do link de teste (letras e números). Só quem abriu o link usa o chat. |
| `ASSISTENTE_MODELO` | não | `claude-sonnet-5-5` (padrão), `claude-haiku-5-5` (mais barato) ou `claude-opus-5-5` (melhor). |
| `ASSISTENTE_LIMITE_HORA` | não | Mensagens por visitante por hora. Padrão: 30. |
| `ASSISTENTE_DIAS_REGISTRO` | não | Dias que as conversas ficam guardadas. Padrão: 30. |
| `OPENAI_API_KEY` | não | Voz no iPhone (transcrição pela OpenAI). Ao usar, mude `vozNoServidor` para `true` em `site.ts`. |

Volume: monte um volume em `/var/www/dados` para as conversas não se perderem a cada deploy.
Sem volume o chat funciona normalmente, só sem histórico guardado.

## Modo de teste

Com `modo: 'teste'` em `src/data/site.ts`, o chat só aparece para quem abrir:

```
https://SEU-DOMINIO/?cpai_teste=VALOR_DE_ASSISTENTE_TESTE_CHAVE
```

O navegador guarda um cookie por 30 dias, então basta abrir o link uma vez.
Os demais visitantes não baixam nenhum arquivo do chat.

## Publicar para todos

1. Em `src/data/site.ts`, troque `modo: 'teste'` por `modo: 'publico'`.
2. No Easypanel, apague a variável `ASSISTENTE_TESTE_CHAVE`.
3. Faça o deploy.

Para desligar de vez: `ativo: false` em `site.ts`, ou apague `ANTHROPIC_API_KEY` no Easypanel.

## Ver as conversas

Ainda não há painel. As conversas ficam no arquivo SQLite do volume e os erros aparecem
nos logs do serviço no Easypanel, com o prefixo `[assistente]`.
