import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoCouponTemplateCreate } from '../dto/couponTemplateCreate.tsx';
import type { DtoCouponTemplateSelectRes } from '../dto/couponTemplateSelectRes.tsx';
import type { DtoCouponTemplateUpdate } from '../dto/couponTemplateUpdate.tsx';
import type { DtoCouponTemplateView } from '../dto/couponTemplateView.tsx';
import type { EntityCouponTemplate } from '../entity/couponTemplate.tsx';
import type { ModelCouponTemplate } from '../model/couponTemplate.ts';

@Service()
export class ServiceCouponTemplate extends BeanBase {
  async create(command: DtoCouponTemplateCreate): Promise<EntityCouponTemplate> {
    this._assertValidityWindow(command.validFrom, command.validUntil);
    return await this.scope.model.couponTemplate.insert({
      ...command,
      issuedCount: 0,
      redeemedCount: 0,
    });
  }

  async select(params?: IQueryParams<ModelCouponTemplate>): Promise<DtoCouponTemplateSelectRes> {
    return await this.scope.model.couponTemplate.selectAndCount(params);
  }

  async view(id: TableIdentity): Promise<DtoCouponTemplateView | undefined> {
    return await this.scope.model.couponTemplate.getById(id);
  }

  async update(id: TableIdentity, couponTemplate: DtoCouponTemplateUpdate) {
    const template = await this.scope.model.couponTemplate.getById(id);
    if (!template) return;
    const issued = await this.scope.model.couponGrant.count({ where: { templateId: template.id } });
    if (Number(issued ?? 0) > 0) {
      this.app.throw(409, 'cannot edit an issued coupon template');
    }
    return await this.scope.model.couponTemplate.updateById(id, couponTemplate);
  }

  async delete(id: TableIdentity) {
    const issued = await this.scope.model.couponGrant.count({ where: { templateId: id } });
    if (Number(issued ?? 0) > 0) this.app.throw(409, 'cannot delete an issued coupon template');
    return await this.scope.model.couponTemplate.deleteById(id);
  }

  private _assertValidityWindow(validFrom: Date, validUntil: Date) {
    if (validFrom >= validUntil) this.app.throw(400, 'coupon validFrom must precede validUntil');
  }
}
