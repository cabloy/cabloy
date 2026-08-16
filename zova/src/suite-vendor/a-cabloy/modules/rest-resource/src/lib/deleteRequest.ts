import type { AxiosRequestConfig } from 'axios';

export function prepareDeleteRequestConfig<TBody>(
  config: AxiosRequestConfig<TBody>,
  body: TBody,
): AxiosRequestConfig<TBody> {
  if (body === undefined) return config;
  return {
    ...config,
    data: body,
  };
}
