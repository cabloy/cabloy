import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoOperatorContext } from '../dto/operatorContext.ts';

@Service()
export class ServiceOperator extends BeanBase {
  context(): DtoOperatorContext {
    const { instance, instanceName } = this.ctx;
    const user = this.bean.passport.current!.user!;
    return {
      instanceId: instance.id.toString(),
      instanceName: instanceName ?? '',
      userId: user.id.toString(),
      userName: user.name,
    };
  }
}
