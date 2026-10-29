import type { Locator, Page, Request, Route } from '@playwright/test';

import { expect, test } from '../scripts/managedTest.ts';

const studentResourceUrl =
  /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student(?:[/?#]|$)/;
const mobileUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const desktopUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

interface IModelPersistenceIdentity {
  appName: string;
  siteId: string;
  scope: readonly [string | null, string | null, string | null];
}

interface IStudentDraftSnapshot {
  storageKey: string;
  namespace: unknown[];
  identity: unknown[];
  queryKey: unknown[];
  schemaSignature: string;
  baselineSignature?: string;
  mode: string;
  id?: string;
  values: Record<string, unknown>;
  relations: Record<string, { id?: string | number; deleted?: boolean }[]>;
  undefinedPaths: string[];
}

interface IFieldGeometry {
  container: {
    display: string;
    flexWrap: string;
    left: number;
    right: number;
  };
  field: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
}

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  return errors;
}

async function loginAsAdmin(page: Page) {
  await page.goto('/admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  if (page.url().includes('/admin/login')) {
    const usernameInput = page.getByPlaceholder('Your Username');
    const passwordInput = page.getByPlaceholder('Your Password');
    await usernameInput.fill('admin');
    await passwordInput.fill('123456');
    await expect(usernameInput).toHaveValue('admin');
    await expect(passwordInput).toHaveValue('123456');
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    const loginResponse = page.waitForResponse(response => {
      const url = new URL(response.url());
      return (
        response.request().method() === 'POST' && url.pathname === '/api/home/user/passport/login'
      );
    });
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    expect((await loginResponse).ok()).toBeTruthy();
    await expect(page).not.toHaveURL(/\/admin\/login(?:\?|$)/);
  }

  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  const dashboardResponse = await page.goto('/admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  return dashboardResponse;
}

function waitForStudentSelect(page: Page, requireSuccess = true) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'GET' &&
      (!requireSuccess || response.ok()) &&
      url.pathname === '/api/training/student' &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

function installStudentCreateResponseCapture(page: Page) {
  let studentId: string | number | undefined;
  const handler = async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (
      request.method() !== 'POST' ||
      url.pathname !== '/api/training/student' ||
      request.headers()['x-vona-openapi-schema']
    ) {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const payload = await response.json();
    if (response.ok() && ['string', 'number'].includes(typeof payload.data)) {
      studentId = payload.data;
    }
    await route.fulfill({ response });
  };
  return {
    async install() {
      await page.route('**/api/training/student', handler);
    },
    async uninstall() {
      await page.unroute('**/api/training/student', handler);
    },
    get studentId() {
      return studentId;
    },
  };
}

const studentDraftCreatePath = '/admin/rest/resource/training-student%3Astudent/create';

function studentDraftNameInput(page: Page) {
  return page.getByRole('group', { name: 'Student Name *', exact: true }).getByRole('textbox');
}

function studentDraftBanner(page: Page) {
  return page.getByTestId('resource-draft');
}

function collectDraftEffects(page: Page, includeNestedRecords = false) {
  const mutationMethods = includeNestedRecords
    ? ['POST', 'PUT', 'PATCH', 'DELETE']
    : ['POST', 'PATCH'];
  const resourcePaths = includeNestedRecords
    ? /^\/api\/training\/(?:student|record)(?:\/|$)/
    : /^\/api\/training\/student(?:\/|$)/;
  const mutations: string[] = [];
  const hydrationWarnings: string[] = [];
  const consoleErrors: string[] = [];
  const pageErrors = collectPageErrors(page);
  const requestHandler = (request: Request) => {
    if (
      mutationMethods.includes(request.method()) &&
      resourcePaths.test(new URL(request.url()).pathname) &&
      !request.headers()['x-vona-openapi-schema']
    ) {
      mutations.push(`${request.method()} ${new URL(request.url()).pathname}`);
    }
  };
  page.on('request', requestHandler);
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
    if (/hydration.*mismatch|mismatch.*hydration/i.test(message.text())) {
      hydrationWarnings.push(message.text());
    }
  });
  return { mutations, hydrationWarnings, consoleErrors, pageErrors };
}

async function readModelPersistenceIdentity(page: Page): Promise<IModelPersistenceIdentity> {
  return page.evaluate(async (): Promise<IModelPersistenceIdentity> => {
    // ZovaApplication attaches itself to Vue's app, whose mount root exposes __vue_app__.
    const root = Array.from(document.querySelectorAll('*')).find(
      element => (element as any).__vue_app__?.zova,
    ) as any;
    const app = root?.__vue_app__?.zova;
    if (!app) throw new Error('Mounted Zova application not found');
    const passport = await app.bean._getBean('home-passport.model.passport', true);
    const scope: IModelPersistenceIdentity['scope'] = passport.$modelPersistence.capture().scope;
    return {
      appName: app.sys.env.APP_NAME ?? '',
      siteId: app.sys.env.SITE_ID,
      scope,
    };
  });
}

async function readStudentDrafts(page: Page, expectedIdentity?: IModelPersistenceIdentity) {
  const current = expectedIdentity ?? (await readModelPersistenceIdentity(page));
  const entries = await page.evaluate(async () => {
    if (!(await indexedDB.databases()).some(database => database.name === 'localforage')) {
      return [];
    }
    return await new Promise<{ key: IDBValidKey; value: unknown }[]>((resolve, reject) => {
      const opening = indexedDB.open('localforage');
      opening.onerror = () => reject(opening.error);
      opening.onsuccess = () => {
        const database = opening.result;
        if (!database.objectStoreNames.contains('keyvaluepairs')) {
          database.close();
          resolve([]);
          return;
        }
        const transaction = database.transaction('keyvaluepairs', 'readonly');
        const entries: { key: IDBValidKey; value: unknown }[] = [];
        const cursor = transaction.objectStore('keyvaluepairs').openCursor();
        cursor.onsuccess = () => {
          const entry = cursor.result;
          if (!entry) return;
          entries.push({ key: entry.key, value: entry.value });
          entry.continue();
        };
        transaction.oncomplete = () => {
          database.close();
          resolve(entries);
        };
        transaction.onerror = () => {
          database.close();
          reject(transaction.error);
        };
      };
    });
  });
  // Decode outside the app: its global JSON.parse revives ISO strings into Dates.
  const drafts: IStudentDraftSnapshot[] = [];
  for (const entry of entries) {
    try {
      if (typeof entry.key !== 'string') continue;
      const namespace = JSON.parse(entry.key);
      if (
        !Array.isArray(namespace) ||
        namespace.length !== 5 ||
        namespace[0] !== 'zova-model-db' ||
        namespace[1] !== 1 ||
        namespace[2] !== current.appName ||
        JSON.stringify(namespace[3]) !== JSON.stringify(current.scope) ||
        typeof namespace[4] !== 'string'
      ) {
        continue;
      }
      const query = typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
      if (query?.queryKey?.[0] !== 'basic-pageentry.model.draft') continue;
      const identity = JSON.parse(query.queryKey[1]);
      const snapshot = query.state?.data;
      if (identity[0] === 'training-student:student' && snapshot?.projection?.values) {
        drafts.push({
          storageKey: entry.key,
          namespace,
          identity,
          queryKey: query.queryKey,
          schemaSignature: snapshot.schemaSignature,
          baselineSignature: snapshot.baselineSignature,
          mode: identity[1],
          id: identity[2] ?? undefined,
          values: snapshot.projection.values,
          relations: snapshot.projection.relations,
          undefinedPaths: snapshot.projection.undefinedPaths,
        });
      }
    } catch {
      // Other persisted models are not draft envelopes.
    }
  }
  return drafts;
}

async function waitForStudentDraft(page: Page, name: string, id?: string | number) {
  await expect
    .poll(async () => {
      return (await readStudentDrafts(page)).some(
        draft =>
          draft.mode === (id === undefined ? 'create' : 'edit') &&
          draft.id === (id === undefined ? undefined : String(id)) &&
          draft.values.name === name,
      );
    })
    .toBe(true);
}

async function expectNoStudentDraft(page: Page, id?: string | number) {
  await expect
    .poll(async () => {
      return (await readStudentDrafts(page)).filter(
        draft =>
          draft.mode === (id === undefined ? 'create' : 'edit') &&
          draft.id === (id === undefined ? undefined : String(id)),
      ).length;
    })
    .toBe(0);
}

async function reloadStudentDraft(page: Page) {
  await page.reload({ waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await expect(studentDraftBanner(page)).toContainText('Unsaved draft available');
  await expect(
    studentDraftBanner(page).getByRole('button', { name: 'Recover draft', exact: true }),
  ).toBeVisible();
}

async function recoverStudentDraft(page: Page) {
  await studentDraftBanner(page)
    .getByRole('button', { name: 'Recover draft', exact: true })
    .click();
  // Edit recovery rechecks the server baseline before replacing live values.
  await expect(studentDraftBanner(page)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
}

function studentDraftTrainingRecords(page: Page) {
  return page.getByRole('group', { name: /^Student Training Records(?: \*)?$/ });
}

function studentDraftTrainingRow(page: Page, name: string) {
  return studentDraftTrainingRecords(page)
    .locator('tbody tr')
    .filter({ has: page.getByRole('link', { name, exact: true }) });
}

function trainingTimeInput(dialog: Locator) {
  return dialog
    .getByRole('group', { name: 'Training Time', exact: true })
    .locator('input[type="date"]');
}

async function browserLocalDateIso(page: Page, value: string) {
  // Basic Date interprets a native date input as midnight in the browser's timezone.
  return page.evaluate(date => new Date(`${date}T00:00:00`).toISOString(), value);
}

async function readStudentTrainingDraft(page: Page, id?: string | number) {
  const draft = (await readStudentDrafts(page)).find(
    draft =>
      draft.mode === (id === undefined ? 'create' : 'edit') &&
      draft.id === (id === undefined ? undefined : String(id)),
  );
  return {
    rows: draft?.values.trainingRecords as Record<string, unknown>[] | undefined,
    identities: draft?.relations[JSON.stringify(['trainingRecords'])],
    trainingTimeCleared: draft?.undefinedPaths.includes(
      JSON.stringify(['trainingRecords', 0, 'trainingTime']),
    ),
  };
}

async function openStudentDraftCreate(page: Page) {
  await page.getByRole('link', { name: 'Student', exact: true }).click();
  await expect(page).toHaveURL(studentResourceUrl);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page).toHaveURL(/training-student(?:%3A|:)student\/create/);
  await expect(studentDraftNameInput(page)).toBeVisible();
}

async function openStudentDraftEdit(page: Page, name: string, id: string | number) {
  await page.getByRole('link', { name: 'Student', exact: true }).click();
  await expect(page).toHaveURL(studentResourceUrl);
  await page.getByLabel('Student Name').fill(name);
  const select = waitForStudentSelect(page);
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await select;
  const row = page
    .locator('tbody tr')
    .filter({ has: page.getByRole('link', { name, exact: true }) });
  await expect(row).toHaveCount(1);
  await row.locator('button.btn-outline.btn-primary').click();
  await expect(page).toHaveURL(
    new RegExp(`/training-student(?:%3A|:)student/${id}/edit(?:[?#]|$)`),
  );
  await expect(studentDraftNameInput(page)).toHaveValue(name);
}

async function withDraftStudents(
  page: Page,
  count: number,
  run: (
    students: { id: string | number; name: string }[],
    headers: Record<string, string>,
  ) => Promise<void>,
) {
  const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
  expect(token).toBeTruthy();
  const headers = { Authorization: `Bearer ${token}` };
  const students: { id: string | number; name: string }[] = [];
  try {
    for (let index = 0; index < count; index++) {
      const name = `Draft E2E ${Date.now()} ${index}`;
      const response = await page.request.post('/api/training/student', {
        headers,
        data: { name, mobile: '13812345678', level: 1 },
      });
      expect(response.ok()).toBeTruthy();
      const id = (await response.json()).data;
      expect(['string', 'number']).toContain(typeof id);
      students.push({ id, name });
    }
    await run(students, headers);
  } finally {
    if (students.length) {
      let cleanupToken = (await page.context().cookies()).find(
        cookie => cookie.name === 'token',
      )?.value;
      if (!cleanupToken || page.url().includes('/admin/login')) {
        await loginAsAdmin(page);
        cleanupToken = (await page.context().cookies()).find(
          cookie => cookie.name === 'token',
        )?.value;
      }
      expect(cleanupToken).toBeTruthy();
      let cleanupHeaders = { Authorization: `Bearer ${cleanupToken}` };
      const failures: string[] = [];
      for (const student of students.toReversed()) {
        let response = await page.request.delete(
          `/api/training/student/deleteForce/${student.id}`,
          { headers: cleanupHeaders },
        );
        if (response.status() === 401) {
          await loginAsAdmin(page);
          cleanupToken = (await page.context().cookies()).find(
            cookie => cookie.name === 'token',
          )?.value;
          expect(cleanupToken).toBeTruthy();
          cleanupHeaders = { Authorization: `Bearer ${cleanupToken}` };
          response = await page.request.delete(`/api/training/student/deleteForce/${student.id}`, {
            headers: cleanupHeaders,
          });
        }
        if (!response.ok() && response.status() !== 404) {
          failures.push(`Draft fixture cleanup ${student.id}: ${response.status()}`);
        }
      }
      expect(failures).toEqual([]);
    }
  }
}

async function getFieldGeometry(locator: Locator): Promise<IFieldGeometry> {
  return locator.evaluate(element => {
    const field = element.closest('label')?.parentElement;
    const container = field?.parentElement;
    if (!field || !container) throw new Error('Could not resolve the filter field layout');

    const fieldRect = field.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const containerStyle = getComputedStyle(container);
    return {
      container: {
        display: containerStyle.display,
        flexWrap: containerStyle.flexWrap,
        left: containerRect.left,
        right: containerRect.right,
      },
      field: {
        top: fieldRect.top,
        left: fieldRect.left,
        right: fieldRect.right,
        bottom: fieldRect.bottom,
      },
    };
  });
}

async function getFlowGeometry(name: Locator, level: Locator, createdAtStart: Locator) {
  return Promise.all([
    getFieldGeometry(name),
    getFieldGeometry(level),
    getFieldGeometry(createdAtStart),
  ]);
}

function assertVisualOrder(geometry: IFieldGeometry[]) {
  for (let index = 1; index < geometry.length; index++) {
    const previous = geometry[index - 1].field;
    const current = geometry[index].field;
    expect(
      current.top > previous.top + 2 ||
        (Math.abs(current.top - previous.top) <= 2 && current.left > previous.left),
    ).toBeTruthy();
  }
}

function basicTableWrapper(page: Page) {
  return page
    .locator('div[data-table-compact]')
    .filter({ has: page.locator('table') })
    .first();
}

async function getDocumentHorizontalOverflow(page: Page) {
  return page.evaluate(() => {
    return (
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
    );
  });
}

test(
  'ATP-BASIC-SSR-01: anonymous Web HTML hydrates through the default site',
  { tag: ['@web', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['cache-control']).toBe('public, max-age=600');
    const html = await response.text();
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(html).not.toContain('ssr-body-ready-observer');
    expect(html).not.toContain('__leftDrawerOpenJS');

    const routeOverrideResponse = await request.get('/demo/basic/routeQueryB');
    expect(routeOverrideResponse.ok()).toBeTruthy();
    expect(routeOverrideResponse.headers()['cache-control']).toBe('public, max-age=300');

    const unlocalizedResponse = await request.get('/demo/basic/state');
    expect(unlocalizedResponse.ok()).toBeTruthy();
    expect(unlocalizedResponse.headers()['cache-control']).toBe(
      'no-cache, no-store, must-revalidate',
    );

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto('/', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(
      page.getByRole('heading', { name: 'Vona integrated SSR', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveTitle(/error/i);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-SSR-06: public cache omits compact hints while no-store SSR retains them',
  { tag: ['@web', '@ssr'] },
  async ({ request }) => {
    // The same cacheable URL must remain hint-free for mobile, desktop, then mobile requests.
    for (const userAgent of [mobileUserAgent, desktopUserAgent, mobileUserAgent]) {
      const response = await request.get('/', {
        headers: { 'User-Agent': userAgent },
      });
      expect(response.ok()).toBeTruthy();
      expect(response.headers()['cache-control']).toBe('public, max-age=600');
      expect((response.headers().vary ?? '').toLowerCase().split(/\s*,\s*/)).not.toContain(
        'user-agent',
      );
      const html = await response.text();
      const state = html.match(/<script[^>]*id="ssr-state-init"[^>]*>([\s\S]*?)<\/script>/)?.[1];
      expect(state).toBeTruthy();
      expect(state).not.toContain('compactHint');
    }

    for (const compactHint of [true, false]) {
      const response = await request.get('/demo/basic/state', {
        headers: { 'User-Agent': compactHint ? mobileUserAgent : desktopUserAgent },
      });
      expect(response.ok()).toBeTruthy();
      expect(response.headers()['cache-control']).toBe('no-cache, no-store, must-revalidate');
      expect((response.headers().vary ?? '').toLowerCase().split(/\s*,\s*/)).not.toContain(
        'user-agent',
      );
      const html = await response.text();
      const state = html.match(/<script[^>]*id="ssr-state-init"[^>]*>([\s\S]*?)<\/script>/)?.[1];
      expect(state).toBeTruthy();
      expect(state?.match(/compactHint\s*:\s*(true|false)/)?.[1]).toBe(String(compactHint));
    }
  },
);

test(
  'ATP-BASIC-SSR-03: concurrent public routes preserve their cache policies in managed test mode',
  { tag: ['@web', '@smoke'] },
  async ({ request }) => {
    const responses = await Promise.all(
      Array.from({ length: 9 }, (_, index) =>
        request.get(
          index % 3 === 0 ? '/' : index % 3 === 1 ? '/demo/basic/routeQueryB' : '/demo/basic/state',
        ),
      ),
    );

    for (const [index, response] of responses.entries()) {
      expect(response.ok(), `response ${index}`).toBeTruthy();
      const cacheControl =
        index % 3 === 0
          ? 'public, max-age=600'
          : index % 3 === 1
            ? 'public, max-age=300'
            : 'no-cache, no-store, must-revalidate';
      expect(response.headers()['cache-control'], `response ${index}`).toBe(cacheControl);
    }
  },
);

test(
  'ATP-BASIC-SSR-04: anonymous Admin redirect is private before rendering',
  { tag: ['@admin', '@smoke'] },
  async ({ request }) => {
    const response = await request.get('/admin/', { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers()['cache-control']).toBe('private, no-store');
    expect(response.headers().location).toMatch(/^\/admin\/login(?:\?|$)/);
  },
);

test(
  'ATP-BASIC-SSR-02: Admin waits for nested hydration before ready',
  { tag: ['@admin', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/admin/', { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers()['cache-control']).toBe('private, no-store');
    const loginPath = response.headers().location;
    expect(loginPath).toMatch(/^\/admin\/login(?:\?|$)/);

    const loginResponse = await request.get(loginPath!);
    expect(loginResponse.ok()).toBeTruthy();
    const loginHtml = await loginResponse.text();
    expect(loginHtml.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(loginHtml).not.toContain('ssr-body-ready-observer');
    expect(loginHtml).not.toContain('__leftDrawerOpenJS');

    let releaseRequest: (() => void) | undefined;
    const requestHeld = new Promise<void>(resolve => {
      releaseRequest = resolve;
    });
    let firstRequest = true;
    let requestObserved: () => void;
    const requestBlocked = new Promise<void>(resolve => {
      requestObserved = resolve;
    });

    await page.route(/\/admin\/assets\/a-form-[^/]+\.js(?:\?.*)?$/, async route => {
      if (!firstRequest) {
        await route.continue();
        return;
      }
      firstRequest = false;
      requestObserved();
      await requestHeld;
      await route.continue();
    });

    const pageErrors = collectPageErrors(page);
    const navigation = page.goto('/admin/', { waitUntil: 'load' });
    try {
      await requestBlocked;
      await expect(page).toHaveURL(/\/admin\/login(?:\?|$)/);
      await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
      await expect(page.locator('html')).not.toHaveAttribute('data-zova-hydrated');
    } finally {
      releaseRequest?.();
    }

    const documentResponse = await navigation;
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    await expect(page.locator('body')).toBeVisible();
    expect(pageErrors).toEqual([]);
    await page.unroute(/\/admin\/assets\/a-form-[^/]+\.js(?:\?.*)?$/);
  },
);

test(
  'ATP-BASIC-SSR-05: Admin sidebar readiness waits for a complete drawer',
  { tag: ['@admin', '@smoke'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsAdmin(page);
    const pageErrors = collectPageErrors(page);

    await page.route(studentResourceUrl, async route => {
      const response = await route.fetch();
      const html = await response.text();
      const body = html.replace(
        '<div class="drawer-side"',
        '<script>const __targets=window.ssr_body_ready_condition?.();if(__targets){window.ssr_body_ready_callback?.(__targets);}</script><div class="drawer-side"',
      );
      expect(body).not.toBe(html);
      await route.fulfill({ response, body });
    });
    try {
      const response = await page.goto('/admin/rest/resource/training-student%3Astudent', {
        waitUntil: 'load',
      });
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('.drawer').first()).toHaveClass(/\bdrawer-open\b/);
      await expect(page.locator('#__leftDrawerOpenJS')).toHaveCount(0);
      await expect(page.locator('#ssr-body-ready-observer')).toHaveCount(0);
      expect(
        await page.evaluate(() => {
          const ssrWindow = window as unknown as Record<string, unknown>;
          return {
            callback: ssrWindow.ssr_body_ready_callback,
            condition: ssrWindow.ssr_body_ready_condition,
            observer: ssrWindow.ssr_bodyReadyObserver,
          };
        }),
      ).toEqual({ callback: undefined, condition: undefined, observer: undefined });
      expect(pageErrors).toEqual([]);
    } finally {
      await page.unroute(studentResourceUrl);
    }
  },
);

test(
  'ATP-BASIC-HEADER-01: mobile and desktop SSR header geometry survives hydration',
  { tag: ['@admin', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const hydrationWarnings: string[] = [];
    page.on('console', message => {
      if (/hydration.*mismatch|mismatch.*hydration/i.test(message.text())) {
        hydrationWarnings.push(message.text());
      }
    });
    const actions = page.getByTestId('header-actions');
    const panel = actions.locator(':scope > .header-actions-panel');
    const more = actions.locator('button').first();
    const readGeometry = async () => {
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      return actions.evaluate(async element => {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        const header = element.closest('.navbar')!;
        const panel = element.querySelector(':scope > .header-actions-panel')!;
        const details = Array.from(panel.querySelectorAll(':scope > ul > li > details'));
        const nodes = [
          header,
          header.nextElementSibling!,
          element,
          element.querySelector('button')!,
          ...details.map(detail => detail.querySelector('summary')!),
        ];
        return {
          // ClientOnly adds menu leaves after hydration, not another action tree.
          shape: {
            wrappers: header.querySelectorAll('[data-testid="header-actions"]').length,
            panels: element.querySelectorAll('.header-actions-panel').length,
            lists: panel.querySelectorAll(':scope > ul').length,
            details: details.length,
            summaries: panel.querySelectorAll(':scope > ul > li > details > summary').length,
          },
          boxes: nodes.map(node => {
            const rect = node.getBoundingClientRect();
            return rect.width && rect.height
              ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
              : null;
          }),
        };
      });
    };

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      let releaseScripts!: () => void;
      const scriptsHeld = new Promise<void>(resolve => {
        releaseScripts = resolve;
      });
      let heldScripts = 0;
      const holdExternalScripts = async (route: Route) => {
        if (route.request().resourceType() === 'script') {
          heldScripts++;
          await scriptsHeld;
        }
        await route.continue();
      };
      // Leave CSS and the existing inline body-ready/bootstrap scripts untouched.
      await page.route('**/*', holdExternalScripts);
      try {
        const response = await page.goto('/admin/', { waitUntil: 'commit' });
        expect(response?.ok()).toBeTruthy();
        await expect(actions).toHaveCount(1);
        await expect(page.locator('.navbar').nth(1)).toBeVisible();
        await page.waitForFunction(() =>
          Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).every(
            link => link.sheet !== null,
          ),
        );
        await expect.poll(() => heldScripts).toBeGreaterThan(0);
        await expect(page.locator('html')).not.toHaveAttribute('data-zova-hydrated');
        await expect(page.locator('body')).toBeVisible();
        await expect(more).toHaveAttribute('aria-label', 'More actions');
        await expect(more).toHaveAttribute('aria-expanded', 'false');
        const panelId = await panel.getAttribute('id');
        expect(panelId).toBeTruthy();
        await expect(more).toHaveAttribute('aria-controls', panelId!);
        if (width < 1024) {
          await expect(more).toBeVisible();
          await expect(panel).toBeHidden();
        } else {
          await expect(more).toBeHidden();
          await expect(panel).toBeVisible();
        }
        const labels = panel.locator(':scope > ul > li > details > summary > span');
        await expect(labels).toHaveText(['Language', 'Color mode', 'Theme']);
        const summaries = panel.locator(':scope > ul > li > details > summary');
        for (const [index, title] of ['Language', 'Color mode', 'Theme'].entries()) {
          await expect(summaries.nth(index)).toHaveAttribute('title', title);
        }
        if (width >= 1024) {
          for (const label of await labels.all()) await expect(label).toBeHidden();
        }
        const before = await readGeometry();
        expect(before.shape).toEqual({
          wrappers: 1,
          panels: 1,
          lists: 1,
          details: 4,
          summaries: 4,
        });
        expect(before.boxes[3] !== null).toBe(width < 1024);
        expect(before.boxes.slice(4).every(box => box !== null)).toBe(width >= 1024);

        releaseScripts();
        await page.waitForLoadState('load');
        await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
        const after = await readGeometry();
        expect(after.shape).toEqual(before.shape);
        await expect(panel).toHaveAttribute('id', panelId!);
        await expect(more).toHaveAttribute('aria-expanded', 'false');
        for (const [index, previous] of before.boxes.entries()) {
          const current = after.boxes[index];
          if (previous === null) {
            expect(current).toBeNull();
          } else {
            expect(current).not.toBeNull();
            for (const key of ['x', 'y', 'width', 'height'] as const) {
              expect(
                Math.abs(current![key] - previous[key]),
                `${width}px header node ${index} ${key}`,
              ).toBeLessThanOrEqual(1);
            }
          }
        }
        await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
      } finally {
        releaseScripts();
        await page.unroute('**/*', holdExternalScripts);
      }
    }
    expect(hydrationWarnings).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-HEADER-02: 320px actions support locale, themes, dismissal and account navigation',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 320, height: 900 });
    await loginAsAdmin(page);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const actions = page.getByTestId('header-actions');
    const more = actions.locator('button').first();
    const panel = actions.locator(':scope > .header-actions-panel');
    const details = panel.locator(':scope > ul > li > details');
    const locale = details.nth(0);
    const dark = details.nth(1);
    const theme = details.nth(2);
    const user = details.nth(3);
    const openActions = async () => {
      if (!(await panel.isVisible())) await more.click();
      await expect(more).toHaveAttribute('aria-expanded', 'true');
      await expect(panel).toBeVisible();
    };
    const choose = async (menu: Locator, label: string, keyboard = false) => {
      await openActions();
      await menu.locator('summary').click();
      const leaf = menu.getByText(label, { exact: true });
      if (keyboard) await menu.getByRole('button', { name: label, exact: true }).press('Enter');
      else await leaf.click();
      await expect(panel).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(details.locator('ul:visible')).toHaveCount(0);
      await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    };
    const initialMode = (await dark.locator('li.disabled').textContent())!.trim();
    const initialTheme = (await theme.locator('li.disabled').textContent())!.trim();
    const initialPrimary = await page
      .locator('body')
      .evaluate(element => element.style.getPropertyValue('--color-primary'));
    const secondNavbar = page.locator('.navbar').nth(1);
    const before = await secondNavbar.boundingBox();
    await expect(more).toHaveAccessibleName('More actions');
    await expect(panel).toBeHidden();
    await openActions();
    await expect(details).toHaveCount(4);
    const labels = details.locator('summary > span');
    await expect(labels).toHaveText(['Language', 'Color mode', 'Theme']);
    for (const label of await labels.all()) await expect(label).toBeVisible();
    await expect(panel).toHaveCSS('position', 'absolute');
    await expect(panel).toHaveCSS('width', '256px');
    const panelBox = await panel.boundingBox();
    expect(panelBox!.x).toBeGreaterThanOrEqual(0);
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(320);
    const summaries = await details.locator('summary').evaluateAll(elements =>
      elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { x: rect.x, top: rect.top, bottom: rect.bottom };
      }),
    );
    for (let index = 1; index < summaries.length; index++) {
      expect(summaries[index].top).toBeGreaterThanOrEqual(summaries[index - 1].bottom - 1);
      expect(Math.abs(summaries[index].x - summaries[0].x)).toBeLessThanOrEqual(1);
    }
    await locale.locator('summary').click();
    await expect(locale.locator('ul')).not.toHaveCSS('position', 'absolute');
    await expect
      .poll(async () => {
        const nested = await locale.locator('ul').boundingBox();
        const nextSummary = await dark.locator('summary').boundingBox();
        return nextSummary!.y - nested!.y - nested!.height;
      })
      .toBeGreaterThanOrEqual(-1);
    expect(await secondNavbar.boundingBox()).toEqual(before);
    await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    await locale.locator('summary').press('Escape');
    await expect(locale).not.toHaveAttribute('open');
    await expect(panel).toBeVisible();
    await expect(locale.locator('summary')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(more).toBeFocused();

    await openActions();
    await page
      .locator('.navbar')
      .first()
      .click({ position: { x: 1, y: 1 } });
    await expect(panel).toBeHidden();
    await openActions();
    await page.locator('.navbar').first().locator('button').first().focus();
    await expect(panel).toBeHidden();

    await choose(locale, 'Chinese', true);
    await expect(more).toHaveAccessibleName('更多操作');
    await openActions();
    await expect(labels).toHaveText(['语言', '明暗模式', '主题']);
    for (const label of await labels.all()) await expect(label).toBeVisible();
    await choose(locale, '英语');
    await expect(more).toHaveAccessibleName('More actions');
    for (const mode of ['Dark', 'Light']) {
      await choose(dark, mode);
      await expect(dark.locator('li.disabled')).toHaveText(mode);
      await expect(page.locator('body')).toHaveAttribute('data-theme', mode.toLowerCase());
    }
    if (initialMode !== 'Light') await choose(dark, initialMode);
    const alternateTheme = initialTheme === 'Blue' ? 'Orange' : 'Blue';
    await choose(theme, alternateTheme);
    await expect(theme.locator('li.disabled')).toHaveText(alternateTheme);
    await expect
      .poll(() =>
        page.locator('body').evaluate(element => element.style.getPropertyValue('--color-primary')),
      )
      .not.toBe(initialPrimary);
    await choose(theme, initialTheme);
    await expect(theme.locator('li.disabled')).toHaveText(initialTheme);
    await expect(dark.locator('li.disabled')).toHaveText(initialMode);
    await expect
      .poll(() =>
        page.locator('body').evaluate(element => element.style.getPropertyValue('--color-primary')),
      )
      .toBe(initialPrimary);

    await choose(user, 'Account Settings');
    await expect(page).toHaveURL(/\/admin\/home\/user\/account(?:[/?#]|$)/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-HEADER-03: the lg breakpoint reuses one action tree and clears transient menus',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 900 });
    await loginAsAdmin(page);
    const pageErrors = collectPageErrors(page);
    const actions = page.getByTestId('header-actions');
    const more = actions.locator('button').first();
    const panel = actions.locator(':scope > .header-actions-panel');
    const details = panel.locator(':scope > ul > li > details');
    await expect(more).toBeVisible();
    await expect(panel).toBeHidden();
    const originalPanel = await panel.elementHandle();
    expect(originalPanel).not.toBeNull();
    try {
      await more.click();
      await details.first().locator('summary').click();
      await expect(details.first()).toHaveAttribute('open', '');
      await page.setViewportSize({ width: 1024, height: 900 });
      await expect(more).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeVisible();
      await expect(panel).toHaveCSS('position', 'static');
      await expect(panel.locator('details[open]')).toHaveCount(0);
      expect(await panel.evaluate((element, original) => element === original, originalPanel)).toBe(
        true,
      );
      await expect(details.locator('summary')).toHaveCount(4);
      const desktop = await details.locator('summary').evaluateAll(elements =>
        elements.map(element => {
          const rect = element.getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        }),
      );
      for (let index = 1; index < desktop.length; index++) {
        expect(Math.abs(desktop[index].y - desktop[0].y)).toBeLessThanOrEqual(1);
        expect(desktop[index].x).toBeGreaterThan(desktop[index - 1].x);
      }
      await details.last().locator('summary').click();
      await expect(details.last()).toHaveAttribute('open', '');
      await page.setViewportSize({ width: 1023, height: 900 });
      await expect(more).toBeVisible();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeHidden();
      await expect(panel.locator('details[open]')).toHaveCount(0);
      expect(await panel.evaluate((element, original) => element === original, originalPanel)).toBe(
        true,
      );
      await expect(actions).toHaveCount(1);
      await expect(panel).toHaveCount(1);
      await expect(details).toHaveCount(4);
      await more.click();
      await expect(panel).toBeVisible();
      await page.setViewportSize({ width: 390, height: 900 });
      await expect(panel).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      expect(await panel.evaluate((element, original) => element === original, originalPanel)).toBe(
        true,
      );
      await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
      expect(pageErrors).toEqual([]);
    } finally {
      await originalPanel?.dispose();
    }
  },
);

test(
  'ATP-BASIC-WEB-HEADER-01: public mobile and desktop header geometry survives anonymous and signed-in hydration',
  { tag: ['@web', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(180_000);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const hydrationWarnings: string[] = [];
    page.on('console', message => {
      if (/hydration.*mismatch|mismatch.*hydration/i.test(message.text())) {
        hydrationWarnings.push(message.text());
      }
    });
    const actions = page.getByTestId('header-actions');
    const panel = actions.locator(':scope > .header-actions-panel');
    const more = actions.locator('button').first();
    const details = panel.locator(':scope > ul > li > details');
    const account = details.nth(2);
    const readGeometry = async () => {
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      return actions.evaluate(async element => {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        const header = element.closest('.navbar')!;
        const panel = element.querySelector(':scope > .header-actions-panel')!;
        const details = Array.from(panel.querySelectorAll(':scope > ul > li > details'));
        const account = details[2].querySelector('summary')!;
        const nodes = [
          header,
          element.previousElementSibling!,
          element,
          element.querySelector('button')!,
          ...details.map(detail => detail.querySelector('summary')!),
          account.querySelector('img')!,
          account.querySelector('span')!,
        ];
        return {
          shape: {
            wrappers: header.querySelectorAll('[data-testid="header-actions"]').length,
            panels: element.querySelectorAll('.header-actions-panel').length,
            lists: panel.querySelectorAll(':scope > ul').length,
            details: details.length,
            summaries: panel.querySelectorAll(':scope > ul > li > details > summary').length,
          },
          boxes: nodes.map(node => {
            const rect = node.getBoundingClientRect();
            return rect.width && rect.height
              ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
              : null;
          }),
        };
      });
    };

    let displayName = '';
    for (const authenticated of [false, true]) {
      if (authenticated) {
        await loginAsAdmin(page);
        displayName = (await page
          .getByTestId('header-actions')
          .locator('details')
          .last()
          .locator('summary')
          .textContent())!.trim();
        expect(displayName).not.toBe('');
      }
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        let releaseScripts!: () => void;
        const scriptsHeld = new Promise<void>(resolve => {
          releaseScripts = resolve;
        });
        let heldScripts = 0;
        const holdExternalScripts = async (route: Route) => {
          if (route.request().resourceType() === 'script') {
            heldScripts++;
            await scriptsHeld;
          }
          await route.continue();
        };
        // Keep CSS and inline bootstrap scripts running while inspecting the public SSR shell.
        await page.route('**/*', holdExternalScripts);
        try {
          const response = await page.goto('/', { waitUntil: 'commit' });
          expect(response?.ok()).toBeTruthy();
          expect(response?.headers()['cache-control']).toBe('public, max-age=600');
          await expect(actions).toHaveCount(1);
          await page.waitForFunction(() =>
            Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).every(
              link => link.sheet !== null,
            ),
          );
          await expect.poll(() => heldScripts).toBeGreaterThan(0);
          await expect(page.locator('html')).not.toHaveAttribute('data-zova-hydrated');
          await expect(page.locator('body')).toBeVisible();
          await expect(panel).toHaveAttribute('id', 'home-layoutweb-header-actions');
          await expect(more).toHaveAttribute('aria-controls', 'home-layoutweb-header-actions');
          await expect(more).toHaveAttribute('aria-label', 'More actions');
          await expect(more).toHaveAttribute('aria-expanded', 'false');
          await expect(details).toHaveCount(3);
          const summaries = details.locator('summary');
          for (const [index, title] of ['Language', 'Color mode', 'Account'].entries()) {
            await expect(summaries.nth(index)).toHaveAttribute('title', title);
          }
          await expect(account.locator('summary')).toHaveAttribute('aria-label', 'Account');
          await expect(account.locator('summary')).toHaveText('');
          await expect(details.locator(':scope > ul')).toHaveCount(0);
          const labels = details.locator('summary > span.lg\\:hidden');
          await expect(labels).toHaveText(['Language', 'Color mode']);
          if (width < 1024) {
            await expect(more).toBeVisible();
            await expect(panel).toBeHidden();
          } else {
            await expect(more).toBeHidden();
            await expect(panel).toBeVisible();
            for (const label of await labels.all()) await expect(label).toBeHidden();
            await expect(account.locator('summary > img')).toHaveCSS('width', '24px');
            await expect(account.locator('summary > img')).toHaveCSS('height', '24px');
            await expect(account.locator('summary > span')).toHaveCSS('width', '128px');
          }
          const before = await readGeometry();
          expect(before.shape).toEqual({
            wrappers: 1,
            panels: 1,
            lists: 1,
            details: 3,
            summaries: 3,
          });
          expect(before.boxes[3] !== null).toBe(width < 1024);
          expect(before.boxes.slice(4).every(box => box !== null)).toBe(width >= 1024);

          releaseScripts();
          await page.waitForLoadState('load');
          await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
          await expect(account.locator('summary')).toHaveText(
            authenticated ? displayName : 'Not logged in',
          );
          await expect(account.locator('summary')).toHaveAttribute('aria-label', 'Account');
          await expect(account.locator('summary')).toHaveAttribute('title', 'Account');
          await expect(account.getByText('Login', { exact: true })).toHaveCount(
            authenticated ? 0 : 1,
          );
          await expect(
            account.getByRole('link', {
              name: 'Account Settings',
              exact: true,
              includeHidden: true,
            }),
          ).toHaveCount(authenticated ? 1 : 0);
          await expect(
            account.getByRole('button', { name: 'Logout', exact: true, includeHidden: true }),
          ).toHaveCount(authenticated ? 1 : 0);
          const after = await readGeometry();
          expect(after.shape).toEqual(before.shape);
          await expect(more).toHaveAttribute('aria-expanded', 'false');
          for (const [index, previous] of before.boxes.entries()) {
            const current = after.boxes[index];
            if (previous === null) {
              expect(current).toBeNull();
            } else {
              expect(current).not.toBeNull();
              for (const key of ['x', 'y', 'width', 'height'] as const) {
                expect(
                  Math.abs(current![key] - previous[key]),
                  `${authenticated ? 'signed-in' : 'anonymous'} ${width}px header node ${index} ${key}`,
                ).toBeLessThanOrEqual(1);
              }
            }
          }
          await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
        } finally {
          releaseScripts();
          await page.unroute('**/*', holdExternalScripts);
        }
      }
    }
    await account.locator('summary').click();
    const accountLink = account.getByRole('link', { name: 'Account Settings', exact: true });
    await expect(accountLink).toHaveAttribute('href', '/home/user/account');
    await accountLink.click();
    await expect(page).toHaveURL(/\/home\/user\/account(?:[/?#]|$)/);
    await expect(
      page.getByRole('heading', { name: 'Account Settings', exact: true }),
    ).toBeVisible();
    await expect(account).not.toHaveAttribute('open');
    expect(hydrationWarnings).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-WEB-HEADER-02: 320px actions preserve locale navigation and support color mode, dismissal and Login',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 320, height: 900 });
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/en-us?headerProbe=one&headerProbe=two', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    const actions = page.getByTestId('header-actions');
    const more = actions.locator('button').first();
    const panel = actions.locator(':scope > .header-actions-panel');
    const details = panel.locator(':scope > ul > li > details');
    const locale = details.nth(0);
    const dark = details.nth(1);
    const account = details.nth(2);
    const labels = details.locator('summary > span.lg\\:hidden');
    const header = page.locator('.navbar').first();
    const before = await header.boundingBox();
    const openActions = async () => {
      if (!(await panel.isVisible())) await more.click();
      await expect(more).toHaveAttribute('aria-expanded', 'true');
      await expect(panel).toBeVisible();
    };
    const choose = async (menu: Locator, label: string, keyboard = false) => {
      await openActions();
      await menu.locator('summary').click();
      const leaf = menu.getByText(label, { exact: true });
      if (keyboard) await menu.getByRole('button', { name: label, exact: true }).press('Enter');
      else await leaf.click();
      await expect(panel).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(details.locator('ul:visible')).toHaveCount(0);
      await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    };
    const initialMode = (await dark.locator('li.disabled').textContent())!.trim();
    await expect(more).toHaveAccessibleName('More actions');
    await expect(panel).toBeHidden();
    await openActions();
    await expect(details).toHaveCount(3);
    await expect(labels).toHaveText(['Language', 'Color mode']);
    for (const label of await labels.all()) await expect(label).toBeVisible();
    await expect(panel).toHaveCSS('position', 'absolute');
    await expect(panel).toHaveCSS('width', '256px');
    const panelBox = await panel.boundingBox();
    expect(panelBox!.x).toBeGreaterThanOrEqual(0);
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(320);
    const summaries = await details.locator('summary').evaluateAll(elements =>
      elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { x: rect.x, top: rect.top, bottom: rect.bottom };
      }),
    );
    for (let index = 1; index < summaries.length; index++) {
      expect(summaries[index].top).toBeGreaterThanOrEqual(summaries[index - 1].bottom - 1);
      expect(Math.abs(summaries[index].x - summaries[0].x)).toBeLessThanOrEqual(1);
    }
    await locale.locator('summary').click();
    await expect(locale.locator('ul')).not.toHaveCSS('position', 'absolute');
    await expect
      .poll(async () => {
        const nested = await locale.locator('ul').boundingBox();
        const nextSummary = await dark.locator('summary').boundingBox();
        return nextSummary!.y - nested!.y - nested!.height;
      })
      .toBeGreaterThanOrEqual(-1);
    expect(await header.boundingBox()).toEqual(before);
    await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    await locale.locator('summary').press('Escape');
    await expect(locale).not.toHaveAttribute('open');
    await expect(panel).toBeVisible();
    await expect(locale.locator('summary')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(more).toBeFocused();
    await openActions();
    await header.click({ position: { x: 1, y: 1 } });
    await expect(panel).toBeHidden();
    await openActions();
    await header.locator('button').first().focus();
    await expect(panel).toBeHidden();

    await choose(locale, 'Chinese', true);
    await expect(page).toHaveURL(url => url.pathname === '/zh-cn');
    // $gotoPage serializes array-valued query entries as JSON.
    expect(JSON.parse(new URL(page.url()).searchParams.get('headerProbe')!)).toEqual([
      'one',
      'two',
    ]);
    await expect(more).toHaveAccessibleName('更多操作');
    await openActions();
    await expect(labels).toHaveText(['语言', '明暗模式']);
    for (const label of await labels.all()) await expect(label).toBeVisible();
    await choose(locale, '英语');
    await expect(page).toHaveURL(url => url.pathname === '/');
    expect(JSON.parse(new URL(page.url()).searchParams.get('headerProbe')!)).toEqual([
      'one',
      'two',
    ]);
    await expect(more).toHaveAccessibleName('More actions');
    for (const mode of ['Dark', 'Light']) {
      await choose(dark, mode);
      await expect(dark.locator('li.disabled')).toHaveText(mode);
      await expect(page.locator('body')).toHaveAttribute('data-theme', mode.toLowerCase());
    }
    if (initialMode !== 'Light') await choose(dark, initialMode);
    await expect(dark.locator('li.disabled')).toHaveText(initialMode);
    await openActions();
    await account.locator('summary').click();
    await account.getByText('Login', { exact: true }).click();
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
    await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-WEB-HEADER-03: the lg breakpoint reuses one Web action tree and clears transient menus',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 900 });
    const pageErrors = collectPageErrors(page);
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    const actions = page.getByTestId('header-actions');
    const more = actions.locator('button').first();
    const panel = actions.locator(':scope > .header-actions-panel');
    const details = panel.locator(':scope > ul > li > details');
    const labels = details.locator('summary > span.lg\\:hidden');
    await expect(more).toBeVisible();
    await expect(panel).toBeHidden();
    const originalPanel = await panel.elementHandle();
    expect(originalPanel).not.toBeNull();
    try {
      await more.click();
      for (const label of await labels.all()) await expect(label).toBeVisible();
      await details.first().locator('summary').click();
      await expect(details.first()).toHaveAttribute('open', '');
      await page.setViewportSize({ width: 1024, height: 900 });
      await expect(more).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeVisible();
      await expect(panel).toHaveCSS('position', 'static');
      await expect(panel.locator('details[open]')).toHaveCount(0);
      expect(await panel.evaluate((element, original) => element === original, originalPanel)).toBe(
        true,
      );
      for (const label of await labels.all()) await expect(label).toBeHidden();
      await expect(details.locator('summary')).toHaveCount(3);
      const desktop = await details.locator('summary').evaluateAll(elements =>
        elements.map(element => {
          const rect = element.getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        }),
      );
      for (let index = 1; index < desktop.length; index++) {
        expect(Math.abs(desktop[index].y - desktop[0].y)).toBeLessThanOrEqual(1);
        expect(desktop[index].x).toBeGreaterThan(desktop[index - 1].x);
      }
      await details.last().locator('summary').click();
      await expect(details.last()).toHaveAttribute('open', '');
      await page.setViewportSize({ width: 1023, height: 900 });
      await expect(more).toBeVisible();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(panel).toBeHidden();
      await expect(panel.locator('details[open]')).toHaveCount(0);
      expect(await panel.evaluate((element, original) => element === original, originalPanel)).toBe(
        true,
      );
      await expect(actions).toHaveCount(1);
      await expect(panel).toHaveCount(1);
      await expect(details).toHaveCount(3);
      await more.click();
      await expect(panel).toBeVisible();
      await page.setViewportSize({ width: 390, height: 900 });
      await expect(panel).toBeHidden();
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      expect(await panel.evaluate((element, original) => element === original, originalPanel)).toBe(
        true,
      );
      await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
      expect(pageErrors).toEqual([]);
    } finally {
      await originalPanel?.dispose();
    }
  },
);

test(
  'ATP-BASIC-TABS-01: task tabs reveal active drafts, compact by container width and switch or close through All tabs',
  { tag: ['@admin', '@flow', '@layout'] },
  async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsAdmin(page);
    await withDraftStudents(page, 3, async students => {
      const effects = collectDraftEffects(page, true);
      // The existing three-task limit excludes the workspace anchor; do not raise it.
      const titles = students.map(
        (student, index) =>
          `${student.name} task ${index + 1} with a deliberately long unique unsaved tab title`,
      );
      for (const [index, student] of students.entries()) {
        await openStudentDraftEdit(page, student.name, student.id);
        await studentDraftNameInput(page).fill(titles[index]!);
        await waitForStudentDraft(page, titles[index]!, student.id);
      }

      const items = page.getByTestId('tab-items');
      const more = page.getByTestId('tab-items-more');
      // A CSS/test-id locator also resolves the native popover while it is closed.
      const list = page.getByTestId('tab-items-list');
      const tabs = items.getByRole('tab');
      const viewport = items.locator('.tab-items-viewport');
      const scroller = viewport.locator(':scope > .tab-items-scroll');
      const task = (index: number) => items.getByRole('tab', { name: titles[index], exact: true });
      const select = (index: number) =>
        list.locator('.tab-items-select').filter({ hasText: titles[index]! });
      const expectBounds = async (popup: Locator) => {
        const bounds = (await popup.boundingBox())!;
        expect(bounds).not.toBeNull();
        expect(bounds.x).toBeGreaterThanOrEqual(-1);
        expect(bounds.y).toBeGreaterThanOrEqual(-1);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
      };
      const openMenu = async (remaining: number[], active?: number, keyboard = false) => {
        await expect(more).toHaveAccessibleName('All tabs');
        await expect(more).toHaveJSProperty('tagName', 'BUTTON');
        await expect(list).toBeHidden();
        if (keyboard) {
          await more.focus();
          await more.press('Enter');
        } else {
          await more.click();
        }
        await expect(list).toBeVisible();
        await expect(list).toHaveAttribute('popover', 'auto');
        await expect(list).toHaveAttribute('role', 'group');
        await expect(list).toHaveAccessibleName('All tabs');
        expect(await list.evaluate(element => element.matches(':popover-open'))).toBe(true);
        await expect(list.locator('.tab-items-row')).toHaveCount(remaining.length);
        await expect(list.locator('.tab-items-select')).toHaveCount(remaining.length);
        await expect(list.locator('.tab-items-select').first()).toBeFocused();
        for (const index of remaining) {
          const row = list.locator('.tab-items-row').filter({
            has: page.locator('.tab-items-select').filter({ hasText: titles[index]! }),
          });
          await expect(row).toHaveCount(1);
          await expect(select(index)).toHaveJSProperty('tagName', 'BUTTON');
          const close = row.getByRole('button', {
            name: `Close tab: ${titles[index]}`,
            exact: true,
          });
          await expect(close).toBeEnabled();
          // Switching and closing are sibling actions, never nested buttons.
          await expect(select(index).locator('button')).toHaveCount(0);
          await expect(row.getByRole('button')).toHaveCount(2);
          if (index === active) await expect(select(index)).toHaveAttribute('aria-current', 'page');
          else await expect(select(index)).not.toHaveAttribute('aria-current', 'page');
          expect(
            await select(index).evaluate(element => {
              const rect = element.getBoundingClientRect();
              return element.contains(
                document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2),
              );
            }),
          ).toBe(true);
        }
        await expect(list.locator('.tab-items-select[aria-current="page"]')).toHaveCount(
          active === undefined ? 0 : 1,
        );
        await expectBounds(list);
      };
      const choose = async (index: number, keyboard = false) => {
        if (keyboard) {
          await select(index).focus();
          await select(index).press('Enter');
        } else {
          await select(index).click();
        }
        await expect(list).toBeHidden();
        await expect(page).toHaveURL(
          new RegExp(`/training-student(?:%3A|:)student/${students[index]!.id}/edit(?:[?#]|$)`),
        );
        await expect(studentDraftNameInput(page)).toHaveValue(titles[index]!);
        await expect(task(index)).toHaveAttribute('aria-selected', 'true');
      };
      const expectStrip = async (compact: boolean, count: number) => {
        await expect(items).toHaveAttribute('data-compact', String(compact));
        const width = await items.evaluate(element => element.getBoundingClientRect().width);
        if (compact) expect(width).toBeLessThan(240);
        else expect(width).toBeGreaterThanOrEqual(240);
        await expect(tabs).toHaveCount(count);
        await expect(items.locator('.tab-items-content')).toHaveAttribute('role', 'tablist');
        await expect(more).toBeVisible();
        await expect
          .poll(() =>
            items.evaluate(element => {
              const header = element.closest('.navbar')!;
              const headerBox = header.getBoundingClientRect();
              const more = header.querySelector('[data-testid="tab-items-more"]')!;
              const boxes = [element, more].map(node => node.getBoundingClientRect());
              return (
                headerBox.left >= -1 &&
                headerBox.right <= document.documentElement.clientWidth + 1 &&
                header.scrollWidth <= header.clientWidth + 1 &&
                boxes.every(
                  box =>
                    box.width > 0 &&
                    box.left >= headerBox.left - 1 &&
                    box.right <= headerBox.right + 1,
                )
              );
            }),
          )
          .toBe(true);
        await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
      };
      const expectActiveRevealed = async (index: number) => {
        await expect
          .poll(() =>
            task(index).evaluate(element => {
              const viewport = element.closest('.tab-items-scroll')!;
              const tab = element.getBoundingClientRect();
              const clip = viewport.getBoundingClientRect();
              return tab.left >= clip.left - 1 && tab.right <= clip.right + 1;
            }),
          )
          .toBe(true);
      };
      const close = async (index: number) => {
        await list
          .getByRole('button', { name: `Close tab: ${titles[index]}`, exact: true })
          .click();
        // Assert the exact persisted identity, not just removal of a rendered row.
        await expectNoStudentDraft(page, students[index]!.id);
        await expect(task(index)).toHaveCount(0);
        await expect(select(index)).toHaveCount(0);
        // A close action may intentionally leave the list open for consecutive closes.
        if (await list.isVisible()) await page.keyboard.press('Escape');
        await expect(list).toBeHidden();
      };

      await expectStrip(false, 3);
      await expect(task(2)).toHaveAttribute('aria-selected', 'true');
      await expectActiveRevealed(2);
      await task(2).hover();
      const taskClose = task(2).locator('.tab-close');
      await expect(taskClose).toBeVisible();
      await expect(taskClose).toHaveCSS('top', '2px');
      expect(
        await taskClose.evaluate(element => {
          const icon = element.getBoundingClientRect();
          const tab = element.closest('[role="tab"]')!.getBoundingClientRect();
          const clip = element.closest('.tab-items-scroll')!.getBoundingClientRect();
          return (
            icon.top >= Math.max(tab.top, clip.top) &&
            icon.bottom <= Math.min(tab.bottom, clip.bottom) &&
            icon.left >= Math.max(tab.left, clip.left) &&
            icon.right <= Math.min(tab.right, clip.right)
          );
        }),
      ).toBe(true);
      await expect(list).toBeHidden();
      await expect(scroller).toHaveJSProperty('tagName', 'DIV');
      await expect(scroller).toHaveCSS('overflow-x', 'auto');

      // Basic caps tab titles at 130px. Find a naturally constrained header where
      // all three tasks still render (wrapper >=240px) and actually overflow.
      const geometries: { width: number; wrapper: number; overflow: number }[] = [];
      for (const width of [900, 800, 700, 600, 520, 480, 440, 400]) {
        await page.setViewportSize({ width, height: 900 });
        const geometry = await items.evaluate(async element => {
          // Let the container observer and its render settle before choosing a size.
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          const scroller = element.querySelector('.tab-items-scroll')!;
          return {
            wrapper: element.getBoundingClientRect().width,
            overflow: scroller.scrollWidth - scroller.clientWidth,
          };
        });
        geometries.push({ width, ...geometry });
        if (geometry.wrapper >= 240 && geometry.overflow > 1) break;
        if (geometry.wrapper < 240) break;
      }
      expect(
        geometries.some(geometry => geometry.wrapper >= 240 && geometry.overflow > 1),
        `Expected real noncompact tab overflow: ${JSON.stringify(geometries)}`,
      ).toBe(true);
      await expectStrip(false, 3);
      await expect
        .poll(() => scroller.evaluate(element => element.scrollWidth - element.clientWidth))
        .toBeGreaterThan(1);
      // Task insertion follows the current model entry, not creation chronology.
      // Derive the strip edges from its rendered order before testing reveal.
      const renderedOrder = await tabs.evaluateAll((elements, titles) => {
        return elements.map(element =>
          titles.findIndex(title => element.textContent!.includes(title)),
        );
      }, titles);
      expect(renderedOrder.toSorted()).toEqual([0, 1, 2]);
      const firstTask = renderedOrder[0]!;
      const lastTask = renderedOrder[renderedOrder.length - 1]!;
      await openMenu([0, 1, 2], 2);
      await choose(firstTask);
      await expectActiveRevealed(firstTask);
      await expect(viewport).not.toHaveClass(/\bhas-start\b/);
      await expect(viewport).toHaveClass(/\bhas-end\b/);
      const firstPosition = await scroller.evaluate(element => element.scrollLeft);
      const triggerBefore = (await more.boundingBox())!;
      await scroller.hover();
      await page.mouse.wheel(10_000, 0);
      await expect
        .poll(() => scroller.evaluate(element => element.scrollLeft))
        .toBeGreaterThan(firstPosition + 1);
      await expect(viewport).toHaveClass(/\bhas-start\b/);
      await expect(viewport).not.toHaveClass(/\bhas-end\b/);
      await openMenu([0, 1, 2], firstTask);
      await choose(lastTask);
      await expectActiveRevealed(lastTask);
      await openMenu([0, 1, 2], lastTask);
      await choose(firstTask);
      await expectActiveRevealed(firstTask);
      await expect(viewport).not.toHaveClass(/\bhas-start\b/);
      await openMenu([0, 1, 2], firstTask);
      await choose(lastTask);
      await expectActiveRevealed(lastTask);
      await expect
        .poll(() => scroller.evaluate(element => element.scrollLeft))
        .toBeGreaterThan(firstPosition + 1);
      const triggerAfter = (await more.boundingBox())!;
      for (const key of ['x', 'y', 'width', 'height'] as const) {
        expect(Math.abs(triggerAfter[key] - triggerBefore[key])).toBeLessThanOrEqual(1);
      }
      await openMenu([0, 1, 2], lastTask);
      await choose(2);

      await page.setViewportSize({ width: 320, height: 900 });
      await expectStrip(true, 1);
      await expect(task(2)).toHaveAttribute('aria-selected', 'true');
      await testInfo.attach('ATP-BASIC-TABS-01-320px-header', {
        body: await items.locator('xpath=ancestor::*[contains(@class, "navbar")][1]').screenshot(),
        contentType: 'image/png',
      });
      await openMenu([0, 1, 2], 2, true);
      await testInfo.attach('ATP-BASIC-TABS-01-320px-all-tabs', {
        body: await list.screenshot(),
        contentType: 'image/png',
      });
      await select(0).focus();
      await page.keyboard.press('Escape');
      await expect(list).toBeHidden();
      await expect(more).toBeFocused();
      await expect(studentDraftNameInput(page)).toHaveValue(titles[2]!);
      await openMenu([0, 1, 2], 2, true);
      await choose(0, true);
      await expectStrip(true, 1);
      await openMenu([0, 1, 2], 0);
      await close(1);
      await expect(studentDraftNameInput(page)).toHaveValue(titles[0]!);
      await waitForStudentDraft(page, titles[0]!, students[0]!.id);
      await waitForStudentDraft(page, titles[2]!, students[2]!.id);

      // The current workspace anchor is not a secondary task. Its compact strip
      // must be empty, but All tabs must still expose every surviving child.
      await page.locator('.tabs-lifted').getByRole('tab', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      await expectStrip(true, 0);
      await openMenu([0, 2]);
      await choose(0);
      await expectStrip(true, 1);

      await page.setViewportSize({ width: 1440, height: 900 });
      await expectStrip(false, 2);
      await expectActiveRevealed(0);
      await openMenu([0, 2], 0, true);
      await page.keyboard.press('Escape');
      await expect(list).toBeHidden();
      await expect(more).toBeFocused();
      await openMenu([0, 2], 0);
      await close(0);
      await expect(studentDraftNameInput(page)).toHaveValue(titles[2]!);
      await expect(task(2)).toHaveAttribute('aria-selected', 'true');
      await openMenu([2], 2);
      await close(2);
      await expect(page).toHaveURL(studentResourceUrl);
      await expect(tabs).toHaveCount(0);
      for (const student of students) await expectNoStudentDraft(page, student.id);
      await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.consoleErrors).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-BASIC-FLOW-01: cold Admin navigation initializes dynamic resource selectors',
  { tag: ['@admin', '@flow'] },
  async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    try {
      await page.goto('/admin/login', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await page.evaluate(() => {
        indexedDB.deleteDatabase('localforage');
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.goto('/admin/login?returnTo=/rest/resource/training-student%253Astudent', {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const usernameInput = page.getByPlaceholder('Your Username');
      const passwordInput = page.getByPlaceholder('Your Password');
      await usernameInput.fill('admin');
      await passwordInput.fill('123456');
      await expect(usernameInput).toHaveValue('admin');
      await expect(passwordInput).toHaveValue('123456');
      await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');

      const initialSelect = waitForStudentSelect(page);
      const loginResponse = page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          response.request().method() === 'POST' && url.pathname === '/api/home/user/passport/login'
        );
      });
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      try {
        expect((await loginResponse).ok()).toBeTruthy();
        await expect(page).toHaveURL(studentResourceUrl);
        await initialSelect;
      } finally {
        await initialSelect.catch(() => {});
      }
      await expect(page.getByLabel('Student Name')).toBeVisible();

      await page.getByRole('link', { name: 'Home', exact: true }).click();
      await expect(page).toHaveURL(/\/admin\/(?:\?|$)/);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(
        page.getByRole('heading', { name: 'Vona integrated SSR', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Zova standalone SSR', exact: true }),
      ).toBeVisible();
      await expect(page.locator('body')).toBeVisible();

      expect(pageErrors).toEqual([]);
      expect(
        consoleErrors.some(
          error =>
            error.includes("Cannot read properties of undefined (reading 'resource')") ||
            error.includes('resource not specified'),
        ),
      ).toBeFalsy();
    } finally {
      await context.close();
    }
  },
);

test(
  'ATP-BASIC-FLOW-02: Training Student flow filter wraps and submits queries',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);

    const dashboardResponse = await loginAsAdmin(page);
    expect(dashboardResponse?.ok()).toBeTruthy();
    expect(dashboardResponse?.headers()['cache-control']).toBe('private, no-store');
    const dashboardHtml = await dashboardResponse!.text();
    expect(dashboardHtml).toMatch(/<body[^>]+style="[^"]*display:none;/);
    expect(dashboardHtml).toContain('__leftDrawerOpenJS');
    expect(dashboardHtml).toContain('ssr-body-ready-observer');

    const initialSelect = waitForStudentSelect(page);
    await page.getByRole('link', { name: 'Student', exact: true }).click();
    await expect(page).toHaveURL(studentResourceUrl);
    await initialSelect;

    const name = page.getByLabel('Student Name');
    const level = page.getByRole('combobox', { name: 'Training Stage' });
    const createdAt = page.locator('label').filter({ hasText: /^Created At/ });
    const dates = createdAt.locator('input[type="date"]');
    const createdAtStart = dates.nth(0);
    const createdAtEnd = dates.nth(1);
    const search = page.getByRole('button', { name: 'Search', exact: true });
    const reset = page.getByRole('button', { name: 'Reset', exact: true });

    await expect(name).toBeVisible();
    await expect(level).toBeVisible();
    await expect(dates).toHaveCount(2);
    await expect(search).toHaveCount(1);
    await expect(reset).toHaveCount(1);
    await expect(search).toBeVisible();
    await expect(reset).toBeVisible();

    const wideGeometry = await getFlowGeometry(name, level, createdAtStart);
    expect(wideGeometry[0].container.display).toBe('flex');
    expect(wideGeometry[0].container.flexWrap).toBe('wrap');
    expect(wideGeometry[1].container).toEqual(wideGeometry[0].container);
    expect(wideGeometry[2].container).toEqual(wideGeometry[0].container);
    expect(Math.abs(wideGeometry[0].field.top - wideGeometry[1].field.top)).toBeLessThanOrEqual(2);
    expect(Math.abs(wideGeometry[1].field.top - wideGeometry[2].field.top)).toBeLessThanOrEqual(2);
    assertVisualOrder(wideGeometry);
    for (const geometry of wideGeometry) {
      expect(geometry.field.right).toBeLessThanOrEqual(geometry.container.right + 1);
    }
    const actionFlowMatchesFieldFlow = await search.evaluate(element => {
      const actionFlow = element.parentElement?.parentElement?.parentElement;
      const fieldFlow = element.closest('section')?.querySelector('label')
        ?.parentElement?.parentElement;
      return actionFlow === fieldFlow;
    });
    expect(actionFlowMatchesFieldFlow).toBeTruthy();

    const drawer = page.locator('.drawer').first();
    await expect(drawer).toHaveClass(/\bdrawer-open\b/);

    await page.setViewportSize({ width: 1023, height: 900 });
    await expect(drawer).not.toHaveClass(/\bdrawer-open\b/);
    await expect
      .poll(
        async () =>
          new Set(
            (await getFlowGeometry(name, level, createdAtStart)).map(item =>
              Math.round(item.field.top),
            ),
          ).size,
      )
      .toBeGreaterThan(1);

    const narrowGeometry = await getFlowGeometry(name, level, createdAtStart);
    assertVisualOrder(narrowGeometry);
    const viewport = page.viewportSize()!;
    for (const geometry of narrowGeometry) {
      expect(geometry.field.left).toBeGreaterThanOrEqual(-1);
      expect(geometry.field.right).toBeLessThanOrEqual(viewport.width + 1);
    }
    const createdAtEndBox = await createdAtEnd.boundingBox();
    expect(createdAtEndBox).not.toBeNull();
    expect(createdAtEndBox!.x + createdAtEndBox!.width).toBeLessThanOrEqual(viewport.width + 1);
    await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(drawer).toHaveClass(/\bdrawer-open\b/);

    await page.setViewportSize({ width: 1440, height: 900 });
    await name.fill('Flow E2E');
    await level.selectOption('2');
    await createdAtStart.fill('2026-01-10');
    await createdAtEnd.fill('2026-01-20');

    const searchResponse = waitForStudentSelect(page);
    await search.click();
    const searchUrl = new URL((await searchResponse).url());
    expect(searchUrl.searchParams.get('name')).toBe('Flow E2E');
    expect(searchUrl.searchParams.get('level')).toBe('2');
    expect(searchUrl.searchParams.get('createdAt')).toBe('2026-01-10~2026-01-20');
    await expect(name).toHaveValue('Flow E2E');
    await expect(level).toHaveValue('2');

    await reset.click();
    await expect(name).toHaveValue('');
    await expect(level).toHaveValue('');
    await expect(createdAtStart).toHaveValue('');
    await expect(createdAtEnd).toHaveValue('');
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-TABLE-01: Training Student table submits server sorting and pins configured columns',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const studentName = `Table E2E ${Date.now()}`;
    const accessToken = (await page.context().cookies()).find(
      cookie => cookie.name === 'token',
    )?.value;
    expect(accessToken).toBeTruthy();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let studentId: string | number | undefined;
    try {
      const createResponse = await page.request.post('/api/training/student', {
        data: { name: studentName, mobile: '13812345678', level: 1 },
        headers,
      });
      expect(createResponse.ok()).toBeTruthy();
      studentId = (await createResponse.json()).data;
      expect(['string', 'number']).toContain(typeof studentId);

      const initialSelect = waitForStudentSelect(page);
      await page.getByRole('link', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      await initialSelect;
      // Keep the container above the compact breakpoint while forcing real horizontal overflow.
      const tableWrapper = basicTableWrapper(page);
      await tableWrapper.evaluate(element => {
        element.style.width = '800px';
      });
      await expect(tableWrapper).toHaveAttribute('data-table-compact', 'false');
      expect(await tableWrapper.evaluate(element => element.clientWidth)).toBeGreaterThanOrEqual(
        768,
      );

      const nameSort = page.getByRole('button', { name: 'Sort by name', exact: true });
      const nameHeader = nameSort.locator('xpath=ancestor::th');
      const precedingPinnedHeader = nameHeader.locator('xpath=preceding-sibling::th[1]');
      const operationsHeader = page.getByRole('columnheader', { name: 'Operations', exact: true });
      await expect(nameSort).toBeVisible();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
      await expect(precedingPinnedHeader).toHaveCSS('position', 'sticky');
      await expect(precedingPinnedHeader).toHaveCSS('left', '0px');
      await expect(nameHeader).toHaveCSS('position', 'sticky');
      const [precedingPinnedWidth, namePinnedOffset] = await Promise.all([
        precedingPinnedHeader.evaluate(element => element.getBoundingClientRect().width),
        nameHeader.evaluate(element => Number.parseFloat(getComputedStyle(element).left)),
      ]);
      expect(Math.abs(namePinnedOffset - precedingPinnedWidth)).toBeLessThanOrEqual(1);
      await expect(nameHeader).toHaveCSS('min-width', '240px');
      await expect(nameHeader).toHaveCSS('text-align', 'left');
      await expect(operationsHeader).toHaveCSS('position', 'sticky');
      await expect(operationsHeader).toHaveCSS('right', '0px');
      await expect(operationsHeader).toHaveCSS('min-width', '360px');
      await expect(operationsHeader).toHaveCSS('text-align', 'center');

      const descendingResponse = waitForStudentSelect(page, false);
      await nameSort.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
      const descending = await descendingResponse;
      expect(descending.status()).toBe(200);
      const descendingUrl = new URL(descending.url());
      expect(JSON.parse(descendingUrl.searchParams.get('orders')!)).toEqual([['name', 'desc']]);

      const ascendingResponse = waitForStudentSelect(page, false);
      await nameSort.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      const ascending = await ascendingResponse;
      expect(ascending.status()).toBe(200);
      const ascendingUrl = new URL(ascending.url());
      expect(JSON.parse(ascendingUrl.searchParams.get('orders')!)).toEqual([['name', 'asc']]);

      await expect(tableWrapper).toBeVisible();
      const overflow = await tableWrapper.evaluate(element => {
        return element.scrollWidth > element.clientWidth;
      });
      expect(overflow).toBeTruthy();
      await tableWrapper.evaluate(element => {
        element.scrollLeft = element.scrollWidth;
      });
      await expect(operationsHeader).toHaveCSS('right', '0px');

      const operationsRow = page
        .locator('tbody tr')
        .filter({
          has: page.getByRole('button', { name: 'Summary', exact: true }),
        })
        .first();
      const operationActions = operationsRow.getByRole('button');
      await expect(operationActions).toHaveCount(4);
      for (const action of await operationActions.all()) {
        await expect(action).toBeVisible();
      }
      const operationsGeometry = await operationActions.evaluateAll(actions => {
        const cell = actions[0]?.closest('td');
        const join = actions[0]?.parentElement;
        const wrapper = cell?.closest('table')?.parentElement;
        if (!cell || !join || !wrapper)
          throw new Error('Could not resolve the Operations action cell');
        const cellRect = cell.getBoundingClientRect();
        const joinRect = join.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const tolerance = 2;
        return {
          fitsCell: join.scrollWidth <= cell.clientWidth,
          joinFitsCell:
            joinRect.left >= cellRect.left - tolerance &&
            joinRect.right <= cellRect.right + tolerance,
          actionsFitWrapper: actions.every(action => {
            const rect = action.getBoundingClientRect();
            return (
              rect.left >= wrapperRect.left - tolerance &&
              rect.right <= wrapperRect.right + tolerance
            );
          }),
        };
      });
      expect(operationsGeometry).toEqual({
        fitsCell: true,
        joinFitsCell: true,
        actionsFitWrapper: true,
      });
      expect(pageErrors).toEqual([]);
    } finally {
      if (studentId !== undefined) {
        const deleteResponse = await page.request.delete(
          `/api/training/student/deleteForce/${studentId}`,
          { headers },
        );
        expect(deleteResponse.ok()).toBeTruthy();
      }
    }
  },
);

test(
  'ATP-BASIC-TABLE-04: container resizing compacts row actions and narrow SSR reloads hydrate cleanly',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const consoleWarnings: string[] = [];
    page.on('console', message => {
      if (
        message.type() === 'warning' ||
        /hydration.*mismatch|mismatch.*hydration/i.test(message.text())
      ) {
        consoleWarnings.push(message.text());
      }
    });
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student]) => {
      const initialSelect = waitForStudentSelect(page);
      await page.getByRole('link', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      await initialSelect;
      await page.getByLabel('Student Name').fill(student.name);
      const filteredResponse = waitForStudentSelect(page);
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      await filteredResponse;

      const wrapper = basicTableWrapper(page);
      const row = wrapper.locator('tbody tr').filter({
        has: page.getByRole('link', { name: student.name, exact: true }),
      });
      const nameHeader = wrapper
        .getByRole('button', { name: 'Sort by name', exact: true })
        .locator('xpath=ancestor::th');
      const operationsHeader = wrapper.getByRole('columnheader', {
        name: 'Operations',
        exact: true,
      });
      const operationsCell = row.locator('td').last();
      const more = row.getByRole('button', { name: 'More actions', exact: true });
      // CSS locators also see the mounted action group while the native popover is closed.
      const actions = row.locator('[popover="auto"][role="group"][aria-label="Row actions"]');
      await expect(row).toHaveCount(1);
      await expect(wrapper).toHaveAttribute('data-table-compact', 'false');
      await expect(nameHeader).toHaveCSS('position', 'sticky');
      await expect(operationsHeader).toHaveCSS('min-width', '360px');

      const profileWrites: string[] = [];
      const observeProfileWrites = (request: Request) => {
        const path = new URL(request.url()).pathname;
        if (
          (path === '/api/layoutprofile/save' || path === '/api/layoutprofile/reset') &&
          !request.headers()['x-vona-openapi-schema']
        ) {
          profileWrites.push(`${request.method()} ${path}`);
        }
      };
      page.on('request', observeProfileWrites);
      try {
        // The viewport stays desktop-sized: only the Basic table's own container changes.
        for (const width of [360, 320]) {
          await wrapper.evaluate((element, width) => {
            element.style.width = `${width}px`;
          }, width);
          await expect(wrapper).toHaveAttribute('data-table-compact', 'true');
          await expect.poll(() => wrapper.evaluate(element => element.clientWidth)).toBe(width);
          expect(page.viewportSize()?.width).toBe(1440);
          await expect
            .poll(() =>
              wrapper
                .locator('th, td')
                .evaluateAll(cells =>
                  cells.every(cell => getComputedStyle(cell).position !== 'sticky'),
                ),
            )
            .toBe(true);
          await expect(operationsHeader).toHaveCSS('min-width', '80px');
          await expect(operationsCell).toHaveCSS('min-width', '80px');
          await expect
            .poll(() =>
              operationsCell.evaluate(element =>
                Math.abs(element.getBoundingClientRect().width - 80),
              ),
            )
            .toBeLessThanOrEqual(1);
          await expect(more).toHaveCount(1);
          await expect(row.getByRole('button')).toHaveCount(1);
          await expect(actions).toHaveCount(1);
          await expect(actions).toBeHidden();
          await expect(actions.locator('button')).toHaveCount(4);
          await wrapper.evaluate(element => {
            element.scrollLeft = element.scrollWidth;
          });
          const reach = await wrapper.evaluate(element => ({
            overflow: element.scrollWidth - element.clientWidth,
            remaining: element.scrollWidth - element.clientWidth - element.scrollLeft,
          }));
          expect(reach.overflow).toBeGreaterThan(0);
          expect(Math.abs(reach.remaining)).toBeLessThanOrEqual(1);
          await expect(more).toBeInViewport();
        }

        // Clip below the first row so a normal descendant menu cannot pass this check.
        await wrapper.evaluate(element => {
          const table = element.querySelector('table')!;
          const row = table.querySelector('tbody tr')!;
          const height = row.getBoundingClientRect().bottom - table.getBoundingClientRect().top;
          element.style.height = `${Math.ceil(height)}px`;
          element.style.overflowY = 'hidden';
        });
        await more.click();
        await expect(actions).toBeVisible();
        await expect(more).toHaveAttribute('aria-expanded', 'true');
        for (const label of ['Edit', 'Delete', 'Force Delete', 'Summary']) {
          const action = actions.getByRole('button', { name: label, exact: true });
          await expect(action).toBeVisible();
          await expect(action).toHaveText(label);
        }
        const deleteAction = actions.getByRole('button', { name: 'Delete', exact: true });
        const clipping = await deleteAction.evaluate(element => {
          const wrapper = element.closest('[data-table-compact]')!;
          const rect = element.getBoundingClientRect();
          const clip = wrapper.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          return {
            outside: y > clip.bottom || y < clip.top || x < clip.left || x > clip.right,
            hit: element.contains(document.elementFromPoint(x, y)),
          };
        });
        expect(clipping).toEqual({ outside: true, hit: true });
        await deleteAction.focus();
        await page.keyboard.press('Escape');
        await expect(actions).toBeHidden();
        await expect(more).toHaveAttribute('aria-expanded', 'false');
        await expect(more).toBeFocused();
        await more.click();
        await deleteAction.click();
        await expect(actions).toBeHidden();
        await expect(more).toHaveAttribute('aria-expanded', 'false');
        const confirmDialog = page.getByRole('dialog').filter({
          hasText: 'Are you sure you want to delete this item?',
        });
        await expect(confirmDialog).toBeVisible();
        await confirmDialog.getByRole('button', { name: 'No', exact: true }).click();
        await expect(confirmDialog).toHaveCount(0);
        await expect(row).toHaveCount(1);

        await more.click();
        await actions.getByRole('button', { name: 'Summary', exact: true }).press('Enter');
        await expect(actions).toBeHidden();
        await expect(more).toHaveAttribute('aria-expanded', 'false');
        const summaryDialog = page.getByRole('dialog').filter({
          has: page.getByRole('heading', { name: 'Summary', exact: true }),
        });
        await expect(summaryDialog).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(summaryDialog).toHaveCount(0);

        await wrapper.evaluate(element => {
          element.style.width = '800px';
          element.style.removeProperty('height');
          element.style.removeProperty('overflow-y');
        });
        await expect(wrapper).toHaveAttribute('data-table-compact', 'false');
        await expect(nameHeader).toHaveCSS('position', 'sticky');
        await expect(operationsHeader).toHaveCSS('position', 'sticky');
        await expect(operationsHeader).toHaveCSS('min-width', '360px');
        await expect(operationsCell).toHaveCSS('min-width', '360px');
        await expect(more).toHaveCount(0);
        await expect(row.getByRole('button')).toHaveCount(4);
        expect(profileWrites).toEqual([]);

        for (const width of [320, 390]) {
          await page.setViewportSize({ width, height: 900 });
          const response = await page.reload({ waitUntil: 'load' });
          expect(response?.ok()).toBeTruthy();
          await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
          await expect(wrapper).toHaveAttribute('data-table-compact', 'true');
          await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
          await expect(
            wrapper
              .locator('tbody tr')
              .first()
              .getByRole('button', { name: 'More actions', exact: true }),
          ).toHaveCount(1);
        }
        // Closing the cached Admin tab must unmount the table without ref teardown errors.
        await page.setViewportSize({ width: 1440, height: 900 });
        const studentTab = page.getByRole('tab', { name: 'Student', exact: true });
        await studentTab.hover();
        await studentTab.locator('.tab-close').click();
        await expect(studentTab).toHaveCount(0);
        await expect(wrapper).toHaveCount(0);
        const reopenedSelect = waitForStudentSelect(page);
        await page.getByRole('link', { name: 'Student', exact: true }).click();
        await reopenedSelect;
        await expect(wrapper).toBeVisible();
        await expect(wrapper).toHaveAttribute('data-table-compact', 'false');
        expect(profileWrites).toEqual([]);
        expect(consoleWarnings).toEqual([]);
        expect(consoleErrors).toEqual([]);
        expect(pageErrors).toEqual([]);
      } finally {
        page.off('request', observeProfileWrites);
      }
    });
  },
);

test(
  'ATP-BASIC-TABLE-05: mobile-UA SSR starts compact before scripts and container width wins after hydration',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page, browser }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student]) => {
      const loaded = waitForStudentSelect(page);
      await page.getByRole('link', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      await loaded;
      const listUrl = page.url();
      const storageState = await page.context().storageState();
      for (const scenario of [
        { mobile: true, width: 390, unsupportedPopover: false },
        { mobile: true, width: 1440, unsupportedPopover: false },
        { mobile: false, width: 390, unsupportedPopover: false },
        { mobile: true, width: 390, unsupportedPopover: true },
      ]) {
        const context = await browser.newContext({
          baseURL: new URL(listUrl).origin,
          storageState,
          userAgent: scenario.mobile ? mobileUserAgent : desktopUserAgent,
          viewport: { width: scenario.width, height: 900 },
        });
        try {
          if (scenario.unsupportedPopover) {
            await context.addInitScript(() => {
              Object.defineProperty(HTMLElement.prototype, 'showPopover', {
                configurable: true,
                value: undefined,
              });
            });
          }
          const ssrPage = await context.newPage();
          const pageErrors = collectPageErrors(ssrPage);
          const consoleErrors = collectConsoleErrors(ssrPage);
          const hydrationWarnings: string[] = [];
          ssrPage.on('console', message => {
            if (/hydration.*mismatch|mismatch.*hydration/i.test(message.text())) {
              hydrationWarnings.push(message.text());
            }
          });
          let releaseScripts!: () => void;
          const scriptsHeld = new Promise<void>(resolve => {
            releaseScripts = resolve;
          });
          let heldScripts = 0;
          const holdExternalScripts = async (route: Route) => {
            if (route.request().resourceType() === 'script') {
              heldScripts++;
              await scriptsHeld;
            }
            await route.continue();
          };
          await ssrPage.route('**/*', holdExternalScripts);
          try {
            const response = await ssrPage.goto(listUrl, { waitUntil: 'commit' });
            expect(response?.ok()).toBeTruthy();
            expect(response?.headers()['cache-control']).toBe('private, no-store');
            expect((response?.headers().vary ?? '').toLowerCase().split(/\s*,\s*/)).not.toContain(
              'user-agent',
            );
            const wrapper = basicTableWrapper(ssrPage);
            const row = wrapper.locator('tbody tr').filter({
              has: ssrPage.getByRole('link', { name: student.name, exact: true }),
            });
            const operationsHeader = wrapper.getByRole('columnheader', {
              name: 'Operations',
              exact: true,
            });
            const operationsCell = row.locator('td').last();
            const more = row.getByRole('button', { name: 'More actions', exact: true });
            const actions = row.locator('[popover="auto"][role="group"][aria-label="Row actions"]');
            await expect(row).toHaveCount(1);
            await ssrPage.waitForFunction(() =>
              Array.from(
                document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
              ).every(link => link.sheet !== null),
            );
            await expect.poll(() => heldScripts).toBeGreaterThan(0);
            await expect(ssrPage.locator('html')).not.toHaveAttribute('data-zova-hydrated');
            await expect(wrapper).toHaveAttribute('data-table-compact', String(scenario.mobile));
            if (scenario.mobile) {
              for (const cell of [operationsHeader, operationsCell]) {
                await expect(cell).toHaveCSS('width', '80px');
                await expect(cell).toHaveCSS('min-width', '80px');
              }
              const heading = operationsHeader.locator('.sr-only');
              await expect(heading).toHaveText('Operations');
              await expect(heading).toHaveCSS('position', 'absolute');
              await expect(heading).toHaveCSS('width', '1px');
              await expect(more).toBeVisible();
              await expect(more).toHaveAttribute('aria-expanded', 'false');
              await expect(actions).toHaveCount(1);
              await expect(actions).toBeHidden();
              await expect(actions.locator('button')).toHaveCount(4);
              await expect(row.getByRole('button')).toHaveCount(1);
            } else {
              await expect(more).toHaveCount(0);
              await expect(row.getByRole('button')).toHaveCount(4);
            }

            releaseScripts();
            await ssrPage.waitForLoadState('load');
            await expect(ssrPage.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
            const measuredCompact = scenario.width < 768 && !scenario.unsupportedPopover;
            await expect(wrapper).toHaveAttribute('data-table-compact', String(measuredCompact));
            if (measuredCompact) {
              await expect(operationsHeader).toHaveCSS('min-width', '80px');
              const actionsId = await actions.getAttribute('id');
              expect(actionsId).toBeTruthy();
              await expect(more).toHaveAttribute('popovertarget', actionsId!);
              await expect(more).toHaveAttribute('aria-controls', actionsId!);
              await more.scrollIntoViewIfNeeded();
              await more.click();
              await expect(actions).toBeVisible();
              await expect(
                actions.getByRole('button', { name: 'Summary', exact: true }),
              ).toBeVisible();
              await ssrPage.keyboard.press('Escape');
              await expect(actions).toBeHidden();
              await expect(more).toHaveAttribute('aria-expanded', 'false');
            } else {
              if (!scenario.unsupportedPopover) {
                expect(
                  await wrapper.evaluate(element => element.clientWidth),
                ).toBeGreaterThanOrEqual(768);
              }
              await expect(operationsHeader).toHaveCSS('min-width', '360px');
              await expect(more).toHaveCount(0);
              await expect(row.getByRole('button')).toHaveCount(4);
              if (scenario.unsupportedPopover) {
                const summary = row.getByRole('button', { name: 'Summary', exact: true });
                await summary.scrollIntoViewIfNeeded();
                await summary.click();
                const dialog = ssrPage.getByRole('dialog');
                await expect(dialog).toBeVisible();
                await expect(
                  dialog.getByRole('heading', { name: 'Summary', exact: true }),
                ).toBeVisible();
                await ssrPage.keyboard.press('Escape');
                await expect(dialog).toHaveCount(0);
              }
            }
            expect(hydrationWarnings).toEqual([]);
            expect(consoleErrors).toEqual([]);
            expect(pageErrors).toEqual([]);
          } finally {
            releaseScripts();
            // Drain released handlers before closing their context, preserving the first failure.
            await ssrPage.unrouteAll({ behavior: 'wait' });
          }
        } finally {
          await context.close();
        }
      }
    });
  },
);

test(
  'ATP-BASIC-TABLE-03: compact row delete handles cancellation, local failures, and retry',
  { tag: ['@admin', '@flow'] },
  async ({ page, request }) => {
    test.setTimeout(120_000);
    page.setDefaultTimeout(10_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    let scenarioError: unknown;
    let cleanupError: unknown;
    const studentName = `Row Delete E2E ${Date.now()}`;
    const accessToken = (await page.context().cookies()).find(
      cookie => cookie.name === 'token',
    )?.value;
    expect(accessToken).toBeTruthy();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let studentId: string | number | undefined;
    try {
      const createResponse = await page.request.post('/api/training/student', {
        data: { name: studentName, mobile: '13812345678', level: 1 },
        headers,
      });
      expect(createResponse.ok()).toBeTruthy();
      studentId = (await createResponse.json()).data;
      expect(['string', 'number']).toContain(typeof studentId);

      const initialSelect = waitForStudentSelect(page);
      await page.getByRole('link', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      await initialSelect;

      await page.getByLabel('Student Name').fill(studentName);
      const filteredResponse = waitForStudentSelect(page);
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      await filteredResponse;

      await page.setViewportSize({ width: 390, height: 900 });
      const wrapper = basicTableWrapper(page);
      await expect(wrapper).toHaveAttribute('data-table-compact', 'true');
      const row = wrapper.locator('tbody tr').filter({
        has: page.getByRole('link', { name: studentName, exact: true }),
      });
      const more = row.getByRole('button', { name: 'More actions', exact: true });
      const actions = row.locator('[popover="auto"][role="group"][aria-label="Row actions"]');
      const deleteButton = actions.getByRole('button', {
        name: 'Delete',
        exact: true,
        includeHidden: true,
      });
      const openActions = async () => {
        if (!(await actions.isVisible())) await more.click();
        await expect(actions).toBeVisible();
        await expect(actions.locator('button')).toHaveCount(4);
      };
      const confirmDialog = page.getByRole('dialog').filter({
        hasText: 'Are you sure you want to delete this item?',
      });
      await expect(row).toHaveCount(1);
      await expect(actions).toBeHidden();
      await openActions();
      await expect(deleteButton).toBeVisible();

      let cancelledRequestCount = 0;
      const cancelledRequestListener = (request: Request) => {
        const url = new URL(request.url());
        if (
          request.method() === 'DELETE' &&
          url.pathname === `/api/training/student/${studentId}` &&
          !request.headers()['x-vona-openapi-schema']
        ) {
          cancelledRequestCount++;
        }
      };
      page.on('request', cancelledRequestListener);
      try {
        await deleteButton.click();
        await expect(actions).toBeHidden();
        await expect(more).toHaveAttribute('aria-expanded', 'false');
        await expect(confirmDialog).toBeVisible();
        await confirmDialog.getByRole('button', { name: 'No', exact: true }).click();
        await expect(confirmDialog).toHaveCount(0);
        await expect(row).toHaveCount(1);
        await openActions();
        await expect(deleteButton).toBeEnabled();
        await expect(deleteButton).not.toHaveAttribute('aria-busy', 'true');
        expect(cancelledRequestCount).toBe(0);
      } finally {
        page.off('request', cancelledRequestListener);
      }

      let failureRequestCount = 0;
      let releaseFailedDelete: (() => void) | undefined;
      const failedDeleteHeld = new Promise<void>(resolve => {
        releaseFailedDelete = resolve;
      });
      const deleteRoute = (url: URL) => url.pathname === `/api/training/student/${studentId}`;
      const failedDeleteErrors: unknown[] = [];
      const pendingFailedDeletes: Promise<void>[] = [];
      const failedDeleteHandler = (route: Route) => {
        failureRequestCount++;
        const handled = (async () => {
          await failedDeleteHeld;
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ code: 500, message: 'Row deletion temporarily unavailable' }),
          });
        })().catch(error => {
          // Report owned route failures after draining, not as detached Playwright errors.
          failedDeleteErrors.push(error);
        });
        pendingFailedDeletes.push(handled);
        return handled;
      };
      await page.route(deleteRoute, failedDeleteHandler);
      let failureScenarioError: unknown;
      try {
        await deleteButton.click();
        await confirmDialog.getByRole('button', { name: 'Yes', exact: true }).click();
        await expect.poll(() => failureRequestCount).toBe(1);
        await expect(confirmDialog).toHaveCount(0);
        await openActions();
        await expect(deleteButton).toBeDisabled();
        await expect(deleteButton).toHaveAttribute('aria-busy', 'true');
        await expect(deleteButton.locator('.loading.loading-spinner')).toHaveCount(1);
        const pendingDelete = await deleteButton.elementHandle();
        expect(pendingDelete).not.toBeNull();
        try {
          await page.keyboard.press('Escape');
          await expect(actions).toBeHidden();
          await expect(more).toBeFocused();
          // Closed native popovers hide, rather than replace, the running action component.
          expect(await pendingDelete!.evaluate(element => element.isConnected)).toBe(true);
          await expect(deleteButton).toBeDisabled();
          await expect(deleteButton).toHaveAttribute('aria-busy', 'true');
          await openActions();
          expect(
            await deleteButton.evaluate((element, pending) => element === pending, pendingDelete),
          ).toBe(true);
          await expect(deleteButton).toBeDisabled();
          await expect(deleteButton.locator('.loading.loading-spinner')).toHaveCount(1);
          await deleteButton.click({ force: true });
          expect(failureRequestCount).toBe(1);
          await page.keyboard.press('Escape');
          await expect(actions).toBeHidden();
          await expect(more).toBeFocused();
        } finally {
          await pendingDelete?.dispose();
        }

        releaseFailedDelete?.();
        const errorDialog = page.getByRole('dialog').filter({
          hasText: 'Row deletion temporarily unavailable',
        });
        await expect(errorDialog).toBeVisible();
        await expect(errorDialog.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
        await expect(row).toHaveCount(1);
        await errorDialog.getByRole('button', { name: 'Close', exact: true }).click();
        await expect(errorDialog).toHaveCount(0);
        await expect(deleteButton).toBeEnabled();
        await expect(deleteButton).not.toHaveAttribute('aria-busy', 'true');
        await expect(deleteButton.locator('.loading.loading-spinner')).toHaveCount(0);
        await openActions();
        await expect(deleteButton).toBeEnabled();
        await expect(deleteButton).not.toHaveAttribute('aria-busy', 'true');
        await page.keyboard.press('Escape');
        await expect(actions).toBeHidden();
        await openActions();
        await expect(deleteButton).toBeEnabled();
        expect(failureRequestCount).toBe(1);
      } catch (error) {
        failureScenarioError = error;
      } finally {
        releaseFailedDelete?.();
        // A held route must finish before unroute can let that request continue.
        for (let index = 0; index < pendingFailedDeletes.length; index++) {
          await pendingFailedDeletes[index];
        }
        try {
          await page.unroute(deleteRoute, failedDeleteHandler);
        } catch (error) {
          failedDeleteErrors.push(error);
        }
      }
      if (failedDeleteErrors.length) {
        throw new AggregateError(
          failureScenarioError === undefined
            ? failedDeleteErrors
            : [failureScenarioError, ...failedDeleteErrors],
          'Compact row delete assertion or route cleanup failed',
        );
      }
      if (failureScenarioError !== undefined) throw failureScenarioError;

      const deleteRequest = page.waitForRequest(request => {
        const url = new URL(request.url());
        return (
          request.method() === 'DELETE' &&
          url.pathname === `/api/training/student/${studentId}` &&
          !request.headers()['x-vona-openapi-schema']
        );
      });
      const deleteResponse = page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          response.request().method() === 'DELETE' &&
          url.pathname === `/api/training/student/${studentId}` &&
          !response.request().headers()['x-vona-openapi-schema']
        );
      });
      const refetchResponse = waitForStudentSelect(page, false);
      await deleteButton.click();
      await confirmDialog.getByRole('button', { name: 'Yes', exact: true }).click();
      const [, response, refetch] = await Promise.all([
        deleteRequest,
        deleteResponse,
        refetchResponse,
      ]);
      expect(response.ok()).toBeTruthy();
      expect(refetch.ok()).toBeTruthy();
      await expect(row).toHaveCount(0);
      expect(pageErrors).toEqual([]);
    } catch (error) {
      scenarioError = error;
    } finally {
      if (studentId !== undefined) {
        try {
          const deleteResponse = await request.delete(
            `/api/training/student/deleteForce/${studentId}`,
            {
              headers,
              timeout: 10_000,
            },
          );
          expect(
            deleteResponse.ok() || deleteResponse.status() === 404,
            `Failed to clean up Training Student ${studentName} (${studentId}): ${deleteResponse.status()}`,
          ).toBeTruthy();
        } catch (error) {
          cleanupError = error;
        }
      }
    }
    if (cleanupError !== undefined) {
      if (scenarioError !== undefined) {
        throw new AggregateError(
          [scenarioError, cleanupError],
          'Compact row delete assertion and owned fixture cleanup failed',
        );
      }
      throw cleanupError;
    }
    if (scenarioError !== undefined) throw scenarioError;
  },
);

test(
  'ATP-BASIC-TABLE-02: Training Student selection mode preserves page state and bulk deletes selected rows',
  { tag: ['@admin', '@flow'] },
  async ({ page }, testInfo) => {
    testInfo.setTimeout(120_000);
    page.setDefaultTimeout(10_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const fixturePrefix = `Selection E2E ${Date.now()}`;
    const fixtureNames = Array.from(
      { length: 21 },
      (_, index) => `${fixturePrefix} ${String(index + 1).padStart(2, '0')}`,
    );
    const visibleFixtureNames = fixtureNames.toReversed();
    const fixtureRecords: Array<{ id: string | number; name: string }> = [];
    const accessToken = (await page.context().cookies()).find(
      cookie => cookie.name === 'token',
    )?.value;
    expect(accessToken).toBeTruthy();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const allPageCheckbox = page.getByRole('checkbox', {
      name: 'Select all rows on this page',
      exact: true,
    });
    const selectionStatus = page
      .getByRole('status')
      .filter({ hasText: /^Selected (?:\d+ items|one item)$/ });
    const select = page.getByRole('button', { name: 'Select', exact: true });
    const done = page.getByRole('button', { name: 'Done', exact: true });
    const create = page.getByRole('button', { name: 'Create', exact: true });
    const deleteBulk = page.getByRole('button', { name: 'Bulk Delete', exact: true });
    const rowFor = (name: string) => page.locator('tbody tr').filter({ hasText: name });
    const rowCheckboxFor = (name: string) =>
      rowFor(name).getByRole('checkbox', { name: /^Select row / });
    const selectPage = async () => {
      const response = waitForStudentSelect(page);
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      return await response;
    };

    try {
      for (const name of fixtureNames) {
        const createResponse = await page.request.post('/api/training/student', {
          data: { name, mobile: '13812345678', level: 1 },
          headers,
        });
        expect(createResponse.ok()).toBeTruthy();
        const id = (await createResponse.json()).data;
        expect(['string', 'number']).toContain(typeof id);
        fixtureRecords.unshift({ id, name });
      }

      const initialSelect = waitForStudentSelect(page);
      await page.getByRole('link', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      await initialSelect;

      await page.getByLabel('Student Name').fill(fixturePrefix);
      const filteredResponse = await selectPage();
      const filteredUrl = new URL(filteredResponse.url());
      expect(filteredUrl.searchParams.get('name')).toBe(fixturePrefix);
      await expect(rowFor(visibleFixtureNames[0])).toHaveCount(1);
      await expect(rowFor(visibleFixtureNames[20])).toHaveCount(0);

      await expect(create).toBeVisible();
      await expect(create).toBeEnabled();
      await expect(select).toBeVisible();
      await expect(allPageCheckbox).toHaveCount(0);
      await expect(deleteBulk).toBeDisabled();

      await select.click();
      await expect(done).toBeVisible();
      await expect(selectionStatus).toHaveText('Selected 0 items');
      await expect(allPageCheckbox).toBeVisible();
      await expect(rowCheckboxFor(visibleFixtureNames[0])).toBeVisible();

      await rowCheckboxFor(visibleFixtureNames[0]).check();
      await expect(rowFor(visibleFixtureNames[0])).toHaveAttribute('aria-selected', 'true');
      await expect(selectionStatus).toHaveText('Selected one item');
      await expect(allPageCheckbox).toHaveAttribute('aria-checked', 'mixed');
      await expect(allPageCheckbox).toHaveJSProperty('indeterminate', true);

      await done.click();
      await expect(select).toBeVisible();
      await expect(allPageCheckbox).toHaveCount(0);
      await expect(create).toBeEnabled();

      await select.click();
      await rowCheckboxFor(visibleFixtureNames[0]).check();
      await allPageCheckbox.check();
      await expect(selectionStatus).toHaveText('Selected 20 items');
      await expect(allPageCheckbox).toBeChecked();
      await expect(allPageCheckbox).toHaveJSProperty('indeterminate', false);

      const pageTwoResponse = waitForStudentSelect(page);
      await page.getByRole('button', { name: '»', exact: true }).click();
      const pageTwoUrl = new URL((await pageTwoResponse).url());
      expect(pageTwoUrl.searchParams.get('pageNo')).toBe('2');
      await expect(selectionStatus).toHaveText('Selected 20 items');
      await expect(rowFor(visibleFixtureNames[20])).toHaveCount(1);
      await expect(rowCheckboxFor(visibleFixtureNames[20])).not.toBeChecked();

      await rowCheckboxFor(visibleFixtureNames[20]).check();
      await expect(rowFor(visibleFixtureNames[20])).toHaveAttribute('aria-selected', 'true');
      await expect(selectionStatus).toHaveText('Selected 21 items');

      await page.getByRole('button', { name: '«', exact: true }).click();
      await expect(rowFor(visibleFixtureNames[0])).toHaveCount(1);
      await expect(allPageCheckbox).toBeChecked();
      await allPageCheckbox.uncheck();
      await expect(selectionStatus).toHaveText('Selected one item');

      await rowCheckboxFor(visibleFixtureNames[9]).check();
      await expect(selectionStatus).toHaveText('Selected 2 items');
      await page.getByLabel('Student Name').fill(`${fixturePrefix} 1`);
      await selectPage();
      await expect(selectionStatus).toHaveText('Selected 0 items');
      await expect(rowFor(visibleFixtureNames[9])).toHaveAttribute('aria-selected', 'false');

      await rowCheckboxFor(visibleFixtureNames[9]).check();
      await expect(selectionStatus).toHaveText('Selected one item');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(page.getByLabel('Student Name')).toHaveValue('');
      await expect(selectionStatus).toHaveText('Selected 0 items');
      await page.getByLabel('Student Name').fill(fixturePrefix);
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      await expect(rowFor(visibleFixtureNames[0])).toHaveCount(1);

      await rowCheckboxFor(visibleFixtureNames[0]).check();
      await expect(selectionStatus).toHaveText('Selected one item');
      const nameSort = page.getByRole('button', { name: 'Sort by name', exact: true });
      const sortResponse = waitForStudentSelect(page);
      await nameSort.click();
      await sortResponse;
      await expect(selectionStatus).toHaveText('Selected 0 items');

      await nameSort.click();
      const selectedRows = page.locator('tbody tr').filter({ hasText: fixturePrefix });
      await expect(selectedRows).toHaveCount(20);
      const selectedNames = await selectedRows.evaluateAll(rows =>
        rows.slice(0, 2).map(row => row.querySelector('td:nth-child(3) a')?.textContent?.trim()),
      );
      const selectedIds = await selectedRows.evaluateAll(rows =>
        rows
          .slice(0, 2)
          .map(row => Number(row.querySelector('td:nth-child(2)')?.textContent?.trim())),
      );
      expect(selectedNames.every((name): name is string => Boolean(name))).toBeTruthy();
      expect(selectedIds.every(Number.isInteger)).toBeTruthy();
      await rowCheckboxFor(selectedNames[0]).check();
      await rowCheckboxFor(selectedNames[1]).check();
      await expect(selectionStatus).toHaveText('Selected 2 items');
      await expect(deleteBulk).toBeEnabled();

      let cancelledRequestCount = 0;
      const cancelledRequestListener = (request: Request) => {
        if (
          request.method() === 'POST' &&
          new URL(request.url()).pathname === '/api/training/student/bulk/delete'
        ) {
          cancelledRequestCount++;
        }
      };
      page.on('request', cancelledRequestListener);
      try {
        await deleteBulk.click();
        await expect(page.getByRole('dialog')).toContainText('2 selected items');
        await page.getByRole('button', { name: 'No', exact: true }).click();
        await expect(selectionStatus).toHaveText('Selected 2 items');
        expect(cancelledRequestCount).toBe(0);
      } finally {
        page.off('request', cancelledRequestListener);
      }

      let failureRequestCount = 0;
      const bulkDeleteRoute = (url: URL) => url.pathname === '/api/training/student/bulk/delete';
      const bulkDeleteFailureHandler = async (route: Route) => {
        failureRequestCount++;
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ code: 500, message: 'Bulk deletion temporarily unavailable' }),
        });
      };
      await page.route(bulkDeleteRoute, bulkDeleteFailureHandler);
      try {
        await deleteBulk.click();
        await page.getByRole('button', { name: 'Yes', exact: true }).click();
        await expect.poll(() => failureRequestCount).toBe(1);
        await expect(selectionStatus).toHaveText('Selected 2 items');
        await expect(rowFor(selectedNames[0])).toHaveAttribute('aria-selected', 'true');
        await expect(rowFor(selectedNames[1])).toHaveAttribute('aria-selected', 'true');

        const errorDialog = page.getByRole('dialog').filter({
          hasText: 'Bulk deletion temporarily unavailable',
        });
        await expect(errorDialog).toBeVisible();
        await expect(errorDialog.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
        await errorDialog.getByRole('button', { name: 'Close', exact: true }).click();
        await expect(errorDialog).toHaveCount(0);
        await expect(deleteBulk).toBeEnabled();
        await expect(deleteBulk).not.toHaveAttribute('aria-busy', 'true');
        await expect(deleteBulk.locator('.loading.loading-spinner')).toHaveCount(0);
      } finally {
        await page.unroute(bulkDeleteRoute, bulkDeleteFailureHandler);
      }

      const bulkDeleteRequest = page.waitForRequest(request => {
        const url = new URL(request.url());
        return request.method() === 'POST' && url.pathname === '/api/training/student/bulk/delete';
      });
      const bulkDeleteResponse = page.waitForResponse(response => {
        const url = new URL(response.url());
        return (
          response.request().method() === 'POST' &&
          response.ok() &&
          url.pathname === '/api/training/student/bulk/delete'
        );
      });
      const refetchResponse = waitForStudentSelect(page);
      await deleteBulk.click();
      await page.getByRole('button', { name: 'Yes', exact: true }).click();
      const [request, response, refetch] = await Promise.all([
        bulkDeleteRequest,
        bulkDeleteResponse,
        refetchResponse,
      ]);
      expect(response.ok()).toBeTruthy();
      expect(request.postDataJSON()).toEqual({ ids: selectedIds });
      expect(refetch.ok()).toBeTruthy();

      await expect(rowFor(selectedNames[0])).toHaveCount(0);
      await expect(rowFor(selectedNames[1])).toHaveCount(0);
      await expect(selectionStatus).toHaveText('Selected 0 items');
      await expect(page.locator('tbody tr[aria-selected="true"]')).toHaveCount(0);
      await expect(deleteBulk).toBeDisabled();
      expect(pageErrors).toEqual([]);
    } finally {
      for (const { id, name } of fixtureRecords) {
        const deleteResponse = await page.request.delete(
          `/api/training/student/deleteForce/${id}`,
          {
            headers,
            timeout: 10_000,
          },
        );
        expect(
          deleteResponse.ok() || deleteResponse.status() === 404,
          `Failed to clean up Training Student ${name} (${id}): ${deleteResponse.status()}`,
        ).toBeTruthy();
      }
    }
  },
);

test(
  'ATP-BASIC-RESOURCE-PICKER-01: Training Record selects and cancels a routed Student picker',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const studentName = `Resource Picker E2E ${Date.now()}`;
    const accessToken = (await page.context().cookies()).find(
      cookie => cookie.name === 'token',
    )?.value;
    expect(accessToken).toBeTruthy();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let studentId: string | number | undefined;
    try {
      const createResponse = await page.request.post('/api/training/student', {
        data: { name: studentName, mobile: '13812345678', level: 1 },
        headers,
      });
      expect(createResponse.ok()).toBeTruthy();
      studentId = (await createResponse.json()).data;
      expect(['string', 'number']).toContain(typeof studentId);

      const response = await page.goto('/admin/rest/resource/training-record%3Arecord/create', {
        waitUntil: 'load',
      });
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const browserUrl = page.url();
      const studentField = page.getByRole('group', { name: 'Student *', exact: true });
      const pickerTrigger = studentField.locator('button');
      await expect(pickerTrigger).toBeVisible();

      const initialSelect = waitForStudentSelect(page);
      await pickerTrigger.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveCount(1);
      await initialSelect;
      expect(page.url()).toBe(browserUrl);

      const row = dialog.locator('tbody tr').filter({ hasText: studentName });
      await expect(row).toHaveCount(1);
      await expect(dialog.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
      await expect(row.getByRole('radio', { name: /^Select row / })).toHaveCount(1);

      await row.getByRole('radio', { name: /^Select row / }).check();
      await expect(row).toHaveAttribute('aria-selected', 'true');
      await expect(dialog.locator('span.text-sm[role="status"]')).toHaveText('Selected one item');
      await expect(dialog.getByRole('button', { name: 'Select', exact: true })).toBeEnabled();
      await dialog.getByRole('button', { name: 'Select', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(pickerTrigger).toHaveText(studentName);
      expect(page.url()).toBe(browserUrl);

      await pickerTrigger.click();
      await expect(dialog).toHaveCount(1);
      await expect(row).toHaveCount(1);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(pickerTrigger).toHaveText(studentName);
      expect(page.url()).toBe(browserUrl);
      expect(pageErrors).toEqual([]);
    } finally {
      if (studentId !== undefined) {
        const deleteResponse = await page.request.delete(
          `/api/training/student/deleteForce/${studentId}`,
          { headers },
        );
        expect(deleteResponse.ok()).toBeTruthy();
      }
    }
  },
);

test(
  'ATP-BASIC-DRAFT-01: default-on create recovery restores ordinary and nested fields without submitting',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    const name = `Create Draft E2E ${Date.now()}`;
    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await studentDraftNameInput(page).fill(name);
    await page
      .getByRole('group', { name: 'Mobile *', exact: true })
      .getByRole('textbox')
      .fill('13812345678');
    await page.locator('.ProseMirror').last().fill(`Nested draft ${name}`);
    await waitForStudentDraft(page, name);
    await expect
      .poll(async () => {
        const snapshot = (await readStudentDrafts(page)).find(draft => draft.mode === 'create');
        return (snapshot?.values.content as { descriptionMarkdown?: string } | undefined)
          ?.descriptionMarkdown;
      })
      .toContain(name);
    await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
    const progress = page
      .getByRole('group', { name: 'Training Stage *', exact: true })
      .getByRole('button', { name: 'Progress Track', exact: true });
    await progress.click();
    await expect(progress).toHaveClass(/\bbtn-info\b/);
    await expect
      .poll(async () => {
        const snapshot = (await readStudentDrafts(page)).find(draft => draft.mode === 'create');
        return snapshot?.values.level;
      })
      .toBe(2);

    const html = await (await page.request.get(studentDraftCreatePath)).text();
    expect(html).not.toContain('Unsaved draft available');
    expect(html).not.toContain(name);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
    await reloadStudentDraft(page);
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await recoverStudentDraft(page);
    await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
    await expect(progress).toHaveClass(/\bbtn-info\b/);
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await expect(studentDraftNameInput(page)).toHaveValue(name);
    await expect(
      page.getByRole('group', { name: 'Mobile *', exact: true }).getByRole('textbox'),
    ).toHaveValue('13812345678');
    await expect(page.locator('.ProseMirror').last()).toContainText(name);
    await waitForStudentDraft(page, name);
    expect(effects.mutations).toEqual([]);

    await reloadStudentDraft(page);
    await page.getByRole('tab', { name: 'Basic Information', exact: true }).click();
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(studentDraftBanner(page)).toHaveCount(0);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-DRAFT-02: default-on edit recovery and candidate discard never PATCH the record',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const editedName = `${student.name} unsaved`;
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftNameInput(page).fill(editedName);
      await waitForStudentDraft(page, editedName, student.id);
      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await recoverStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);
      const response = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(response.ok()).toBeTruthy();
      expect((await response.json()).name).toBe(student.name);
      expect(effects.mutations).toEqual([]);

      await reloadStudentDraft(page);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expectNoStudentDraft(page, student.id);
      await page.reload({ waitUntil: 'load' });
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-BASIC-DRAFT-03: successful create and edit submission remove their exact draft identities',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    const capture = installStudentCreateResponseCapture(page);
    await capture.install();
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    const headers = { Authorization: `Bearer ${token}` };
    const name = `Submitted Draft E2E ${Date.now()}`;
    let studentId: string | number | undefined;
    try {
      await openStudentDraftCreate(page);
      await studentDraftNameInput(page).fill(name);
      await page
        .getByRole('group', { name: 'Mobile *', exact: true })
        .getByRole('textbox')
        .fill('13812345678');
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await page.getByText('Foundation Track', { exact: true }).click();
      await waitForStudentDraft(page, name);
      const create = page.waitForResponse(
        response =>
          response.request().method() === 'POST' &&
          new URL(response.url()).pathname === '/api/training/student' &&
          !response.request().headers()['x-vona-openapi-schema'],
      );
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      expect((await create).ok()).toBeTruthy();
      studentId = capture.studentId;
      expect(['string', 'number']).toContain(typeof studentId);
      await expect(page).toHaveURL(studentResourceUrl);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expectNoStudentDraft(page);
      await openStudentDraftCreate(page);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(studentDraftNameInput(page)).not.toHaveValue(name);

      await page.goto(`/admin/rest/resource/training-student%3Astudent/${studentId}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const updatedName = `${name} updated`;
      await studentDraftNameInput(page).fill(updatedName);
      await waitForStudentDraft(page, updatedName, studentId);
      const update = page.waitForResponse(
        response =>
          response.request().method() === 'PATCH' &&
          new URL(response.url()).pathname === `/api/training/student/${studentId}` &&
          !response.request().headers()['x-vona-openapi-schema'],
      );
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      expect((await update).ok()).toBeTruthy();
      await expect(page).toHaveURL(/training-student(?:%3A|:)student\/create/);
      await page.waitForLoadState('load');
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expectNoStudentDraft(page, studentId);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${studentId}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(updatedName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
    } finally {
      studentId ??= capture.studentId;
      try {
        if (studentId !== undefined) {
          const response = await page.request.delete(
            `/api/training/student/deleteForce/${studentId}`,
            { headers },
          );
          expect(response.ok() || response.status() === 404).toBeTruthy();
        }
      } finally {
        await capture.uninstall();
      }
    }
  },
);

test(
  'ATP-BASIC-DRAFT-04: ordinary Back and explicit task close delete drafts instead of recovering them',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await openStudentDraftCreate(page);
    const backName = `Back Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(backName);
    await waitForStudentDraft(page, backName);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page).toHaveURL(studentResourceUrl);
    await expectNoStudentDraft(page);
    await openStudentDraftCreate(page);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(studentDraftNameInput(page)).not.toHaveValue(backName);

    const closeName = `Closed Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(closeName);
    await waitForStudentDraft(page, closeName);
    const task = page.getByRole('tab', { name: closeName, exact: true });
    await expect(task).toBeVisible();
    await task.hover();
    await task.locator('.tab-close').click();
    await expect(task).toHaveCount(0);
    await expectNoStudentDraft(page);
    await openStudentDraftCreate(page);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(studentDraftNameInput(page)).not.toHaveValue(closeName);
    expect(effects.mutations).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-DRAFT-05: switching tasks retains drafts and workspace close removes inactive edit drafts',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 2, async ([first, second]) => {
      await openStudentDraftEdit(page, first.name, first.id);
      const firstDraft = `${first.name} unsaved`;
      await studentDraftNameInput(page).fill(firstDraft);
      await waitForStudentDraft(page, firstDraft, first.id);
      await openStudentDraftEdit(page, second.name, second.id);
      const secondDraft = `${second.name} unsaved`;
      await studentDraftNameInput(page).fill(secondDraft);
      await waitForStudentDraft(page, secondDraft, second.id);

      await page.getByRole('tab', { name: firstDraft, exact: true }).click();
      await expect(studentDraftNameInput(page)).toHaveValue(firstDraft);
      await waitForStudentDraft(page, firstDraft, first.id);
      await waitForStudentDraft(page, secondDraft, second.id);
      await page.getByRole('link', { name: 'Student', exact: true }).click();
      await expect(page).toHaveURL(studentResourceUrl);
      const workspace = page
        .locator('.tabs-lifted')
        .getByRole('tab', { name: 'Student', exact: true });
      await workspace.hover();
      await workspace.locator('.tab-close').click();
      await expect(workspace).toHaveCount(0);
      await expectNoStudentDraft(page, first.id);
      await expectNoStudentDraft(page, second.id);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${first.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(studentDraftNameInput(page)).toHaveValue(first.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${second.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(studentDraftNameInput(page)).toHaveValue(second.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-BASIC-DRAFT-06: edit recovery rejects a changed server baseline without overwriting it',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const unsavedName = `${student.name} unsaved`;
      await studentDraftNameInput(page).fill(unsavedName);
      await waitForStudentDraft(page, unsavedName, student.id);
      const serverName = `${student.name} changed on server`;
      const change = await page.request.patch(`/api/training/student/${student.id}`, {
        headers,
        data: { name: serverName, mobile: '13812345678', level: 1 },
      });
      expect(change.ok()).toBeTruthy();
      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(serverName);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Recover draft', exact: true })
        .click();
      await expect(studentDraftBanner(page)).toContainText(
        'This draft cannot be recovered because the form or record has changed.',
      );
      await expect(studentDraftNameInput(page)).toHaveValue(serverName);
      await waitForStudentDraft(page, unsavedName, student.id);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      const unchanged = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(unchanged.ok()).toBeTruthy();
      expect((await unchanged.json()).name).toBe(serverName);
      expect(effects.mutations).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-BASIC-DRAFT-07: failed create validation retains recoverable incomplete input',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await openStudentDraftCreate(page);
    const name = `Invalid Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(name);
    const mobile = page.getByRole('group', { name: 'Mobile *', exact: true });
    await mobile.getByRole('textbox').fill('123');
    await waitForStudentDraft(page, name);
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(mobile.locator('.text-error')).toBeVisible();
    await expect(page).toHaveURL(/training-student(?:%3A|:)student\/create/);
    await waitForStudentDraft(page, name);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    expect(effects.mutations).toEqual([]);

    await reloadStudentDraft(page);
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(name);
    await expect(mobile.getByRole('textbox')).toHaveValue('123');
    await waitForStudentDraft(page, name);
    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    expect(effects.mutations).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-DRAFT-08: locale changes preserve recovered dirty input and current-schema persistence',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await openStudentDraftCreate(page);
    const name = `Locale Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(name);
    await waitForStudentDraft(page, name);
    await reloadStudentDraft(page);
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(name);

    const localeMenu = page
      .locator('details')
      .filter({ has: page.getByText('Chinese', { exact: true }) });
    await expect(localeMenu).toHaveCount(1);
    await localeMenu.locator('summary').click();
    await localeMenu.getByText('Chinese', { exact: true }).click();
    const chineseName = page
      .getByRole('group', { name: '学生姓名 *', exact: true })
      .getByRole('textbox');
    await expect(chineseName).toBeVisible();
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: '丢弃草稿', exact: true })).toHaveCount(0);
    await waitForStudentDraft(page, name);
    await expect(chineseName).toHaveValue(name);
    const nextName = `${name} 中文`;
    await chineseName.fill(nextName);
    await waitForStudentDraft(page, nextName);

    const chineseLocaleMenu = page
      .locator('details')
      .filter({ has: page.getByText('英语', { exact: true }) });
    await chineseLocaleMenu.locator('summary').click();
    await chineseLocaleMenu.getByText('英语', { exact: true }).click();
    await expect(studentDraftNameInput(page)).toHaveValue(nextName);
    await reloadStudentDraft(page);
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(nextName);
    await waitForStudentDraft(page, nextName);
    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(nextName);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-DRAFT-11: edit locale refresh preserves recovered names but resets translated level options to the server baseline',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const effects = collectDraftEffects(page);
      const editedName = `${student.name} locale unsaved`;
      const selectBasic = async (locale = 'en') => {
        await page
          .getByRole('tab', {
            name: locale === 'en' ? 'Basic Information' : '基本信息',
            exact: true,
          })
          .click();
      };
      const selectTraining = async (locale = 'en') => {
        await page
          .getByRole('tab', {
            name: locale === 'en' ? 'Student Training Records' : '学生培训记录',
            exact: true,
          })
          .click();
      };
      const expectDraftValues = async (level: number) => {
        await expect
          .poll(async () => {
            const draft = (await readStudentDrafts(page)).find(
              draft => draft.mode === 'edit' && draft.id === String(student.id),
            );
            return { name: draft?.values.name, level: draft?.values.level };
          })
          .toEqual({ name: editedName, level });
      };
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      const englishLevel = page.getByRole('group', { name: 'Training Stage *', exact: true });
      const foundation = englishLevel.getByRole('button', {
        name: 'Foundation Track',
        exact: true,
      });
      const progress = englishLevel.getByRole('button', { name: 'Progress Track', exact: true });
      await studentDraftNameInput(page).fill(editedName);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bbtn-warning\b/);
      await progress.click();
      await expect(progress).toHaveClass(/\bbtn-info\b/);
      await expectDraftValues(2);

      await reloadStudentDraft(page);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bbtn-warning\b/);
      await expect(progress).toHaveClass(/\bbtn-outline\b/);
      await expectDraftValues(2);
      await recoverStudentDraft(page);
      await expect(progress).toHaveClass(/\bbtn-info\b/);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);

      const localeMenu = page
        .locator('details')
        .filter({ has: page.getByText('Chinese', { exact: true }) });
      await expect(localeMenu).toHaveCount(1);
      await localeMenu.locator('summary').click();
      await localeMenu.getByText('Chinese', { exact: true }).click();
      const chineseName = page
        .getByRole('group', { name: '学生姓名 *', exact: true })
        .getByRole('textbox');
      const chineseLevel = page.getByRole('group', { name: '培训阶段 *', exact: true });
      const chineseFoundation = chineseLevel.getByRole('button', { name: '基础班', exact: true });
      const chineseProgress = chineseLevel.getByRole('button', { name: '提升班', exact: true });
      await selectBasic('zh');
      await expect(chineseName).toHaveValue(editedName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: '丢弃草稿', exact: true })).toHaveCount(0);
      // This custom renderer has localized options and an opaque slot, so it takes normal reset.
      await selectTraining('zh');
      await expect(chineseFoundation).toHaveClass(/\bbtn-warning\b/);
      await expect(chineseProgress).toHaveClass(/\bbtn-outline\b/);
      await expectDraftValues(1);
      expect(effects.mutations).toEqual([]);

      // Make level dirty again to prove the reverse locale change also resets to server truth.
      await chineseProgress.click();
      await expect(chineseProgress).toHaveClass(/\bbtn-info\b/);
      await expectDraftValues(2);
      const chineseLocaleMenu = page
        .locator('details')
        .filter({ has: page.getByText('英语', { exact: true }) });
      await expect(chineseLocaleMenu).toHaveCount(1);
      await chineseLocaleMenu.locator('summary').click();
      await chineseLocaleMenu.getByText('英语', { exact: true }).click();
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bbtn-warning\b/);
      await expect(progress).toHaveClass(/\bbtn-outline\b/);
      await expectDraftValues(1);
      expect(effects.mutations).toEqual([]);
      const unchanged = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(unchanged.ok()).toBeTruthy();
      const persisted = await unchanged.json();
      expect(persisted.name).toBe(student.name);
      expect(persisted.level).toBe(1);

      await reloadStudentDraft(page);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expectDraftValues(1);
      await recoverStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(editedName);
      await selectTraining();
      await expect(foundation).toHaveClass(/\bbtn-warning\b/);
      await expect(progress).toHaveClass(/\bbtn-outline\b/);
      await expectDraftValues(1);
      await reloadStudentDraft(page);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      await selectBasic();
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-BASIC-DRAFT-12: nested Training Time create drafts persist ISO and reopen the recovered date without submitting',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    const effects = collectDraftEffects(page, true);
    const capture = installStudentCreateResponseCapture(page);
    await capture.install();
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    const headers = { Authorization: `Bearer ${token}` };
    const name = `Training Time Draft E2E ${Date.now()}`;
    const recordName = `${name} record`;
    const date = '2026-03-10';
    const iso = await browserLocalDateIso(page, date);
    const expectNoBusinessRecords = async () => {
      for (const [resource, ownedName] of [
        ['student', name],
        ['record', recordName],
      ]) {
        const response = await page.request.get(`/api/training/${resource}`, {
          headers,
          params: { name: ownedName },
        });
        expect(response.ok()).toBeTruthy();
        expect((await response.json()).list).toEqual([]);
      }
    };
    try {
      await expectNoBusinessRecords();
      await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await studentDraftNameInput(page).fill(name);
      await waitForStudentDraft(page, name);
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      const details = studentDraftTrainingRecords(page);
      await details.getByRole('button', { name: 'Add Detail', exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveCount(1);
      await dialog
        .getByRole('group', { name: 'Training Record Name *', exact: true })
        .getByRole('textbox')
        .fill(recordName);
      await trainingTimeInput(dialog).fill(date);
      await expect(trainingTimeInput(dialog)).toHaveValue(date);
      // The child form is not part of the parent draft until its own OK boundary.
      expect((await readStudentTrainingDraft(page)).rows ?? []).toEqual([]);
      await dialog.getByRole('button', { name: 'OK', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(studentDraftTrainingRow(page, recordName)).toHaveCount(1);
      const expectDateDraft = async () => {
        await expect
          .poll(async () => {
            const draft = await readStudentTrainingDraft(page);
            return {
              rows: draft.rows?.map(row => ({ name: row.name, trainingTime: row.trainingTime })),
              identities: draft.identities,
            };
          })
          // The create DTO omits row IDs, so this array has no relation identity metadata.
          .toEqual({ rows: [{ name: recordName, trainingTime: iso }], identities: undefined });
      };
      await expectDateDraft();
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      const serverHtml = await page.request.get(studentDraftCreatePath);
      expect(serverHtml.ok()).toBeTruthy();
      const html = await serverHtml.text();
      expect(html).not.toContain(recordName);
      expect(html).not.toContain(iso);

      await reloadStudentDraft(page);
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await expect(studentDraftTrainingRow(page, recordName)).toHaveCount(0);
      await expectDateDraft();
      await recoverStudentDraft(page);
      const row = studentDraftTrainingRow(page, recordName);
      await expect(row).toHaveCount(1);
      await row.locator('button.btn-outline.btn-primary').click();
      await expect(dialog).toHaveCount(1);
      // Recovery intentionally supplies ISO strings; Basic Date accepts them without Date revival.
      await expect(trainingTimeInput(dialog)).toHaveValue(date);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft();
      await expectNoBusinessRecords();

      await reloadStudentDraft(page);
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await expect(row).toHaveCount(0);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page);
      await expect(row).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    } finally {
      try {
        // Normally no business row exists; capture only this form's accidental create, if any.
        if (capture.studentId !== undefined) {
          const response = await page.request.delete(
            `/api/training/student/deleteForce/${capture.studentId}`,
            { headers },
          );
          expect(response.ok() || response.status() === 404).toBeTruthy();
        }
      } finally {
        await capture.uninstall();
      }
    }
  },
);

test(
  'ATP-BASIC-DRAFT-13: nested Training Time edit drafts recover changed and cleared dates then discard to the server baseline',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const recordName = `${student.name} dated record`;
      const baselineDate = '2026-03-10';
      const changedDate = '2026-04-18';
      const baselineIso = await browserLocalDateIso(page, baselineDate);
      const changedIso = await browserLocalDateIso(page, changedDate);
      // API-only fixture setup; the tested UI never submits a business resource.
      const setup = await page.request.patch(`/api/training/student/${student.id}`, {
        headers,
        data: {
          name: student.name,
          mobile: '13812345678',
          level: 1,
          trainingRecords: [{ name: recordName, trainingTime: baselineIso }],
        },
      });
      expect(setup.ok()).toBeTruthy();
      const initial = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(initial.ok()).toBeTruthy();
      const baseline = await initial.json();
      expect(baseline.trainingRecords).toHaveLength(1);
      const record = baseline.trainingRecords[0];
      expect(['string', 'number']).toContain(typeof record.id);
      expect(record.name).toBe(recordName);
      expect(new Date(record.trainingTime).toISOString()).toBe(baselineIso);
      const effects = collectDraftEffects(page, true);
      const expectServerBaseline = async () => {
        const response = await page.request.get(`/api/training/student/${student.id}`, { headers });
        expect(response.ok()).toBeTruthy();
        expect(await response.json()).toEqual(baseline);
        expect(effects.mutations).toEqual([]);
      };
      const expectDateDraft = async (trainingTime: string | undefined) => {
        await expect
          .poll(async () => {
            const draft = await readStudentTrainingDraft(page, student.id);
            return {
              rows: draft.rows?.map(row => ({ name: row.name, trainingTime: row.trainingTime })),
              identities: draft.identities,
              cleared: draft.trainingTimeCleared,
            };
          })
          .toEqual({
            rows: [{ name: recordName, trainingTime }],
            identities: [{ id: record.id }],
            cleared: trainingTime === undefined,
          });
      };
      const openRecord = async () => {
        await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
        const row = studentDraftTrainingRow(page, recordName);
        await expect(row).toHaveCount(1);
        await row.locator('button.btn-outline.btn-primary').click();
        await expect(page.getByRole('dialog')).toHaveCount(1);
      };
      const dialog = page.getByRole('dialog');
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue(baselineDate);
      await trainingTimeInput(dialog).fill(changedDate);
      await expectNoStudentDraft(page, student.id);
      await dialog.getByRole('button', { name: 'OK', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft(changedIso);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);

      await reloadStudentDraft(page);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue(baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await recoverStudentDraft(page);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue(changedDate);
      await expectServerBaseline();
      await trainingTimeInput(dialog).fill('');
      await expect(trainingTimeInput(dialog)).toHaveValue('');
      // Clearing the optional date is committed to the parent only on dialog OK.
      await expectDateDraft(changedIso);
      await dialog.getByRole('button', { name: 'OK', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft(undefined);

      await reloadStudentDraft(page);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue(baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await recoverStudentDraft(page);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue('');
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectDateDraft(undefined);
      await expectServerBaseline();

      await reloadStudentDraft(page);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue(baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      await openRecord();
      await expect(trainingTimeInput(dialog)).toHaveValue(baselineDate);
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expectNoStudentDraft(page, student.id);
      await expectServerBaseline();
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
      // withDraftStudents finally deletes this exact student and its nested record via include.
    });
  },
);

test(
  'ATP-BASIC-DRAFT-14: new create input replaces an unrecovered candidate without merging old values',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    const effects = collectDraftEffects(page, true);
    const oldName = `Create Takeover E2E ${Date.now()} old`;
    const nextName = `${oldName} replacement`;
    const mobile = page.getByRole('group', { name: 'Mobile *', exact: true }).getByRole('textbox');
    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await studentDraftNameInput(page).fill(oldName);
    await mobile.fill('13912345678');
    await expect
      .poll(async () => {
        const draft = (await readStudentDrafts(page)).find(draft => draft.mode === 'create');
        return { name: draft?.values.name, mobile: draft?.values.mobile };
      })
      .toEqual({ name: oldName, mobile: '13912345678' });
    await expect(studentDraftBanner(page)).toHaveCount(0);

    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(oldName);
    await expect(mobile).toHaveValue('');
    // A parent onChanged takes over the complete current form, not the stored candidate.
    await studentDraftNameInput(page).fill(nextName);
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
    await expect(mobile).toHaveValue('');
    await expect
      .poll(async () => {
        return (await readStudentDrafts(page))
          .filter(draft => draft.mode === 'create')
          .map(draft => ({ name: draft.values.name, mobile: draft.values.mobile ?? '' }));
      })
      .toEqual([{ name: nextName, mobile: '' }]);

    await reloadStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(nextName);
    await expect(mobile).toHaveValue('');
    await recoverStudentDraft(page);
    await expect(studentDraftNameInput(page)).toHaveValue(nextName);
    await expect(mobile).toHaveValue('');
    await waitForStudentDraft(page, nextName);
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    for (const name of [oldName, nextName]) {
      const response = await page.request.get('/api/training/student', {
        headers: { Authorization: `Bearer ${token}` },
        params: { name },
      });
      expect(response.ok()).toBeTruthy();
      expect((await response.json()).list).toEqual([]);
    }

    await reloadStudentDraft(page);
    await studentDraftBanner(page)
      .getByRole('button', { name: 'Discard draft', exact: true })
      .click();
    await expectNoStudentDraft(page);
    await expect(studentDraftNameInput(page)).not.toHaveValue(nextName);
    await expect(mobile).toHaveValue('');
    await expect(studentDraftBanner(page)).toHaveCount(0);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-DRAFT-15: new edit input replaces an unrecovered candidate with the live server baseline',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      const initial = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(initial.ok()).toBeTruthy();
      const baseline = await initial.json();
      const effects = collectDraftEffects(page, true);
      const oldName = `${student.name} old candidate`;
      const nextName = `${student.name} replacement`;
      const mobile = page
        .getByRole('group', { name: 'Mobile *', exact: true })
        .getByRole('textbox');
      const expectDraftValues = async (name: string, mobile: string) => {
        await expect
          .poll(async () => {
            return (await readStudentDrafts(page))
              .filter(draft => draft.mode === 'edit' && draft.id === String(student.id))
              .map(draft => ({ name: draft.values.name, mobile: draft.values.mobile }));
          })
          .toEqual([{ name, mobile }]);
      };
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftNameInput(page).fill(oldName);
      await mobile.fill('13912345678');
      await expectDraftValues(oldName, '13912345678');
      await expect(studentDraftBanner(page)).toHaveCount(0);

      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      // The read contract masks mobile; takeover retains that live baseline, not the old draft.
      await expect(mobile).toHaveValue(baseline.mobile);
      await studentDraftNameInput(page).fill(nextName);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Discard draft', exact: true })).toHaveCount(0);
      await expect(mobile).toHaveValue(baseline.mobile);
      await expectDraftValues(nextName, baseline.mobile);

      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(mobile).toHaveValue(baseline.mobile);
      await recoverStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(nextName);
      await expect(mobile).toHaveValue(baseline.mobile);
      await expectDraftValues(nextName, baseline.mobile);
      const unchanged = await page.request.get(`/api/training/student/${student.id}`, { headers });
      expect(unchanged.ok()).toBeTruthy();
      expect(await unchanged.json()).toEqual(baseline);

      await reloadStudentDraft(page);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await studentDraftBanner(page)
        .getByRole('button', { name: 'Discard draft', exact: true })
        .click();
      await expectNoStudentDraft(page, student.id);
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(mobile).toHaveValue(baseline.mobile);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

for (const mode of ['edit', 'create'] as const) {
  test(
    `ATP-BASIC-DRAFT-${mode === 'edit' ? '16' : '17'}: inactive ${mode} task offers recovery after list reload`,
    { tag: ['@admin', '@flow', '@ssr'] },
    async ({ page }, testInfo) => {
      test.setTimeout(120_000);
      await loginAsAdmin(page);
      await withDraftStudents(page, mode === 'edit' ? 1 : 0, async ([student], headers) => {
        const effects = collectDraftEffects(page, true);
        const id = student?.id;
        const baseline = student
          ? await (await page.request.get(`/api/training/student/${id}`, { headers })).json()
          : undefined;
        if (student) await openStudentDraftEdit(page, student.name, student.id);
        else await openStudentDraftCreate(page);
        const entryUrl = page.url();
        const baselineName = await studentDraftNameInput(page).inputValue();
        const name = `Inactive ${mode} Draft ${Date.now()}`;
        await studentDraftNameInput(page).fill(name);
        await waitForStudentDraft(page, name, id);
        const stored = (await readStudentDrafts(page)).filter(draft => draft.mode === mode);
        const checkpoint = async (label: string) => {
          const drafts = (await readStudentDrafts(page)).filter(draft => draft.mode === mode);
          await testInfo.attach(label, {
            body: JSON.stringify(drafts, null, 2),
            contentType: 'application/json',
          });
          expect(drafts, label).toEqual(stored);
        };
        await checkpoint('before-switch');
        const workspace = page.locator('.tabs-lifted').getByRole('tab', {
          name: 'Student',
          exact: true,
        });
        await workspace.click();
        await expect(page).not.toHaveURL(entryUrl);
        await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
        await checkpoint('after-switch');
        await page.reload({ waitUntil: 'load' });
        await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
        // Restored task titles and dirty markers need not retain their live presentation.
        const task = page.locator('.tabs-border').getByRole('tab');
        await expect(task).toHaveCount(1);
        await checkpoint('after-list-reload');
        await task.click();
        await expect(page).toHaveURL(entryUrl);
        await expect(studentDraftNameInput(page)).toHaveValue(baselineName);
        await checkpoint('after-entry-activation');
        await expect(studentDraftBanner(page)).toContainText('Unsaved draft available');
        await expect(
          studentDraftBanner(page).getByRole('button', {
            name: 'Discard draft',
            exact: true,
          }),
        ).toBeVisible();
        await recoverStudentDraft(page);
        await expect(studentDraftNameInput(page)).toHaveValue(name);
        await workspace.click();
        await task.click();
        await expect(studentDraftNameInput(page)).toHaveValue(name);
        await expect(studentDraftBanner(page)).toHaveCount(0);
        if (student) {
          const unchanged = await page.request.get(`/api/training/student/${id}`, { headers });
          expect(await unchanged.json()).toEqual(baseline);
        }
        expect(effects.mutations).toEqual([]);
        expect(effects.hydrationWarnings).toEqual([]);
        expect(effects.pageErrors).toEqual([]);
      });
    },
  );
}

test(
  'ATP-BASIC-DRAFT-09: logout removes persisted create and inactive edit drafts before relogin',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student]) => {
      await openStudentDraftEdit(page, student.name, student.id);
      const editName = `${student.name} logout`;
      await studentDraftNameInput(page).fill(editName);
      await waitForStudentDraft(page, editName, student.id);
      await openStudentDraftCreate(page);
      const createName = `Logout Draft E2E ${Date.now()}`;
      await studentDraftNameInput(page).fill(createName);
      await waitForStudentDraft(page, createName);
      const authenticatedIdentity = await readModelPersistenceIdentity(page);
      expect(authenticatedIdentity.scope[2]).not.toBeNull();
      const userMenu = page
        .locator('details')
        .filter({ has: page.getByText('Logout', { exact: true }) });
      await expect(userMenu).toHaveCount(1);
      await userMenu.locator('summary').click();
      const outgoingProtectedRequests: string[] = [];
      const outgoingUnauthorizedResponses: string[] = [];
      let loggingOut = true;
      page.on('request', request => {
        const path = new URL(request.url()).pathname;
        if (
          loggingOut &&
          request.method() === 'GET' &&
          /^\/api\/(?:training\/student(?:\/|$)|home\/base\/permission\/)/.test(path)
        ) {
          outgoingProtectedRequests.push(`${request.method()} ${path}`);
        }
      });
      page.on('response', response => {
        const path = new URL(response.url()).pathname;
        if (loggingOut && path.startsWith('/api/') && response.status() === 401) {
          outgoingUnauthorizedResponses.push(`${response.status()} ${path}`);
        }
      });
      await userMenu.getByText('Logout', { exact: true }).click();
      await expect(page).toHaveURL(/\/admin\/login(?:\?|$)/);
      await expectNoStudentDraft(page);
      await expectNoStudentDraft(page, student.id);
      await expect
        .poll(async () => (await readStudentDrafts(page, authenticatedIdentity)).length)
        .toBe(0);
      const anonymousIdentity = await readModelPersistenceIdentity(page);
      expect(anonymousIdentity.scope).toEqual([null, authenticatedIdentity.siteId, null]);
      loggingOut = false;
      expect(outgoingProtectedRequests).toEqual([]);
      expect(outgoingUnauthorizedResponses).toEqual([]);
      expect(effects.consoleErrors).toEqual([]);
      await loginAsAdmin(page);
      expect(await readModelPersistenceIdentity(page)).toEqual(authenticatedIdentity);
      await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expect(studentDraftNameInput(page)).not.toHaveValue(createName);
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(studentDraftNameInput(page)).toHaveValue(student.name);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.consoleErrors).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-BASIC-DRAFT-18: actual Passport namespaces survive another tab and global model clear prevents draft resurrection',
  { tag: ['@admin', '@flow', '@ssr'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    const identity = await readModelPersistenceIdentity(page);
    const token = (await page.context().cookies()).find(cookie => cookie.name === 'token')?.value;
    expect(token).toBeTruthy();
    const current = await page.request.get('/api/home/user/passport/current', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    expect(current.ok()).toBeTruthy();
    const passport = (await current.json()).data;
    expect(Object.hasOwn(passport, 'instanceId')).toBe(true);
    expect(identity.scope).toEqual([
      passport.instanceId == null ? null : String(passport.instanceId),
      identity.siteId,
      String(passport.user.id),
    ]);

    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    const name = `Namespace Draft E2E ${Date.now()}`;
    await studentDraftNameInput(page).fill(name);
    await waitForStudentDraft(page, name);
    const draft = (await readStudentDrafts(page)).find(draft => draft.values.name === name)!;
    expect(draft.namespace).toEqual([
      'zova-model-db',
      1,
      identity.appName,
      identity.scope,
      expect.any(String),
    ]);
    expect(draft.identity).toEqual([
      'training-student:student',
      'create',
      null,
      expect.stringContaining('/training-student'),
    ]);
    expect(draft.queryKey).toEqual([
      'basic-pageentry.model.draft',
      JSON.stringify(draft.identity),
      'snapshot',
    ]);

    const otherTab = await page.context().newPage();
    const otherEffects = collectDraftEffects(otherTab);
    try {
      await otherTab.goto(studentDraftCreatePath, { waitUntil: 'load' });
      await expect(otherTab.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      expect(await readModelPersistenceIdentity(otherTab)).toEqual(identity);
      await expect(studentDraftBanner(otherTab)).toContainText('Unsaved draft available');
      await expect(studentDraftNameInput(otherTab)).not.toHaveValue(name);
      await recoverStudentDraft(otherTab);
      await expect(studentDraftNameInput(otherTab)).toHaveValue(name);
      await waitForStudentDraft(otherTab, name);
      expect(
        (await readStudentDrafts(otherTab)).find(draft => draft.values.name === name)?.storageKey,
      ).toBe(draft.storageKey);
    } finally {
      // Cross-tab notification is not the contract; stop the second writer before clearing.
      await otherTab.close();
    }
    expect(otherEffects.mutations).toEqual([]);
    expect(otherEffects.hydrationWarnings).toEqual([]);
    expect(otherEffects.pageErrors).toEqual([]);

    const draftKeyExistsAfterClear = await page.evaluate(async storageKey => {
      const root = Array.from(document.querySelectorAll('*')).find(
        element => (element as any).__vue_app__?.zova,
      ) as any;
      const app = root?.__vue_app__?.zova;
      if (!app) throw new Error('Mounted Zova application not found');
      const passport = await app.bean._getBean('home-passport.model.passport', true);
      await passport.$clear();
      return new Promise<boolean>((resolve, reject) => {
        const opening = indexedDB.open('localforage');
        opening.onerror = () => reject(opening.error);
        opening.onsuccess = () => {
          const database = opening.result;
          const transaction = database.transaction('keyvaluepairs', 'readonly');
          const request = transaction.objectStore('keyvaluepairs').getKey(storageKey);
          transaction.oncomplete = () => {
            database.close();
            resolve(request.result !== undefined);
          };
          transaction.onerror = () => {
            database.close();
            reject(transaction.error);
          };
        };
      });
    }, draft.storageKey);
    expect(draftKeyExistsAfterClear).toBe(false);
    await expect.poll(async () => (await readStudentDrafts(page, identity)).length).toBe(0);
    // Global clear resets query memory too; use real login if authentication was cleared.
    await loginAsAdmin(page);
    await page.goto(studentDraftCreatePath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    await expect(studentDraftBanner(page)).toHaveCount(0);
    await expect(studentDraftNameInput(page)).not.toHaveValue(name);
    await expectNoStudentDraft(page);
    expect(effects.mutations).toEqual([]);
    expect(effects.hydrationWarnings).toEqual([]);
    expect(effects.pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-DRAFT-10: deleted edit records retain reachable discard without recovering or submitting',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    test.setTimeout(120_000);
    const effects = collectDraftEffects(page);
    await loginAsAdmin(page);
    await withDraftStudents(page, 1, async ([student], headers) => {
      await page.goto(`/admin/rest/resource/training-student%3Astudent/${student.id}/edit`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      const unsavedName = `${student.name} deleted record draft`;
      await studentDraftNameInput(page).fill(unsavedName);
      await waitForStudentDraft(page, unsavedName, student.id);
      const deletion = await page.request.delete(`/api/training/student/${student.id}`, {
        headers,
      });
      expect(deletion.ok()).toBeTruthy();

      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByText('The entry does not exist', { exact: true })).toBeVisible();
      await expect(studentDraftNameInput(page)).toHaveCount(0);
      await expect(studentDraftBanner(page)).toContainText('Unsaved draft available');
      await expect(
        studentDraftBanner(page).getByRole('button', { name: 'Recover draft', exact: true }),
      ).toHaveCount(0);
      const discard = studentDraftBanner(page).getByRole('button', {
        name: 'Discard draft',
        exact: true,
      });
      await expect(discard).toBeVisible();
      await waitForStudentDraft(page, unsavedName, student.id);
      await discard.click();
      await expectNoStudentDraft(page, student.id);
      await expect(studentDraftBanner(page)).toHaveCount(0);

      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await expect(page.getByText('The entry does not exist', { exact: true })).toBeVisible();
      await expect(studentDraftNameInput(page)).toHaveCount(0);
      await expect(studentDraftBanner(page)).toHaveCount(0);
      await expectNoStudentDraft(page, student.id);
      expect(effects.mutations).toEqual([]);
      expect(effects.hydrationWarnings).toEqual([]);
      expect(effects.pageErrors).toEqual([]);
    });
  },
);

test(
  'ATP-BASIC-FORM-01: Training Student content remains in the Basic Information tab',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const response = await page.goto('/admin/rest/resource/training-student%3Astudent/create', {
      waitUntil: 'load',
    });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');

    const basicInformationTab = page.getByRole('tab', { name: 'Basic Information', exact: true });
    const studentContentGroup = page
      .locator('fieldset')
      .filter({ has: page.locator('legend').filter({ hasText: /^Student Content$/ }) });
    await expect(studentContentGroup).toHaveCount(1);
    await expect(
      studentContentGroup.getByText('Description Markdown', { exact: true }),
    ).toBeVisible();

    const studentContentPanel = studentContentGroup.locator('xpath=ancestor::*[@role="tabpanel"]');
    await expect(studentContentPanel).toHaveCount(1);
    const basicInformationTabId = await basicInformationTab.getAttribute('id');
    expect(basicInformationTabId).not.toBeNull();
    await expect(studentContentPanel).toHaveAttribute('aria-labelledby', basicInformationTabId!);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-SUMMARY-01: Training Student summary dialog renders query states and Markdown HTML',
  { tag: ['@admin', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    await loginAsAdmin(page);

    const studentName = `Summary E2E ${Date.now()}`;
    const createResponseCapture = installStudentCreateResponseCapture(page);
    let studentId: string | number | undefined;
    await createResponseCapture.install();
    try {
      const createPageResponse = await page.goto(
        '/admin/rest/resource/training-student%3Astudent/create',
        { waitUntil: 'load' },
      );
      expect(createPageResponse?.ok()).toBeTruthy();
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
      await page
        .getByRole('group', { name: 'Student Name *', exact: true })
        .getByRole('textbox')
        .fill(studentName);
      await page
        .getByRole('group', { name: 'Mobile *', exact: true })
        .getByRole('textbox')
        .fill('13812345678');
      await page
        .locator('.ProseMirror')
        .last()
        .fill(`## Summary heading\n\nSummary paragraph ${studentName}`);
      await page.getByRole('tab', { name: 'Student Training Records', exact: true }).click();
      await page.getByText('Foundation Track', { exact: true }).click();

      const submitButton = page.getByRole('button', { name: 'Submit', exact: true });
      await expect(submitButton).toBeEnabled();
      await submitButton.click();
      await expect(page).toHaveURL(/\/admin\/(?:\?|$)/);
      studentId = createResponseCapture.studentId;
      expect(['string', 'number']).toContain(typeof studentId);

      const response = await page.goto('/admin/rest/resource/training-student%3Astudent', {
        waitUntil: 'load',
      });
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');

      const filterName = page.getByLabel('Student Name');
      await expect(filterName).toBeVisible();
      await filterName.fill(studentName);
      const searchResponse = waitForStudentSelect(page);
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      await searchResponse;

      const summaryPath = `/api/training/student/summary/${studentId}`;
      let summaryMode: 'failure' | 'success' = 'failure';
      let releaseSummaryRequest: (() => void) | undefined;
      let summaryRequest: Promise<void> | undefined;
      let releaseSummaryResponse: (() => void) | undefined;
      let summaryResponseRelease: Promise<void> | undefined;
      const summaryHandler = async (route: Route) => {
        releaseSummaryRequest?.();
        if (summaryMode === 'failure') {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ code: 500, message: 'Summary temporarily unavailable' }),
          });
          return;
        }
        const response = await route.fetch();
        await summaryResponseRelease;
        await route.fulfill({ response });
      };
      const summaryRouteUrl = (url: URL) => url.pathname === summaryPath;
      await page.route(summaryRouteUrl, summaryHandler);
      try {
        let row = page.locator('tr').filter({ hasText: studentName });
        await expect(row).toHaveCount(1);
        await row.getByRole('button', { name: 'Summary', exact: true }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('.alert.alert-error')).toHaveCount(1);
        await expect(dialog.locator('.student-summary-description')).toHaveCount(0);
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);

        summaryMode = 'success';
        summaryRequest = new Promise(resolve => {
          releaseSummaryRequest = resolve;
        });
        summaryResponseRelease = new Promise(resolve => {
          releaseSummaryResponse = resolve;
        });
        const listResponse = await page.goto('/admin/rest/resource/training-student%3Astudent', {
          waitUntil: 'load',
        });
        expect(listResponse?.ok()).toBeTruthy();
        await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
        await page.getByLabel('Student Name').fill(studentName);
        const nextSearchResponse = waitForStudentSelect(page);
        await page.getByRole('button', { name: 'Search', exact: true }).click();
        await nextSearchResponse;

        row = page.locator('tr').filter({ hasText: studentName });
        await expect(row).toHaveCount(1);
        await row.getByRole('button', { name: 'Summary', exact: true }).click();
        await summaryRequest;
        await expect(dialog).toHaveCount(0, { timeout: 250 });
        releaseSummaryResponse?.();

        const description = dialog.locator('.student-summary-description');
        await expect(dialog).toBeVisible();
        await expect(description).toBeVisible();
        await expect(description.locator('h2')).toHaveText('Summary heading');
        await expect(description).toContainText(`Summary paragraph ${studentName}`);
        expect(pageErrors).toEqual([]);
      } finally {
        releaseSummaryResponse?.();
        await page.unroute(summaryRouteUrl, summaryHandler);
      }
    } finally {
      try {
        if (studentId !== undefined) {
          const description = page.locator('.student-summary-description');
          if (await description.count()) {
            await description.locator('xpath=../..').getByRole('button').click();
          }
          const row = page.locator('tr').filter({ hasText: studentName });
          if (!(await row.count())) {
            const response = await page.goto('/admin/rest/resource/training-student%3Astudent', {
              waitUntil: 'load',
            });
            expect(response?.ok()).toBeTruthy();
            await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
            await page.getByLabel('Student Name').fill(studentName);
            const searchResponse = waitForStudentSelect(page);
            await page.getByRole('button', { name: 'Search', exact: true }).click();
            await searchResponse;
          }
          const deleteResponse = page.waitForResponse(response => {
            const url = new URL(response.url());
            return (
              response.request().method() === 'DELETE' &&
              response.ok() &&
              url.pathname === `/api/training/student/deleteForce/${studentId}` &&
              !response.request().headers()['x-vona-openapi-schema']
            );
          });
          await row.getByRole('button', { name: 'Force Delete', exact: true }).click();
          await page.getByRole('button', { name: 'Yes', exact: true }).click();
          await deleteResponse;
        }
      } finally {
        await createResponseCapture.uninstall();
      }
    }
  },
);
