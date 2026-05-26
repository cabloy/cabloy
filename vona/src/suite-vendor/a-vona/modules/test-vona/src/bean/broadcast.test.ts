import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import assert from 'node:assert';
import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

export interface TypeBroadcastTestJobData {
  message: string;
}

@Broadcast()
export class BroadcastTest
  extends BeanBroadcastBase<TypeBroadcastTestJobData>
  implements IBroadcastExecute<TypeBroadcastTestJobData>
{
  async execute(data: TypeBroadcastTestJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      // do something
    }
    // locale
    assert.equal(this.ctx.locale, 'zh-cn');
    // data
    assert.equal(data.message, 'hello');
  }
}
