import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { TypePaymentOutcome } from '../entity/paymentAudit.tsx';

export interface IPaymentProviderAdapter {
  readonly provider: 'mock';
  normalizeOutcome(outcome: TypePaymentOutcome): TypePaymentOutcome;
}

@Service()
export class ServiceMockPaymentAdapter extends BeanBase implements IPaymentProviderAdapter {
  readonly provider = 'mock' as const;

  normalizeOutcome(outcome: TypePaymentOutcome): TypePaymentOutcome {
    return outcome;
  }
}
