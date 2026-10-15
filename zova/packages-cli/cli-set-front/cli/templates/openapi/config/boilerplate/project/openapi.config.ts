import type { ZovaOpenapiConfig } from 'zova-openapi';

export function resolveOpenapiSource(
  apiBaseURL = process.env.API_BASE_URL,
  sourceOverride = process.env.OPENAPI_SOURCE_URL,
) {
  const override = sourceOverride?.trim();
  if (override) return override;
  const baseURL = apiBaseURL?.trim();
  if (!baseURL) {
    throw new Error('Missing API_BASE_URL');
  }
  return `${baseURL.replace(/\/$/, '')}/swagger/json?version=V31`;
}

export default function (): ZovaOpenapiConfig {
  return {
    default: {
      source: resolveOpenapiSource(),
    },
    modules: {},
  };
}
