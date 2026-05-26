import type { Constructable, MetadataKey } from 'vona';

import { appMetadata, appResource, BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { RequestMappingMetadata } from '../lib/decorator/request.ts';

import { SymbolRequestMappingHandler } from '../types/request.ts';

@Service()
export class ServiceWeb extends BeanBase {
  public combineControllerActionApiPath(
    controller: Constructable,
    actionKey: MetadataKey,
    prefix?: string | boolean,
    simplify?: boolean,
  ): string | undefined {
    // beanOptions
    const beanOptions = appResource.getBean(controller);
    if (!beanOptions) return undefined;
    // controllerPath
    const controllerOptions = beanOptions.options as any;
    const controllerPath = controllerOptions.path;
    // actionPath
    const handlerMetadata = appMetadata.getMetadata<RequestMappingMetadata>(
      SymbolRequestMappingHandler,
      controller.prototype,
      actionKey,
    )!;
    const actionPath: string = handlerMetadata.path || '';
    // combine
    return this.app.util.combineApiPathControllerAndAction(
      beanOptions.module,
      controllerPath,
      actionPath,
      prefix,
      simplify,
    );
  }
}
