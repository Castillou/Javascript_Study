'use strict';

// Element
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let high_score = 0;

const Body = document.querySelector('body');
const Check = document.querySelector('.check');
const Guess = document.querySelector('.guess');
const Message = document.querySelector('.message');
const OutputNumber = document.querySelector('.number');
const Score = document.querySelector('.score');
const highScore = document.querySelector('.highscore');
const Again = document.querySelector('.again');

// displayMessage -> Message change
const displayMessage = function (message) {
  Message.textContent = message;
};

// Check Btn click
Check.addEventListener('click', function () {
  // input guess number -> get value -> type change (Number)
  const guessNum = Number(Guess.value);
  console.log(guessNum, typeof guessNum);

  // 1. When there is no input -> Message Change
  if (!guessNum) {
    displayMessage('⛔️ No number!');
    // console.log('no number');

    // 2. if guess number exceeds 20
  } else if (guessNum > 20) {
    displayMessage('👿 Number is Too high!');
    Body.style.backgroundColor = '#A367B1';

    // 3. When guess number = secret number -> player wins
  } else if (guessNum === secretNumber) {
    // 1) Message Change
    displayMessage('🎉 Correct Number!');

    // 2) Output number(?) Change -> secret number
    OutputNumber.textContent = secretNumber;

    // 3) body - background Color & Output Number - width change
    Body.style.backgroundColor = '#00B8A9';
    OutputNumber.style.width = '30rem';

    // 4) score > highscore -> New Record Register
    if (score > high_score) {
      high_score = score;
      highScore.textContent = high_score;
    }

    /* --------------------------------- */
    // 4. When guess is wrong
  } else if (guessNum !== secretNumber) {
    // 1) If score is still above(>) 1
    if (score > 1) {
      // 1-1) Number hint -> Message Change
      displayMessage(guessNum > secretNumber ? '📈 Too high!' : '📉 Too low!');
      // 1-2) score - 1
      score--;
      // 1-3) Renew score
      Score.textContent = score;

      // 2) If score =< 1 -> lost Game
    } else {
      // 2-1) Message Change
      displayMessage('💥 You lost the game!');
      // 2-2) Body Background Color -> Change
      Body.style.backgroundColor = '#F5004F';
      // 2-3) Score -> 0
      Score.textContent = 0;
    }
  }
});

// Again btn click -> Game reset
Again.addEventListener('click', function () {
  // 1. Score 20
  score = 20;
  Score.textContent = score;
  // 2. Create New Secret Number
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  // 3. Message, OutputNumber Change
  displayMessage('🔥 New Game set!');
  OutputNumber.textContent = '?';
  // 4. Guess value -> reset
  Guess.value = '';

  // body background Color, Output Number width -> reset
  Body.style.backgroundColor = '#222';
  OutputNumber.style.width = '15rem';
});
