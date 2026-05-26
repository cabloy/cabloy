import type { Server } from 'node:http';

import KoaApplication from 'koa';

import type { KoaApplicationOptions, VonaApplicationOptions } from '../../types/application/app.ts';
import type { VonaConfig } from '../../types/config/config.ts';
import type { VonaContext } from '../../types/context/index.ts';
import type { ApplicationError } from '../bean/resource/error/errorApplication.ts';
import type { IBeanScopeRecord, TypeBeanScopeRecordKeys } from '../bean/type.ts';

import { cast } from '../../types/utils/cast.ts';
import { BeanContainer } from '../bean/beanContainer.ts';
import { closeApp } from '../framework/useApp.ts';
import { AppUtil } from '../utils/util.ts';
import { VonaAsyncLocalStorage } from './asyncLocalStorage.ts';
import { contextBase } from './context.ts';
import { AppMeta } from './meta.ts';
import { ResponseMock } from './response.ts';

export interface VonaApplication extends ApplicationError {}

export class VonaApplication extends KoaApplication {
  options: VonaApplicationOptions;
  config: VonaConfig;
  bean: BeanContainer;
  util: AppUtil;
  meta: AppMeta;
  server: Server;
  ctxStorage: VonaAsyncLocalStorage;

  constructor(options: VonaApplicationOptions) {
    const env = options.env;
    const koaOptions: KoaApplicationOptions = {
      env: cast(env).NODE_ENV,
      asyncLocalStorage: false,
    };
    super(koaOptions);
    this.options = options;
    this.bean = BeanContainer.create(this, undefined);
    this.util = this.bean._newBean(AppUtil);
    this.meta = this.bean._newBean(AppMeta, env);
    // asyncLocalStorage
    this.ctxStorage = new VonaAsyncLocalStorage(this);
    // app.context
    for (const key of Reflect.ownKeys(contextBase)) {
      const desc = Object.getOwnPropertyDescriptor(contextBase, key)!;
      Object.defineProperty(this.context, key, desc);
    }
  }

  get name() {
    return this.options.name;
  }

  get projectPath() {
    return this.options.projectPath;
  }

  get ctx(): VonaContext {
    return this.currentContext as unknown as VonaContext;
  }

  /** get specific module's scope */
  scope<K extends TypeBeanScopeRecordKeys>(moduleScope: K): IBeanScopeRecord[K];
  // scope<T>(moduleScope: string): T;
  scope<T>(moduleScope: string): T {
    return this.bean.scope(moduleScope as never);
  }

  createAnonymousContext(req?: any, res?: any): VonaContext {
    let request;
    if (req) {
      request = req;
    } else {
      const host = `localhost:${this.meta.env.SERVER_LISTEN_PORT}`;
      request = {
        headers: {
          'host': host,
          'x-forwarded-for': host,
        },
        query: {},
        querystring: '',
        host,
        hostname: 'localhost',
        protocol: 'http',
        secure: 'false',
        method: 'POST',
        url: '',
        path: '',
        socket: {
          remoteAddress: '127.0.0.1',
          remotePort: 7001,
        },
      };
    }
    const response = res ?? new ResponseMock();
    return this.createContext(request as any, response) as unknown as VonaContext;
  }

  async close() {
    await closeApp();
  }
}
