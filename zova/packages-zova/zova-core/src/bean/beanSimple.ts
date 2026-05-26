import type { ZovaApplication } from '../core/app/index.ts';
import type { ZovaContext } from '../core/context/index.ts';
import type { ZovaSys } from '../core/sys/sys.ts';

export class BeanSimple {
  protected sys: ZovaSys;
  protected app: ZovaApplication;
  protected ctx: ZovaContext;

  protected get bean() {
    return this.ctx ? this.ctx.bean : this.sys.bean;
  }
}
