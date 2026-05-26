import { checkMeta, isNil, matchSelector } from '@cabloy/utils';
import { BeanBase, ProxyDisable } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IOnionOptionsEnable,
  IOnionOptionsMatch,
  IOnionOptionsMeta,
  TypeOnionOptionsMatchRules,
} from '../types/onion.ts';

import { ServiceOnion } from '../service/onion_.ts';

@ProxyDisable()
@Bean()
export class BeanOnion extends BeanBase {
  private __instances: Record<string, any> = {};

  protected __get__(prop: string) {
    if (!this.__instances[prop]) {
      this.__instances[prop] = this.bean._getBeanSelector(ServiceOnion, prop);
    }
    return this.__instances[prop];
  }

  public checkOnionOptionsEnabled(
    options: IOnionOptionsEnable & IOnionOptionsMatch<any>,
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ) {
    if (options.enable === false) return false;
    if (!this.checkOnionOptionsMeta(options.meta)) return false;
    if (isNil(selector) || selector === false) return true;
    if (isNil(options.match) && isNil(options.ignore)) return true;
    matchThis = matchThis ?? this.app;
    return (
      (!isNil(options.match) &&
        __onionMatchSelector(options.match, selector, matchThis, ...matchArgs)) ||
      (!isNil(options.ignore) &&
        !__onionMatchSelector(options.ignore, selector, matchThis, ...matchArgs))
    );
  }

  public checkOnionOptionsMeta(meta?: IOnionOptionsMeta) {
    let metaCurrent = this.app.config.meta;
    if (this.app.ctx) {
      metaCurrent = Object.assign({}, metaCurrent, {
        instanceName: this.app.ctx.instanceName,
        host: this.app.ctx.host,
      });
    }
    return checkMeta(meta, metaCurrent);
  }
}

function __onionMatchSelector(
  match: TypeOnionOptionsMatchRules<string>,
  selector: string | boolean,
  matchThis: any,
  ...matchArgs: any[]
) {
  return matchSelector(match, selector, matchThis, ...matchArgs);
}
