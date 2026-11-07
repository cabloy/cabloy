import type { IMonkeyAppClose } from 'vona';

import { BeanSimple } from 'vona';

export class Monkey extends BeanSimple implements IMonkeyAppClose {
  async appClose() {
    const { closeMcpTransport } = await import('./lib/mcpTransport.ts');
    await closeMcpTransport(this.app);
  }
}
