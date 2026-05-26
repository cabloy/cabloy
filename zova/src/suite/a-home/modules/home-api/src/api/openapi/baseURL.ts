import type { ZovaSys } from 'zova';

export const OpenApiBaseURL = (sys: ZovaSys) => {
  return sys.util.getOpenApiBaseURL('OPENAPI_BASE_URL_HOME_API');
};
