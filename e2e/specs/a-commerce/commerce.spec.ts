import type { APIRequestContext, Browser, Page, TestInfo } from '@playwright/test';

import { expect, test } from '@playwright/test';

const privateMarkers = ['cart', 'address', 'order', 'coupon', 'payment'];
const addressResourceUrl =
  /\/commerce-admin\/rest\/resource\/commerce-member(?:%3A|:|%253A)address(?:[/?#]|$)/;
const addressMinePath = '/api/commerce/member/address/mine';
const addressActionPath = '/api/commerce/member/address';
const passportTestActivateCurrentPath = '/api/home/user/passportTest/activateCurrent';

interface IAddressFixture {
  addressLine1: string;
  city: string;
  recipientName: string;
  updatedCity: string;
}

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

function waitForApiResponse(page: Page, method: string, path: string | RegExp) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === method &&
      (typeof path === 'string' ? url.pathname === path : path.test(url.pathname)) &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

function waitForAddressResponse(page: Page, method: string, path: string | RegExp) {
  return waitForApiResponse(page, method, path);
}

function waitForAddressMine(page: Page) {
  return waitForAddressResponse(page, 'GET', addressMinePath);
}

async function login(
  page: Page,
  path: string,
  username: string,
  password: string,
  hydratedSite: string,
) {
  await page.goto(path, { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', hydratedSite);
  if (!page.url().includes('/login')) {
    await page.waitForURL(/\/login(?:\?|$)/);
  }
  if (page.url().includes('/login')) {
    const usernameInput = page.getByPlaceholder('Your Username');
    const passwordInput = page.getByPlaceholder('Your Password');
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await expect(usernameInput).toHaveValue(username);
    await expect(passwordInput).toHaveValue(password);
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page).not.toHaveURL(/\/login(?:\?|$)/);
  }
}

async function registerCustomer(
  request: APIRequestContext,
  testInfo: TestInfo,
): Promise<{ password: string; username: string }> {
  const id = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
  const username = `e2e-address-${id}`;
  const password = 'address-e2e-password';
  const captchaResponse = await request.post('/api/captcha/create', {
    data: { scene: 'captcha-simple:simple' },
  });
  expect(captchaResponse.ok()).toBeTruthy();
  const captcha = (await captchaResponse.json()).data;
  expect(captcha?.id).toEqual(expect.any(String));
  expect(captcha?.token).toEqual(expect.any(String));

  const registerResponse = await request.post('/api/home/user/passport/register', {
    data: {
      username,
      email: `${username}@example.test`,
      password,
      passwordConfirm: password,
      captcha: { id: captcha.id, token: captcha.token },
    },
  });
  expect(registerResponse.ok()).toBeTruthy();
  const registration = (await registerResponse.json()).data;
  expect(registration?.jwt?.accessToken).toEqual(expect.any(String));
  const activateResponse = await request.post(passportTestActivateCurrentPath, {
    headers: { Authorization: `Bearer ${registration.jwt.accessToken}` },
  });
  expect(activateResponse.ok()).toBeTruthy();
  return { username, password };
}

function createAddressFixture(testInfo: TestInfo): IAddressFixture {
  const id = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
  return {
    recipientName: `E2E Address ${id}`,
    addressLine1: `1 Test Street ${id}`,
    city: `Original City ${id}`,
    updatedCity: `Updated City ${id}`,
  };
}

async function fillAddressForm(page: Page, fixture: IAddressFixture) {
  await page.getByPlaceholder('Recipient name').fill(fixture.recipientName);
  await page.getByPlaceholder('Phone').fill('15555550123');
  await page.getByPlaceholder('Country code').fill('US');
  await page.getByPlaceholder('Region').fill('California');
  await page.getByPlaceholder('City').fill(fixture.city);
  await page.getByPlaceholder('Postal code').fill('94105');
  await page.getByPlaceholder('Address line 1').fill(fixture.addressLine1);
  await page.getByPlaceholder('Address line 2').fill('Suite E2E');
}

async function createAddressThroughCustomerPage(
  browser: Browser,
  request: APIRequestContext,
  testInfo: TestInfo,
) {
  const customer = await registerCustomer(request, testInfo);
  const fixture = createAddressFixture(testInfo);
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = collectPageErrors(page);

  await login(page, '/commerce/address', customer.username, customer.password, 'commerce');
  await expect(page).toHaveURL(/\/commerce\/address(?:\?|$)/);
  await expect(page.getByRole('heading', { name: 'Addresses' })).toBeVisible();
  await expect(page.getByText('No addresses yet.')).toBeVisible();

  await fillAddressForm(page, fixture);
  const createResponse = waitForAddressResponse(page, 'POST', `${addressActionPath}/createMine`);
  const mineResponse = waitForAddressMine(page);
  await page.getByRole('button', { name: 'Save address', exact: true }).click();
  await createResponse;
  await mineResponse;
  await expect(page.getByRole('heading', { name: fixture.recipientName })).toBeVisible();

  return { context, fixture, page, pageErrors };
}

async function deleteAddressThroughCustomerPage(page: Page, fixture: IAddressFixture) {
  const card = page
    .locator('article')
    .filter({ has: page.getByRole('heading', { name: fixture.recipientName }) });
  const deleteResponse = waitForAddressResponse(page, 'DELETE', /\/deleteMine\/[^/]+$/);
  const mineResponse = waitForAddressMine(page);
  await card.getByRole('button', { name: 'Delete', exact: true }).click();
  await deleteResponse;
  await mineResponse;
  await expect(page.getByRole('heading', { name: fixture.recipientName })).toHaveCount(0);
  await expect(page.getByText('No addresses yet.')).toBeVisible();
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
  'ATP-ADDR-01: authenticated customer manages Address through Web self-service',
  { tag: ['@web', '@flow', '@address'] },
  async ({ browser, request }, testInfo) => {
    const { context, fixture, page, pageErrors } = await createAddressThroughCustomerPage(
      browser,
      request,
      testInfo,
    );
    try {
      const card = page
        .locator('article')
        .filter({ has: page.getByRole('heading', { name: fixture.recipientName }) });
      await card.getByRole('button', { name: 'Edit', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Add address' })).toHaveCount(0);
      await expect(page.getByPlaceholder('City')).toHaveValue(fixture.city);
      await page.getByPlaceholder('City').fill(fixture.updatedCity);

      const updateResponse = waitForAddressResponse(page, 'PATCH', /\/updateMine\/[^/]+$/);
      const mineResponse = waitForAddressMine(page);
      await page.getByRole('button', { name: 'Save address', exact: true }).click();
      await updateResponse;
      await mineResponse;
      await expect(card).toContainText(fixture.updatedCity);
      await expect(card).not.toContainText(fixture.city);

      await deleteAddressThroughCustomerPage(page, fixture);
      await expect(page.getByRole('alert')).toHaveCount(0);
      expect(pageErrors).toEqual([]);
    } finally {
      await context.close();
    }
  },
);

test(
  'Phase 50: authenticated customer completes checkout, mock payment, and order history',
  { tag: ['@web', '@flow', '@payment'] },
  async ({ browser, request }, testInfo) => {
    test.setTimeout(60_000);
    const { context, fixture, page, pageErrors } = await createAddressThroughCustomerPage(
      browser,
      request,
      testInfo,
    );
    try {
      await page.goto('/commerce', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce');
      await expect(page.getByRole('heading', { name: 'Commerce catalogue' })).toBeVisible();

      const productLink = page.getByRole('link', { name: 'Pour-Over Coffee Set', exact: true });
      await expect(productLink).toBeVisible();
      await productLink.click();
      await expect(page).toHaveURL(/\/commerce\/product\/\d+(?:\/|$)/);
      await expect(page.getByRole('heading', { name: 'Pour-Over Coffee Set' })).toBeVisible();
      await expect(page.getByText('COF-SET-01')).toBeVisible();
      await expect(page.getByText('$45.99')).toBeVisible();

      const addResponse = waitForApiResponse(page, 'POST', '/api/commerce/trade/cart/items');
      await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
      await addResponse;

      await page.getByRole('link', { name: /^Cart/ }).click();
      await expect(page).toHaveURL(/\/commerce\/cart(?:\/|$)/);
      await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible();
      const cartItem = page.locator('article').filter({ has: page.getByRole('spinbutton') });
      await expect(cartItem).toContainText('COF-SET-01');
      await expect(cartItem).toContainText('$45.99');
      await expect(cartItem.getByRole('spinbutton')).toHaveValue('1');

      await page.getByRole('link', { name: 'Checkout', exact: true }).click();
      await expect(page).toHaveURL(/\/commerce\/checkout(?:\/|$)/);
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
      const addressChoice = page.getByRole('radio', { name: new RegExp(fixture.recipientName) });
      await expect(addressChoice).toBeVisible();
      await addressChoice.check();
      const noCouponChoice = page.getByRole('radio', { name: 'No coupon', exact: true });
      await noCouponChoice.check();
      await expect(noCouponChoice).toBeChecked();
      await expect(page.getByRole('button', { name: 'Create order', exact: true })).toBeEnabled();

      const checkoutResponse = waitForApiResponse(page, 'POST', '/api/commerce/trade/checkout');
      await page.getByRole('button', { name: 'Create order', exact: true }).click();
      const checkoutResponseValue = await checkoutResponse;
      expect(checkoutResponseValue.ok()).toBeTruthy();
      const checkout = (await checkoutResponseValue.json()).data;
      expect(checkout.orderId).toEqual(expect.any(Number));
      expect(checkout.paymentAttemptId).toEqual(expect.any(Number));
      expect(checkout.state).toBe('awaiting_payment');
      expect(checkout.paymentAttemptState).toBe('created');
      expect(checkout.currency).toBe('USD');
      expect(checkout.payableTotalCents).toBe(4599);
      await expect(page).toHaveURL(
        new RegExp(`/commerce/payment/${checkout.paymentAttemptId}(?:/|$)`),
      );
      await expect(page.getByRole('heading', { name: 'Mock payment' })).toBeVisible();

      const paymentResponse = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/commerce/trade/payment/${checkout.paymentAttemptId}/outcome$`),
      );
      const orderDetailResponse = waitForApiResponse(
        page,
        'GET',
        new RegExp('/api/commerce/trade/order/viewMine/\\d+$'),
      );
      await page.getByRole('button', { name: 'Payment succeeded', exact: true }).click();
      const paymentResponseValue = await paymentResponse;
      expect(paymentResponseValue.ok()).toBeTruthy();
      const payment = (await paymentResponseValue.json()).data;
      expect(payment.orderId).toBe(checkout.orderId);
      expect(payment.paymentAttemptId).toBe(checkout.paymentAttemptId);
      expect(payment.orderState).toBe('paid');
      expect(payment.paymentAttemptState).toBe('succeeded');
      expect(payment.currency).toBe('USD');
      expect(payment.payableTotalCents).toBe(4599);
      await expect(page).toHaveURL(new RegExp(`/commerce/order/${checkout.orderId}(?:/|$)`));
      const orderDetailResponseValue = await orderDetailResponse;
      expect(orderDetailResponseValue.ok()).toBeTruthy();
      const order = (await orderDetailResponseValue.json()).data;
      expect(order.id).toBe(checkout.orderId);
      expect(order.state).toBe('paid');
      expect(order.currency).toBe('USD');
      expect(order.discountCents).toBe(0);
      expect(order.payableTotalCents).toBe(4599);
      expect(order.addressSnapshot.recipientName).toBe(fixture.recipientName);
      expect(order.addressSnapshot.addressLine1).toBe(fixture.addressLine1);
      expect(order.lines).toEqual([
        expect.objectContaining({
          titleSnapshot: 'Pour-Over Coffee Set',
          skuCodeSnapshot: 'COF-SET-01',
          unitPriceCents: 4599,
          quantity: 1,
          lineTotalCents: 4599,
        }),
      ]);

      await expect(page.getByRole('heading', { name: `Order #${checkout.orderId}` })).toBeVisible();
      await expect(page.getByText('paid · $45.99')).toBeVisible();
      await expect(page.getByText(fixture.recipientName)).toBeVisible();
      await expect(page.getByText(fixture.addressLine1)).toBeVisible();
      await expect(page.getByText('Discount: $0.00')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Pour-Over Coffee Set' })).toBeVisible();
      await expect(page.getByText('COF-SET-01')).toBeVisible();
      await expect(page.getByText('1 × $45.99 = $45.99')).toBeVisible();

      const ordersResponse = waitForApiResponse(page, 'GET', '/api/commerce/trade/order/mine');
      await page.goto('/commerce/orders', { waitUntil: 'load' });
      await expect(page).toHaveURL(/\/commerce\/orders(?:\/|$)/);
      await ordersResponse;
      await expect(page.getByRole('heading', { name: 'My orders' })).toBeVisible();
      const orderCard = page
        .locator('article')
        .filter({ has: page.getByRole('heading', { name: `Order #${checkout.orderId}` }) });
      await expect(orderCard).toContainText('paid · $45.99');

      const historyDetailResponse = waitForApiResponse(
        page,
        'GET',
        new RegExp(`/api/commerce/trade/order/viewMine/${checkout.orderId}$`),
      );
      await orderCard.getByRole('button', { name: 'View', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/commerce/order/${checkout.orderId}(?:/|$)`));
      await historyDetailResponse;
      await expect(page.getByRole('heading', { name: `Order #${checkout.orderId}` })).toBeVisible();
      await expect(page.getByText('1 × $45.99 = $45.99')).toBeVisible();
      await expect(page.getByRole('alert')).toHaveCount(0);
      expect(pageErrors).toEqual([]);
    } finally {
      await context.close().catch(() => {});
    }
  },
);

test(
  'ATP-ADDR-01: systemAdmin inspects Address Resource without mutation controls',
  { tag: ['@admin', '@flow', '@address'] },
  async ({ browser, request }, testInfo) => {
    test.setTimeout(60_000);
    const customer = await createAddressThroughCustomerPage(browser, request, testInfo);
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPageErrors = collectPageErrors(adminPage);
    const addressMutationMethods: string[] = [];
    adminPage.on('request', request => {
      const url = new URL(request.url());
      if (
        url.pathname.startsWith(addressActionPath) &&
        ['POST', 'PATCH', 'DELETE'].includes(request.method())
      ) {
        addressMutationMethods.push(request.method());
      }
    });

    try {
      await adminPage.setViewportSize({ width: 1440, height: 900 });
      await login(adminPage, '/commerce-admin/', 'admin', '123456', 'commerceAdmin');
      await adminPage.goto('/commerce-admin/rest/resource/commerce-member%3Aaddress', {
        waitUntil: 'load',
      });
      await expect(adminPage).toHaveURL(addressResourceUrl);
      const fixtureRow = adminPage.getByRole('row', { name: customer.fixture.recipientName });
      await expect(fixtureRow).toBeVisible();
      await expect(adminPage.getByRole('button', { name: 'Create', exact: true })).toHaveCount(0);
      await expect(
        adminPage.locator('a[href*="/rest/resource/"]').filter({ hasText: 'Create' }),
      ).toHaveCount(0);

      const addressId = await fixtureRow.getByRole('cell').first().textContent();
      expect(addressId).toMatch(/^\d+$/);
      await adminPage.goto(`/commerce-admin/rest/resource/commerce-member%3Aaddress/${addressId}`, {
        waitUntil: 'load',
      });
      await expect(adminPage).toHaveURL(
        /\/commerce-admin\/rest\/resource\/commerce-member(?:%3A|:|%253A)address\/\d+(?:[/?#]|$)/,
      );
      await expect(
        adminPage.getByRole('group', { name: 'Address Line 1 *' }).getByRole('textbox'),
      ).toHaveValue(customer.fixture.addressLine1);
      await expect(
        adminPage.getByRole('group', { name: 'City *' }).getByRole('textbox'),
      ).toHaveValue(customer.fixture.city);
      await expect(adminPage.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
      await expect(adminPage.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);
      expect(addressMutationMethods).toEqual([]);
      expect(adminPageErrors).toEqual([]);

      await deleteAddressThroughCustomerPage(customer.page, customer.fixture);
      await expect(customer.page.getByRole('alert')).toHaveCount(0);
      expect(customer.pageErrors).toEqual([]);
    } finally {
      await adminContext.close().catch(() => {});
      await customer.context.close().catch(() => {});
    }
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
