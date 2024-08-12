'use strict';

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-08-10T10:51:36.790Z',
    '2024-08-11T10:51:36.790Z',
    '2024-08-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2013-11-01T13:15:33.035Z',
    '2013-11-30T09:48:16.867Z',
    '2013-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'KRW',
  locale: 'ko-KO',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// FUNCTIONS

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yeaterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // console.log(movs);

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div> 
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    // movement 요소 안의 처음 자식 이전에 html text 추가
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
// Calculate Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

/////////////////////////////////////////////////
// Calculate Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

/////////////////////////////////////////////////
// Create UserName initial
const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// button이 form element이기 때문에
// HTML 기본 동작으로 submit button 클릭시
// 페이지가 reload 됨

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//////////////////////////////////////////////////
// Event Handler
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting API
// numeric : 수치
// long :
// 2-degits : 0 부터 시작

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  // console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back. ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;

    // Create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // UPDATE UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // UPDATE UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      // UPDATE UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/* 

// accumulater -> SNOWBALL
const withdrawals = account1.movements.filter(mov => mov <= 0);
console.log(withdrawals);


// PIPELINE
const totalDepositUSD = account1.movements
  .filter(mov => mov > 0)
  .map(mov => mov * account1.interestRate)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositUSD);

// Caculate Dog Age to Human Age
const calcAverageHumanAge = dogAges => {
  const avgHumanAge = dogAges
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  return avgHumanAge;
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

// find() : 첫 번째로 주어진 조건(mov < 0)을 만족하는 값을 반환
const firstWithdrawal = account1.movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);


// include() : Equality Value 배열의 요소 중 입력값과 같은 값이 있으면 true
const equalValue = account1.movements.includes(-130);
console.log(equalValue);

// some() : 배열의 요소 중 하나라도 조건을 만족하면 true
const anyDeposits = account1.movements.some(mov => mov > 0);
console.log(anyDeposits);

// every() : 배열의 모든 요소가 조건을 만족하면 true
const everyMov = account1.movements.every(mov => mov > 0);
console.log(everyMov);

// flat(depth(:default 1)) : 설정한 깊이만큼 배열안의 모든 요소를 펼침
const arr = [[1, [2, 3]], [4, 5, 6], 7, 8];
console.log(arr.flat(2));

// flat
const overalBalance = accounts
.map(acc => acc.movements)
.flat()
.reduce((acc, cur) => acc + cur);
console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
.flatMap(acc => acc.movements)
.reduce((acc, cur) => acc + cur);
console.log(overalBalance2);

// sort() : 원본 배열에 영향을 줌
const owners = ['Jonas', 'Adam', 'Zach', 'Sean'];
console.log(owners.sort());
console.log(owners);

// Number + sort() : - 먼저, 1부터 차례대로
// 함수 적용 시
// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

console.log(account1.movements);
// account1.movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
account1.movements.sort((a, b) => a - b);
console.log(account1.movements);

// Empty arrays + fill method
// fill(fill, start, end): start부터 end 이전까지 fill 요소로 채움
const x = new Array(7);
x.fill(1, 3, 5);
console.log(x); // [empty × 3, 1, 1, empty × 2]

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y); // [1, 1, 1, 1, 1, 1, 1]

const z = Array.from({ length: 7 }, (_, i) => i + 1); // _(disabled): 사용하지 않고 넘어감
console.log(z); // [1, 2, 3, 4, 5, 6, 7]
  
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
  
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});

const randomDiceRoll = Array.from({ length: 6 }, (_, i) =>
    Math.floor(Math.random(i) * 6 + 1)
);
console.log(randomDiceRoll);

// Ex 1
const bankDepositSum = accounts
.flatMap(acc => acc.movements)
.filter(mov => mov > 0)
.reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);

// Ex 2 (least >=)
const numDeposit1000 = accounts
.flatMap(acc => acc.movements)
// .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
.reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposit1000);

// Ex 3
const { deposits, withdrawals } = accounts
.flatMap(acc => acc.movements)
.reduce(
  (sums, cur) => {
    // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
    sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
    return sums;
  },
  { deposits: 0, withdrawals: 0 }
);
console.log(deposits, withdrawals);

// Ex 4
// this is a nice title -> This is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'is'];
  
  const titleCase = title
  .toLowerCase()
  .split(' ')
  .map(word => (exceptions.includes(word) ? word : capitalize(word)))
  .join(' ');
  
  return titleCase;
};

console.log(convertTitleCase('this is a nice title'));

/////////////////////////////////////////////////////////////////////
// Coding Challenge #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bab'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dogs => {
  dogs.recFood = Math.trunc(dogs.weight ** 0.75 * 28);
});
// console.log(dogs);

// 2.
const saDog = dogs.find(dog => dog.owners.includes('Sarah'));
const saDogEating = saDog.curFood > saDog.recFood ? 'much' : 'little';
console.log(`It's eating too ${saDogEating}`);

// 3.
const ownersEatTooMuch = dogs
.filter(dog => dog.curFood > dog.recFood)
.flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
.reduce((arr, dog) => {
  if (dog.curFood < dog.recFood) arr.push(dog.owners);
  return arr;
}, [])
.flat();

const ownersEat = { ownersEatTooMuch, ownersEatTooLittle };
console.log(ownersEat);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
const exactlyEatDog = dogs.some(dog => dog.curFood === dog.recFood);
console.log(exactlyEatDog);

// 6.
const recFoodArea = dog =>
  dog.curFood >= dog.recFood * 0.9 && dog.curFood <= dog.recFood * 1.1;

const okayEatDog = dogs.some(recFoodArea);
console.log(okayEatDog);

// 7.
const okayDogs = dogs.filter(recFoodArea);
console.log(okayDogs);

// 8.
const sortDogs = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(sortDogs);

// Base 10 number(10진수) : 0 ~ 9
// Binary base 2(2진수) : 0 1
// Conversion : + 를 사용한 문자열 -> 숫자 변환
console.log(Number('23') === +'23'); // true

// Parsing
// 두 번째 인수로 RegEx(Regular Expression)을 받음
// -> 10(Base 10 number)을 입력해주면 오류 방지 가능
// 1. parseInt : 숫자(정수)로 변환
// 2. parseFloat : 숫자(실수)로 변환
console.log(Number.parseInt('30px', 10)); // 문자가 숫자부터 시작해야 작동함 (2진수를 입력하면 NaN)
console.log(Number.parseInt('e23', 10)); // NaN 문자부터 시작하면 작동 안함
console.log(Number.parseInt('2.5rem')); // 2
console.log(Number.parseFloat('2.5rem')); // 2.5
// parse 전역함수 앞에 Number를 붙여줌으로서, 메서드로서 사용하면 네임스페이스(여러가지 함수를 저장해 놓는 공간)라는 걸 제공해줌

// isNaN() : NaN이면 true
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(+'20X')); // true : 문자열을 숫자열로 변환하려고 하면 NaN가 반환됨

// isFinite() : 유한한 값이면 true
// 값이 진짜 Number인지 확인하기 위한 좋은 방법
// (부동 소수점 수를 작업할 경우)
// Checking if value is Number
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false

// isInteger() : 값이 정수인지 확인
console.log(Number.isInteger(20)); // true
console.log(Number.isInteger(23.0)); // false
console.log(Number.isInteger(23 / 0)); // false

// => parseFloat(), isFinite() 자주 사용

//////////////////////////////////////////////////////
// Math
console.log(Math.max(5, 18, '23px')); // NaN
console.log(Math.min(5, 18, '23px')); // NaN

// 반지름이 10px인 원의 넓이 구하기
console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 6) + 1);

// 최솟값과 최댓값 사이의 랜덤한 숫자를 얻을 수 있는 함수 
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...(max - min + min) -> min...max

console.log(randomInt(10, 20));

// Rounding integers
// trunc() : 숫자의 소수점(decimal) 부분을 제거해줌
console.log(Math.trunc(-23.3)); // -23
console.log(Math.floor(-23.3)); // -24
// floor는 음수인 경우에도 잘 작동하기 때문에 random 함수와 함께 잘 사용

// round() : 반올림
// ceil() : 올림
// floor() : 내림
// trunc() : 소수점 자름

// Rounding decimals
// toFixed(): 문자열을 반환함, 인수로 소수점 이하 개수를 받음
console.log((2.7).toFixed(0)); // '3'
console.log((2.7).toFixed(3)); // '2.700'
console.log((2.345).toFixed(2)); // '2.35'
console.log(+(2.345).toFixed(2)); // 2.35 : 숫자 변환

// Reminder Operator
// % : 나머지 값을 반환
// querySelector를 통해 Nodelist로 받아서 spread 연산자를 이용해서 일반 배열로 변환

// Ex
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'tomato';
    if (i % 3 === 0) row.style.backgroundColor = 'blue  ';
  });
});

//Numeric Separaters (숫자 구분기)
// '_'를 사용해 숫자 사이의 특정 부분에 의미를 부여할 수 있음
// ex. 287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter); // 287460000000 '_'는 무시

const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

// 3_._1415 : '.' 전후에 _를 입력하는 것은 불가
// _3.1415_ : 숫자의 시작과 끝에 입력하는 것도 불가
// 3.14__15 : _ 2개를 연달아서 입력하는 것은 불가
const PI = 3.1415;
console.log(PI);

// 유의해야 하는 상황
console.log(Number('230_000')); // NaN
console.log(parseInt('230_000')); // 230

// 숫자는 내적으로 64bit로 표현됨
// Javascript에서 안전하게 표현 가능한 최대 정수
console.log(2 ** 53 - 1); // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

// BigInt : 원하는 만큼 숫자를 저장할 수 있게 해줌
// : 숫자 마지막에 n을 적어서 BigInt로 사용할 수 있게 함
console.log(13534863165453135797134561n);
console.log(BigInt(13534863165453135797134561)); // 여기서는 n 제거

// Operations
// 1. 일반 숫자와 BigInt를 연산하는 것은 불가
// 2. Math 연산자를 사용하는 것도 불가
console.log(13456135794n * 100000n);

const huge = 15154352321389179812n;
const num1 = 23;
const num2 = 23n;
// console.log(huge * num1); // Error
console.log(huge * num2);

// Exceptions (예외)
console.log(20n > 15); // true
console.log(20n === 20); // false
console.log(typeof 20n); // bigint
console.log(20n == 20); // true
console.log(huge + 'is REALLY big!!!');

// Devisions
console.log(10n / 3n); // 3n
console.log(10 / 3); // 3.33333

// Create a date
const now = new Date();
console.log(now);

// Month는 0부터 시작
// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); // ISO(International Organization for Standardization, 국제표준화기구)
console.log(future.getTime());
console.log(new Date(2142224580000));
// 현재의 타임스탬프 얻기
console.log(Date.now());
future.setFullYear(2040);
console.log(future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const day1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(day1);

const num = 3554648.45;

const options = {
  style: 'currency', // unit, percent, currency
  // unit: 'mile-per-hour',
  // unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false, // ,(구분자)가 사라짐
};

console.log(
  `${navigator.language} : ${new Intl.NumberFormat('ko-KR', options).format(
    num
  )}`
);

// setTimeout
const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => {
    console.log(`Here is your PIZZA with ${ing1} and ${ing2}`);
  },
  3000,
  ...ingredients // = 'olives', 'spinach'
);

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);

*/
