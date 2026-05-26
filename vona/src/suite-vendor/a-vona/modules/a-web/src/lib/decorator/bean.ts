import type { Constructable } from 'vona';
import type { IOpenapiOptions } from 'vona-module-a-openapiutils';

import {
  appMetadata,
  appResource,
  cast,
  createBeanDecorator,
  deepExtend,
  onionNameFromBeanFullName,
  useApp,
} from 'vona';
import {
  mergeDtoFieldsOpenapiMetadata,
  SymbolControllerResource,
} from 'vona-module-a-openapiutils';
import { SymbolOpenApiOptions } from 'vona-module-a-openapiutils';

import type { IDecoratorControllerOptions } from '../../types/controller.ts';
import type { IDecoratorDtoOptions } from '../../types/dto.ts';
import type { IRecordResourceNameToRoutePathItem } from '../const.ts';

import { recordResourceNameToRoutePath } from '../const.ts';

export function Controller<T extends IDecoratorControllerOptions>(options?: T): ClassDecorator;
export function Controller<T extends IDecoratorControllerOptions>(
  path?: string,
  options?: Omit<T, 'path'>,
): ClassDecorator;
export function Controller<T extends IDecoratorControllerOptions>(
  path?: T | string,
  options?: T | string,
): ClassDecorator {
  if (typeof path === 'string') {
    options = Object.assign({}, options, { path });
  } else {
    options = path || ({} as any);
  }
  return createBeanDecorator('controller', options, false, target => {
    // beanOptions
    const beanOptions = appResource.getBean(target)!;
    // IOpenapiOptions
    const optionsMeta = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target,
    ) as IOpenapiOptions;
    for (const key in cast(beanOptions.options)) {
      if (key === 'path') continue;
      optionsMeta[key] = cast(beanOptions.options)[key];
    }
    // IOpenapiOptions
    mergeControllerActionsOpenapiMetadata(target);
    // map: resourceName->api path
    const onionName = onionNameFromBeanFullName(beanOptions.beanFullName);
    const controllerResource = appMetadata.getOwnMetadata(SymbolControllerResource, target);
    if (controllerResource) {
      const app = useApp();
      const apiPath = app.util.combineApiPathControllerAndAction(
        beanOptions.module,
        cast(beanOptions.options).path,
        undefined,
        true,
        true,
      );
      const routePathRaw = app.util.combineApiPathControllerAndActionRaw(
        beanOptions.module,
        cast(beanOptions.options).path,
        undefined,
        true,
      );
      recordResourceNameToRoutePath[onionName] = {
        apiPath,
        routePathRaw,
        controller: target,
      } as IRecordResourceNameToRoutePathItem;
    } else {
      // for hmr
      delete recordResourceNameToRoutePath[onionName];
    }
  });
}

export function Dto<T extends IDecoratorDtoOptions<any>>(options?: T): ClassDecorator {
  return createBeanDecorator('dto', options, false, target => {
    mergeDtoFieldsOpenapiMetadata(target);
    mergeDtoBlocksOpenapiMetadata(target);
  });
}

export function mergeControllerActionsOpenapiMetadata(target: Constructable) {
  // beanOptions
  const beanOptions = appResource.getBean(target);
  const actions = cast(beanOptions?.options)?.actions;
  if (!actions) return;
  for (const key in actions) {
    const action: IOpenapiOptions = actions[key];
    if (!action) continue;
    const options = appMetadata.getOwnMetadataMap(
      false,
      SymbolOpenApiOptions,
      target.prototype,
      key,
    ) as IOpenapiOptions;
    deepExtend(options, action);
  }
}

export function mergeDtoBlocksOpenapiMetadata(target: Constructable) {
  // beanOptions
  const beanOptions = appResource.getBean(target);
  const onionOptions = beanOptions?.options as IDecoratorDtoOptions | undefined;
  const blocks = onionOptions?.blocks;
  if (!blocks) return;
  // openapi
  onionOptions.openapi = deepExtend({}, onionOptions.openapi, {
    rest: { blocks },
  });
}
