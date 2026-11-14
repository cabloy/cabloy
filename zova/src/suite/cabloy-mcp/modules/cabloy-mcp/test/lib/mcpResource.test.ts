import type { ZovaConfigEnv } from 'zova';

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getMcpResource } from '../../src/lib/mcpResource.ts';

describe('MCP resource public origin', () => {
  it('uses the public API origin even when standalone retains the Vona flag', () => {
    const env = {
      SITE_ID: 'admin',
      API_BASE_URL: 'http://localhost:7102',
      SSR_API_BASE_URL: 'http://internal-api:7102',
      SSR_WITH_VONA: 'true',
      SSR_PROD_PROTOCOL: 'http',
      SSR_PROD_HOST: 'localhost:3000',
    } as ZovaConfigEnv;
    assert.equal(getMcpResource(env), 'http://localhost:7102/mcp/admin');
    assert.equal(
      getMcpResource({ ...env, SSR_WITH_VONA: 'false' }),
      'http://localhost:7102/mcp/admin',
    );
  });

  it('uses the public backend origin without frontend or API path prefixes', () => {
    const env = {
      SITE_ID: 'web',
      API_BASE_URL: 'https://public.example.test/api',
      SSR_API_BASE_URL: 'http://internal-api:7102',
      APP_PUBLIC_PATH: 'admin',
    } as ZovaConfigEnv;
    assert.equal(getMcpResource(env), 'https://public.example.test/mcp/web');
  });
});
