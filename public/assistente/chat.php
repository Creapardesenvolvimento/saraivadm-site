<?php
/**
 * Recebe uma mensagem do chat (widget.js), conversa com o Claude e devolve a resposta.
 */
define('CPAI', true);
require __DIR__ . '/nucleo.php';

guarda();
$c = cfg();

try {
    if (!limite_ok()) erro('Você enviou muitas mensagens em pouco tempo. Tente de novo daqui a pouco.', 429);
} catch (Throwable $e) {
    error_log('[assistente] banco: ' . $e->getMessage());
    erro('Tive um problema para responder agora. Tente de novo em instantes.', 500);
}

$pedido = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($pedido)) erro('Pedido inválido.');

$texto = trim(strip_tags((string) ($pedido['text'] ?? '')));
$texto = mb_substr($texto, 0, 2000);
$voz   = !empty($pedido['voice']);

/* Foto (base64, já reduzida no navegador) */
$foto = null;
if (is_array($pedido['image'] ?? null) && !empty($pedido['image']['data'])) {
    $bruto = base64_decode((string) $pedido['image']['data'], true);
    if ($bruto === false || strlen($bruto) > 4 * 1024 * 1024) erro('Foto muito grande ou inválida. Tente outra.');
    $info = @getimagesizefromstring($bruto);
    if (!$info || !in_array($info['mime'], ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) {
        erro('Formato de imagem não aceito. Use JPG, PNG ou WebP.');
    }
    $foto = ['type' => 'image', 'source' => ['type' => 'base64', 'media_type' => $info['mime'], 'data' => base64_encode($bruto)]];
}
if ($texto === '' && !$foto) erro('Mensagem vazia.');

/* Conversa: carrega ou cria */
$pdo   = db();
$token = preg_replace('/[^A-Za-z0-9]/', '', (string) ($pedido['token'] ?? ''));
$linha = null;
if ($token !== '') {
    $q = $pdo->prepare('SELECT * FROM conversas WHERE token = ?');
    $q->execute([$token]);
    $linha = $q->fetch() ?: null;
}

if ($linha && (int) $linha['turnos'] >= $c['max_turnos']) {
    erro('Esta conversa ficou longa demais. Comece uma nova conversa pelo botão ↻.', 409);
}
if ($linha && $foto && (int) $linha['fotos'] >= $c['max_fotos']) {
    erro('Limite de fotos desta conversa atingido. Descreva por texto ou comece uma nova conversa.', 409);
}

if (!$linha) {
    $token = bin2hex(random_bytes(20));
    $agora = time();
    $pdo->prepare('INSERT INTO conversas (token, visitante, criada, atualizada, modelo, primeira_msg, mensagens) VALUES (?, ?, ?, ?, ?, ?, ?)')
        ->execute([$token, visitante(), $agora, $agora, $c['modelo'], $texto !== '' ? $texto : '[foto]', '[]']);
    $q = $pdo->prepare('SELECT * FROM conversas WHERE token = ?');
    $q->execute([$token]);
    $linha = $q->fetch();
    if (!$linha) erro('Não foi possível iniciar a conversa.', 500);
}

// Evita duas respostas ao mesmo tempo na mesma conversa (o histórico só cresce no fim).
$trava = $pdo->prepare('UPDATE conversas SET ocupada_ate = ? WHERE id = ? AND ocupada_ate < ?');
$trava->execute([time() + 120, $linha['id'], time()]);
if ($trava->rowCount() === 0) erro('Ainda estou respondendo a mensagem anterior.', 429);

try {
    $resultado = rodada($linha, $texto, $foto, $voz);
} catch (Throwable $e) {
    $resultado = ['erro' => $e->getMessage(), 'status' => 500];
} finally {
    $pdo->prepare('UPDATE conversas SET ocupada_ate = 0 WHERE id = ?')->execute([$linha['id']]);
}

if (isset($resultado['erro'])) {
    error_log('[assistente] ' . $resultado['erro']);
    $msg = in_array($resultado['status'], [429, 529], true)
        ? 'Estamos com muitos atendimentos agora. Tente de novo em alguns segundos.'
        : 'Tive um problema para responder agora. Tente de novo em instantes.';
    erro($msg, 502);
}

$resultado['token'] = $token;
responder($resultado);

/**
 * Uma rodada: envia a mensagem, executa as ferramentas pedidas pelo Claude
 * até ele terminar a resposta, e salva o histórico.
 */
function rodada(array $linha, string $texto, ?array $foto, bool $voz): array
{
    $c   = cfg();
    $pdo = db();

    $mensagens = json_decode((string) $linha['mensagens']); // objetos, para preservar o formato devolvido pela API
    if (!is_array($mensagens)) $mensagens = [];

    $conteudo = [];
    if ($foto) $conteudo[] = $foto;
    if ($texto === '') $texto = '(O visitante enviou esta foto sem texto.)';
    if ($voz) $texto = '[mensagem de voz transcrita] ' . $texto;
    $conteudo[]  = ['type' => 'text', 'text' => $texto];
    $mensagens[] = ['role' => 'user', 'content' => $conteudo];

    $sistema = [['type' => 'text', 'text' => prompt_sistema(), 'cache_control' => ['type' => 'ephemeral']]];
    $uso     = ['in' => 0, 'out' => 0, 'cr' => 0, 'cw' => 0];
    $whats   = false;
    $final   = null;

    for ($i = 0; $i < 8; $i++) {
        $res = claude([
            'model'         => $c['modelo'],
            'max_tokens'    => 8000,
            'system'        => $sistema,
            'tools'         => definicoes_ferramentas(),
            'messages'      => $mensagens,
            'output_config' => ['effort' => $c['esforco']],
            'cache_control' => ['type' => 'ephemeral'], // cache automático do histórico
        ]);
        if (is_array($res)) return $res;

        $u = $res->usage ?? null;
        if ($u) {
            $uso['in']  += (int) ($u->input_tokens ?? 0);
            $uso['out'] += (int) ($u->output_tokens ?? 0);
            $uso['cr']  += (int) ($u->cache_read_input_tokens ?? 0);
            $uso['cw']  += (int) ($u->cache_creation_input_tokens ?? 0);
        }

        // Recusa do filtro de segurança: não salva esta rodada, o histórico fica como estava.
        if (($res->stop_reason ?? '') === 'refusal') {
            salvar_uso((int) $linha['id'], $uso, false);
            return ['reply' => 'Desculpe, não consigo ajudar com isso por aqui. Posso ajudar com outra dúvida?', 'cards' => new stdClass(), 'cartChanged' => false];
        }

        // O conteúdo vai de volta para a API exatamente como veio.
        $mensagens[] = ['role' => 'assistant', 'content' => $res->content];

        if (($res->stop_reason ?? '') !== 'tool_use') {
            $final = $res;
            break;
        }

        // Executa todas as ferramentas pedidas e devolve os resultados numa única mensagem.
        $resultados = [];
        foreach ($res->content as $bloco) {
            if (($bloco->type ?? '') !== 'tool_use') continue;
            $out = executar_ferramenta($bloco->name, $bloco->input ?? []);
            if ($out['whatsapp']) $whats = true;
            $item = ['type' => 'tool_result', 'tool_use_id' => $bloco->id, 'content' => $out['content']];
            if ($out['error']) $item['is_error'] = true;
            $resultados[] = $item;
        }
        $mensagens[] = ['role' => 'user', 'content' => $resultados];
    }

    if (!$final) return ['erro' => 'Limite de chamadas de ferramenta atingido nesta rodada.', 'status' => 500];

    $resposta = texto_da_resposta($final);
    if ($resposta === '') $resposta = 'Pode repetir de outro jeito? Não consegui montar a resposta.';

    // Salva o histórico completo (já com a resposta) e os contadores.
    $pdo->prepare('UPDATE conversas SET mensagens = ?, turnos = turnos + 1, fotos = fotos + ?, modelo = ? WHERE id = ?')
        ->execute([json_encode($mensagens, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $foto ? 1 : 0, $c['modelo'], $linha['id']]);
    salvar_uso((int) $linha['id'], $uso, $whats);

    return ['reply' => $resposta, 'cards' => new stdClass(), 'cartChanged' => false];
}

function salvar_uso(int $id, array $uso, bool $whats): void
{
    db()->prepare('UPDATE conversas SET tokens_entrada = tokens_entrada + ?, tokens_saida = tokens_saida + ?,
        cache_leitura = cache_leitura + ?, cache_escrita = cache_escrita + ?, whatsapp = MAX(whatsapp, ?), atualizada = ? WHERE id = ?')
        ->execute([$uso['in'], $uso['out'], $uso['cr'], $uso['cw'], $whats ? 1 : 0, time(), $id]);
}
