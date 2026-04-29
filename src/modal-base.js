export function createModal(dialogId, closeButtonId) {
  const dialog = document.getElementById(dialogId);

  function open() {
    dialog.showModal();
  }

  function close() {
    dialog.close();
  }

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });

  document.getElementById(closeButtonId).addEventListener('click', close);

  return {
    open,
    close,
    isOpen: () => dialog.open,
  };
}
