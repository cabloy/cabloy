import type { IDatabaseClientRecord } from 'vona-module-a-orm';

import { getRandomInt } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceDatasharding extends BeanBase {
  getClientReads(): (keyof IDatabaseClientRecord)[] {
    let reads = this.scope.config.client.reads;
    if (typeof reads === 'function') {
      reads = reads(this.ctx);
    }
    return reads;
  }

  getClientWrites(): (keyof IDatabaseClientRecord)[] {
    let writes = this.scope.config.client.writes;
    if (typeof writes === 'function') {
      writes = writes(this.ctx);
    }
    return writes;
  }

  getRandomRead(): keyof IDatabaseClientRecord {
    const reads = this.getClientReads();
    const randomRead = this.scope.config.client.randomRead;
    let clientName: keyof IDatabaseClientRecord | undefined;
    if (typeof randomRead === 'function') {
      clientName = randomRead(this.ctx, reads);
    } else {
      clientName = this._getRandomClientName(reads);
    }
    return clientName ?? this.$scope.orm.service.database.getDefaultClientName();
  }

  getRandomWrite(): keyof IDatabaseClientRecord {
    const writes = this.getClientWrites();
    const randomWrite = this.scope.config.client.randomWrite;
    let clientName: keyof IDatabaseClientRecord | undefined;
    if (typeof randomWrite === 'function') {
      clientName = randomWrite(this.ctx, writes);
    } else {
      clientName = this._getRandomClientName(writes);
    }
    return clientName ?? this.$scope.orm.service.database.getDefaultClientName();
  }

  private _getRandomClientName(
    clientNames: (keyof IDatabaseClientRecord)[],
  ): keyof IDatabaseClientRecord | undefined {
    return clientNames[getRandomInt(clientNames.length)];
  }
}
