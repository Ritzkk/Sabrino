const temaSabrina = document.getElementById("tema_sabrina");
const temaLamelo = document.getElementById("tema_lamelo");
const tplLamelo = document.getElementById("tpl_lamelo");
const linksSwitch = document.querySelectorAll(".switch a");

let temaAtual = "sabrina";
let lameloIniciado = false;

function trocarTema(tema) {
  if (tema === "alternar") tema = temaAtual === "sabrina" ? "lamelo" : "sabrina";
  if (tema === temaAtual) return;
  temaAtual = tema;

  const ehLamelo = tema === "lamelo";

  if (ehLamelo && !lameloIniciado) {
    temaLamelo.appendChild(tplLamelo.content.cloneNode(true));
  }

  temaSabrina.hidden = ehLamelo;
  temaLamelo.hidden = !ehLamelo;
  document.body.classList.toggle("tema-lamelo", ehLamelo);
  linksSwitch.forEach((a) => a.classList.toggle("ativo", a.dataset.tema === tema));

  if (ehLamelo) {
    if (!lameloIniciado) { iniciarLamelo(); lameloIniciado = true; }
    else lameloAtualizar();
  }
  window.scrollTo({ top: 0 });
}

document.addEventListener("click", (e) => {
  const gatilho = e.target.closest("[data-tema]");
  if (!gatilho) return;
  e.preventDefault();
  trocarTema(gatilho.dataset.tema);
});

let lameloMover = () => {};
let lameloSetasGaleria = () => {};

function lameloAtualizar() {
  lameloMover();
  lameloSetasGaleria();
}

function iniciarLamelo() {
  const L = temaLamelo;

  const btnBio = L.querySelector(".l_btn_bio");
  const curiosidades = L.querySelector(".curiosidades_bio");
  btnBio.addEventListener("click", () => {
    const estavaOculto = curiosidades.hidden;
    curiosidades.hidden = !estavaOculto;
    btnBio.textContent = estavaOculto ? "ocultar curiosidades" : "mostrar curiosidades";
  });

  const lista = L.querySelector(".eras_lista");
  const cards = lista.querySelectorAll(".era");
  const anterior = L.querySelector(".l_eras_ant");
  const proximo = L.querySelector(".l_eras_prox");
  const VISIVEIS = 4;
  let posicao = 0;

  function mover(nova) {
    const ultima = cards.length - VISIVEIS;
    posicao = Math.max(0, Math.min(ultima, nova));
    const passo = cards[1].offsetLeft - cards[0].offsetLeft;
    lista.style.transform = "translateX(-" + posicao * passo + "px)";
    anterior.disabled = posicao === 0;
    proximo.disabled = posicao === ultima;
  }
  anterior.addEventListener("click", () => mover(posicao - 2));
  proximo.addEventListener("click", () => mover(posicao + 2));
  window.addEventListener("resize", () => { if (!temaLamelo.hidden) mover(posicao); });
  lameloMover = () => mover(posicao);
  mover(0);

  /*----------EXPLORAR CARREIRA----------*/
  const abas = L.querySelectorAll(".aba");
  const paineis = L.querySelectorAll(".painel");
  abas.forEach((aba) => {
    aba.addEventListener("click", () => {
      abas.forEach((a) => a.classList.toggle("ativa", a === aba));
      paineis.forEach((p) => p.classList.toggle("ativo", p.dataset.id === aba.dataset.alvo));
      atualizarGaleria();
    });
  });

  const fotos = L.querySelector(".galeria_fotos");
  const gAnt = L.querySelector(".l_gal_ant");
  const gProx = L.querySelector(".l_gal_prox");

  function atualizarGaleria() {
    const fim = fotos.scrollWidth - fotos.clientWidth - 1;
    gAnt.disabled = fotos.scrollLeft <= 0;
    gProx.disabled = fotos.scrollLeft >= fim;
  }
  gAnt.addEventListener("click", () => fotos.scrollBy({ left: -fotos.clientWidth * 0.8 }));
  gProx.addEventListener("click", () => fotos.scrollBy({ left: fotos.clientWidth * 0.8 }));
  fotos.addEventListener("scroll", atualizarGaleria);
  window.addEventListener("resize", atualizarGaleria);
  lameloSetasGaleria = atualizarGaleria;
  atualizarGaleria();

  const perguntas = L.querySelectorAll(".pergunta");
  const botoesQuiz = L.querySelectorAll(".btn_quiz");
  const resultado = L.querySelector(".quiz_resultado");
  const resultadoTexto = L.querySelector(".l_quiz_resultado_texto");
  const mensagem = L.querySelector(".l_quiz_mensagem");
  const progresso = L.querySelector(".l_quiz_progresso");
  const pontosTexto = L.querySelector(".l_quiz_pontos");
  const barra = L.querySelector(".l_quiz_barra_cheia");
  const btnProxima = L.querySelector(".l_quiz_proxima");
  const btnReiniciar = L.querySelector(".l_quiz_reiniciar");

  let atual = 0;
  let acertos = 0;

  const atualizarPontos = () => {
    pontosTexto.textContent = acertos + (acertos === 1 ? " ponto" : " pontos");
  };

  function mostrarPergunta() {
    perguntas.forEach((p, i) => {
      p.classList.toggle("ativa", i === atual);
      p.classList.remove("respondida", "acertou", "errou");
    });
    resultado.classList.remove("ativa");
    botoesQuiz.forEach((b) => { b.disabled = false; b.classList.remove("certa", "errada"); });
    progresso.textContent = "Pergunta " + (atual + 1) + " de " + perguntas.length;
    barra.style.width = (atual / perguntas.length * 100) + "%";
    atualizarPontos();
    btnProxima.hidden = true;
    btnReiniciar.hidden = true;
  }

  botoesQuiz.forEach((botao) => {
    botao.addEventListener("click", () => {
      const pergunta = botao.closest(".pergunta");
      const acertou = botao.hasAttribute("data-certa");
      pergunta.querySelectorAll(".btn_quiz").forEach((b) => {
        b.disabled = true;
        b.classList.add(b.hasAttribute("data-certa") ? "certa" : "errada");
      });
      if (acertou) acertos++;
      pergunta.classList.add("respondida", acertou ? "acertou" : "errou");
      atualizarPontos();
      btnProxima.textContent = atual === perguntas.length - 1 ? "Ver resultado" : "Próxima";
      btnProxima.hidden = false;
    });
  });

  function mostrarFim() {
    perguntas.forEach((p) => p.classList.remove("ativa"));
    resultado.classList.add("ativa");
    barra.style.width = "100%";
    progresso.textContent = "Fim do quiz";
    resultadoTexto.textContent = "Você fez " + acertos + " de " + perguntas.length + " pontos.";
    let msg = "Dá um pulo na carreira dele lá em cima e tenta de novo!";
    if (acertos >= 4) msg = "Triple-double no quiz! Você manja do LaMelo.";
    else if (acertos >= 3) msg = "Quase All-Star. Falta só um pouquinho.";
    mensagem.textContent = msg;
    btnProxima.hidden = true;
    btnReiniciar.hidden = false;
  }

  btnProxima.addEventListener("click", () => {
    atual++;
    if (atual < perguntas.length) mostrarPergunta();
    else mostrarFim();
  });
  btnReiniciar.addEventListener("click", () => { atual = 0; acertos = 0; mostrarPergunta(); });

  mostrarPergunta();
}