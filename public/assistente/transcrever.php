<?php
/**
 * Transcrição de voz no servidor (OpenAI), para navegadores sem reconhecimento
 * de voz próprio, como o Safari do iPhone. Só funciona com OPENAI_API_KEY configurada.
 */
define('CPAI', true);
require __DIR__ . '/nucleo.php';

guarda();
$c = cfg();
if ($c['openai_key'] === '') erro('Transcrição indisponível.', 503);
if (!limite_ok()) erro('Você enviou muitas mensagens em pouco tempo. Tente de novo daqui a pouco.', 429);

$arquivo = $_FILES['audio'] ?? null;
if (!$arquivo || $arquivo['error'] !== UPLOAD_ERR_OK || $arquivo['size'] > 10 * 1024 * 1024 || !is_uploaded_file($arquivo['tmp_name'])) {
    erro('Áudio inválido ou muito longo.');
}

$mime = (string) $arquivo['type'];
if (!preg_match('#^(audio|video)/(webm|ogg|mp4|mpeg|mp3|wav|x-m4a|m4a|aac)#', $mime, $m)) {
    erro('Formato de áudio não aceito.');
}
$ext = ['webm' => 'webm', 'ogg' => 'ogg', 'mp4' => 'mp4', 'mpeg' => 'mp3', 'mp3' => 'mp3', 'wav' => 'wav', 'x-m4a' => 'm4a', 'm4a' => 'm4a', 'aac' => 'm4a'][$m[2]];

$ch = curl_init('https://api.openai.com/v1/audio/transcriptions');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $c['openai_key']],
    CURLOPT_POSTFIELDS     => [
        'model'           => getenv('ASSISTENTE_MODELO_VOZ') ?: 'whisper-1',
        'language'        => 'pt',
        'response_format' => 'json',
        'file'            => new CURLFile($arquivo['tmp_name'], $mime, 'audio.' . $ext),
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 60,
]);
$corpo = curl_exec($ch);
curl_close($ch);

$dados = is_string($corpo) ? json_decode($corpo, true) : null;
if (!is_array($dados) || empty($dados['text'])) {
    error_log('[assistente] transcrição falhou: ' . (is_string($corpo) ? substr($corpo, 0, 300) : 'sem resposta'));
    erro('Não consegui entender o áudio. Tente de novo ou escreva.', 502);
}

responder(['text' => trim($dados['text'])]);
