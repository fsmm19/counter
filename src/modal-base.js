export function createModal(dialogId, closeButtonId) {
  const dialog = document.getElementById(dialogId);

  function open() {
    dialog.showModal();
  }

  function close() {
    dialog.close();
  }

  let mouseDownOnOverlay = false;

  dialog.addEventListener('mousedown', (e) => {
    mouseDownOnOverlay = e.target === dialog;
  });

  dialog.addEventListener('mouseup', (e) => {
    if (mouseDownOnOverlay && e.target === dialog) close();
    mouseDownOnOverlay = false;
  });

  document.getElementById(closeButtonId).addEventListener('click', close);

  return {
    open,
    close,
    isOpen: () => dialog.open,
  };
}
