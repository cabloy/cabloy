import type { APIRequestContext, Page } from '@playwright/test';

import { createHash, randomBytes } from 'node:crypto';

import { expect, test } from '../scripts/managedTest.ts';

const MCP_E2E_CLIENT_NAME = 'Managed MCP browser E2E';
const MCP_E2E_CALLBACK_PATH = '/__mcp-e2e/callback';
const consentPath = '/cabloy/mcp/consent';
const unavailableText =
  'This authorization request is invalid, expired, or no longer available. Start again from the application.';
const protocolVersion = '2026-07-28';

type RegisteredClient = {
  clientId: string;
  redirectUri: string;
  resource: string;
};

async function registerClient(
  request: APIRequestContext,
  origin: string,
): Promise<RegisteredClient> {
  const response = await request.post('/mcp/register', {
    headers: { 'content-type': 'application/json' },
    data: {
      client_name: MCP_E2E_CLIENT_NAME,
      redirect_uris: [`${origin}${MCP_E2E_CALLBACK_PATH}`],
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code'],
      response_types: ['code'],
    },
  });
  expect(response.status()).toBe(201);
  expect(response.headers()['cache-control']).toBe('no-store');
  const body = await response.json();
  expect(body.token_endpoint_auth_method).toBe('none');
  expect(body.grant_types).toEqual(['authorization_code']);
  expect(body.response_types).toEqual(['code']);
  expect(body.scope).toBe('mcp:read');
  expect(body.redirect_uris).toEqual([`${origin}${MCP_E2E_CALLBACK_PATH}`]);
  expect(typeof body.client_id === 'string' && /^[\w-]{43}$/.test(body.client_id)).toBe(true);
  return {
    clientId: body.client_id,
    redirectUri: body.redirect_uris[0],
    resource: `${origin}/mcp`,
  };
}

// OAuth codes, account credentials, and access tokens must not enter retry traces,
// videos, or screenshots. Callback interception also avoids an external listener.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.beforeEach(() => {
  if (!process.env.VONA_TEST_RUN_ID) {
    throw new Error('MCP browser authorization requires the root-managed test:e2e runner');
  }
});

function createAuthorization(origin: string, clientId: string, redirectUri: string) {
  const verifier = randomBytes(32).toString('base64url');
  const state = randomBytes(16).toString('hex');
  const resource = `${origin}/mcp`;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    resource,
    scope: 'mcp:read',
    code_challenge: createHash('sha256').update(verifier).digest('base64url'),
    code_challenge_method: 'S256',
    state,
  });
  return { origin, verifier, state, redirectUri, resource, path: `/mcp/auth?${params}` };
}

type Authorization = ReturnType<typeof createAuthorization>;

function collectBrowserErrors(page: Page) {
  // Keep counts rather than retaining URLs, response bodies, or account state.
  const errors = { page: 0, console: 0, hydration: 0 };
  page.on('pageerror', () => errors.page++);
  page.on('console', message => {
    if (message.type() === 'error') errors.console++;
    if (/hydration.*mismatch|mismatch.*hydration/i.test(message.text())) errors.hydration++;
  });
  return errors;
}

function waitForApiResponse(page: Page, method: string, path: string) {
  return page.waitForResponse(response => {
    return (
      response.request().method() === method &&
      new URL(response.url()).pathname === path &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

async function beginAnonymousAuthorization(page: Page, authorization: Authorization) {
  expect((await page.context().cookies()).some(cookie => cookie.name === 'token')).toBe(false);
  const ingress = waitForApiResponse(page, 'GET', '/mcp/auth');
  await page.goto(authorization.path, { waitUntil: 'load' });
  const response = await ingress;
  expect(response.status()).toBe(302);
  expect(response.headers()['cache-control']).toBe('no-store');
  const destination = new URL(response.headers().location, authorization.origin);
  expect(destination.origin === authorization.origin).toBe(true);
  // Basic's root Web Site is the shortest enabled Site. Do not silently fall
  // back to Admin/Commerce or add a special consent-capability registration.
  expect(destination.pathname).toBe(consentPath);
  expect([...destination.searchParams.keys()]).toEqual(['request']);
  expect(Boolean(destination.searchParams.get('request'))).toBe(true);
  const pendingPath = `${destination.pathname}${destination.search}`;
  await expect(page).toHaveURL(/\/login\?(?:.*&)?returnTo=/);
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  const loginUrl = new URL(page.url());
  expect(loginUrl.pathname).toBe('/login');
  expect(loginUrl.searchParams.get('returnTo') === pendingPath).toBe(true);
  expect(loginUrl.searchParams.get('returnTo')?.includes(MCP_E2E_CALLBACK_PATH)).toBe(false);
  await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Approve', exact: true })).toHaveCount(0);
  return pendingPath;
}

async function loginAndReadConsent(page: Page, pendingPath: string, origin: string) {
  // Read-only shared account fixture already used by the existing Basic E2Es.
  const username = page.getByPlaceholder('Your Username');
  const password = page.getByPlaceholder('Your Password');
  await username.fill('admin');
  await password.fill('123456');
  await expect(username).toHaveValue('admin');
  await expect(password).toHaveValue('123456');
  await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
  const login = waitForApiResponse(page, 'POST', '/api/home/user/passport/login');
  const summary = waitForApiResponse(page, 'GET', '/mcp/auth/summary');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  expect((await login).ok()).toBe(true);
  const summaryResponse = await summary;
  expect(summaryResponse.ok()).toBe(true);
  expect(new URL(summaryResponse.url()).origin === origin).toBe(true);
  expect(new URL(page.url()).pathname + new URL(page.url()).search === pendingPath).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  await expect(
    page.getByRole('heading', { name: 'Authorize MCP access', exact: true }),
  ).toBeVisible();
  await expect(page.getByText(MCP_E2E_CLIENT_NAME, { exact: true })).toBeVisible();
  await expect(page.getByText(`${origin}/mcp`, { exact: true })).toBeVisible();
  await expect(page.getByText('mcp:read', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Approve', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Deny', exact: true })).toBeEnabled();
  expect((await page.context().cookies()).some(cookie => cookie.name === 'token')).toBe(true);
}

async function decideAndCaptureCallback(page: Page, authorization: Authorization, allow: boolean) {
  let callback: URL | undefined;
  await page.route(
    url => url.origin === authorization.origin && url.pathname === MCP_E2E_CALLBACK_PATH,
    async route => {
      callback = new URL(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body><h1>MCP test callback</h1></body></html>',
      });
    },
  );
  const decision = waitForApiResponse(page, 'POST', '/mcp/auth/decision');
  await page.getByRole('button', { name: allow ? 'Approve' : 'Deny', exact: true }).click();
  const response = await decision;
  expect(response.ok()).toBe(true);
  expect(response.headers()['cache-control']).toContain('no-store');
  await expect(page.getByRole('heading', { name: 'MCP test callback' })).toBeVisible();
  if (!callback) throw new Error('Registered MCP callback was not requested');
  expect(callback.origin === authorization.origin).toBe(true);
  expect(callback.pathname).toBe(MCP_E2E_CALLBACK_PATH);
  expect(callback.searchParams.get('state') === authorization.state).toBe(true);
  expect(callback.searchParams.get('iss') === authorization.resource).toBe(true);
  expect(callback.searchParams.has('access_token')).toBe(false);
  return callback;
}

async function redeem(
  request: APIRequestContext,
  authorization: Authorization,
  clientId: string,
  code: string,
) {
  return await request.post('/mcp/token', {
    form: {
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: authorization.redirectUri,
      resource: authorization.resource,
      code_verifier: authorization.verifier,
    },
  });
}

async function callMcp(
  request: APIRequestContext,
  method: string,
  params: Record<string, unknown> = {},
  token?: string,
) {
  return await request.post('/mcp', {
    headers: {
      'Accept': 'application/json, text/event-stream',
      'mcp-protocol-version': protocolVersion,
      'mcp-method': method,
      ...(typeof params.name === 'string' ? { 'mcp-name': params.name } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method,
      params: {
        ...params,
        _meta: {
          'io.modelcontextprotocol/protocolVersion': protocolVersion,
          'io.modelcontextprotocol/clientCapabilities': {},
        },
      },
    },
  });
}

test(
  'MCP browser authorization: anonymous login, explicit approval, PKCE exchange and bearer tools',
  { tag: ['@web', '@ssr', '@mcp', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const issuer = `${origin}/mcp`;
    const metadata = await request.get('/.well-known/oauth-authorization-server/mcp');
    expect(metadata.status()).toBe(200);
    expect(metadata.headers()['cache-control']).toBe('no-store');
    expect(await metadata.json()).toMatchObject({
      issuer,
      authorization_endpoint: `${issuer}/auth`,
      token_endpoint: `${issuer}/token`,
      registration_endpoint: `${issuer}/register`,
    });
    const resourceMetadata = await request.get('/.well-known/oauth-protected-resource/mcp');
    expect(resourceMetadata.status()).toBe(200);
    expect(await resourceMetadata.json()).toMatchObject({
      resource: issuer,
      authorization_servers: [issuer],
    });
    const client = await registerClient(request, origin);
    const authorization = createAuthorization(origin, client.clientId, client.redirectUri);
    const errors = collectBrowserErrors(page);
    const pendingPath = await beginAnonymousAuthorization(page, authorization);
    await loginAndReadConsent(page, pendingPath, authorization.origin);

    // Existing SSR cookies admit a direct document request, while private query
    // data remains absent until hydration (no token/bridge bootstrap of our own).
    const document = await page.request.get(pendingPath);
    expect(document.ok()).toBe(true);
    expect(document.headers()['cache-control']).toBe('private, no-store');
    const html = await document.text();
    expect(html).toContain('Loading authorization request');
    expect(html).not.toContain(MCP_E2E_CLIENT_NAME);
    expect(html).not.toContain('data-zova-hydrated');
    const summary = waitForApiResponse(page, 'GET', '/mcp/auth/summary');
    await page.reload({ waitUntil: 'load' });
    expect((await summary).ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page.getByText(MCP_E2E_CLIENT_NAME, { exact: true })).toBeVisible();

    const callback = await decideAndCaptureCallback(page, authorization, true);
    expect(callback.searchParams.has('error')).toBe(false);
    const code = callback.searchParams.get('code');
    if (!code) throw new Error('Approval callback did not contain an authorization code');
    const exchange = await redeem(request, authorization, client.clientId, code);
    expect(exchange.status()).toBe(200);
    expect(exchange.headers()['cache-control']).toBe('no-store');
    const token = await exchange.json();
    expect(token.token_type).toBe('Bearer');
    expect(token.scope).toBe('mcp:read');
    expect(token.expires_in).toBe(900);
    expect(token.refresh_token === undefined).toBe(true);
    expect(typeof token.access_token === 'string' && /^[\w-]{43}$/.test(token.access_token)).toBe(
      true,
    );
    expect(token.access_token === code).toBe(false);

    const anonymous = await callMcp(request, 'server/discover');
    expect(anonymous.status()).toBe(401);
    expect(anonymous.headers()['www-authenticate']).toContain('Bearer');
    const discovery = await callMcp(request, 'server/discover', {}, token.access_token);
    expect(discovery.status()).toBe(200);
    expect((await discovery.json()).result.supportedVersions).toContain(protocolVersion);
    const categories = await callMcp(
      request,
      'tools/call',
      { name: 'commerce_categories_list', arguments: {} },
      token.access_token,
    );
    expect(categories.status()).toBe(200);
    const result = (await categories.json()).result;
    expect(result.isError === true).toBe(false);
    expect(
      result.structuredContent.list.some((item: { name: string }) => item.name === 'Electronics'),
    ).toBe(true);
    expect(
      result.structuredContent.list.some((item: { name: string }) => item.name === 'Private'),
    ).toBe(false);

    const replay = await redeem(request, authorization, client.clientId, code);
    expect(replay.status()).toBe(400);
    expect((await replay.json()).error).toBe('invalid_grant');
    expect(errors).toEqual({ page: 0, console: 0, hydration: 0 });
    // AS rows live only in this root-run-owned disposable database, which the
    // managed runner removes. The shared seeded account/catalogue are read-only.
  },
);

test(
  'MCP browser authorization: denial returns only access_denied and closes the pending request',
  { tag: ['@web', '@ssr', '@mcp'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const client = await registerClient(request, origin);
    const authorization = createAuthorization(origin, client.clientId, client.redirectUri);
    const errors = collectBrowserErrors(page);
    const pendingPath = await beginAnonymousAuthorization(page, authorization);
    await loginAndReadConsent(page, pendingPath, authorization.origin);
    const callback = await decideAndCaptureCallback(page, authorization, false);
    expect(callback.searchParams.get('error')).toBe('access_denied');
    expect(callback.searchParams.has('code')).toBe(false);
    expect(errors).toEqual({ page: 0, console: 0, hydration: 0 });

    // Exercise the real server's terminal-request rejection, not a mocked API.
    const summary = waitForApiResponse(page, 'GET', '/mcp/auth/summary');
    await page.goto(pendingPath, { waitUntil: 'load' });
    expect((await summary).ok()).toBe(false);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page.getByRole('alert')).toHaveText(unavailableText);
    await expect(page.getByRole('button', { name: 'Approve', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Deny', exact: true })).toHaveCount(0);
    expect(errors.page).toBe(0);
    expect(errors.hydration).toBe(0);
    // A failed summary may produce the browser's expected HTTP-error console entry.
  },
);

test(
  'MCP browser authorization: unregistered redirect fails locally and invalid requests cannot approve',
  { tag: ['@web', '@ssr', '@mcp'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const client = await registerClient(request, origin);
    const authorization = createAuthorization(origin, client.clientId, client.redirectUri);
    const invalid = new URL(authorization.path, authorization.origin);
    invalid.searchParams.set('redirect_uri', `${authorization.origin}/not-registered`);
    const rejected = await request.get(invalid.href, { maxRedirects: 0 });
    expect(rejected.status()).toBe(400);
    expect(rejected.headers().location === undefined).toBe(true);
    expect((await rejected.json()).error).toBe('invalid_request');

    const errors = collectBrowserErrors(page);
    const pendingPath = await beginAnonymousAuthorization(page, authorization);
    await loginAndReadConsent(page, pendingPath, authorization.origin);
    const before = { ...errors };
    const summary = waitForApiResponse(page, 'GET', '/mcp/auth/summary');
    // Well-formed but nonexistent locator follows the same safe unavailable UI
    // as expiry. Real deadline enforcement is covered by the AS managed tests.
    await page.goto(`${consentPath}?request=${'x'.repeat(43)}`, { waitUntil: 'load' });
    expect((await summary).ok()).toBe(false);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page.getByRole('alert')).toHaveText(unavailableText);
    await expect(page.getByRole('button', { name: 'Approve', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Deny', exact: true })).toHaveCount(0);
    expect(before).toEqual({ page: 0, console: 0, hydration: 0 });
    expect(errors.page).toBe(0);
    expect(errors.hydration).toBe(0);
  },
);
