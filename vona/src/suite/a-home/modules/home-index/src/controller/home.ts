import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IControllerOptionsHome extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsHome>()
@Api.tags(['Home'])
export class ControllerHome extends BeanBase {
  @Web.get('//', { description: $locale('Home') })
  @Passport.public()
  index() {
    return this.scope.locale.HelloVona();
  }
}
