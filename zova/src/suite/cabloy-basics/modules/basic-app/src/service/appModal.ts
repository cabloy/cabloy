import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';

import { AppModalItem } from '../lib/appModalItem.js';
import {
  IModalAlertOptions,
  IModalConfirmOptions,
  IModalDialogOptions,
  IModalItem,
  IModalPromptOptions,
} from '../types/appModal.js';

@Service()
export class ServiceAppModal extends BeanBase {
  public modalItems: IModalItem[] = [];
  private modalItemIdCounter: number = 0;

  protected async __init__() {}

  private newModalItemId() {
    return ++this.modalItemIdCounter;
  }

  public alert(options?: IModalAlertOptions, dialogOptions?: IModalDialogOptions) {
    const id = this.newModalItemId();
    const modalItem: IModalItem = {
      id,
      type: 'alert',
      options,
      dialogOptions,
    };
    this.modalItems.push(modalItem);
    return new AppModalItem(this, modalItem);
  }

  public confirm(
    options?: IModalConfirmOptions,
    dialogOptions?: IModalDialogOptions,
  ): Promise<boolean> {
    return new Promise(resolve => {
      const id = this.newModalItemId();
      const modalItem: IModalItem = {
        id,
        type: 'confirm',
        options: {
          ...options,
          onCallback: (yes: boolean) => {
            return resolve(yes);
          },
        },
        dialogOptions,
      };
      this.modalItems.push(modalItem);
    });
  }

  public prompt(
    options?: IModalPromptOptions,
    dialogOptions?: IModalDialogOptions,
  ): Promise<string | undefined> {
    return new Promise(resolve => {
      const id = this.newModalItemId();
      const modalItem: IModalItem = {
        id,
        type: 'prompt',
        options: {
          ...options,
          onCallback: (res: string | undefined) => {
            return resolve(res);
          },
        },
        dialogOptions,
      };
      this.modalItems.push(modalItem);
    });
  }

  public close(id: number) {
    const [index] = this.findModalItem(id);
    if (index === -1) return;
    this.modalItems.splice(index, 1);
  }

  protected findModalItem(id: number): [number, IModalItem | undefined] {
    const index = this.modalItems.findIndex(item => item.id === id);
    if (index === -1) return [index, undefined];
    return [index, this.modalItems[index]];
  }
}
