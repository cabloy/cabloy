import type { TypeControllerInnerProps } from 'zova';

import {
  routeLocationKey,
  routerKey,
  routerViewLocationKey,
  viewDepthKey,
} from '@cabloy/vue-router';
import { computed, provide, shallowReactive } from 'vue';
import { defineComponent } from 'vue';
import { prepareComponentOptions, useController } from 'zova';

import type { ControllerRoutedDialogProps } from '../../component/routedDialog/controller.jsx';

import { ControllerRoutedDialog } from '../../component/routedDialog/controller.jsx';
export type ZRoutedDialogProps = {
  controllerRef?: (ref: ControllerRoutedDialog) => void;
} & ControllerRoutedDialogProps;

type ControllerInnerProps = TypeControllerInnerProps<
  ControllerRoutedDialogProps,
  keyof typeof ControllerRoutedDialog.$propsDefault
>;
declare module 'zova-module-basic-app' {
  export interface ControllerRoutedDialog {
    $props: ControllerInnerProps;
  }
}

export const ZRoutedDialog = defineComponent(
  (props: ZRoutedDialogProps) => {
    const router = props.item.state.router;
    if (router) {
      const currentRoute = router.currentRoute;
      const reactiveRoute = {} as Record<string, unknown>;
      for (const key in currentRoute.value) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true,
        });
      }
      provide(routerKey, router.router);
      provide(routeLocationKey, shallowReactive(reactiveRoute) as any);
      provide(routerViewLocationKey, currentRoute);
      provide(
        viewDepthKey,
        computed(() => router.getEmbeddedRouterViewDepth(currentRoute.value)),
      );
    }
    useController(ControllerRoutedDialog, undefined, undefined);
    return () => {};
  },
  {
    ...prepareComponentOptions(ControllerRoutedDialog.$componentOptions),
    props: {
      item: { type: Object, required: true },
    },
  },
);
declare module 'zova-module-a-bean' {
  export interface IVonaComponentRecord {
    'basic-app:routedDialog': ControllerRoutedDialogProps;
  }
}
