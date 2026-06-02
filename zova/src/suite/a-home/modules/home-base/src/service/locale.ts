import { BeanBase, ILocaleRecord } from 'zova';
import { Service } from 'zova-module-a-bean';

@Service()
export class ServiceLocale extends BeanBase {
  protected async __init__() {}

  public setLocale(locale: keyof ILocaleRecord) {
    this.app.meta.locale.current = locale;
  }
}
