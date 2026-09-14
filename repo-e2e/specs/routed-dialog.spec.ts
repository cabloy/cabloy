import type { Locator, Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    __routedDialogHydrationWarnings?: unknown[];
  }
}

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
    const text = message.text();
    if (
      message.type() === 'error' ||
      (message.type() === 'warning' && /hydration (node |children )?mismatch/i.test(text))
    ) {
      errors.push(`${message.type()}: ${text}`);
    }
  });
  return errors;
}

async function installHydrationWarningProbe(page: Page) {
  await page.addInitScript(() => {
    const originalWarn = console.warn;
    const warnings: unknown[] = [];
    Object.defineProperty(window, '__routedDialogHydrationWarnings', {
      configurable: true,
      value: warnings,
    });
    console.warn = (...args: unknown[]) => {
      try {
        if (
          args.some(
            arg => typeof arg === 'string' && /Hydration (node|children) mismatch/.test(arg),
          )
        ) {
          const node = args.find(arg => arg instanceof Node) as Node | undefined;
          warnings.push({
            args: args.map(arg => (typeof arg === 'string' ? arg : String(arg))),
            node: node
              ? {
                  type: node.nodeType,
                  value: node.nodeValue,
                  parent: node.parentElement?.outerHTML.slice(0, 1000),
                }
              : undefined,
          });
        }
      } finally {
        originalWarn.apply(console, args as Parameters<typeof console.warn>);
      }
    };
  });
}

async function getHydrationWarningProbe(page: Page) {
  return await page.evaluate(() => window.__routedDialogHydrationWarnings ?? []);
}

function dialogByTitle(page: Page, dialog: 'A' | 'B') {
  return page.getByRole('dialog').filter({
    has: page.getByRole('heading', {
      name: `Routed Dialog ${dialog}`,
      exact: true,
    }),
  });
}

function routeRow(scope: Locator, name: string) {
  return scope.locator('tbody tr').filter({ hasText: name }).last();
}

async function expectRouteValue(scope: Locator, name: string, value: string, type?: string) {
  const row = routeRow(scope, name);
  await expect(row.getByRole('cell').nth(1)).toHaveText(value);
  if (type) {
    await expect(row.getByRole('cell').nth(2)).toHaveText(type);
  }
}

async function expectRoutePath(scope: Locator, pathname: string) {
  const row = routeRow(scope, '$pageRoute.fullPath');
  const fullPath = await row.getByRole('cell').nth(1).textContent();
  expect(new URL(fullPath, 'http://e2e.invalid').pathname).toBe(pathname);
}

async function expectNoDialogLayout(dialog: Locator) {
  await expect(dialog.locator('.drawer')).toHaveCount(0);
}

async function expectDialogMaxWidth(dialog: Locator, expected: string) {
  await expect(dialog).toHaveCSS('max-width', expected);
}

async function getDialogTop(dialog: Locator) {
  return Math.round((await dialog.boundingBox())?.y ?? -1);
}

async function expectDialogTop(dialog: Locator, expected: number) {
  await expect.poll(() => getDialogTop(dialog)).toBe(expected);
}

async function openDemo(page: Page) {
  const pageErrors = collectPageErrors(page);
  const consoleErrors = collectConsoleErrors(page);
  await installHydrationWarningProbe(page);
  const response = await page.goto('/demo/basic/routedDialog', { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  await expect(
    page.getByRole('heading', { name: 'Routed Dialog Manual Validation', exact: true }),
  ).toBeVisible();
  const browserUrl = page.url();
  await expect(
    page
      .getByRole('heading', { name: 'Main route sentinel', exact: true })
      .locator('..')
      .getByText(browserUrl, { exact: true }),
  ).toBeVisible();
  return { browserUrl, consoleErrors, pageErrors };
}

test(
  'ATP-BASIC-ROUTED-DIALOG-01: a local memory router navigates without changing the browser route',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const { browserUrl, consoleErrors, pageErrors } = await openDemo(page);

    await page.getByRole('button', { name: 'Open A', exact: true }).click();
    const dialogA = dialogByTitle(page, 'A');
    await expect(dialogA).toHaveCount(1);
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expectRoutePath(dialogA, '/demo/basic/routedDialogEntry');
    await expectRouteValue(dialogA, '$query.dialog', 'A', 'string');
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-entry', 'string');
    await expectRouteValue(dialogA, '$query.via', 'open', 'string');
    await expectRouteValue(dialogA, '$query.step', '0', 'number');
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);
    await expectNoDialogLayout(dialogA);
    expect(page.url()).toBe(browserUrl);

    const entryTop = await getDialogTop(dialogA);
    await dialogA.getByRole('button', { name: 'Local push to detail', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expectDialogTop(dialogA, entryTop);
    await expectRoutePath(dialogA, '/demo/basic/routedDialogDetail/1');
    await expectRouteValue(dialogA, '$params.id', '1', 'number');
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-entry-push', 'string');
    await expectRouteValue(dialogA, '$query.via', 'page-push', 'string');
    await expectRouteValue(dialogA, '$query.step', '1', 'number');
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
    expect(page.url()).toBe(browserUrl);

    await dialogA.getByRole('button', { name: 'Local replace next detail', exact: true }).click();
    await expectRoutePath(dialogA, '/demo/basic/routedDialogDetail/11');
    await expectRouteValue(dialogA, '$params.id', '11', 'number');
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-entry-push-replace', 'string');
    await expectRouteValue(dialogA, '$query.via', 'detail-replace', 'string');
    await expectRouteValue(dialogA, '$query.step', '11', 'number');
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
    expect(page.url()).toBe(browserUrl);

    await dialogA.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-entry', 'string');
    expect(page.url()).toBe(browserUrl);

    await dialogA.getByRole('button', { name: 'Local push to detail', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
    await dialogA.getByRole('button', { name: 'Local router.back', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(page.url()).toBe(browserUrl);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(await getHydrationWarningProbe(page)).toEqual([]);
  },
);

test(
  'ATP-BASIC-ROUTED-DIALOG-02: routed-dialog handles push and replace locally',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const { browserUrl, consoleErrors, pageErrors } = await openDemo(page);
    const dialogA = dialogByTitle(page, 'A');

    await page.getByRole('button', { name: 'Open A with handle.push', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expectRoutePath(dialogA, '/demo/basic/routedDialogDetail/101');
    await expectRouteValue(dialogA, '$params.id', '101', 'number');
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-handle-push', 'string');
    await expectRouteValue(dialogA, '$query.via', 'handle-push', 'string');
    await expectRouteValue(dialogA, '$query.step', '1', 'number');
    await expect(page.getByText('A: handle.push', { exact: true })).toBeVisible();
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
    const handlePushTop = await getDialogTop(dialogA);
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(page.url()).toBe(browserUrl);

    await page.getByRole('button', { name: 'Open A with handle.replace', exact: true }).click();
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expectRoutePath(dialogA, '/demo/basic/routedDialogDetail/202');
    await expectRouteValue(dialogA, '$params.id', '202', 'number');
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-handle-replace', 'string');
    await expectRouteValue(dialogA, '$query.via', 'handle-replace', 'string');
    await expectRouteValue(dialogA, '$query.step', '2', 'number');
    await expect(page.getByText('A: handle.replace', { exact: true })).toBeVisible();
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);
    await expectDialogTop(dialogA, handlePushTop);
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(page.url()).toBe(browserUrl);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(await getHydrationWarningProbe(page)).toEqual([]);
  },
);

test(
  'ATP-BASIC-ROUTED-DIALOG-04: routed dialogs apply responsive and scalar maximum widths',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    const { browserUrl, consoleErrors, pageErrors } = await openDemo(page);
    const dialogA = dialogByTitle(page, 'A');

    await page.getByRole('button', { name: 'Open A', exact: true }).click();
    await expect(dialogA).toHaveCount(1);
    await expectDialogMaxWidth(dialogA, '640px');
    await expectDialogTop(dialogA, 16);

    await page.setViewportSize({ width: 900, height: 900 });
    await expectDialogMaxWidth(dialogA, '768px');
    await expectDialogTop(dialogA, 32);

    await page.setViewportSize({ width: 1100, height: 900 });
    await expectDialogMaxWidth(dialogA, '1024px');
    await expectDialogTop(dialogA, 48);
    await expectNoDialogLayout(dialogA);
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);

    await page.getByRole('button', { name: 'Open A (720px width)', exact: true }).click();
    await expect(dialogA).toHaveCount(1);
    await expectDialogMaxWidth(dialogA, '720px');
    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);

    await page.setViewportSize({ width: 900, height: 900 });
    await page.getByRole('button', { name: 'Open A (md 800px width)', exact: true }).click();
    await expect(dialogA).toHaveCount(1);
    await expectDialogMaxWidth(dialogA, '800px');
    await expectDialogTop(dialogA, 32);
    await page.setViewportSize({ width: 700, height: 900 });
    await expectDialogMaxWidth(dialogA, '640px');
    await expectDialogTop(dialogA, 16);
    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);

    await page.setViewportSize({ width: 900, height: 900 });
    await page.getByRole('button', { name: 'Open A (80px top gutter)', exact: true }).click();
    await expect(dialogA).toHaveCount(1);
    await expectDialogTop(dialogA, 80);
    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);

    await page.getByRole('button', { name: 'Open A (md 64px top gutter)', exact: true }).click();
    await expect(dialogA).toHaveCount(1);
    await expectDialogTop(dialogA, 64);
    await page.setViewportSize({ width: 700, height: 900 });
    await expectDialogTop(dialogA, 16);
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(await getHydrationWarningProbe(page)).toEqual([]);
  },
);

test(
  'ATP-BASIC-ROUTED-DIALOG-03: concurrent dialogs keep isolated routes and close last-opened first',
  { tag: ['@web', '@flow'] },
  async ({ page }) => {
    const { browserUrl, consoleErrors, pageErrors } = await openDemo(page);

    await page.getByRole('button', { name: 'Open A and B', exact: true }).click();
    const dialogA = dialogByTitle(page, 'A');
    const dialogB = dialogByTitle(page, 'B');
    await expect(dialogA).toHaveCount(1);
    await expect(dialogB).toHaveCount(1);
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expect(
      dialogB.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-entry', 'string');
    await expectRouteValue(dialogB, '$query.token', 'dialog-b-entry', 'string');
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);
    await expect(dialogB.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);

    await dialogB.getByRole('button', { name: 'Local push to detail', exact: true }).click();
    await expect(
      dialogB.getByRole('heading', { name: 'Routed Dialog Detail', exact: true }),
    ).toBeVisible();
    await expectRoutePath(dialogB, '/demo/basic/routedDialogDetail/1');
    await expectRouteValue(dialogB, '$query.token', 'dialog-b-entry-push', 'string');
    await expect(dialogB.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
    await expect(dialogA.getByRole('button', { name: 'Back', exact: true })).toHaveCount(0);
    await expect(
      dialogA.getByRole('heading', { name: 'Routed Dialog Entry', exact: true }),
    ).toBeVisible();
    await expectRouteValue(dialogA, '$query.token', 'dialog-a-entry', 'string');
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogB).toHaveCount(0);
    await expect(dialogA).toHaveCount(1);
    expect(page.url()).toBe(browserUrl);

    await page.keyboard.press('Escape');
    await expect(dialogA).toHaveCount(0);
    expect(page.url()).toBe(browserUrl);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(await getHydrationWarningProbe(page)).toEqual([]);
  },
);
