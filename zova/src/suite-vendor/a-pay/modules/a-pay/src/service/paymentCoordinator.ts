import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';

import type { TypePaymentNextAction } from '../types/payment.js';

@Service()
export class ServicePaymentCoordinator extends BeanBase {
  async execute(action: TypePaymentNextAction) {
    if (action.kind !== 'redirect') return;
    if (!process.env.CLIENT) return;
    window.location.assign(action.url);
  }
}
