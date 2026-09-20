import {
  getCurrentInstance,
  onBeforeUnmount,
  onServerPrefetch,
  onUnmounted,
  queuePostFlushCb,
  useSlots,
} from 'vue';

import type { IBeanRecord, IControllerData } from '../bean/type.ts';
import type { Constructable } from '../decorator/index.ts';
import type { IControllerLoadEvent } from '../types/interface/monkey.ts';

import {
  BeanControllerIdentifier,
  BeanRenderIdentifier,
  BeanStyleIdentifier,
  SymbolControllerRefDisable,
} from '../bean/type.ts';
import { normalizeError } from '../core/component/error.ts';
import { ZovaContext } from '../core/context/index.ts';
import { sys } from '../core/sys/sys.ts';

export function useControllerPage<M, R, S>(
  controllerBeanFullName: Constructable<M>,
  renderBeanFullName?: Constructable<R>,
  styleBeanFullName?: Constructable<S>,
);
export function useControllerPage<
  MK extends keyof IBeanRecord,
  RK extends keyof IBeanRecord,
  SK extends keyof IBeanRecord,
>(controllerBeanFullName: MK, renderBeanFullName?: RK, styleBeanFullName?: SK);
// not use type string for typed params
// export function useControllerPage(controllerBeanFullName: string, renderBeanFullName?: string, styleBeanFullName?: string);
export function useControllerPage(
  controllerBeanFullName: Constructable | string,
  renderBeanFullName?: Constructable | string,
  styleBeanFullName?: Constructable | string,
) {
  // controllerData
  const controllerData = { context: { page: true } };
  // use controller
  _useController(controllerData, controllerBeanFullName, renderBeanFullName, styleBeanFullName);
}

export function useController<M, R, S>(
  controllerBeanFullName: Constructable<M>,
  renderBeanFullName?: Constructable<R>,
  styleBeanFullName?: Constructable<S>,
);
export function useController<
  MK extends keyof IBeanRecord,
  RK extends keyof IBeanRecord,
  SK extends keyof IBeanRecord,
>(controllerBeanFullName: MK, renderBeanFullName?: RK, styleBeanFullName?: SK);
// not use type string for typed params
// export function useController(
//   props: unknown | undefined,
//   emit: unknown | undefined,
//   controllerBeanFullName: string,
//   renderBeanFullName?: string,
//   styleBeanFullName?: string,
// );
export function useController(
  controllerBeanFullName: Constructable | string,
  renderBeanFullName?: Constructable | string,
  styleBeanFullName?: Constructable | string,
) {
  // slots
  const slots = useSlots();
  // controllerData
  const controllerData = { context: { slots } };
  // use controller
  _useController(controllerData, controllerBeanFullName, renderBeanFullName, styleBeanFullName);
}

async function _useController(
  controllerData: IControllerData,
  controllerBeanFullName: Constructable | string,
  renderBeanFullName?: Constructable | string,
  styleBeanFullName?: Constructable | string,
) {
  // ctx
  const ctx = new ZovaContext(getCurrentInstance()!);
  setLoadBoundaryOptions(controllerBeanFullName);
  // ctx: monkey
  if (ctx.app) {
    ctx.app.meta.module._monkeyModuleSync(true, 'appContextInitialize', undefined, ctx);
  } else {
    sys.meta.module._monkeyModuleSync(true, 'sysContextInitialize', undefined, ctx);
  }
  // monkey
  if (ctx.app) {
    ctx.app.meta.module._monkeyModuleSync(
      true,
      'controllerDataPrepare',
      undefined,
      controllerData,
      ctx,
    );
  }

  let retryPromise: Promise<void> | undefined;
  let loadBeans = new Set<object>();

  function setLoadBoundaryOptions(controllerBeanFullName: Constructable | string) {
    const boundary = (controllerBeanFullName as any).$componentOptions?.boundary;
    ctx.meta.state.setLoadRenderMode(boundary?.renderMode);
    ctx.meta.state.setLoadRetryEnabled(boundary?.retry);
  }

  function isAttemptActive(attemptId: number) {
    if (ctx.disposed || !ctx.meta) return false;
    return ctx.meta.state.isLoadAttemptActive(attemptId);
  }

  function getLoadLoadingDelay() {
    const delay =
      (controllerBeanFullName as any).$componentOptions?.boundary?.loading?.delay ??
      sys.config.boundary.loading?.delay;
    const delayNumber = Number(delay);
    return Number.isFinite(delayNumber) && delayNumber > 0 ? delayNumber : 0;
  }

  async function __loadBeans(attemptId: number) {
    // controller
    if (!isAttemptActive(attemptId)) return false;
    await ctx.bean._newBeanInner(
      true,
      BeanControllerIdentifier,
      controllerData,
      controllerBeanFullName,
      true,
      false,
      controller => {
        if (!isAttemptActive(attemptId)) return;
        loadBeans.add(controller as object);
        ctx.meta.state.setLoadBeanAttempt(controller as object, attemptId);
        ctx.meta.state.setLoadController(controller);
        setLoadBoundaryOptions((controller as any).constructor);
      },
    );
    if (!isAttemptActive(attemptId)) return false;
    // style
    if (styleBeanFullName) {
      await ctx.bean._newBeanInner(
        true,
        BeanStyleIdentifier,
        undefined,
        styleBeanFullName,
        true,
        false,
        style => {
          if (!isAttemptActive(attemptId)) return;
          loadBeans.add(style as object);
          ctx.meta.state.setLoadBeanAttempt(style as object, attemptId);
        },
      );
    }
    if (!isAttemptActive(attemptId)) return false;
    // render
    if (renderBeanFullName) {
      await ctx.bean._newBeanInner(
        true,
        BeanRenderIdentifier,
        undefined,
        renderBeanFullName,
        true,
        false,
        render => {
          if (!isAttemptActive(attemptId)) return;
          loadBeans.add(render as object);
          ctx.meta.state.setLoadBeanAttempt(render as object, attemptId);
        },
      );
    }
    return isAttemptActive(attemptId);
  }

  async function __load(attemptId: number) {
    if (!(await __loadBeans(attemptId))) return;
    if (!isAttemptActive(attemptId)) return;
    ctx.meta.state.setLoadReady();
    if (process.env.CLIENT) {
      ctx.util.instanceScope(() => {
        queuePostFlushCb(() => {
          if (!isAttemptActive(attemptId)) return;
          setControllerRef(ctx, true);
          ctx.meta.hooks.invokeHook('mounted');
        });
      });
    }
  }

  async function runLoadAttempt(
    attemptId: number,
    beforeLoad?: () => void | Promise<void>,
  ): Promise<void> {
    try {
      await beforeLoad?.();
      if (!isAttemptActive(attemptId)) return;
      await __load(attemptId);
    } catch (err) {
      if (!isAttemptActive(attemptId)) return;
      const result = ctx.app?.meta.error.handleLoadError(err, ctx, ctx.instance as any) ?? {
        err: normalizeError(err),
        disposition: 'fallback' as const,
      };
      if (!isAttemptActive(attemptId)) return;
      if (result.disposition === 'handled') {
        ctx.meta.state.setLoadHandled();
        return;
      }
      ctx.app?.meta.module._monkeyModuleSync(true, 'controllerLoad', undefined, {
        phase: 'fallback',
        ctx,
        controllerBeanFullName,
        controllerBeanName:
          typeof controllerBeanFullName === 'string'
            ? controllerBeanFullName
            : controllerBeanFullName.name,
        error: result.err,
        controllerRecorded: !!ctx.meta.state.loadController,
      });
      if (!isAttemptActive(attemptId)) return;
      ctx.meta.state.setLoadError(result.err);
    }
  }

  function retry() {
    if (!ctx.meta.state.isLoadRetryAvailable) return Promise.resolve();
    if (retryPromise) return retryPromise;
    const promise = (async () => {
      const attemptId = ctx.meta.state.beginLoadAttempt(getLoadLoadingDelay());
      const previousLoadBeans = loadBeans;
      loadBeans = new Set();
      ctx.meta.hooks.clearMounted();
      setControllerRef(ctx, false);
      await runLoadAttempt(attemptId, () => {
        ctx.bean.retryReset(previousLoadBeans);
      });
    })();
    retryPromise = promise;
    void promise.finally(() => {
      if (retryPromise === promise) {
        retryPromise = undefined;
      }
    });
    return promise;
  }

  ctx.meta.state.setLoadRetry(retry);
  if (process.env.CLIENT) {
    ctx.meta.hooks.onHydrated(() => {
      if (!ctx.disposed) {
        ctx.meta.state.setLoadRetryReady();
      }
    });
    // dispose
    onBeforeUnmount(() => {
      if (ctx.disposed) return;
      // undefined better than null
      setControllerRef(ctx, false);
      if (ctx.bean !== ctx.app.bean) {
        ctx.bean.dispose();
      }
    });
    onUnmounted(() => {
      ctx.dispose();
    });
  }

  // load
  ctx.meta.hooks.onCreated(async () => {
    if (ctx.disposed) return;
    const loadEvent: IControllerLoadEvent = {
      phase: 'prepare',
      ctx,
      controllerBeanFullName,
      controllerBeanName:
        typeof controllerBeanFullName === 'string'
          ? controllerBeanFullName
          : controllerBeanFullName.name,
    };
    ctx.app?.meta.module._monkeyModuleSync(true, 'controllerLoad', undefined, loadEvent);
    if (loadEvent.replayError) {
      const attemptId = ctx.meta.state.beginLoadAttempt();
      if (loadEvent.replayControllerRecorded) {
        try {
          await __loadBeans(attemptId);
        } catch {
          // The server's fallback decision is authoritative during initial hydration.
        }
      }
      if (!ctx.disposed) {
        ctx.meta.state.setLoadError(loadEvent.replayError);
      }
      return;
    }
    const attemptId = ctx.meta.state.beginLoadAttempt(getLoadLoadingDelay());
    await runLoadAttempt(attemptId);
  });
  if (process.env.SERVER) {
    onServerPrefetch(() => {
      return ctx.meta.hooks.invokeHook('created');
    });
  } else {
    // not await, same as onServerPrefetch
    ctx.meta.hooks.invokeHook('created');
  }
}

function setControllerRef(ctx: ZovaContext, on: boolean) {
  const controller = ctx.bean?._getBeanSyncOnly(BeanControllerIdentifier) as any;
  if (!controller || controller[SymbolControllerRefDisable]) return;
  // instanceScope useless for emit, because emiter and receiver not the same instance
  const controllerRef = controller.ctx.instance.vnode.props?.controllerRef;
  if (controllerRef) {
    controllerRef(on ? controller : undefined);
  }
}
