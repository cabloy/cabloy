import type { VonaConfigMeta } from '@cabloy/module-info';

import type { ConfigLogger, IBeanScopeConfig } from '../../index.ts';
import type { PowerPartial } from '../utils/powerPartial.ts';

// @ts-ignore ignore the throw type check of 'development'
export interface VonaConfig {
  meta: VonaConfigMeta;
  server: {
    keys: string[];
    globalPrefix: string;
    publicDir: string;
    subdomainOffset: number;
    workers: number;
    listen: {
      hostname: string;
      port: number;
      disable: boolean;
    };
    serve: {
      protocol: string;
      host: string;
    };
  };
  proxy: {
    enable: boolean;
    ipHeaders: string;
    hostHeaders: string;
    protocolHeaders: string;
    maxProxyCount: number;
    maxIpsCount: number;
  };
  logger: ConfigLogger;
  //
  modules: IBeanScopeConfig;
}

export type VonaConfigOptional = PowerPartial<VonaConfig>;
