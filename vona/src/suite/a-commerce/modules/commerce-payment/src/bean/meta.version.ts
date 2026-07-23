import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const entityPaymentAttempt = this.scope.entity.paymentAttempt;
    await this.bean.model.createTable(entityPaymentAttempt.$table, table => {
      table.comment(entityPaymentAttempt.$comment.$table);
      table.basicFields();
      table
        .tableIdentity(entityPaymentAttempt.orderId)
        .comment(entityPaymentAttempt.$comment.orderId);
      table.userId(entityPaymentAttempt.userId).comment(entityPaymentAttempt.$comment.userId);
      table.string(entityPaymentAttempt.state, 20).comment(entityPaymentAttempt.$comment.state);
      table
        .string(entityPaymentAttempt.currency, 3)
        .comment(entityPaymentAttempt.$comment.currency);
      table
        .integer(entityPaymentAttempt.amountCents)
        .comment(entityPaymentAttempt.$comment.amountCents);
      table
        .string(entityPaymentAttempt.correlationId, 100)
        .comment(entityPaymentAttempt.$comment.correlationId);
      table
        .dateTime(entityPaymentAttempt.cancelledAt)
        .nullable()
        .comment(entityPaymentAttempt.$comment.cancelledAt);
    });
  }
}
