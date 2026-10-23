import type { IMonkeyAppClose } from 'vona';

import { BeanSimple } from 'vona';

export class Monkey extends BeanSimple implements IMonkeyAppClose {
  async appClose() {
    const { closeDevTransport } = await import('./lib/mcpTransport.ts');
    await closeDevTransport(this.app);
  }
}
