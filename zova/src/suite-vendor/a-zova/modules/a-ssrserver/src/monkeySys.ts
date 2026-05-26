import type { IMonkeySysInitialize } from 'zova';

import { BeanSimple } from 'zova';

import { ServiceSsrHandler } from './service/ssrHandler.js';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {
    this.sys.meta.$getSsrHandler = async (siteAssetDir: string): Promise<ServiceSsrHandler> => {
      return await this.sys.bean._getBean(ServiceSsrHandler, false, siteAssetDir);
    };
  }
}
