import { expect, test } from '@playwright/test';

const privateMarkers = ['cart', 'address', 'order', 'coupon', 'payment'];

function collectPageErrors(page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

test(
  'ATP-SSR-01: anonymous Commerce HTML is public and hydration completes',
  { tag: ['@web', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/commerce');
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    const normalizedHtml = html.toLowerCase();
    expect(normalizedHtml).not.toContain('data-zova-hydrated');

    for (const marker of privateMarkers) {
      expect(normalizedHtml).not.toContain(`"${marker}"`);
    }

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto('/commerce', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/commerce(?:\/|$)/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce');
    await expect(page.getByRole('heading', { name: 'Commerce catalogue' })).toBeVisible();
    await expect(page.getByText('Dashboard')).toHaveCount(0);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).not.toHaveTitle(/error/i);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'Commerce catalogue: public sellable inventory renders after hydration',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const response = await page.goto('/commerce', { waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce');
    await expect(page.getByRole('heading', { name: 'Commerce catalogue' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Wireless Headphones' })).toBeVisible();
    await expect(page.getByText('24 available')).toBeVisible();
    await page.getByRole('link', { name: 'Wireless Headphones' }).click();
    await expect(page).toHaveURL(/\/commerce\/product\/\d+(?:\/|$)/);
    await expect(page.getByRole('heading', { name: 'Wireless Headphones' })).toBeVisible();
    await expect(page.getByText('HPH-BLK')).toBeVisible();
    expect(pageErrors).toEqual([]);
  },
);

test(
  'ATP-SSR-02: Commerce Admin is an independent SSR site',
  { tag: ['@admin', '@smoke'] },
  async ({ page, request }) => {
    const response = await request.get('/commerce-admin/', { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    const loginPath = response.headers().location;
    expect(loginPath).toMatch(/^\/commerce-admin\/login(?:\?|$)/);

    const loginResponse = await request.get(loginPath!);
    expect(loginResponse.ok()).toBeTruthy();
    expect((await loginResponse.text()).toLowerCase()).not.toContain('data-zova-hydrated');

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto('/commerce-admin/', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/commerce-admin\/login(?:\?|$)/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerceAdmin');
    await expect(page.locator('body')).toBeVisible();
    expect(pageErrors).toEqual([]);
  },
);
