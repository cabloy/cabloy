import type { ServiceAppModal } from '../service/appModal.js';
import type { IModalItem } from '../types/appModal.js';

export class AppModalItem {
  private serviceAppModal: ServiceAppModal;
  private modalItem: IModalItem;

  constructor(serviceAppModal: ServiceAppModal, modalItem: IModalItem) {
    this.serviceAppModal = serviceAppModal;
    this.modalItem = modalItem;
  }

  public close() {
    this.serviceAppModal.close(this.modalItem.id);
  }
}
