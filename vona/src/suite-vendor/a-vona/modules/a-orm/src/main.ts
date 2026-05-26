import type { FunctionAny, IModuleMain, PowerPartial, VonaApplication, VonaContext } from 'vona';

import { BeanSimple, cast, combineConfigDefault, deepExtend } from 'vona';
import { ServiceDatabaseAsyncLocalStorage, ServiceTransactionConsistency‌ } from 'vona-module-a-orm';

import type { ConfigDatabase } from './types/config.ts';

import { ExtendKnex } from './extend/index.ts';

const SymbolTransactionConsistency = Symbol('SymbolTransactionConsistency');

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {
    // config
    const _configDefault = await combineConfigDefault<ConfigDatabase>(
      this.app,
      configDefault,
      configDev,
      configProd,
      configTest,
    );
    this.app.config.database = deepExtend({}, _configDefault, this.app.config.database);
  }

  async moduleLoaded() {
    // ExtendKnex
    ExtendKnex(this.app);
    // db
    Object.defineProperty(this.app.context, 'db', {
      enumerable: false,
      get(this: VonaContext) {
        return this.app.bean._getBean(ServiceDatabaseAsyncLocalStorage).current;
      },
    });
    // transactionConsistency
    Object.defineProperty(this.app.context, 'transactionConsistency', {
      enumerable: false,
      get(this: VonaContext) {
        if (!this[SymbolTransactionConsistency]) {
          this[SymbolTransactionConsistency] = this.app.bean._newBean(
            ServiceTransactionConsistency‌,
          );
        }
        return this[SymbolTransactionConsistency];
      },
    });
    // commit
    Object.defineProperty(this.app.context, 'commit', {
      enumerable: false,
      get() {
        return function (this: VonaContext, cb: FunctionAny) {
          if (this.ctxCaller) {
            this.ctxCaller.commit(cb);
          } else {
            cast(this).transactionConsistency.commit(cb);
          }
        };
      },
    });
    Object.defineProperty(this.app.context, 'commitsDone', {
      enumerable: false,
      get() {
        return function (this: VonaContext) {
          return cast(this).transactionConsistency.commitsDone();
        };
      },
    });
  }

  async configLoaded(_config) {}
}

export async function configDefault(_app: VonaApplication): Promise<PowerPartial<ConfigDatabase>> {
  return {};
}

async function configDev(_app: VonaApplication): Promise<PowerPartial<ConfigDatabase>> {
  return {};
}

async function configProd(_app: VonaApplication): Promise<PowerPartial<ConfigDatabase>> {
  return {};
}

async function configTest(_app: VonaApplication): Promise<PowerPartial<ConfigDatabase>> {
  return {};
}
