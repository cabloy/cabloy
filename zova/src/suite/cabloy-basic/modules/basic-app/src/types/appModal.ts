import type { VNode } from 'vue';
import type { IIconRecord } from 'zova-module-a-icon';

import type { ServiceAppModal } from '../service/appModal.js';

export type ModalType = 'alert' | 'confirm' | 'prompt' | 'dialog';
export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface IModalBaseOptions {
  maxWidth?: number | string;
  maxHeight?: number | string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export interface IModalDialogOptions extends IModalBaseOptions {
  showCloseButton?: boolean;
}

export interface IModalMessageOptions extends IModalBaseOptions {}

export interface IModalDialogRenderContext {
  id: number;
  close: () => void;
}

export interface IModalDialogRenderOptions {
  icon?: keyof IIconRecord;
  title?: string;
  slotDefault?: (dialog: IModalDialogRenderContext) => VNode;
  slotActions?: (dialog: IModalDialogRenderContext) => VNode;
  onClose?: () => void;
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
  options?:
    | IModalAlertOptions
    | IModalConfirmOptionsInner
    | IModalPromptOptionsInner
    | IModalDialogRenderOptions;
  dialogOptions?: IModalDialogOptions | IModalMessageOptions;
}

declare module 'zova' {
  export interface BeanBase {
    $appModal: ServiceAppModal;
  }
}
