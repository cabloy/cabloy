import type { Locator, Page, Route } from '@playwright/test';

import { expect, test } from '@playwright/test';

const studentResourceUrl =
  /\/admin\/rest\/resource\/training-student(?:%3A|:|%253A)student(?:[/?#]|$)/;

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

async function loginAsAdmin(page: Page) {
  await page.goto('/admin/', { waitUntil: 'load' });
  if (page.url().includes('/admin/login')) {
    await page.getByPlaceholder('Your Username').fill('admin');
    await page.getByPlaceholder('Your Password').fill('123456');
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page).not.toHaveURL(/\/admin\/login(?:\?|$)/);
  }

  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  const dashboardResponse = await page.goto('/admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  return dashboardResponse;
}

function waitForStudentSelect(page: Page) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'GET' &&
      response.ok() &&
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
    expect(response.headers()['cache-control']).toBe('no-cache, no-store, must-revalidate');
    const html = await response.text();
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(html).not.toContain('ssr-body-ready-observer');
    expect(html).not.toContain('__leftDrawerOpenJS');

    const routeOverrideResponse = await request.get('/demo/basic/routeQueryB');
    expect(routeOverrideResponse.ok()).toBeTruthy();
    expect(routeOverrideResponse.headers()['cache-control']).toBe(
      'no-cache, no-store, must-revalidate',
    );

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
    await expect(page.getByText('Web: en-us')).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveTitle(/error/i);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-SSR-03: concurrent public routes are non-cacheable in development',
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
      expect(response.headers()['cache-control'], `response ${index}`).toBe(
        'no-cache, no-store, must-revalidate',
      );
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
  'ATP-BASIC-FLOW-01: Training Student flow filter wraps and submits queries',
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
      let releaseSummaryResponse: (() => void) | undefined;
      let summaryResponseRelease: Promise<void> | undefined;
      const summaryHandler = async (route: Route) => {
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
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('status')).toBeVisible();
        await expect(dialog.locator('.student-summary-description')).toHaveCount(0);
        releaseSummaryResponse?.();

        const description = dialog.locator('.student-summary-description');
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
