import { createModal } from './modal-base.js';

const inputCount = document.getElementById('input-count');
const inputStep = document.getElementById('input-step');
const errorCount = document.getElementById('error-count');
const errorStep = document.getElementById('error-step');

const { open: openDialog, close, isOpen } = createModal('modal-settings', 'btn-modal-close');

export function isModalOpen() {
  return isOpen();
}

function open(count, step) {
  inputCount.value = count;
  inputStep.value = step;
  clearErrors();
  openDialog();
  inputCount.select();
}

function setError(input, errorElement, message) {
  input.classList.toggle('modal__input--invalid', !!message);
  errorElement.textContent = message;
  if (message) shake(input);
}

function clearErrors() {
  setError(inputCount, errorCount, '');
  setError(inputStep, errorStep, '');
}

function shake(input) {
  input.classList.remove('modal__input--shake');
  void input.offsetWidth;
  input.classList.add('modal__input--shake');
  input.addEventListener(
    'animationend',
    () => input.classList.remove('modal__input--shake'),
    { once: true },
  );
}

function validateCount(value) {
  if (value === '') return 'Ingresa un valor';
  const num = parseInt(value, 10);
  if (isNaN(num)) return 'Ingresa un número válido';
  if (num < -9999 || num > 9999)
    return 'El valor debe estar entre -9999 y 9999';
  return '';
}

function validateStep(value) {
  if (value === '') return 'Ingresa un intervalo';
  const num = parseInt(value, 10);
  if (isNaN(num)) return 'Ingresa un número válido';
  if (num < 1) return 'El intervalo mínimo es 1';
  return '';
}

document.getElementById('btn-modal-cancel').addEventListener('click', close);

inputCount.addEventListener('input', () =>
  setError(inputCount, errorCount, ''),
);
inputStep.addEventListener('input', () => setError(inputStep, errorStep, ''));

export function initSettingsModal({ getState, onApply }) {
  document.getElementById('btn-settings').addEventListener('click', () => {
    const { count, step } = getState();
    open(count, step);
  });

  document.getElementById('form-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    const countError = validateCount(inputCount.value);
    const stepError = validateStep(inputStep.value);

    setError(inputCount, errorCount, countError);
    setError(inputStep, errorStep, stepError);

    if (countError || stepError) return;

    onApply({
      count: parseInt(inputCount.value, 10),
      step: parseInt(inputStep.value, 10),
    });
    close();
  });
}
