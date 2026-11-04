/* Creapar Assistente de Vendas IA — botão flutuante e janela de chat.
   Adaptado para o site estático da Saraiva Design: as configurações vêm de window.CPAI
   (componente Assistente.astro) e o servidor é /assistente/chat.php. */
(function () {
  'use strict';

  var C = window.CPAI;
  if (!C || document.getElementById('cpai-root')) return;

  // Modo de teste: aparece só para quem abriu o link de teste (o carregador já gravou o cookie).
  if (C.testMode && !/(?:^|;\s*)cpai_teste=/.test(document.cookie)) return;

  var STORE_KEY = 'cpai_chat_v1';
  var MAX_AGE = 24 * 60 * 60 * 1000;
  var state = load() || { token: '', items: [], t: Date.now() };
  var busy = false;
  var pendingImage = null; // { data, url }

  /* ---------- Armazenamento local (só conveniência; pode falhar) ---------- */

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (s && Date.now() - s.t < MAX_AGE) return s;
    } catch (e) {}
    return null;
  }
  function save() {
    state.t = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ---------- Estrutura ---------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var ICON_CHAT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.4c-.5.4-1.3 0-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_RESET = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg>';
  var ICON_CAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  var ICON_MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';

  var root = el('div', 'cpai-root cpai-' + (C.position === 'left' ? 'left' : 'right'));
  root.id = 'cpai-root';
  root.style.setProperty('--cpai-accent', C.color || '#1f7a4d');

  var launcher = el('button', 'cpai-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Abrir atendimento');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = ICON_CHAT + '<span class="cpai-launcher-label">Posso ajudar?</span>';

  var panel = el('section', 'cpai-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', C.name);
  panel.hidden = true;

  var head = el('header', 'cpai-head');
  var title = el('div', 'cpai-title');
  title.appendChild(el('strong', null, C.name));
  title.appendChild(el('span', 'cpai-sub', 'Responde na hora · texto, foto ou voz'));
  var resetBtn = iconButton(ICON_RESET, 'Começar nova conversa', 'cpai-ghost');
  var closeBtn = iconButton(ICON_CLOSE, 'Fechar', 'cpai-ghost');
  head.appendChild(title);
  head.appendChild(resetBtn);
  head.appendChild(closeBtn);

  var log = el('div', 'cpai-log');
  log.setAttribute('aria-live', 'polite');

  var preview = el('div', 'cpai-preview');
  preview.hidden = true;

  var form = el('form', 'cpai-form');
  var fileInput = el('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;
  var camBtn = iconButton(ICON_CAM, 'Enviar foto', 'cpai-tool');
  var input = el('textarea', 'cpai-input');
  input.rows = 1;
  input.placeholder = 'Escreva sua dúvida…';
  input.setAttribute('aria-label', 'Mensagem');
  input.maxLength = 2000;
  var micBtn = iconButton(ICON_MIC, 'Falar', 'cpai-tool');
  var sendBtn = iconButton(ICON_SEND, 'Enviar', 'cpai-send');
  sendBtn.type = 'submit';

  form.appendChild(fileInput);
  if (C.maxImages > 0) form.appendChild(camBtn);
  form.appendChild(input);
  form.appendChild(micBtn);
  form.appendChild(sendBtn);

  var foot = el('p', 'cpai-foot', 'Atendimento com inteligência artificial. Não envie dados de cartão ou senhas.');

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(preview);
  panel.appendChild(form);
  panel.appendChild(foot);
  root.appendChild(panel);
  root.appendChild(launcher);
  document.body.appendChild(root);

  function iconButton(svg, label, cls) {
    var b = el('button', cls);
    b.type = 'button';
    b.innerHTML = svg;
    b.setAttribute('aria-label', label);
    b.title = label;
    return b;
  }

  /* ---------- Abrir e fechar ---------- */

  function open() {
    panel.hidden = false;
    root.classList.add('cpai-open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!log.childNodes.length) renderAll();
    scrollDown();
    setTimeout(function () { input.focus(); }, 50);
  }
  function close() {
    panel.hidden = true;
    root.classList.remove('cpai-open');
    launcher.setAttribute('aria-expanded', 'false');
    stopVoice();
    launcher.focus();
  }

  launcher.addEventListener('click', function () { panel.hidden ? open() : close(); });
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  resetBtn.addEventListener('click', function () {
    if (busy) return;
    state = { token: '', items: [], t: Date.now() };
    save();
    clearImage();
    renderAll();
    input.focus();
  });

  /* ---------- Mensagens ---------- */

  function renderAll() {
    log.innerHTML = '';
    addBubble('bot', C.welcome, null, false);
    state.items.forEach(function (m) { addBubble(m.role, m.text, m.cards, m.image); });
  }

  function addBubble(role, text, cards, hadImage) {
    var row = el('div', 'cpai-msg cpai-' + role);
    var bubble = el('div', 'cpai-bubble');
    if (role === 'user') {
      if (hadImage) {
        var tag = el('span', 'cpai-photo-tag', '📷 foto');
        bubble.appendChild(tag);
      }
      if (text) bubble.appendChild(document.createTextNode(text));
    } else if (role === 'error') {
      bubble.textContent = text;
    } else {
      renderRich(bubble, text, cards || {});
    }
    row.appendChild(bubble);
    log.appendChild(row);
    scrollDown();
    return row;
  }

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Markdown simples: **negrito**, [texto](url), links soltos e listas com "-".
  function inline(s) {
    s = escapeHtml(s);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, function (m, label, url) {
      // Link do WhatsApp vira botão, para o visitante não perder o próximo passo.
      var wa = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(url) ? ' class="cpai-wa"' : '';
      // Páginas do próprio site abrem na mesma aba (a conversa continua salva).
      var fora = url.charAt(0) === '/' ? '' : ' target="_blank" rel="noopener"';
      return '<a href="' + url + '"' + fora + wa + '>' + label + '</a>';
    });
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, function (m, pre, url) {
      return pre + '<a href="' + url + '" target="_blank" rel="noopener">' + url.replace(/^https?:\/\//, '').replace(/\/$/, '') + '</a>';
    });
    return s;
  }

  function renderRich(container, text, cards) {
    var lines = String(text || '').split('\n');
    var list = null;
    var para = [];

    function flush() {
      if (para.length) {
        var p = el('p');
        p.innerHTML = para.map(inline).join('<br>');
        container.appendChild(p);
        para = [];
      }
    }

    lines.forEach(function (line) {
      var card = line.match(/^\s*\[\[produto:(\d+)\]\]\s*$/);
      var item = line.match(/^\s*[-•*]\s+(.*)$/);
      if (card) {
        flush(); list = null;
        var data = cards[card[1]];
        if (data) container.appendChild(productCard(data));
        return;
      }
      if (item) {
        flush();
        if (!list) { list = el('ul'); container.appendChild(list); }
        var li = el('li');
        li.innerHTML = inline(item[1]);
        list.appendChild(li);
        return;
      }
      list = null;
      if (line.trim() === '') { flush(); return; }
      // Marcador no meio da frase: remove para não aparecer cru.
      para.push(line.replace(/\[\[produto:\d+\]\]/g, ''));
    });
    flush();
  }

  function productCard(p) {
    var card = el('div', 'cpai-card');
    var img = el('img');
    img.src = p.image;
    img.alt = '';
    img.loading = 'lazy';
    var body = el('div', 'cpai-card-body');
    var name = el('a', 'cpai-card-name', p.name);
    name.href = p.url;
    name.target = '_blank';
    name.rel = 'noopener';
    var price = el('div', 'cpai-card-price');
    if (p.oldPrice) price.appendChild(el('s', null, p.oldPrice));
    price.appendChild(el('span', null, p.price));
    var actions = el('div', 'cpai-card-actions');
    if (p.inStock) {
      var want = el('button', 'cpai-card-buy', p.variable ? 'Ver opções' : 'Quero este');
      want.type = 'button';
      want.addEventListener('click', function () {
        send(p.variable
          ? 'Quais são as opções do produto "' + p.name + '" (ID ' + p.id + ')?'
          : 'Quero adicionar "' + p.name + '" (ID ' + p.id + ') ao carrinho.');
      });
      actions.appendChild(want);
    } else {
      actions.appendChild(el('span', 'cpai-card-out', 'Sem estoque'));
    }
    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(actions);
    card.appendChild(img);
    card.appendChild(body);
    return card;
  }

  function cartChip(count) {
    var row = el('div', 'cpai-msg cpai-bot');
    var a = el('a', 'cpai-chip', '🛒 Ver carrinho' + (count ? ' (' + count + ')' : ''));
    a.href = C.cartUrl;
    row.appendChild(a);
    log.appendChild(row);
    scrollDown();
  }

  function typing() {
    var row = el('div', 'cpai-msg cpai-bot cpai-typing');
    row.innerHTML = '<div class="cpai-bubble"><i></i><i></i><i></i></div>';
    log.appendChild(row);
    scrollDown();
    return row;
  }

  /* ---------- Envio ---------- */

  var ROTAS = { chat: 'chat.php', transcribe: 'transcrever.php' };

  function api(path, opts) {
    opts.headers = opts.headers || {};
    opts.credentials = 'same-origin';
    return fetch(C.endpoint + ROTAS[path], opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) throw new Error(data.error || data.message || 'Não foi possível responder agora.');
        return data;
      });
    });
  }

  function setBusy(on) {
    busy = on;
    sendBtn.disabled = on;
    root.classList.toggle('cpai-busy', on);
  }

  function send(text, voice) {
    text = (text || '').trim();
    if (busy || (!text && !pendingImage)) return;

    var image = pendingImage;
    var item = { role: 'user', text: text, image: !!image };
    state.items.push(item);
    save();
    addBubble('user', text, null, !!image);
    input.value = '';
    autosize();
    clearImage();

    setBusy(true);
    var dots = typing();
    var body = { token: state.token, text: text, voice: !!voice };
    if (image) body.image = { data: image.data };

    api('chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (data) {
      dots.remove();
      if (data.token) state.token = data.token;
      var cards = data.cards || {};
      state.items.push({ role: 'bot', text: data.reply, cards: cards });
      save();
      addBubble('bot', data.reply, cards);
      if (data.cartChanged) {
        refreshCart();
        cartChip(data.cartCount);
      }
    }).catch(function (err) {
      dots.remove();
      addBubble('error', err.message || 'Falha de conexão. Tente de novo.');
    }).then(function () {
      setBusy(false);
      input.focus();
    });
  }

  // Atualiza o mini-carrinho do tema, se ele usar os fragmentos do WooCommerce.
  function refreshCart() {
    if (window.jQuery) {
      window.jQuery(document.body).trigger('wc_fragment_refresh');
    }
    document.body.dispatchEvent(new CustomEvent('cpai:cart-changed'));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send(input.value);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input.value);
    }
  });
  function autosize() {
    input.style.height = 'auto';
    var h = input.scrollHeight + 2; // + bordas
    input.style.height = Math.min(h, 120) + 'px';
    input.style.overflowY = h > 120 ? 'auto' : 'hidden';
  }
  input.addEventListener('input', autosize);

  /* ---------- Foto ---------- */

  camBtn.addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    if (!/^image\//.test(file.type)) { addBubble('error', 'Envie uma imagem (JPG ou PNG).'); return; }
    shrink(file, 1280, 0.85).then(function (dataUrl) {
      pendingImage = { data: dataUrl.split(',')[1], url: dataUrl };
      preview.innerHTML = '';
      var img = el('img');
      img.src = dataUrl;
      img.alt = 'Foto selecionada';
      var rm = el('button', 'cpai-preview-x', '×');
      rm.type = 'button';
      rm.setAttribute('aria-label', 'Remover foto');
      rm.addEventListener('click', clearImage);
      preview.appendChild(img);
      preview.appendChild(el('span', null, 'Foto pronta. Escreva algo ou só envie.'));
      preview.appendChild(rm);
      preview.hidden = false;
      input.focus();
    }).catch(function () {
      addBubble('error', 'Não consegui abrir essa foto. Tente outra.');
    });
  });

  function clearImage() {
    pendingImage = null;
    preview.hidden = true;
    preview.innerHTML = '';
  }

  // Reduz a foto no próprio aparelho para economizar dados e custo.
  function shrink(file, max, quality) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(); };
      img.src = url;
    });
  }

  /* ---------- Voz ---------- */

  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var canRecord = C.sttServer && window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  var recognizer = null;
  var recorder = null;
  var recordTimer = null;

  if (!Recognition && !canRecord) micBtn.hidden = true;

  micBtn.addEventListener('click', function () {
    if (busy) return;
    if (recognizer || recorder) { stopVoice(true); return; }
    if (Recognition) startRecognition(); else startRecording();
  });

  function listening(on) {
    micBtn.classList.toggle('cpai-rec', on);
    micBtn.setAttribute('aria-label', on ? 'Parar e enviar' : 'Falar');
    micBtn.title = on ? 'Parar e enviar' : 'Falar';
    input.placeholder = on ? 'Ouvindo… toque no microfone para enviar' : 'Escreva sua dúvida…';
  }

  // Reconhecimento do navegador (Chrome, Edge, Android): grátis, sem enviar áudio ao site.
  function startRecognition() {
    var finalText = '';
    var base = input.value ? input.value.trim() + ' ' : '';
    recognizer = new Recognition();
    recognizer.lang = 'pt-BR';
    recognizer.interimResults = true;
    recognizer.continuous = true;
    recognizer.onresult = function (e) {
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      input.value = base + finalText + interim;
      autosize();
    };
    recognizer.onerror = function (e) {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        addBubble('error', 'Permita o uso do microfone para mandar mensagem de voz.');
      }
    };
    recognizer.onend = function () {
      var shouldSend = recognizer && recognizer._send;
      recognizer = null;
      listening(false);
      if (shouldSend && input.value.trim()) send(input.value, true);
    };
    recognizer._send = true;
    recognizer.start();
    listening(true);
  }

  // Gravação + transcrição no servidor (iPhone e navegadores sem reconhecimento próprio).
  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var types = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'];
      var type = types.filter(function (t) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0];
      var chunks = [];
      recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
      recorder._send = true;
      recorder.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        clearTimeout(recordTimer);
        var send_ = recorder._send;
        var mime = (recorder.mimeType || type || 'audio/webm').split(';')[0];
        recorder = null;
        listening(false);
        if (!send_ || !chunks.length) return;
        transcribe(new Blob(chunks, { type: mime }));
      };
      recorder.start();
      listening(true);
      recordTimer = setTimeout(function () { stopVoice(true); }, 60000); // até 1 minuto
    }).catch(function () {
      addBubble('error', 'Permita o uso do microfone para mandar mensagem de voz.');
    });
  }

  function transcribe(blob) {
    var fd = new FormData();
    var ext = blob.type.indexOf('mp4') > -1 ? 'm4a' : blob.type.indexOf('ogg') > -1 ? 'ogg' : 'webm';
    fd.append('audio', blob, 'voz.' + ext);
    setBusy(true);
    input.placeholder = 'Transcrevendo áudio…';
    api('transcribe', { method: 'POST', body: fd }).then(function (data) {
      setBusy(false);
      input.placeholder = 'Escreva sua dúvida…';
      send(data.text, true);
    }).catch(function (err) {
      setBusy(false);
      input.placeholder = 'Escreva sua dúvida…';
      addBubble('error', err.message);
    });
  }

  function stopVoice(sendIt) {
    if (recognizer) {
      recognizer._send = !!sendIt;
      recognizer.stop();
    }
    if (recorder && recorder.state !== 'inactive') {
      recorder._send = !!sendIt;
      recorder.stop();
    }
  }

  /* ---------- Convite discreto ---------- */

  // Mostra o rótulo "Posso ajudar?" por alguns segundos na primeira visita.
  try {
    if (!state.items.length && !sessionStorage.getItem('cpai_hint')) {
      sessionStorage.setItem('cpai_hint', '1');
      setTimeout(function () { root.classList.add('cpai-hint'); }, 4000);
      setTimeout(function () { root.classList.remove('cpai-hint'); }, 12000);
    }
  } catch (e) {}
})();
