import { expect, test } from '@playwright/test';

function collectPageErrors(page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

test('ATP-BASIC-SSR-01: anonymous Web HTML hydrates through the default site', async ({
  page,
  request,
}) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  expect((await response.text()).toLowerCase()).not.toContain('data-zova-hydrated');

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
});

test('ATP-BASIC-SSR-02: Admin waits for nested hydration before ready', async ({
  page,
  request,
}) => {
  const response = await request.get('/admin/', { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  const loginPath = response.headers().location;
  expect(loginPath).toMatch(/^\/admin\/login(?:\?|$)/);

  const loginResponse = await request.get(loginPath!);
  expect(loginResponse.ok()).toBeTruthy();
  expect((await loginResponse.text()).toLowerCase()).not.toContain('data-zova-hydrated');

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
});
