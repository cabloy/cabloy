import { shallowReactive } from 'vue';
import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';

import { AppModalItem } from '../lib/appModalItem.js';
import { RoutedDialogHistory } from '../lib/routedDialogHistory.js';
import {
  IModalAlertOptions,
  IModalConfirmOptions,
  IModalDialogOptions,
  IModalDialogRenderOptions,
  IModalItem,
  IModalMessageOptions,
  IModalPromptOptions,
  IModalRoutedDialogOptions,
  IModalRoutedDialogPresentationOptions,
  IModalRoutedDialogState,
  IRoutedDialogHandle,
} from '../types/appModal.js';

@Service()
export class ServiceAppModal extends BeanBase {
  public modalItems: IModalItem[] = [];
  private modalItemIdCounter: number = 0;
  private routedDialogReadySettlers = new Map<
    number,
    { resolve: () => void; reject: (error: unknown) => void }
  >();

  private routedDialogHistories = new Map<number, RoutedDialogHistory>();

  protected async __init__() {}

  private newModalItemId() {
    return ++this.modalItemIdCounter;
  }

  public alert(options?: IModalAlertOptions, dialogOptions?: IModalMessageOptions) {
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
    dialogOptions?: IModalMessageOptions,
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
    dialogOptions?: IModalMessageOptions,
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

  public dialog(options?: IModalDialogRenderOptions, dialogOptions?: IModalDialogOptions) {
    const id = this.newModalItemId();
    const modalItem: IModalItem = {
      id,
      type: 'dialog',
      options,
      dialogOptions,
    };
    this.modalItems.push(modalItem);
    return new AppModalItem(this, modalItem);
  }

  public routedDialog(
    options: IModalRoutedDialogOptions,
    dialogOptions?: IModalRoutedDialogPresentationOptions,
  ): IRoutedDialogHandle {
    const id = this.newModalItemId();
    let resolveReady!: () => void;
    let rejectReady!: (error: unknown) => void;
    const ready = new Promise<void>((resolve, reject) => {
      resolveReady = resolve;
      rejectReady = reject;
    });
    // A close-before-ready rejection remains observable through the handle,
    // without becoming an unhandled rejection when callers do not await it.
    void ready.catch(() => {});
    const modalItem: IModalItem = {
      id,
      type: 'routedDialog',
      options,
      dialogOptions,
      state: shallowReactive<IModalRoutedDialogState>({
        status: 'loading',
        canGoBack: false,
        ready,
      }),
    };
    this.modalItems.push(modalItem);
    this.routedDialogReadySettlers.set(id, { resolve: resolveReady, reject: rejectReady });
    const handle = new AppModalItem(this, modalItem) as IRoutedDialogHandle;
    Object.defineProperties(handle, {
      ready: { enumerable: true, get: () => ready },
      push: {
        enumerable: true,
        value: (to: any) => this._navigateRoutedDialog(modalItem, to, false),
      },
      replace: {
        enumerable: true,
        value: (to: any) => this._navigateRoutedDialog(modalItem, to, true),
      },
    });
    void this._initRoutedDialog(modalItem);
    return handle;
  }

  private async _initRoutedDialog(modalItem: Extract<IModalItem, { type: 'routedDialog' }>) {
    let router: IModalRoutedDialogState['router'];
    try {
      if (!process.env.CLIENT) throw new Error('routedDialog is client-only');
      const history = new RoutedDialogHistory();
      this.routedDialogHistories.set(modalItem.id, history);
      history.onCanGoBackChange(canGoBack => {
        if (!this._isRoutedDialogOpen(modalItem)) return;
        modalItem.state.canGoBack = canGoBack;
      });
      router = await this.app.bean._newBean('a-router.bean.router', false, {
        mainRouter: false,
        embeddedView: 'page',
        prepareNavigation: to => this.app.meta.$router.ensureRoute(String(to)),
        routerOptions: {
          history: history.history,
        },
      });
      router.afterEach((to, _from, failure) => {
        if (failure || !this._isRoutedDialogOpen(modalItem)) return;
        modalItem.state.currentRoute = to;
        modalItem.state.canGoBack = history.canGoBack;
      });
      if (!this._isRoutedDialogOpen(modalItem)) {
        router.dispose();
        history.destroy();
        this.routedDialogHistories.delete(modalItem.id);
        return;
      }
      modalItem.state.router = router;
      const result = await router.replace(modalItem.options.route as any);
      if (result) throw result;
      await router.isReady();
      if (!this._isRoutedDialogOpen(modalItem)) {
        router.dispose();
        history.destroy();
        this.routedDialogHistories.delete(modalItem.id);
        modalItem.state.router = undefined;
        return;
      }
      modalItem.state.currentRoute = router.currentRoute.value;
      modalItem.state.canGoBack = history.canGoBack;
      modalItem.state.status = 'ready';
      this._settleRoutedDialogReady(modalItem.id, 'resolve');
    } catch (error) {
      router?.dispose();
      this.routedDialogHistories.get(modalItem.id)?.destroy();
      this.routedDialogHistories.delete(modalItem.id);
      if (!this._isRoutedDialogOpen(modalItem)) return;
      modalItem.state.router = undefined;
      modalItem.state.status = 'error';
      modalItem.state.error = error;
      this._settleRoutedDialogReady(modalItem.id, 'reject', error);
    }
  }

  private async _navigateRoutedDialog(
    modalItem: Extract<IModalItem, { type: 'routedDialog' }>,
    to: any,
    replace: boolean,
  ) {
    this._ensureRoutedDialogOpen(modalItem);
    await modalItem.state.ready;
    this._ensureRoutedDialogOpen(modalItem);
    const router = modalItem.state.router;
    if (!router) throw new Error('routedDialog router is unavailable');
    const result = replace ? await router.replace(to) : await router.push(to);
    this._ensureRoutedDialogOpen(modalItem);
    return result;
  }

  private _isRoutedDialogOpen(modalItem: Extract<IModalItem, { type: 'routedDialog' }>) {
    return !modalItem.state.closed && this.modalItems.some(item => item.id === modalItem.id);
  }

  private _ensureRoutedDialogOpen(modalItem: Extract<IModalItem, { type: 'routedDialog' }>) {
    if (!this._isRoutedDialogOpen(modalItem)) {
      throw new Error('routedDialog is closed');
    }
  }

  private _settleRoutedDialogReady(id: number, action: 'resolve' | 'reject', error?: unknown) {
    const settler = this.routedDialogReadySettlers.get(id);
    if (!settler) return;
    this.routedDialogReadySettlers.delete(id);
    if (action === 'resolve') settler.resolve();
    else settler.reject(error);
  }

  public close(id: number, _reason: string = 'api') {
    const [index, modalItem] = this.findModalItem(id);
    if (index === -1 || !modalItem) return;
    this.modalItems.splice(index, 1);
    if (modalItem.type === 'routedDialog') {
      modalItem.state.closed = true;
      modalItem.state.status = 'closed';
      modalItem.state.router?.dispose();
      this.routedDialogHistories.get(modalItem.id)?.destroy();
      this.routedDialogHistories.delete(modalItem.id);
      modalItem.state.router = undefined;
      this._settleRoutedDialogReady(modalItem.id, 'reject', new Error('routedDialog is closed'));
      modalItem.options.onClose?.();
      return;
    }
    if (modalItem.type === 'dialog') {
      const options = modalItem.options as IModalDialogRenderOptions | undefined;
      options?.onClose?.();
    }
  }

  protected findModalItem(id: number): [number, IModalItem | undefined] {
    const index = this.modalItems.findIndex(item => item.id === id);
    if (index === -1) return [index, undefined];
    return [index, this.modalItems[index]];
  }
}
