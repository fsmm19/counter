import { createModal } from './modal-base.js';

const inputCount = document.getElementById('input-count');
const inputStep = document.getElementById('input-step');
const inputMin = document.getElementById('input-min');
const inputMax = document.getElementById('input-max');
const errorCount = document.getElementById('error-count');
const errorStep = document.getElementById('error-step');
const errorMin = document.getElementById('error-min');
const errorMax = document.getElementById('error-max');

const {
  open: openDialog,
  close,
  isOpen,
} = createModal('modal-settings', 'btn-modal-close');

export function isModalOpen() {
  return isOpen();
}

function open(count, step, min, max) {
  inputCount.value = count;
  inputStep.value = step;
  inputMin.value = min ?? '';
  inputMax.value = max ?? '';
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
  setError(inputMin, errorMin, '');
  setError(inputMax, errorMax, '');
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

function validateLimit(value) {
  if (value === '') return '';
  const num = parseInt(value, 10);
  if (isNaN(num)) return 'Ingresa un número válido';
  if (num < -9999 || num > 9999) return 'Debe estar entre -9999 y 9999';
  return '';
}

document.getElementById('btn-modal-cancel').addEventListener('click', close);

inputCount.addEventListener('input', () =>
  setError(inputCount, errorCount, ''),
);
inputStep.addEventListener('input', () => setError(inputStep, errorStep, ''));
inputMin.addEventListener('input', () => setError(inputMin, errorMin, ''));
inputMax.addEventListener('input', () => setError(inputMax, errorMax, ''));

export function initSettingsModal({ getState, onApply }) {
  document.getElementById('btn-settings').addEventListener('click', () => {
    const { count, step, min, max } = getState();
    open(count, step, min, max);
  });

  document.getElementById('form-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    const countError = validateCount(inputCount.value);
    const stepError = validateStep(inputStep.value);
    const minError = validateLimit(inputMin.value);
    let maxError = validateLimit(inputMax.value);

    if (
      !minError &&
      !maxError &&
      inputMin.value !== '' &&
      inputMax.value !== ''
    ) {
      if (parseInt(inputMin.value, 10) > parseInt(inputMax.value, 10)) {
        maxError = 'Debe ser mayor al límite mínimo';
      }
    }

    setError(inputCount, errorCount, countError);
    setError(inputStep, errorStep, stepError);
    setError(inputMin, errorMin, minError);
    setError(inputMax, errorMax, maxError);

    if (countError || stepError || minError || maxError) return;

    onApply({
      count: parseInt(inputCount.value, 10),
      step: parseInt(inputStep.value, 10),
      min: inputMin.value !== '' ? parseInt(inputMin.value, 10) : null,
      max: inputMax.value !== '' ? parseInt(inputMax.value, 10) : null,
    });
    close();
  });
}
