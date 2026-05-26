import type { TableIdentity } from 'table-identity';

import { OrdersController, OrderStatus } from '@cabloy/paypal-server-sdk';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServicePaypal extends BeanBase {
  async getRecord(userId: TableIdentity, recordId: TableIdentity) {
    // get record
    const record = await this.scope.model.paypalRecord.getById(recordId);
    // check user
    if (!record || record.userId !== userId) {
      this.app.throw(403);
    }
    return record;
  }

  async captureOrder(userId: TableIdentity, recordId: TableIdentity) {
    const record = await this.getRecord(userId, recordId);
    if (!record) this.app.throw(403);
    // check if handled
    if (record.status !== 0) this.app.throw(403);
    // prepayId
    const prepayId = record.prepayId;
    // process
    let grossAmount: number;
    let payFee: number;
    let netAmount: number;
    let orderResult: {} | undefined;
    if (this.app.meta.isTest) {
      grossAmount = Number.parseInt((Number.parseFloat(record.payload.total) * 100) as any);
      payFee = grossAmount * this.scope.config.paypal.payFeeRate;
      netAmount = grossAmount - payFee;
      orderResult = undefined;
    } else {
      // capture order
      const ordersController = new OrdersController(this.bean.paypal.createClient());
      const res = await ordersController.captureOrder({ id: prepayId });
      if (!res.result || res.result.status !== OrderStatus.Completed) {
        this.scope.error.TransactionException.throw();
      }
      // update
      const sellerReceivableBreakdown =
        res.result.purchaseUnits![0].payments!.captures![0].sellerReceivableBreakdown!;
      grossAmount = Number.parseInt(
        (Number.parseFloat(sellerReceivableBreakdown.grossAmount.value) * 100) as any,
      );
      payFee = Number.parseInt(
        (Number.parseFloat(sellerReceivableBreakdown.paypalFee!.value) * 100) as any,
      );
      netAmount = Number.parseInt(
        (Number.parseFloat(sellerReceivableBreakdown.netAmount!.value) * 100) as any,
      );
      orderResult = res.result;
    }
    // update status
    await this.scope.model.paypalRecord.update({ id: recordId, status: 1 });
    // raise event
    await this.scope.event.paypalCaptureOrder.emit({
      record,
      breakdown: {
        grossAmount,
        payFee,
        netAmount,
      },
      orderResult,
    });
  }

  async cancelOrder(userId: TableIdentity, recordId: TableIdentity) {
    const record = await this.getRecord(userId, recordId);
    if (!record) this.app.throw(403);
    // check if handled
    if (record.status !== 0) this.app.throw(403);
    // update status
    await this.scope.model.paypalRecord.update({ id: recordId, status: -1 });
    // raise event
    await this.scope.event.paypalCancelOrder.emit({
      record,
    });
  }
}
