import type { IInstanceRecord, IModuleMain, VonaContext } from 'vona';

import { BeanSimple } from 'vona';

const SymbolInstanceName = Symbol('SymbolInstanceName');

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {
    this.app.context.__getInstanceName = function (this: VonaContext) {
      return __getInstanceName(this);
    };
    this.app.context.__setInstanceName = function (
      this: VonaContext,
      instanceName: keyof IInstanceRecord,
    ) {
      return __setInstanceName(this, instanceName);
    };
  }

  async configLoaded(_config: any) {}
}

function __setInstanceName(
  ctx: VonaContext,
  instanceName: keyof IInstanceRecord | undefined | null,
) {
  ctx[SymbolInstanceName] = instanceName;
}

function __getInstanceName(ctx: VonaContext) {
  if (Object.prototype.hasOwnProperty.call(ctx, SymbolInstanceName)) {
    return ctx[SymbolInstanceName];
  }

  const options = ctx.app.config.instance;

  let instanceName;

  // 1. getInstanceName
  if (instanceName === undefined && options.getInstanceName) {
    instanceName = options.getInstanceName(ctx);
  }

  // 2. query
  if (instanceName === undefined && options.queryField) {
    instanceName = ctx.request.query[options.queryField];
  }

  // 3. header
  if (instanceName === undefined && options.headerField) {
    instanceName = ctx.request.headers[options.headerField];
  }

  // 4. subdomains
  if (instanceName === undefined) {
    // subdomains
    instanceName = ctx.subdomains.join('.');
  }

  // special: null
  if (instanceName === 'null') instanceName = null;

  __setInstanceName(ctx, instanceName);
  return instanceName;
}
