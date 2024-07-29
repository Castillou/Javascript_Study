'use strict';

// Element
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let high_score = 0;

const Body = document.querySelector('body');
const Check = document.querySelector('.check');
const Guess = document.querySelector('.guess');
const Message = document.querySelector('.message');
const inputNumber = document.querySelector('.number');
const Score = document.querySelector('.score');
const highScore = document.querySelector('.highscore');
const Again = document.querySelector('.again');

const displayMessage = function (message) {
  Message.textContent = message;
};

Check.addEventListener('click', function () {
  const guessNum = Number(Guess.value);
  console.log(guessNum, typeof guessNum);

  // When there is no input
  if (!guessNum) {
    displayMessage('⛔️ No number!');
    // console.log('no number');
  } else if (guessNum > 20) {
    displayMessage('👿 Number is Too high!');
    Body.style.backgroundColor = '#A367B1';
    // When player wins
  } else if (guessNum === secretNumber) {
    displayMessage('🎉 Correct Number!');

    // input the number in ?
    inputNumber.textContent = secretNumber;

    // background Color and width change
    Body.style.backgroundColor = '#00B8A9';
    inputNumber.style.width = '30rem';

    // New Record Register
    if (score > high_score) {
      high_score = score;
      highScore.textContent = high_score;
    }

    /* --------------------------------- */
    // When guess is wrong
  } else if (guessNum !== secretNumber) {
    // Wrong guess && score > 1 -> Message Change + down score -> score Change
    if (score > 1) {
      displayMessage(guessNum > secretNumber ? '📈 Too high!' : '📉 Too low!');
      score--;
      Score.textContent = score;

      // score = 1 + wrong guess => Game End
    } else {
      displayMessage('💥 You lost the game!');
      Body.style.backgroundColor = '#F5004F';
      Score.textContent = 0;
    }
  }
});

// Again btn : Game reset
Again.addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  displayMessage('🔥 New Game set!');
  Score.textContent = score;
  inputNumber.textContent = '?';
  Guess.value = '';

  Body.style.backgroundColor = '#222';
  inputNumber.style.width = '15rem';
});
