import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Ssr } from 'vona-module-a-ssr';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsToolMinimal extends IDecoratorControllerOptions {}

// http://localhost:7102/api/test/ssr/toolMinimal/test

@Controller<IControllerOptionsToolMinimal>('toolMinimal')
export class ControllerToolMinimal extends BeanBase {
  @Web.get('test')
  @Passport.public()
  @Ssr.render('basic-siteadmin:admin', '/demo/basic/toolMinimal', undefined, {
    renderType: 'auto',
  })
  async test() {
    return 'minimal';
  }
}
