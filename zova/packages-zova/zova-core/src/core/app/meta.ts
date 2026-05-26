import type { IModuleLocaleText } from '../../bean/resource/locale/type.ts';
import type { Constructable } from '../../decorator/type/constructable.ts';
import type { IMonkeyApp, IMonkeyController, IMonkeyModule } from '../../types/interface/monkey.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { AppComponent } from '../component/component.ts';
import { AppCookie } from '../component/cookie.ts';
import { AppError } from '../component/error.ts';
import { AppEvent } from '../component/event.ts';
import { AppLocale } from '../component/locale.ts';
import { AppModule } from '../component/module.ts';

export class AppMeta extends BeanSimple {
  module: AppModule;
  component: AppComponent;
  locale: AppLocale;
  error: AppError;
  event: AppEvent;
  cookie: AppCookie;
  text: IModuleLocaleText;

  /** @internal */
  public appMonkey?: IMonkeyModule & IMonkeyApp & IMonkeyController;

  protected __init__() {
    this.module = this.app.bean._newBeanSimple(AppModule, false);
    this.component = this.app.bean._newBeanSimple(AppComponent, false);
    this.locale = this.app.bean._newBeanSimple(AppLocale, false);
    this.error = this.app.bean._newBeanSimple(AppError, false);
    this.event = this.app.bean._newBeanSimple(AppEvent, false);
    this.cookie = this.app.bean._newBeanSimple(AppCookie, false);
    this.text = this.locale.createLocaleText();
  }

  /** @internal */
  public async initialize(
    AppMonkey?: Constructable<IMonkeyModule & IMonkeyApp & IMonkeyController>,
  ) {
    if (AppMonkey) {
      this.appMonkey = this.bean._newBeanSimple(AppMonkey, false);
    }
  }
}
