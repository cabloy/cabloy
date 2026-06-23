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
  ModalType,
} from '../types/appModal.js';

export interface IBehaviorPropsInputAppModal {}

export interface IBehaviorPropsOutputAppModal extends IBehaviorPropsInputAppModal {}

export interface IBehaviorOptionsAppModal extends IDecoratorBehaviorOptions {}

interface IRenderDialogBaseOptions {
  modalItem: IModalItem;
  dialogOptions: IModalDialogOptions;
  iconName?: keyof IIconRecord;
  title: string;
  body?: VNode;
  actions?: VNode;
  showCloseButton?: boolean;
  onClose: () => void;
}

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
    showCloseButton,
    onClose,
  }: IRenderDialogBaseOptions) {
    const style = this._dialogStyle(dialogOptions);
    return (
      <div key={modalItem.id} class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-base-content/30"
          onClick={() => {
            if (dialogOptions.closeOnBackdrop) {
              onClose();
            }
          }}
        ></div>
        <div
          class="card bg-base-100 shadow-2xl relative w-full max-h-[calc(100vh-2rem)]"
          style={style}
        >
          <div class="card-body flex max-h-full min-h-0 flex-col gap-4">
            <div class="flex items-start gap-3 shrink-0">
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
    dialogOptions?: IModalDialogOptions | IModalMessageOptions,
  ) {
    const defaults = this.scope.config.model[type].default as
      | IModalDialogOptions
      | IModalMessageOptions;
    const options = {
      maxWidth: dialogOptions?.maxWidth ?? defaults.maxWidth,
      maxHeight: dialogOptions?.maxHeight ?? defaults.maxHeight,
      closeOnBackdrop: dialogOptions?.closeOnBackdrop ?? defaults.closeOnBackdrop,
      closeOnEscape: dialogOptions?.closeOnEscape ?? defaults.closeOnEscape,
      showCloseButton: false,
    };
    if (type !== 'dialog') return options;
    const defaultsDialog = defaults as IModalDialogOptions;
    return {
      ...options,
      showCloseButton:
        (dialogOptions as IModalDialogOptions | undefined)?.showCloseButton ??
        defaultsDialog.showCloseButton ??
        false,
    };
  }

  private _dialogStyle(dialogOptions: IModalDialogOptions) {
    const style = {} as Record<string, string>;
    const maxWidth = dialogOptions.maxWidth;
    const maxHeight = dialogOptions.maxHeight;
    if (maxWidth) {
      style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    }
    if (maxHeight) {
      style.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    }
    return Object.keys(style).length > 0 ? style : undefined;
  }

  private _getButtonClass(type: AlertType, primary?: boolean) {
    if (!primary) return 'btn btn-ghost';
    if (type === 'success') return 'btn btn-success';
    if (type === 'warning') return 'btn btn-warning';
    if (type === 'error') return 'btn btn-error';
    return 'btn btn-primary';
  }
}
