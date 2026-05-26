import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Ssr } from 'vona-module-a-ssr';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoTestBody } from '../dto/testBody.ts';
import { DtoTestParams } from '../dto/testParams.ts';
import { DtoTestQuery } from '../dto/testQuery.ts';
import { DtoTestResult } from '../dto/testResult.tsx';

export interface IControllerOptionsToolOne extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsToolOne>('toolOne')
export class ControllerToolOne extends BeanBase {
  // http://localhost:7102/api/test/ssr/toolOne/test/12
  // for dev: http://localhost:9000/demo/basic/toolOne/12?api=/api/test/ssr/toolOne/test/:id?&apiMethod=post
  @Web.get('test/:id?')
  @Ssr.redirect('test-ssr:second', '/demo/basic/toolOne/:id?', undefined, { redirectOnly: true })
  async testGet(
    @Arg.param(v.object(DtoTestParams)) _params: DtoTestParams,
    @Arg.query(v.object(DtoTestQuery)) _query: DtoTestQuery,
  ) {}

  @Web.post('test/:id?')
  @Api.body(v.object(DtoTestResult))
  async test(
    @Arg.param(v.object(DtoTestParams)) params: DtoTestParams,
    @Arg.query(v.object(DtoTestQuery)) query: DtoTestQuery,
    @Arg.body(v.object(DtoTestBody)) body: DtoTestBody,
  ) {
    const testResult: DtoTestResult = {
      id: params.id || 1,
      name: query.name,
      married: body.married,
      details: [],
    };
    return testResult;
  }
}
