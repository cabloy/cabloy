import type { Locator, Page } from '@playwright/test';

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
    await expect(page.getByText('Web: en-us')).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveTitle(/error/i);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-BASIC-SSR-03: concurrent public routes retain their own cache policy',
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
        index % 3 === 0
          ? 'public, max-age=600'
          : index % 3 === 1
            ? 'public, max-age=300'
            : 'no-cache, no-store, must-revalidate',
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
