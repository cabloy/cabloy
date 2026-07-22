import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelCouponTemplate } from '../model/couponTemplate.ts';

import { DtoCouponTemplateCreate } from '../dto/couponTemplateCreate.tsx';
import { DtoCouponTemplateSelectReq } from '../dto/couponTemplateSelectReq.tsx';
import { DtoCouponTemplateSelectRes } from '../dto/couponTemplateSelectRes.tsx';
import { DtoCouponTemplateUpdate } from '../dto/couponTemplateUpdate.tsx';
import { DtoCouponTemplateView } from '../dto/couponTemplateView.tsx';

export interface IControllerOptionsCouponTemplate extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCouponTemplate>('couponTemplate')
@Resource()
export class ControllerCouponTemplate extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() couponTemplate: DtoCouponTemplateCreate): Promise<TableIdentity> {
    return (await this.scope.service.couponTemplate.create(couponTemplate)).id;
  }

  @Web.get()
  @Api.body(DtoCouponTemplateSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoCouponTemplateSelectReq) params: IQueryParams<ModelCouponTemplate>,
  ): Promise<DtoCouponTemplateSelectRes> {
    return await this.scope.service.couponTemplate.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoCouponTemplateView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoCouponTemplateView | undefined> {
    return await this.scope.service.couponTemplate.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() couponTemplate: DtoCouponTemplateUpdate,
  ): Promise<void> {
    await this.scope.service.couponTemplate.update(id, couponTemplate);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.couponTemplate.delete(id);
  }
}
