const modal = document.getElementById('modal-settings');
const form = document.getElementById('form-settings');
const inputCount = document.getElementById('input-count');
const inputStep = document.getElementById('input-step');

export function isModalOpen() {
  return modal.open;
}

function open(count, step) {
  inputCount.value = count;
  inputStep.value = step;
  modal.showModal();
  inputCount.select();
}

function close() {
  modal.close();
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) close();
});

document.getElementById('btn-modal-close').addEventListener('click', close);
document.getElementById('btn-modal-cancel').addEventListener('click', close);

export function initSettingsModal({ getState, onApply }) {
  document.getElementById('btn-settings').addEventListener('click', () => {
    const { count, step } = getState();
    open(count, step);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const count = parseInt(inputCount.value, 10);
    const step = parseInt(inputStep.value, 10);

    if (!isNaN(count) && !isNaN(step) && step >= 1) {
      onApply({ count, step });
      close();
    }
  });
}
