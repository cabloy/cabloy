import type { APIRequestContext, Page, Request } from '@playwright/test';

import { createHash, randomBytes } from 'node:crypto';

import { expect, test } from '../scripts/managedTest.ts';

const MCP_E2E_CLIENT_NAME = 'Managed MCP browser E2E';
const MCP_E2E_CALLBACK_PATH = '/__mcp-e2e/callback';
const consentPath = '/cabloy/mcp/consent';
const authorizationsPath = '/cabloy/mcp/authorizations';
const authorizationGrantApiPath = '/api/mcp/auth/authorizationGrant';
const unavailableText =
  'This authorization request is invalid, expired, or no longer available. Start again from the application.';
const protocolVersion = '2026-07-28';
const readScopeHelp =
  'mcp:read allows read-only MCP tools. Your existing account permissions still apply.';
const allScopeHelp =
  'mcp:all allows all MCP capabilities, including changes to data, within your existing account permissions. It does not grant administrator access.';

type McpScope = 'mcp:all' | 'mcp:read';

type RegisteredClient = {
  clientId: string;
  redirectUri: string;
  resource: string;
};

async function registerClient(
  request: APIRequestContext,
  origin: string,
  scope?: McpScope,
): Promise<RegisteredClient> {
  const response = await request.post('/mcp/register', {
    headers: { 'content-type': 'application/json' },
    data: {
      application_type: 'native',
      client_name: MCP_E2E_CLIENT_NAME,
      redirect_uris: [`${origin}${MCP_E2E_CALLBACK_PATH}`],
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      ...(scope === undefined ? {} : { scope }),
    },
  });
  expect(response.status()).toBe(201);
  expect(response.headers()['cache-control']).toBe('no-store');
  const body = await response.json();
  expect(body.token_endpoint_auth_method).toBe('none');
  expect(body.grant_types).toEqual(['authorization_code', 'refresh_token']);
  expect(body).not.toHaveProperty('application_type');
  expect(body).not.toHaveProperty('refresh_token');
  expect(body.response_types).toEqual(['code']);
  expect(body.scope).toBe(scope ?? 'mcp:all');
  expect(body.redirect_uris).toEqual([`${origin}${MCP_E2E_CALLBACK_PATH}`]);
  expect(typeof body.client_id === 'string' && /^[\w-]{43}$/.test(body.client_id)).toBe(true);
  return {
    clientId: body.client_id,
    redirectUri: body.redirect_uris[0],
    resource: `${origin}/mcp`,
  };
}

// OAuth codes, account credentials, and access/refresh tokens must not enter retry traces,
// videos, or screenshots. Callback interception also avoids an external listener.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.beforeEach(() => {
  if (!process.env.VONA_TEST_RUN_ID) {
    throw new Error('MCP browser authorization requires the root-managed test:e2e runner');
  }
});

function createAuthorization(
  origin: string,
  clientId: string,
  redirectUri: string,
  scope?: McpScope,
) {
  const verifier = randomBytes(32).toString('base64url');
  const state = randomBytes(16).toString('hex');
  const resource = `${origin}/mcp`;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    resource,
    ...(scope === undefined ? {} : { scope }),
    code_challenge: createHash('sha256').update(verifier).digest('base64url'),
    code_challenge_method: 'S256',
    state,
  });
  return { origin, verifier, state, redirectUri, resource, path: `/mcp/auth?${params}` };
}

type Authorization = ReturnType<typeof createAuthorization>;

type McpAccount = {
  id: string | number;
  username: string;
  password: string;
};

type AccountPassportJwt = {
  passport: { user: { id: McpAccount['id'] }; roles: Array<{ name: string }> };
  jwt: { accessToken: string };
};

async function createAccountCaptcha(request: APIRequestContext) {
  const response = await request.post('/api/captcha/create', {
    data: { scene: 'captcha-simple:simple' },
  });
  expect(response.ok()).toBe(true);
  const { id, token } = (await response.json()).data;
  expect(typeof id === 'string' && typeof token === 'string').toBe(true);
  return { id, token };
}

async function registerMcpAccount(
  request: APIRequestContext,
  origin: string,
  onRegistered: (account: McpAccount) => void,
) {
  // Reuse the Account E2E's existing self-register/activate/removeCurrentFixture flow.
  const username = `e2e-fixture-mcp-${randomBytes(12).toString('hex')}`;
  const password = 'account-e2e-password';
  const response = await request.post('/api/home/user/passport/register', {
    data: {
      username,
      email: `${username}@example.test`,
      password,
      passwordConfirm: password,
      consumerUrl: `${origin}/home/user/activation`,
      captcha: await createAccountCaptcha(request),
    },
  });
  expect(response.ok()).toBe(true);
  const registered = (await response.json()).data as AccountPassportJwt;
  const account = { id: registered.passport.user.id, username, password };
  onRegistered(account);
  const activated = await request.post('/api/home/user/passportTest/activateCurrent', {
    headers: { Authorization: `Bearer ${registered.jwt.accessToken}` },
  });
  expect(activated.ok()).toBe(true);
  // Activation assigns registeredUser; the pre-activation registration passport has no roles.
  await loginMcpAccount(request, account, true);
  return account;
}

async function loginMcpAccount(
  request: APIRequestContext,
  account: McpAccount,
  verifyOrdinaryRoles = false,
) {
  const response = await request.post('/api/home/user/passport/login', {
    data: {
      username: account.username,
      password: account.password,
      captcha: await createAccountCaptcha(request),
    },
  });
  expect(response.ok()).toBe(true);
  const login = (await response.json()).data as AccountPassportJwt;
  expect(String(login.passport.user.id) === String(account.id)).toBe(true);
  if (verifyOrdinaryRoles) {
    const roles = login.passport.roles.map(role => role.name);
    expect(roles).toContain('registeredUser');
    expect(roles).not.toContain('systemAdmin');
  }
  return { Accept: 'application/json', Authorization: `Bearer ${login.jwt.accessToken}` };
}

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

async function loginAndReadConsent(
  page: Page,
  pendingPath: string,
  origin: string,
  scope: McpScope = 'mcp:all',
  account = { username: 'admin', password: '123456' },
) {
  // Existing scenarios use the read-only seed; personal management owns an ordinary account.
  const username = page.getByPlaceholder('Your Username');
  const password = page.getByPlaceholder('Your Password');
  await username.fill(account.username);
  await password.fill(account.password);
  await expect(username).toHaveValue(account.username);
  await expect(password).toHaveValue(account.password);
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
  expect((await summaryResponse.json()).data.scope).toBe(scope);
  await expect(page.getByText(scope, { exact: true })).toBeVisible();
  await expect(
    page.getByText(scope === 'mcp:all' ? allScopeHelp : readScopeHelp, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(scope === 'mcp:all' ? readScopeHelp : allScopeHelp, { exact: true }),
  ).toHaveCount(0);
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

async function verifyStudentTools(
  page: Page,
  request: APIRequestContext,
  token: string,
  scope: 'mcp:all' | 'mcp:read',
  refresh: () => Promise<string>,
) {
  const accountToken = (await page.context().cookies()).find(
    cookie => cookie.name === 'token',
  )?.value;
  expect(Boolean(accountToken)).toBe(true);
  const headers = { Authorization: `Bearer ${accountToken}` };
  const name = `MCP browser E2E ${randomBytes(12).toString('hex')}`;
  const mobile = '13812345678';
  const descriptionMarkdown =
    '# Synthetic MCP browser profile\n\nFull **Markdown** belongs only to the authorized view.';
  const level = 1;
  const trainingRecord = {
    name: '__MCP browser record__',
    subjectCount: 1,
    totalScore: 88,
    averageScore: 88,
    trainingTime: '2026-03-10T08:00:00.000Z',
    description: 'Synthetic browser training record',
    trainingRecordSubjects: [
      {
        name: '__MCP browser math__',
        score: 95,
        description: 'Synthetic browser subject',
      },
    ],
  };
  let studentId: string | number | undefined;
  try {
    // Use the existing authenticated REST fixture path, not MCP write authority.
    const created = await page.request.post('/api/training/student', {
      headers,
      data: {
        name,
        mobile,
        level,
        content: { descriptionMarkdown },
        trainingRecords: [trainingRecord],
      },
    });
    expect(created.ok()).toBe(true);
    studentId = (await created.json()).data;
    expect(['string', 'number']).toContain(typeof studentId);

    const listed = await callMcp(request, 'tools/list', {}, token);
    expect(listed.status()).toBe(200);
    expect(
      (await listed.json()).result.tools.map((tool: { name: string }) => tool.name).sort(),
    ).toEqual([
      'training_student_aggregate',
      ...(scope === 'mcp:all' ? ['training_student_create', 'training_student_delete'] : []),
      'training_student_group',
      'training_student_lookup',
      'training_student_select',
      'training_student_summary',
      ...(scope === 'mcp:all' ? ['training_student_update'] : []),
      'training_student_view',
    ]);

    const lookup = await callMcp(
      request,
      'tools/call',
      { name: 'training_student_lookup', arguments: { name, level } },
      token,
    );
    expect(lookup.status()).toBe(200);
    const found = (await lookup.json()).result;
    expect(found.isError === true).toBe(false);
    expect(found.structuredContent).toEqual({
      list: [{ id: String(studentId), name, level }],
      total: '1',
      pageNo: 1,
      pageSize: 10,
      pageCount: 1,
    });

    // The first real read uses the consent-issued credential; subsequent reads use its rotation.
    token = await refresh();
    const query = { name, level, pageNo: 1, pageSize: 1 };
    const selected = await callMcp(
      request,
      'tools/call',
      { name: 'training_student_select', arguments: query },
      token,
    );
    expect(selected.status()).toBe(200);
    const complete = (await selected.json()).result;
    expect(complete.isError === true).toBe(false);
    const httpSelected = await page.request.get('/api/training/student', {
      headers,
      params: query,
    });
    expect(httpSelected.ok()).toBe(true);
    const httpBody = await httpSelected.json();
    const { list, total, pageNo, pageSize, pageCount } = httpBody;
    const serialized = { list, total: String(total), pageNo, pageSize, pageCount };
    // Preserve existing DTO normalization of identities and absent optional SQL values.
    serialized.list = serialized.list.map((row: Record<string, unknown>) => {
      row.id = String(row.id);
      if (row.imageId === null) delete row.imageId;
      return row;
    });
    expect(complete.structuredContent).toEqual(serialized);
    expect(complete.structuredContent).toMatchObject({
      list: [{ id: String(studentId), name, mobile: '138****5678', level }],
      total: '1',
      pageNo: 1,
      pageSize: 1,
      pageCount: 1,
    });
    expect(complete.content).toEqual([
      { type: 'text', text: JSON.stringify(complete.structuredContent) },
    ]);
    for (const value of [
      mobile,
      descriptionMarkdown,
      '"descriptionMarkdown"',
      '"descriptionHtml"',
    ]) {
      expect(JSON.stringify(complete).includes(value)).toBe(false);
    }

    const viewed = await callMcp(
      request,
      'tools/call',
      { name: 'training_student_view', arguments: { id: found.structuredContent.list[0].id } },
      token,
    );
    expect(viewed.status()).toBe(200);
    const detail = (await viewed.json()).result;
    expect(detail.isError === true).toBe(false);
    const httpViewed = await page.request.get(`/api/training/student/${studentId}`, { headers });
    expect(httpViewed.ok()).toBe(true);
    // This ordinary HTTP detail is the root object, with no transport metadata.
    const httpDetail = await httpViewed.json();
    // Apply only the measured, schema-specific DTO normalization; dates/decimals
    // remain unchanged and the comparison retains every other detail field.
    httpDetail.id = String(httpDetail.id);
    if (httpDetail.imageId === null) delete httpDetail.imageId;
    // DtoStudentView projects content.descriptionMarkdown, not the SQL content id.
    delete httpDetail.content.id;
    expect(httpDetail.trainingRecords).toHaveLength(1);
    for (const record of httpDetail.trainingRecords) {
      record.id = String(record.id);
      // Both nested DTOs retain EntityBaseInner's declared deleted default.
      if (record.deleted === undefined) record.deleted = false;
      if (record.sceneImageIds === null) delete record.sceneImageIds;
      if (record.dossierFileIds === null) delete record.dossierFileIds;
      expect(record.trainingRecordSubjects).toHaveLength(1);
      for (const subject of record.trainingRecordSubjects) {
        subject.id = String(subject.id);
        if (subject.deleted === undefined) subject.deleted = false;
      }
    }
    expect(detail.structuredContent).toEqual(httpDetail);
    expect(detail.structuredContent).toMatchObject({
      id: String(studentId),
      name,
      mobile: '138****5678',
      level,
      content: { descriptionMarkdown },
      trainingRecords: [trainingRecord],
    });
    expect(detail.structuredContent.trainingRecords).toHaveLength(1);
    expect(detail.structuredContent.trainingRecords[0].trainingRecordSubjects).toHaveLength(1);
    expect(detail.content).toEqual([
      { type: 'text', text: JSON.stringify(detail.structuredContent) },
    ]);
    expect(JSON.stringify(detail).includes(mobile)).toBe(false);

    const summary = await callMcp(
      request,
      'tools/call',
      { name: 'training_student_summary', arguments: { id: found.structuredContent.list[0].id } },
      token,
    );
    expect(summary.status()).toBe(200);
    const result = (await summary.json()).result;
    expect(result.isError === true).toBe(false);
    expect(result.structuredContent).toEqual({
      id: String(studentId),
      name,
      level,
      levelTitle: String(level),
      descriptionLength: descriptionMarkdown.length,
      summaryText: `${name} is in level ${level}. Description length: ${descriptionMarkdown.length}.`,
    });
    for (const response of [found, result]) {
      const wire = JSON.stringify(response);
      for (const privateValue of [mobile, '138****5678', descriptionMarkdown]) {
        expect(wire.includes(privateValue)).toBe(false);
      }
      for (const privateField of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
        expect(wire.includes(`"${privateField}"`)).toBe(false);
      }
    }
  } finally {
    if (studentId !== undefined) {
      const deleted = await page.request.delete(`/api/training/student/deleteForce/${studentId}`, {
        headers,
      });
      expect(deleted.ok()).toBe(true);
    }
  }
}

for (const scenario of [
  { name: 'omitted scope defaults to mcp:all', scope: undefined, expectedScope: 'mcp:all' },
  { name: 'explicit mcp:read', scope: 'mcp:read', expectedScope: 'mcp:read' },
] as const) {
  test(
    `MCP browser authorization: ${scenario.name}, anonymous login, explicit approval, PKCE exchange, refresh and bearer tools`,
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
      const client = await registerClient(request, origin, scenario.scope);
      const authorization = createAuthorization(
        origin,
        client.clientId,
        client.redirectUri,
        scenario.scope,
      );
      const errors = collectBrowserErrors(page);
      const pendingPath = await beginAnonymousAuthorization(page, authorization);
      await loginAndReadConsent(page, pendingPath, authorization.origin, scenario.expectedScope);

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
      expect(token.scope).toBe(scenario.expectedScope);
      expect(token.expires_in).toBe(7200);
      expect(
        typeof token.refresh_token === 'string' &&
          /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token.refresh_token),
      ).toBe(true);
      expect(
        typeof token.access_token === 'string' &&
          /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token.access_token),
      ).toBe(true);
      expect(token.access_token === code).toBe(false);

      const anonymous = await callMcp(request, 'server/discover');
      expect(anonymous.status()).toBe(401);
      expect(anonymous.headers()['www-authenticate']).toContain('Bearer');
      const discovery = await callMcp(request, 'server/discover', {}, token.access_token);
      expect(discovery.status()).toBe(200);
      expect((await discovery.json()).result.supportedVersions).toContain(protocolVersion);
      const callbackUrl = page.url();
      let authorizationRequests = 0;
      page.on('request', outgoing => {
        if (
          ['/mcp/auth', '/mcp/auth/summary', '/mcp/auth/decision'].includes(
            new URL(outgoing.url()).pathname,
          )
        ) {
          authorizationRequests++;
        }
      });
      await verifyStudentTools(
        page,
        request,
        token.access_token,
        scenario.expectedScope,
        async () => {
          const response = await request.post('/mcp/token', {
            form: {
              grant_type: 'refresh_token',
              client_id: client.clientId,
              refresh_token: token.refresh_token,
              resource: authorization.resource,
            },
          });
          expect(response.status()).toBe(200);
          expect(response.headers()['cache-control']).toBe('no-store');
          const refreshed = await response.json();
          expect(refreshed.token_type).toBe('Bearer');
          expect(refreshed.scope).toBe(scenario.expectedScope);
          expect(refreshed.expires_in).toBe(7200);
          expect(
            typeof refreshed.access_token === 'string' &&
              /^[\w-]+\.[\w-]+\.[\w-]+$/.test(refreshed.access_token),
          ).toBe(true);
          expect(
            typeof refreshed.refresh_token === 'string' &&
              /^[\w-]+\.[\w-]+\.[\w-]+$/.test(refreshed.refresh_token),
          ).toBe(true);
          // Boolean comparisons keep credential values out of assertion diagnostics.
          expect(refreshed.access_token === token.access_token).toBe(false);
          expect(refreshed.refresh_token === token.refresh_token).toBe(false);
          const oldAccess = await callMcp(request, 'tools/list', {}, token.access_token);
          expect(oldAccess.status()).toBe(401);
          expect(oldAccess.headers()['www-authenticate']).toContain('error="invalid_token"');
          expect(page.url() === callbackUrl).toBe(true);
          await expect(page.getByRole('heading', { name: 'MCP test callback' })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Approve', exact: true })).toHaveCount(0);
          expect(authorizationRequests).toBe(0);
          return refreshed.access_token as string;
        },
      );
      expect(authorizationRequests).toBe(0);

      const replay = await redeem(request, authorization, client.clientId, code);
      expect(replay.status()).toBe(400);
      expect((await replay.json()).error).toBe('invalid_grant');
      expect(errors).toEqual({ page: 0, console: 0, hydration: 0 });
      // AS rows live only in this root-run-owned disposable database, which the
      // managed runner removes. The shared seeded account remains read-only.
    },
  );
}

test(
  'MCP personal authorizations: ordinary account discovers, cancels and confirms revoke/delete',
  { tag: ['@web', '@ssr', '@mcp', '@flow', '@account'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    let account: McpAccount | undefined;
    let client: RegisteredClient | undefined;
    try {
      account = await registerMcpAccount(request, origin, registered => {
        account = registered;
      });
      client = await registerClient(request, origin, 'mcp:read');
      const errors = collectBrowserErrors(page);

      // Session admission protects the document before private query data can load.
      const anonymousDocument = await request.get(authorizationsPath, { maxRedirects: 0 });
      expect(anonymousDocument.status()).toBeGreaterThanOrEqual(300);
      expect(anonymousDocument.status()).toBeLessThan(400);
      const loginDestination = new URL(anonymousDocument.headers().location, origin);
      expect(loginDestination.pathname).toBe('/login');
      expect(loginDestination.searchParams.get('returnTo')).toBe(authorizationsPath);
      await page.goto(authorizationsPath, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      expect(new URL(page.url()).pathname).toBe('/login');
      expect(new URL(page.url()).searchParams.get('returnTo')).toBe(authorizationsPath);
      await expect(
        page.getByRole('heading', { name: 'MCP authorizations', exact: true }),
      ).toHaveCount(0);

      const authorization = createAuthorization(
        origin,
        client.clientId,
        client.redirectUri,
        'mcp:read',
      );
      const pendingPath = await beginAnonymousAuthorization(page, authorization);
      await loginAndReadConsent(page, pendingPath, origin, 'mcp:read', account);
      const callback = await decideAndCaptureCallback(page, authorization, true);
      const code = callback.searchParams.get('code');
      if (!code) throw new Error('Approval callback did not contain an authorization code');
      const exchange = await redeem(request, authorization, client.clientId, code);
      expect(exchange.status()).toBe(200);
      const token = await exchange.json();
      const liveAccess = await callMcp(request, 'tools/list', {}, token.access_token);
      expect(liveAccess.status()).toBe(200);

      // Account data can arrive in session SSR; do not require a duplicate browser query.
      await page.goto('/home/user/account', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(
        page.getByRole('heading', { name: 'Account Settings', exact: true }),
      ).toBeVisible();
      const authorizationsLink = page.getByRole('link', {
        name: 'MCP authorizations',
        exact: true,
      });
      await expect(authorizationsLink).toHaveAttribute('href', authorizationsPath);
      const mineResponse = await request.get(`${authorizationGrantApiPath}/mine`, {
        headers: await loginMcpAccount(request, account),
      });
      await authorizationsLink.click();
      expect(mineResponse.ok()).toBe(true);
      expect(mineResponse.headers()['cache-control']).toContain('no-store');
      const grants = (await mineResponse.json()).data.list as Array<{
        id: string | number;
        clientId: string;
        clientName: string;
      }>;
      const owned = grants.filter(grant => grant.clientId === client!.clientId);
      expect(owned).toHaveLength(1);
      expect(owned[0].clientName).toBe(MCP_E2E_CLIENT_NAME);
      const grantId = String(owned[0].id);
      const entry = page.locator(`article[data-authorization-id="${grantId}"]`);
      await expect(page).toHaveURL(authorizationsPath);
      await expect(
        page.getByRole('heading', { name: 'MCP authorizations', exact: true }),
      ).toBeVisible();
      await expect(
        entry.getByRole('heading', { name: MCP_E2E_CLIENT_NAME, exact: true }),
      ).toBeVisible();
      await expect(entry.getByRole('button', { name: 'Revoke', exact: true })).toBeEnabled();
      await expect(entry.getByRole('button', { name: 'Delete', exact: true })).toBeEnabled();

      const document = await page.request.get(authorizationsPath);
      expect(document.ok()).toBe(true);
      expect(document.headers()['cache-control']).toBe('private, no-store');
      const html = await document.text();
      expect(html).toContain(`data-authorization-id="${grantId}"`);
      expect(html).toContain(MCP_E2E_CLIENT_NAME);
      expect(html).not.toContain('data-zova-hydrated');
      const queryState = html.match(
        /<script[^>]*id="ssr-state-defer-init"[^>]*>([\s\S]*?)<\/script>/,
      )?.[1];
      expect(queryState !== undefined).toBe(true);
      expect(queryState?.includes(MCP_E2E_CLIENT_NAME)).toBe(true);
      expect(queryState?.includes(client.clientId)).toBe(true);
      expect(
        /\b(?:requestDigest|codeDigest|tokenDigest|codeChallenge):/.test(queryState ?? ''),
      ).toBe(false);
      // Boolean checks prevent credential values or the full SSR state entering diagnostics.
      expect(html.includes(token.access_token)).toBe(false);
      expect(html.includes(token.refresh_token)).toBe(false);
      let hydrationFetches = 0;
      const observeHydrationFetch = (outgoing: Request) => {
        if (
          outgoing.method() === 'GET' &&
          new URL(outgoing.url()).pathname === `${authorizationGrantApiPath}/mine` &&
          !outgoing.headers()['x-vona-openapi-schema']
        ) {
          hydrationFetches++;
        }
      };
      page.on('request', observeHydrationFetch);
      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(
        entry.getByRole('heading', { name: MCP_E2E_CLIENT_NAME, exact: true }),
      ).toBeVisible();
      page.off('request', observeHydrationFetch);
      expect(hydrationFetches).toBe(0);

      // The same ordinary account reaches the shared page through the Admin shell too.
      await page.goto('/admin/', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const adminUserMenu = page.locator('details').filter({
        has: page.getByText('Logout', { exact: true }),
      });
      await adminUserMenu.locator('summary').click();
      await adminUserMenu.getByText('Account Settings', { exact: true }).click();
      await expect(
        page.getByRole('heading', { name: 'Account Settings', exact: true }),
      ).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const adminAuthorizationsLink = page.getByRole('link', {
        name: 'MCP authorizations',
        exact: true,
      });
      await expect(adminAuthorizationsLink).toHaveAttribute('href', authorizationsPath);
      await adminAuthorizationsLink.click();
      await expect(page).toHaveURL(authorizationsPath);
      await expect(
        page.getByRole('heading', { name: 'MCP authorizations', exact: true }),
      ).toBeVisible();
      await expect(
        entry.getByRole('heading', { name: MCP_E2E_CLIENT_NAME, exact: true }),
      ).toBeVisible();
      // The canonical Account link performs a document handoff to the protected Web page.
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');

      const revokePath = `${authorizationGrantApiPath}/revokeMine/${grantId}`;
      const deletePath = `${authorizationGrantApiPath}/deleteMine/${grantId}`;
      const mutations = { revoke: 0, delete: 0 };
      page.on('request', outgoing => {
        const path = new URL(outgoing.url()).pathname;
        if (outgoing.method() === 'POST' && path === revokePath) mutations.revoke++;
        if (outgoing.method() === 'DELETE' && path === deletePath) mutations.delete++;
      });
      const dialog = page.getByRole('dialog');
      await entry.getByRole('button', { name: 'Revoke', exact: true }).click();
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'No', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(entry.getByRole('button', { name: 'Revoke', exact: true })).toBeEnabled();
      const afterCancel = await callMcp(request, 'tools/list', {}, token.access_token);
      expect(afterCancel.status()).toBe(200);
      expect(mutations.revoke).toBe(0);

      await entry.getByRole('button', { name: 'Revoke', exact: true }).click();
      const revoked = waitForApiResponse(page, 'POST', revokePath);
      await dialog.getByRole('button', { name: 'Yes', exact: true }).click();
      expect((await revoked).ok()).toBe(true);
      await expect(dialog).toHaveCount(0);
      await expect(entry.getByRole('button', { name: 'Revoke', exact: true })).toHaveCount(0);
      await expect(entry.getByRole('button', { name: 'Delete', exact: true })).toBeEnabled();
      expect(mutations.revoke).toBe(1);
      const rejectedAccess = await callMcp(request, 'tools/list', {}, token.access_token);
      expect(rejectedAccess.status()).toBe(401);
      expect(rejectedAccess.headers()['www-authenticate']).toContain('error="invalid_token"');
      const rejectedRefresh = await request.post('/mcp/token', {
        form: {
          grant_type: 'refresh_token',
          client_id: client.clientId,
          refresh_token: token.refresh_token,
          resource: authorization.resource,
        },
      });
      expect(rejectedRefresh.status()).toBe(400);
      expect((await rejectedRefresh.json()).error).toBe('invalid_grant');

      await entry.getByRole('button', { name: 'Delete', exact: true }).click();
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'No', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(
        entry.getByRole('heading', { name: MCP_E2E_CLIENT_NAME, exact: true }),
      ).toBeVisible();
      expect(mutations.delete).toBe(0);
      await entry.getByRole('button', { name: 'Delete', exact: true }).click();
      const deleted = waitForApiResponse(page, 'DELETE', deletePath);
      await dialog.getByRole('button', { name: 'Yes', exact: true }).click();
      expect((await deleted).ok()).toBe(true);
      await expect(dialog).toHaveCount(0);
      await expect(entry).toHaveCount(0);
      expect(mutations.delete).toBe(1);
      const remaining = await page.request.get(`${authorizationGrantApiPath}/mine`, {
        headers: await loginMcpAccount(request, account),
      });
      expect(remaining.ok()).toBe(true);
      expect(
        (await remaining.json()).data.list.some(
          (grant: { clientId: string }) => grant.clientId === client!.clientId,
        ),
      ).toBe(false);
      expect(errors).toEqual({ page: 0, console: 0, hydration: 0 });
    } finally {
      if (account) {
        const headers = await loginMcpAccount(request, account);
        try {
          if (client) {
            // This new user owns at most this one grant. Locate it even if UI admission failed.
            const mine = await request.get(`${authorizationGrantApiPath}/mine`, { headers });
            expect(mine.ok()).toBe(true);
            const grants = (await mine.json()).data.list as Array<{
              id: string | number;
              clientId: string;
            }>;
            for (const grant of grants.filter(grant => grant.clientId === client!.clientId)) {
              const deleted = await request.delete(
                `${authorizationGrantApiPath}/deleteMine/${grant.id}`,
                {
                  headers,
                },
              );
              expect(deleted.ok()).toBe(true);
            }
          }
        } finally {
          const removed = await request.delete('/api/home/user/passportTest/removeCurrentFixture', {
            headers,
          });
          expect(removed.ok()).toBe(true);
        }
      }
      // No client-delete endpoint: registration/pending/code rows remain exclusively in the
      // root-run-owned disposable AS database, removed by the managed runner as before.
    }
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
