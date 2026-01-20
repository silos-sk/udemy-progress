'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2026-01-17T17:01:17.194Z',
    '2026-01-19T23:36:17.929Z',
    '2026-01-20T10:51:36.790Z',
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

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
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
// Functions

const formatMovementDate = function(date) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  console.log(daysPassed);

  if (daysPassed === 0 ) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov, 
    movementDate: acc.movementsDates.at(i)
  }))

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  // const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  combinedMovsDates.forEach(function (obj, i) {
    const {movement, movementDate} = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    
    const date = new Date(movementDate);

    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
         <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;



btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0); // 2 characters, start with 0
    const month = `${now.getMonth() + 1}`.padStart(2, 0); // 0 based
    const year = now.getFullYear(); // always use this, not getYear
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    
    // day/month/year
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

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
  // displayMovements(currentAccount.movements, !sorted);

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// 181 :: CONVERTING AND CHECKING NUMBERS

// console.log(23 === 23.0);

// BASE 10 - 0 to 9 1/10 = 0.1
// Binary base 2 - 0 1

// console.log(0.1 + 0.2);

// // Conversion
// console.log(Number('23'));
// console.log(+'23'); // shorthand of Number()

// // Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23', 10));
// console.log(Number.parseInt('2.5rem'));
// console.log(Number.parseFloat('   2.5rem    '));

// // console.log(parseFloat('   2.5rem'));

// // Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23/0));

// // Best way - checking if value is a real number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(23/0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

// // 182 :: MATH AND ROUNDING

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, '23', 11, 2));
// console.log(Math.max(5, 18, '23px', 11, 2));

// console.log(Math.min(5, 18, 23, 11, 2));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) => Math.floor(Math.random() * (max-min + 1)) + min;
// // 0...1 -> 0...(max - min) -> min ... max

// console.log('random int');
// console.log(randomInt(9, 20));
// console.log(randomInt(0, 3));

// // Rounding integers
// console.log('trunc') // removes decimal pt ->
// console.log(Math.trunc(23.3));
// console.log(Math.trunc(23.9));

// console.log('round')
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log('ceil')
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log('floor')
// console.log(Math.floor(23.3));
// console.log(Math.floor('23.9'));

// console.log('trunc-floor')
// console.log(Math.trunc(23.3));
// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));

// // Rounding decimals
// console.log((2.7.toFixed(0))); // always return a STRING
// console.log((2.7.toFixed(3))); // decimal pts
// console.log((2.7.toFixed(2))); 
// console.log(+(2.345.toFixed(3))); 

// % 183 :: THE REMAINDER OPERATOR

// console.log(5 % 2);
// console.log(5 / 2); // 5 = 2 * 2 + 1

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));

// labelBalance.addEventListener('click', function(){
//   [...document.querySelectorAll('.movements__row')]
//   .forEach(function (row, i){
//     // 0, 2, 4, 6
//   if (i % 2 === 0) row.style.backgroundcolor = 'orangered';
//    // 0, 3, 6, 9
//   if (i % 3 === 0) row.style.backgroundcolor = 'blue'
// });
// });

// 184 :: NUMERIC SEPARATORS

// const diameter = 287_460_000_000;
// console.log(diameter);

// const priceCents = 354_99;
// console.log(priceCents);

// const transferFee = 15_00;
// const transferFee2 = 1_500;

// // can place underscore between numbers, not in beginning/end, next to each other, or in a string
// const PI = 3.1415
// console.log(PI);

// console.log(Number('230_000')); // NaN
// console.log(parseInt('230_000')); // displays 230 (the rest is ignored)

// 185 WORKING WITH BIGINT

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);

// console.log(3456567457788679679768767455352352n); // 'n' at the end transforms it into big int

// console.log(BigInt(3456567457));

// // Operations
// console.log(10000n + 10000n);
// console.log(2345346456765848747456364373886n * 2389794352789453320745394n);
// // console.log(Math.sqrt(16n)); // do not work

// const huge = 23449503748979750n;
// const num = 23;
// // console.log(huge * num) // Cannot mix big int and other types
// console.log(huge * BigInt(num)); // work

// // EXCEPTIONS
// console.log(20n > 15); // true
// console.log(20n === 20); // false
// console.log(typeof 20n); // bigint
// console.log(20n == 20); // true - type coercion

// // STRING CONCATENATION
// console.log(huge + ' is REALLY big!!!') // converted to string

// // DIVISIONS
// console.log(10n / 3n); // 3n
// console.log(10 / 3); // 3.3333
// console.log(11n / 3n); //3n

// 186 :: CREATING DATES

// Create a date
// const now = new Date();
// console.log(now);

// console.log(new Date('Aug 02, 2020 18:05:41'));
// console.log(new Date('december 24, 2015'));

// console.log(new Date(account1.movementsDates[0]));

// console.log(account1);

// console.log(new Date (2037, 10, 19, 15, 23, 5));
// console.log(new Date (2037, 10, 33));

// console.log(new Date(0))
// console.log(new Date(3 * 24 * 60 * 60 * 1000))

// Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142256980000));

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

// 189 :: Operations wih Dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calcDaysPassed(new Date(2037, 4, 4), new Date(2037, 4, 14));

// console.log(days1);