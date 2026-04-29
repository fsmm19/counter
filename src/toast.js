let activeToast = null;
let timeoutId = null;

const DURATION = 4000;

export function showUndoToast(onUndo) {
  dismissToast(false);

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="toast__message">Contador reseteado</span>
    <button class="toast__undo">Deshacer</button>
    <div class="toast__progress"></div>
  `;

  document.body.appendChild(toast);
  activeToast = toast;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
  });

  toast.querySelector('.toast__undo').addEventListener('click', () => {
    onUndo();
    dismissToast(true);
  });

  timeoutId = setTimeout(() => dismissToast(false), DURATION);
}

function dismissToast(immediate) {
  if (!activeToast) return;
  clearTimeout(timeoutId);
  const toastElement = activeToast;
  activeToast = null;

  if (immediate) {
    toastElement.remove();
    return;
  }

  toastElement.classList.remove('toast--visible');
  toastElement.addEventListener('transitionend', () => toastElement.remove(), {
    once: true,
  });
}
