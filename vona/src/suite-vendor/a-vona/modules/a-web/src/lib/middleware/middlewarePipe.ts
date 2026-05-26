import type { Next, VonaApplication, VonaContext } from 'vona';
import type { IPipeRecord, IPipeTransform } from 'vona-module-a-aspect';
import type { ServiceOnion } from 'vona-module-a-onion';
import type { IOnionExecuteCustom } from 'vona-module-a-onion';
import type {
  RouteHandlerArgumentMeta,
  RouteHandlerArgumentMetaDecorator,
} from 'vona-module-a-openapi';

import { isNil } from '@cabloy/utils';
import { appMetadata } from 'vona';
import { SymbolCacheComposePipes } from 'vona-module-a-aspect';
import {
  SymbolRouteHandlersArgumentsMeta,
  SymbolRouteHandlersArgumentsValue,
} from 'vona-module-a-openapiutils';

import type { ContextRoute } from '../../types/router.ts';

import { extractValue } from './extractValue.ts';

export async function middlewarePipe(ctx: VonaContext, next: Next) {
  // check handler
  const handler = ctx.getHandler();
  if (!handler) return next();
  // arguments
  ctx[SymbolRouteHandlersArgumentsValue] = await _transformArguments(ctx.app, ctx.route);
  // next
  return next();
}

async function _transformArguments(
  app: VonaApplication,
  route: ContextRoute,
): Promise<any[] | undefined> {
  const paramtypes = appMetadata.getMetadata<any[]>(
    'design:paramtypes',
    route.controller.prototype,
    route.action,
  );
  if (!paramtypes) return;

  // meta
  const argsMeta = appMetadata.getMetadata<RouteHandlerArgumentMetaDecorator[]>(
    SymbolRouteHandlersArgumentsMeta,
    route.controller.prototype,
    route.action,
  );
  if (!argsMeta) return;

  // args
  const args = Array.from({ length: paramtypes.length });
  for (let index = args.length - 1; index >= 0; index--) {
    const argMeta = argsMeta.find(item => item?.index === index);
    if (!argMeta) continue;
    // extractValue
    const value = await _extractArgumentValue(app.ctx, argMeta);
    // metadata
    const metadata: RouteHandlerArgumentMeta = {
      type: argMeta.type,
      field: argMeta.field,
      metaType: paramtypes[index],
      controller: route.controller,
      method: route.action,
      index: argMeta.index,
    };
    // transform
    args[index] = await _transformArgument(app, route, argMeta, metadata, value);
  }
  return args;
}

async function _transformArgument(
  app: VonaApplication,
  route: ContextRoute,
  argMeta: RouteHandlerArgumentMetaDecorator,
  metadata: RouteHandlerArgumentMeta,
  value: any,
) {
  // pipes
  const pipes = composePipes(
    app,
    route,
    argMeta,
    (beanInstance: IPipeTransform, value, options, _next) => {
      if (!isNil(options.argIndex) && argMeta.index !== options.argIndex) return value;
      return beanInstance.transform(value, metadata, options);
    },
  );
  if (pipes.length === 0) return value;
  // apply
  for (const pipe of pipes) {
    value = await pipe(value, _pipeNextDefault);
  }
  return value;
}

function _pipeNextDefault(value: any) {
  return value;
}

async function _extractArgumentValue(ctx: VonaContext, argMeta: RouteHandlerArgumentMetaDecorator) {
  if (argMeta.extractValue) {
    return await argMeta.extractValue(ctx, argMeta);
  }
  return extractValue(ctx, argMeta);
}

function composePipes(
  app: VonaApplication,
  route: ContextRoute,
  argMeta: RouteHandlerArgumentMetaDecorator,
  executeCustom: IOnionExecuteCustom,
) {
  if (!app.meta[SymbolCacheComposePipes]) app.meta[SymbolCacheComposePipes] = {};
  const cacheComposePipes: Record<string, Function[]> = app.meta[SymbolCacheComposePipes];
  const onionPipe = app.bean.onion.pipe;
  const beanFullName = route.controllerBeanFullName;
  const handlerName = route.action;
  const key = `${beanFullName}:${handlerName}:${argMeta.index}`;
  if (!cacheComposePipes[key]) {
    const middlewares: Function[] = [];
    // pipes: global
    for (const item of onionPipe.onionsGlobal) {
      middlewares.push(onionPipe._wrapOnion(item, executeCustom));
    }
    // pipes: route
    const middlewaresLocal = onionPipe._collectOnionsHandler(route);
    for (const item of middlewaresLocal) {
      middlewares.push(onionPipe._wrapOnion(item, executeCustom));
    }
    // pipes: arguments
    const middlewaresArgument = _collectArgumentMiddlewares(onionPipe, argMeta);
    if (middlewaresArgument) {
      for (const item of middlewaresArgument) {
        middlewares.push(onionPipe._wrapOnion(item, executeCustom));
      }
    }
    cacheComposePipes[key] = middlewares;
  }
  return cacheComposePipes[key];
}

function _collectArgumentMiddlewares(
  onionPipe: ServiceOnion<IPipeRecord>,
  argMeta: RouteHandlerArgumentMetaDecorator,
) {
  if (!argMeta.pipes) return;
  return argMeta.pipes.map(pipe => {
    const { pipeName, options } = pipe();
    const item = onionPipe.onionsNormal[pipeName];
    if (!item) throw new Error(`${onionPipe.sceneName} not found: ${pipeName}`);
    return {
      ...item,
      argumentPipe: {
        options,
      },
    };
  });
}
