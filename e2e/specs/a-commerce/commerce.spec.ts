import type { APIRequestContext, Browser, Locator, Page, TestInfo } from '@playwright/test';

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

function expectTableIdentity(value: unknown) {
  expect(['string', 'number']).toContain(typeof value);
}

function waitForAddressResponse(page: Page, method: string, path: string | RegExp) {
  return waitForApiResponse(page, method, path);
}

function waitForAddressMine(page: Page) {
  return waitForAddressResponse(page, 'GET', addressMinePath);
}

async function getAdminOrderRow(page: Page, orderId: number): Promise<Locator> {
  const row = page.locator(`tr:has(td a:text-is("${orderId}"))`);
  await expect(row).toHaveCount(1);
  return row;
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
    const loginResponse = waitForApiResponse(page, 'POST', '/api/home/user/passport/login');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    const loginResponseValue = await loginResponse;
    if (!loginResponseValue.ok()) {
      throw new Error(
        `login failed: ${loginResponseValue.status()} ${await loginResponseValue.text()}`,
      );
    }
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
  'Phase 50/60: authenticated customer completes payment and observes operator shipment',
  { tag: ['@web', '@admin', '@flow', '@payment', '@shipment'] },
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
      expectTableIdentity(checkout.orderId);
      expectTableIdentity(checkout.paymentAttemptId);
      expectTableIdentity(checkout.paymentSessionId);
      expect(checkout.state).toBe('awaiting_payment');
      expect(checkout.paymentAttemptState).toBe('created');
      expect(checkout.currency).toBe('USD');
      expect(checkout.payableTotalCents).toBe(4599);
      await expect(page).toHaveURL(
        new RegExp(`/commerce/payment/${checkout.paymentSessionId}/${checkout.orderId}(?:/|$)`),
      );
      await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toBeVisible();

      const startResponse = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/pay/payment-session/${checkout.paymentSessionId}/start$`),
      );
      await page.getByRole('button', { name: 'Start payment', exact: true }).click();
      expect((await startResponse).ok()).toBeTruthy();
      await expect(page.getByText('Payment is being prepared.')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Mock payment simulator' })).toBeVisible();
      const completeResponse = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/pay/mock/payment-session/${checkout.paymentSessionId}/complete$`),
      );
      await page.getByRole('button', { name: 'Payment succeeded', exact: true }).click();
      expect((await completeResponse).ok()).toBeTruthy();
      await expect(page).toHaveURL(new RegExp(`/commerce/order/${checkout.orderId}(?:/|$)`), {
        timeout: 40_000,
      });
      const orderDetailResponse = waitForApiResponse(
        page,
        'GET',
        new RegExp(`/api/commerce/trade/order/viewMine/${checkout.orderId}$`),
      );
      await page.reload({ waitUntil: 'load' });
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

      const shipmentCarrier = 'Cabloy Express';
      const shipmentTrackingNumber = `E2E-${checkout.orderId}`;
      const adminContext = await browser.newContext();
      const adminPage = await adminContext.newPage();
      const adminPageErrors = collectPageErrors(adminPage);
      try {
        await adminPage.setViewportSize({ width: 1440, height: 900 });
        await login(adminPage, '/commerce-admin/', 'admin', '123456', 'commerceAdmin');
        await adminPage.goto('/commerce-admin/rest/resource/commerce-trade%3Aorder', {
          waitUntil: 'load',
        });
        await expect(adminPage.locator('html')).toHaveAttribute(
          'data-zova-hydrated',
          'commerceAdmin',
        );
        const orderRow = await getAdminOrderRow(adminPage, checkout.orderId);
        await expect(orderRow).toBeVisible();
        await expect(orderRow.locator('td')).toHaveCount(6);
        await expect(orderRow).toContainText('Paid');
        await expect(orderRow).toContainText('45.99');
        await expect(orderRow).not.toContainText(fixture.recipientName);
        const orderViewResponse = waitForApiResponse(
          adminPage,
          'GET',
          `/api/commerce/trade/order/${checkout.orderId}`,
        );
        await orderRow.getByRole('link', { name: String(checkout.orderId), exact: true }).click();
        expect((await orderViewResponse).ok()).toBeTruthy();
        await expect(adminPage.getByText('Money summary').first()).toBeVisible();
        await expect(adminPage.getByText('Delivery address').first()).toBeVisible();
        await expect(adminPage.getByText('Purchased lines').first()).toBeVisible();
        await expect(adminPage.getByText('addressSnapshot').first()).toBeVisible();
        await expect(adminPage.getByText('couponSnapshot').first()).toBeVisible();
        await expect(adminPage.getByText('Pour-Over Coffee Set')).toBeVisible();
        await expect(adminPage.getByText('COF-SET-01')).toBeVisible();
        await expect(adminPage.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);
        await adminPage.getByRole('button', { name: 'Back', exact: true }).click();
        await expect(orderRow).toBeVisible();
        const carrierInput = orderRow.getByPlaceholder('Carrier');
        const trackingNumberInput = orderRow.getByPlaceholder('Tracking number');
        const confirmationCheckbox = orderRow.getByRole('checkbox');
        await carrierInput.fill(shipmentCarrier);
        await trackingNumberInput.fill(shipmentTrackingNumber);
        await confirmationCheckbox.check();
        await expect(carrierInput).toHaveValue(shipmentCarrier);
        await expect(trackingNumberInput).toHaveValue(shipmentTrackingNumber);
        await expect(confirmationCheckbox).toBeChecked();
        const shipmentResponse = waitForApiResponse(
          adminPage,
          'POST',
          `/api/commerce/trade/order/${checkout.orderId}/ship`,
        );
        await orderRow.getByRole('button', { name: 'Ship order', exact: true }).click();
        expect((await shipmentResponse).ok()).toBeTruthy();
        await expect(orderRow).toContainText('Shipped');
        expect(adminPageErrors).toEqual([]);
      } finally {
        await adminContext.close().catch(() => {});
      }

      const shippedDetailResponse = waitForApiResponse(
        page,
        'GET',
        new RegExp(`/api/commerce/trade/order/viewMine/${checkout.orderId}$`),
      );
      await page.reload({ waitUntil: 'load' });
      await shippedDetailResponse;
      await expect(page.getByText('shipped · $45.99')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Shipment' })).toBeVisible();
      await expect(page.getByText(shipmentCarrier)).toBeVisible();
      await expect(page.getByText(shipmentTrackingNumber)).toBeVisible();

      const ordersResponse = waitForApiResponse(page, 'GET', '/api/commerce/trade/order/mine');
      await page.goto('/commerce/orders', { waitUntil: 'load' });
      await expect(page).toHaveURL(/\/commerce\/orders(?:\/|$)/);
      await ordersResponse;
      await expect(page.getByRole('heading', { name: 'My orders' })).toBeVisible();
      const orderCard = page
        .locator('article')
        .filter({ has: page.getByRole('heading', { name: `Order #${checkout.orderId}` }) });
      await expect(orderCard).toContainText('shipped · $45.99');

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
  'Payment cancellation: customer observes the cancelled order after verified provider confirmation',
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
      const productLink = page.getByRole('link', { name: 'Pour-Over Coffee Set', exact: true });
      await expect(productLink).toBeVisible();
      await productLink.click();
      await expect(page).toHaveURL(/\/commerce\/product\/\d+(?:\/|$)/);
      await expect(page.getByRole('heading', { name: 'Pour-Over Coffee Set' })).toBeVisible();
      const addResponse = waitForApiResponse(page, 'POST', '/api/commerce/trade/cart/items');
      await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
      expect((await addResponse).ok()).toBeTruthy();
      await page.getByRole('link', { name: /^Cart/ }).click();
      await expect(page).toHaveURL(/\/commerce\/cart(?:\/|$)/);
      await page.getByRole('link', { name: 'Checkout', exact: true }).click();
      await expect(page).toHaveURL(/\/commerce\/checkout(?:\/|$)/);
      const addressChoice = page.getByRole('radio', { name: new RegExp(fixture.recipientName) });
      await expect(addressChoice).toBeVisible();
      await addressChoice.check();
      await page.getByRole('radio', { name: 'No coupon', exact: true }).check();
      const checkoutResponse = waitForApiResponse(page, 'POST', '/api/commerce/trade/checkout');
      await page.getByRole('button', { name: 'Create order', exact: true }).click();
      const checkoutResponseValue = await checkoutResponse;
      expect(checkoutResponseValue.ok()).toBeTruthy();
      const checkout = (await checkoutResponseValue.json()).data;
      expectTableIdentity(checkout.orderId);
      expectTableIdentity(checkout.paymentSessionId);
      const startResponse = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/pay/payment-session/${checkout.paymentSessionId}/start$`),
      );
      await page.getByRole('button', { name: 'Start payment', exact: true }).click();
      expect((await startResponse).ok()).toBeTruthy();
      await expect(page.getByText('Payment is being prepared.')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Mock payment simulator' })).toBeVisible();
      const cancelResponse = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/pay/mock/payment-session/${checkout.paymentSessionId}/complete$`),
      );
      await page.getByRole('button', { name: 'Cancel payment', exact: true }).click();
      expect((await cancelResponse).ok()).toBeTruthy();
      await expect(page).toHaveURL(new RegExp(`/commerce/order/${checkout.orderId}(?:/|$)`), {
        timeout: 40_000,
      });
      await expect(page.getByText('cancelled · $45.99')).toBeVisible();
      await expect(page.getByRole('alert')).toHaveCount(0);
      expect(pageErrors).toEqual([]);
    } finally {
      await context.close().catch(() => {});
    }
  },
);

test(
  'Phase 60: customer requests and operator executes a whole-order refund',
  { tag: ['@web', '@admin', '@flow', '@payment', '@refund'] },
  async ({ browser, request }, testInfo) => {
    test.setTimeout(120_000);
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
      await page.getByRole('link', { name: 'Checkout', exact: true }).click();
      await expect(page).toHaveURL(/\/commerce\/checkout(?:\/|$)/);
      const addressChoice = page.getByRole('radio', { name: new RegExp(fixture.recipientName) });
      await addressChoice.check();
      await page.getByRole('radio', { name: 'No coupon', exact: true }).check();
      const checkoutResponse = waitForApiResponse(page, 'POST', '/api/commerce/trade/checkout');
      await page.getByRole('button', { name: 'Create order', exact: true }).click();
      const checkoutResponseValue = await checkoutResponse;
      expect(checkoutResponseValue.ok()).toBeTruthy();
      const checkout = (await checkoutResponseValue.json()).data;
      expectTableIdentity(checkout.orderId);
      expectTableIdentity(checkout.paymentAttemptId);
      expectTableIdentity(checkout.paymentSessionId);
      await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toBeVisible();
      const startResponse = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/pay/payment-session/${checkout.paymentSessionId}/start$`),
      );
      await page.getByRole('button', { name: 'Start payment', exact: true }).click();
      expect((await startResponse).ok()).toBeTruthy();
      await expect(page.getByText('Payment is being prepared.')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Mock payment simulator' })).toBeVisible();
      const completeResponse = waitForApiResponse(
        page,
        'POST',
        new RegExp(`/api/pay/mock/payment-session/${checkout.paymentSessionId}/complete$`),
      );
      await page.getByRole('button', { name: 'Payment succeeded', exact: true }).click();
      expect((await completeResponse).ok()).toBeTruthy();
      await expect(page.getByText('paid · $45.99')).toBeVisible({ timeout: 40_000 });

      const requestResponse = waitForApiResponse(
        page,
        'POST',
        `/api/commerce/trade/order/${checkout.orderId}/requestRefund`,
      );
      await page.getByPlaceholder('Reason for refund').fill('E2E refund request');
      await page.getByRole('button', { name: 'Request refund', exact: true }).click();
      expect((await requestResponse).ok()).toBeTruthy();
      await expect(page.getByText('refund_requested · $45.99')).toBeVisible();

      const adminContext = await browser.newContext();
      const adminPage = await adminContext.newPage();
      const adminPageErrors = collectPageErrors(adminPage);
      try {
        await adminPage.setViewportSize({ width: 1440, height: 900 });
        await login(adminPage, '/commerce-admin/', 'admin', '123456', 'commerceAdmin');
        await adminPage.goto('/commerce-admin/rest/resource/commerce-trade%3Aorder', {
          waitUntil: 'load',
        });
        await expect(adminPage.locator('html')).toHaveAttribute(
          'data-zova-hydrated',
          'commerceAdmin',
        );
        const orderRow = await getAdminOrderRow(adminPage, checkout.orderId);
        await expect(orderRow).toBeVisible();
        await orderRow.getByPlaceholder('Decision reason').fill('E2E approval');
        await orderRow.getByRole('checkbox').check();
        const approveResponse = waitForApiResponse(
          adminPage,
          'POST',
          `/api/commerce/trade/order/${checkout.orderId}/approveRefund`,
        );
        await orderRow.getByRole('button', { name: 'Approve refund', exact: true }).click();
        expect((await approveResponse).ok()).toBeTruthy();
        await expect(orderRow).toContainText('Refund approved');
        const executeResponse = waitForApiResponse(
          adminPage,
          'POST',
          `/api/commerce/trade/order/${checkout.orderId}/executeRefund`,
        );
        await orderRow.getByRole('button', { name: 'Execute refund', exact: true }).click();
        const executeResponseValue = await executeResponse;
        expect(executeResponseValue.ok()).toBeTruthy();
        const executeResult = (await executeResponseValue.json()).data;
        const authorization = executeResponseValue.request().headers()['authorization'];
        expect(authorization).toMatch(/^Bearer /);
        const authHeaders = { Authorization: authorization };
        expectTableIdentity(executeResult.refundAttemptId);
        expectTableIdentity(executeResult.refundOperationId);
        expect([
          executeResult.orderState,
          executeResult.refundState,
          executeResult.refundAttemptState,
        ]).toEqual(['refund_approved', 'approved', 'created']);
        const completeRefundResponse = await adminPage.request.post(
          `/api/pay/mock/payment-session/refund-operation/${executeResult.refundOperationId}/complete`,
          { headers: authHeaders, data: { outcome: 'succeeded' } },
        );
        expect(completeRefundResponse.ok()).toBeTruthy();
        await expect
          .poll(
            async () => {
              await adminPage.reload({ waitUntil: 'load' });
              const currentOrderRow = await getAdminOrderRow(adminPage, checkout.orderId);
              return (await currentOrderRow.textContent()) ?? '';
            },
            { timeout: 40_000 },
          )
          .toContain('Refunded');
        await expect(await getAdminOrderRow(adminPage, checkout.orderId)).toContainText('Refunded');
        expect(adminPageErrors).toEqual([]);
      } finally {
        await adminContext.close().catch(() => {});
      }

      const refundedDetailResponse = waitForApiResponse(
        page,
        'GET',
        new RegExp(`/api/commerce/trade/order/viewMine/${checkout.orderId}$`),
      );
      await page.reload({ waitUntil: 'load' });
      await refundedDetailResponse;
      await expect(page.getByText('refunded · $45.99')).toBeVisible();
      await expect(page.getByText('1 × $45.99 = $45.99')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Shipment' })).toHaveCount(0);
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
  'ATP-SPC-01: Coupon Template renders semantic Admin field controls',
  { tag: ['@admin', '@flow', '@fia'] },
  async ({ browser }) => {
    test.setTimeout(60_000);
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPageErrors = collectPageErrors(adminPage);
    try {
      await adminPage.setViewportSize({ width: 1440, height: 900 });
      await login(adminPage, '/commerce-admin/', 'admin', '123456', 'commerceAdmin');
      await adminPage.goto(
        '/commerce-admin/rest/resource/commerce-promotion%3AcouponTemplate/create',
        {
          waitUntil: 'load',
        },
      );
      await expect(adminPage).toHaveURL(
        /\/commerce-admin\/rest\/resource\/commerce-promotion(?:%3A|:|%253A)couponTemplate\/create(?:[/?#]|$)/,
      );

      for (const groupName of [
        'Basic Information',
        'Discount Policy',
        'Validity Window',
        'Usage Limits',
      ]) {
        await expect(adminPage.getByRole('group', { name: groupName })).toBeVisible();
      }

      const state = adminPage
        .getByRole('group', { name: 'Template State *' })
        .getByRole('combobox');
      await expect(state).toBeVisible();
      await state.selectOption({ label: 'Active' });
      await expect(state).toHaveValue('active');

      const discountInput = adminPage
        .getByRole('group', { name: 'Fixed Discount *' })
        .getByRole('textbox');
      const minSpendInput = adminPage
        .getByRole('group', { name: 'Minimum Spend *' })
        .getByRole('textbox');
      await discountInput.fill('12.34');
      await minSpendInput.fill('45.67');
      await expect(discountInput).toHaveValue('12.34');
      await expect(minSpendInput).toHaveValue('45.67');
      await expect(
        adminPage.getByRole('group', { name: 'Valid From *' }).locator('input[type="date"]'),
      ).toBeVisible();
      await expect(
        adminPage.getByRole('group', { name: 'Valid Until *' }).locator('input[type="date"]'),
      ).toBeVisible();

      await adminPage
        .getByRole('group', { name: 'Name *' })
        .getByRole('textbox')
        .fill('E2E Coupon Template');
      await adminPage.getByRole('group', { name: 'Currency *' }).getByRole('textbox').fill('USD');
      await adminPage
        .getByRole('group', { name: 'Valid From *' })
        .getByRole('textbox')
        .fill('2026-08-04');
      await adminPage
        .getByRole('group', { name: 'Valid Until *' })
        .getByRole('textbox')
        .fill('2026-12-31');
      await adminPage
        .getByRole('group', { name: 'Total Issue Limit' })
        .getByRole('textbox')
        .fill('10');
      await adminPage
        .getByRole('group', { name: 'Total Usage Limit' })
        .getByRole('textbox')
        .fill('10');
      await adminPage
        .getByRole('group', { name: 'Per-customer Issue Limit' })
        .getByRole('textbox')
        .fill('1');

      await expect(adminPage.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();
      await expect(adminPage.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
      expect(adminPageErrors).toEqual([]);
    } finally {
      await adminContext.close().catch(() => {});
    }
  },
);

test(
  'ATP-SPC-02: Category renders semantic Admin relation and publication controls',
  { tag: ['@admin', '@flow', '@category'] },
  async ({ browser }, testInfo) => {
    test.setTimeout(60_000);
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const parentName = `E2E Category Parent ${suffix}`;
    const childName = `E2E Category Child ${suffix}`;
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPageErrors = collectPageErrors(adminPage);
    const categoryCreatePath = '/commerce-admin/rest/resource/commerce-catalog%3Acategory/create';
    const categoryListPath = '/commerce-admin/rest/resource/commerce-catalog%3Acategory';
    const categoryActionPath = '/api/commerce/catalog/category';
    let parentId: number | string | undefined;
    let childId: number | string | undefined;
    let headers: { Authorization: string } | undefined;
    try {
      await adminPage.setViewportSize({ width: 1440, height: 900 });
      await login(adminPage, '/commerce-admin/', 'admin', '123456', 'commerceAdmin');
      const accessToken = (await adminContext.cookies()).find(
        cookie => cookie.name === 'token',
      )?.value;
      expect(accessToken).toBeTruthy();
      headers = { Authorization: `Bearer ${accessToken}` };

      const parentCreateResponse = await adminPage.request.post(categoryActionPath, {
        data: { name: parentName, published: false },
        headers,
      });
      expect(parentCreateResponse.ok()).toBeTruthy();
      parentId = (await parentCreateResponse.json()).data;
      expectTableIdentity(parentId);

      await adminPage.goto(categoryCreatePath, { waitUntil: 'load' });
      const parentPublication = adminPage
        .getByRole('group', { name: 'Published' })
        .getByRole('combobox');
      await expect(parentPublication).toBeVisible();
      await expect(parentPublication.locator('option')).toHaveText([
        '',
        'Unpublished',
        'Published',
      ]);
      await parentPublication.selectOption({ label: 'Unpublished' });
      await expect(parentPublication).toHaveValue('false');

      const parentPicker = adminPage
        .getByRole('group', { name: 'Parent category' })
        .getByRole('combobox');
      await expect(parentPicker).toBeVisible();
      await parentPicker.selectOption({ label: parentName });
      const parentValue = await parentPicker.inputValue();
      expect(parentValue).toBe(String(parentId));
      const childPublication = adminPage
        .getByRole('group', { name: 'Published' })
        .getByRole('combobox');
      await childPublication.selectOption({ label: 'Published' });
      await expect(childPublication).toHaveValue('true');

      const childCreateResponse = await adminPage.request.post(categoryActionPath, {
        data: { name: childName, parentId: parentValue, published: true },
        headers,
      });
      expect(childCreateResponse.ok()).toBeTruthy();
      childId = (await childCreateResponse.json()).data;
      expectTableIdentity(childId);

      await adminPage.goto(categoryListPath, { waitUntil: 'load' });
      const childRow = adminPage.getByRole('row', { name: new RegExp(childName) });
      await expect(childRow).toBeVisible();
      await expect(childRow.getByText(parentName, { exact: true })).toBeVisible();
      await expect(childRow.getByText('Published', { exact: true })).toBeVisible();

      await adminPage.goto(`${categoryListPath}/${childId}`, { waitUntil: 'load' });
      await expect(
        adminPage.getByRole('group', { name: 'Parent category' }).getByRole('textbox'),
      ).toHaveValue(parentName);
      await expect(
        adminPage.getByRole('group', { name: 'Published' }).getByRole('textbox'),
      ).toHaveValue('Published');
      await expect(adminPage.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);
      expect(adminPageErrors).toEqual([]);
    } finally {
      if (childId && headers) {
        const response = await adminPage.request.delete(`${categoryActionPath}/${childId}`, {
          headers,
        });
        expect(response.ok()).toBeTruthy();
      }
      if (parentId && headers) {
        const response = await adminPage.request.delete(`${categoryActionPath}/${parentId}`, {
          headers,
        });
        expect(response.ok()).toBeTruthy();
      }
      await adminContext.close().catch(() => {});
    }
  },
);

test(
  'ATP-SPC-02: Product renders semantic Admin relation and publication controls',
  { tag: ['@admin', '@flow', '@product'] },
  async ({ browser }, testInfo) => {
    test.setTimeout(60_000);
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const categoryName = `E2E Product Category ${suffix}`;
    const productTitle = `E2E Product ${suffix}`;
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPageErrors = collectPageErrors(adminPage);
    const productCreatePath = '/commerce-admin/rest/resource/commerce-catalog%3Aproduct/create';
    const productListPath = '/commerce-admin/rest/resource/commerce-catalog%3Aproduct';
    const categoryActionPath = '/api/commerce/catalog/category';
    const productActionPath = '/api/commerce/catalog/product';
    let categoryId: number | string | undefined;
    let productId: number | string | undefined;
    let headers: { Authorization: string } | undefined;
    try {
      await adminPage.setViewportSize({ width: 1440, height: 900 });
      await login(adminPage, '/commerce-admin/', 'admin', '123456', 'commerceAdmin');
      const accessToken = (await adminContext.cookies()).find(
        cookie => cookie.name === 'token',
      )?.value;
      expect(accessToken).toBeTruthy();
      headers = { Authorization: `Bearer ${accessToken}` };

      const categoryResponse = await adminPage.request.post(categoryActionPath, {
        data: { name: categoryName, published: true },
        headers,
      });
      expect(categoryResponse.ok()).toBeTruthy();
      categoryId = (await categoryResponse.json()).data;
      expectTableIdentity(categoryId);

      await adminPage.goto(productCreatePath, { waitUntil: 'load' });
      const categoryPicker = adminPage
        .getByRole('group', { name: 'Category' })
        .getByRole('combobox');
      await expect(categoryPicker).toBeVisible();
      await categoryPicker.selectOption({ label: categoryName });
      await expect(categoryPicker).toHaveValue(String(categoryId));
      const publication = adminPage.getByRole('group', { name: 'Published' }).getByRole('combobox');
      await expect(publication).toBeVisible();
      await publication.selectOption({ label: 'Unpublished' });
      await expect(publication).toHaveValue('false');

      const productResponse = await adminPage.request.post(productActionPath, {
        data: { categoryId, title: productTitle, published: false },
        headers,
      });
      expect(productResponse.ok()).toBeTruthy();
      productId = (await productResponse.json()).data;
      expectTableIdentity(productId);

      await adminPage.goto(productListPath, { waitUntil: 'load' });
      const productRow = adminPage.getByRole('row', { name: new RegExp(productTitle) });
      await expect(productRow).toBeVisible();
      await expect(productRow.getByText(categoryName, { exact: true })).toBeVisible();
      await expect(productRow.getByText('Unpublished', { exact: true })).toBeVisible();

      await adminPage.goto(`${productListPath}/${productId}`, { waitUntil: 'load' });
      await expect(
        adminPage.getByRole('group', { name: 'Category' }).getByRole('textbox'),
      ).toHaveValue(categoryName);
      await expect(
        adminPage.getByRole('group', { name: 'Published' }).getByRole('textbox'),
      ).toHaveValue('Unpublished');
      await expect(adminPage.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);
      expect(adminPageErrors).toEqual([]);
    } finally {
      if (productId && headers) {
        const response = await adminPage.request.delete(`${productActionPath}/${productId}`, {
          headers,
        });
        expect(response.ok()).toBeTruthy();
      }
      if (categoryId && headers) {
        const response = await adminPage.request.delete(`${categoryActionPath}/${categoryId}`, {
          headers,
        });
        expect(response.ok()).toBeTruthy();
      }
      await adminContext.close().catch(() => {});
    }
  },
);

test(
  'ATP-SPC-02: SKU renders semantic Admin currency and lifecycle controls',
  { tag: ['@admin', '@flow', '@sku'] },
  async ({ browser }, testInfo) => {
    test.setTimeout(60_000);
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const categoryName = `E2E SKU Category ${suffix}`;
    const productTitle = `E2E SKU Product ${suffix}`;
    const skuCode = `E2E-SKU-${suffix}`;
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPageErrors = collectPageErrors(adminPage);
    const skuCreatePath = '/commerce-admin/rest/resource/commerce-catalog%3Asku/create';
    const skuListPath = '/commerce-admin/rest/resource/commerce-catalog%3Asku';
    const categoryActionPath = '/api/commerce/catalog/category';
    const productActionPath = '/api/commerce/catalog/product';
    const skuActionPath = '/api/commerce/catalog/sku';
    let categoryId: number | string | undefined;
    let productId: number | string | undefined;
    let skuId: number | string | undefined;
    let headers: { Authorization: string } | undefined;
    try {
      await adminPage.setViewportSize({ width: 1440, height: 900 });
      await login(adminPage, '/commerce-admin/', 'admin', '123456', 'commerceAdmin');
      const accessToken = (await adminContext.cookies()).find(
        cookie => cookie.name === 'token',
      )?.value;
      expect(accessToken).toBeTruthy();
      headers = { Authorization: `Bearer ${accessToken}` };

      const categoryResponse = await adminPage.request.post(categoryActionPath, {
        data: { name: categoryName, published: true },
        headers,
      });
      expect(categoryResponse.ok()).toBeTruthy();
      categoryId = (await categoryResponse.json()).data;
      expectTableIdentity(categoryId);

      const productResponse = await adminPage.request.post(productActionPath, {
        data: { categoryId, title: productTitle, published: true },
        headers,
      });
      expect(productResponse.ok()).toBeTruthy();
      productId = (await productResponse.json()).data;
      expectTableIdentity(productId);

      await adminPage.goto(skuCreatePath, { waitUntil: 'load' });
      const productField = adminPage.getByRole('group', { name: 'Product' });
      await expect(productField).toBeVisible();
      await expect(productField.getByRole('combobox')).toHaveCount(0);
      await expect(productField.getByRole('textbox')).toBeVisible();
      const lifecycle = adminPage
        .getByRole('group', { name: 'SKU lifecycle' })
        .getByRole('combobox');
      await expect(lifecycle).toBeVisible();
      await expect(lifecycle.locator('option')).toHaveText([
        '',
        'Draft',
        'Active',
        'Inactive',
        'Archived',
      ]);
      await expect(adminPage.getByRole('group', { name: 'Price (cents)' })).toBeVisible();

      const skuResponse = await adminPage.request.post(skuActionPath, {
        data: { code: skuCode, productId, priceCents: 1234, lifecycle: 'draft' },
        headers,
      });
      expect(skuResponse.ok()).toBeTruthy();
      skuId = (await skuResponse.json()).data;
      expectTableIdentity(skuId);

      await adminPage.goto(skuListPath, { waitUntil: 'load' });
      const skuRow = adminPage.getByRole('row', { name: new RegExp(skuCode) });
      await expect(skuRow).toBeVisible();
      await expect(skuRow.getByText('12.34', { exact: true })).toBeVisible();
      await expect(skuRow.getByText('Draft', { exact: true })).toBeVisible();
      await expect(skuRow.getByRole('link', { name: skuCode, exact: true })).toBeVisible();
      await expect(
        adminPage.locator('section').getByText('SKU code', { exact: true }),
      ).toBeVisible();
      await expect(adminPage.getByText('Created At', { exact: true })).toHaveCount(1);
      await expect(adminPage.getByRole('group', { name: 'Attributes' })).toHaveCount(0);

      await adminPage.goto(`${skuListPath}/${skuId}`, { waitUntil: 'load' });
      await expect(
        adminPage.getByRole('group', { name: 'SKU lifecycle' }).getByRole('textbox'),
      ).toHaveValue('Draft');
      await expect(adminPage.getByRole('button', { name: 'Submit', exact: true })).toHaveCount(0);
      await expect(adminPage.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
      expect(adminPageErrors).toEqual([]);
    } finally {
      if (skuId && headers) {
        const response = await adminPage.request.delete(`${skuActionPath}/${skuId}`, { headers });
        expect(response.ok()).toBeTruthy();
      }
      if (productId && headers) {
        const response = await adminPage.request.delete(`${productActionPath}/${productId}`, {
          headers,
        });
        expect(response.ok()).toBeTruthy();
      }
      if (categoryId && headers) {
        const response = await adminPage.request.delete(`${categoryActionPath}/${categoryId}`, {
          headers,
        });
        expect(response.ok()).toBeTruthy();
      }
      await adminContext.close().catch(() => {});
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
      ['/commerce/payment/1/1', '/payment/1/1'],
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
      expect(html, path).not.toContain('Mock payment simulator');
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
