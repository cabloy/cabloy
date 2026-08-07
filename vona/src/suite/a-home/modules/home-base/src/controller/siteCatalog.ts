import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

import { DtoSiteCatalogSelectRes } from '../dto/siteCatalogSelectRes.ts';

export interface IControllerOptionsSiteCatalog extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsSiteCatalog>('siteCatalog')
@Resource()
export class ControllerSiteCatalog extends BeanBase {
  @Web.get()
  @Api.body(DtoSiteCatalogSelectRes)
  @Passport.systemAdmin()
  async select(): Promise<DtoSiteCatalogSelectRes> {
    return await this.scope.service.siteCatalog.select();
  }
}
