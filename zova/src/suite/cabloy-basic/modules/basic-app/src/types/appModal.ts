import type {
  NavigationFailure,
  RouteLocationNormalizedLoadedGeneric,
  RouteLocationRaw,
} from '@cabloy/vue-router';
import type { VNode } from 'vue';
import type { IIconRecord } from 'zova-module-a-icon';
import type { BeanRouter } from 'zova-module-a-router';

import type { AppModalItem } from '../lib/appModalItem.js';
import type { ServiceAppModal } from '../service/appModal.js';

export type ModalType = 'alert' | 'confirm' | 'prompt' | 'dialog' | 'routedDialog';
export type ModalCloseReason = 'api' | 'backdrop' | 'escape' | 'button' | 'error' | 'unmount';
export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type ModalWidth = number | string;

/**
 * Mobile-first maximum-width values for routed dialogs.
 *
 * `md` and `lg` use the Cabloy Basic Tailwind breakpoints. Omitted values
 * inherit the last applicable lower breakpoint through the CSS cascade.
 */
export interface IModalResponsiveMaxWidth {
  default?: ModalWidth;
  md?: ModalWidth;
  lg?: ModalWidth;
}

export interface IModalResponsiveTopGutter {
  default?: ModalWidth;
  md?: ModalWidth;
  lg?: ModalWidth;
}

export type ModalRoutedDialogMaxWidth = ModalWidth | IModalResponsiveMaxWidth;
export type ModalRoutedDialogTopGutter = ModalWidth | IModalResponsiveTopGutter;

export interface IModalBaseOptions {
  maxWidth?: ModalWidth;
  maxHeight?: ModalWidth;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export interface IModalDialogOptions extends IModalBaseOptions {
  showCloseButton?: boolean;
}

export interface IModalMessageOptions extends IModalBaseOptions {}

export interface IModalRoutedDialogPresentationOptions extends Omit<
  IModalDialogOptions,
  'maxWidth'
> {
  maxWidth?: ModalRoutedDialogMaxWidth;
  topGutter?: ModalRoutedDialogTopGutter;
  showBackButton?: boolean;
}

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

export interface IModalRoutedDialogOptions extends IModalRoutedDialogPresentationOptions {
  route: RouteLocationRaw;
  icon?: keyof IIconRecord;
  title?: string;
  props?: Record<string, unknown>;
  onClose?: () => void;
}

export interface IModalRoutedDialogState {
  status: 'loading' | 'ready' | 'error' | 'closed';
  closed?: boolean;
  error?: unknown;
  router?: BeanRouter;
  currentRoute?: RouteLocationNormalizedLoadedGeneric;
  canGoBack: boolean;
  ready: Promise<void>;
}

export type IModalRoutedDialogInput = Omit<IModalRoutedDialogOptions, 'route'>;

export interface IModalRoutedDialogNavigate {
  navigate(to: RouteLocationRaw, replace?: boolean): Promise<NavigationFailure | void | undefined>;
}

export interface IModalRoutedDialogItem {
  id: number;
  type: 'routedDialog';
  options: IModalRoutedDialogOptions;
  dialogOptions?: IModalRoutedDialogPresentationOptions;
  state: IModalRoutedDialogState;
}

export interface IRoutedDialogHandle extends AppModalItem {
  readonly ready: Promise<void>;
  push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;
  replace(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;
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

export type IModalItem =
  | {
      id: number;
      type: 'alert' | 'confirm' | 'prompt' | 'dialog';
      options?:
        | IModalAlertOptions
        | IModalConfirmOptionsInner
        | IModalPromptOptionsInner
        | IModalDialogRenderOptions;
      dialogOptions?: IModalDialogOptions | IModalMessageOptions;
    }
  | IModalRoutedDialogItem;

declare module 'zova' {
  export interface BeanBase {
    $appModal: ServiceAppModal;
  }
}
