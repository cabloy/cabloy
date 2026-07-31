import type { ZovaOpenapiConfig } from 'zova-openapi';

export default function (): ZovaOpenapiConfig {
  const apiBaseURL = process.env.API_BASE_URL;
  if (!apiBaseURL) {
    throw new Error('Missing API_BASE_URL');
  }
  return {
    default: {
      source: `${apiBaseURL.replace(/\/$/, '')}/swagger/json?version=V31`,
    },
    modules: {},
  };
}
