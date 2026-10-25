import type { Page } from '@playwright/test';

import { expect, test } from '../scripts/managedTest.ts';

function collectPageErrors(page: Page) {
  const errors: Error[] = [];
  page.on('pageerror', error => {
    errors.push(error);
  });
  return errors;
}

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  return errors;
}

async function loginAsAdmin(page: Page) {
  await page.goto('/admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  if (page.url().includes('/admin/login')) {
    const usernameInput = page.getByPlaceholder('Your Username');
    const passwordInput = page.getByPlaceholder('Your Password');
    await usernameInput.fill('admin');
    await passwordInput.fill('123456');
    await expect(usernameInput).toHaveValue('admin');
    await expect(passwordInput).toHaveValue('123456');
    await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
    const loginResponse = page.waitForResponse(response => {
      const url = new URL(response.url());
      return (
        response.request().method() === 'POST' && url.pathname === '/api/home/user/passport/login'
      );
    });
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    expect((await loginResponse).ok()).toBeTruthy();
    await expect(page).not.toHaveURL(/\/admin\/login(?:\?|$)/);
  }

  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
  await page.goto('/admin/', { waitUntil: 'load' });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
}

test(
  'ATP-LOC-03: installed Japanese stays disabled while configured Web languages work',
  { tag: ['@web', '@smoke'] },
  async ({ page, request }) => {
    const disabledResponse = await request.get('/ja-jp', { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(disabledResponse.status());
    expect(new URL(disabledResponse.headers().location!, disabledResponse.url()).pathname).toBe(
      '/',
    );

    const origin = new URL(disabledResponse.url()).origin;
    await page.context().addCookies([{ name: 'locale', value: 'ja-jp', url: origin }]);
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/ja-jp', { waitUntil: 'load' });
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(
      page.getByRole('heading', { name: 'Vona integrated SSR', exact: true }),
    ).toBeVisible();

    const localeMenu = page.locator('details').filter({
      has: page.getByText('English', { exact: true }),
    });
    await expect(localeMenu).toHaveCount(1);
    await localeMenu.locator('summary').click();
    await expect(localeMenu.getByText('Japanese', { exact: true })).toHaveCount(0);
    await expect(localeMenu.getByText('日本語', { exact: true })).toHaveCount(0);
    await localeMenu.getByText('Chinese', { exact: true }).click();
    await expect(page).toHaveURL(/\/zh-cn\/?$/);
    await expect(
      page.getByRole('heading', { name: 'Vona 集成式 SSR', exact: true }).first(),
    ).toBeVisible();
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(
      page.getByRole('heading', { name: 'Vona 集成式 SSR', exact: true }).first(),
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);

test(
  'ATP-LOC-03: Admin language menu excludes installed Japanese and preserves configured selection',
  { tag: ['@admin', '@smoke'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    await loginAsAdmin(page);
    const localeMenu = page.locator('details').filter({
      has: page.getByText('Chinese', { exact: true }),
    });
    await expect(localeMenu).toHaveCount(1);
    await localeMenu.locator('summary').click();
    await expect(localeMenu.getByText('Japanese', { exact: true })).toHaveCount(0);
    await expect(localeMenu.getByText('日本語', { exact: true })).toHaveCount(0);
    await localeMenu.getByText('Chinese', { exact: true }).click();
    await expect(
      page.locator('details').filter({ has: page.getByText('简体中文', { exact: true }) }),
    ).toHaveCount(1);
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'admin');
    const restoredMenu = page.locator('details').filter({
      has: page.getByText('简体中文', { exact: true }),
    });
    await expect(restoredMenu).toHaveCount(1);
    await restoredMenu.locator('summary').click();
    await expect(restoredMenu.getByText('简体中文', { exact: true })).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);
