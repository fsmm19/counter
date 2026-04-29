import './theme.js';
import { increment, decrement, reset } from './counter.js';
import { showUndoToast } from './toast.js';

const state = {
  count: 0,
  previousCount: 0,
};

const btnIncrement = document.getElementById('btn-increment');
const btnDecrement = document.getElementById('btn-decrement');
const btnReset = document.getElementById('btn-reset');

renderCounter(state.count);

function renderCounter(value) {
  document.getElementById('counter-display').innerText = value;
}

function updateCounter(operation) {
  if (operation === reset) {
    state.previousCount = state.count;

    showUndoToast(() => {
      state.count = state.previousCount;
      renderCounter(state.count);
    });
  }

  state.count = operation(state.count);
  renderCounter(state.count);
}

btnIncrement.addEventListener('click', () => {
  updateCounter(increment);
});

btnDecrement.addEventListener('click', () => {
  updateCounter(decrement);
});

btnReset.addEventListener('click', () => {
  updateCounter(reset);
});

function pressButton(btn, operation) {
  updateCounter(operation);
  btn.classList.add('btn--pressing');
  setTimeout(() => btn.classList.remove('btn--pressing'), 100);
}

document.addEventListener('keydown', (e) => {
  if (e.key === '+' || e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    pressButton(btnIncrement, increment);
  } else if (e.key === '-' || e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    pressButton(btnDecrement, decrement);
  }
});
