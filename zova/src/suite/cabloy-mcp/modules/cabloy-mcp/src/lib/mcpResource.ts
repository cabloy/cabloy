import type { ZovaConfigEnv } from 'zova';

export function getMcpResource(env: ZovaConfigEnv): string {
  return new URL(`/mcp/${env.SITE_ID}`, env.API_BASE_URL).href;
}
