import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const entityCouponTemplate = this.scope.entity.couponTemplate;
    await this.bean.model.createTable(entityCouponTemplate.$table, table => {
      table.comment(entityCouponTemplate.$comment.$table);
      table.basicFields();
      table.string(entityCouponTemplate.name, 100).comment(entityCouponTemplate.$comment.name);
      table.string(entityCouponTemplate.state, 20).comment(entityCouponTemplate.$comment.state);
      table
        .string(entityCouponTemplate.currency, 3)
        .comment(entityCouponTemplate.$comment.currency);
      table
        .integer(entityCouponTemplate.discountCents)
        .comment(entityCouponTemplate.$comment.discountCents);
      table
        .integer(entityCouponTemplate.minSpendCents)
        .comment(entityCouponTemplate.$comment.minSpendCents);
      table
        .dateTime(entityCouponTemplate.validFrom)
        .comment(entityCouponTemplate.$comment.validFrom);
      table
        .dateTime(entityCouponTemplate.validUntil)
        .comment(entityCouponTemplate.$comment.validUntil);
      table
        .integer(entityCouponTemplate.totalIssueLimit)
        .nullable()
        .comment(entityCouponTemplate.$comment.totalIssueLimit);
      table
        .integer(entityCouponTemplate.totalUsageLimit)
        .nullable()
        .comment(entityCouponTemplate.$comment.totalUsageLimit);
      table
        .integer(entityCouponTemplate.perCustomerIssueLimit)
        .nullable()
        .comment(entityCouponTemplate.$comment.perCustomerIssueLimit);
      table
        .int0(entityCouponTemplate.issuedCount)
        .comment(entityCouponTemplate.$comment.issuedCount);
      table
        .int0(entityCouponTemplate.redeemedCount)
        .comment(entityCouponTemplate.$comment.redeemedCount);
      table
        .string(entityCouponTemplate.description, 255)
        .nullable()
        .comment(entityCouponTemplate.$comment.description);
    });

    const entityCouponGrant = this.scope.entity.couponGrant;
    await this.bean.model.createTable(entityCouponGrant.$table, table => {
      table.comment(entityCouponGrant.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityCouponGrant.templateId)
        .comment(entityCouponGrant.$comment.templateId);
      table.userId(entityCouponGrant.userId).comment(entityCouponGrant.$comment.userId);
      table.string(entityCouponGrant.couponCode, 80).comment(entityCouponGrant.$comment.couponCode);
      table.string(entityCouponGrant.state, 20).comment(entityCouponGrant.$comment.state);
      table
        .string(entityCouponGrant.templateNameSnapshot, 100)
        .comment(entityCouponGrant.$comment.templateNameSnapshot);
      table
        .string(entityCouponGrant.currencySnapshot, 3)
        .comment(entityCouponGrant.$comment.currencySnapshot);
      table
        .integer(entityCouponGrant.discountCentsSnapshot)
        .comment(entityCouponGrant.$comment.discountCentsSnapshot);
      table
        .integer(entityCouponGrant.minSpendCentsSnapshot)
        .comment(entityCouponGrant.$comment.minSpendCentsSnapshot);
      table
        .dateTime(entityCouponGrant.validFromSnapshot)
        .comment(entityCouponGrant.$comment.validFromSnapshot);
      table
        .dateTime(entityCouponGrant.validUntilSnapshot)
        .comment(entityCouponGrant.$comment.validUntilSnapshot);
      table
        .tableIdentity(entityCouponGrant.reservationOrderId)
        .nullable()
        .comment(entityCouponGrant.$comment.reservationOrderId);
      table
        .string(entityCouponGrant.reservationCorrelationId, 100)
        .nullable()
        .comment(entityCouponGrant.$comment.reservationCorrelationId);
      table
        .dateTime(entityCouponGrant.reservedAt)
        .nullable()
        .comment(entityCouponGrant.$comment.reservedAt);
      table
        .tableIdentity(entityCouponGrant.redeemedOrderId)
        .nullable()
        .comment(entityCouponGrant.$comment.redeemedOrderId);
      table
        .dateTime(entityCouponGrant.redeemedAt)
        .nullable()
        .comment(entityCouponGrant.$comment.redeemedAt);
    });

    const entityCouponAudit = this.scope.entity.couponAudit;
    await this.bean.model.createTable(entityCouponAudit.$table, table => {
      table.comment(entityCouponAudit.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityCouponAudit.couponGrantId)
        .comment(entityCouponAudit.$comment.couponGrantId);
      table
        .tableIdentity(entityCouponAudit.templateId)
        .comment(entityCouponAudit.$comment.templateId);
      table.userId(entityCouponAudit.userId).comment(entityCouponAudit.$comment.userId);
      table
        .userId(entityCouponAudit.actorId)
        .nullable()
        .comment(entityCouponAudit.$comment.actorId);
      table
        .tableIdentity(entityCouponAudit.orderId)
        .nullable()
        .comment(entityCouponAudit.$comment.orderId);
      table.string(entityCouponAudit.operation, 20).comment(entityCouponAudit.$comment.operation);
      table
        .string(entityCouponAudit.fromState, 20)
        .nullable()
        .comment(entityCouponAudit.$comment.fromState);
      table.string(entityCouponAudit.toState, 20).comment(entityCouponAudit.$comment.toState);
      table.string(entityCouponAudit.reason, 255).comment(entityCouponAudit.$comment.reason);
      table
        .string(entityCouponAudit.correlationId, 100)
        .comment(entityCouponAudit.$comment.correlationId);
    });
  }
}
