/*----------TROCA DE TEMA NO OUTRP JS!!!!----------*/ 

/*----------BIO----------*/

const btnBio = document.getElementById("btn_bio");
const curiosidadesBio = document.getElementById("curiosidades_bio");

btnBio.addEventListener("click", () => {
    const estaOculto = curiosidadesBio.hidden;

    curiosidadesBio.hidden = !estaOculto;

    btnBio.textContent = estaOculto
        ? "ocultar curiosidades"
        : "mostrar curiosidades";
});


/*----------ERAS----------*/

const lista = document.querySelector(".eras_lista");
const cards = lista.querySelectorAll(".era");
const btnAnterior = document.getElementById("eras_anterior");
const btnProximo = document.getElementById("eras_proximo");

const VISIVEIS = 4;
let posicao = 0;

function mover(novaPosicao) {
  const ultima = cards.length - VISIVEIS;

  posicao = Math.max(0, Math.min(ultima, novaPosicao));

  const passo = cards[1].offsetLeft - cards[0].offsetLeft;
  lista.style.transform = "translateX(-" + posicao * passo + "px)";

  btnAnterior.disabled = posicao === 0;
  btnProximo.disabled = posicao === ultima;
}

btnAnterior.addEventListener("click", () => mover(posicao - 3));
btnProximo.addEventListener("click", () => mover(posicao + 3));

window.addEventListener("resize", () => mover(posicao));

mover(0);


/*----------EXPLORAR CARREIRA----------*/

const abas = document.querySelectorAll(".aba");
const paineis = document.querySelectorAll(".painel");

abas.forEach((aba) => {
  aba.addEventListener("click", () => {
    abas.forEach((a) => a.classList.toggle("ativa", a === aba));
    paineis.forEach((p) => p.classList.toggle("ativo", p.id === aba.dataset.alvo));
    atualizarSetasGaleria();
  });
});

const fotos = document.getElementById("galeria_fotos");
const btnGaleriaAnterior = document.getElementById("galeria_anterior");
const btnGaleriaProximo = document.getElementById("galeria_proximo");

function atualizarSetasGaleria() {
  const fim = fotos.scrollWidth - fotos.clientWidth - 1;
  btnGaleriaAnterior.disabled = fotos.scrollLeft <= 0;
  btnGaleriaProximo.disabled = fotos.scrollLeft >= fim;
}

btnGaleriaAnterior.addEventListener("click", () => fotos.scrollBy({ left: -fotos.clientWidth * 0.8 }));
btnGaleriaProximo.addEventListener("click", () => fotos.scrollBy({ left: fotos.clientWidth * 0.8 }));
fotos.addEventListener("scroll", atualizarSetasGaleria);
window.addEventListener("resize", atualizarSetasGaleria);
atualizarSetasGaleria();


/*----------SPOTIFY: AUDIO----------*/

let audioAtual = null;
let botaoAtivo = null;

function pararAudio() {
  if (audioAtual) {
    audioAtual.pause();
    audioAtual.currentTime = 0;
  }
  if (botaoAtivo) botaoAtivo.classList.remove("tocando");
  audioAtual = null;
  botaoAtivo = null;
}


/*----------SPOTIFY: ALBUNS E FAIXAS----------*/

const albuns = document.querySelectorAll(".album");
const destaqueCapa = document.getElementById("destaque_capa");
const destaqueTitulo = document.getElementById("destaque_titulo");
const destaqueAno = document.getElementById("destaque_ano");
const listasFaixas = document.querySelectorAll(".lista_faixas");
const listasVideos = document.querySelectorAll(".lista_videos");

const faixasPorAlbum = [
  "faixas_Mans",
  "faixas_short",
  "faixas_emails",
  "faixas_Sing",
  "faixas_Sing2"
];

let faixaAtual = null;
let modoVideos = false;

function mostrarFaixas(id) {
  faixaAtual = id;

  listasFaixas.forEach((l) => {
    const ativa = l.id === id && !modoVideos;
    l.classList.toggle("ativo", ativa);
    l.style.display = ativa ? "block" : "none";
  });

  const idVideos = id.replace("faixas_", "videos_");

  listasVideos.forEach((v) => {
    const ativo = v.id === idVideos && modoVideos;
    if (!ativo && v.classList.contains("ativo")) {
      v.querySelectorAll("iframe").forEach((f) => { f.src = f.src; });
    }
    v.classList.toggle("ativo", ativo);
  });
}

albuns.forEach((album, i) => {
  album.addEventListener("click", () => {
    const nome = album.querySelector(".album_nome").textContent;

    destaqueCapa.src = album.querySelector("img").src;
    destaqueCapa.alt = "Capa do álbum " + nome;
    destaqueTitulo.textContent = nome;
    destaqueAno.textContent = album.querySelector(".album_ano").textContent;

    albuns.forEach((a) => a.classList.toggle("ativo", a === album));

    pararAudio();
    mostrarFaixas(album.dataset.faixas || faixasPorAlbum[i]);
  });
});

let albumInicial = Array.from(albuns).findIndex(
  (a) => a.querySelector("img").src === destaqueCapa.src
);
if (albumInicial < 0) albumInicial = 1;

albuns[albumInicial].classList.add("ativo");
mostrarFaixas(albuns[albumInicial].dataset.faixas || faixasPorAlbum[albumInicial]);


/*----------SPOTIFY: PLAY----------*/

const botoesPlay = document.querySelectorAll(".faixa_play");

botoesPlay.forEach((botao) => {
  botao.addEventListener("click", () => {
    const faixa = botao.closest(".faixa");
    const meuAudio = faixa.querySelector(".audio_faixa");

    if (!meuAudio) return;

    if (audioAtual && audioAtual !== meuAudio) {
      pararAudio();
    }

    if (meuAudio.paused) {
      meuAudio.play();
      botao.classList.add("tocando");
      audioAtual = meuAudio;
      botaoAtivo = botao;
    } else {
      meuAudio.pause();
      botao.classList.remove("tocando");
      audioAtual = null;
      botaoAtivo = null;
    }

    meuAudio.onended = () => {
      botao.classList.remove("tocando");
      audioAtual = null;
      botaoAtivo = null;
    };
  });
});


/*----------SPOTIFY: MUSICAS E VIDEOS----------*/

const botoesAlternar = document.querySelectorAll(".spotify_alternar button");
const caixaFaixas = document.querySelector(".faixas");
const painelVideos = document.getElementById("videos_faixas");

botoesAlternar.forEach((botao) => {
  botao.addEventListener("click", () => {
    modoVideos = botao.dataset.alvo === "videos";

    botoesAlternar.forEach((b) => b.classList.toggle("ativo", b === botao));
    caixaFaixas.classList.toggle("modo_videos", modoVideos);
    painelVideos.classList.toggle("ativo", modoVideos);

    pararAudio();

    mostrarFaixas(faixaAtual);
  });
});


/*----------QUIZ----------*/

const quizPerguntas = document.querySelectorAll(".pergunta");
const quizBotoes = document.querySelectorAll(".btn_quiz");
const quizResultado = document.querySelector(".quiz_resultado");
const quizResultadoTexto = document.getElementById("quiz_resultado_texto");
const quizMensagem = document.getElementById("quiz_mensagem");
const quizProgresso = document.getElementById("quiz_progresso");
const quizPontosTexto = document.getElementById("quiz_pontos");
const quizBarra = document.getElementById("quiz_barra_cheia");
const quizProxima = document.getElementById("quiz_proxima");
const quizReiniciar = document.getElementById("quiz_reiniciar");

let quizAtual = 0;
let quizAcertos = 0;

function atualizarPontos() {
  quizPontosTexto.textContent = quizAcertos + (quizAcertos === 1 ? " ponto" : " pontos");
}

function mostrarPergunta() {
  quizPerguntas.forEach((p, i) => {
    p.classList.toggle("ativa", i === quizAtual);
    p.classList.remove("respondida", "acertou", "errou");
  });
  quizResultado.classList.remove("ativa");

  quizBotoes.forEach((b) => {
    b.disabled = false;
    b.classList.remove("certa", "errada");
  });

  quizProgresso.textContent = "Pergunta " + (quizAtual + 1) + " de " + quizPerguntas.length;
  quizBarra.style.width = (quizAtual / quizPerguntas.length * 100) + "%";
  atualizarPontos();
  quizProxima.hidden = true;
  quizReiniciar.hidden = true;
}

quizBotoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const pergunta = botao.closest(".pergunta");
    const acertou = botao.hasAttribute("data-certa");

    pergunta.querySelectorAll(".btn_quiz").forEach((b) => {
      b.disabled = true;
      b.classList.add(b.hasAttribute("data-certa") ? "certa" : "errada");
    });

    if (acertou) quizAcertos++;
    pergunta.classList.add("respondida", acertou ? "acertou" : "errou");

    atualizarPontos();
    quizProxima.textContent = quizAtual === quizPerguntas.length - 1 ? "Ver resultado" : "Próxima";
    quizProxima.hidden = false;
  });
});

function mostrarFim() {
  quizPerguntas.forEach((p) => p.classList.remove("ativa"));
  quizResultado.classList.add("ativa");

  quizBarra.style.width = "100%";
  quizProgresso.textContent = "Fim do quiz";
  quizResultadoTexto.textContent = "Você fez " + quizAcertos + " de " + quizPerguntas.length + " pontos.";

  let msg = "Sobe a página e vê a carreira dela ai pae!";
  if (quizAcertos >= 4) msg = "Boa! Você curte mesmo em dog.";
  else if (quizAcertos >= 3) msg = "Essa é a diferença do fã pro fanboy!!";
  quizMensagem.textContent = msg;

  quizProxima.hidden = true;
  quizReiniciar.hidden = false;
}

quizProxima.addEventListener("click", () => {
  quizAtual++;
  if (quizAtual < quizPerguntas.length) mostrarPergunta();
  else mostrarFim();
});

quizReiniciar.addEventListener("click", () => {
  quizAtual = 0;
  quizAcertos = 0;
  mostrarPergunta();
});

mostrarPergunta();