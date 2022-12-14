'use strict';

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
    '2022-10-23T17:01:17.194Z',
    '2022-10-25T23:36:17.929Z',
    '2022-10-28T10:51:36.790Z',
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
    '2018-12-23T07:42:02.383Z',
    '2020-10-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-10-23T17:01:17.194Z',
    '2022-10-28T23:36:17.929Z',
    '2022-10-29T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

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

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) {
    return `Today`;
  } else if (daysPassed === 1) {
    return `Yesterday`;
  } else if (daysPassed <= 7) {
    return `${daysPassed} days`;
  } else {
    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const day = date.getDate();

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//to format currency
const formartCur = (value, locale, currency) => {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

// to populate the movements section
const displayMovements = (acc, sort = false) => {
  //remove the initial data from the html
  containerMovements.innerHTML = '';
  /*
  determine the movement to use in populating the account depending 
  whether the movement array is sorted or not
  */
  const sortedMov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  //display each movement on the UI
  sortedMov.forEach((mov, i) => {
    //check if movement is greater than zero
    const depositType = mov > 0 ? `deposit` : `withdrawal`;
    //create date for each movement
    const date = new Date(acc.movementsDates[i]);

    //passing in date and locale from the currentAccount movements
    const displayDate = formatMovementDate(date, acc.locale);
    
    //format each movement in the to be displayed according to account locale
    const formattedMov = formartCur(mov, acc.locale, acc.currency);

    // create html for each movement
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${depositType}">${
      i + 1
    } ${depositType}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;
    // insert the created movement on top of the last one
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calDisplayBalSum = current => {
  //calculate the sum of deposit money
  const income = current.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  //fomart income
  const totalIncome = formartCur(income, current.locale, current.currency);
  labelSumIn.textContent = totalIncome;

  //calculate the sum of outgoing money
  const outgoing = current.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // for,mat the outgoing money
  const totalOutgoing = formartCur(
    Math.abs(outgoing),
    current.locale,
    current.currency
  );
  labelSumOut.textContent = totalOutgoing;

  //calculate the sum of interest
  const interest = current.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + (mov * current.interestRate) / 100, 0);

  //format interest
  const totalInterest = formartCur(interest, current.locale, current.currency);
  labelSumInterest.textContent = totalInterest;

  //calculate and display the balance
  current.balance = current.movements.reduce((acc, mov) => acc + mov, 0);
  const totalBalace = current.balance + interest;

  const formatedBalace = formartCur(
    totalBalace,
    current.locale,
    current.currency
  );
  labelBalance.textContent = formatedBalace;
};

//creating username in each accounts
const createUsername = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};
createUsername(accounts);

//handling the update of the UI

const updateUI = accs => {
  //display movement of each account
  displayMovements(accs);

  //calculate balance and sumarry for each account
  calDisplayBalSum(accs);
};

//to handle the logout timer
const setLogoutTimer = () => {
  //set the total time in seconds
  let time = 300;

  // the call back function for the interval call
  const tick = () => {
    //get the minute by dividing by 60
    let minute = `${Math.trunc(time / 60)}`.padStart(2, 0);
    //get the seconds by using the remainder
    let seconds = `${Math.trunc(time % 60)}`.padStart(2, 0);
    //display the minute and second
    labelTimer.textContent = `${minute}:${seconds}`;

    if (time === 0) {
      //clear timer
      clearInterval(timer);
      //hide UI
      containerApp.style.opacity = 0;
      //change welcome message
      labelWelcome.textContent = `Log in to get started`;
    }

    //decrease the time
    time--;
  };
  tick(); //to call the setInterval function immeaidate the user logged in
  const timer = setInterval(tick, 1000); //handling after each second
  //export to global function to allow clearing of timeout on each new logging
  return timer;
};

/////////////////////////////////////////////////////////////

//handle log in for the current account
let currentAccount, timer;

//to clear and set timer
const setClearTimer = () => {
  clearInterval(timer); //clear timer is there is one going on
  timer = setLogoutTimer(); // set timer
};

const logInUser = e => {
  e.preventDefault();
  //find the current account that was logged in
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    } 😀`;

    //setting up the date of logged in
    const now = new Date();

    /*
    const day = `${now.getDate()}`.padStart(2, '0');
    const month = `${now.getMonth() + 1}`;
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, '0');
    const mins = `${now.getMinutes()}`.padStart(2, '0');
    */
    // const locale = navigator.language;

    const option = {
      minute: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    //display UI
    containerApp.style.opacity = 100;

    //update UI
    updateUI(currentAccount);

    setClearTimer();

    //clear the input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
};
btnLogin.addEventListener('click', logInUser);

//handle transfer of money

const transfer = e => {
  e.preventDefault();
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  if (
    amount > 0 &&
    currentAccount.balance > amount &&
    recieverAccount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    //add negative amount to the current account
    currentAccount.movements.push(-amount);
    //add positve amount to the receiver account
    recieverAccount.movements.push(amount);
    //add the date of withdrawal to the currentAccount movement date array
    currentAccount.movementsDates.push(new Date().toISOString());
    //add the date of credit to the recieverAccount movement date array
    recieverAccount.movementsDates.push(new Date().toISOString());
    //update UI
    updateUI(currentAccount);
  }
  //clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  //reset timeout
  setClearTimer()
};
btnTransfer.addEventListener('click', transfer);

//handle loan request
const requestLoan = e => {
  e.preventDefault();
  //get the value of the input field
  const amount = Number(inputLoanAmount.value);
  //check if any of the prior deposits meets the condition (> amount * 0.2)
  const que = currentAccount.movements.some(mov => mov > amount * 0.2);
  //if the condition was met
  if (que && amount > 0) {
    setTimeout(() => {
      //add the requested amount to the currentAccount movement array
      currentAccount.movements.push(amount);
      //add the date of request to the currentAccount movement date array
      currentAccount.movementsDates.push(new Date().toISOString());

      //update the UI to display the added value
      updateUI(currentAccount);
    }, 3000);
  }
  //clear the input field
  inputLoanAmount.value = '';
  //reset the timer
  setClearTimer()
};
btnLoan.addEventListener('click', requestLoan);

//handle close of account
const closeAccount = e => {
  e.preventDefault();

  //check if the current account credentials to be close are correct
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //get the position of the current account in the array of accounts
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //remove the current account from the list of the account array
    accounts.splice(index, 1);
    //hide the UI
    containerApp.style.opacity = 0;
    //change back the welcome message
    labelWelcome.textContent = `Log in to get started`;
  }

  inputCloseUsername.value = inputClosePin.value = '';
};
btnClose.addEventListener('click', closeAccount);

//to complete the sorting function
let sorted = false; //handle the state function of sort

const sortFunction = () => {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
};
btnSort.addEventListener('click', sortFunction);
