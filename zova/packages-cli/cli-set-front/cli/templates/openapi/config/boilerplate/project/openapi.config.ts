import type { ZovaOpenapiConfig } from 'zova-openapi';

export default function (): ZovaOpenapiConfig {
  return {
    default: {
      source: 'http://localhost:7102/swagger/json?version=V31',
    },
    modules: {},
  };
}
