import { expect, test } from '@playwright/test';

const privateMarkers = ['cart', 'address', 'order', 'coupon', 'payment'];

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

  await page.goto('/commerce');
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveTitle(/error/i);
});

test('ATP-SSR-02: Commerce Admin is an independent SSR site', async ({ page, request }) => {
  const response = await request.get('/commerce-admin/', { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect(response.headers().location).toBe('/commerce-admin/login');

  await page.goto('/commerce-admin/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/commerce-admin\/login$/);
});
