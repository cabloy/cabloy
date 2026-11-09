import type {
  TypeQueryInput,
  TypeQueryAggregateInput,
  TypeQueryGroupInput,
} from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { $compileQuery, $executeAnalysisAggregate, $executeAnalysisGroup } from 'vona-module-a-orm';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoPostAggregate } from '../dto/postAggregate.ts';
import { DtoPostGroup } from '../dto/postGroup.ts';
import { postQuery, DtoPostSelectReq } from '../dto/postSelectReq.ts';
import { DtoPostSelectRes } from '../dto/postSelectRes.ts';
import { postAnalysis } from '../lib/postAnalysis.ts';

export interface IControllerOptionsPost extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPost>('post', { meta: { mode: ['test', 'dev'] } })
export class ControllerPost extends BeanBase {
  @Web.get('group')
  @Api.body(v.array(DtoPostGroup))
  async group(
    @Arg.filter(DtoPostSelectReq, { mode: 'group' })
    params: TypeQueryGroupInput<typeof postQuery, typeof postAnalysis>,
  ): Promise<DtoPostGroup[]> {
    return await $executeAnalysisGroup(
      this.scope.model.post,
      postAnalysis,
      $compileQuery(this.scope.model.post, postQuery, params, {
        mode: 'group',
        analysis: postAnalysis,
      }),
    );
  }

  @Web.get('aggregate')
  @Api.body(DtoPostAggregate)
  async aggregate(
    @Arg.filter(DtoPostSelectReq, { mode: 'aggregate' })
    params: TypeQueryAggregateInput<typeof postQuery, typeof postAnalysis>,
  ): Promise<DtoPostAggregate> {
    return await $executeAnalysisAggregate(
      this.scope.model.post,
      postAnalysis,
      $compileQuery(this.scope.model.post, postQuery, params, {
        mode: 'aggregate',
        analysis: postAnalysis,
      }),
    );
  }

  @Web.get('findManyEcho')
  @Api.body(DtoPostSelectReq)
  @Passport.public()
  findManyEcho(@Arg.filter(DtoPostSelectReq) params: TypeQueryInput<typeof postQuery>) {
    return params;
  }

  @Web.get('findMany')
  @Api.body(DtoPostSelectRes)
  @Passport.public()
  async findMany(@Arg.filter(DtoPostSelectReq) params: TypeQueryInput<typeof postQuery>) {
    return await this.scope.service.post.findMany(
      $compileQuery(this.scope.model.post, postQuery, params),
    );
  }
}
