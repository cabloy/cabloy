import type { APIRequestContext, Page, TestInfo } from '@playwright/test';

import { expect, test } from '@playwright/test';
import path from 'node:path';

const accountPath = '/home/user/account';
const passwordSetPath = '/home/user/password-set';
const passwordResetPath = '/home/user/password-reset';
const syntheticQueryToken = 'e2e-public-query-token';
const syntheticResetQueryToken = 'e2e-reset-public-query-token-001';
const accountApiPath = '/api/home/user/account/current';
const passportCurrentApiPath = '/api/home/user/passport/current';
const passportLoginApiPath = '/api/home/user/passport/login';
const passportRegisterApiPath = '/api/home/user/passport/register';
const passportActivateCurrentApiPath = '/api/home/user/passportTest/activateCurrent';
const accountProfileApiPath = '/api/home/user/account/profile';
const imageUploadApiPath = '/api/image/upload';
const avatarFixturePath = path.resolve(
  import.meta.dirname,
  '../../../zova/src/suite/a-home/modules/home-base/assets/img/avatar_user.png',
);

function waitForApiResponse(page: Page, method: string, path: string) {
  return page.waitForResponse(response => {
    const url = new URL(response.url());
    return (
      response.request().method() === method &&
      url.pathname === path &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

async function registerAccountUser(request: APIRequestContext, testInfo: TestInfo) {
  const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
  const username = `e2e-account-${suffix}`;
  const password = 'account-e2e-password';
  const captchaResponse = await request.post('/api/captcha/create', {
    data: { scene: 'captcha-simple:simple' },
  });
  expect(captchaResponse.ok()).toBeTruthy();
  const captcha = (await captchaResponse.json()).data;
  expect(captcha?.id).toEqual(expect.any(String));
  expect(captcha?.token).toEqual(expect.any(String));

  const baseURL = testInfo.project.use.baseURL;
  if (!baseURL) throw new Error('account E2E base URL is unavailable');
  const consumerUrl = new URL('/home/user/activation', baseURL).toString();
  const registerResponse = await request.post(passportRegisterApiPath, {
    data: {
      username,
      email: `${username}@example.test`,
      password,
      passwordConfirm: password,
      consumerUrl,
      captcha: { id: captcha.id, token: captcha.token },
    },
  });
  expect(registerResponse.ok()).toBeTruthy();
  const registration = (await registerResponse.json()).data;
  expect(registration?.jwt?.accessToken).toEqual(expect.any(String));
  const activateResponse = await request.post(passportActivateCurrentApiPath, {
    headers: { Authorization: `Bearer ${registration.jwt.accessToken}` },
  });
  expect(activateResponse.ok()).toBeTruthy();
  return { password, username };
}

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

function collectConsoleErrors(page: Page, ignored: RegExp[] = []) {
  const errors: string[] = [];
  page.on('console', message => {
    const text = message.text();
    if (
      (message.type() === 'error' || /hydration mismatch/i.test(text)) &&
      !ignored.some(pattern => pattern.test(text))
    ) {
      errors.push(text);
    }
  });
  return errors;
}

test(
  'ATP-ACCOUNT-SSR-01: anonymous Account session SSR redirects to login',
  { tag: ['@account', '@web', '@ssr'] },
  async ({ page, request }) => {
    const response = await request.get(accountPath, { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    const redirectUrl = new URL(response.headers().location!, response.url());
    expect(redirectUrl.pathname).toBe('/login');
    expect(redirectUrl.searchParams.get('returnTo')).toBe(accountPath);

    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const documentResponse = await page.goto(accountPath, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    expect(new URL(page.url()).searchParams.get('returnTo')).toBe(accountPath);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toHaveCount(0);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-HUA-REG-01: Login registration uses the Passport contract and defers site admission until activation',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page }, testInfo) => {
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const username = `e2e-register-${suffix}`;
    const password = 'account-e2e-password';

    await page.goto(accountPath, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    expect(new URL(page.url()).searchParams.get('returnTo')).toBe(accountPath);
    await page.getByRole('button', { name: 'Create account', exact: true }).click();
    await expect(page).toHaveURL(
      new RegExp(`/home/login/register\\?returnTo=${encodeURIComponent(accountPath)}`),
    );
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();

    await page.getByRole('group', { name: 'User Name *' }).getByRole('textbox').fill(username);
    await page
      .getByRole('group', { name: 'Email *' })
      .getByRole('textbox')
      .fill(`${username}@example.test`);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="passwordConfirm"]').fill(password);
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    const registerResponse = waitForApiResponse(page, 'POST', passportRegisterApiPath);
    await page.getByRole('button', { name: 'Create account', exact: true }).click();
    expect((await registerResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(
      new RegExp(`/home/login/register\\?returnTo=${encodeURIComponent(accountPath)}`),
    );
    await expect(
      page.getByText('Check your email to activate your account before signing in.', {
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Back to login', exact: true }).click();
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    expect(new URL(page.url()).searchParams.get('returnTo')).toBe(accountPath);
  },
);

test(
  'ATP-HUA-RST-01: reset request remains generic after valid CAPTCHA',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page }) => {
    await page.goto('/login', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.getByRole('button', { name: 'Forgot password?', exact: true }).click();
    await expect(page).toHaveURL('/home/login/password-reset');
    await expect(page.getByRole('heading', { name: 'Reset password' })).toBeVisible();

    await page.getByPlaceholder('Your email address').fill('unknown-reset@example.test');
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    const requestResponse = waitForApiResponse(
      page,
      'POST',
      '/api/home/user/account/password-reset/request',
    );
    await page.getByRole('button', { name: 'Reset password', exact: true }).click();
    const response = await requestResponse;
    expect(response.ok()).toBeTruthy();
    await expect(
      page.getByText(
        'If an eligible account matches that address, a reset link will be sent shortly.',
        {
          exact: true,
        },
      ),
    ).toBeVisible();
  },
);

test(
  'ATP-HUA-RST-03: reset query token is scrubbed and invalid token stays nondiagnostic',
  { tag: ['@account', '@web', '@ssr'] },
  async ({ page, request }) => {
    const tokenUrl = `${passwordResetPath}?token=${syntheticResetQueryToken}`;
    const response = await request.get(tokenUrl);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['cache-control']).toBe('public, max-age=600');
    const html = await response.text();
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(html).not.toContain('New password');
    expect(html).not.toContain('Confirm new password');
    expect(html).not.toContain(syntheticResetQueryToken);

    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page, [/server responded with a status of 401/i]);
    const documentResponse = await page.goto(tokenUrl, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page).toHaveURL(passwordResetPath);
    await expect(page.getByRole('heading', { name: 'Reset password' })).toBeVisible();
    await expect(page.getByPlaceholder('New password', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Confirm new password')).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(token => {
          return {
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            local: Object.entries(localStorage).filter(([key, value]) =>
              `${key}:${value}`.includes(token),
            ),
            session: Object.entries(sessionStorage).filter(([key, value]) =>
              `${key}:${value}`.includes(token),
            ),
          };
        }, syntheticResetQueryToken),
      )
      .toEqual({ pathname: passwordResetPath, search: '', hash: '', local: [], session: [] });

    await page.getByPlaceholder('New password', { exact: true }).fill('reset-e2e-password');
    await page.getByPlaceholder('Confirm new password').fill('reset-e2e-password');
    const consumeResponse = waitForApiResponse(
      page,
      'POST',
      '/api/home/user/account/password-reset/consume',
    );
    await page.getByRole('button', { name: 'Reset password', exact: true }).click();
    expect((await consumeResponse).status()).toBeGreaterThanOrEqual(400);
    await expect(
      page.getByText('This password-reset link is invalid or has expired.', { exact: true }),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-ACCOUNT-PUBLIC-01: password-set query token is scrubbed before public interaction',
  { tag: ['@account', '@web', '@ssr'] },
  async ({ page, request }) => {
    const tokenUrl = `${passwordSetPath}?token=${syntheticQueryToken}`;
    const response = await request.get(tokenUrl);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['cache-control']).toBe('public, max-age=600');
    const html = await response.text();
    expect(html.toLowerCase()).not.toContain('data-zova-hydrated');
    expect(html).not.toContain('New password');
    expect(html).not.toContain('Confirm new password');
    expect(html).not.toContain(syntheticQueryToken);

    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const documentResponse = await page.goto(tokenUrl, { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page).toHaveURL(passwordSetPath);
    await expect(page.getByRole('heading', { name: 'Set password' })).toBeVisible();
    await expect(page.getByPlaceholder('New password', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Confirm new password')).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(token => {
          return {
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            local: Object.entries(localStorage).filter(([key, value]) =>
              `${key}:${value}`.includes(token),
            ),
            session: Object.entries(sessionStorage).filter(([key, value]) =>
              `${key}:${value}`.includes(token),
            ),
          };
        }, syntheticQueryToken),
      )
      .toEqual({ pathname: passwordSetPath, search: '', hash: '', local: [], session: [] });
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-ACCOUNT-WEB-01: signed-in Web menu refreshes after profile save and keeps drafts isolated',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page, request }, testInfo) => {
    const account = await registerAccountUser(request, testInfo);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);

    await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.getByPlaceholder('Your Username').fill(account.username);
    await page.getByPlaceholder('Your Password').fill(account.password);
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    const loginResponse = waitForApiResponse(page, 'POST', passportLoginApiPath);
    const accountResponse = waitForApiResponse(page, 'GET', accountApiPath);
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    expect((await loginResponse).ok()).toBeTruthy();
    const accountResponseBody = await accountResponse;
    expect(accountResponseBody.ok()).toBeTruthy();
    expect((await accountResponseBody.json()).data.avatar).toBeNull();
    await expect(page).toHaveURL(accountPath);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();

    const avatarPreview = page.getByAltText('Choose avatar', { exact: true });
    await expect(avatarPreview).toBeVisible();
    await expect
      .poll(() =>
        avatarPreview.evaluate(image => ({
          complete: (image as HTMLImageElement).complete,
          naturalWidth: (image as HTMLImageElement).naturalWidth,
        })),
      )
      .toEqual({ complete: true, naturalWidth: expect.any(Number) });
    await expect
      .poll(() => avatarPreview.evaluate(image => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);

    const profileName = `E2E Account ${testInfo.workerIndex}-${Date.now()}`;
    await page.getByRole('group', { name: 'name' }).getByRole('textbox').fill(profileName);
    const timezone = page.getByRole('group', { name: 'tz' }).getByRole('textbox');
    const browserTimezone = await page.evaluate(
      () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    await expect
      .poll(() => timezone.getAttribute('placeholder'), { timeout: 10_000 })
      .toBe(browserTimezone);
    await expect(timezone).toHaveValue('');
    await timezone.fill('UTC');

    // The password form is independently schema-rendered; profile submission must not mutate it.
    const passwordDraftSnapshot = await page
      .locator('input[type="password"]')
      .evaluateAll(inputs => inputs.map(input => (input as HTMLInputElement).value));

    const profileResponse = waitForApiResponse(page, 'PATCH', accountProfileApiPath);
    const refreshedPassportResponse = waitForApiResponse(page, 'GET', passportCurrentApiPath);
    await page.getByRole('button', { name: 'Save profile', exact: true }).click();
    expect((await profileResponse).ok()).toBeTruthy();
    expect((await refreshedPassportResponse).ok()).toBeTruthy();
    await expect(page.getByText('Profile saved.', { exact: true })).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator('input[type="password"]')
          .evaluateAll(inputs => inputs.map(input => (input as HTMLInputElement).value)),
      )
      .toEqual(passwordDraftSnapshot);

    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    const userMenu = page
      .locator('details')
      .filter({ has: page.getByText('Logout', { exact: true }) });
    await expect(userMenu).toHaveCount(1);
    await expect(userMenu.locator('summary')).toContainText(profileName);
    await userMenu.locator('summary').click();
    const links = userMenu.locator('ul > li > a');
    await expect(links).toHaveText(['Account Settings', 'Logout']);
    await userMenu.getByText('Account Settings', { exact: true }).click();
    await expect(page).toHaveURL(accountPath);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
    await expect(userMenu).not.toHaveAttribute('open', '');
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-ACCOUNT-AVATAR-01: avatar crop defers file upload until crop approval',
  { tag: ['@account', '@web', '@flow'] },
  async ({ page, request }, testInfo) => {
    const account = await registerAccountUser(request, testInfo);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);

    await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.getByPlaceholder('Your Username').fill(account.username);
    await page.getByPlaceholder('Your Password').fill(account.password);
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    const loginResponse = waitForApiResponse(page, 'POST', passportLoginApiPath);
    const accountResponse = waitForApiResponse(page, 'GET', accountApiPath);
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    expect((await loginResponse).ok()).toBeTruthy();
    expect((await accountResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(accountPath);

    const fileInput = page.locator('input[type="file"]').first();
    let uploadCount = 0;
    const uploadListener = (response: import('@playwright/test').Response) => {
      if (new URL(response.url()).pathname === imageUploadApiPath) uploadCount++;
    };
    page.on('response', uploadListener);
    await fileInput.setInputFiles(avatarFixturePath);
    await expect(page.getByRole('button', { name: 'Apply crop', exact: true })).toBeVisible();
    expect(uploadCount).toBe(0);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Apply crop', exact: true })).toHaveCount(0);
    expect(uploadCount).toBe(0);

    await fileInput.setInputFiles(avatarFixturePath);
    await expect(page.getByRole('button', { name: 'Apply crop', exact: true })).toBeVisible();
    await page.waitForTimeout(1_000);
    await page.getByRole('button', { name: 'Apply crop', exact: true }).click();
    await expect.poll(() => uploadCount, { timeout: 10_000 }).toBeGreaterThan(0);
    await expect(page.getByText('Avatar is ready to save.', { exact: true })).toBeVisible();
    page.off('response', uploadListener);

    const profileResponse = page.waitForResponse(response => {
      const url = new URL(response.url());
      return response.request().method() === 'PATCH' && url.pathname === accountProfileApiPath;
    });
    await page.getByRole('button', { name: 'Save profile', exact: true }).click();
    const profile = await profileResponse;
    expect(profile.ok()).toBeTruthy();
    const profileBody = (await profile.json()).data;
    expect(profileBody.avatar).toEqual(expect.any(String));
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-ACCOUNT-SSR-02: signed-in Account session SSR hydrates without mismatch',
  { tag: ['@account', '@web', '@ssr'] },
  async ({ page, request }, testInfo) => {
    const account = await registerAccountUser(request, testInfo);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);

    await page.goto('/login?returnTo=%2Fhome%2Fuser%2Faccount', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.getByPlaceholder('Your Username').fill(account.username);
    await page.getByPlaceholder('Your Password').fill(account.password);
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    const loginResponse = waitForApiResponse(page, 'POST', passportLoginApiPath);
    const initialAccountResponse = waitForApiResponse(page, 'GET', accountApiPath);
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    expect((await loginResponse).ok()).toBeTruthy();
    expect((await initialAccountResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(accountPath);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();

    pageErrors.length = 0;
    consoleErrors.length = 0;
    const documentResponse = await page.reload({ waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();
    expect(documentResponse?.url()).toContain(accountPath);
    const html = await documentResponse!.text();
    expect(html).toContain('Account Settings');
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-ACCOUNT-ADMIN-01: Account Settings precedes Logout and reaches the shared page',
  { tag: ['@account', '@admin'] },
  async ({ page }) => {
    await page.goto('/admin/', { waitUntil: 'load' });
    if (page.url().includes('/admin/login')) {
      await page.getByPlaceholder('Your Username').fill('admin');
      await page.getByPlaceholder('Your Password').fill('123456');
      await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      await expect(page).not.toHaveURL(/\/admin\/login(?:\?|$)/);
    }

    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    const userMenu = page
      .locator('details')
      .filter({ has: page.getByText('Logout', { exact: true }) });
    await expect(userMenu).toHaveCount(1);
    const summary = userMenu.locator('summary');
    await summary.click();
    const links = userMenu.locator('ul > li > a');
    await expect(links).toHaveText(['Account Settings', 'Logout']);

    const accountResponse = page.waitForResponse(response => {
      const url = new URL(response.url());
      return response.request().method() === 'GET' && url.pathname === accountApiPath;
    });
    await userMenu.getByText('Account Settings', { exact: true }).click();
    expect((await accountResponse).ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/home\/user\/account(?:\?|$)/);
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
    await expect(userMenu).not.toHaveAttribute('open', '');
  },
);
