import type {
  TypeComponentBoundaryRenderMode,
  TypeComponentBoundaryRetry,
} from '../../bean/type.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { StateLock } from '../../utils/stateLock.ts';

export type CtxLoadStatus = 'loading' | 'ready' | 'error';

let __id: number = 0;

export class CtxState extends BeanSimple {
  private _id: number;
  private _inited: StateLock;
  private _loadStatus: CtxLoadStatus = 'loading';
  private _loadRenderMode: TypeComponentBoundaryRenderMode = 'block';
  private _loadRetryEnabled = false;
  private _loadRetryReady = false;
  private _loadRetry?: TypeComponentBoundaryRetry;
  private _loadAttemptId = 0;
  private _loadBeanAttempts = new WeakMap<object, number>();
  private _loadError: unknown;
  private _loadController: unknown;
  /** @internal SSR hydration protocol key. */
  public controllerLoadKey?: string;
  private _loadLoadingVisible = false;
  private _loadLoadingTimer: ReturnType<typeof setTimeout> | undefined;

  protected __init__() {
    this._id = ++__id;
    this._inited = StateLock.create();
  }

  /** @internal */
  public dispose() {
    this._clearLoadLoadingTimer();
  }

  get id() {
    return this._id;
  }

  get inited() {
    return this._inited;
  }

  get loadStatus() {
    return this._loadStatus;
  }

  get loadRenderMode() {
    return this._loadRenderMode;
  }

  get loadRetry() {
    if (!this.isLoadRetryAvailable) return undefined;
    return this._loadRetry;
  }

  get isLoadRetryAvailable() {
    return (
      this._loadRetryEnabled &&
      this._loadRetryReady &&
      this._loadStatus === 'error' &&
      !this.ctx.disposed &&
      !!this._loadRetry
    );
  }

  get loadAttemptId() {
    return this._loadAttemptId;
  }

  get loadError() {
    return this._loadError;
  }

  get loadController() {
    return this._loadController;
  }

  get loadLoadingVisible() {
    return this._loadLoadingVisible;
  }

  setLoadController(controller: unknown) {
    this._loadController = controller;
  }

  setLoadRenderMode(renderMode: unknown) {
    this._loadRenderMode = renderMode === 'inline' ? 'inline' : 'block';
  }

  setLoadRetryEnabled(retryEnabled: unknown) {
    this._loadRetryEnabled = retryEnabled === true;
  }

  setLoadRetry(retry: TypeComponentBoundaryRetry) {
    this._loadRetry = retry;
  }

  setLoadRetryReady() {
    this._loadRetryReady = true;
  }

  beginLoadAttempt(delay?: number) {
    this._clearLoadLoadingTimer();
    this._loadAttemptId++;
    this._loadStatus = 'loading';
    this._loadError = undefined;
    this._loadController = undefined;
    this._loadLoadingVisible = false;
    if (delay !== undefined) {
      this.startLoadLoading(delay);
    }
    return this._loadAttemptId;
  }

  isLoadAttemptActive(attemptId: number) {
    return !this.ctx.disposed && this._loadAttemptId === attemptId;
  }

  setLoadBeanAttempt(bean: object, attemptId: number) {
    this._loadBeanAttempts.set(bean, attemptId);
  }

  getLoadBeanAttempt(bean: object) {
    return this._loadBeanAttempts.get(bean);
  }

  isLoadBeanActive(bean: object) {
    const attemptId = this._loadBeanAttempts.get(bean);
    return attemptId === undefined || this.isLoadAttemptActive(attemptId);
  }

  startLoadLoading(delay: number) {
    this._clearLoadLoadingTimer();
    if (delay === 0) {
      this._loadLoadingVisible = true;
      return;
    }
    this._loadLoadingTimer = setTimeout(() => {
      this._loadLoadingTimer = undefined;
      if (this.ctx.disposed || this._loadStatus !== 'loading') return;
      this._loadLoadingVisible = true;
    }, delay);
  }

  /**
   * Resolves the Controller-load terminal lock consumed by the custom SSR hydration runtime.
   * A settled load is not necessarily a successful load: error and handled control-flow paths
   * must also allow the rendered boundary subtree to hydrate.
   */
  settleLoad() {
    this._inited.touch();
  }

  setLoadReady() {
    this._clearLoadLoadingTimer();
    this._loadError = undefined;
    this._loadStatus = 'ready';
    this.settleLoad();
  }

  setLoadError(error: unknown) {
    this._clearLoadLoadingTimer();
    this._loadError = error;
    this._loadStatus = 'error';
    this.settleLoad();
  }

  setLoadHandled() {
    this._clearLoadLoadingTimer();
    this.settleLoad();
  }

  private _clearLoadLoadingTimer() {
    if (this._loadLoadingTimer === undefined) return;
    clearTimeout(this._loadLoadingTimer);
    this._loadLoadingTimer = undefined;
  }
}
