<?php
/**
 * Recebe o formulário "Solicitar contato" e envia por e-mail.
 * Roda no próprio servidor (PHP). No Easypanel o envio usa o SMTP definido nas variáveis de ambiente.
 */

// ===== Configuração =====
$DESTINO   = getenv('EMAIL_DESTINO') ?: 'contato@saraivadm.com.br';
$REMETENTE = getenv('SMTP_FROM') ?: getenv('SMTP_USER') ?: 'site@saraivadm.com.br';   // precisa ser do mesmo domínio para não cair no spam
$OBRIGADO  = '/obrigado/';
// ========================

// Pedido de download de folder (popup): responde em JSON em vez de redirecionar.
$FOLDER = ($_POST['tipo'] ?? '') === 'folder';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /', true, 303);
    exit;
}

function campo(string $nome, int $max = 200): string {
    $v = trim((string)($_POST[$nome] ?? ''));
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
    return mb_substr($v, 0, $max);
}

function falhar(string $msg): void {
    global $FOLDER;
    if ($FOLDER) {
        http_response_code(400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'erro' => $msg]);
        exit;
    }
    http_response_code(400);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<title>Erro no envio</title><body style="font-family:sans-serif;max-width:560px;margin:80px auto;padding:0 20px;text-align:center">'
       . '<h1 style="color:#7a4a3f">Não foi possível enviar</h1><p>' . htmlspecialchars($msg) . '</p>'
       . '<p><a href="javascript:history.back()">Voltar e corrigir</a></p></body>';
    exit;
}

// Anti-spam: campo invisível preenchido ou envio rápido demais = robô.
$ts = (int)($_POST['ts'] ?? 0);
if (!empty($_POST['website']) || ($ts > 0 && time() - $ts < 3)) {
    if ($FOLDER) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => true]);
        exit;
    }
    header('Location: ' . $OBRIGADO, true, 303);
    exit;
}

$nome     = campo('nome', 120);
$telefone = campo('telefone', 30);
$email    = campo('email', 150);
$cidade   = campo('cidade', 100);
$origem   = campo('origem', 200);
$mensagem = mb_substr(trim((string)($_POST['mensagem'] ?? '')), 0, 3000);

if ($FOLDER) {
    if ($nome === '' || $telefone === '') {
        falhar('Preencha nome e WhatsApp.');
    }
} elseif ($nome === '' || $telefone === '' || $cidade === '') {
    falhar('Preencha nome, telefone e cidade.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    falhar('Informe um e-mail válido.');
}

$assunto = ($FOLDER ? 'Download de folder pelo site - ' : 'Novo contato pelo site - ') . $nome;
$corpo = ($FOLDER ? "Pedido de download de folder pelo site saraivadm.com.br\n\n" : "Novo contato recebido pelo site saraivadm.com.br\n\n")
       . "Nome: {$nome}\n"
       . "Telefone: {$telefone}\n"
       . "E-mail: {$email}\n"
       . "Cidade: {$cidade}\n"
       . "Página: {$origem}\n\n"
       . "Mensagem:\n{$mensagem}\n\n"
       . '---' . "\n" . 'Enviado em ' . date('d/m/Y H:i') . ' | IP ' . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";

$headers = [
    'From: Site Saraiva Design <' . $REMETENTE . '>',
    'Reply-To: ' . $nome . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$ok = mail($DESTINO, '=?UTF-8?B?' . base64_encode($assunto) . '?=', $corpo, implode("\r\n", $headers), '-f' . $REMETENTE);

if (!$ok) {
    falhar('Tente novamente em instantes ou fale conosco pelo WhatsApp.');
}

if ($FOLDER) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true]);
    exit;
}

header('Location: ' . $OBRIGADO, true, 303);
exit;
