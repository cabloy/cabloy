import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { ModelPost } from '../model/post.ts';

import { DtoPostAggregate } from '../dto/postAggregate.ts';
import { DtoPostGroup } from '../dto/postGroup.ts';
import { DtoPostSelectReq } from '../dto/postSelectReq.ts';
import { DtoPostSelectRes } from '../dto/postSelectRes.ts';

export interface IControllerOptionsPost extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPost>('post', { meta: { mode: ['test', 'dev'] } })
export class ControllerPost extends BeanBase {
  @Web.get('group')
  @Api.body(v.array(DtoPostGroup))
  async group(): Promise<DtoPostGroup[]> {
    return await this.scope.model.post.group({
      groups: 'userId',
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    });
  }

  @Web.get('aggregate')
  @Api.body(DtoPostAggregate)
  async aggregate(): Promise<DtoPostAggregate> {
    return await this.scope.model.post.aggregate({
      aggrs: {
        count: ['*', 'stars'],
        sum: 'stars',
        avg: 'stars',
        min: 'stars',
        max: 'stars',
      },
    });
  }

  @Web.get('findManyEcho')
  @Api.body(DtoPostSelectRes)
  @Passport.public()
  findManyEcho(@Arg.filter(DtoPostSelectReq) params: IQueryParams<ModelPost>) {
    return params;
  }

  @Web.get('findMany')
  @Api.body(DtoPostSelectRes)
  @Passport.public()
  async findMany(@Arg.filter(DtoPostSelectReq) params: IQueryParams<ModelPost>) {
    return await this.scope.service.post.findMany(params);
  }
}
