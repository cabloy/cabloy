import type winston from 'winston';

import type { ILoggerChildRecord, ILoggerClientRecord } from '../../types/interface/logger.ts';
import type { IModuleLocaleText } from './resource/locale/type.ts';
import type { IBeanScopeContainer } from './scope/beanScopeContainer.ts';

import { BeanBaseSimple, SymbolBeanInstanceKey, SymbolModuleBelong } from './beanBaseSimple.ts';

const SymbolText = Symbol('SymbolText');
const SymbolLogger = Symbol('SymbolLogger');
const SymbolLoggerChildren = Symbol('SymbolLoggerChildren');

export class BeanBase extends BeanBaseSimple {
  private [SymbolText]: IModuleLocaleText;
  private [SymbolLogger]: Record<keyof ILoggerClientRecord, winston.Logger> = {} as any;
  private [SymbolLoggerChildren]: Record<
    keyof ILoggerClientRecord,
    Record<string, winston.Logger>
  > = {} as any;

  protected get $text(): IModuleLocaleText {
    if (!this[SymbolText]) {
      this[SymbolText] = this.app.meta.locale.createLocaleText(this[SymbolModuleBelong]);
    }
    return this[SymbolText];
  }

  protected get $logger() {
    return this.$loggerClient('default');
  }

  protected $loggerClient(clientName: keyof ILoggerClientRecord = 'default') {
    if (!this[SymbolLogger][clientName]) {
      this[SymbolLogger][clientName] = this.app.meta.logger
        .get(clientName)
        .child({ beanFullName: this.$beanFullName });
    }
    return this[SymbolLogger][clientName];
  }

  protected $loggerChild(
    childName: keyof ILoggerChildRecord,
    clientName: keyof ILoggerClientRecord = 'default',
  ) {
    if (!this[SymbolLoggerChildren][clientName])
      this[SymbolLoggerChildren][clientName] = {} as never;
    if (!this[SymbolLoggerChildren][clientName][childName]) {
      this[SymbolLoggerChildren][clientName][childName] = this.app.meta.logger
        .get(clientName)
        .child({
          beanFullName: this.$beanFullName,
          name: childName,
        });
    }
    return this[SymbolLoggerChildren][clientName][childName];
  }

  protected $mutate(args: any[]) {
    this.app.meta.hmr.mutateBeanInstance(this.$beanFullName, this[SymbolBeanInstanceKey], args);
  }

  protected get $scope(): IBeanScopeContainer {
    return this.app.meta.scopeContainer as unknown as IBeanScopeContainer;
  }

  public get scope(): unknown {
    return this.bean.scope(this[SymbolModuleBelong] as never);
  }
}
