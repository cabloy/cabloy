import type { IMonkeySysInitialize } from 'zova';

import { BeanSimple } from 'zova';

import { SysIcon } from './bean/sys.icon.js';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {
    // $icon
    this.sys.meta.$icon = await this.bean._getBean(SysIcon, false);
  }
}
