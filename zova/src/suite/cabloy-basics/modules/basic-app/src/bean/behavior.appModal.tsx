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
  IModalItem,
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
  actions: VNode;
  onClose: () => void;
}

@Behavior<IBehaviorOptionsAppModal>()
export class BehaviorAppModal extends BeanBehaviorBase<
  IBehaviorOptionsAppModal,
  IBehaviorPropsInputAppModal,
  IBehaviorPropsOutputAppModal
> {
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
    return this._renderAppModalPrompt(modalItem);
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
      onClose: () => {
        this.$appModal.close(modalItem.id);
        options?.onCallback?.(undefined);
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
        <div class="card bg-base-100 shadow-2xl relative w-full" style={style}>
          <div class="card-body gap-4">
            <div class="flex items-start gap-3">
              {!!iconName && (
                <ZIcon class="text-primary mt-1 shrink-0" name={iconName} width={24}></ZIcon>
              )}
              <div class="flex-1 min-w-0">
                <h3 class="card-title">{title}</h3>
                {!!body && <div class="mt-2">{body}</div>}
              </div>
            </div>
            <div class="card-actions justify-end">{actions}</div>
          </div>
        </div>
      </div>
    );
  }

  private _prepareDialogOptions(type: ModalType, dialogOptions?: IModalDialogOptions) {
    const defaults = this.scope.config.model[type].default;
    return {
      maxWidth: dialogOptions?.maxWidth ?? defaults.maxWidth,
      closeOnBackdrop: dialogOptions?.closeOnBackdrop ?? defaults.closeOnBackdrop,
    };
  }

  private _dialogStyle(dialogOptions: IModalDialogOptions) {
    const maxWidth = dialogOptions.maxWidth;
    if (!maxWidth) return undefined;
    return {
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    };
  }

  private _getButtonClass(type: AlertType, primary?: boolean) {
    if (!primary) return 'btn btn-ghost';
    if (type === 'success') return 'btn btn-success';
    if (type === 'warning') return 'btn btn-warning';
    if (type === 'error') return 'btn btn-error';
    return 'btn btn-primary';
  }
}
