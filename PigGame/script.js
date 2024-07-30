"use strict";

// 변수 생성 후 Elements 호출 및 저장
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const current0El = document.querySelector("#current--0");
const current1El = document.querySelector("#current--1");
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");

const diceImgEl = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

let scores, currentScore, activePlayer, playing;

// 초기화 함수 init  선언문
const init = function () {
  scores = [0, 0]; // 통합 점수 저장 배열
  currentScore = 0; // 현재 점수
  activePlayer = 0; // 현재 플레이어
  playing = true; // 플레이 여부

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceImgEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");
};
init();

// 선수 전환 함수 switchPlayer 선언문
const switchPlayer = function () {
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  document.querySelector(`#current--${activePlayer}`).textContent = 0;

  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

// Roll Dice 버튼 클릭시 주사위 굴리고 1이 아닐 경우 점수 추가
btnRoll.addEventListener("click", function () {
  // 만약 playing = true 일 경우
  if (playing) {
    // 1. 랜덤 주사위 숫자 생성
    const diceNum = Math.trunc(Math.random() * 6) + 1;

    // 2. 주사위 숫자에 맞는 이미지 display
    diceImgEl.classList.remove("hidden");
    diceImgEl.src = `/img/dice-${diceNum}.png`;

    // 3. 주사위가 1이 아닌경우 나온 주사위 숫자만큼 +점수 & 주사위 숫자가 1이면 선수 전환
    if (diceNum !== 1) {
      currentScore += diceNum;
      document.querySelector(`#current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
});

// Hold 버튼 클릭 시 현재 점수를 통합 점수에 input
btnHold.addEventListener("click", function () {
  // 1. 플레이 중일 경우 -> 통합 점수에 input
  if (playing) {
    scores[activePlayer] += currentScore;

    document.querySelector(`#score--${activePlayer}`).textContent =
      scores[activePlayer];

    // 2. 만약 통합 점수가 100점 이상이라면 게임 종료
    // 아니라면 선수 전환
    if (scores[activePlayer] >= 100) {
      playing = false;
      diceImgEl.classList.add("hidden");

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
    } else {
      switchPlayer();
    }
  }
});

// New Game 버튼 클릭 시 점수 초기화
btnNew.addEventListener("click", init);
