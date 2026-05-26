import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Ssr } from 'vona-module-a-ssr';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoTestParams } from '../dto/testParams.ts';
import { DtoTestQuery } from '../dto/testQuery.ts';
import { DtoTestResult } from '../dto/testResult.tsx';

// http://localhost:7102/api/test/ssr/toolTwo/test/2?name=kevin

export interface IControllerOptionsToolTwo extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsToolTwo>('toolTwo')
export class ControllerToolTwo extends BeanBase {
  @Web.get('test/:id?')
  @Api.body(v.object(DtoTestResult))
  @Passport.public()
  @Ssr.render('test-ssr:second', '/demo/basic/toolTwo/:id?', undefined, { renderType: 'auto' })
  async test(
    @Arg.param(v.object(DtoTestParams)) params: DtoTestParams,
    @Arg.query(v.object(DtoTestQuery)) query: DtoTestQuery,
  ) {
    const testResult: DtoTestResult = {
      id: params.id || 1,
      name: query.name,
      married: true,
      details: [],
    };
    return testResult;
  }
}
