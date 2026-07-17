import { expect, test } from '@playwright/test';

const privateMarkers = ['cart', 'address', 'order', 'coupon', 'payment'];

function collectPageErrors(page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

test('ATP-SSR-01: anonymous Commerce HTML is public and hydration completes', async ({
  page,
  request,
}) => {
  const response = await request.get('/commerce');
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  const normalizedHtml = html.toLowerCase();

  for (const marker of privateMarkers) {
    expect(normalizedHtml).not.toContain(`"${marker}"`);
  }

  const pageErrors = collectPageErrors(page);
  const documentResponse = await page.goto('/commerce', { waitUntil: 'load' });
  expect(documentResponse?.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/commerce(?:\/|$)/);
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveTitle(/error/i);
  expect(pageErrors).toEqual([]);
});

test('ATP-SSR-02: Commerce Admin is an independent SSR site', async ({ page, request }) => {
  const response = await request.get('/commerce-admin/', { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect(response.headers().location).toMatch(/^\/commerce-admin\/login(?:\?|$)/);

  const pageErrors = collectPageErrors(page);
  const documentResponse = await page.goto('/commerce-admin/', { waitUntil: 'load' });
  expect(documentResponse?.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/commerce-admin\/login(?:\?|$)/);
  await expect(page.locator('body')).toBeVisible();
  expect(pageErrors).toEqual([]);
});
