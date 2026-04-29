import { createModal } from './modal-base.js';

const { open, isOpen } = createModal('modal-info', 'btn-modal-info-close');

export function isInfoModalOpen() {
  return isOpen();
}

export function initInfoModal() {
  document.getElementById('btn-info').addEventListener('click', open);
}
