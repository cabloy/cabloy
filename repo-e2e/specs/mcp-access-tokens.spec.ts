import type { APIRequestContext, Page } from '@playwright/test';

import { randomBytes } from 'node:crypto';

import { expect, test } from '../scripts/managedTest.ts';

const accountPath = '/home/user/account';
const accessTokensPath = '/cabloy/mcp/accessTokens';
const accessTokenApiPath = '/api/mcp/auth/accessToken';
const customScopeApiPath = '/api/mcp/auth/customScope';
const readToolName = 'mcp_e2e_access_token_read';
const protocolVersion = '2026-07-28';
const sevenDays = 604800;
const oneYear = 365 * 24 * 60 * 60;

type Headers = Record<string, string>;
type McpAccount = { id: string | number; username: string; password: string; headers: Headers };
type PassportJwt = {
  passport: { user: { id: McpAccount['id'] }; roles: Array<{ name: string }> };
  jwt: { accessToken: string };
};
type AccessToken = {
  id: string | number;
  accessToken: string;
  resource: string;
  scope: string;
  tokenExpiresAt: number;
};
type SafeAccessToken = Omit<AccessToken, 'accessToken' | 'resource'> & {
  name: string;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
};
type PersonalScope = { id: string | number; name: string; scope: string };

// Neither credentials nor the one-time reveal may enter retained browser artifacts.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.beforeEach(() => {
  if (!process.env.VONA_TEST_RUN_ID) {
    throw new Error('MCP access-token browser tests require the root-managed test:e2e runner');
  }
});

function waitForApiResponse(page: Page, method: string, path: string) {
  return page.waitForResponse(response => {
    return (
      response.request().method() === method &&
      new URL(response.url()).pathname === path &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

async function createCaptcha(request: APIRequestContext) {
  const response = await request.post('/api/captcha/create', {
    data: { scene: 'captcha-simple:simple' },
  });
  expect(response.ok()).toBe(true);
  const { id, token } = (await response.json()).data;
  expect(typeof id === 'string' && typeof token === 'string').toBe(true);
  return { id, token };
}

async function loginMcpAccount(request: APIRequestContext, account: McpAccount) {
  const response = await request.post('/api/home/user/passport/login', {
    data: {
      username: account.username,
      password: account.password,
      captcha: await createCaptcha(request),
    },
  });
  expect(response.ok()).toBe(true);
  const login = (await response.json()).data as PassportJwt;
  expect(String(login.passport.user.id) === String(account.id)).toBe(true);
  const roles = login.passport.roles.map(role => role.name);
  expect(roles).toContain('registeredUser');
  expect(roles).not.toContain('systemAdmin');
  account.headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${login.jwt.accessToken}`,
  };
}

async function registerMcpAccount(
  request: APIRequestContext,
  origin: string,
  onRegistered: (account: McpAccount) => void,
) {
  // The established self-register/activate/removeCurrentFixture lifecycle owns every user.
  const username = `e2e-fixture-mcp-token-${randomBytes(12).toString('hex')}`;
  const password = 'account-e2e-password';
  const response = await request.post('/api/home/user/passport/register', {
    data: {
      username,
      email: `${username}@example.test`,
      password,
      passwordConfirm: password,
      consumerUrl: `${origin}/home/user/activation`,
      captcha: await createCaptcha(request),
    },
  });
  expect(response.ok()).toBe(true);
  const registered = (await response.json()).data as PassportJwt;
  const account = {
    id: registered.passport.user.id,
    username,
    password,
    headers: { Accept: 'application/json', Authorization: `Bearer ${registered.jwt.accessToken}` },
  };
  onRegistered(account);
  const activated = await request.post('/api/home/user/passportTest/activateCurrent', {
    headers: account.headers,
  });
  expect(activated.ok()).toBe(true);
  await loginMcpAccount(request, account);
  return account;
}

async function loginBrowser(page: Page, account: McpAccount) {
  await page.goto(accountPath, { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  await page.getByPlaceholder('Your Username').fill(account.username);
  await page.getByPlaceholder('Your Password').fill(account.password);
  await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
  const login = waitForApiResponse(page, 'POST', '/api/home/user/passport/login');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  expect((await login).ok()).toBe(true);
  await expect(page).toHaveURL(accountPath);
  const link = page
    .getByTestId('mine-navigation')
    .getByRole('link', { name: 'MCP access tokens', exact: true });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', accessTokensPath);
  await link.click();
  await expect(page).toHaveURL(accessTokensPath);
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  await expect(page.getByTestId('mcp-access-tokens')).toBeVisible();
}

async function readMine(request: APIRequestContext, headers: Headers): Promise<SafeAccessToken[]> {
  const response = await request.get(`${accessTokenApiPath}/mine?ssrSiteId=web`, { headers });
  expect(response.ok()).toBe(true);
  expect(response.headers()['cache-control']).toContain('no-store');
  const list = (await response.json()).data.list as SafeAccessToken[];
  const safeKeys = ['id', 'name', 'scope', 'createdAt', 'tokenExpiresAt', 'status'];
  // Do not compare/print entire API objects if the safe projection ever regresses.
  expect(list.every(row => Object.keys(row).every(key => safeKeys.includes(key)))).toBe(true);
  expect(list.every(row => ['active', 'expired', 'revoked'].includes(row.status))).toBe(true);
  return list;
}

async function callMcp(
  request: APIRequestContext,
  token: string,
  method: string,
  params: Record<string, unknown> = {},
) {
  // initialize negotiates the supported compatibility transport; ordinary calls use current MCP.
  const initialize = method === 'initialize';
  return await request.post('/mcp/web', {
    headers: {
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${token}`,
      ...(initialize
        ? {}
        : {
            'mcp-protocol-version': protocolVersion,
            'mcp-method': method,
            ...(typeof params.name === 'string' ? { 'mcp-name': params.name } : {}),
          }),
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method,
      params: initialize
        ? {
            protocolVersion: '2025-11-25',
            capabilities: {},
            clientInfo: { name: 'Managed MCP access-token E2E', version: '1' },
          }
        : {
            ...params,
            _meta: {
              'io.modelcontextprotocol/protocolVersion': protocolVersion,
              'io.modelcontextprotocol/clientCapabilities': {},
            },
          },
    },
  });
}

async function verifyReadTool(request: APIRequestContext, token: string, custom = false) {
  const listed = await callMcp(request, token, 'tools/list');
  expect(listed.status()).toBe(200);
  const tools = (await listed.json()).result.tools as Array<{
    name: string;
    annotations?: { readOnlyHint?: boolean };
  }>;
  expect(tools.some(tool => tool.name === readToolName && tool.annotations?.readOnlyHint)).toBe(
    true,
  );
  if (custom) {
    expect(tools.map(tool => tool.name).sort()).toEqual(
      [readToolName, 'cabloy_tool_contract', 'cabloy_logout'].sort(),
    );
  }
  const called = await callMcp(request, token, 'tools/call', {
    name: readToolName,
    arguments: {},
  });
  expect(called.status()).toBe(200);
  const result = (await called.json()).result;
  expect(result.isError === true).toBe(false);
  expect(result.structuredContent).toEqual({ result: ['safe', 'array'] });
}

async function createBrowserToken(
  page: Page,
  origin: string,
  name: string,
  scope = 'mcp:read',
  expiresIn = sevenDays,
): Promise<AccessToken> {
  await page.getByTestId('mcp-access-token-create').click();
  const form = page.getByTestId('mcp-access-token-create-form');
  await expect(form).toBeVisible();
  await expect(page.getByTestId('mcp-access-token-scope')).toHaveValue('mcp:read');
  await expect(form).toContainText('Lifetime (days)');
  await expect(page.getByTestId('mcp-access-token-expires-in')).toHaveValue('7');
  await page.getByTestId('mcp-access-token-name').fill(name);
  if (scope !== 'mcp:read') {
    await page.getByTestId('mcp-access-token-scope').selectOption(scope);
  }
  if (expiresIn !== sevenDays) {
    await page.getByTestId('mcp-access-token-expires-in').fill(String(expiresIn / 86400));
  }
  const created = waitForApiResponse(page, 'POST', `${accessTokenApiPath}/createMine`);
  const before = Date.now();
  await page.getByTestId('mcp-access-token-create-submit').click();
  const response = await created;
  const after = Date.now();
  expect(response.ok()).toBe(true);
  expect(response.headers()['cache-control']).toContain('no-store');
  const submitted = response.request().postDataJSON();
  expect(submitted.name).toBe(name);
  expect(submitted.scope).toBe(scope);
  expect(submitted.expiresIn).toBe(expiresIn);
  const token = (await response.json()).data as AccessToken;
  expect(typeof token.accessToken === 'string' && token.accessToken.length > 0).toBe(true);
  expect(token.scope).toBe(scope);
  expect(token.resource).toBe(`${origin}/mcp/web`);
  const deadline = token.tokenExpiresAt;
  expect(deadline >= before + expiresIn * 1000 - 1000).toBe(true);
  expect(deadline <= after + expiresIn * 1000 + 1000).toBe(true);
  // Boolean-only polling avoids locator assertions retaining a reveal's accessibility snapshot.
  await expect.poll(() => page.getByTestId('mcp-access-token-reveal').isVisible()).toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const copy = document.querySelector('[data-testid="mcp-access-token-copy-secret"]');
        const resource = document.querySelector('[data-testid="mcp-access-token-resource"]');
        const label = resource?.closest('label');
        return (
          !!copy &&
          !!label &&
          label.getBoundingClientRect().top >= copy.getBoundingClientRect().bottom
        );
      }),
    )
    .toBe(true);
  const revealed = await page.evaluate(() => {
    const input = document.querySelector<HTMLTextAreaElement>(
      '[data-testid="mcp-access-token-secret"]',
    );
    return { value: input?.value, readonly: input?.readOnly };
  });
  expect(revealed.readonly === true && revealed.value === token.accessToken).toBe(true);
  return token;
}

async function closeReveal(page: Page) {
  await page.getByTestId('mcp-access-token-reveal-close').click();
  await expect.poll(() => page.getByTestId('mcp-access-token-reveal').count()).toBe(0);
}

async function verifySecretAbsent(page: Page, token: AccessToken) {
  expect((await page.content()).includes(token.accessToken)).toBe(false);
  const browserState = await page.evaluate(() => {
    return JSON.stringify({
      values: Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'),
        input => input.value,
      ),
      local: { ...localStorage },
      session: { ...sessionStorage },
    });
  });
  expect(browserState.includes(token.accessToken)).toBe(false);
  const documentResponse = await page.request.get(accessTokensPath);
  expect(documentResponse.ok()).toBe(true);
  expect(documentResponse.headers()['cache-control']).toBe('private, no-store');
  expect((await documentResponse.text()).includes(token.accessToken)).toBe(false);
}

async function cleanupFixtures(
  request: APIRequestContext,
  account: McpAccount,
  tokenNames: Set<string>,
  scopeNames = new Set<string>(),
) {
  // Attempt every dependency branch, retaining only safe stage names on failure.
  const failures: string[] = [];
  try {
    const tokens = await readMine(request, account.headers);
    for (const token of tokens.filter(token => tokenNames.has(token.name))) {
      const response = await request.delete(
        `${accessTokenApiPath}/deleteMine/${token.id}?ssrSiteId=web`,
        {
          headers: account.headers,
        },
      );
      expect(response.ok()).toBe(true);
    }
  } catch {
    failures.push('personal tokens');
  }
  try {
    if (scopeNames.size) {
      const response = await request.get(`${customScopeApiPath}/mine?ssrSiteId=web`, {
        headers: account.headers,
      });
      expect(response.ok()).toBe(true);
      const scopes = (await response.json()).data.list as PersonalScope[];
      for (const scope of scopes.filter(scope => scopeNames.has(scope.name))) {
        const deleted = await request.delete(
          `${customScopeApiPath}/deleteMine/${scope.id}?ssrSiteId=web`,
          {
            headers: account.headers,
          },
        );
        expect(deleted.ok()).toBe(true);
      }
    }
  } catch {
    failures.push('personal scopes');
  }
  try {
    const removed = await request.delete('/api/home/user/passportTest/removeCurrentFixture', {
      headers: account.headers,
    });
    expect(removed.ok()).toBe(true);
  } catch {
    failures.push('account');
  }
  if (failures.length) throw new Error(`MCP fixture cleanup failed: ${failures.join(', ')}`);
}

async function finishTest(page: Page, completed: boolean, cleanup: () => Promise<void>) {
  let failed = false;
  try {
    // Clear any reveal before Playwright's automatic failure-context collection.
    await page.goto('about:blank');
  } catch {
    failed = true;
  }
  try {
    await cleanup();
  } catch {
    failed = true;
  }
  if (!failed) return;
  if (completed) throw new Error('MCP browser fixture cleanup failed');
  // Do not replace the original assertion/interaction error or expose arbitrary error text.
  console.warn('MCP browser fixture cleanup also failed; original test failure preserved');
}

test(
  'MCP access tokens: Account discovery, seven-day read token, one-time copy and confirmed deletion',
  { tag: ['@web', '@ssr', '@mcp', '@flow', '@account'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const name = `MCP read E2E ${randomBytes(12).toString('hex')}`;
    let account: McpAccount | undefined;
    let completed = false;
    try {
      account = await registerMcpAccount(request, origin, registered => (account = registered));
      await loginBrowser(page, account);
      await expect(page.locator('[data-mcp-resource]')).toHaveText(`${origin}/mcp/web`);
      await expect(page.locator('[data-mcp-resource]')).toBeVisible();
      await expect(page.locator('article[data-mcp-access-token-id]')).toHaveCount(0);
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
      const token = await createBrowserToken(page, origin, name);
      // Read the actual browser clipboard, never put a credential into matcher arguments.
      try {
        await page.getByTestId('mcp-access-token-copy-secret').click();
        await expect
          .poll(async () => {
            return (
              (await page.evaluate(() => navigator.clipboard.readText())) === token.accessToken
            );
          })
          .toBe(true);
        await page.getByTestId('mcp-access-token-copy-resource').click();
        await expect
          .poll(async () => {
            return (await page.evaluate(() => navigator.clipboard.readText())) === token.resource;
          })
          .toBe(true);
      } finally {
        await page.evaluate(() => navigator.clipboard.writeText(''));
      }
      // Browser Back remains available while the modal is open and must clear its secret.
      await page.goBack({ waitUntil: 'load' });
      await expect(page).toHaveURL(accountPath);
      const navigation = page.getByTestId('mine-navigation');
      await expect(page.getByTestId('mcp-access-token-reveal')).toHaveCount(0);
      await verifySecretAbsent(page, token);
      await navigation.getByRole('link', { name: 'MCP access tokens', exact: true }).click();
      await expect(page).toHaveURL(accessTokensPath);
      const entry = page.locator(`article[data-mcp-access-token-id="${token.id}"]`);
      await expect(entry.getByRole('heading', { name, exact: true })).toBeVisible();
      await expect(entry.getByText('mcp:read', { exact: true })).toBeVisible();
      await expect(entry.getByText('Active', { exact: true })).toBeVisible();
      await expect(entry.locator('time').last()).toHaveAttribute(
        'datetime',
        new Date(token.tokenExpiresAt).toISOString(),
      );
      const mine = await readMine(request, account.headers);
      const saved = mine.find(item => String(item.id) === String(token.id));
      expect(saved).toMatchObject({ name, scope: 'mcp:read', status: 'active' });
      expect(saved?.tokenExpiresAt).toBe(token.tokenExpiresAt);
      await verifySecretAbsent(page, token);
      const document = await page.reload({ waitUntil: 'load' });
      expect(document?.ok()).toBe(true);
      const html = await document!.text();
      expect(
        await page.evaluate(html => {
          return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector('[data-mcp-resource]')?.textContent;
        }, html),
      ).toBe(`${origin}/mcp/web`);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(page.locator('[data-mcp-resource]')).toHaveText(`${origin}/mcp/web`);
      await expect(page.locator('[data-mcp-resource]')).toBeVisible();
      await expect(entry).toBeVisible();
      await verifySecretAbsent(page, token);
      await page.goto(accountPath, { waitUntil: 'load' });
      await page
        .getByTestId('mine-navigation')
        .getByRole('link', { name: 'MCP access tokens', exact: true })
        .click();
      await expect(entry).toBeVisible();
      await verifySecretAbsent(page, token);

      const initialized = await callMcp(request, token.accessToken, 'initialize');
      expect(initialized.status()).toBe(200);
      expect((await initialized.json()).result.protocolVersion).toBe('2025-11-25');
      await verifyReadTool(request, token.accessToken);
      const deletePath = `${accessTokenApiPath}/deleteMine/${token.id}`;
      let deletions = 0;
      page.on('request', outgoing => {
        if (outgoing.method() === 'DELETE' && new URL(outgoing.url()).pathname === deletePath) {
          deletions++;
        }
      });
      const dialog = page.getByRole('dialog');
      await entry.getByTestId('mcp-access-token-delete').click();
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'No', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(entry).toBeVisible();
      expect(deletions).toBe(0);
      expect((await callMcp(request, token.accessToken, 'tools/list')).status()).toBe(200);
      await entry.getByTestId('mcp-access-token-delete').click();
      const deleted = waitForApiResponse(page, 'DELETE', deletePath);
      await dialog.getByRole('button', { name: 'Yes', exact: true }).click();
      expect((await deleted).ok()).toBe(true);
      await expect(dialog).toHaveCount(0);
      await expect(entry).toHaveCount(0);
      expect(deletions).toBe(1);
      const rejected = await callMcp(request, token.accessToken, 'tools/list');
      expect(rejected.status()).toBe(401);
      expect(rejected.headers()['www-authenticate']).toContain('error="invalid_token"');
      expect((await readMine(request, account.headers)).some(item => item.name === name)).toBe(
        false,
      );
      completed = true;
    } finally {
      await finishTest(page, completed, async () => {
        if (account) await cleanupFixtures(request, account, new Set([name]));
      });
    }
  },
);

test(
  'MCP access tokens: personal scope selection accepts a finite year and scope deletion invalidates it',
  { tag: ['@web', '@ssr', '@mcp', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const suffix = randomBytes(12).toString('hex');
    const name = `MCP yearly E2E ${suffix}`;
    const scopeName = `MCP_token_E2E_${suffix}`;
    let account: McpAccount | undefined;
    let completed = false;
    try {
      account = await registerMcpAccount(request, origin, registered => (account = registered));
      const catalog = await request.get(`${customScopeApiPath}/catalog?ssrSiteId=web`, {
        headers: account.headers,
      });
      expect(catalog.ok()).toBe(true);
      const tools = (await catalog.json()).data as Array<{
        name: string;
        controller: string;
        action: string;
      }>;
      const tool = tools.find(tool => tool.name === readToolName);
      if (!tool) throw new Error('Read-only MCP test fixture is unavailable');
      const createdScope = await request.post(`${customScopeApiPath}/createMine?ssrSiteId=web`, {
        headers: account.headers,
        data: {
          name: scopeName,
          description: 'Test-owned personal MCP token scope',
          tools: [{ name: tool.name, controller: tool.controller, action: tool.action }],
        },
      });
      expect(createdScope.ok()).toBe(true);
      const scope = (await createdScope.json()).data as PersonalScope;
      await loginBrowser(page, account);
      const token = await createBrowserToken(page, origin, name, scope.scope, oneYear);
      await closeReveal(page);
      await verifySecretAbsent(page, token);
      await verifyReadTool(request, token.accessToken, true);
      const saved = (await readMine(request, account.headers)).find(
        item => String(item.id) === String(token.id),
      );
      expect(saved).toMatchObject({ name, scope: scope.scope, status: 'active' });
      expect(saved?.tokenExpiresAt).toBe(token.tokenExpiresAt);
      // The test owns this scope. Removing it exercises actual linked-token invalidation.
      const removedScope = await request.delete(
        `${customScopeApiPath}/deleteMine/${scope.id}?ssrSiteId=web`,
        {
          headers: account.headers,
        },
      );
      expect(removedScope.ok()).toBe(true);
      const rejected = await callMcp(request, token.accessToken, 'tools/list');
      expect(rejected.status()).toBe(401);
      expect(rejected.headers()['www-authenticate']).toContain('error="invalid_token"');
      const invalidated = (await readMine(request, account.headers)).find(
        item => String(item.id) === String(token.id),
      );
      expect(invalidated?.status).toBe('revoked');
      completed = true;
    } finally {
      await finishTest(page, completed, async () => {
        if (account) {
          await cleanupFixtures(request, account, new Set([name]), new Set([scopeName]));
        }
      });
    }
  },
);
