/*
Descricao: Projeto integrador - Biblioteca Virtual de Olímpia (login por conversa com a coruja)
nome_arquivo: js/script.js
nome_exercicio: Projeto Biblioteca Virtual de Olímpia - Feira de Tecnologia FATEC
nome_aluno: Nicolas Safra Gazige
email_aluno: nicolas.gazige@aluno.cps.sp.gov.br
turma: WEBI-ISW028-A
*/

(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;

  /* ---------- Mascote: coruja buraqueira roxa com chapéu de formatura ---------- */
  const corujaImg = {
    heroi:        ["coruja.png", "coruja-heroi", "Coruja buraqueira roxa com chapéu de formatura e gravata-borboleta verde, saindo de um ovo: a Buraqueira, mascote da biblioteca"],
    login:        ["coruja.png", "coruja-login", ""],
    toque:        ["coruja.png", "coruja-toque", ""],
    libras:       ["coruja-pequena.png", "coruja-libras", ""],
    mini:         ["coruja-pequena.png", "coruja-mini", ""],
    "mini-marca": ["coruja-pequena.png", "coruja-marca", ""]
  };
  $$("[data-coruja]").forEach(el => {
    const [arquivo, classe, alt] = corujaImg[el.dataset.coruja];
    const img = document.createElement("img");
    img.src = "static/images/" + arquivo; img.alt = alt; img.className = "coruja " + classe;
    img.decoding = "async";
    el.replaceWith(img);
  });

  /* ---------- Preferências ---------- */
  const pref = { escala: 1, contraste: false, voz: true, libras: true, vel: 1, guiaVoz: false, guiaLibras: false, interprete: true, tema: "auto" };
  try { Object.assign(pref, JSON.parse(localStorage.getItem("bvo-pref") || "{}")); } catch (e) {}
  function salvar() { try { localStorage.setItem("bvo-pref", JSON.stringify(pref)); } catch (e) {} }
  function aplicarPref() {
    root.style.setProperty("--escala", pref.escala);
    if (pref.contraste) root.setAttribute("data-contraste", "alto"); else root.removeAttribute("data-contraste");
    // Tema: "auto" segue o aparelho; "claro" e "escuro" são escolha da pessoa
    if (pref.tema === "claro") root.setAttribute("data-theme", "light");
    else if (pref.tema === "escuro") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    const escuro = temaEscuro(), btTema = $("#bt-tema");
    btTema.setAttribute("aria-pressed", String(escuro));
    $("span", btTema).textContent = escuro ? "Tema claro" : "Tema escuro";
    $("use", btTema).setAttribute("href", escuro ? "#i-sol" : "#i-lua");
    btTema.setAttribute("aria-label", escuro ? "Tema escuro ligado. Mudar para o tema claro" : "Tema claro ligado. Mudar para o tema escuro");
    $("#bt-contraste").setAttribute("aria-pressed", String(pref.contraste));
    $("#bt-voz").setAttribute("aria-pressed", String(pref.voz));
    $("#bt-libras").setAttribute("aria-pressed", String(pref.libras));
    $("#sel-vel").value = String(pref.vel);
    $("#janela-libras").hidden = !pref.libras;
    $("#mensagens").setAttribute("aria-live", pref.voz ? "off" : "polite");
    $$(".pref-btn").forEach(b => {
      const k = b.dataset.pref;
      const on = k === "grande" ? pref.escala >= 1.25 : !!pref[k];
      b.setAttribute("aria-pressed", String(on));
    });
    salvar();
  }
  $("#fonte-menos").onclick = () => { pref.escala = Math.max(0.875, +(pref.escala - 0.125).toFixed(3)); aplicarPref(); };
  $("#fonte-mais").onclick = () => { pref.escala = Math.min(1.5, +(pref.escala + 0.125).toFixed(3)); aplicarPref(); };
  $("#fonte-padrao").onclick = () => { pref.escala = 1; aplicarPref(); };
  $("#bt-contraste").onclick = () => { pref.contraste = !pref.contraste; aplicarPref(); };
  const sistemaEscuro = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function temaEscuro() { return pref.tema === "escuro" || (pref.tema !== "claro" && !!(sistemaEscuro && sistemaEscuro.matches)); }
  function trocarTema() {
    pref.tema = temaEscuro() ? "claro" : "escuro";
    aplicarPref();
    const m = pref.tema === "escuro" ? "Tema escuro ligado." : "Tema claro ligado.";
    avisar(pref.contraste ? `${m} O alto contraste continua ligado por cima.` : m);
  }
  $("#bt-tema").onclick = trocarTema;
  // se o tema segue o aparelho e a pessoa muda o aparelho, o botão acompanha
  if (sistemaEscuro && sistemaEscuro.addEventListener) sistemaEscuro.addEventListener("change", () => { if (pref.tema === "auto") aplicarPref(); });
  $("#bt-voz").onclick = () => { pref.voz = !pref.voz; aplicarPref(); avisar(pref.voz ? "Voz da coruja ligada." : "Voz desligada. Legendas e Libras continuam."); };
  $("#bt-libras").onclick = () => { pref.libras = !pref.libras; aplicarPref(); if (pref.libras) abrirDoca(); };
  $("#sel-vel").onchange = e => { pref.vel = parseFloat(e.target.value); aplicarPref(); };

  /* ---------- Aviso visual ---------- */
  let toastTimer;
  function avisar(msg) {
    const t = $("#toast"); $("#toast-texto").textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 4200);
  }

  /* ---------- Doca da coruja ---------- */
  const painel = $("#doca-painel"), btDoca = $("#bt-doca");
  function abrirDoca() { painel.hidden = false; btDoca.setAttribute("aria-expanded", "true"); btDoca.setAttribute("aria-label", "Fechar a coruja assistente"); }
  function fecharDoca() { painel.hidden = true; btDoca.setAttribute("aria-expanded", "false"); btDoca.setAttribute("aria-label", "Abrir a coruja assistente"); }
  btDoca.onclick = () => painel.hidden ? abrirDoca() : fecharDoca();
  $("#bt-fechar-doca").onclick = () => { fecharDoca(); btDoca.focus(); };

  /* ---------- Intérprete de Libras (VLibras) ----------
     A coruja é uma imagem: ela não consegue fazer os sinais de Libras com as mãos.
     Quem faz a Libras de verdade é o VLibras, o tradutor gratuito do Governo Federal,
     com um intérprete 3D que traduz o texto para Libras. Ele precisa de internet.
     Quando está ligado, tudo o que a coruja fala também é traduzido pelo intérprete. */
  const VLIBRAS = "https://vlibras.gov.br/app";
  const vlib = { estado: "desligado", modo: "api", fila: "", widget: false };
  const esperar = (teste, ms) => new Promise((ok, falha) => {
    const t0 = Date.now();
    (function vez() {
      let r = null; try { r = teste(); } catch (e) {}
      if (r) return ok(r);
      if (Date.now() - t0 > ms) return falha(new Error("tempo esgotado"));
      setTimeout(vez, 200);
    })();
  });
  function carregarScriptVLibras() {
    if (window.VLibras && window.VLibras.Widget) return Promise.resolve();
    return new Promise((ok, falha) => {
      const sc = document.createElement("script");
      sc.src = VLIBRAS + "/vlibras-plugin.js"; sc.async = true;
      sc.onload = ok; sc.onerror = () => falha(new Error("sem internet"));
      document.body.appendChild(sc);
    });
  }
  function atualizarVLibras() {
    root.classList.toggle("vlibras-off", !pref.interprete);
    $("#bt-vlibras").setAttribute("aria-pressed", String(pref.interprete));
    const bt = $("#bt-doca-vlibras");
    bt.setAttribute("aria-pressed", String(pref.interprete));
    $("span", bt).textContent = !pref.interprete ? "Ligar intérprete de Libras" : vlib.estado === "erro" ? "Tentar abrir o intérprete de novo" : "Desligar intérprete de Libras";
    const nota = {
      desligado: "A coruja mostra a palavra que está falando. Para a tradução completa em Libras, ligue o intérprete.",
      carregando: "Abrindo o intérprete de Libras… Na primeira vez demora alguns segundos.",
      pronto: "Tudo o que a coruja fala aparece em Libras na janela do intérprete.",
      erro: `Não consegui abrir o intérprete de Libras (parou em: ${vlib.etapa}). Confira a internet e aperte o botão para tentar de novo.`
    }[pref.interprete ? vlib.estado : "desligado"];
    $("#libras-nota").textContent = nota;
  }
  async function abrirVLibras() {
    if (vlib.estado === "pronto" || vlib.estado === "carregando") return;
    vlib.estado = "carregando"; vlib.etapa = "baixar o VLibras do site do governo"; atualizarVLibras();
    try {
      await carregarScriptVLibras();
      console.info("[VLibras] script carregado");
      if (!vlib.widget) {
        new window.VLibras.Widget(VLIBRAS); vlib.widget = true;
        // O VLibras só se monta no evento "load" da página. Como ele é ligado depois que a página
        // já carregou, avisamos de novo que a página carregou (é o que o "forceOnload" faz em outros sites).
        if (document.readyState === "complete") window.dispatchEvent(new Event("load"));
        else await new Promise(ok => window.addEventListener("load", ok, { once: true }));
      }
      vlib.etapa = "montar o botão do VLibras";
      const botao = await esperar(() => { const b = $("[vw-access-button]"); return b && b.children.length ? b : null; }, 60000);
      console.info("[VLibras] botão montado, abrindo o intérprete");
      botao.click();                                   // abre a janela do intérprete
      vlib.etapa = "abrir o boneco";
      try {
        const player = await esperar(() => window.plugin && window.plugin.player, 30000);
        vlib.modo = "api";
        console.info("[VLibras] intérprete encontrado. Tem plugin.translate?", typeof window.plugin.translate, "| player.translate?", typeof player.translate);
        if (player.on) {
          // quando o boneco termina de carregar, ele sinaliza a última fala da coruja
          player.on("load", () => { console.info("[VLibras] boneco carregado"); vlib.carregado = true; if (vlib.ultimo) setTimeout(() => traduzirLibras(vlib.ultimo), 1500); });
          player.on("translate:start", () => { vlib.sinalizou = true; console.info("[VLibras] começou a sinalizar"); });
          player.on("translate:end", () => console.info("[VLibras] terminou de sinalizar"));
          player.on("error", e => console.error("[VLibras] erro do intérprete:", e));
        }
      } catch (e) {
        vlib.modo = "clique";                          // plano B: o VLibras traduz o texto em que se clica
        console.warn("[VLibras] não achei window.plugin; usando o plano B (clique na legenda)");
      }
      vlib.estado = "pronto"; atualizarVLibras();
      console.info("[VLibras] pronto, modo:", vlib.modo);
      if (vlib.fila) { const t = vlib.fila; vlib.fila = ""; setTimeout(() => traduzirLibras(t), 3000); }
    } catch (e) {
      console.error("[VLibras] falhou na etapa:", vlib.etapa, e);
      vlib.estado = "erro"; atualizarVLibras();
      avisar(`Não consegui abrir o intérprete de Libras. Parou na etapa: ${vlib.etapa}.`);
    }
  }
  function traduzirLibras(texto) {
    if (!pref.interprete || !texto) return;
    vlib.ultimo = texto;
    if (vlib.estado !== "pronto") { vlib.fila = texto; return; }
    try {
      if (vlib.modo === "api") {
        // O próprio VLibras traduz assim quando a pessoa clica num texto da página
        if (typeof window.plugin.translate === "function") window.plugin.translate(texto);
        else window.plugin.player.translate(texto);
      } else {
        const el = $("#legenda-texto"); el.textContent = texto; el.click();
      }
      console.info("[VLibras] pedindo tradução:", texto.slice(0, 60));
    } catch (e) { console.error("[VLibras] erro ao traduzir:", e); }
  }
  $("#bt-teste-libras").onclick = () => {
    if (!pref.interprete) ligarVLibras(true);
    falar(frasesDe("Olá! Eu sou a coruja da biblioteca."));
  };
  function ligarVLibras(on) {
    pref.interprete = on; salvar();
    if (on && vlib.estado === "erro") vlib.estado = "desligado";
    atualizarVLibras();
    if (on) { abrirDoca(); abrirVLibras(); avisar("Intérprete de Libras ligado."); }
    else avisar("Intérprete de Libras desligado. A legenda continua.");
  }
  function botaoInterprete() {
    // se deu erro, o botão tenta de novo em vez de desligar
    if (pref.interprete && vlib.estado === "erro") { vlib.estado = "desligado"; abrirDoca(); abrirVLibras(); avisar("Tentando abrir o intérprete de Libras de novo."); return; }
    ligarVLibras(!pref.interprete);
  }
  $("#bt-vlibras").onclick = botaoInterprete;
  $("#bt-doca-vlibras").onclick = botaoInterprete;

  /* ---------- Motor de voz, legenda e Libras ---------- */
  const synth = window.speechSynthesis || null;
  let vozPt = null;
  function escolherVoz() {
    if (!synth) return;
    const vs = synth.getVoices();
    const pt = vs.filter(v => /^pt/i.test(v.lang));
    vozPt = pt.find(v => /pt[-_]BR/i.test(v.lang) && v.localService) || pt.find(v => /pt[-_]BR/i.test(v.lang)) || pt.find(v => v.localService) || pt[0] || null;
  }
  if (synth) { escolherVoz(); synth.onvoiceschanged = escolherVoz; }

  const Leitura = { sessao: 0, timers: [], fila: null, idx: 0, opts: {}, ativa: false, pausada: false };

  function limparTimers() { Leitura.timers.forEach(clearTimeout); Leitura.timers = []; }
  function estadoFala(on) {
    $$(".coruja").forEach(c => c.classList.toggle("falando", on && pref.voz));
    $$(".coruja-libras").forEach(c => c.classList.toggle("sinalizando", on));
    btDoca.classList.toggle("falando", on);
    $("#bt-doca-pausa").disabled = !Leitura.fila;
    $("#bt-doca-parar").disabled = !Leitura.fila;
    $("#bt-doca-pausa span").textContent = Leitura.pausada ? "Continuar" : "Pausar";
  }
  function glosa(palavra) {
    const g = (palavra || "").replace(/[^\p{L}\p{N}-]/gu, "").toUpperCase();
    if (g) $("#glosa").textContent = g;
  }

  function falar(frases, opts = {}, inicio = 0) {
    pararTudo(false);
    if (!frases.length) return;
    traduzirLibras(frases.join(" "));
    const id = ++Leitura.sessao;
    Leitura.fila = frases; Leitura.idx = inicio; Leitura.opts = opts; Leitura.ativa = true; Leitura.pausada = false;
    if (!opts.semDoca) abrirDoca();   // a assistente de leitura já mostra a resposta escrita, então não abre o painel
    estadoFala(true);
    opts.onEstado && opts.onEstado("lendo");

    const proxima = () => {
      if (id !== Leitura.sessao) return;
      if (Leitura.idx >= frases.length) { terminar(); return; }
      const frase = frases[Leitura.idx];
      opts.onFrase && opts.onFrase(Leitura.idx);
      $("#legenda-texto").textContent = frase;
      const palavras = frase.split(/\s+/).filter(Boolean);
      let temBoundary = false, w = 0;
      const msPorPalavra = 380 / pref.vel;
      glosa(palavras[0]); opts.onPalavra && opts.onPalavra(Leitura.idx, 0);
      const tick = () => {
        if (id !== Leitura.sessao || temBoundary) return;
        w++; if (w < palavras.length) { glosa(palavras[w]); opts.onPalavra && opts.onPalavra(Leitura.idx, w); Leitura.timers.push(setTimeout(tick, msPorPalavra)); }
      };
      Leitura.timers.push(setTimeout(tick, msPorPalavra));
      let acabou = false;
      const feito = () => { if (acabou || id !== Leitura.sessao) return; acabou = true; clearTimeout(vigia); limparTimers(); Leitura.idx++; Leitura.timers.push(setTimeout(proxima, 220)); };
      let vigia = null;

      if (pref.voz && synth && !opts.semVoz) {
        const u = new SpeechSynthesisUtterance(frase);
        u.lang = "pt-BR"; if (vozPt) u.voice = vozPt; u.rate = pref.vel;
        u.onboundary = e => {
          if (id !== Leitura.sessao || (e.name && e.name !== "word")) return;
          temBoundary = true;
          const antes = frase.slice(0, e.charIndex).split(/\s+/).filter(Boolean).length;
          const i = Math.min(antes, palavras.length - 1);
          glosa(palavras[i]); opts.onPalavra && opts.onPalavra(Leitura.idx, i);
        };
        u.onend = feito; u.onerror = feito;
        window.__falaAtual = u;
        // Se o navegador não avisar o fim da fala, segue mesmo assim.
        vigia = setTimeout(feito, palavras.length * (650 / pref.vel) + 3500);
        synth.speak(u);
      } else {
        Leitura.timers.push(setTimeout(feito, Math.max(1600, palavras.length * msPorPalavra + 500)));
      }
    };
    proxima();

    function terminar() {
      Leitura.ativa = false; Leitura.fila = null;
      estadoFala(false);
      opts.onEstado && opts.onEstado("fim");
    }
  }
  function pararTudo(avisarFim = true) {
    Leitura.sessao++; limparTimers();
    if (synth) synth.cancel();
    const opts = Leitura.opts;
    const tinha = Leitura.fila;
    Leitura.ativa = false; Leitura.fila = null; Leitura.pausada = false;
    estadoFala(false);
    if (tinha && opts.onEstado) opts.onEstado("parado");
    if (avisarFim && tinha) avisar("Leitura parada.");
  }
  function pausarOuContinuar() {
    if (!Leitura.fila) return;
    if (!Leitura.pausada) {
      Leitura.sessao++; limparTimers(); if (synth) synth.cancel();
      Leitura.pausada = true; Leitura.ativa = false;
      estadoFala(false);
      Leitura.opts.onEstado && Leitura.opts.onEstado("pausado");
    } else {
      const { fila, idx, opts } = Leitura;
      falar(fila, opts, idx);
    }
  }
  function frasesDe(texto) {
    return (texto.replace(/\s+/g, " ").match(/.+?(?:[.!?…]+["”»)]*(?=\s|$)|$)/g) || []).map(s => s.trim()).filter(Boolean);
  }
  window.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (window.__pararEscuta && window.__pararEscuta()) return;
    if (Leitura.fila) pararTudo();
  });
  $("#bt-parar-global").onclick = () => pararTudo();
  $("#bt-doca-parar").onclick = () => pararTudo();
  $("#bt-doca-pausa").onclick = pausarOuContinuar;

  if (synth === null) {
    $("#legenda-texto").textContent = "Este navegador não tem voz. A coruja mostra legenda e Libras no ritmo da leitura.";
  }

  /* Boas-vindas */
  const boasVindas = "Oi! Eu sou a Buraqueira, a coruja da Biblioteca Virtual de Olímpia. Eu leio os livros em voz alta e mostro cada trecho em Libras. Use a barra preta lá em cima para aumentar a letra, ligar o alto contraste ou desligar a minha voz. Para parar a leitura, aperte a tecla Esc.";
  $("#bt-boas-vindas").onclick = () => falar(frasesDe(boasVindas));
  $("#bt-doca-pagina").onclick = () => {
    if (!$("#tela-login").hidden) { falar(frasesDe(textoLogin())); return; }
    const partes = [ $("#titulo-heroi").textContent, $(".heroi .lead").textContent ];
    $$("section.bloco").forEach(s => { const h = $("h2", s); const p = $(".cab p", s); if (h) partes.push(h.textContent + "."); if (p) partes.push(p.textContent); });
    falar(frasesDe(partes.join(" ")));
  };
  $$("[data-ouvir-secao]").forEach(b => b.onclick = () => {
    const s = document.getElementById(b.dataset.ouvirSecao);
    const visiveis = filtrados().slice(0, 4).map(l => `${l.t}, de ${l.a}: ${rotuloSituacao(l)}.`).join(" ");
    falar(frasesDe(`${$("h2", s).textContent}. ${$(".cab p", s).textContent} ${visiveis ? "Primeiros resultados. " + visiveis : ""}`));
  });

  /* ---------- Acervo ---------- */
  const livros = [
    { t: "Dom Casmurro", a: "Machado de Assis", g: "Romance", ano: 1899, s: "disponivel", dig: "dom", c: 1, sin: "Bento Santiago, já velho, conta sua vida e o ciúme que sentia de Capitu, amiga de infância e depois esposa." },
    { t: "Iracema", a: "José de Alencar", g: "Romance", ano: 1865, s: "disponivel", dig: "iracema", c: 5, sin: "O amor entre a indígena Iracema e o português Martim, no litoral do Ceará." },
    { t: "Vidas Secas", a: "Graciliano Ramos", g: "Romance", ano: 1938, s: "emprestado", volta: "05/11", c: 2, sin: "Fabiano, Sinhá Vitória, os dois meninos e a cachorra Baleia atravessam o sertão fugindo da seca." },
    { t: "Quarto de Despejo", a: "Carolina Maria de Jesus", g: "Diário", ano: 1960, s: "disponivel", c: 4, sin: "O diário de uma catadora de papel que criava três filhos numa favela de São Paulo." },
    { t: "Lendas Brasileiras", a: "Luís da Câmara Cascudo", g: "Folclore", ano: 1945, s: "disponivel", c: 6, sin: "Lendas de todas as regiões do país, recolhidas por um dos maiores estudiosos do folclore brasileiro." },
    { t: "Reinações de Narizinho", a: "Monteiro Lobato", g: "Infantil", ano: 1931, s: "reservado", c: 3, sin: "Narizinho, Pedrinho e a boneca Emília vivem aventuras no Sítio do Picapau Amarelo." },
    { t: "O Auto da Compadecida", a: "Ariano Suassuna", g: "Teatro", ano: 1955, s: "disponivel", c: 4, sin: "João Grilo e Chicó aprontam pelo sertão até serem julgados diante de Nossa Senhora." },
    { t: "Capitães da Areia", a: "Jorge Amado", g: "Romance", ano: 1937, s: "emprestado", volta: "12/11", c: 2, sin: "Um grupo de meninos de rua sobrevive como pode nas ruas e no cais de Salvador." },
    { t: "Memórias Póstumas de Brás Cubas", a: "Machado de Assis", g: "Romance", ano: 1881, s: "disponivel", c: 3, sin: "Um defunto resolve contar a própria vida, com muita ironia, depois de morto." },
    { t: "A Hora da Estrela", a: "Clarice Lispector", g: "Romance", ano: 1977, s: "disponivel", c: 6, sin: "A vida simples de Macabéa, uma jovem alagoana que tenta sobreviver no Rio de Janeiro." }
  ];
  const generos = ["Todos", ...Array.from(new Set(livros.map(l => l.g)))];
  let generoAtual = "Todos";
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const chipsG = $("#chips-genero");
  chipsG.innerHTML = generos.map(g => `<button type="button" class="chip" aria-pressed="${g === "Todos"}" data-g="${g}">${g}</button>`).join("");
  chipsG.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    generoAtual = b.dataset.g;
    $$(".chip", chipsG).forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    renderAcervo();
  });

  function rotuloSituacao(l) {
    if (l.s === "disponivel") return "disponível na estante";
    if (l.s === "emprestado") return `emprestado, volta em ${l.volta}`;
    return "reservado por outro leitor";
  }
  function filtrados() {
    const q = norm($("#busca").value.trim());
    const f = $("#filtro-disp").value;
    return livros.filter(l => {
      if (generoAtual !== "Todos" && l.g !== generoAtual) return false;
      if (f === "disponivel" && l.s !== "disponivel") return false;
      if (f === "digital" && !l.dig) return false;
      if (!q) return true;
      return norm(`${l.t} ${l.a} ${l.g}`).includes(q);
    });
  }
  const reservas = new Set();
  function renderAcervo() {
    const lista = filtrados();
    $("#contagem").textContent = lista.length === 1 ? "1 livro encontrado" : `${lista.length} livros encontrados`;
    if (!lista.length) {
      $("#grade-livros").innerHTML = `<div class="vazio">Nenhum livro com esse nome, autor ou gênero. Tente outra palavra ou limpe os filtros.</div>`;
      return;
    }
    $("#grade-livros").innerHTML = lista.map(l => {
      const i = livros.indexOf(l);
      const pill = l.s === "disponivel" ? `<span class="pill ok">Disponível</span>`
        : l.s === "emprestado" ? `<span class="pill aviso">Emprestado · volta ${l.volta}</span>`
        : `<span class="pill erro">Reservado</span>`;
      const reservado = reservas.has(i);
      const acaoPrincipal = l.s === "disponivel"
        ? `<button class="btn btn-pri btn-sm" type="button" data-reservar="${i}" ${reservado ? "disabled" : ""}>${reservado ? "Reserva pedida" : "Reservar"}</button>`
        : `<button class="btn btn-sec btn-sm" type="button" data-avisar="${i}" ${reservado ? "disabled" : ""}>${reservado ? "Vamos te avisar" : "Avise-me"}</button>`;
      return `<article class="livro" aria-labelledby="lv-${i}">
        <div class="capa capa-${l.c}" aria-hidden="true"><b>${l.t}</b><small>${l.a}</small></div>
        <div class="livro-info">
          <h3 id="lv-${i}">${l.t}</h3>
          <span class="autor">${l.a} · ${l.ano}</span>
          <div class="meta">${pill}<span class="tag">${l.g}</span>${l.dig ? `<span class="tag acess-tag">Voz + Libras</span>` : ""}</div>
          <p class="sinopse">${l.sin}</p>
          <div class="livro-acoes">
            <button class="btn btn-sec btn-sm" type="button" data-ouvir="${i}" aria-label="Ouvir resumo de ${l.t}"><svg class="ico" aria-hidden="true"><use href="#i-som"/></svg>Ouvir</button>
            ${acaoPrincipal}
            ${l.dig ? `<a class="btn btn-olho btn-sm" href="#leitura" data-ler="${l.dig}">Ler agora</a>` : ""}
          </div>
        </div>
      </article>`;
    }).join("");
  }
  $("#busca").addEventListener("input", renderAcervo);
  $("#filtro-disp").addEventListener("change", renderAcervo);
  $("#grade-livros").addEventListener("click", e => {
    const b = e.target.closest("button, a"); if (!b) return;
    if (b.dataset.ouvir) {
      const l = livros[+b.dataset.ouvir];
      falar(frasesDe(`${l.t}, de ${l.a}. ${l.sin} Situação: ${rotuloSituacao(l)}.`));
    } else if ((b.dataset.reservar || b.dataset.avisar) && !conta.logado) {
      pedirLogin("Entre na sua conta para reservar livros.");
    } else if (b.dataset.reservar) {
      const i = +b.dataset.reservar; reservas.add(i); renderAcervo();
      const msg = `Pedido de reserva de ${livros[i].t} enviado. A biblioteca confirma no seu cadastro.`;
      avisar(msg); if (pref.voz || pref.libras) falar([msg]);
    } else if (b.dataset.avisar) {
      const i = +b.dataset.avisar; reservas.add(i); renderAcervo();
      avisar(`Vamos avisar quando ${livros[i].t} voltar para a estante.`);
    } else if (b.dataset.ler) {
      abrirObra(b.dataset.ler);
    }
  });
  $("#form-busca-heroi").addEventListener("submit", e => {
    e.preventDefault();
    $("#busca").value = $("#busca-heroi").value;
    renderAcervo();
    document.getElementById("acervo").scrollIntoView();
    $("#busca").focus({ preventScroll: true });
  });

  /* ---------- Leitura digital (domínio público) ---------- */
  const obras = {
    dom: {
      titulo: "Dom Casmurro", sub: "Machado de Assis, 1899 · Capítulo I, Do título",
      paragrafos: [
        "Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos. A viagem era curta, e os versos pode ser que não fossem inteiramente maus. Sucedeu, porém, que, como eu estava cansado, fechei os olhos três ou quatro vezes; tanto bastou para que ele interrompesse a leitura e metesse os versos no bolso.",
        "— Continue, disse eu acordando. — Já acabei, murmurou ele. — São muito bonitos.",
        "Vi-lhe fazer um gesto para tirá-los outra vez do bolso, mas não passou do gesto; estava amuado. No dia seguinte entrou a dizer de mim nomes feios, e acabou alcunhando-me Dom Casmurro. Os vizinhos, que não gostam dos meus hábitos reclusos e calados, deram curso à alcunha, que afinal pegou."
      ]
    },
    iracema: {
      titulo: "Iracema", sub: "José de Alencar, 1865 · Capítulo I",
      paragrafos: [
        "Verdes mares bravios de minha terra natal, onde canta a jandaia nas frondes da carnaúba;",
        "Verdes mares, que brilhais como líquida esmeralda aos raios do sol nascente, perlongando as alvas praias ensombradas de coqueiros;",
        "Serenai, verdes mares, e alisai docemente a vaga impetuosa, para que o barco aventureiro manso resvale à flor das águas."
      ]
    }
  };
  let obraAtual = "dom", frasesObra = [], spansObra = [], ultimaFrase = -1;
  // Ganchos: deixam a assistente de leitura (js/assistente.js) trocar o texto e saber quando a obra muda
  const ganchos = { textoDaObra: null, obraAberta: null };
  const abas = $("#abas-obra");
  abas.innerHTML = Object.entries(obras).map(([k, o]) => `<button type="button" role="tab" class="aba" id="aba-${k}" aria-selected="${k === obraAtual}" aria-controls="texto-obra" data-obra="${k}">${o.titulo}</button>`).join("");
  abas.addEventListener("click", e => { const b = e.target.closest(".aba"); if (b) abrirObra(b.dataset.obra); });
  abas.addEventListener("keydown", e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const bs = $$(".aba", abas); const i = bs.indexOf(document.activeElement);
    const n = bs[(i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length]; n.focus(); abrirObra(n.dataset.obra);
  });

  function abrirObra(k) {
    if (Leitura.opts && Leitura.opts.obra) pararTudo(false);
    obraAtual = k; const o = obras[k];
    $$(".aba", abas).forEach(b => b.setAttribute("aria-selected", String(b.dataset.obra === k)));
    $("#obra-titulo").textContent = o.titulo; $("#obra-sub").textContent = o.sub;
    frasesObra = []; ultimaFrase = -1; const cont = $("#texto-obra"); cont.innerHTML = "";
    const alternativo = ganchos.textoDaObra && ganchos.textoDaObra(k);
    if (alternativo) $("#obra-sub").textContent = `${o.sub} · Linguagem simples`;
    (alternativo || o.paragrafos).forEach(p => {
      const el = document.createElement("p");
      const fs = /[.!?…]/.test(p) ? frasesDe(p) : [p];
      fs.forEach((f, j) => {
        const span = document.createElement("span");
        span.className = "frase"; span.dataset.i = frasesObra.length; span.textContent = f;
        el.appendChild(span); if (j < fs.length - 1) el.appendChild(document.createTextNode(" "));
        frasesObra.push(f);
      });
      cont.appendChild(el);
    });
    spansObra = $$(".frase", cont);
    atualizarProgresso(-1); estadoBotoesLeitor("parado");
    if (ganchos.obraAberta) ganchos.obraAberta(k);
  }
  function marcarFrase(i) {
    spansObra.forEach(s => { if (s.classList.contains("atual")) { s.classList.remove("atual"); s.textContent = frasesObra[+s.dataset.i]; } });
    const s = spansObra[i]; if (!s) return;
    ultimaFrase = i;
    s.classList.add("atual");
    const r = s.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight - 40) s.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    atualizarProgresso(i);
  }
  function marcarPalavra(i, w) {
    const s = spansObra[i]; if (!s) return;
    const palavras = frasesObra[i].split(/(\s+)/);
    let n = -1;
    s.innerHTML = palavras.map(p => { if (/^\s+$/.test(p)) return p; n++; const t = p.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); return n === w ? `<span class="pal-atual">${t}</span>` : t; }).join("");
  }
  function atualizarProgresso(i) {
    const tot = frasesObra.length;
    $("#barra-prog").style.width = i < 0 ? "0%" : `${Math.round(((i + 1) / tot) * 100)}%`;
    $("#prog-texto").textContent = i < 0 ? "Pronto para começar." : `Frase ${i + 1} de ${tot}`;
  }
  function estadoBotoesLeitor(st) {
    const lendo = st === "lendo", pausado = st === "pausado";
    $("#bt-ler span").textContent = pausado ? "Continuar" : lendo ? "Lendo…" : "Ler com a coruja";
    $("#bt-ler").disabled = lendo;
    $("#bt-pausar").disabled = !lendo;
    $("#bt-parar").disabled = !(lendo || pausado);
    if (st === "fim") {
      spansObra.forEach(s => { s.classList.remove("atual"); s.textContent = frasesObra[+s.dataset.i]; });
      $("#barra-prog").style.width = "100%";
      $("#prog-texto").textContent = "Fim do trecho. Escolha outra obra ou leia de novo.";
    }
    if (st === "parado") { spansObra.forEach(s => { s.classList.remove("atual"); s.textContent = frasesObra[+s.dataset.i]; }); }
  }
  function lerObra(desde = 0) {
    falar(frasesObra, {
      obra: obraAtual,
      onFrase: marcarFrase,
      onPalavra: marcarPalavra,
      onEstado: estadoBotoesLeitor
    }, desde);
  }
  $("#bt-ler").onclick = () => { if (Leitura.pausada && Leitura.opts.obra) pausarOuContinuar(); else lerObra(0); };
  $("#bt-pausar").onclick = pausarOuContinuar;
  $("#bt-parar").onclick = () => pararTudo();
  $("#texto-obra").addEventListener("click", e => { const s = e.target.closest(".frase"); if (s) { ultimaFrase = +s.dataset.i; lerObra(+s.dataset.i); } });

  /* O que a assistente de leitura (js/assistente.js) pode usar daqui */
  window.BVO = {
    pref, aplicarPref, falar, frasesDe, pararTudo, avisar, ganchos,
    abrirObra, lerObra,
    obraAtual: () => obraAtual,
    // parágrafo em que a pessoa está (o da última frase lida ou tocada); 0 se ainda não leu
    paragrafoAtual: () => {
      const span = spansObra[ultimaFrase];
      if (!span) return 0;
      return $$("#texto-obra p").indexOf(span.closest("p"));
    }
  };

  /* ---------- Trocas ---------- */
  const pontos = [
    { n: "Biblioteca Municipal", d: "Balcão de atendimento, no horário de funcionamento", st: "Sugestão: a confirmar com a biblioteca" },
    { n: "Escolas públicas parceiras", d: "Secretaria da escola, em dias combinados", st: "A definir com a Secretaria de Educação" },
    { n: "Prédio da Prefeitura", d: "Recepção, com registro da entrega", st: "A definir com a Prefeitura" }
  ];
  $("#lista-pontos").innerHTML = pontos.map(p => `<li><svg aria-hidden="true"><use href="#i-pino"/></svg><div><b>${p.n}</b><br>${p.d}<small>${p.st}</small></div></li>`).join("");
  $("#of-ponto").innerHTML = pontos.map(p => `<option>${p.n}</option>`).join("");

  const ofertas = [
    { t: "O Pequeno Príncipe", a: "Antoine de Saint-Exupéry", tipo: "Troca", estado: "Bom", quem: "Marina", ponto: "Biblioteca Municipal" },
    { t: "O Menino Maluquinho", a: "Ziraldo", tipo: "Empréstimo", estado: "Ótimo", quem: "Seu Joaquim", ponto: "Escolas públicas parceiras" },
    { t: "Torto Arado", a: "Itamar Vieira Junior", tipo: "Empréstimo", estado: "Bom", quem: "Luana", ponto: "Biblioteca Municipal" },
    { t: "A Revolução dos Bichos", a: "George Orwell", tipo: "Troca", estado: "Marcas de uso", quem: "Pedro", ponto: "Prédio da Prefeitura" }
  ];
  let tipoTroca = "todos";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function renderTrocas() {
    const lista = ofertas.filter(o => tipoTroca === "todos" || o.tipo === tipoTroca);
    $("#lista-trocas").innerHTML = lista.length ? lista.map(o => {
      const i = ofertas.indexOf(o);
      return `<article class="oferta" aria-labelledby="of-${i}">
        <h3 id="of-${i}">${esc(o.t)}</h3>
        <p>${esc(o.a || "Autor não informado")} · oferecido por ${esc(o.quem)}</p>
        <div class="meta"><span class="tipo-troca"><svg class="ico ico-texto" aria-hidden="true"><use href="#i-troca"/></svg> ${o.tipo}</span><span class="tag">${esc(o.estado)}</span><span class="tag">${esc(o.ponto)}</span></div>
        <button class="btn ${o.pedido || o.minha ? "btn-sec" : "btn-pri"} btn-sm" type="button" data-pedir="${i}" ${o.pedido || o.minha ? "disabled" : ""}>${o.minha ? "Sua oferta" : o.pedido ? "Pedido enviado" : o.tipo === "Troca" ? "Propor troca" : "Pedir emprestado"}</button>
      </article>`;
    }).join("") : `<div class="vazio">Nenhuma oferta desse tipo agora.</div>`;
  }
  $("#chips-troca").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    tipoTroca = b.dataset.tipo;
    $$("#chips-troca .chip").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    renderTrocas();
  });
  $("#lista-trocas").addEventListener("click", e => {
    const b = e.target.closest("[data-pedir]"); if (!b) return;
    if (!conta.logado) { pedirLogin("Entre na sua conta para combinar trocas e empréstimos."); return; }
    const o = ofertas[+b.dataset.pedir]; o.pedido = true; renderTrocas();
    avisar(`Pedido enviado para ${o.quem}. A entrega será em: ${o.ponto}.`);
  });
  $("#form-oferta").addEventListener("submit", e => {
    e.preventDefault();
    if (!conta.logado) { pedirLogin("Entre na sua conta para oferecer um livro."); return; }
    const t = $("#of-titulo").value.trim(); const erro = $("#of-erro");
    if (!t) { erro.textContent = "Escreva o título do livro para publicar a oferta."; erro.hidden = false; $("#of-titulo").focus(); return; }
    erro.hidden = true;
    ofertas.unshift({ t, a: $("#of-autor").value.trim(), tipo: $("#of-tipo").value, estado: $("#of-estado").value, quem: `${conta.nome} (você)`, ponto: $("#of-ponto").value, minha: true });
    e.target.reset(); tipoTroca = "todos";
    $$("#chips-troca .chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.tipo === "todos")));
    renderTrocas();
    avisar(`Oferta de ${t} publicada. Avisaremos quando alguém se interessar.`);
  });

  /* ---------- Cantinho ---------- */
  $("#sw-metas").onclick = e => {
    const on = e.currentTarget.getAttribute("aria-checked") !== "true";
    e.currentTarget.setAttribute("aria-checked", String(on));
    $("#metas-on").hidden = !on; $("#metas-off").hidden = on;
  };
  $("#form-diario").addEventListener("submit", e => {
    e.preventDefault();
    const l = $("#di-livro").value.trim(); if (!l) { $("#di-livro").focus(); return; }
    const n = $("#di-nota").value.trim();
    const li = document.createElement("li");
    li.innerHTML = `<b>${esc(l)}</b>${n ? `<q>${esc(n)}</q>` : ""}`;
    $("#diario").prepend(li); e.target.reset();
    avisar(`${l} foi para a sua lista de leituras.`);
  });
  $("#bt-clube").onclick = e => { if (!conta.logado) { pedirLogin("Entre na sua conta para participar do clube."); return; } e.currentTarget.textContent = "Inscrição feita"; e.currentTarget.disabled = true; avisar("Você entrou no clube do mês. O encontro terá legenda e Libras."); };

  /* ---------- Conta e login ---------- */
  const conta = { logado: false, nome: "", visitante: false };
  try { const c = JSON.parse(localStorage.getItem("bvo-conta") || "null"); if (c && c.nome) { conta.logado = true; conta.nome = c.nome; } } catch (e) {}
  const telaLogin = $("#tela-login"), principal = $("#conteudo"), rodape = $("footer.rodape"), navPrincipal = $("#nav-principal"), pular = $(".pular");
  let ultimoGuia = null;

  function guiaAtivo() { return pref.guiaVoz || pref.guiaLibras; }
  function guiar(texto, forcar = false) {
    if (!forcar && !guiaAtivo()) return;
    falar(frasesDe(texto), { semVoz: !forcar && !pref.guiaVoz });
  }
  function textoLogin() {
    return "Tela de entrada da Biblioteca Virtual de Olímpia. Aqui ninguém precisa digitar senha. O jeito mais fácil é apertar o botão Conversar com a coruja: eu faço as perguntas e você responde falando. Para entrar, você pode usar a sua digital ou o rosto, com o botão Entrar com digital, ou receber um código de 6 números no celular e falar o código. Quem preferir também pode escrever o e-mail e a senha. Para fazer cadastro, escolha a aba Criar conta. Também dá para continuar sem conta.";
  }
  $("#bt-instrucoes").onclick = () => guiar(textoLogin(), true);

  /* Preferências rápidas */
  $$(".pref-btn").forEach(b => b.onclick = () => {
    const k = b.dataset.pref;
    if (k === "grande") pref.escala = pref.escala >= 1.25 ? 1 : 1.25;
    else if (k === "contraste") pref.contraste = !pref.contraste;
    else {
      pref[k] = !pref[k];
      if (k === "guiaVoz" && pref.guiaVoz) pref.voz = true;
      if (k === "guiaLibras" && pref.guiaLibras) { pref.libras = true; if (!pref.interprete) ligarVLibras(true); }
    }
    aplicarPref();
    const on = b.getAttribute("aria-pressed") === "true";
    const msgs = {
      guiaVoz: on ? "Combinado! Vou ler em voz alta cada campo quando você chegar nele." : "Tudo bem, não vou mais ler os campos em voz alta.",
      guiaLibras: on ? "Combinado! Vou mostrar cada campo em Libras e com legenda." : "Libras e legendas do formulário desligadas.",
      grande: on ? "Letra grande ligada." : "Letra no tamanho normal.",
      contraste: on ? "Alto contraste ligado." : "Alto contraste desligado."
    };
    avisar(msgs[k]);
    if (k.startsWith("guia")) { if (guiaAtivo()) guiar(msgs[k]); else pararTudo(false); }
  });

  /* Guia campo a campo */
  function descreverCampo(el) {
    const limpa = s => s.replace(/\s+/g, " ").trim();
    if (el.matches("input")) {
      const desc = (el.getAttribute("aria-describedby") || "").split(/\s+/).map(id => document.getElementById(id))
        .filter(x => x && !x.hidden && x.textContent.trim()).map(x => limpa(x.textContent).replace(/[.!?]?$/, ".")).join(" ");
      if (el.type === "checkbox") {
        return `Caixa de marcar: ${limpa(el.closest("label").textContent)}. ${el.checked ? "Marcada." : "Desmarcada."}`;
      }
      const lab = limpa(($(`label[for="${el.id}"]`) || {}).textContent || "");
      let t = `Campo ${lab}.`;
      if (el.type === "password") t += " O que você digitar fica escondido.";
      return `${t} ${desc}`;
    }
    if (el.matches("button")) return `Botão ${limpa(el.textContent)}.`;
    return "";
  }
  telaLogin.addEventListener("focusin", e => {
    const el = e.target;
    if (!guiaAtivo() || el === ultimoGuia || el.closest(".prefs-rapidas") || el.closest("#conversa") || el.id === "bt-instrucoes" || el.id === "bt-conversar") return;
    ultimoGuia = el;
    const t = descreverCampo(el); if (t) guiar(t);
  });

  /* Mostrar senha e Caps Lock */
  $$("[data-mostrar]").forEach(b => b.onclick = () => {
    const inp = $("#" + b.dataset.mostrar), ver = inp.type === "password";
    inp.type = ver ? "text" : "password";
    b.setAttribute("aria-pressed", String(ver));
    $("span", b).textContent = ver ? "Esconder" : "Mostrar";
    $("use", b).setAttribute("href", ver ? "#i-olho-off" : "#i-olho");
    if (guiaAtivo()) guiar(ver ? "Senha à mostra. Cuidado se tiver alguém por perto." : "Senha escondida de novo.");
    ultimoGuia = inp; inp.focus();
  });
  ["ln-senha", "cr-senha"].forEach(id => {
    const aviso = $("#" + id + "-caps");
    const checar = e => {
      if (!e.getModifierState) return;
      const on = e.getModifierState("CapsLock");
      if (aviso.hidden === on) { aviso.hidden = !on; if (on) guiar("Atenção: o Caps Lock está ligado. As letras vão sair maiúsculas."); }
    };
    $("#" + id).addEventListener("keydown", checar);
    $("#" + id).addEventListener("keyup", checar);
  });

  /* Validação */
  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function contatoValido(v) {
    const d = v.replace(/\D/g, "");
    return reEmail.test(v) || (/^[\d\s()+.-]+$/.test(v) && d.length >= 10 && d.length <= 13);
  }
  function erroContato(v, paraQue) {
    if (!v) return paraQue || "Escreva seu e-mail ou celular.";
    if (!contatoValido(v)) return "Esse e-mail ou celular parece incompleto. O e-mail precisa de @ e ponto; o celular, de DDD e número.";
    return null;
  }
  function setErro(id, msg) {
    const inp = $("#" + id), p = $("#" + id + "-erro");
    if (msg) { inp.setAttribute("aria-invalid", "true"); p.textContent = msg; p.hidden = false; }
    else { inp.removeAttribute("aria-invalid"); p.textContent = ""; p.hidden = true; }
  }
  function aplicarErros(resumoId, campos, erros, intro) {
    campos.forEach(id => setErro(id, (erros.find(x => x[0] === id) || [])[1]));
    const r = $("#" + resumoId);
    if (!erros.length) { r.hidden = true; r.removeAttribute("role"); return; }
    r.innerHTML = `<b>${intro}</b><ul>${erros.map(([id, m]) => `<li><a href="#${id}" data-foco="${id}">${m}</a></li>`).join("")}</ul>`;
    r.setAttribute("role", "alert"); r.hidden = false;
    const primeiro = $("#" + erros[0][0]);
    ultimoGuia = primeiro; primeiro.focus();
    guiar(`${intro} ${erros.map(x => x[1]).join(" ")}`);
  }
  $$(".resumo-erros").forEach(r => r.addEventListener("click", e => {
    const a = e.target.closest("[data-foco]"); if (!a) return;
    e.preventDefault(); $("#" + a.dataset.foco).focus();
  }));
  $$(".campo-login input").forEach(inp => inp.addEventListener("input", () => {
    if (inp.getAttribute("aria-invalid") === "true") setErro(inp.id, null);
  }));
  function nomeDe(contato) {
    if (!contato.includes("@")) return "leitor";
    const base = contato.split("@")[0].split(/[._\-+\d]/).filter(Boolean)[0] || "leitor";
    return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
  }

  /* ---------- Contas guardadas neste navegador ----------
     Demonstração sem servidor: as contas ficam no localStorage deste navegador. */
  const chaveContato = c => c.includes("@") ? c.trim().toLowerCase() : c.replace(/\D/g, "").slice(-11);
  function lerContas() { try { return JSON.parse(localStorage.getItem("bvo-contas") || "{}") || {}; } catch (e) { return {}; } }
  function salvarConta(contato, novos) {
    const contas = lerContas(), k = chaveContato(contato);
    contas[k] = Object.assign({}, contas[k], novos, { contato, atualizado: Date.now() });
    try { localStorage.setItem("bvo-contas", JSON.stringify(contas)); } catch (e) {}
    return contas[k];
  }
  function acharConta(contato) { return lerContas()[chaveContato(contato)] || null; }
  const primeiroNome = n => (n || "").trim().split(/\s+/)[0] || "";
  function nomeDaConta(contato) { const c = acharConta(contato); return (c && primeiroNome(c.nome)) || nomeDe(contato); }

  /* ---------- Digital ou rosto (chave de acesso, WebAuthn) ----------
     Em localhost ou https, o navegador pede de verdade a digital, o rosto ou o PIN do aparelho
     (leitor do celular ou Windows Hello). Num site publicado, um servidor guardaria a chave pública
     e conferiria a assinatura; aqui, sem servidor, guardamos só a identificação da chave.
     Quando o aparelho não tem leitor liberado, a digital é simulada numa janela. */
  const paraB64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const deB64 = t => Uint8Array.from(atob(t.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - t.length % 4) % 4)), ch => ch.charCodeAt(0));
  const aleatorio = n => crypto.getRandomValues(new Uint8Array(n));
  const dentroDeQuadro = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  let digitalReal = null;
  async function temDigitalReal() {
    if (digitalReal !== null) return digitalReal;
    digitalReal = false;
    try {
      if (window.isSecureContext && !dentroDeQuadro && window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        digitalReal = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
    } catch (e) { digitalReal = false; }
    return digitalReal;
  }
  temDigitalReal();
  function motivoDigital(e) {
    const n = e && e.name;
    if (n === "NotAllowedError") return "A digital não foi confirmada: o pedido foi cancelado ou o tempo acabou.";
    if (n === "InvalidStateError") return "Esta digital já está cadastrada neste aparelho.";
    if (n === "SecurityError") return "O navegador só libera a digital em sites com https ou localhost.";
    return "Não consegui usar a digital neste aparelho.";
  }

  /* Janela da digital simulada */
  const dlg = $("#dlg-digital"), sensor = $(".sensor", dlg);
  let fimSimulacao = null;
  function fecharDlg() { if (dlg.open) { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); } }
  function simularDigital(texto) {
    return new Promise(resolver => {
      $("#dlg-digital-texto").textContent = texto;
      sensor.classList.remove("ok");
      fimSimulacao = ok => {
        if (!fimSimulacao) return;
        fimSimulacao = null;
        if (!ok) { fecharDlg(); resolver(false); return; }
        sensor.classList.add("ok"); bip(990);
        setTimeout(() => { fecharDlg(); resolver(true); }, 700);
      };
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      $("#bt-dlg-tocar").focus();
    });
  }
  $("#bt-dlg-tocar").onclick = () => fimSimulacao && fimSimulacao(true);
  $("#bt-dlg-cancelar").onclick = () => fimSimulacao && fimSimulacao(false);
  dlg.addEventListener("cancel", e => { e.preventDefault(); if (fimSimulacao) fimSimulacao(false); });

  async function cadastrarDigital(contato, nome) {
    if (await temDigitalReal()) {
      try {
        const cred = await navigator.credentials.create({ publicKey: {
          challenge: aleatorio(32),
          rp: { name: "Biblioteca Virtual de Olímpia" },
          user: { id: aleatorio(16), name: contato, displayName: nome || contato },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "preferred" },
          attestation: "none", timeout: 60000
        } });
        salvarConta(contato, { nome, metodo: "digital", digital: paraB64(cred.rawId), simulada: false });
        return { ok: true };
      } catch (e) { return { ok: false, motivo: motivoDigital(e) }; }
    }
    const ok = await simularDigital(`Encoste o dedo para cadastrar a digital de ${primeiroNome(nome) || contato}.`);
    if (!ok) return { ok: false, motivo: "O cadastro da digital foi cancelado." };
    salvarConta(contato, { nome, metodo: "digital", digital: "simulada", simulada: true });
    return { ok: true, simulada: true };
  }
  async function entrarComDigital() {
    const comDigital = Object.values(lerContas()).filter(c => c.digital).sort((a, b) => b.atualizado - a.atualizado);
    const semCadastro = { ok: false, semCadastro: true, motivo: "Ainda não tem nenhuma digital cadastrada neste aparelho." };
    if (!comDigital.length) return semCadastro;
    const reais = comDigital.filter(c => !c.simulada);
    if (reais.length && await temDigitalReal()) {
      try {
        const cred = await navigator.credentials.get({ publicKey: {
          challenge: aleatorio(32), userVerification: "required", timeout: 60000,
          allowCredentials: reais.map(c => ({ type: "public-key", id: deB64(c.digital) }))
        } });
        const achada = reais.find(c => c.digital === paraB64(cred.rawId));
        return achada ? { ok: true, conta: achada } : { ok: false, motivo: "Essa digital não é de nenhuma conta deste site." };
      } catch (e) { return { ok: false, motivo: motivoDigital(e) }; }
    }
    const simuladas = comDigital.filter(c => c.simulada);
    if (!simuladas.length) return semCadastro;
    const c = simuladas[0];
    const ok = await simularDigital(`Encoste o dedo para entrar como ${primeiroNome(c.nome) || c.contato}.`);
    return ok ? { ok: true, conta: c } : { ok: false, motivo: "A entrada com digital foi cancelada." };
  }
  function nomeParaEntrar(c) { return primeiroNome(c.nome) || nomeDe(c.contato); }

  /* ---------- Código de 6 números ----------
     Num site publicado, o servidor mandaria o código por SMS ou e-mail. Aqui ele aparece numa
     notificação que imita o celular, com um botão que lê a mensagem em voz alta. */
  let codigoAtual = null, smsTimer = null;
  function enviarCodigo(contato) {
    const numero = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
    codigoAtual = { numero, contato, vence: Date.now() + 5 * 60000, tentativas: 0 };
    const p = $("#sms-texto");
    p.textContent = "Biblioteca Virtual de Olímpia: seu código de entrada é ";
    const forte = document.createElement("strong"); forte.textContent = numero; p.appendChild(forte);
    p.append(". Vale por 5 minutos. Não passe para ninguém.");
    $("#sms").hidden = false;
    clearTimeout(smsTimer); smsTimer = setTimeout(() => { $("#sms").hidden = true; }, 5 * 60000);
    return numero;
  }
  function conferirCodigo(digitado) {
    if (!codigoAtual) return { ok: false, vencido: true, motivo: "Ainda não mandei nenhum código." };
    if (Date.now() > codigoAtual.vence) { codigoAtual = null; return { ok: false, vencido: true, motivo: "Esse código venceu." }; }
    if (digitado === codigoAtual.numero) {
      const contato = codigoAtual.contato; codigoAtual = null; $("#sms").hidden = true;
      return { ok: true, contato };
    }
    codigoAtual.tentativas++;
    const restam = 3 - codigoAtual.tentativas;
    if (restam <= 0) { codigoAtual = null; return { ok: false, vencido: true, motivo: "O código errou 3 vezes, então cancelei por segurança." }; }
    return { ok: false, motivo: `Esse código não confere. ${restam === 1 ? "Resta 1 tentativa" : `Restam ${restam} tentativas`}.` };
  }
  $("#bt-sms-fechar").onclick = () => { $("#sms").hidden = true; };
  $("#bt-sms-ouvir").onclick = () => {
    const n = ($("#sms-texto strong") || {}).textContent || "";
    falar(frasesDe(`Mensagem da Biblioteca Virtual de Olímpia. Seu código de entrada é: ${n.split("").join(", ")}.`));
  };

  /* Entrar */
  $("#form-entrar").addEventListener("submit", e => {
    e.preventDefault();
    const u = $("#ln-usuario").value.trim(), s = $("#ln-senha").value;
    const erros = [];
    const eu = erroContato(u); if (eu) erros.push(["ln-usuario", eu]);
    if (!s) erros.push(["ln-senha", "Escreva sua senha."]);
    else if (s.length < 6) erros.push(["ln-senha", "A senha tem pelo menos 6 caracteres. Confira se digitou toda."]);
    aplicarErros("resumo-entrar", ["ln-usuario", "ln-senha"], erros, erros.length === 1 ? "Falta corrigir uma coisa:" : "Falta corrigir duas coisas:");
    if (!erros.length) entrar(nomeDe(u), $("#ln-lembrar").checked);
  });

  $("#bt-digital").onclick = async () => {
    const dica = $("#digital-dica");
    const r = await entrarComDigital();
    if (r.ok) { entrar(nomeParaEntrar(r.conta), $("#ln-lembrar").checked, true); return; }
    const m = r.semCadastro
      ? `${r.motivo} Entre com o código e depois cadastre, ou crie a conta escolhendo a digital.`
      : `${r.motivo} Você pode entrar com o código de 6 números.`;
    dica.textContent = m; avisar(m); guiar(m, true);
    $("#bt-codigo").focus();
  };

  function mandarCodigoDoFormulario(intro) {
    const u = $("#ln-usuario").value.trim();
    const eu = erroContato(u, "Escreva seu e-mail ou celular para receber o código.");
    aplicarErros("resumo-entrar", ["ln-usuario"], eu ? [["ln-usuario", eu]] : [], "Para mandar o código, preciso do seu contato:");
    if (eu) return;
    enviarCodigo(u);
    $("#form-codigo").hidden = false;
    $("#codigo-info").textContent = `${intro}Mandamos um código de 6 números para ${u}. Nesta demonstração ele aparece na notificação no alto da tela.`;
    setErro("ln-codigo", null);
    ultimoGuia = $("#ln-codigo"); $("#ln-codigo").focus();
    guiar(`${$("#codigo-info").textContent} Escreva o código no campo e aperte Entrar com o código.`);
  }
  $("#bt-codigo").onclick = () => mandarCodigoDoFormulario("");
  $("#form-codigo").addEventListener("submit", e => {
    e.preventDefault();
    const c = $("#ln-codigo").value.replace(/\s/g, "");
    const campo = $("#ln-codigo");
    const erro = m => { setErro("ln-codigo", m); ultimoGuia = campo; campo.focus(); guiar(m); };
    if (!/^\d{6}$/.test(c)) return erro(c ? "O código tem 6 números. Confira se faltou algum." : "Escreva o código de 6 números que enviamos.");
    const r = conferirCodigo(c);
    if (r.ok) { entrar(nomeDaConta(r.contato), $("#ln-lembrar").checked); return; }
    if (r.vencido) { campo.value = ""; return mandarCodigoDoFormulario(`${r.motivo} `); }
    erro(r.motivo);
  });

  $("#bt-esqueci").onclick = () => {
    const u = $("#ln-usuario").value.trim();
    const eu = erroContato(u, "Escreva seu e-mail ou celular para recuperar a senha.");
    aplicarErros("resumo-entrar", ["ln-usuario"], eu ? [["ln-usuario", eu]] : [], "Para recuperar a senha, preciso do seu contato:");
    if (eu) return;
    mandarCodigoDoFormulario("Sem problema, dá para entrar sem senha. ");
  };

  $("#bt-visitante").onclick = () => {
    conta.visitante = true;
    mostrarSite(true);
    avisar("Você está como visitante. Entre quando quiser reservar ou trocar livros.");
  };

  /* Criar conta */
  const metodoEscolhido = () => ($('input[name="metodo"]:checked') || {}).value || "digital";
  function mostrarCampoSenha() { $("#bloco-cr-senha").hidden = metodoEscolhido() !== "senha"; }
  $$('input[name="metodo"]').forEach(r => r.addEventListener("change", () => {
    mostrarCampoSenha();
    const m = { digital: "Digital ou rosto escolhido. Na hora de criar, o aparelho vai pedir a sua digital.", codigo: "Código escolhido. A cada entrada você recebe 6 números.", senha: "Senha escolhida. Apareceu o campo para criar a senha." }[r.value];
    guiar(m);
  }));
  $("#form-criar").addEventListener("reset", () => setTimeout(mostrarCampoSenha, 0));
  function aplicarPerfil(visual, auditiva) {
    if (visual) { pref.voz = true; pref.guiaVoz = true; pref.escala = Math.max(pref.escala, 1.25); }
    if (auditiva) { pref.libras = true; pref.guiaLibras = true; }
    aplicarPref();
    if (auditiva && !pref.interprete) ligarVLibras(true);
  }
  $("#form-criar").addEventListener("submit", async e => {
    e.preventDefault();
    const n = $("#cr-nome").value.trim(), u = $("#cr-usuario").value.trim(), s = $("#cr-senha").value, metodo = metodoEscolhido();
    const erros = [];
    if (!n) erros.push(["cr-nome", "Escreva seu nome."]);
    const eu = erroContato(u); if (eu) erros.push(["cr-usuario", eu]);
    if (metodo === "senha" && s.length < 6) erros.push(["cr-senha", s ? `A senha precisa de pelo menos 6 caracteres. Faltam ${6 - s.length}.` : "Crie uma senha com pelo menos 6 caracteres."]);
    const intro = erros.length === 1 ? "Falta corrigir uma coisa:" : `Falta corrigir ${erros.length === 2 ? "duas" : "três"} coisas:`;
    aplicarErros("resumo-criar", ["cr-nome", "cr-usuario", "cr-senha"], erros, intro);
    if (erros.length) return;
    const visual = $("#cr-visual").checked, auditiva = $("#cr-auditiva").checked;
    if (metodo === "digital") {
      const r = await cadastrarDigital(u, n);
      if (!r.ok) {
        const m = `${r.motivo} Tente de novo, ou escolha entrar com código.`;
        aplicarErros("resumo-criar", [], [], ""); avisar(m); guiar(m, true);
        $("#cr-metodo-codigo").focus();
        return;
      }
    } else {
      salvarConta(u, { nome: n, metodo });
    }
    aplicarPerfil(visual, auditiva);
    entrar(primeiroNome(n), false);
    if (metodo === "digital") avisar(`Digital cadastrada! Da próxima vez, é só tocar em Entrar com digital.`);
  });

  /* Abas */
  const abaE = $("#aba-entrar"), abaC = $("#aba-criar");
  function trocarAba(criar, focar) {
    abaE.setAttribute("aria-selected", String(!criar)); abaC.setAttribute("aria-selected", String(criar));
    abaE.tabIndex = criar ? -1 : 0; abaC.tabIndex = criar ? 0 : -1;
    $("#painel-entrar").hidden = criar; $("#painel-criar").hidden = !criar;
    if (focar) (criar ? abaC : abaE).focus();
  }
  abaE.onclick = () => trocarAba(false);
  abaC.onclick = () => trocarAba(true);
  $(".abas-login").addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); trocarAba(abaE.getAttribute("aria-selected") === "true", true); }
  });

  /* Trocar de tela */
  function entrar(nome, lembrar, falarSempre) {
    conta.logado = true; conta.nome = nome; conta.visitante = false;
    if (lembrar) { try { localStorage.setItem("bvo-conta", JSON.stringify({ nome })); } catch (e) {} }
    $$("#tela-login form").forEach(f => f.reset());
    $("#form-codigo").hidden = true;
    mostrarSite(true);
    const msg = `Boas-vindas, ${nome}! Você entrou na Biblioteca Virtual de Olímpia.`;
    avisar(msg); guiar(msg, !!falarSempre);
  }
  function sair() {
    conta.logado = false; conta.nome = ""; conta.visitante = false;
    try { localStorage.removeItem("bvo-conta"); } catch (e) {}
    reservas.clear(); renderAcervo();
    mostrarLogin(true);
    avisar("Você saiu da sua conta.");
  }
  function pedirLogin(msg) {
    $("#balao-login").textContent = `${msg} Depois é só voltar para onde estava.`;
    mostrarLogin(true);
    avisar(msg); guiar(msg);
  }
  function mostrarSite(focar) {
    telaLogin.hidden = true; principal.hidden = false; rodape.hidden = false; navPrincipal.hidden = false;
    renderConta();
    if (focar) { window.scrollTo(0, 0); const h = $("#titulo-heroi"); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  function mostrarLogin(focar) {
    pararTudo(false);
    telaLogin.hidden = false; principal.hidden = true; rodape.hidden = true; navPrincipal.hidden = true;
    trocarAba(false);
    renderConta();
    if (focar) { window.scrollTo(0, 0); $("#t-login").focus({ preventScroll: true }); }
  }
  function renderConta() {
    const c = $("#conta");
    if (conta.logado) {
      c.innerHTML = `<span class="ola"><span class="avatar" aria-hidden="true">${esc(conta.nome.charAt(0).toUpperCase())}</span>Olá, ${esc(conta.nome)}</span><button type="button" class="btn btn-sec btn-sm" id="bt-sair">Sair</button>`;
    } else if (telaLogin.hidden) {
      c.innerHTML = `<button type="button" class="btn btn-pri btn-sm" id="bt-entrar-topo">Entrar</button>`;
    } else {
      c.innerHTML = "";
    }
  }
  $("#conta").addEventListener("click", e => {
    if (e.target.closest("#bt-sair")) sair();
    else if (e.target.closest("#bt-entrar-topo")) { $("#balao-login").textContent = "Que bom te ver! Escolha como prefere usar o site e entre com seu e-mail ou celular."; mostrarLogin(true); }
  });
  pular.addEventListener("click", e => {
    e.preventDefault();
    const alvo = telaLogin.hidden ? principal : !$("#conversa").hidden ? $("#resposta") : $("#bt-conversar");
    alvo.focus();
  });

  /* ---------- Conversa com a coruja ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const campoResp = $("#resposta"), btMic = $("#bt-mic"), listaMsg = $("#mensagens");
  let micBloqueado = !SR, rec = null, ouvindo = false, semFala = 0;
  let conversaAberta = false, atual = "inicio", historico = [], dados = {};
  let actx = null;

  function bip(freq) {
    if (!pref.voz) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime;
      o.frequency.value = freq; o.type = "sine";
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + 0.2);
    } catch (e) {}
  }

  /* Entender respostas faladas */
  const NUM = { zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, meia: 6, sete: 7, oito: 8, nove: 9 };
  const DEZENAS = { dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19,
    vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60, setenta: 70, oitenta: 80, noventa: 90 };
  // "dezessete" vira 17; "vinte e um" vira 21; "um dois" vira 1 2
  const palavrasParaDigitos = t => {
    const ws = norm(t).split(/\s+/), out = [];
    for (let i = 0; i < ws.length; i++) {
      const w = ws[i];
      if (w in DEZENAS) {
        let n = DEZENAS[w];
        if (n >= 20 && ws[i + 1] === "e" && ws[i + 2] in NUM && NUM[ws[i + 2]] > 0) { n += NUM[ws[i + 2]]; i += 2; }
        out.push(String(n));
      } else out.push(w in NUM ? String(NUM[w]) : w);
    }
    return out.join(" ");
  };
  const soDigitos = t => palavrasParaDigitos(t).replace(/\D/g, "");
  /* O reconhecimento de fala costuma errar palavras curtas ditas sozinhas ("não" vira "mão", "sim" vira "si").
     Por isso, quando a resposta é uma palavra só, aceitamos esses parecidos. E também olhamos as outras
     opções que o navegador ouviu (alternativas), não só a primeira. */
  let alternativasOuvidas = [];
  function simNaoUm(t) {
    const s = norm(t).replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
    if (!s) return null;
    if (/\b(nao|negativo|errado|errada|incorreto|incorreta|nunca|nenhuma)\b/.test(s)) return false;
    if (/\b(sim|isso|certo|certa|correto|correta|exato|claro|tenho|pode|ok|okay|positivo|confirmo|beleza|uhum|aham|ja|quero|bora|vamos)\b/.test(s)) return true;
    if (/^(mao|nau|nam|nan|na|no|nho|nhao|n)$/.test(s)) return false;
    if (/^(si|sin|sing|seem|assim|sem|cim|sins)$/.test(s)) return true;
    return null;
  }
  function simNao(t) {
    for (const x of [t, ...alternativasOuvidas]) { const r = simNaoUm(x); if (r !== null) return r; }
    return null;
  }
  const ouvi = t => t ? `Ouvi “${t}”. ` : "";
  function formatarCel(d) {
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return d;
  }
  /* Provedores conhecidos: "maria arroba gmail" já vira maria@gmail.com */
  const PROVEDORES = { gmail: "gmail.com", hotmail: "hotmail.com", outlook: "outlook.com", yahoo: "yahoo.com.br", icloud: "icloud.com",
    live: "live.com", bol: "bol.com.br", uol: "uol.com.br", terra: "terra.com.br", ig: "ig.com.br" };
  function contatoFalado(t) {
    let s = " " + norm(t).trim() + " ";
    s = s.replace(/^\s*(o\s+|a\s+)?(meu\s+|minha\s+)?(e-?mail|email|celular|numero|telefone|contato)(\s+(e|eh|é))?\s+/, " ");
    // o reconhecimento de fala escreve "arroba" de vários jeitos
    s = s.replace(/\b(arroba|aroba|arrouba|arobas|a\s+roba|ar\s+roba|arrobas)\b/g, " @ ");
    s = s.replace(/\bponto\s+com\s+ponto\s+br\b/g, ".com.br").replace(/\bponto\s+com\s+br\b/g, ".com.br")
      .replace(/\bponto\s+com\b/g, ".com").replace(/\bponto\s+br\b/g, ".br").replace(/\b(ponto|pontinho)\b/g, ".")
      .replace(/\.\s*com\s+br\b/g, ".com.br")
      .replace(/\b(underline|underscore|sublinhado|traco baixo|tracinho baixo)\b/g, "_").replace(/\b(hifen|traco|tracinho|menos)\b/g, "-");
    s = palavrasParaDigitos(s).replace(/\s+/g, "");
    s = s.replace(/[.,;:!?]+$/, "");          // tira o ponto final que o reconhecimento coloca no fim
    if (s.includes("@")) {
      const [usuario, dominio = ""] = s.split("@");
      if (dominio && !dominio.includes(".") && PROVEDORES[dominio]) s = usuario + "@" + PROVEDORES[dominio];
      return s;
    }
    const d = s.replace(/\D/g, "");
    if (d.length >= 10 && d.length <= 13 && /^[\d()+.-]*$/.test(s)) return formatarCel(d.length > 11 ? d.slice(-11) : d);
    return s;
  }
  function soletrar(c) {
    if (c.includes("@")) return c.split("").map(ch => ({ "@": "arroba", ".": "ponto", "_": "sublinhado", "-": "hífen" }[ch] || ch)).join(", ");
    const d = c.replace(/\D/g, "");
    return `DDD ${d.slice(0, 2).split("").join(" ")}, número ${d.slice(2).split("").join(" ")}`;
  }
  function limparNome(t) {
    let s = t.trim().replace(/^(o\s+)?(meu nome (é|e)|me chamo|eu me chamo|eu sou( o| a)?|sou( o| a)?|pode me chamar de)\s+/i, "");
    s = s.replace(/[^\p{L}\s'-]/gu, "").replace(/\s+/g, " ").trim();
    return s.split(" ").filter(Boolean).map(w => /^(da|de|do|das|dos|e)$/i.test(w) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }

  /* Preencher o formulário ao vivo */
  function preencher(id, valor) {
    const el = $("#" + id);
    trocarAba(id.startsWith("cr-"));
    if (el.type === "checkbox") el.checked = !!valor; else el.value = valor;
    setErro && el.id && $("#" + id + "-erro") && setErro(id, null);
    el.classList.remove("preenchido"); void el.offsetWidth; el.classList.add("preenchido");
  }

  /* Mensagens */
  function addMsg(quem, texto, extra) {
    const li = document.createElement("li");
    li.className = "msg de-" + quem;
    li.innerHTML = `<span class="sr">${quem === "coruja" ? "Coruja diz:" : "Você respondeu:"} </span>`;
    li.appendChild(document.createTextNode(texto));
    if (extra) { const sm = document.createElement("small"); sm.textContent = extra; li.appendChild(sm); }
    listaMsg.appendChild(li);
    listaMsg.scrollTop = listaMsg.scrollHeight;
  }
  let avisoPendente = "";
  function dizer(texto, fala, depoisOuvir) {
    addMsg("coruja", texto);
    if (depoisOuvir && conversaAberta && !micBloqueado && pref.voz && !ehArquivo && passos[atual].tipo !== "senha") {
      $("#ouvindo").hidden = false; $("#ouvindo-texto").textContent = "A coruja está perguntando… o microfone liga depois do bipe";
    }
    falar(frasesDe(fala || texto), {
      onEstado: st => {
        if (st !== "fim") return;
        if (avisoPendente) { const m = avisoPendente; avisoPendente = ""; falar(frasesDe(m)); return; }
        // espera um instante para o microfone não pegar o finzinho da voz da coruja
        if (depoisOuvir && conversaAberta && pref.voz && !micBloqueado) setTimeout(() => { if (conversaAberta && !Leitura.ativa) ouvir(); }, 350);
      }
    });
  }

  /* Passos da conversa */
  const passos = {
    inicio: {
      pergunta: () => "Oi! Eu sou a Buraqueira e vou te ajudar a entrar só conversando. Você já tem conta na biblioteca? Responda sim ou não.",
      tratar(t) {
        const r = simNao(t);
        if (r === true) { dados.criar = false; return ir("modoEntrada"); }
        if (r === false) { dados.criar = true; return ir("nome", "Então vamos criar a sua conta. "); }
        naoEntendi(`${ouvi(t)}Responda sim, se já tem conta, ou não, para criar uma.`);
      }
    },
    nome: {
      pergunta: () => "Qual é o seu nome?",
      tratar(t) {
        const n = limparNome(t);
        if (!n) return naoEntendi("Não consegui pegar o seu nome. Pode falar de novo?");
        dados.nome = n; preencher("cr-nome", n); ir("confNome");
      }
    },
    confNome: {
      pergunta: () => `Anotei: ${dados.nome}. Está certo?`,
      tratar(t) {
        const r = simNao(t);
        if (r === true) return ir("contato");
        if (r === false) return ir("nome", "Tudo bem, vamos de novo. ");
        naoEntendi(`${ouvi(t)}Responda sim, se o nome ${dados.nome} está certo, ou não, para falar de novo.`);
      }
    },
    contato: {
      ouvirLongo: true,   // o microfone espera a pessoa terminar, mesmo com pausas
      pergunta: () => [
        `${dados.criar ? "Qual é o seu e-mail ou celular?" : "Qual é o e-mail ou celular da sua conta?"} Fale sem pressa, por exemplo: maria arroba gmail ponto com. Pode fazer pausas.`,
        `${dados.criar ? "Qual é o seu e-mail ou celular?" : "Qual é o e-mail ou celular da sua conta?"} Fale sem pressa. Por exemplo: maria arroba gmail ponto com. Pode fazer pausas. Para celular, fale o DDD e o número.`
      ],
      tratar(t) {
        // se a pessoa já tinha dito o começo ("maria arroba"), junta com o resto ("gmail ponto com")
        let c = contatoFalado(t);
        if (dados.parcial) {
          const junto = contatoFalado(dados.parcial + " " + t);
          if (contatoValido(junto)) c = junto;
        }
        if (contatoValido(c)) {
          dados.parcial = ""; dados.errosContato = 0;
          dados.contato = c; preencher(dados.criar ? "cr-usuario" : "ln-usuario", c);
          return ir("confContato");
        }
        const pedaco = contatoFalado((dados.parcial ? dados.parcial + " " : "") + t);
        // começo de e-mail sem o final: guarda e pede só o resto
        if (pedaco.includes("@") && !/@[^@]+\.[^@]{2,}$/.test(pedaco)) {
          dados.parcial = (dados.parcial ? dados.parcial + " " : "") + t;
          const antes = pedaco.endsWith("@") ? pedaco : pedaco + "…";
          return naoEntendi(`Anotei “${antes}”. Agora fale só o final, por exemplo: gmail ponto com.`);
        }
        dados.parcial = "";
        dados.errosContato = (dados.errosContato || 0) + 1;
        if (dados.errosContato >= 2) {
          return naoEntendi(`Ouvi “${pedaco || t}”, mas não parece um e-mail completo. Tente falar o celular com DDD, que é mais fácil de entender, ou digite o e-mail no campo de resposta.`);
        }
        naoEntendi(pedaco ? `Ouvi “${pedaco}”, mas parece incompleto. O e-mail precisa de arroba e do final, como gmail ponto com. Pode repetir devagar?` : "Não entendi o contato. Pode repetir devagar?");
      }
    },
    confContato: {
      pergunta: () => [`Entendi: ${dados.contato}. Está certo?`, `Entendi: ${soletrar(dados.contato)}. Está certo?`],
      tratar(t) {
        const r = simNao(t);
        if (r === true) {
          if (dados.criar) return ir("perfil");
          if (dados.metodo === "senha") return ir("senha");
          return mandarCodigoNaConversa("");
        }
        if (r === false) { dados.parcial = ""; return ir("contato", "Vamos tentar de novo. Pode falar devagar. "); }
        naoEntendi(`${ouvi(t)}Responda sim, se o contato está certo, ou não, para falar de novo.`);
      }
    },
    modoEntrada: {
      pergunta: () => [
        "Como prefere entrar? Diga “digital”, para usar a digital ou o rosto do aparelho, ou “código”, para receber 6 números no celular ou e-mail e falar os números. Se quiser, diga “senha” para digitar.",
        "Como prefere entrar? Diga digital, para usar a digital ou o rosto do aparelho. Ou diga código, para receber 6 números no celular ou e-mail e falar os números. Se quiser, diga senha, para digitar."
      ],
      tratar(t) {
        const s = norm(t);
        if (/(digital|dedo|rosto|biometr|face)/.test(s)) { dados.metodo = "digital"; return entrarDigitalNaConversa(); }
        if (/(codig|numero|sms)/.test(s)) { dados.metodo = "codigo"; return ir("contato"); }
        if (/senha/.test(s)) { dados.metodo = "senha"; return ir("contato"); }
        naoEntendi(`${ouvi(t)}Diga digital, código ou senha.`);
      }
    },
    aguardandoDigital: {
      tipo: "espera",
      pergunta: () => "Estou esperando a confirmação da digital.",
      tratar(t) {
        const s = norm(t);
        if (fimSimulacao && /(confirm|pronto|encost|sim|ok|isso)/.test(s)) return fimSimulacao(true);
        if (fimSimulacao && /(cancel|nao|parar|desist)/.test(s)) return fimSimulacao(false);
        naoEntendi(fimSimulacao ? "Diga confirmar para encostar o dedo, ou cancelar." : "Estou esperando o aparelho confirmar a sua digital.", !!fimSimulacao);
      }
    },
    codigo: {
      pergunta: () => [
        `Mandei um código de 6 números para ${dados.contato}. Quando chegar, diga “ler mensagem” que eu leio pra você, ou fale os números. Se não chegar, diga “mandar outro”.`,
        `Mandei um código de 6 números para ${dados.contato}. Quando chegar, diga: ler mensagem, que eu leio pra você. Ou fale os números. Se não chegar, diga: mandar outro.`
      ],
      tratar(t) {
        const s = norm(t);
        if (/(outro|reenvi|nao chegou|manda de novo)/.test(s)) return mandarCodigoNaConversa("Mandei outro código. ", false);
        // "ler a mensagem": a coruja lê o código em voz alta (e em Libras), como o leitor de tela do celular faria
        if (/(ler|leia|le a|le o|ouvir|escutar|mensagem|chegou|qual e o codigo|qual o codigo|fala o codigo)/.test(s) && soDigitos(t).length < 6) return lerCodigoNaConversa();
        // "pode entrar": usa o código que acabou de chegar, como o preenchimento automático de SMS do celular
        if (/(pode entrar|usa o codigo|usar o codigo|preenche|pode usar|confirma o codigo)/.test(s) && codigoAtual) t = codigoAtual.numero;
        const d = soDigitos(t);
        if (d.length !== 6) return naoEntendi(d.length ? `Peguei ${d.length} ${d.length === 1 ? "número" : "números"}, mas o código tem 6. Pode repetir?` : "Não peguei nenhum número. Fale os 6 números do código.");
        preencher("ln-codigo", d);
        const r = conferirCodigo(d);
        if (r.ok) {
          const c = acharConta(dados.contato);
          if (!(c && c.digital)) return ir("ofertaDigital", "Código certo! ");
          return concluir(() => entrar(nomeDaConta(dados.contato), false, true), "Código certo! Entrando na sua conta.");
        }
        if (r.vencido) return mandarCodigoNaConversa(`${r.motivo} Mandei um código novo. `, false);
        naoEntendi(`${r.motivo} Fale os 6 números de novo.`);
      }
    },
    ofertaDigital: {
      pergunta: () => "Quer cadastrar a sua digital ou o rosto, para da próxima vez entrar sem falar nenhum número? Diga sim ou não.",
      tratar(t) {
        const r = simNao(t);
        const nome = nomeDaConta(dados.contato);
        if (r === false) return concluir(() => entrar(nome, false, true), "Tudo bem. Entrando na sua conta.");
        if (r === true) {
          return pedirDigitalNaConversa(() => cadastrarDigital(dados.contato, (acharConta(dados.contato) || {}).nome || nome), res => {
            concluir(() => entrar(nome, false, true), res.ok ? "Digital cadastrada! Entrando na sua conta." : `${res.motivo} Sem problema, entrando com o código mesmo.`);
          }, "Vamos cadastrar.");
        }
        naoEntendi(`${ouvi(t)}Diga sim para cadastrar a digital, ou não para só entrar.`);
      }
    },
    senha: {
      tipo: "senha",
      pergunta: () => "Digite sua senha no campo de resposta e aperte Enter. Por segurança, não fale a senha em voz alta. Eu não vou repetir o que você digitar.",
      tratar(t) {
        if (t.length < 6) return naoEntendi(`Essa senha tem ${t.length} ${t.length === 1 ? "caractere" : "caracteres"}, e a sua tem pelo menos 6. Digite de novo.`, false);
        preencher("ln-senha", t);
        concluir(() => entrar(nomeDe(dados.contato), false, true), "Senha recebida. Entrando na sua conta.");
      }
    },
    perfil: {
      pergunta: () => "Para deixar o site do seu jeito: você tem deficiência visual, auditiva, as duas, ou prefere não dizer?",
      tratar(t) {
        const s = norm(t);
        let vis = false, aud = false;
        if (/\b(as duas|ambas|os dois|duas|todas)\b/.test(s)) { vis = aud = true; }
        else if (/(prefiro nao|nenhum|nenhuma|nao tenho|pular|nao quero)/.test(s)) { /* sem ajustes */ }
        else {
          vis = /(visu|cego|cega|enxerg|vista)/.test(s);
          aud = /(audit|surd|ouv|escut)/.test(s);
          if (!vis && !aud) return naoEntendi("Diga visual, auditiva, as duas, ou prefiro não dizer.");
        }
        dados.visual = vis; dados.auditiva = aud;
        preencher("cr-visual", vis); preencher("cr-auditiva", aud);
        const conf = vis && aud ? "Combinado: vou ligar a voz, a letra grande e a janela de Libras. "
          : vis ? "Combinado: vou ligar a voz da coruja e a letra grande. "
          : aud ? "Combinado: vou ligar a janela de Libras e as legendas. "
          : "Tudo bem, sem ajustes. Dá para mudar quando quiser. ";
        ir("modoNovo", conf);
      }
    },
    modoNovo: {
      pergunta: () => [
        "Como você quer entrar nas próximas vezes? Diga “digital”, para usar a digital ou o rosto deste aparelho, ou “código”, para receber 6 números a cada entrada. Se preferir, diga “senha” para criar uma senha digitando.",
        "Como você quer entrar nas próximas vezes? Diga digital, para usar a digital ou o rosto deste aparelho. Ou diga código, para receber 6 números a cada entrada. Se preferir, diga senha, para criar uma senha digitando."
      ],
      tratar(t) {
        const s = norm(t);
        let m = null;
        if (/(digital|dedo|rosto|biometr|face)/.test(s)) m = "digital";
        else if (/(codig|numero|sms)/.test(s)) m = "codigo";
        else if (/senha/.test(s)) m = "senha";
        if (!m) return naoEntendi(`${ouvi(t)}Diga digital, código ou senha.`);
        dados.metodo = m; preencher("cr-metodo-" + m, true); mostrarCampoSenha();
        ir(m === "senha" ? "novaSenha" : "confCriar");
      }
    },
    novaSenha: {
      tipo: "senha",
      pergunta: () => "Agora crie uma senha com pelo menos 6 caracteres. Digite no campo de resposta e aperte Enter. Não fale a senha em voz alta.",
      tratar(t) {
        if (t.length < 6) return naoEntendi(`Essa senha tem ${t.length} ${t.length === 1 ? "caractere" : "caracteres"}. Precisa de pelo menos 6. Digite outra.`, false);
        preencher("cr-senha", t); ir("confCriar");
      }
    },
    confCriar: {
      pergunta: () => {
        const perfil = dados.visual && dados.auditiva ? ", com voz, letra grande e Libras" : dados.visual ? ", com voz e letra grande" : dados.auditiva ? ", com Libras e legendas" : "";
        const jeito = { digital: "entrando com a digital", codigo: "entrando com código", senha: "entrando com senha" }[dados.metodo];
        return `Vou criar a conta de ${dados.nome}, com o contato ${dados.contato}, ${jeito}${perfil}. Posso criar? Diga sim ou não.`;
      },
      tratar(t) {
        const r = simNao(t);
        const terminar = msg => concluir(() => { aplicarPerfil(dados.visual, dados.auditiva); entrar(primeiroNome(dados.nome), false, true); }, msg);
        if (r === true) {
          if (dados.metodo !== "digital") { salvarConta(dados.contato, { nome: dados.nome, metodo: dados.metodo }); return terminar("Conta criada!"); }
          return pedirDigitalNaConversa(() => cadastrarDigital(dados.contato, dados.nome), res => {
            if (res.ok) return terminar("Digital cadastrada! Conta criada.");
            salvarConta(dados.contato, { nome: dados.nome, metodo: "codigo" });
            terminar(`${res.motivo} Criei a conta para entrar com código. Dá para cadastrar a digital depois.`);
          }, "Vamos cadastrar a sua digital.");
        }
        if (r === false) { dados = { criar: true }; return ir("nome", "Tudo bem, vamos refazer o cadastro. "); }
        naoEntendi(`${ouvi(t)}Responda sim para criar a conta, ou não para refazer.`);
      }
    }
  };

  /* Digital e código dentro da conversa */
  async function pedirDigitalNaConversa(acao, depois, intro) {
    historico.push(atual); atual = "aguardandoDigital"; configurarCampo();
    const real = await temDigitalReal();
    dizer(real ? `${intro} O aparelho vai pedir a sua digital, o rosto ou o PIN. Pode confirmar.`
               : `${intro} Toque no botão Encostar o dedo, ou diga confirmar.`, null, !real);
    const res = await acao();
    if (!conversaAberta) return;
    pararEscuta(); pararTudo(false);
    depois(res);
  }
  function entrarDigitalNaConversa() {
    const temCadastro = Object.values(lerContas()).some(c => c.digital);
    if (!temCadastro) { dados.metodo = "codigo"; return ir("contato", "Ainda não tem digital cadastrada neste aparelho. Vamos entrar com código, e depois eu te ajudo a cadastrar a digital. "); }
    pedirDigitalNaConversa(entrarComDigital, res => {
      if (res.ok) return concluir(() => entrar(nomeParaEntrar(res.conta), false, true), "Digital confirmada! Entrando na sua conta.");
      dados.metodo = "codigo"; atual = "modoEntrada";
      ir("contato", `${res.motivo} Vamos entrar com código, então. `);
    }, "Certo!");
  }
  function lerCodigoNaConversa() {
    if (!codigoAtual) return mandarCodigoNaConversa("Esse código já não vale. Mandei outro. ", false);
    const n = codigoAtual.numero;
    dizer(`A mensagem diz: seu código de entrada é ${n.split("").join(" ")}. Fale os números pra mim, ou diga “pode entrar” para eu usar esse código.`,
          `A mensagem diz: seu código de entrada é: ${n.split("").join(", ")}. Fale os números pra mim, ou diga: pode entrar, para eu usar esse código.`, true);
  }
  function mandarCodigoNaConversa(prefixo, avancar = true) {
    enviarCodigo(dados.contato);
    $("#form-codigo").hidden = false;
    $("#codigo-info").textContent = `Mandamos um código de 6 números para ${dados.contato}.`;
    if (avancar) return ir("codigo", prefixo);
    perguntar(prefixo);
  }

  function configurarCampo() {
    const senha = passos[atual].tipo === "senha";
    campoResp.type = senha ? "password" : "text";
    campoResp.setAttribute("autocomplete", senha ? (dados.criar ? "new-password" : "current-password") : "off");
    $("#rot-resposta").textContent = senha ? "Sua senha (só digitada, não aparece na conversa)" : "Sua resposta";
    btMic.disabled = senha || micBloqueado;
    btMic.setAttribute("aria-label", micBloqueado ? "Microfone indisponível" : senha ? "Microfone desligado para a senha" : "Falar a resposta");
  }
  function perguntar(prefixo = "") {
    const q = passos[atual].pergunta();
    const [texto, fala] = Array.isArray(q) ? q : [q, q];
    configurarCampo();
    dizer(prefixo + texto, prefixo + fala, passos[atual].tipo !== "senha");
    if (passos[atual].tipo === "senha") campoResp.focus();
  }
  function ir(passo, prefixo = "") { historico.push(atual); atual = passo; perguntar(prefixo); }
  function naoEntendi(msg, ouvirDepois = true) { dizer(msg, null, ouvirDepois); }
  function concluir(acao, msg) {
    addMsg("coruja", msg);
    pararEscuta();
    setTimeout(() => { fecharConversa(false); acao(); }, 600);
  }

  function enviar(t, viaVoz, alternativas) {
    t = t.trim(); if (!t) { campoResp.focus(); return; }
    alternativasOuvidas = viaVoz && alternativas ? alternativas.filter(a => a && a !== t) : [];
    pararEscuta(); pararTudo(false);
    const senha = passos[atual].tipo === "senha";
    addMsg("voce", senha ? "•".repeat(Math.min(t.length, 12)) : t, viaVoz ? "falado" : "");
    campoResp.value = "";
    if (!senha && atual !== "aguardandoDigital") {
      const s = norm(t);
      if (/^(repetir|repete|de novo|nao entendi|o que)\b/.test(s) || /^repet/.test(s)) return perguntar("");
      if (/^(voltar|volta)\b/.test(s)) {
        if (historico.length) { atual = historico.pop(); return perguntar("Voltando. "); }
        return perguntar("");
      }
      if (/^(cancelar|cancela|sair|parar|chega)\b/.test(s)) return fecharConversa(true);
      // trocar o tema falando: "tema escuro", "modo claro"...
      const tema = s.match(/\b(tema|modo|fundo)\s+(escuro|claro|preto|branco)\b/);
      if (tema) {
        const querEscuro = /escuro|preto/.test(tema[2]);
        if (querEscuro !== temaEscuro()) trocarTema();
        return perguntar(querEscuro ? "Pronto, tema escuro. " : "Pronto, tema claro. ");
      }
      if (/^ajuda\b/.test(s)) return dizer("Responda a pergunta falando ou digitando. Diga repetir para ouvir de novo, voltar para a pergunta anterior, tema escuro ou tema claro para mudar as cores, ou cancelar para sair da conversa.", null, true);
    }
    try { passos[atual].tratar(t); } finally { alternativasOuvidas = []; }
  }
  $("#form-resposta").addEventListener("submit", e => { e.preventDefault(); enviar(campoResp.value, false); });

  /* Microfone */
  const emQuadro = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  function motivoMic(codigo) {
    if (!SR) return "Este navegador não reconhece fala. Use o Google Chrome ou o Microsoft Edge no computador ou no Android.";
    if (codigo === "not-allowed" || codigo === "NotAllowedError" || codigo === "SecurityError") {
      if (emQuadro) return "Nesta pré-visualização o microfone fica bloqueado. Baixe o arquivo index.html e abra no Chrome por localhost ou https.";
      if (location.protocol === "file:") return "O navegador não libera o microfone para arquivos abertos direto do computador. Abra o site por localhost ou por um endereço https.";
      return "O microfone foi bloqueado. Clique no cadeado ao lado do endereço do site, permita o microfone e recarregue a página.";
    }
    if (codigo === "audio-capture" || codigo === "NotFoundError") return "Não achei nenhum microfone. Confira se ele está conectado e escolhido nas configurações de som.";
    if (codigo === "NotReadableError") return "Outro programa está usando o microfone. Feche chamadas de vídeo ou gravadores e tente de novo.";
    if (codigo === "network") return "O reconhecimento de fala precisa de internet, porque o Chrome manda o áudio para o Google transcrever. No navegador Brave ele não funciona.";
    if (codigo === "service-not-allowed") return "Este navegador desativou o reconhecimento de fala. Use o Google Chrome ou o Microsoft Edge.";
    if (codigo === "language-not-supported") return "O reconhecimento de fala não aceitou o português neste navegador. Use o Google Chrome.";
    if (codigo === "sem-resposta") return "O navegador não ligou o microfone. Confira se o microfone está permitido para este site (ícone ao lado do endereço) e no Windows, e aperte Testar microfone.";
    return `O microfone não funcionou (erro: ${codigo || "desconhecido"}).`;
  }
  function avisoMic(codigo) {
    micBloqueado = true; configurarCampo();
    const motivo = motivoMic(codigo);
    $("#mic-diag").textContent = motivo; $("#mic-diag").hidden = false;
    const m = `${motivo} Enquanto isso, pode digitar a resposta e apertar Enter.`;
    if (Leitura.fila) { addMsg("coruja", m); avisoPendente = m; }
    else dizer(m, null, false);
    campoResp.focus();
  }
  /* O microfone abre depois que a coruja termina de perguntar e fecha quando a pessoa termina de falar.
     Em https/localhost o navegador guarda a permissão, então não pede de novo. */
  const ehArquivo = location.protocol === "file:";
  function uiOuvindo(on) {
    ouvindo = on;
    $("#ouvindo").hidden = !on;
    $("#ouvindo-texto").textContent = "Ouvindo… pode falar";
    btMic.setAttribute("aria-pressed", String(on));
    if (!micBloqueado) btMic.setAttribute("aria-label", on ? "Parar de ouvir" : "Falar a resposta");
  }
  function pararEscuta() {
    if (rec) { const r = rec; rec = null; try { r.abort(); } catch (e) {} uiOuvindo(false); return true; }
    $("#ouvindo").hidden = true;
    return false;
  }
  window.__pararEscuta = pararEscuta;
  function ouvir(peloBotao = false) {
    if (!conversaAberta) return;
    if (micBloqueado || passos[atual].tipo === "senha") { campoResp.focus(); return; }
    // Aberto como arquivo, cada abertura do microfone é um novo pedido: só abre pelo botão.
    if (ehArquivo && !peloBotao) { campoResp.focus(); return; }
    pararTudo(false); pararEscuta();
    let r;
    try { r = new SR(); } catch (e) { avisoMic("indisponivel"); return; }
    rec = r;
    let final = "", inter = "", ultimoInter = "", erro = "", bipou = false;
    const alts = [];
    // No e-mail a pessoa costuma fazer pausas ("maria... arroba... gmail..."). Nesses passos o microfone
    // continua aberto e só fecha depois de 2,5 segundos de silêncio, em vez de fechar na primeira pausa.
    const longo = !!passos[atual].ouvirLongo;
    let silencio = null;
    const fecharDepoisDoSilencio = ms => { clearTimeout(silencio); silencio = setTimeout(() => { if (rec === r) { try { r.stop(); } catch (e) {} } }, ms); };
    r.lang = "pt-BR"; r.continuous = longo; r.interimResults = true; r.maxAlternatives = 5;
    const pronto = () => { if (r !== rec || bipou) return; bipou = true; uiOuvindo(true); bip(880); };
    r.onstart = () => { if (r !== rec) return; if (!("onaudiostart" in r)) pronto(); };
    r.onaudiostart = pronto;   // o bipe toca quando o microfone já está gravando de verdade
    r.onresult = ev => {
      if (r !== rec) return;
      inter = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) {
          final += res[0].transcript;
          for (let k = 1; k < res.length; k++) alts.push(res[k].transcript.trim());
        } else inter += res[0].transcript;
      }
      if (inter.trim()) ultimoInter = inter.trim();
      if (longo) fecharDepoisDoSilencio(2500);
      const ouvido = (final + " " + inter).trim();
      campoResp.value = ouvido;
      $("#ouvindo-texto").textContent = ouvido ? `Ouvindo: “${ouvido}”` : "Ouvindo… pode falar";
    };
    r.onerror = ev => { if (r === rec) erro = ev.error || ""; };
    r.onend = () => {
      if (r !== rec) return;
      clearTimeout(silencio);
      const estava = ouvindo; rec = null; uiOuvindo(false);
      if (!conversaAberta || erro === "aborted") return;
      if (/not-allowed|service-not-allowed|audio-capture|network|language-not-supported/.test(erro)) { avisoMic(erro); return; }
      const texto = (longo ? (final + " " + (inter || "")).trim() || ultimoInter : (final || inter || ultimoInter)).trim();
      if (texto) { semFala = 0; bip(660); enviar(texto, true, alts); return; }
      if (!estava) return;
      semFala++;
      if (semFala <= 1) dizer("Não ouvi nada. Pode falar de novo depois do bipe?", null, true);
      else { semFala = 0; dizer("Não ouvi. Quando quiser, aperte o botão do microfone ou digite a resposta.", null, false); campoResp.focus(); }
    };
    try { r.start(); } catch (e) { rec = null; avisoMic(e && e.name); return; }
    setTimeout(() => { if (rec === r && !ouvindo) { pararEscuta(); avisoMic("sem-resposta"); } }, 5000);
    setTimeout(() => { if (rec === r && !bipou) pronto(); }, 1200);
    if (longo) fecharDepoisDoSilencio(9000);   // se a pessoa não falar nada, fecha depois de 9 segundos
  }
  btMic.onclick = () => {
    if (ouvindo) { pararEscuta(); campoResp.focus(); return; }
    ouvir(true);
  };
  $("#bt-tentar-mic").onclick = () => {
    if (!SR) { avisoMic(""); return; }
    pararEscuta(); micBloqueado = false; $("#mic-diag").hidden = true; configurarCampo();
    ouvir(true);
  };

  /* Abrir e fechar */
  function abrirConversa() {
    conversaAberta = true; dados = {}; historico = []; atual = "inicio"; semFala = 0;
    listaMsg.innerHTML = "";
    $("#conversa").hidden = false; $("#bloco-conversar").hidden = true; $(".prefs-rapidas").hidden = true;
    root.classList.add("conversando");
    ultimoGuia = campoResp; campoResp.focus();
    if (micBloqueado) { $("#mic-diag").textContent = motivoMic(""); $("#mic-diag").hidden = false; addMsg("coruja", motivoMic("") + " Responda digitando; eu continuo falando as perguntas."); }
    else if (ehArquivo) {
      $("#mic-diag").textContent = "Aberto como arquivo do computador, o microfone só liga pelo botão e o navegador pode pedir permissão a cada vez. Para conversar sem apertar nada, abra o site por https ou localhost.";
      $("#mic-diag").hidden = false;
    }
    perguntar("");
  }
  function fecharConversa(avisarFim) {
    conversaAberta = false; pararEscuta(); pararTudo(false);
    $("#conversa").hidden = true; $("#bloco-conversar").hidden = false; $(".prefs-rapidas").hidden = false;
    root.classList.remove("conversando");
    if (avisarFim) {
      $("#bt-conversar").focus();
      const m = "Conversa encerrada. O que você já respondeu ficou no formulário.";
      avisar(m); guiar(m, true);
    }
  }
  $("#bt-conversar").onclick = abrirConversa;
  $("#bt-sair-conversa").onclick = () => fecharConversa(true);

  /* Reserva espaço no fim da página para a coruja não cobrir o conteúdo */
  if (window.ResizeObserver) {
    new ResizeObserver(() => {
      const h = painel.hidden ? 0 : painel.getBoundingClientRect().height + 110;
      root.style.setProperty("--doca-h", h + "px");
    }).observe(painel);
  }
  campoResp.addEventListener("focus", () => { if (window.innerWidth < 920) setTimeout(() => campoResp.scrollIntoView({ block: "center" }), 250); });

  /* ---------- Início ---------- */
  aplicarPref();
  renderAcervo();
  abrirObra("dom");
  renderTrocas();
  atualizarVLibras();
  if (pref.interprete) abrirVLibras();
  if (conta.logado) mostrarSite(false); else { mostrarLogin(false); mostrarTelaToque(); }

  /* ---------- Tela de toque ----------
     Quem não enxerga dificilmente acha um botão na tela sem leitor de tela. Por isso, ao abrir o site,
     a página inteira vira um botão: qualquer toque ou tecla começa a conversa com a coruja.
     (O navegador não deixa som nem microfone começarem sem um toque, então ele é necessário.) */
  function mostrarTelaToque() {
    const tela = $("#tela-toque");
    let foi = false;
    const fechar = () => {
      tela.hidden = true;
      document.removeEventListener("keydown", tecla, true);
      tela.removeEventListener("pointerdown", toque);
    };
    const comecar = () => {
      if (foi) return; foi = true;
      fechar();
      abrirConversa();
    };
    const pular = () => {
      if (foi) return; foi = true;
      fechar();
      $("#t-login").focus();
    };
    function tecla(e) {
      if (tela.hidden || e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === "Tab" || e.key === "Shift") return;          // deixa navegar até "Prefiro usar o formulário"
      if (e.key === "Escape") { e.preventDefault(); return pular(); }
      if ((e.key === "Enter" || e.key === " ") && document.activeElement === $("#bt-toque-pular")) return;
      e.preventDefault(); comecar();
    }
    function toque(e) {
      if (e.target.closest("#bt-toque-pular")) return;
      e.preventDefault(); comecar();
    }
    $("#bt-toque").onclick = comecar;          // leitor de tela (TalkBack, VoiceOver) ativa com toque duplo
    $("#bt-toque-pular").onclick = pular;
    tela.addEventListener("pointerdown", toque);
    document.addEventListener("keydown", tecla, true);
    tela.hidden = false;
    $("#bt-toque").focus();
  }
})();
