import type { IMonkeyAppClose } from 'vona';

import { BeanSimple } from 'vona';

export class Monkey extends BeanSimple implements IMonkeyAppClose {
  async appClose() {
    const { closeDevTransport } = await import('./lib/devTransport.ts');
    await closeDevTransport(this.app);
  }
}
