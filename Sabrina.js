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


/*---------- SPOTIFY: áudio (declarado antes porque a troca de álbum usa) ----------*/

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


/*---------- SPOTIFY: álbuns e faixas ----------*/

const albuns = document.querySelectorAll(".album");
const destaqueCapa = document.getElementById("destaque_capa");
const destaqueTitulo = document.getElementById("destaque_titulo");
const destaqueAno = document.getElementById("destaque_ano");
const listasFaixas = document.querySelectorAll(".lista_faixas");

/* Ordem dos álbuns no HTML (de cima pra baixo) -> id da lista de faixas.
   Se o botão tiver data-faixas="id", o data-faixas ganha desse array. */
const faixasPorAlbum = [
  "faixas_Mans",    // 1º botão (Sabrina-2026.jpg) -> Man's Best Friend
  "faixas_short",   // 2º botão -> Short n' Sweet
  "faixas_emails",  // 3º botão -> Emails I Can't Send
  "faixas_Sing",    // 4º botão -> Singular Act I
  "faixas_Sing2"    // 5º botão -> Singular Act II
];

// mostra só a lista com o id pedido e esconde as outras
function mostrarFaixas(id) {
  listasFaixas.forEach((l) => {
    const ativa = l.id === id;
    l.classList.toggle("ativo", ativa);
    l.style.display = ativa ? "block" : "none";
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

    // troca as 4 faixas e para a música que estava tocando
    pararAudio();
    mostrarFaixas(album.dataset.faixas || faixasPorAlbum[i]);
  });
});

// estado inicial: acha o álbum cuja capa já está em destaque
let albumInicial = Array.from(albuns).findIndex(
  (a) => a.querySelector("img").src === destaqueCapa.src
);
if (albumInicial < 0) albumInicial = 1;

albuns[albumInicial].classList.add("ativo");
mostrarFaixas(albuns[albumInicial].dataset.faixas || faixasPorAlbum[albumInicial]);


/*----Spotify parte de dar play na msc.----*/

const botoesPlay = document.querySelectorAll(".faixa_play");

botoesPlay.forEach((botao) => {
  botao.addEventListener("click", () => {
    // Pega o elemento <audio> que está dentro do mesmo bloco .faixa
    const faixa = botao.closest(".faixa");
    const meuAudio = faixa.querySelector(".audio_faixa");

    if (!meuAudio) return;

    // Se já tiver algum áudio tocando em outra faixa
    if (audioAtual && audioAtual !== meuAudio) {
      pararAudio();
    }

    // Alterna play/pause da música atual
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

    // Quando a música terminar sozinha
    meuAudio.onended = () => {
      botao.classList.remove("tocando");
      audioAtual = null;
      botaoAtivo = null;
    };
  });
});



/*---------- QUIZ ---------- */

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