import type { APIRequestContext, Page, Request, Route } from '@playwright/test';

import { createHash, randomBytes } from 'node:crypto';

import { expect, test } from '../scripts/managedTest.ts';

const MCP_E2E_CLIENT_NAME = 'Managed MCP browser E2E';
const MCP_E2E_CALLBACK_PATH = '/__mcp-e2e/callback';
const consentPath = '/cabloy/mcp/consent';
const authorizationsPath = '/cabloy/mcp/authorizations';
const scopesPath = '/cabloy/mcp/scopes';
const authorizationGrantApiPath = '/api/mcp/auth/authorizationGrant';
const customScopeApiPath = '/api/mcp/auth/customScope';
const seededMcpAccount = { username: 'admin', password: '123456' };
const unavailableText =
  'This authorization request is invalid, expired, or no longer available. Start again from the application.';
const protocolVersion = '2026-07-28';
const readScopeHelp =
  'mcp:read allows read-only MCP tools. Your existing account permissions still apply.';
const allScopeHelp =
  'mcp:all allows all MCP capabilities, including changes to data, within your existing account permissions. It does not grant administrator access.';
const scopeNameHelp =
  'Use 1–100 letters (A–Z, a–z), digits, underscores, or hyphens. Surrounding whitespace is trimmed and case is preserved. For example, test becomes mcp:custom:test.';
const scopeAccessChangeConfirm =
  'Change the name or tools in this scope? Existing authorizations using it will be revoked, including their tokens and authorization codes.';

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
  account: Pick<McpAccount, 'username' | 'password'> & Partial<Pick<McpAccount, 'id'>>,
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
  if (account.id !== undefined) {
    expect(String(login.passport.user.id) === String(account.id)).toBe(true);
  }
  if (verifyOrdinaryRoles) {
    const roles = login.passport.roles.map(role => role.name);
    expect(roles).toContain('registeredUser');
    expect(roles).not.toContain('systemAdmin');
  }
  return { Accept: 'application/json', Authorization: `Bearer ${login.jwt.accessToken}` };
}

type PersonalMcpScope = {
  id: string | number;
  scope: string;
  name: string;
  description?: string;
  tools: Array<{ name: string; controller: string; action: string }>;
};

async function readPersonalMcpScopes(
  request: APIRequestContext,
  headers: Record<string, string>,
): Promise<PersonalMcpScope[]> {
  const response = await request.get(`${customScopeApiPath}/mine`, { headers });
  expect(response.ok()).toBe(true);
  expect(response.headers()['cache-control']).toContain('no-store');
  return (await response.json()).data.list;
}

async function createPersonalMcpScope(
  request: APIRequestContext,
  headers: Record<string, string>,
  name: string,
  toolNames: string[],
): Promise<PersonalMcpScope> {
  const catalog = await request.get(`${customScopeApiPath}/catalog`, { headers });
  expect(catalog.ok()).toBe(true);
  const tools = (await catalog.json()).data as Array<PersonalMcpScope['tools'][number]>;
  const selected = toolNames.map(name => {
    const tool = tools.find(tool => tool.name === name);
    if (!tool) throw new Error(`Seeded account MCP catalog is missing ${name}`);
    return { name: tool.name, controller: tool.controller, action: tool.action };
  });
  const created = await request.post(`${customScopeApiPath}/createMine`, {
    headers,
    data: { name, description: 'Test-owned personal MCP scope', tools: selected },
  });
  expect(created.ok()).toBe(true);
  const scope = (await created.json()).data as PersonalMcpScope;
  expect(scope.name).toBe(name.trim());
  expect(scope.scope).toBe(`mcp:custom:${name.trim()}`);
  expect(scope.tools).toEqual(selected);
  return scope;
}

async function cleanupPersonalMcpFixtures(
  request: APIRequestContext,
  scopeNames: Set<string>,
  clientIds: Set<string>,
) {
  const headers = await loginMcpAccount(request, seededMcpAccount);
  try {
    const mine = await request.get(`${authorizationGrantApiPath}/mine`, { headers });
    expect(mine.ok()).toBe(true);
    const grants = (await mine.json()).data.list as Array<{
      id: string | number;
      clientId: string;
    }>;
    for (const grant of grants.filter(grant => clientIds.has(grant.clientId))) {
      const deleted = await request.delete(`${authorizationGrantApiPath}/deleteMine/${grant.id}`, {
        headers,
      });
      expect(deleted.ok()).toBe(true);
    }
  } finally {
    // Names are randomized and recorded before mutations, so cleanup can locate an
    // owned row even when a UI save succeeds but its subsequent assertion fails.
    const scopes = await readPersonalMcpScopes(request, headers);
    for (const scope of scopes.filter(scope => scopeNames.has(scope.name))) {
      const deleted = await request.delete(`${customScopeApiPath}/deleteMine/${scope.id}`, {
        headers,
      });
      expect(deleted.ok()).toBe(true);
    }
  }
  // Dynamic registration has no delete endpoint. Only those AS rows remain for
  // removal with the root-managed disposable database; no shared seed is edited.
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
  await expect(page.getByText('Resource', { exact: true })).toHaveCount(0);
  await expect(page.getByText(`${origin}/mcp`, { exact: true })).toHaveCount(0);
  await expect(page.getByText('Request expires', { exact: true })).toHaveCount(0);
  await expect(page.locator('time')).toHaveCount(0);
  expect((await summaryResponse.json()).data.scope).toBe(scope);
  await expect(
    page.locator('[data-mcp-requested-scope]').getByText(scope, { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(allScopeHelp, { exact: true })).toHaveCount(0);
  await expect(page.getByText(readScopeHelp, { exact: true })).toHaveCount(0);
  const manageScopes = page.getByRole('link', { name: 'Manage scopes', exact: true });
  await expect(manageScopes).toBeVisible();
  await expect(manageScopes).toHaveAttribute('href', scopesPath);
  await expect(manageScopes).toHaveAttribute('target', '_blank');
  await expect(manageScopes).toHaveAttribute('rel', 'noopener noreferrer');
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
    // Other modules may register tools in the shared catalog.
    expect(
      (await listed.json()).result.tools
        .map((tool: { name: string }) => tool.name)
        .filter((name: string) => name.startsWith('training-student_student_'))
        .sort(),
    ).toEqual([
      'training-student_student_aggregate',
      ...(scope === 'mcp:all'
        ? ['training-student_student_create', 'training-student_student_delete']
        : []),
      'training-student_student_group',
      'training-student_student_select',
      'training-student_student_summary',
      ...(scope === 'mcp:all' ? ['training-student_student_update'] : []),
      'training-student_student_view',
    ]);

    const query = { name, level, pageNo: 1, pageSize: 1 };
    const initialSelect = await callMcp(
      request,
      'tools/call',
      { name: 'training-student_student_select', arguments: query },
      token,
    );
    expect(initialSelect.status()).toBe(200);
    const initial = (await initialSelect.json()).result;
    expect(initial.isError === true).toBe(false);
    expect(initial.structuredContent).toMatchObject({
      list: [{ id: String(studentId), name, mobile: '138****5678', level }],
      total: '1',
      pageNo: 1,
      pageSize: 1,
      pageCount: 1,
    });
    expect(initial.structuredContent.list).toHaveLength(1);
    expect(initial.content).toEqual([
      { type: 'text', text: JSON.stringify(initial.structuredContent) },
    ]);
    const selectedId = initial.structuredContent.list[0].id;

    // The first real read uses the consent-issued credential; subsequent reads use its rotation.
    token = await refresh();
    const selected = await callMcp(
      request,
      'tools/call',
      { name: 'training-student_student_select', arguments: query },
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
    expect(initial.structuredContent).toEqual(serialized);
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
      { name: 'training-student_student_view', arguments: { id: selectedId } },
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
      { name: 'training-student_student_summary', arguments: { id: selectedId } },
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
    const wire = JSON.stringify(result);
    for (const privateValue of [mobile, '138****5678', descriptionMarkdown]) {
      expect(wire.includes(privateValue)).toBe(false);
    }
    for (const privateField of ['mobile', 'descriptionMarkdown', 'descriptionHtml']) {
      expect(wire.includes(`"${privateField}"`)).toBe(false);
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

test.describe('MCP consent login recovery', () => {
  let client: RegisteredClient;

  test.beforeAll(async ({ request, baseURL }) => {
    if (!baseURL || !process.env.VONA_TEST_RUN_ID) {
      throw new Error('Managed E2E origin unavailable');
    }
    // The cases read one run-owned registration; each creates its own pending request.
    client = await registerClient(request, new URL(baseURL).origin, 'mcp:read');
  });

  for (const scenario of [
    'summary 401',
    'browser JWT refresh 401 before summary',
    'decision 401',
    'errorExpired refresh 401',
    'errorExpired missing refresh credentials',
    'real browser JWT refresh',
  ] as const) {
    test(
      `MCP browser authorization recovery: ${scenario}`,
      { tag: ['@web', '@ssr', '@mcp'] },
      async ({ page, baseURL }) => {
        test.setTimeout(60_000);
        if (!baseURL) throw new Error('Managed E2E origin unavailable');
        const origin = new URL(baseURL).origin;
        const authorization = createAuthorization(
          origin,
          client.clientId,
          client.redirectUri,
          'mcp:read',
        );
        const errors = collectBrowserErrors(page);
        const pendingPath = await beginAnonymousAuthorization(page, authorization);
        await loginAndReadConsent(page, pendingPath, origin, 'mcp:read');

        const refreshPath = '/api/home/user/passport/refreshAuthToken';
        const counts = { summary: 0, decision: 0, refresh: 0, callback: 0 };
        page.on('request', outgoing => {
          if (outgoing.headers()['x-vona-openapi-schema']) return;
          const path = new URL(outgoing.url()).pathname;
          if (path === '/mcp/auth/summary' && outgoing.method() === 'GET') counts.summary++;
          if (path === '/mcp/auth/decision' && outgoing.method() === 'POST') counts.decision++;
          if (path === refreshPath && outgoing.method() === 'POST') counts.refresh++;
          if (path === MCP_E2E_CALLBACK_PATH) counts.callback++;
        });

        const realRefresh = scenario === 'real browser JWT refresh';
        const expiredHandoff = scenario.startsWith('errorExpired');
        const missingRefresh = scenario === 'errorExpired missing refresh credentials';
        const refreshFailure = scenario.includes('refresh 401');
        if (realRefresh || refreshFailure) {
          // a-model's $useStateLocal stores the raw JSON value under the last query-key
          // segment (storageKeySimplify), not an app-prefixed/dehydrated query envelope.
          // Change only the browser's persisted deadline; retain genuine JWT credentials.
          expect(
            await page.evaluate(() => {
              const expires = localStorage.getItem('expireTime');
              if (!expires || typeof JSON.parse(expires) !== 'number') return false;
              localStorage.setItem('expireTime', JSON.stringify(Date.now() - 60_000));
              return true;
            }),
          ).toBe(true);
        }
        if (missingRefresh) {
          expect(
            await page.evaluate(() => {
              const jwt = localStorage.getItem('jwt');
              if (!jwt || !JSON.parse(jwt)?.refreshToken) return false;
              localStorage.removeItem('jwt');
              return localStorage.getItem('passport') !== null;
            }),
          ).toBe(true);
          expect((await page.context().cookies()).some(cookie => cookie.name === 'token')).toBe(
            true,
          );
        }

        let injected = 0;
        if (!realRefresh && !missingRefresh) {
          const failurePath = refreshFailure
            ? refreshPath
            : scenario === 'decision 401'
              ? '/mcp/auth/decision'
              : '/mcp/auth/summary';
          await page.route(
            url => url.origin === origin && url.pathname === failurePath,
            async route => {
              if (injected || route.request().headers()['x-vona-openapi-schema']) {
                await route.fallback();
                return;
              }
              injected++;
              await route.fulfill({
                status: 401,
                contentType: 'application/json',
                headers: { 'cache-control': 'no-store' },
                body: JSON.stringify({ code: 401, message: 'Unauthorized' }),
              });
            },
          );
        }

        // Attach before navigation/click: the login helper itself waits for summary.
        const failedOrRefreshed = missingRefresh
          ? undefined
          : waitForApiResponse(
              page,
              realRefresh || refreshFailure || scenario === 'decision 401' ? 'POST' : 'GET',
              realRefresh || refreshFailure
                ? refreshPath
                : scenario === 'decision 401'
                  ? '/mcp/auth/decision'
                  : '/mcp/auth/summary',
            );
        const refreshedSummary = realRefresh
          ? waitForApiResponse(page, 'GET', '/mcp/auth/summary')
          : undefined;
        if (scenario === 'decision 401') {
          await page.getByRole('button', { name: 'Approve', exact: true }).click();
        } else if (expiredHandoff) {
          // Exercise the existing SSR-expiry recovery owner directly: a genuinely
          // expired document cookie is unnecessary and no JWT is forged for this fixture.
          await page.goto(
            `/home/base/errorExpired?${new URLSearchParams({ returnTo: pendingPath })}`,
            { waitUntil: 'load' },
          );
        } else {
          await page.reload({ waitUntil: 'load' });
        }
        if (failedOrRefreshed) {
          expect((await failedOrRefreshed).status()).toBe(realRefresh ? 200 : 401);
        }

        if (realRefresh) {
          // This is Cabloy's real account JWT endpoint, never MCP OAuth /mcp/token.
          expect((await refreshedSummary!).ok()).toBe(true);
          await expect(page.getByRole('button', { name: 'Approve', exact: true })).toBeEnabled();
          expect(new URL(page.url()).pathname + new URL(page.url()).search === pendingPath).toBe(
            true,
          );
          expect(
            await page.evaluate(() => {
              const expires = localStorage.getItem('expireTime');
              return !!expires && JSON.parse(expires) > Date.now();
            }),
          ).toBe(true);
          expect((await page.context().cookies()).some(cookie => cookie.name === 'token')).toBe(
            true,
          );
          expect(counts).toEqual({ summary: 1, decision: 0, refresh: 1, callback: 0 });
        } else {
          await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
          const isPendingLogin = () => {
            const url = new URL(page.url());
            return url.pathname === '/login' && url.searchParams.get('returnTo') === pendingPath;
          };
          expect(isPendingLogin()).toBe(true);
          await expect
            .poll(async () => {
              return (await page.context().cookies()).some(cookie => cookie.name === 'token');
            })
            .toBe(false);
          expect(
            await page.evaluate(() => {
              return ['jwt', 'passport', 'expireTime'].every(
                key => localStorage.getItem(key) === null,
              );
            }),
          ).toBe(true);
          await expect(page.getByRole('button', { name: 'Approve', exact: true })).toHaveCount(0);
          await expect(page.getByRole('alert')).toHaveCount(0);
          const beforeRelogin = {
            summary: scenario === 'summary 401' ? 1 : 0,
            decision: scenario === 'decision 401' ? 1 : 0,
            refresh: refreshFailure ? 1 : 0,
            callback: 0,
          };
          expect(injected).toBe(missingRefresh ? 0 : 1);
          expect(counts).toEqual(beforeRelogin);

          // Reloading login cannot revive stale credentials or revisit errorExpired.
          await page.reload({ waitUntil: 'load' });
          await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
          await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
          expect(isPendingLogin()).toBe(true);
          expect(counts).toEqual(beforeRelogin);
          await loginAndReadConsent(page, pendingPath, origin, 'mcp:read');
          expect(counts).toEqual({ ...beforeRelogin, summary: beforeRelogin.summary + 1 });
        }

        // Recovery/refresh must leave the same pending request open. Only this explicit
        // decision consumes it; deny also proves re-login never implicitly approves.
        const allow = scenario === 'decision 401' || realRefresh;
        const callback = await decideAndCaptureCallback(page, authorization, allow);
        expect(callback.searchParams.has('code')).toBe(allow);
        expect(callback.searchParams.has('error')).toBe(!allow);
        if (!allow) expect(callback.searchParams.get('error')).toBe('access_denied');
        expect(counts.decision).toBe(scenario === 'decision 401' ? 2 : 1);
        expect(counts.callback).toBe(1);
        expect(errors.page).toBe(0);
        expect(errors.hydration).toBe(0);
        // AS records belong only to the managed run's disposable database; no shared
        // account data was changed and there are no owned application fixtures to remove.
      },
    );
  }
});

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
      await expect(adminAuthorizationsLink).toHaveAttribute('href', `/admin${authorizationsPath}`);
      await adminAuthorizationsLink.click();
      await expect(page).toHaveURL(`/admin${authorizationsPath}`);
      await expect(
        page.getByRole('heading', { name: 'MCP authorizations', exact: true }),
      ).toBeVisible();
      await expect(
        entry.getByRole('heading', { name: MCP_E2E_CLIENT_NAME, exact: true }),
      ).toBeVisible();
      // Mine navigation keeps the shared protected page within the Admin site.
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');

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
  'MCP personal custom scopes: create, edit and delete persist across reload',
  { tag: ['@web', '@ssr', '@mcp', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const name = `MCP_scope-E2E-${randomBytes(12).toString('hex')}`;
    const renamed = `${name}-renamed`;
    const scopeNames = new Set([name, renamed]);
    const clientIds = new Set<string>();
    const errors = collectBrowserErrors(page);
    try {
      const client = await registerClient(request, origin, 'mcp:read');
      clientIds.add(client.clientId);
      const authorization = createAuthorization(
        origin,
        client.clientId,
        client.redirectUri,
        'mcp:read',
      );
      const pendingPath = await beginAnonymousAuthorization(page, authorization);
      await loginAndReadConsent(page, pendingPath, origin, 'mcp:read');
      await decideAndCaptureCallback(page, authorization, false);

      await page.goto('/home/user/account', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      const scopesLink = page.getByRole('link', { name: 'MCP scopes', exact: true });
      await expect(scopesLink).toHaveAttribute('href', scopesPath);
      await scopesLink.click();
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(page.getByRole('heading', { name: 'MCP scopes', exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Create scope', exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog.getByText('Create scope', { exact: true })).toBeVisible();
      await expect(dialog.getByText(scopeNameHelp, { exact: true })).toBeVisible();
      await dialog
        .getByRole('group', { name: /^Name(?: \*)?$/ })
        .getByRole('textbox')
        .fill(`  ${name}  `);
      await dialog
        .getByRole('group', { name: /^Description(?: \*)?$/ })
        .getByRole('textbox')
        .fill('Created by the managed browser test');
      const studentTools = dialog.getByRole('group', { name: 'Student Management', exact: true });
      await expect(studentTools.locator('legend')).toHaveText('Student Management');
      await dialog.getByRole('searchbox', { name: 'Search tools' }).fill('Student Management');
      const selectTool = studentTools.getByRole('checkbox', { name: 'List Students', exact: true });
      await expect(selectTool.locator('..')).toContainText('List Students');
      await dialog.getByRole('searchbox', { name: 'Search tools' }).fill('List Students');
      await selectTool.check();
      await dialog.getByRole('searchbox', { name: 'Search tools' }).fill('');
      await expect(
        studentTools.locator(
          'input[type="checkbox"][data-tool-name="training-student_student_select"]',
        ),
      ).toBeChecked();
      const created = waitForApiResponse(page, 'POST', `${customScopeApiPath}/createMine`);
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      const createResponse = await created;
      expect(createResponse.ok()).toBe(true);
      const scope = (await createResponse.json()).data as PersonalMcpScope;
      expect(scope.name).toBe(name);
      expect(scope.scope).toBe(`mcp:custom:${name}`);
      expect(scope.tools.map(tool => tool.name)).toEqual(['training-student_student_select']);
      await expect(dialog).toHaveCount(0);
      const entry = page.locator(`article[data-mcp-scope="${scope.scope}"]`);
      await expect(entry.getByRole('heading', { name, exact: true })).toBeVisible();

      const document = await page.request.get(scopesPath);
      expect(document.ok()).toBe(true);
      expect(document.headers()['cache-control']).toBe('private, no-store');
      const html = await document.text();
      expect(html).toContain(`data-mcp-scope="${scope.scope}"`);
      expect(html).toContain(`<h2 class="card-title break-words">${name}</h2>`);
      expect(html).toContain('<span class="break-words text-sm">List Students</span>');
      expect(html).not.toContain('data-zova-hydrated');
      const queryState = html.match(
        /<script[^>]*id="ssr-state-defer-init"[^>]*>([\s\S]*?)<\/script>/,
      )?.[1];
      expect(queryState !== undefined).toBe(true);
      expect(queryState?.includes(scope.scope)).toBe(true);
      expect(queryState?.includes(name)).toBe(true);
      expect(queryState?.includes('training-student_student_select')).toBe(true);
      let hydrationFetches = 0;
      const observeHydrationFetch = (outgoing: Request) => {
        if (
          outgoing.method() === 'GET' &&
          [`${customScopeApiPath}/mine`, `${customScopeApiPath}/catalog`].includes(
            new URL(outgoing.url()).pathname,
          ) &&
          !outgoing.headers()['x-vona-openapi-schema']
        ) {
          hydrationFetches++;
        }
      };
      page.on('request', observeHydrationFetch);
      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(entry.getByRole('heading', { name, exact: true })).toBeVisible();
      page.off('request', observeHydrationFetch);
      expect(hydrationFetches).toBe(0);
      await entry.getByRole('button', { name: 'Edit', exact: true }).click();
      await expect(dialog.getByText('Edit scope', { exact: true })).toBeVisible();
      const selectedStudentTool = dialog.locator(
        'input[type="checkbox"][data-tool-name="training-student_student_select"]',
      );
      const createStudentTool = dialog.locator(
        'input[type="checkbox"][data-tool-name="training-student_student_create"]',
      );
      await expect(selectedStudentTool).toBeChecked();
      await createStudentTool.check();
      await expect(selectedStudentTool).toBeChecked();
      await expect(createStudentTool).toBeChecked();
      const toolsUpdated = waitForApiResponse(
        page,
        'POST',
        `${customScopeApiPath}/updateMine/${scope.id}`,
      );
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      const toolsConfirmation = page.getByRole('dialog').filter({
        hasText: scopeAccessChangeConfirm,
      });
      await expect(
        toolsConfirmation.getByText(scopeAccessChangeConfirm, { exact: true }),
      ).toBeVisible();
      await toolsConfirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      const toolsResponse = await toolsUpdated;
      const expectedTools = [
        ...scope.tools,
        {
          name: 'training-student_student_create',
          controller: 'training-student.controller.student',
          action: 'create',
        },
      ];
      expect(toolsResponse.request().postDataJSON()).toEqual({
        name,
        description: scope.description,
        tools: expectedTools,
      });
      expect(toolsResponse.ok()).toBe(true);
      const toolsScope = (await toolsResponse.json()).data as PersonalMcpScope;
      expect(toolsScope.tools).toHaveLength(expectedTools.length);
      expect(toolsScope.tools).toEqual(expect.arrayContaining(expectedTools));
      await expect(dialog).toHaveCount(0);
      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await entry.getByRole('button', { name: 'Edit', exact: true }).click();
      await expect(dialog.getByText('Edit scope', { exact: true })).toBeVisible();
      await expect(selectedStudentTool).toBeChecked();
      await expect(createStudentTool).toBeChecked();
      await dialog
        .getByRole('group', { name: /^Name(?: \*)?$/ })
        .getByRole('textbox')
        .fill(renamed);
      await dialog
        .getByRole('group', { name: /^Description(?: \*)?$/ })
        .getByRole('textbox')
        .fill('Edited and persisted');
      const updated = waitForApiResponse(
        page,
        'POST',
        `${customScopeApiPath}/updateMine/${scope.id}`,
      );
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      const confirmation = page.getByRole('dialog').filter({
        hasText: scopeAccessChangeConfirm,
      });
      await expect(confirmation.getByText(scopeAccessChangeConfirm, { exact: true })).toBeVisible();
      await confirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      const updateResponse = await updated;
      expect(updateResponse.ok()).toBe(true);
      const updatedScope = (await updateResponse.json()).data as PersonalMcpScope;
      expect(updatedScope.scope).toBe(`mcp:custom:${renamed}`);
      expect(updatedScope.name).toBe(renamed);
      expect(updatedScope.tools).toEqual(toolsScope.tools);
      await expect(dialog).toHaveCount(0);
      await expect(entry).toHaveCount(0);
      const renamedEntry = page.locator(`article[data-mcp-scope="mcp:custom:${renamed}"]`);
      await expect(renamedEntry.getByRole('heading', { name: renamed, exact: true })).toBeVisible();
      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(renamedEntry.getByRole('heading', { name: renamed, exact: true })).toBeVisible();
      await expect(renamedEntry.getByText('Edited and persisted', { exact: true })).toBeVisible();
      const persisted = (
        await readPersonalMcpScopes(request, await loginMcpAccount(request, seededMcpAccount))
      ).find(item => String(item.id) === String(scope.id));
      expect(persisted).toMatchObject({
        scope: `mcp:custom:${renamed}`,
        name: renamed,
        description: 'Edited and persisted',
        tools: toolsScope.tools,
      });

      const catalogPath = `${customScopeApiPath}/catalog`;
      const updatePath = `${customScopeApiPath}/updateMine/${scope.id}`;
      const catalogMatch = (url: URL) => url.origin === origin && url.pathname === catalogPath;
      let catalogOverrides = 0;
      let pruningUpdates = 0;
      const observePruningUpdate = (outgoing: Request) => {
        if (
          outgoing.method() === 'POST' &&
          new URL(outgoing.url()).pathname === updatePath &&
          !outgoing.headers()['x-vona-openapi-schema']
        ) {
          pruningUpdates++;
        }
      };
      const omitMissingTool = async (route: Route) => {
        if (
          catalogOverrides ||
          route.request().method() !== 'GET' ||
          route.request().headers()['x-vona-openapi-schema']
        ) {
          await route.fallback();
          return;
        }
        const response = await route.fetch();
        expect(response.ok()).toBe(true);
        const body = await response.json();
        body.data = body.data.filter(
          (tool: PersonalMcpScope['tools'][number]) =>
            !scope.tools.some(
              selected =>
                selected.name === tool.name &&
                selected.controller === tool.controller &&
                selected.action === tool.action,
            ),
        );
        catalogOverrides++;
        await route.fulfill({ response, json: body });
      };
      page.on('request', observePruningUpdate);
      await page.route(catalogMatch, omitMissingTool);
      try {
        await renamedEntry.getByRole('button', { name: 'Edit', exact: true }).click();
        await expect(dialog.getByText('Edit scope', { exact: true })).toBeVisible();
        expect(catalogOverrides).toBe(1);
        await expect(selectedStudentTool).toHaveCount(0);
        await expect(createStudentTool).toBeChecked();
        expect(pruningUpdates).toBe(0);
        const pruned = waitForApiResponse(page, 'POST', updatePath);
        await dialog.getByRole('button', { name: 'Save', exact: true }).click();
        const pruningConfirmation = page.getByRole('dialog').filter({
          hasText: scopeAccessChangeConfirm,
        });
        await expect(
          pruningConfirmation.getByText(scopeAccessChangeConfirm, { exact: true }),
        ).toBeVisible();
        await pruningConfirmation.getByRole('button', { name: 'Yes', exact: true }).click();
        const pruneResponse = await pruned;
        const retainedTools = expectedTools.filter(tool => tool.action === 'create');
        expect(pruneResponse.request().postDataJSON()).toEqual({
          name: renamed,
          description: 'Edited and persisted',
          tools: retainedTools,
        });
        expect(pruneResponse.ok()).toBe(true);
        expect((await pruneResponse.json()).data.tools).toEqual(retainedTools);
        expect(pruningUpdates).toBe(1);
        await expect(dialog).toHaveCount(0);
      } finally {
        await page.unroute(catalogMatch, omitMissingTool);
        page.off('request', observePruningUpdate);
      }
      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      const prunedScope = (
        await readPersonalMcpScopes(request, await loginMcpAccount(request, seededMcpAccount))
      ).find(item => String(item.id) === String(scope.id));
      expect(prunedScope?.tools).toEqual(expectedTools.filter(tool => tool.action === 'create'));

      await renamedEntry.getByRole('button', { name: 'Delete', exact: true }).click();
      await expect(dialog).toBeVisible();
      const deleted = waitForApiResponse(
        page,
        'DELETE',
        `${customScopeApiPath}/deleteMine/${scope.id}`,
      );
      await dialog.getByRole('button', { name: 'Yes', exact: true }).click();
      expect((await deleted).ok()).toBe(true);
      await expect(dialog).toHaveCount(0);
      await expect(renamedEntry).toHaveCount(0);
      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(page.getByRole('button', { name: 'Create scope', exact: true })).toBeEnabled();
      await expect(renamedEntry).toHaveCount(0);
      expect(errors).toEqual({ page: 0, console: 0, hydration: 0 });
    } finally {
      await cleanupPersonalMcpFixtures(request, scopeNames, clientIds);
    }
  },
);

test(
  'MCP personal custom scopes: consent narrows all to custom and enforces actual token tools',
  { tag: ['@web', '@ssr', '@mcp', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const name = `MCP_select-only-E2E-${randomBytes(12).toString('hex')}`;
    const renamed = `${name}-renamed`;
    const scopeNames = new Set([name, renamed]);
    const clientIds = new Set<string>();
    const errors = collectBrowserErrors(page);
    try {
      const headers = await loginMcpAccount(request, seededMcpAccount);
      const scope = await createPersonalMcpScope(request, headers, name, [
        'training-student_student_select',
      ]);
      const client = await registerClient(request, origin, 'mcp:all');
      clientIds.add(client.clientId);
      const authorization = createAuthorization(
        origin,
        client.clientId,
        client.redirectUri,
        'mcp:all',
      );
      const pendingPath = await beginAnonymousAuthorization(page, authorization);
      await loginAndReadConsent(page, pendingPath, origin, 'mcp:all');
      const option = page.locator(`[data-mcp-scope-option="${scope.scope}"]`);
      const radio = option.getByRole('radio', { name, exact: true });
      await expect(radio).toBeEnabled();
      await radio.check();
      await expect(radio).toBeChecked();
      const callback = await decideAndCaptureCallback(page, authorization, true);
      const code = callback.searchParams.get('code');
      if (!code) throw new Error('Custom approval did not contain an authorization code');
      const exchange = await redeem(request, authorization, client.clientId, code);
      expect(exchange.status()).toBe(200);
      const token = await exchange.json();
      expect(token.scope).toBe(scope.scope);
      const listed = await callMcp(request, 'tools/list', {}, token.access_token);
      expect(listed.status()).toBe(200);
      // The metadata helper is derived from visible Actions, not an additional business grant.
      expect((await listed.json()).result.tools.map((tool: { name: string }) => tool.name)).toEqual(
        ['training-student_student_select', 'cabloy_tool_contract'],
      );
      const excludedContract = await callMcp(
        request,
        'tools/call',
        {
          name: 'cabloy_tool_contract',
          arguments: { tool: 'training-student_student_group', section: 'overview' },
        },
        token.access_token,
      );
      expect(excludedContract.status()).toBe(200);
      const excludedContractBody = await excludedContract.json();
      expect(excludedContractBody.error).toEqual({ code: -32602, message: 'Invalid params' });
      expect(excludedContractBody.result).toBeUndefined();
      const selected = await callMcp(
        request,
        'tools/call',
        {
          name: 'training-student_student_select',
          arguments: { name, pageNo: 1, pageSize: 1 },
        },
        token.access_token,
      );
      expect(selected.status()).toBe(200);
      const selectedResult = (await selected.json()).result;
      expect(selectedResult.isError === true).toBe(false);
      expect(selectedResult.structuredContent).toMatchObject({
        list: [],
        total: '0',
        pageNo: 1,
        pageSize: 1,
      });
      const excluded = await callMcp(
        request,
        'tools/call',
        {
          name: 'training-student_student_group',
          arguments: {},
        },
        token.access_token,
      );
      expect(excluded.status()).toBe(200);
      expect((await excluded.json()).error).toMatchObject({
        code: -32602,
        message: 'Invalid params',
      });

      // Personal grants display what was approved, not the original all ceiling.
      const mine = await request.get(`${authorizationGrantApiPath}/mine`, { headers });
      expect(mine.ok()).toBe(true);
      const grant = (await mine.json()).data.list.find(
        (item: { clientId: string }) => item.clientId === client.clientId,
      );
      expect(grant).toMatchObject({ scope: scope.scope, requestedScope: 'mcp:all' });
      await page.goto(authorizationsPath, { waitUntil: 'load' });
      const entry = page.locator(`article[data-authorization-id="${grant.id}"]`);
      await expect(entry.getByText(scope.scope, { exact: true })).toBeVisible();

      await page.goto(scopesPath, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      const scopeEntry = page.locator(`article[data-mcp-scope="${scope.scope}"]`);
      const dialog = page.getByRole('dialog');
      const updatePath = `${customScopeApiPath}/updateMine/${scope.id}`;
      await scopeEntry.getByRole('button', { name: 'Edit', exact: true }).click();
      await dialog
        .getByRole('group', { name: /^Name(?: \*)?$/ })
        .getByRole('textbox')
        .fill(`  ${name}  `);
      await dialog
        .getByRole('group', { name: /^Description(?: \*)?$/ })
        .getByRole('textbox')
        .fill('Description-only edit keeps the existing grant');
      const described = waitForApiResponse(page, 'POST', updatePath);
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      expect((await described).ok()).toBe(true);
      await expect(dialog).toHaveCount(0);
      const stillActive = await callMcp(request, 'tools/list', {}, token.access_token);
      expect(stillActive.status()).toBe(200);

      // Keep a real pending request to test a stale client selecting the old scope.
      const staleAuthorization = createAuthorization(origin, client.clientId, client.redirectUri);
      const pending = await page.request.get(staleAuthorization.path, { maxRedirects: 0 });
      expect(pending.status()).toBe(302);
      const staleRequest = new URL(pending.headers().location, origin).searchParams.get('request');
      expect(Boolean(staleRequest)).toBe(true);

      await scopeEntry.getByRole('button', { name: 'Edit', exact: true }).click();
      await dialog
        .getByRole('group', { name: /^Name(?: \*)?$/ })
        .getByRole('textbox')
        .fill(renamed);
      await dialog.getByRole('button', { name: 'Save', exact: true }).click();
      const confirmation = page.getByRole('dialog').filter({ hasText: scopeAccessChangeConfirm });
      await expect(confirmation.getByText(scopeAccessChangeConfirm, { exact: true })).toBeVisible();
      const updated = waitForApiResponse(page, 'POST', updatePath);
      await confirmation.getByRole('button', { name: 'Yes', exact: true }).click();
      const updatedResponse = await updated;
      expect(updatedResponse.ok()).toBe(true);
      expect((await updatedResponse.json()).data.scope).toBe(`mcp:custom:${renamed}`);
      await expect(dialog).toHaveCount(0);
      await expect(scopeEntry).toHaveCount(0);
      await expect(
        page
          .locator(`article[data-mcp-scope="mcp:custom:${renamed}"]`)
          .getByRole('heading', { name: renamed, exact: true }),
      ).toBeVisible();
      const rejectedAccess = await callMcp(request, 'tools/list', {}, token.access_token);
      expect(rejectedAccess.status()).toBe(401);
      expect(rejectedAccess.headers()['www-authenticate']).toContain('error="invalid_token"');
      const rejectedScope = await page.request.post('/mcp/auth/decision', {
        headers: { ...headers, Origin: origin },
        data: { request: staleRequest, allow: true, scope: scope.scope },
      });
      expect(rejectedScope.status()).toBe(400);
      expect(errors).toEqual({ page: 0, console: 0, hydration: 0 });
    } finally {
      await cleanupPersonalMcpFixtures(request, scopeNames, clientIds);
    }
  },
);

test(
  'MCP personal custom scopes: read consent cannot select write scope or escalate tools',
  { tag: ['@web', '@ssr', '@mcp', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(60_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    const origin = new URL(baseURL).origin;
    const name = `MCP_write-only-E2E-${randomBytes(12).toString('hex')}`;
    const scopeNames = new Set([name]);
    const clientIds = new Set<string>();
    const errors = collectBrowserErrors(page);
    try {
      const headers = await loginMcpAccount(request, seededMcpAccount);
      const scope = await createPersonalMcpScope(request, headers, name, [
        'training-student_student_create',
      ]);
      const client = await registerClient(request, origin, 'mcp:all');
      clientIds.add(client.clientId);
      const authorization = createAuthorization(
        origin,
        client.clientId,
        client.redirectUri,
        'mcp:read',
      );
      const pendingPath = await beginAnonymousAuthorization(page, authorization);
      await loginAndReadConsent(page, pendingPath, origin, 'mcp:read');
      const writeOption = page.locator(`[data-mcp-scope-option="${scope.scope}"]`);
      await expect(writeOption.getByRole('radio', { name, exact: true })).toBeDisabled();
      await expect(
        writeOption.getByText('This option exceeds the requested scope.', { exact: true }),
      ).toBeVisible();
      await expect(
        page.locator('input[name="mcp-effective-scope"][value="mcp:all"]'),
      ).toBeDisabled();
      const readOption = page.locator('input[name="mcp-effective-scope"][value="mcp:read"]');
      await expect(readOption).toBeChecked();
      // The client permits all, but the request ceiling still rejects a forged
      // write-custom decision. This must leave the real pending request usable.
      const pendingRequest = new URL(pendingPath, origin).searchParams.get('request');
      const forged = await page.request.post('/mcp/auth/decision', {
        headers: { ...headers, Origin: origin },
        data: { request: pendingRequest, allow: true, scope: scope.scope },
      });
      expect(forged.status()).toBe(400);
      const callback = await decideAndCaptureCallback(page, authorization, true);
      const code = callback.searchParams.get('code');
      if (!code) throw new Error('Read approval did not contain an authorization code');
      const exchange = await redeem(request, authorization, client.clientId, code);
      expect(exchange.status()).toBe(200);
      const token = await exchange.json();
      expect(token.scope).toBe('mcp:read');
      const listed = await callMcp(request, 'tools/list', {}, token.access_token);
      expect(listed.status()).toBe(200);
      const names = (await listed.json()).result.tools.map((tool: { name: string }) => tool.name);
      expect(names).toContain('training-student_student_select');
      for (const write of [
        'training-student_student_create',
        'training-student_student_update',
        'training-student_student_delete',
      ]) {
        expect(names).not.toContain(write);
      }
      const excluded = await callMcp(
        request,
        'tools/call',
        {
          name: 'training-student_student_create',
          arguments: {},
        },
        token.access_token,
      );
      expect(excluded.status()).toBe(200);
      expect((await excluded.json()).error).toMatchObject({
        code: -32602,
        message: 'Invalid params',
      });
      expect(errors).toEqual({ page: 0, console: 0, hydration: 0 });
    } finally {
      await cleanupPersonalMcpFixtures(request, scopeNames, clientIds);
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
