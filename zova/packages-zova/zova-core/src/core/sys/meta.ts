import type { RouteRecordRaw } from '@cabloy/vue-router';

import type { Constructable } from '../../decorator/type/constructable.ts';
import type { IMonkeyModuleSys, IMonkeySys } from '../../types/interface/monkey.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { AppCookie } from '../component/cookie.ts';
import { AppEvent } from '../component/event.ts';
import { SysLogger } from '../logger/logger.ts';
import { SysComponent } from './component.ts';
import { SysError } from './error.ts';
import { SysLocale } from './locale.ts';
import { SysModule } from './module.ts';

export class SysMeta extends BeanSimple {
  module: SysModule;
  component: SysComponent;
  logger: SysLogger;
  locale: SysLocale;
  error: SysError;
  event: AppEvent;
  cookie: AppCookie;

  /** @internal */
  public sysMonkey?: IMonkeyModuleSys & IMonkeySys;

  /** @internal */
  public legacyRoutes?: RouteRecordRaw[];

  protected __init__() {
    this.module = this.bean._newBeanSimple(SysModule, false);
    this.component = this.bean._newBeanSimple(SysComponent, false);
    this.logger = this.bean._newBeanSimple(SysLogger, false);
    this.locale = this.bean._newBeanSimple(SysLocale, false);
    this.error = this.bean._newBeanSimple(SysError, false);
    this.event = this.bean._newBeanSimple(AppEvent, false);
    this.cookie = this.bean._newBeanSimple(AppCookie, false);
  }

  /** @internal */
  public dispose() {
    this.event.dispose();
    this.module.dispose();
    this.component.dispose();
    this.logger.dispose();
    this.locale.dispose();
    this.error.dispose();
    this.sysMonkey = undefined;
    this.legacyRoutes = undefined;
  }

  /** @internal */
  public async initialize(
    SysMonkey?: Constructable<IMonkeyModuleSys & IMonkeySys>,
    legacyRoutes?: RouteRecordRaw[],
  ) {
    if (SysMonkey) {
      this.sysMonkey = this.bean._newBeanSimple(SysMonkey, false);
    }
    this.legacyRoutes = legacyRoutes;
  }
}
