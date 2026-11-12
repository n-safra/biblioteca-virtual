/*
Descricao: Projeto integrador - Biblioteca Virtual de Olímpia
nome_arquivo: js/assistente.js
nome_exercicio: Projeto Biblioteca Virtual de Olímpia - Feira de Tecnologia FATEC
nome_aluno: Nicolas Safra Gazige
email_aluno: nicolas.gazige@aluno.cps.sp.gov.br
turma: WEBI-ISW028-A
*/

/*
  ASSISTENTE DE LEITURA ADAPTATIVA

  A coruja responde perguntas sobre o trecho que a pessoa está lendo.
  Ela não usa inteligência artificial: procura palavras-chave na pergunta
  e busca a resposta na base de conhecimento (js/conhecimento.js).

  A parte "adaptativa": a coruja observa como a pessoa lê e se ajusta.
    - Perguntou o significado de 3 palavras? Ela oferece o texto em linguagem simples.
    - Pediu explicação mais simples 2 vezes? Ela oferece explicar sempre de forma simples.
    - Pediu para repetir 2 vezes? Ela oferece falar mais devagar.
    - Acertou todas as perguntas? Ela oferece explicações mais aprofundadas.
  A coruja sempre PERGUNTA antes de mudar. Quem decide é a pessoa.
  Tudo o que ela mudou aparece no cartão "A coruja se adapta a você", com o motivo e um botão para desfazer.
*/
(function () {
  "use strict";
  const B = window.BVO, BASE = window.CONHECIMENTO;
  if (!B || !BASE) return;

  const $ = (s, r = document) => r.querySelector(s);
  // Tira acentos e pontuação, para "O que é alcunha?" virar "o que e alcunha"
  const limpa = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  // Confere se a palavra ou expressão aparece inteira na frase
  const tem = (texto, chave) => ` ${texto} `.includes(` ${limpa(chave)} `);

  const livro = () => BASE[B.obraAtual()];
  const log = $("#assist-log"), campo = $("#assist-pergunta"), statusEl = $("#assist-status"), btMic = $("#bt-assist-mic");

  /* ---------- Memória da adaptação (fica salva neste navegador) ---------- */
  const memoria = (() => {
    const inicio = { nivel: "p", textoSimples: false, vozLenta: false, palavras: {}, pediuSimples: 0, repeticoes: 0, quiz: {}, recusou: {}, motivos: {} };
    try { return Object.assign(inicio, JSON.parse(localStorage.getItem("bvo-adapta") || "{}")); } catch (e) { return inicio; }
  })();
  function guardar() { try { localStorage.setItem("bvo-adapta", JSON.stringify(memoria)); } catch (e) {} }

  // Escolhe o texto do nível certo: s = simples, p = padrão, x = aprofundado
  function noNivel(item) {
    if (memoria.nivel === "s") return item.s || item.p;
    if (memoria.nivel === "x") return [item.p || item.s, item.x].filter(Boolean).join(" ");
    return item.p || item.s;
  }

  /* ---------- Conversa na tela ---------- */
  let ultimaResposta = "";
  function addMsg(quem, texto, botoes, detalhe) {
    log.setAttribute("aria-live", B.pref.voz ? "off" : "polite");   // com a voz ligada, quem lê é a coruja
    const li = document.createElement("li");
    li.className = "amsg de-" + quem;
    const rotulo = document.createElement("span");
    rotulo.className = "sr"; rotulo.textContent = quem === "coruja" ? "Coruja diz: " : "Você perguntou: ";
    li.append(rotulo, texto);
    if (detalhe) { const sm = document.createElement("small"); sm.textContent = detalhe; li.appendChild(sm); }
    if (botoes && botoes.length) {
      const caixa = document.createElement("div"); caixa.className = "amsg-botoes";
      botoes.forEach(b => {
        const bt = document.createElement("button");
        bt.type = "button"; bt.className = "btn btn-sec btn-sm"; bt.textContent = b.rotulo;
        bt.onclick = () => { caixa.querySelectorAll("button").forEach(x => x.disabled = true); b.acao(); };
        caixa.appendChild(bt);
      });
      li.appendChild(caixa);
    }
    log.appendChild(li);
    while (log.children.length > 12) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function responder(resp) {
    if (!resp) return;
    addMsg("coruja", resp.texto, resp.botoes);
    if (!resp.repeticao) ultimaResposta = resp.texto;
    B.falar(B.frasesDe(resp.texto), { semDoca: true });   // fala e manda para a Libras; o texto já está na conversa
    renderAdapta();
  }

  /* ---------- Ofertas de adaptação (sempre perguntando antes) ---------- */
  let oferta = null, esperaOferta = 0;   // se a pessoa ignorar uma oferta, a coruja espera 3 perguntas para oferecer de novo
  function criarOferta(chave, pergunta, aceitar) {
    const id = Date.now();
    oferta = { chave, aceitar, id };
    return {
      texto: pergunta,
      botoes: [
        { rotulo: "Sim", acao: () => { if (oferta && oferta.id === id) responder(aceitarOferta()); } },
        { rotulo: "Não, obrigado", acao: () => { if (oferta && oferta.id === id) responder(recusarOferta()); } }
      ]
    };
  }
  function aceitarOferta() { const o = oferta; oferta = null; guardar(); return { texto: o.aceitar(), repeticao: true }; }
  function recusarOferta() {
    memoria.recusou[oferta.chave] = true; oferta = null; guardar();
    return { texto: "Tudo bem, continuo do mesmo jeito. Se mudar de ideia, é só pedir.", repeticao: true };
  }
  // Depois de cada resposta, a coruja confere se percebeu alguma dificuldade
  function proximaOferta() {
    if (oferta || quiz) return null;
    if (esperaOferta > 0) { esperaOferta--; return null; }
    const obra = B.obraAtual(), nPal = memoria.palavras[obra] || 0;
    if (nPal >= 3 && !memoria.textoSimples && !memoria.recusou.textoSimples) {
      return criarOferta("textoSimples", `Percebi que você perguntou ${nPal} palavras deste livro. Quer que eu mostre o texto em linguagem simples?`,
        () => { ligarTextoSimples(true, `porque você perguntou o significado de ${nPal} palavras`); return "Pronto. O texto agora está em linguagem simples. Para voltar ao original, use o botão Texto original."; });
    }
    if (memoria.pediuSimples >= 2 && memoria.nivel !== "s" && !memoria.recusou.nivelS) {
      return criarOferta("nivelS", "Você pediu explicações mais simples algumas vezes. Quer que eu explique sempre de um jeito mais simples?",
        () => { mudarNivel("s", "porque você pediu explicações mais simples"); return "Combinado. A partir de agora, explico com frases curtas e palavras fáceis."; });
    }
    if (memoria.repeticoes >= 2 && !memoria.vozLenta && B.pref.vel >= 1 && !memoria.recusou.voz) {
      return criarOferta("voz", "Você pediu para eu repetir algumas vezes. Quer que eu fale mais devagar?",
        () => { ligarVozLenta(true, "porque você pediu para repetir"); return "Combinado. Vou falar mais devagar."; });
    }
    return null;
  }

  /* ---------- As adaptações ---------- */
  function ligarTextoSimples(ligar, motivo) {
    memoria.textoSimples = ligar; memoria.motivos.textoSimples = ligar ? motivo : ""; guardar();
    B.abrirObra(B.obraAtual());                 // redesenha o texto (original ou simples)
    atualizarBotoesTexto(); renderAdapta();
  }
  function mudarNivel(nivel, motivo) {
    memoria.nivel = nivel; memoria.motivos.nivel = nivel === "p" ? "" : motivo; guardar(); renderAdapta();
  }
  function ligarVozLenta(ligar, motivo) {
    memoria.vozLenta = ligar; memoria.motivos.voz = ligar ? motivo : "";
    B.pref.vel = ligar ? 0.75 : 1; B.aplicarPref(); guardar(); renderAdapta();
  }
  function voltarAoNormal() {
    ligarTextoSimples(false); mudarNivel("p"); if (memoria.vozLenta) ligarVozLenta(false);
    Object.assign(memoria, { palavras: {}, pediuSimples: 0, repeticoes: 0, recusou: {} }); guardar(); renderAdapta();
  }

  /* ---------- Perguntas de compreensão (quiz) ---------- */
  let quiz = null;
  function perguntaDoQuiz() {
    const q = livro().quiz[quiz.i], letras = ["A", "B", "C"];
    const opcoes = q.opcoes.map((o, j) => `${letras[j]}: ${o}.`).join(" ");
    const idx = quiz.i;
    return {
      texto: `Pergunta ${quiz.i + 1} de ${livro().quiz.length}. ${q.pergunta} ${opcoes} Responda com a letra ou com a resposta.`,
      botoes: q.opcoes.map((o, j) => ({ rotulo: `${letras[j]}) ${o}`, acao: () => { if (quiz && quiz.i === idx) responder(responderQuiz(j)); } }))
    };
  }
  function lerResposta(t) {
    const letra = t.match(/^(?:letra |a letra |e a |alternativa )?(a|b|be|c|ce|se)$/);
    if (letra) return { a: 0, b: 1, be: 1, c: 2, ce: 2, se: 2 }[letra[1]];
    const ordem = t.match(/\b(primeira|segunda|terceira|um|dois|tres|1|2|3)\b/);
    if (ordem && t.split(" ").length <= 3) return { primeira: 0, um: 0, 1: 0, segunda: 1, dois: 1, 2: 1, terceira: 2, tres: 2, 3: 2 }[ordem[1]];
    // ou pela própria resposta: "com o mar", "um pássaro"...
    const pontos = livro().quiz[quiz.i].opcoes.map(o => limpa(o).split(" ").filter(w => w.length > 3 && tem(t, w)).length);
    const max = Math.max(...pontos);
    return max > 0 && pontos.filter(p => p === max).length === 1 ? pontos.indexOf(max) : null;
  }
  function responderQuiz(j) {
    const q = livro().quiz[quiz.i];
    const certo = j === q.certa;
    if (certo) quiz.acertos++;
    const retorno = certo ? `Isso mesmo! ${q.explica}` : `Quase. A resposta certa é: ${q.opcoes[q.certa]}. ${q.explica}`;
    quiz.i++;
    if (quiz.i < livro().quiz.length) {
      const prox = perguntaDoQuiz();
      return { texto: `${retorno} ${prox.texto}`, botoes: prox.botoes };
    }
    // Fim do quiz: a coruja se adapta ao resultado
    const total = livro().quiz.length, acertos = quiz.acertos, obra = B.obraAtual();
    memoria.quiz[obra] = { acertos, total }; quiz = null; guardar();
    const final = `${retorno} Você acertou ${acertos} de ${total}.`;
    if (acertos === total && memoria.nivel !== "x" && !memoria.recusou.nivelX) {
      const o = criarOferta("nivelX", `${final} Mandou bem! Quer que minhas explicações fiquem mais aprofundadas, com detalhes para estudo?`,
        () => { mudarNivel("x", `porque você acertou todas as perguntas de ${livro().titulo}`); return "Combinado. Agora explico com mais detalhes. Pergunte o que quiser."; });
      return o;
    }
    if (acertos <= 1 && !memoria.textoSimples && !memoria.recusou.textoSimples) {
      return criarOferta("textoSimples", `${final} Sem problema, este texto é difícil mesmo. Quer ler em linguagem simples e tentar de novo depois?`,
        () => { ligarTextoSimples(true, "porque as perguntas foram difíceis"); return "Pronto. O texto agora está em linguagem simples. Quando quiser, diga me faz uma pergunta."; });
    }
    return { texto: `${final} Quando quiser, peça um resumo ou pergunte o que é uma palavra.` };
  }

  /* ---------- Entender a pergunta ---------- */
  const AJUDA = "Você pode me perguntar o que é uma palavra, quem é um personagem, pedir um resumo, uma explicação mais simples ou mais aprofundada, ou dizer me faz uma pergunta. Também entendo ler, parar e repetir.";
  function entender(original) {
    const t = limpa(original), L = livro(), par = B.paragrafoAtual();
    if (!t) return null;

    // 1. Resposta a uma oferta da coruja
    if (oferta) {
      if (/^(sim|pode|quero|claro|ok|isso|aceito|bora|por favor)\b/.test(t)) return aceitarOferta();
      if (/^(nao|agora nao|nao obrigad|obrigad)/.test(t)) return recusarOferta();
      oferta = null; esperaOferta = 3;                 // mudou de assunto: a oferta fica para depois
    }
    // 2. Resposta do quiz
    if (quiz) {
      if (/^(sair|parar|chega|cancelar)\b/.test(t)) { quiz = null; return { texto: "Tudo bem, paramos as perguntas." }; }
      const j = lerResposta(t);
      if (j !== null && j !== undefined) return responderQuiz(j);
      if (/^repet/.test(t)) return perguntaDoQuiz();
      return { texto: "Não entendi a resposta. Diga A, B ou C, ou diga sair para parar as perguntas." };
    }
    // 3. Comandos
    if (/(voltar ao normal|desfazer tudo|desfaz tudo)/.test(t)) { voltarAoNormal(); return { texto: "Pronto, voltei tudo ao normal." }; }
    if (/^(repet|de novo|fala de novo|fala outra vez)/.test(t)) {
      memoria.repeticoes++; guardar();
      return { texto: ultimaResposta || (memoria.textoSimples ? L.simples[par] : "Ainda não falei nada. " + AJUDA), repeticao: true };
    }
    if (/^(parar|para|pare|silencio|chega)\b/.test(t)) { B.pararTudo(); return null; }
    const abrir = t.match(/^(?:abrir|abre|abra|quero ler|ler|mudar para|trocar para|muda para)\s+(?:o livro\s+)?(dom casmurro|iracema)/);
    if (abrir) { B.abrirObra(abrir[1] === "iracema" ? "iracema" : "dom"); return { texto: `Abri ${livro().titulo}. Diga ler para eu começar.` }; }
    if (/^(ler|leia|le pra mim|le para mim|comecar|comeca a ler|pode ler|continuar|continua)\b/.test(t)) { B.lerObra(0); return null; }

    // 4. Palavras do glossário: "o que é alcunha?", "alcunha", "não entendi a palavra amuado"
    const perguntaPalavra = /\b(o que e|o que significa|o que quer dizer|quer dizer|significado|significa|explica a palavra|palavra)\b/.test(t);
    let achada = null, tamanho = 0;
    L.palavras.forEach(p => [p.termo, ...p.outras].forEach(k => {
      if (tem(t, k) && limpa(k).length > tamanho) { achada = p; tamanho = limpa(k).length; }
    }));
    if (achada && (perguntaPalavra || t.split(" ").length <= 3)) {
      const obra = B.obraAtual();
      memoria.palavras[obra] = (memoria.palavras[obra] || 0) + 1; guardar();
      const termo = achada.termo.charAt(0).toUpperCase() + achada.termo.slice(1);
      const explicacao = memoria.nivel === "s" ? `${termo}: ${achada.s.charAt(0).toLowerCase() + achada.s.slice(1)}` : noNivel(achada);
      return { texto: explicacao };
    }
    // 5. Personagens que ainda não apareceram: sem spoiler
    const spoiler = L.semSpoiler.find(s => s.chaves.some(k => tem(t, k)));
    if (spoiler) return { texto: spoiler.texto };
    // 6. Dúvidas comuns (precisa ter todas as palavras-chave)
    const duvida = L.duvidas.find(d => d.chaves.every(k => tem(t, k)));
    if (duvida) return { texto: noNivel(duvida) };
    // 7. Personagens
    if (/\b(quem|personage)/.test(t)) {
      const pessoa = L.personagens.find(p => p.chaves.some(k => tem(t, k)));
      if (pessoa) return { texto: noNivel(pessoa) };
      const nomes = L.personagens.map(p => p.nome);
      return { texto: `Neste trecho aparecem: ${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}. Pergunte quem é um deles.` };
    }
    // 8. Quiz
    if (/(uma pergunta|me pergunt|quiz|me test|teste|perguntas)/.test(t)) {
      quiz = { i: 0, acertos: 0 };
      const p = perguntaDoQuiz();
      return { texto: `Vamos lá, são ${L.quiz.length} perguntas sobre o trecho. ${p.texto}`, botoes: p.botoes };
    }
    // 9. Resumo
    if (/resum/.test(t)) return { texto: noNivel(L.resumo) };
    // 10. Mais simples
    if (/(mais simples|simplific|nao entendi|mais facil|facil|outro jeito|explica melhor|explica de novo)/.test(t)) {
      memoria.pediuSimples++; guardar();
      return { texto: `Em linguagem simples, este trecho diz: ${L.simples[par]}` };
    }
    // 11. Explicar o trecho (o nível define a profundidade)
    if (/(aprofund|analis|estud|mais detalh|explica|explique|por que esse trecho)/.test(t)) {
      return { texto: memoria.nivel === "s" ? `Este trecho diz: ${L.simples[par]}` : L.estudo[par] };
    }
    // 12. Ajuda
    if (/(ajuda|o que voce sabe|o que voce faz|como funciona)/.test(t)) return { texto: AJUDA };
    // 13. Não sabe: diz com honestidade
    if (perguntaPalavra) {
      const palavra = original.replace(/^.*?(o que é|o que significa|o que quer dizer|significado de|explica a palavra)\s*/i, "").replace(/[?!.]+$/, "").trim();
      return { texto: `Ainda não sei explicar ${palavra ? "“" + palavra + "”" : "essa palavra"}. Neste trecho eu explico: ${L.palavras.slice(0, 6).map(p => p.termo).join(", ")} e outras.` };
    }
    return { texto: `Ainda não sei responder isso. ${AJUDA}` };
  }

  function perguntar(texto, viaVoz) {
    texto = (texto || "").trim();
    if (!texto) { campo.focus(); return; }
    addMsg("voce", texto, null, viaVoz ? "falado" : "");
    campo.value = "";
    const resp = entender(texto);
    if (!resp) { renderAdapta(); return; }
    const of = proximaOferta();
    if (of) { resp.texto = `${resp.texto} ${of.texto}`; resp.botoes = (resp.botoes || []).concat(of.botoes); }
    responder(resp);
  }
  $("#form-assist").addEventListener("submit", e => { e.preventDefault(); perguntar(campo.value, false); });
  document.querySelectorAll("[data-pergunta]").forEach(b => b.onclick = () => perguntar(b.dataset.pergunta, false));

  /* ---------- Perguntar falando ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  function status(m) { statusEl.textContent = m; }
  function ouvir() {
    if (!SR) { status("Este navegador não reconhece fala. Use o Chrome ou o Edge, ou digite a pergunta."); return; }
    B.pararTudo(false);
    const r = new SR(); rec = r;
    let final = "", inter = "", erro = "";
    r.lang = "pt-BR"; r.interimResults = true; r.maxAlternatives = 1;
    r.onstart = () => { btMic.setAttribute("aria-pressed", "true"); btMic.setAttribute("aria-label", "Parar de ouvir"); status("Ouvindo… pode perguntar."); };
    r.onresult = ev => {
      inter = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) final += ev.results[i][0].transcript; else inter += ev.results[i][0].transcript;
      }
      campo.value = (final + " " + inter).trim();
    };
    r.onerror = ev => { erro = ev.error || ""; };
    r.onend = () => {
      rec = null; btMic.setAttribute("aria-pressed", "false"); btMic.setAttribute("aria-label", "Perguntar falando");
      const texto = (final || inter).trim();
      if (texto) { status(""); perguntar(texto, true); return; }
      if (erro === "not-allowed" || erro === "service-not-allowed") status("O navegador bloqueou o microfone. Abra o site pelo Live Server (localhost) e permita o microfone.");
      else if (erro === "network") status("O reconhecimento de fala precisa de internet.");
      else if (erro !== "aborted") status("Não ouvi. Aperte o microfone e fale de novo, ou digite a pergunta.");
    };
    try { r.start(); } catch (e) { rec = null; status("Não consegui ligar o microfone."); }
  }
  btMic.onclick = () => { if (rec) { rec.abort(); return; } ouvir(); };

  /* ---------- Texto original x linguagem simples ---------- */
  function atualizarBotoesTexto() {
    $("#bt-texto-original").setAttribute("aria-pressed", String(!memoria.textoSimples));
    $("#bt-texto-simples").setAttribute("aria-pressed", String(memoria.textoSimples));
  }
  $("#bt-texto-original").onclick = () => ligarTextoSimples(false);
  $("#bt-texto-simples").onclick = () => ligarTextoSimples(true, "porque você escolheu");

  /* ---------- Palavras difíceis do trecho ---------- */
  function renderPalavras() {
    const caixa = $("#assist-palavras");
    caixa.innerHTML = "";
    livro().palavras.forEach(p => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = p.termo;
      b.setAttribute("aria-label", `O que é ${p.termo}?`);
      b.onclick = () => perguntar(`O que é ${p.termo}?`, false);
      caixa.appendChild(b);
    });
  }

  /* ---------- Cartão "A coruja se adapta a você" ---------- */
  function renderAdapta() {
    const lista = $("#adapta-lista");
    lista.innerHTML = "";
    const itens = [];
    if (memoria.textoSimples) itens.push({ nome: "Texto em linguagem simples", motivo: memoria.motivos.textoSimples, desfazer: () => ligarTextoSimples(false) });
    if (memoria.nivel === "s") itens.push({ nome: "Explicações simples", motivo: memoria.motivos.nivel, desfazer: () => mudarNivel("p") });
    if (memoria.nivel === "x") itens.push({ nome: "Explicações aprofundadas", motivo: memoria.motivos.nivel, desfazer: () => mudarNivel("p") });
    if (memoria.vozLenta) itens.push({ nome: "Voz mais devagar", motivo: memoria.motivos.voz, desfazer: () => ligarVozLenta(false) });
    if (!itens.length) {
      const li = document.createElement("li"); li.className = "adapta-vazio";
      li.textContent = "Nada ainda. Enquanto você lê e pergunta, a coruja aprende o seu jeito de ler.";
      lista.appendChild(li);
    }
    itens.forEach(it => {
      const li = document.createElement("li");
      const txt = document.createElement("div");
      const b = document.createElement("b"); b.textContent = it.nome; txt.appendChild(b);
      if (it.motivo) { const sm = document.createElement("small"); sm.textContent = `Ativado ${it.motivo}.`; txt.appendChild(sm); }
      const bt = document.createElement("button");
      bt.type = "button"; bt.className = "btn btn-sec btn-sm"; bt.textContent = "Desfazer";
      bt.setAttribute("aria-label", `Desfazer: ${it.nome}`);
      bt.onclick = () => { it.desfazer(); B.avisar(`Desfeito: ${it.nome}.`); };
      li.append(txt, bt);
      lista.appendChild(li);
    });
    const obra = B.obraAtual(), q = memoria.quiz[obra];
    $("#adapta-numeros").textContent = `Neste livro: ${memoria.palavras[obra] || 0} palavras perguntadas · ${memoria.repeticoes} pedidos para repetir` +
      (q ? ` · acertou ${q.acertos} de ${q.total} perguntas` : "");
  }

  /* ---------- Ligando tudo ---------- */
  B.ganchos.textoDaObra = k => (memoria.textoSimples && BASE[k] ? BASE[k].simples : null);
  B.ganchos.obraAberta = () => { quiz = null; renderPalavras(); renderAdapta(); };
  atualizarBotoesTexto();
  B.abrirObra(B.obraAtual());
  addMsg("coruja", "Oi! Pergunte o que quiser sobre este trecho: o que é uma palavra, quem é um personagem, um resumo ou uma explicação mais simples. Também posso fazer perguntas para você.");
})();
