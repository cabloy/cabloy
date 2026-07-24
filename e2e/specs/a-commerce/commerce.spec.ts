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
  'Commerce catalogue: localized Product navigation preserves locale',
  { tag: ['@web', '@flow'] },
  async ({ page, request }) => {
    const localizedPath = '/commerce/zh-cn';
    const response = await request.get(localizedPath);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(html).toContain('商品目录');
    expect(html).toContain('当前价格和库存以结算时确认为准。');

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto(localizedPath, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/commerce\/zh-cn(?:\/|$)/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce');
    await expect(page.getByRole('heading', { name: '商品目录' })).toBeVisible();
    await expect(page.getByText('当前价格和库存以结算时确认为准。')).toBeVisible();
    await expect(page.getByText('库存 24 件')).toBeVisible();

    const productLink = page.getByRole('link', { name: 'Wireless Headphones' });
    await expect(productLink).toHaveAttribute('href', /\/commerce\/zh-cn\/product\/\d+$/);
    const productPath = await productLink.getAttribute('href');
    const productResponse = await request.get(productPath!);
    expect(productResponse.ok()).toBeTruthy();
    expect((await productResponse.text()).toLowerCase()).not.toContain('data-zova-hydrated');
    await productLink.click();
    await expect(page).toHaveURL(/\/commerce\/zh-cn\/product\/\d+(?:\/|$)/);
    await expect(page.getByRole('heading', { name: 'Wireless Headphones' })).toBeVisible();
    await expect(page.getByText('HPH-BLK')).toBeVisible();
    await expect(page.getByText('库存 24 件')).toBeVisible();
    await expect(page.getByRole('link', { name: '购物车' })).toHaveAttribute(
      'href',
      '/commerce/zh-cn/cart',
    );
    expect(pageErrors).toEqual([]);
  },
);

test(
  'Commerce Product: Cart badge keeps SSR initial render neutral',
  { tag: ['@web', '@cart'] },
  async ({ page, request }) => {
    const productPath = '/commerce/product/1';
    const productResponse = await request.get(productPath);
    expect(productResponse.ok()).toBeTruthy();
    const productHtml = await productResponse.text();
    expect(productHtml.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(productHtml).toContain('>Cart<!----></a>');

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto(productPath, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce');
    await expect(page).toHaveURL(productPath);
    await expect(page.getByRole('heading', { name: 'Wireless Headphones' })).toBeVisible();

    const cartLink = page.locator('a[href="/commerce/cart"]');
    await expect(cartLink).toHaveCount(1);
    await expect(cartLink.locator('.badge')).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'Commerce Address: cookie-disabled SSR renders a neutral protected entry',
  { tag: ['@web', '@cart'] },
  async ({ page, request }) => {
    const path = '/commerce/address';
    const routePath = '/address';
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers().location).toBeUndefined();
    expect((await response.text()).toLowerCase()).not.toContain('data-zova-hydrated');

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto(path, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/commerce\/login\?(?:.*&)?returnTo=/);
    const loginUrl = new URL(page.url());
    expect(loginUrl.searchParams.getAll('returnTo')).toEqual([routePath]);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Addresses' })).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'Commerce Cart: anonymous browser is redirected to login',
  { tag: ['@web', '@cart'] },
  async ({ page, request }) => {
    const path = '/commerce/cart';
    const response = await request.get(path);
    expect(response.ok()).toBeTruthy();
    expect((await response.text()).toLowerCase()).not.toContain('data-zova-hydrated');

    const pageErrors = collectPageErrors(page);
    const documentResponse = await page.goto(path, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/commerce\/login\?(?:.*&)?returnTo=/);
    expect(pageErrors).toEqual([]);
  },
);

test(
  'Phase 50: anonymous payment and order routes remain SSR-neutral and protected',
  { tag: ['@web', '@flow'] },
  async ({ page, request }) => {
    const routes = [
      ['/commerce/checkout', '/checkout'],
      ['/commerce/payment/1', '/payment/1'],
      ['/commerce/orders', '/orders'],
      ['/commerce/order/1', '/order/1'],
    ] as const;
    for (const [path, routePath] of routes) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(200);
      expect(response.headers().location, path).toBeUndefined();
      const html = await response.text();
      expect(html.toLowerCase(), path).not.toContain('data-zova-hydrated');
      expect(html, path).not.toContain('Payment Customer');
      expect(html, path).not.toContain('Payment succeeded');
      expect(html, path).not.toContain('Order #');
      expect(html, path).not.toContain('Checkout');
      expect(html, path).not.toContain('Mock payment');
      expect(html, path).not.toContain('My orders');

      const pageErrors = collectPageErrors(page);
      const documentResponse = await page.goto(path, { waitUntil: 'load' });
      expect(documentResponse?.ok(), path).toBeTruthy();
      await expect(page, path).toHaveURL(/\/commerce\/login\?(?:.*&)?returnTo=/);
      const loginUrl = new URL(page.url());
      expect(loginUrl.searchParams.getAll('returnTo'), path).toEqual([routePath]);
      expect(pageErrors, path).toEqual([]);
    }
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
