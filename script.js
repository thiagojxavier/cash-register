let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
const displayChangeDue = document.getElementById('change-due');
const cash = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const priceScreen = document.getElementById('total');
const form = document.getElementById('form');
const divisionDrawer = document.querySelectorAll('.drawer-divisions > div');
const drawerHandle = document.getElementById('drawer-handle');
const insideTheDrawer = document.getElementById('inside-the-drawer');
const backgroundDark = document.getElementById('background-dark');
const dialog = document.getElementById('dialog');
const userChosenValuesInput = document.querySelectorAll('.valueChosenByTheUser')
const modalForm = document.getElementById('modal-form');

modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const denominationsClone = [...denominations].reverse();

  userChosenValuesInput.forEach((inputValue, index) => {
    if(!inputValue.value) return

    if(index === 0) {
       price = Number(inputValue.value);
       return
    }

    const newValueInCashRegister = (denominationsClone[index - 1] * Number(inputValue.value)).toFixed(2);

    cid[index - 1][1] = Number(newValueInCashRegister);
  });

  backgroundDark.classList.remove('active');
  dialog.classList.remove('active');
  showResultBuy(price);
});

cash.focus();

const formatResults = (status, change) => {
  displayChangeDue.innerHTML = `<p><span>Status:</span> ${status}</p>`;
  change.map(
    money => (displayChangeDue.innerHTML += `<p><span>${money[0]}:</span> $${money[1]}</p>`)
  );
  return;
};

const checkCashRegister = () => {
  if (Number(cash.value) < price) {
    alert('Customer does not have enough money to purchase the item');
    cash.value = '';
    return;
  }

  if (Number(cash.value) === price) {
    displayChangeDue.innerHTML =
      '<p>No change due - customer paid with exact cash</p>';
    cash.value = '';
    return;
  }

  let changeDue = Number(cash.value) - price;
  let reversedCid = [...cid].reverse();
  let result = { status: 'OPEN', change: [] };
  let totalCID = parseFloat(
    cid
      .map(total => total[1])
      .reduce((prev, curr) => prev + curr)
  );

  if (totalCID < changeDue) {
    return (displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
  }

  if (totalCID === changeDue) {
    result.status = 'CLOSED';
  }

  for (let i = 0; i <= reversedCid.length; i++) {
    if (changeDue > denominations[i] && changeDue > 0) {
      let count = 0;
      let total = reversedCid[i][1];
      while (total > 0 && changeDue >= denominations[i]) {
        total -= denominations[i];
        changeDue = parseFloat((changeDue -= denominations[i]).toFixed(2));
        count++;
      }
      if (count > 0) {
        result.change.push([reversedCid[i][0], count * denominations[i]]);
      }
    }
  }
  if (changeDue > 0) {
    return (displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
  }

  formatResults(result.status, result.change);
  updateUI(result.change);
};

const checkResults = (event) => {
  event.preventDefault();

  if (!cash.value) {
    return;
  }
  checkCashRegister();
};

const updateUI = change => {

  if (change) {
    change.forEach(changeArr => {
      const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
  }

  cash.value = '';
  showResultBuy(price);

};

const openOrClose = () => {
  cid.forEach((item, index) => {
    divisionDrawer[index].innerHTML = `<h2>${item[0]}</h2>
    <p>${item[1]}</p>`
  })
  insideTheDrawer.classList.toggle('active');
}

const showResultBuy = value => {
  priceScreen.textContent = `$${value}`;
}

updateUI();

drawerHandle.addEventListener('click', openOrClose);

window.addEventListener('load', () => {
  backgroundDark.classList.add('active');
  dialog.classList.add('active');
});

userChosenValuesInput.forEach(item => {
  item.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
});

form.addEventListener('submit', checkResults);

cash.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    checkResults();
  }
});