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
  max: null,
  min: null,
};

const btnIncrement = document.getElementById('btn-increment');
const btnDecrement = document.getElementById('btn-decrement');
const btnReset = document.getElementById('btn-reset');
const counterDisplay = document.getElementById('counter-display');
const screenFlashEl = document.getElementById('screen-flash');
const outOfRangeBadge = document.getElementById('out-of-range-badge');
const outOfRangeDelta = outOfRangeBadge.querySelector('.out-of-range-badge__delta');

renderCounter(state.count);

function renderCounter(value) {
  counterDisplay.innerText = value;
}

function flashScreen() {
  screenFlashEl.classList.remove('screen-flash--active');
  void screenFlashEl.offsetWidth;
  screenFlashEl.classList.add('screen-flash--active');
  screenFlashEl.addEventListener(
    'animationend',
    () => screenFlashEl.classList.remove('screen-flash--active'),
    { once: true },
  );
}

function isOutOfRange(count) {
  return (state.max !== null && count > state.max) || (state.min !== null && count < state.min);
}

function distanceFromRange(count) {
  if (state.max !== null && count > state.max) return count - state.max;
  if (state.min !== null && count < state.min) return state.min - count;
  return 0;
}

function updateOutOfRangeBadge() {
  if (state.max !== null && state.count > state.max) {
    outOfRangeDelta.textContent = `+${state.count - state.max}`;
    outOfRangeBadge.classList.add('out-of-range-badge--visible');
  } else if (state.min !== null && state.count < state.min) {
    outOfRangeDelta.textContent = `${state.count - state.min}`;
    outOfRangeBadge.classList.add('out-of-range-badge--visible');
  } else {
    outOfRangeBadge.classList.remove('out-of-range-badge--visible');
  }
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
      updateOutOfRangeBadge();
    });
  }

  const prevCount = state.count;
  state.count = nextCount;
  renderCounter(state.count);
  const nowOutOfRange = isOutOfRange(state.count);

  if (nowOutOfRange && distanceFromRange(state.count) > distanceFromRange(prevCount)) {
    flashScreen();
  }

  updateOutOfRangeBadge();
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
  if (!btn.disabled) {
    btn.classList.add('btn--pressing');
    setTimeout(() => btn.classList.remove('btn--pressing'), 100);
  }
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
  getState: () => ({
    count: state.count,
    step: state.step,
    min: state.min,
    max: state.max,
  }),
  onApply: ({ count, step, min, max }) => {
    state.count = count;
    state.step = step;
    state.min = min;
    state.max = max;
    renderCounter(state.count);
    updateOutOfRangeBadge();
  },
});
