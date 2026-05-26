import '@cabloy/vue-router';
import type { StringValue } from 'ms';

export interface ISsrConfigTransferCache {
  expires?: number | StringValue;
}

export interface ISsrConfig {
  cookieThemeDarkDefault: boolean;
  optimization: {
    bodyReadyObserver: boolean;
  };
  transferCache: false | ISsrConfigTransferCache;
}

declare module '@cabloy/vue-router' {
  export interface RouteMeta {
    transferCache?: false | ISsrConfigTransferCache;
  }
}
