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

import {
  BeanControllerIdentifier,
  BeanRenderIdentifier,
  BeanStyleIdentifier,
  SymbolControllerRefDisable,
} from '../bean/type.ts';
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
  const controllerData = { context: {} };
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
  if (process.env.CLIENT) {
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

  async function __load() {
    // controller
    if (ctx.disposed) return;
    await ctx.bean._newBeanInner(
      true,
      BeanControllerIdentifier,
      controllerData,
      controllerBeanFullName,
      true,
      false,
    );
    if (styleBeanFullName) {
      if (ctx.disposed) return;
      await ctx.bean._newBeanInner(
        true,
        BeanStyleIdentifier,
        undefined,
        styleBeanFullName,
        true,
        false,
      );
    }
    if (renderBeanFullName) {
      if (ctx.disposed) return;
      await ctx.bean._newBeanInner(
        true,
        BeanRenderIdentifier,
        undefined,
        renderBeanFullName,
        true,
        false,
      );
    }
    // must touch inited on server/client, force router.use effect
    if (ctx.disposed) return;
    ctx.meta.state.inited.touch();
    if (process.env.CLIENT) {
      ctx.util.instanceScope(() => {
        queuePostFlushCb(() => {
          setControllerRef(ctx, true);
          ctx.meta.hooks.invokeHook('mounted');
        });
      });
    }
  }

  // load
  ctx.meta.hooks.onCreated(async () => {
    if (ctx.disposed) return;
    try {
      return await __load();
    } catch (err) {
      if (ctx.disposed) return;
      throw err;
    }
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
