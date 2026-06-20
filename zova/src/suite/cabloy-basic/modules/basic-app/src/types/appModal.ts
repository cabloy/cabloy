import type { IIconRecord } from 'zova-module-a-icon';

import type { ServiceAppModal } from '../service/appModal.js';

export type ModalType = 'alert' | 'confirm' | 'prompt';
export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface IModalDialogOptions {
  maxWidth?: number | string;
  closeOnBackdrop?: boolean;
}

export interface IModalAlertOptions {
  type?: AlertType;
  icon?: keyof IIconRecord;
  title?: string;
  text?: string;
}

export interface IModalConfirmOptions {
  icon?: keyof IIconRecord;
  title?: string;
  text?: string;
}

export interface IModalConfirmOptionsInner extends IModalConfirmOptions {
  onCallback?: (yes: boolean) => void;
}

export interface IModalPromptOptions {
  icon?: keyof IIconRecord;
  title?: string;
  text?: string;
  defaultValue?: string;
}

export interface IModalPromptOptionsInner extends IModalPromptOptions {
  onCallback?: (res: string | undefined) => void;
}

export interface IModalItem {
  id: number;
  type: ModalType;
  options?: IModalAlertOptions | IModalConfirmOptionsInner | IModalPromptOptionsInner;
  dialogOptions?: IModalDialogOptions;
}

declare module 'zova' {
  export interface BeanBase {
    $appModal: ServiceAppModal;
  }
}
