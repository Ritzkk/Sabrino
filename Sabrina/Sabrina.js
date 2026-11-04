


/*eras*/

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


/*Exlplorar carreira*/ 

const abas = document.querySelectorAll(".aba");
const paineis = document.querySelectorAll(".painel");
 
abas.forEach((aba) => {
  aba.addEventListener("click", () => {
    abas.forEach((a) => a.classList.toggle("ativa", a === aba));
    paineis.forEach((p) => p.classList.toggle("ativo", p.id === aba.dataset.alvo));
    atualizarSetasGaleria(); // a galeria estava escondida, recalcula as setas
  });
});
 
/* --- galeria: setas rolam a faixa de fotos --- */
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