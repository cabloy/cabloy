import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoCouponIssue } from '../dto/couponIssue.tsx';
import { DtoCouponMineItem } from '../dto/couponMineItem.tsx';

export interface IControllerOptionsCoupon extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCoupon>('coupon')
export class ControllerCoupon extends BeanBase {
  @Web.get('mine')
  @Api.body(v.array(DtoCouponMineItem))
  async mine(): Promise<DtoCouponMineItem[]> {
    const grants = await this.scope.service.coupon.mine();
    return grants.map(grant => ({
      id: grant.id,
      couponCode: grant.couponCode,
      templateName: grant.templateNameSnapshot,
      currency: grant.currencySnapshot,
      discountCents: grant.discountCentsSnapshot,
      minSpendCents: grant.minSpendCentsSnapshot,
      validUntil: grant.validUntilSnapshot,
    }));
  }

  @Web.post('issue')
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async issue(@Arg.body() command: DtoCouponIssue): Promise<TableIdentity> {
    return (await this.scope.service.coupon.issue(command)).id;
  }
}
