import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

import { DtoOperatorContext } from '../dto/operatorContext.ts';

export interface IControllerOptionsOperator extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsOperator>('operator')
@Resource()
export class ControllerOperator extends BeanBase {
  @Web.get('context')
  @Api.body(v.object(DtoOperatorContext))
  @Passport.systemAdmin()
  async context(): Promise<DtoOperatorContext> {
    return this.scope.service.operator.context();
  }
}
