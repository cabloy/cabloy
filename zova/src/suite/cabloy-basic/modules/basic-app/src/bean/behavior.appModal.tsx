import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';
import type { IIconRecord } from 'zova-module-a-icon';

import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';
import { ZIcon } from 'zova-module-a-icon';

import {
  AlertType,
  IModalAlertOptions,
  IModalConfirmOptionsInner,
  IModalDialogOptions,
  IModalDialogRenderContext,
  IModalDialogRenderOptions,
  IModalItem,
  IModalMessageOptions,
  IModalPromptOptionsInner,
  IModalResponsiveMaxWidth,
  IModalResponsiveTopGutter,
  IModalRoutedDialogItem,
  IModalRoutedDialogPresentationOptions,
  ModalRoutedDialogMaxWidth,
  ModalRoutedDialogTopGutter,
  ModalType,
  ModalWidth,
} from '../types/appModal.js';

export interface IBehaviorPropsInputAppModal {}

export interface IBehaviorPropsOutputAppModal extends IBehaviorPropsInputAppModal {}

export interface IBehaviorOptionsAppModal extends IDecoratorBehaviorOptions {}

interface IPreparedDialogOptions extends Omit<IModalDialogOptions, 'maxWidth'> {
  maxWidth?: ModalRoutedDialogMaxWidth;
  topGutter?: ModalRoutedDialogTopGutter;
  showBackButton?: boolean;
}

interface IRenderDialogBaseOptions {
  modalItem: IModalItem;
  dialogOptions: IPreparedDialogOptions;
  iconName?: keyof IIconRecord;
  title: string;
  body?: VNode;
  actions?: VNode;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBack?: () => void;
  onClose: () => void;
}

interface IModalCardPresentation {
  className?: string;
  style?: Record<string, string>;
}

interface IModalOuterPresentation {
  className?: string;
  style?: Record<string, string>;
}

const responsiveMaxWidthClass = {
  maxWidth: 'var(--zova-routed-dialog-max-width-default)',
  $nest: {
    '@media (min-width: 48rem)': {
      maxWidth:
        'var(--zova-routed-dialog-max-width-md, var(--zova-routed-dialog-max-width-default))',
    },
    '@media (min-width: 64rem)': {
      maxWidth:
        'var(--zova-routed-dialog-max-width-lg, var(--zova-routed-dialog-max-width-md, var(--zova-routed-dialog-max-width-default)))',
    },
  },
};

const responsiveTopGutterClass = {
  paddingTop: 'var(--zova-routed-dialog-top-gutter-default)',
  $nest: {
    '@media (min-width: 48rem)': {
      paddingTop:
        'var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default))',
    },
    '@media (min-width: 64rem)': {
      paddingTop:
        'var(--zova-routed-dialog-top-gutter-lg, var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default)))',
    },
  },
};

const routedDialogMaxHeightClass = {
  maxHeight:
    'min(var(--zova-routed-dialog-max-height, 100%), calc(100vh - var(--zova-routed-dialog-top-gutter-default) - 1rem))',
  $nest: {
    '@media (min-width: 48rem)': {
      maxHeight:
        'min(var(--zova-routed-dialog-max-height, 100%), calc(100vh - var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default)) - 1rem))',
    },
    '@media (min-width: 64rem)': {
      maxHeight:
        'min(var(--zova-routed-dialog-max-height, 100%), calc(100vh - var(--zova-routed-dialog-top-gutter-lg, var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default))) - 1rem))',
    },
    '@supports (height: 100dvh)': {
      maxHeight:
        'min(var(--zova-routed-dialog-max-height, 100%), calc(100dvh - var(--zova-routed-dialog-top-gutter-default) - 1rem))',
      $nest: {
        '@media (min-width: 48rem)': {
          maxHeight:
            'min(var(--zova-routed-dialog-max-height, 100%), calc(100dvh - var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default)) - 1rem))',
        },
        '@media (min-width: 64rem)': {
          maxHeight:
            'min(var(--zova-routed-dialog-max-height, 100%), calc(100dvh - var(--zova-routed-dialog-top-gutter-lg, var(--zova-routed-dialog-top-gutter-md, var(--zova-routed-dialog-top-gutter-default))) - 1rem))',
        },
      },
    },
  },
};

@Behavior<IBehaviorOptionsAppModal>()
export class BehaviorAppModal extends BeanBehaviorBase<
  IBehaviorOptionsAppModal,
  IBehaviorPropsInputAppModal,
  IBehaviorPropsOutputAppModal
> {
  private _windowKeydownHandler?: (event: KeyboardEvent) => void;

  protected async __init__() {
    if (!process.env.CLIENT) return;
    this._windowKeydownHandler = event => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      const modalItems = this.$appModal.modalItems;
      if (modalItems.length === 0) return;
      const modalItem = modalItems[modalItems.length - 1];
      if (!modalItem) return;
      const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
      if (!dialogOptions.closeOnEscape) return;
      event.preventDefault();
      event.stopPropagation();
      this._closeModalByEscape(modalItem);
    };
    window.addEventListener('keydown', this._windowKeydownHandler);
  }

  protected __dispose__() {
    if (this._windowKeydownHandler) {
      window.removeEventListener('keydown', this._windowKeydownHandler);
    }
  }

  private _closeModalByEscape(modalItem: IModalItem) {
    if (modalItem.type === 'alert') {
      this.$appModal.close(modalItem.id);
      return;
    }
    if (modalItem.type === 'confirm') {
      const options = modalItem.options as IModalConfirmOptionsInner | undefined;
      this.$appModal.close(modalItem.id);
      options?.onCallback?.(false);
      return;
    }
    if (modalItem.type === 'prompt') {
      const options = modalItem.options as IModalPromptOptionsInner | undefined;
      this.$appModal.close(modalItem.id);
      options?.onCallback?.(undefined);
      return;
    }
    this.$appModal.close(modalItem.id);
  }

  protected render(
    _props: IBehaviorPropsInputAppModal,
    next: NextBehavior<IBehaviorPropsOutputAppModal>,
  ): VNode {
    const vnodeDefault = next();
    return (
      <>
        {vnodeDefault}
        {this._renderAppModals()}
      </>
    );
  }

  private _renderAppModals() {
    if (this.$appModal.modalItems.length === 0) return;
    return <>{this.$appModal.modalItems.map(modalItem => this._renderAppModal(modalItem))}</>;
  }

  private _renderAppModal(modalItem: IModalItem) {
    if (modalItem.type === 'alert') return this._renderAppModalAlert(modalItem);
    if (modalItem.type === 'confirm') return this._renderAppModalConfirm(modalItem);
    if (modalItem.type === 'prompt') return this._renderAppModalPrompt(modalItem);
    if (modalItem.type === 'routedDialog') return this._renderAppModalRoutedDialog(modalItem);
    return this._renderAppModalDialog(modalItem);
  }

  private _renderAppModalAlert(modalItem: IModalItem) {
    const options = modalItem.options as IModalAlertOptions | undefined;
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    const type = options?.type ?? 'info';
    const iconName = options?.icon ?? this.scope.config.model.alert.icons[type];
    const title = options?.title ?? this.sys.env.APP_TITLE ?? '';
    const text = options?.text;
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName,
      title,
      body: text ? <p class="whitespace-pre-wrap leading-6">{text}</p> : undefined,
      actions: (
        <button
          type="button"
          class={this._getButtonClass(type, true)}
          onClick={() => {
            this.$appModal.close(modalItem.id);
          }}
        >
          {this.scope.locale.Close()}
        </button>
      ),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: () => {
        this.$appModal.close(modalItem.id);
      },
    });
  }

  private _renderAppModalConfirm(modalItem: IModalItem) {
    const options = modalItem.options as IModalConfirmOptionsInner | undefined;
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    const iconName = options?.icon ?? this.scope.config.model.confirm.icons.confirm;
    const title = options?.title ?? this.sys.env.APP_TITLE ?? '';
    const text = options?.text;
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName,
      title,
      body: text ? <p class="whitespace-pre-wrap leading-6">{text}</p> : undefined,
      actions: (
        <>
          <button
            type="button"
            class="btn btn-ghost"
            onClick={() => {
              this.$appModal.close(modalItem.id);
              options?.onCallback?.(false);
            }}
          >
            {this.scope.locale.No()}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => {
              this.$appModal.close(modalItem.id);
              options?.onCallback?.(true);
            }}
          >
            {this.scope.locale.Yes()}
          </button>
        </>
      ),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: () => {
        this.$appModal.close(modalItem.id);
        options?.onCallback?.(false);
      },
    });
  }

  private _renderAppModalPrompt(modalItem: IModalItem) {
    const options = modalItem.options as IModalPromptOptionsInner | undefined;
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    const iconName = options?.icon ?? this.scope.config.model.prompt.icons.prompt;
    const title = options?.title ?? this.sys.env.APP_TITLE ?? '';
    const text = options?.text;
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName,
      title,
      body: (
        <fieldset class="fieldset gap-3">
          {!!text && <legend class="fieldset-legend text-base-content/80">{text}</legend>}
          <input
            class="input input-bordered w-full"
            type="text"
            autofocus={true}
            value={options?.defaultValue ?? ''}
            onInput={event => {
              options!.defaultValue = (event.target as HTMLInputElement).value;
            }}
            onKeydown={event => {
              if (event.key === 'Enter') {
                this.$appModal.close(modalItem.id);
                options?.onCallback?.(options?.defaultValue ?? '');
              }
            }}
          />
        </fieldset>
      ),
      actions: (
        <>
          <button
            type="button"
            class="btn btn-ghost"
            onClick={() => {
              this.$appModal.close(modalItem.id);
              options?.onCallback?.(undefined);
            }}
          >
            {this.scope.locale.Cancel()}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => {
              this.$appModal.close(modalItem.id);
              options?.onCallback?.(options?.defaultValue ?? '');
            }}
          >
            {this.scope.locale.Ok()}
          </button>
        </>
      ),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: () => {
        this.$appModal.close(modalItem.id);
        options?.onCallback?.(undefined);
      },
    });
  }

  private _renderAppModalRoutedDialog(modalItem: IModalRoutedDialogItem) {
    const options = modalItem.options;
    const dialogOptions = this._prepareDialogOptions(
      modalItem.type,
      modalItem.dialogOptions,
      options,
    );
    const title = options.title ?? this.sys.env.APP_TITLE ?? '';
    const state = modalItem.state;
    let body: VNode;
    if (state.status === 'error') {
      body = <div class="text-error whitespace-pre-wrap">{String(state.error)}</div>;
    } else if (state.status === 'ready' && state.router) {
      const RoutedDialog = this.$zovaComponent('basic-app:routedDialog');
      body = <RoutedDialog item={modalItem}></RoutedDialog>;
    } else {
      body = <div class="loading loading-spinner"></div>;
    }
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName: options.icon,
      title,
      body,
      showBackButton: dialogOptions.showBackButton && state.status === 'ready' && state.canGoBack,
      showCloseButton: dialogOptions.showCloseButton,
      onBack: () => {
        state.router?.back();
      },
      onClose: () => {
        this.$appModal.close(modalItem.id, 'button');
      },
    });
  }

  private _renderAppModalDialog(modalItem: IModalItem) {
    const options = modalItem.options as IModalDialogRenderOptions | undefined;
    const dialogOptions = this._prepareDialogOptions(modalItem.type, modalItem.dialogOptions);
    const dialog = this._createDialogRenderContext(modalItem);
    const title = options?.title ?? this.sys.env.APP_TITLE ?? '';
    return this._renderDialogBase({
      modalItem,
      dialogOptions,
      iconName: options?.icon,
      title,
      body: options?.slotDefault?.(dialog),
      actions: options?.slotActions?.(dialog),
      showCloseButton: dialogOptions.showCloseButton,
      onClose: () => {
        this.$appModal.close(modalItem.id);
      },
    });
  }

  private _renderDialogBase({
    modalItem,
    dialogOptions,
    iconName,
    title,
    body,
    actions,
    showBackButton,
    showCloseButton,
    onBack,
    onClose,
  }: IRenderDialogBaseOptions) {
    const routedDialog = modalItem.type === 'routedDialog';
    const presentation = this._dialogPresentation(dialogOptions, routedDialog);
    const outerPresentation = routedDialog
      ? this._routedDialogOuterPresentation(dialogOptions)
      : undefined;
    return (
      <div
        key={modalItem.id}
        class={this.$cssMerge(
          routedDialog
            ? 'fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pb-4'
            : 'fixed inset-0 z-50 flex items-center justify-center p-4',
          outerPresentation?.className,
        )}
        style={outerPresentation?.style}
      >
        <div
          class="absolute inset-0 bg-base-content/30"
          onClick={() => {
            if (dialogOptions.closeOnBackdrop) {
              onClose();
            }
          }}
        ></div>
        <div
          role="dialog"
          aria-modal="true"
          class={this.$cssMerge(
            routedDialog
              ? 'card bg-base-100 shadow-2xl relative w-full'
              : 'card bg-base-100 shadow-2xl relative w-full max-h-[calc(100vh-2rem)]',
            presentation.className,
          )}
          style={presentation.style}
        >
          <div class="card-body flex max-h-full min-h-0 flex-col gap-4">
            <div class="flex items-center gap-3 shrink-0">
              {!!showBackButton && (
                <button
                  type="button"
                  class="btn btn-ghost btn-sm btn-circle shrink-0 transition-colors hover:bg-base-300"
                  aria-label={this.scope.locale.Back()}
                  title={this.scope.locale.Back()}
                  onClick={() => {
                    onBack?.();
                  }}
                >
                  <ZIcon name="::arrow-back" width={18} height={18}></ZIcon>
                </button>
              )}
              {!!iconName && (
                <ZIcon class="text-primary mt-1 shrink-0" name={iconName} width={24}></ZIcon>
              )}
              <div class="flex-1 min-w-0">
                <h3 class="card-title">{title}</h3>
              </div>
              {!!showCloseButton && (
                <button
                  type="button"
                  class="btn btn-ghost btn-sm btn-circle shrink-0 transition-colors hover:bg-base-300"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <ZIcon name="::close" width={18} height={18}></ZIcon>
                </button>
              )}
            </div>
            {!!body && <div class="min-h-0 flex-1 overflow-y-auto p-2">{body}</div>}
            {!!actions && <div class="card-actions justify-end shrink-0">{actions}</div>}
          </div>
        </div>
      </div>
    );
  }

  private _createDialogRenderContext(modalItem: IModalItem): IModalDialogRenderContext {
    return {
      id: modalItem.id,
      close: () => {
        this.$appModal.close(modalItem.id);
      },
    };
  }

  private _prepareDialogOptions(
    type: ModalType,
    dialogOptions?:
      | IModalDialogOptions
      | IModalMessageOptions
      | IModalRoutedDialogPresentationOptions,
    routedDialogOptions?: IModalRoutedDialogPresentationOptions,
  ): IPreparedDialogOptions {
    const defaults = this.scope.config.model[type].default as
      | IModalDialogOptions
      | IModalMessageOptions
      | IModalRoutedDialogPresentationOptions;
    const maxWidth =
      type === 'routedDialog'
        ? this._resolveRoutedDialogMaxWidth(
            defaults.maxWidth as ModalRoutedDialogMaxWidth | undefined,
            routedDialogOptions?.maxWidth,
            (dialogOptions as IModalRoutedDialogPresentationOptions | undefined)?.maxWidth,
          )
        : ((dialogOptions as IModalDialogOptions | IModalMessageOptions | undefined)?.maxWidth ??
          (defaults.maxWidth as ModalWidth | undefined));
    const routedPresentation = dialogOptions as IModalRoutedDialogPresentationOptions | undefined;
    const routedDefaults = defaults as IModalRoutedDialogPresentationOptions;
    const topGutter =
      type === 'routedDialog'
        ? this._resolveRoutedDialogTopGutter(
            routedDefaults.topGutter,
            routedDialogOptions?.topGutter,
            routedPresentation?.topGutter,
          )
        : undefined;
    const options: IPreparedDialogOptions = {
      maxWidth,
      maxHeight: dialogOptions?.maxHeight ?? defaults.maxHeight,
      topGutter,
      closeOnBackdrop: dialogOptions?.closeOnBackdrop ?? defaults.closeOnBackdrop,
      closeOnEscape: dialogOptions?.closeOnEscape ?? defaults.closeOnEscape,
      showCloseButton: false,
    };
    if (type !== 'dialog' && type !== 'routedDialog') return options;
    const defaultsDialog = defaults as IModalDialogOptions;
    return {
      ...options,
      showCloseButton:
        (dialogOptions as IModalDialogOptions | undefined)?.showCloseButton ??
        defaultsDialog.showCloseButton ??
        false,
      showBackButton:
        type === 'routedDialog'
          ? (routedPresentation?.showBackButton ??
            routedDialogOptions?.showBackButton ??
            routedDefaults.showBackButton ??
            false)
          : undefined,
    };
  }

  private _resolveRoutedDialogMaxWidth(
    ...values: (ModalRoutedDialogMaxWidth | undefined)[]
  ): ModalRoutedDialogMaxWidth | undefined {
    return this._resolveRoutedDialogLength(values) as ModalRoutedDialogMaxWidth | undefined;
  }

  private _resolveRoutedDialogTopGutter(
    ...values: (ModalRoutedDialogTopGutter | undefined)[]
  ): ModalRoutedDialogTopGutter | undefined {
    return this._resolveRoutedDialogLength(values) as ModalRoutedDialogTopGutter | undefined;
  }

  private _resolveRoutedDialogLength(
    values: (ModalRoutedDialogMaxWidth | ModalRoutedDialogTopGutter | undefined)[],
  ): ModalRoutedDialogMaxWidth | ModalRoutedDialogTopGutter | undefined {
    let resolved: ModalRoutedDialogMaxWidth | ModalRoutedDialogTopGutter | undefined;
    for (const value of values) {
      if (value === undefined) continue;
      if (!this._isResponsiveLength(value)) {
        resolved = value;
        continue;
      }
      resolved = {
        ...(this._isResponsiveLength(resolved) ? resolved : { default: resolved }),
        ...value,
      };
    }
    return resolved;
  }

  private _isResponsiveMaxWidth(
    value: ModalRoutedDialogMaxWidth | undefined,
  ): value is IModalResponsiveMaxWidth {
    return this._isResponsiveLength(value);
  }

  private _isResponsiveTopGutter(
    value: ModalRoutedDialogTopGutter | undefined,
  ): value is IModalResponsiveTopGutter {
    return this._isResponsiveLength(value);
  }

  private _isResponsiveLength(
    value: ModalRoutedDialogMaxWidth | ModalRoutedDialogTopGutter | undefined,
  ): value is IModalResponsiveMaxWidth | IModalResponsiveTopGutter {
    return !!value && typeof value === 'object';
  }

  private _routedDialogOuterPresentation(
    dialogOptions: IPreparedDialogOptions,
  ): IModalOuterPresentation {
    const style = {} as Record<string, string>;
    const topGutter = dialogOptions.topGutter;
    if (this._isResponsiveTopGutter(topGutter)) {
      this._setResponsiveTopGutter(style, 'default', topGutter.default);
      this._setResponsiveTopGutter(style, 'md', topGutter.md);
      this._setResponsiveTopGutter(style, 'lg', topGutter.lg);
    } else if (topGutter !== undefined) {
      this._setResponsiveTopGutter(style, 'default', topGutter);
    }
    return {
      className: this.$style(responsiveTopGutterClass),
      style: Object.keys(style).length > 0 ? style : undefined,
    };
  }

  private _dialogPresentation(
    dialogOptions: IPreparedDialogOptions,
    routedDialog: boolean,
  ): IModalCardPresentation {
    const style = {} as Record<string, string>;
    const maxWidth = dialogOptions.maxWidth;
    const maxHeight = dialogOptions.maxHeight;
    const classNames: string[] = [];
    if (this._isResponsiveMaxWidth(maxWidth)) {
      classNames.push(this.$style(responsiveMaxWidthClass));
      this._setResponsiveMaxWidth(style, 'default', maxWidth.default);
      this._setResponsiveMaxWidth(style, 'md', maxWidth.md);
      this._setResponsiveMaxWidth(style, 'lg', maxWidth.lg);
    } else if (maxWidth !== undefined) {
      style.maxWidth = this._normalizeWidth(maxWidth);
    }
    if (routedDialog) {
      classNames.push(this.$style(routedDialogMaxHeightClass));
      if (maxHeight !== undefined) {
        style['--zova-routed-dialog-max-height'] = this._normalizeWidth(maxHeight);
      }
    } else if (maxHeight !== undefined) {
      style.maxHeight = this._normalizeWidth(maxHeight);
    }
    return {
      className: classNames.length > 0 ? this.$cssMerge(...classNames) : undefined,
      style: Object.keys(style).length > 0 ? style : undefined,
    };
  }

  private _setResponsiveMaxWidth(
    style: Record<string, string>,
    breakpoint: keyof IModalResponsiveMaxWidth,
    value: ModalWidth | undefined,
  ) {
    if (value === undefined) return;
    style[`--zova-routed-dialog-max-width-${breakpoint}`] = this._normalizeWidth(value);
  }

  private _setResponsiveTopGutter(
    style: Record<string, string>,
    breakpoint: keyof IModalResponsiveTopGutter,
    value: ModalWidth | undefined,
  ) {
    if (value === undefined) return;
    style[`--zova-routed-dialog-top-gutter-${breakpoint}`] = this._normalizeWidth(value);
  }

  private _normalizeWidth(value: ModalWidth) {
    return typeof value === 'number' ? `${value}px` : value;
  }

  private _getButtonClass(type: AlertType, primary?: boolean) {
    if (!primary) return 'btn btn-ghost';
    if (type === 'success') return 'btn btn-success';
    if (type === 'warning') return 'btn btn-warning';
    if (type === 'error') return 'btn btn-error';
    return 'btn btn-primary';
  }
}
