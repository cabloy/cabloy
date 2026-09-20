import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

const probeErrorMessage = 'Controller boundary probe initialization failed';

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

test(
  'ATP-BASIC-CONTROLLER-BOUNDARY-01: global boundaries render loading, error, and recovery',
  { tag: ['@web', '@flow'] },
  async ({ page, request }) => {
    const serverResponse = await request.get('/demo/basic/controllerBoundary');
    expect(serverResponse.ok()).toBeTruthy();
    const serverHtml = await serverResponse.text();
    expect(serverHtml).not.toContain('Controller boundary probe ready');
    expect(serverHtml).not.toContain(probeErrorMessage);

    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const response = await page.goto('/demo/basic/controllerBoundary', { waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await expect(
      page.getByRole('heading', { name: 'Controller Boundary Manual Validation', exact: true }),
    ).toBeVisible();
    await page.waitForTimeout(1_000);

    const loading = page.getByRole('status');
    const error = page.locator('.alert.alert-error');
    const ready = page.getByText('Controller boundary probe ready', { exact: true });

    await expect(loading).toHaveCount(0);
    await expect(error).toHaveCount(0);
    await expect(ready).toHaveCount(0);

    await page.getByRole('button', { name: 'Mount fast success probe', exact: true }).click();
    await page.waitForTimeout(400);
    await expect(loading).toHaveCount(0);
    await expect(ready).toBeVisible();
    await expect(error).toHaveCount(0);

    await page.getByRole('button', { name: 'Mount fast failing probe', exact: true }).click();
    await page.waitForTimeout(400);
    await expect(error).toHaveText(probeErrorMessage);
    await expect(loading).toHaveCount(0);
    await expect(ready).toHaveCount(0);

    const delayedSuccessLoading = loading.waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Mount delayed success probe', exact: true }).click();
    await delayedSuccessLoading;
    await expect(ready).toBeVisible();
    await expect(loading).toHaveCount(0);
    await expect(error).toHaveCount(0);

    const failingProbeLoading = loading.waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Mount failing probe', exact: true }).click();
    await failingProbeLoading;
    await expect.poll(() => loading.evaluate(element => element.tagName)).toBe('DIV');
    await expect(error).toHaveText(probeErrorMessage);
    await expect.poll(() => error.evaluate(element => element.tagName)).toBe('DIV');
    await expect(ready).toHaveCount(0);
    const retry = page.getByRole('button', { name: 'Retry', exact: true });
    await expect(retry).toBeVisible();

    const failedRetryLoading = loading.waitFor({ state: 'visible' });
    await retry.click();
    await failedRetryLoading;
    await expect(error).toHaveText(probeErrorMessage);
    await expect(retry).toBeVisible();

    await page.getByRole('button', { name: 'Prepare probe retry success', exact: true }).click();
    const successfulRetryLoading = loading.waitFor({ state: 'visible' });
    await retry.evaluate(button => {
      button.click();
      button.click();
    });
    await successfulRetryLoading;
    await expect(ready).toBeVisible();
    await expect(loading).toHaveCount(0);
    await expect(error).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors.every(error => error.includes(probeErrorMessage))).toBeTruthy();
  },
);

test(
  'ATP-BASIC-CONTROLLER-BOUNDARY-06: disposed and stale loads do not surface errors',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const response = await page.goto('/demo/basic/controllerBoundary', { waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.waitForTimeout(1_000);

    const loading = page.getByRole('status');
    const error = page.locator('.alert.alert-error');
    const ready = page.getByText('Controller boundary probe ready', { exact: true });

    const disposedLoading = loading.waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Mount failing probe', exact: true }).click();
    await disposedLoading;
    await page.getByRole('button', { name: 'Clear probe', exact: true }).click();
    await page.waitForTimeout(1_000);
    await expect(loading).toHaveCount(0);
    await expect(error).toHaveCount(0);
    await expect(ready).toHaveCount(0);

    const staleLoading = loading.waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Mount failing probe', exact: true }).click();
    await staleLoading;
    await page.getByRole('button', { name: 'Mount fast success probe', exact: true }).click();
    await expect(ready).toBeVisible();
    await page.waitForTimeout(1_000);
    await expect(error).toHaveCount(0);
    await expect(ready).toBeVisible();

    expect(pageErrors).toEqual([]);
    expect(
      consoleErrors.filter(error =>
        /Cannot read properties of null \(reading ['"]state['"]\)/.test(error),
      ),
    ).toEqual([]);
  },
);

test(
  'ATP-BASIC-CONTROLLER-BOUNDARY-02: inline boundaries preserve phrasing-content markup',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const response = await page.goto('/demo/basic/controllerBoundary', { waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.waitForTimeout(1_000);

    const inlineHost = page.locator('p', { hasText: 'Inline boundary:' });
    const loading = inlineHost.getByRole('status');
    const error = inlineHost.getByRole('alert');
    const ready = inlineHost.getByText('Inline Controller boundary probe ready', { exact: true });
    await page.getByRole('button', { name: 'Mount inline failing probe', exact: true }).click();
    await expect(error).toHaveText('Inline Controller boundary probe initialization failed');
    await expect.poll(() => error.evaluate(element => element.tagName)).toBe('SPAN');
    await expect(ready).toHaveCount(0);
    await expect(inlineHost.locator('div')).toHaveCount(0);
    await expect(inlineHost.getByRole('button', { name: 'Retry', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Prepare inline retry success', exact: true }).click();
    await inlineHost.getByRole('button', { name: 'Retry', exact: true }).click();
    await expect(ready).toBeVisible();
    await expect(loading).toHaveCount(0);
    await expect(error).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expect(
      consoleErrors.every(error =>
        error.includes('Inline Controller boundary probe initialization failed'),
      ),
    ).toBeTruthy();
  },
);

test(
  'ATP-BASIC-CONTROLLER-BOUNDARY-03: Controller overrides receive the mode and retain legacy error arity',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const response = await page.goto('/demo/basic/controllerBoundary', { waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.waitForTimeout(1_000);

    const overrideHost = page.locator('p', { hasText: 'Override boundary:' });
    const loading = overrideHost.getByRole('status');
    const error = overrideHost.getByRole('alert');
    const ready = overrideHost.getByText('Override Controller boundary probe ready', {
      exact: true,
    });
    const initialOverrideLoading = expect(loading).toHaveText('Override loading mode: inline');
    await page.getByRole('button', { name: 'Mount override failing probe', exact: true }).click();
    await initialOverrideLoading;
    await expect(error).toHaveText(
      'Override legacy error: Override Controller boundary probe initialization failed',
    );
    await expect(ready).toHaveCount(0);
    await expect(overrideHost.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0);

    const recoveredOverrideLoading = loading.waitFor({ state: 'visible' });
    await page
      .getByRole('button', { name: 'Recover override with delayed success', exact: true })
      .click();
    await recoveredOverrideLoading;
    await expect(loading).toHaveText('Override loading mode: inline');
    await expect(ready).toBeVisible();
    await expect(loading).toHaveCount(0);
    await expect(error).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expect(
      consoleErrors.every(error =>
        error.includes('Override Controller boundary probe initialization failed'),
      ),
    ).toBeTruthy();
  },
);

test(
  'ATP-BASIC-CONTROLLER-BOUNDARY-04: inline server load failure remains hydration-safe',
  { tag: ['@web', '@flow'] },
  async ({ page, request }) => {
    const errorMessage = 'Inline Controller boundary probe initialization failed';
    const serverResponse = await request.get(
      '/demo/basic/controllerBoundary?mode=inlineServerFailure',
    );
    expect(serverResponse.ok()).toBeTruthy();
    const serverHtml = await serverResponse.text();
    expect(serverHtml).toContain(errorMessage);
    expect(serverHtml).not.toContain('Inline Controller boundary probe ready');
    expect(serverHtml).not.toContain('>Retry<');

    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const response = await page.goto('/demo/basic/controllerBoundary?mode=inlineServerFailure', {
      waitUntil: 'load',
    });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.waitForTimeout(1_000);
    const inlineHost = page.locator('p', { hasText: 'Inline boundary:' });
    const error = inlineHost.getByRole('alert');
    await expect(error).toHaveText(errorMessage);
    await expect.poll(() => error.evaluate(element => element.tagName)).toBe('SPAN');
    await expect(
      inlineHost.getByText('Inline Controller boundary probe ready', { exact: true }),
    ).toHaveCount(0);
    const retry = inlineHost.getByRole('button', { name: 'Retry', exact: true });
    await expect(retry).toBeVisible();

    await retry.click();
    await expect(
      inlineHost.getByText('Inline Controller boundary probe ready', { exact: true }),
    ).toBeVisible();
    await expect(error).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors.every(error => error.includes(errorMessage))).toBeTruthy();
  },
);

test(
  'ATP-BASIC-CONTROLLER-BOUNDARY-05: server load failure remains the initial hydration boundary',
  { tag: ['@web', '@flow'] },
  async ({ page, request }) => {
    const serverResponse = await request.get('/demo/basic/controllerBoundary?mode=serverFailure');
    expect(serverResponse.ok()).toBeTruthy();
    const serverHtml = await serverResponse.text();
    expect(serverHtml).toContain(probeErrorMessage);
    expect(serverHtml).not.toContain('Controller boundary probe ready');
    expect(serverHtml).not.toContain('>Retry<');

    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);
    const response = await page.goto('/demo/basic/controllerBoundary?mode=serverFailure', {
      waitUntil: 'load',
    });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
    await page.waitForTimeout(1_000);
    await expect(page.locator('.alert.alert-error')).toHaveText(probeErrorMessage);
    await expect(page.getByText('Controller boundary probe ready', { exact: true })).toHaveCount(0);
    const retry = page.getByRole('button', { name: 'Retry', exact: true });
    await expect(retry).toBeVisible();

    await retry.click();
    await expect(page.getByText('Controller boundary probe ready', { exact: true })).toBeVisible();
    await expect(page.locator('.alert.alert-error')).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors.every(error => error.includes(probeErrorMessage))).toBeTruthy();
  },
);
