import './theme.js';
import { increment, decrement, reset } from './counter.js';
import { showUndoToast, showLimitReachedToast } from './toast.js';
import { initSettingsModal, isModalOpen } from './modal-settings.js';
import { initInfoModal, isInfoModalOpen } from './modal-info.js';

const MAX_COUNT = 9999;
const MIN_COUNT = -9999;

const state = {
  count: 0,
  previousCount: 0,
  step: 1,
};

const btnIncrement = document.getElementById('btn-increment');
const btnDecrement = document.getElementById('btn-decrement');
const btnReset = document.getElementById('btn-reset');

renderCounter(state.count);

function renderCounter(value) {
  document.getElementById('counter-display').innerText = value;
}

function updateCounter(operation) {
  const nextCount = operation(state.count, state.step);

  if (nextCount > MAX_COUNT) {
    showLimitReachedToast('max');
    return;
  }

  if (nextCount < MIN_COUNT) {
    showLimitReachedToast('min');
    return;
  }

  if (operation === reset) {
    state.previousCount = state.count;

    showUndoToast(() => {
      state.count = state.previousCount;
      renderCounter(state.count);
    });
  }

  state.count = nextCount;
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
  if (!isModalOpen() && !isInfoModalOpen()) {
    if (e.key === '+' || e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      pressButton(btnIncrement, increment);
    } else if (
      e.key === '-' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowDown'
    ) {
      pressButton(btnDecrement, decrement);
    }
  }
});

initInfoModal();

initSettingsModal({
  getState: () => ({ count: state.count, step: state.step }),
  onApply: ({ count, step }) => {
    state.count = count;
    state.step = step;
    renderCounter(state.count);
  },
});
