import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

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
    if (message.type() === 'error' || /hydration mismatch/i.test(message.text())) {
      errors.push(message.text());
    }
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

test(
  'Commerce Product Content: SSR renders stored safe HTML and hydrates without errors',
  { tag: ['@web', '@flow', '@product'] },
  async ({ browser }, testInfo) => {
    test.setTimeout(60_000);
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const categoryName = `E2E Product Content Web Category ${suffix}`;
    const productTitle = `E2E Product Content Web ${suffix}`;
    const skuCode = `E2E-PC-WEB-${suffix}`;
    const markdown = `# Product details ${suffix}\n\nA **durable** product.\n\n- [ ] Open task\n- [x] Completed task`;
    const unsafeHtml = '<a href="javascript:alert(\'unsafe\')">unsafe</a>';
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const webContext = await browser.newContext();
    const webPage = await webContext.newPage();
    const webPageErrors = collectPageErrors(webPage);
    const webConsoleErrors = collectConsoleErrors(webPage);
    const categoryActionPath = '/api/commerce/catalog/category';
    const productActionPath = '/api/commerce/catalog/product';
    const skuActionPath = '/api/commerce/catalog/sku';
    const stockAdjustPath = '/api/commerce/trade/stockBalance/adjustStock';
    let categoryId: number | string | undefined;
    let productId: number | string | undefined;
    let skuId: number | string | undefined;
    let headers: { Authorization: string } | undefined;
    try {
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
        data: {
          categoryId,
          title: productTitle,
          published: true,
          productContentForm: {
            descriptionMarkdown: `${markdown}\n\n${unsafeHtml}`,
          },
        },
        headers,
      });
      expect(productResponse.ok()).toBeTruthy();
      productId = (await productResponse.json()).data;
      expectTableIdentity(productId);

      const skuResponse = await adminPage.request.post(skuActionPath, {
        data: { code: skuCode, productId, priceCents: 1999, lifecycle: 'active' },
        headers,
      });
      expect(skuResponse.ok()).toBeTruthy();
      skuId = (await skuResponse.json()).data;
      expectTableIdentity(skuId);

      const stockResponse = await adminPage.request.post(stockAdjustPath, {
        data: {
          skuId,
          delta: 1,
          reason: 'Product content SSR E2E fixture',
          correlationId: `product-content-web-${suffix}`,
        },
        headers,
      });
      expect(stockResponse.ok()).toBeTruthy();

      const productPath = `/commerce/product/${productId}`;
      const ssrResponse = await webPage.request.get(productPath);
      expect(ssrResponse.ok()).toBeTruthy();
      const ssrHtml = await ssrResponse.text();
      expect(ssrHtml.toLowerCase()).not.toContain('data-zova-hydrated');
      expect(ssrHtml).toContain(`<h1>Product details ${suffix}</h1>`);
      expect(ssrHtml).toContain('<strong>durable</strong>');
      expect(ssrHtml).toContain('<ul data-type="taskList">');
      expect(ssrHtml).toContain('<input type="checkbox" disabled="disabled" />');
      expect(ssrHtml).toContain('<input type="checkbox" checked="checked" disabled="disabled" />');
      expect(ssrHtml).not.toMatch(/<a[^>]+javascript:/i);

      const documentResponse = await webPage.goto(productPath, { waitUntil: 'load' });
      expect(documentResponse?.ok()).toBeTruthy();
      await expect(webPage.locator('html')).toHaveAttribute('data-zova-hydrated', 'commerce');
      await expect(webPage.getByRole('heading', { name: productTitle })).toBeVisible();
      await expect(webPage.locator('.product-description h1')).toHaveText(
        `Product details ${suffix}`,
      );
      await expect(webPage.locator('.product-description strong')).toHaveText('durable');
      const description = webPage.locator('.product-description');
      await expect(description).not.toHaveClass(/\bprose\b/);
      await expect(description.locator('ul[data-type="taskList"]')).toHaveCount(1);
      await expect(description.locator('input[type="checkbox"]')).toHaveCount(2);
      await expect(description.locator('input[type="checkbox"]').nth(0)).not.toBeChecked();
      await expect(description.locator('input[type="checkbox"]').nth(0)).toBeDisabled();
      await expect(description.locator('input[type="checkbox"]').nth(1)).toBeChecked();
      await expect(description.locator('input[type="checkbox"]').nth(1)).toBeDisabled();
      expect(webPageErrors).toEqual([]);
      expect(webConsoleErrors).toEqual([]);
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
      await webContext.close().catch(() => {});
      await adminContext.close().catch(() => {});
    }
  },
);

test(
  'ATP-SPC-02: Product Content opens the rich-text editor and saves Markdown',
  { tag: ['@admin', '@flow', '@product'] },
  async ({ browser }, testInfo) => {
    test.setTimeout(60_000);
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const categoryName = `E2E Product Content Category ${suffix}`;
    const productTitle = `E2E Product Content ${suffix}`;
    const markdown = `# Product content ${suffix}

- First benefit
- Second benefit

- [ ] Open task
- [x] Completed task

> Product quote

\`\`\`ts
const product = '${suffix}';
\`\`\`

==highlighted text==


| Feature  | Value   |
| -------- | ------- |
| Material | Durable |`;
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPageErrors = collectPageErrors(adminPage);
    const adminConsoleErrors = collectConsoleErrors(adminPage);
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
        data: { name: categoryName, published: false },
        headers,
      });
      expect(categoryResponse.ok()).toBeTruthy();
      categoryId = (await categoryResponse.json()).data;
      expectTableIdentity(categoryId);

      const productResponse = await adminPage.request.post(productActionPath, {
        data: {
          categoryId,
          title: productTitle,
          published: false,
          productContentForm: { descriptionMarkdown: markdown },
        },
        headers,
      });
      expect(productResponse.ok()).toBeTruthy();
      productId = (await productResponse.json()).data;
      expectTableIdentity(productId);

      await adminPage.goto(`${productListPath}/${productId}/edit`, { waitUntil: 'load' });
      await expect(adminPage.locator('html')).toHaveAttribute(
        'data-zova-hydrated',
        'commerceAdmin',
      );
      expect(adminPageErrors).toEqual([]);
      expect(adminConsoleErrors).toEqual([]);
      const editor = adminPage.locator('[contenteditable="true"]');
      await expect(editor).toBeVisible();
      const toolbar = adminPage.getByRole('toolbar', { name: 'Markdown toolbar' });
      await expect(toolbar).toBeVisible();
      const undoButton = toolbar.getByRole('button', { name: 'Undo' });
      await expect(toolbar.getByRole('combobox', { name: 'Code block language' })).toHaveCount(0);
      const codeBlockToolbar = adminPage.getByRole('toolbar', { name: 'Code block language' });
      await expect(codeBlockToolbar).toBeHidden();
      await expect(toolbar.getByRole('button', { name: 'Bold' })).toHaveAttribute('type', 'button');
      await expect(undoButton).toBeEnabled();
      const insertTableButton = toolbar.getByRole('button', { name: 'Insert table' });
      await expect(insertTableButton).toHaveAttribute('type', 'button');
      await expect(insertTableButton).toHaveAttribute('aria-haspopup', 'grid');
      await expect(insertTableButton).toHaveAttribute('aria-expanded', 'false');
      await insertTableButton.click();
      const tablePickerDialog = adminPage.locator('#markdown-table-size-picker');
      const tablePicker = tablePickerDialog.locator('[role="grid"]');
      await expect(tablePickerDialog).toBeVisible();
      await expect(tablePicker).toHaveCount(1);
      await expect(insertTableButton).toHaveAttribute('aria-expanded', 'true');
      await expect(editor.locator('table')).toHaveCount(1);
      const tablePickerCell = tablePicker.locator('[data-table-picker-cell="2-3"]');
      await tablePickerCell.hover();
      await expect(tablePickerDialog.locator('[aria-live="polite"]')).toHaveText(
        'Selected table size: 2 × 3',
      );
      await expect(tablePicker.locator('[aria-selected="true"]')).toHaveCount(6);
      await expect(tablePicker.locator('[aria-selected="false"]').first()).toBeVisible();
      await tablePickerCell.click();
      await expect(tablePickerDialog).toHaveCount(0);
      await expect(insertTableButton).toHaveAttribute('aria-expanded', 'false');
      await expect(editor.locator('table')).toHaveCount(2);
      await expect(editor.locator('table').last().locator('th')).toHaveCount(3);
      await expect(editor.locator('table').last().locator('td')).toHaveCount(3);
      const editorSurface = editor.locator('..');
      await editor.locator('h1').click();
      await expect(editorSurface).not.toHaveClass(/\bprose\b/);
      const editorSurfaceClass = await editorSurface.getAttribute('class');
      expect(editorSurfaceClass?.trim()).toBeTruthy();
      await expect(editor).toBeFocused();
      await expect(editor.locator('h1')).toHaveText(`Product content ${suffix}`);
      await expect(editor.locator('ul:not([data-type="taskList"])')).toHaveCount(1);
      await expect(editor.locator('blockquote')).toHaveText('Product quote');
      const codeBlock = editor.locator('pre code');
      const codeBlockLanguage = codeBlockToolbar.getByRole('combobox', {
        name: 'Code block language',
      });
      await expect(codeBlockToolbar).toBeHidden();
      await expect(codeBlock).toHaveClass(/\blanguage-ts\b/);
      await expect(codeBlock).toHaveText(`const product = '${suffix}';`);
      await expect(codeBlock.locator('span[class*="hljs-"]')).not.toHaveCount(0);
      await codeBlock.click();
      await expect(codeBlockToolbar).toBeVisible();
      await expect(codeBlockLanguage).toBeEnabled();
      await expect(codeBlockLanguage).toHaveValue('typescript');
      await codeBlockLanguage.selectOption('python');
      await expect(codeBlock).toHaveClass(/\blanguage-python\b/);
      await expect(codeBlock.locator('span[class*="hljs-"]')).not.toHaveCount(0);
      await editor.locator('h1').click();
      await expect(codeBlockToolbar).toBeHidden();
      await expect(editor.locator('mark')).toHaveText('highlighted text');
      await expect(editor.locator('table th')).toHaveCount(5);
      await expect(editor.locator('table td')).toHaveCount(5);
      await expect(editor.locator('h1')).toHaveCSS('font-weight', '700');
      await expect(editor.locator('ul:not([data-type="taskList"])')).toHaveCSS(
        'list-style-type',
        'disc',
      );
      await expect(editor.locator('ul[data-type="taskList"]')).toHaveCount(1);
      await expect(editor.locator('input[type="checkbox"]')).toHaveCount(2);
      await expect(editor.locator('input[type="checkbox"]').nth(0)).not.toBeChecked();
      await expect(editor.locator('input[type="checkbox"]').nth(1)).toBeChecked();
      await expect(editor.locator('blockquote')).toHaveCSS('border-left-width', '4px');
      await expect(editor.locator('pre')).toHaveCSS('overflow-x', 'auto');
      await expect(editor.locator('table th').first()).toHaveCSS('font-weight', '600');
      await editor.locator('h1').selectText();
      const boldButton = toolbar.getByRole('button', { name: 'Bold' });
      await boldButton.click();
      await expect(boldButton).toHaveAttribute('aria-pressed', 'true');
      await undoButton.click();
      await expect(boldButton).toHaveAttribute('aria-pressed', 'false');
      await expect(toolbar.getByRole('button', { name: 'Redo' })).toBeEnabled();

      const tableToolbar = adminPage.getByRole('toolbar', { name: 'Table toolbar' });
      const insertedTable = editor.locator('table').last();
      await editor.locator('h1').click();
      await expect(tableToolbar).toBeHidden();
      await insertedTable.locator('td').first().click();
      expect(adminPageErrors).toEqual([]);
      expect(adminConsoleErrors).toEqual([]);
      await expect(tableToolbar).toBeVisible();
      expect(adminPageErrors).toEqual([]);
      expect(adminConsoleErrors).toEqual([]);
      await expect(tableToolbar.getByRole('button', { name: 'Add row before' })).toHaveAttribute(
        'type',
        'button',
      );
      await tableToolbar.getByRole('button', { name: 'Add row before' }).click();
      await expect(insertedTable.locator('td')).toHaveCount(6);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Delete row' }).click();
      await expect(insertedTable.locator('td')).toHaveCount(3);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Add row after' }).click();
      await expect(insertedTable.locator('td')).toHaveCount(6);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Delete row' }).click();
      await expect(insertedTable.locator('td')).toHaveCount(3);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Add column before' }).click();
      await expect(insertedTable.locator('th')).toHaveCount(4);
      await expect(insertedTable.locator('td')).toHaveCount(4);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Delete column' }).click();
      await expect(insertedTable.locator('th')).toHaveCount(3);
      await expect(insertedTable.locator('td')).toHaveCount(3);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Add column after' }).click();
      await expect(insertedTable.locator('th')).toHaveCount(4);
      await expect(insertedTable.locator('td')).toHaveCount(4);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Delete column' }).click();
      await expect(insertedTable.locator('th')).toHaveCount(3);
      await expect(insertedTable.locator('td')).toHaveCount(3);
      expect(adminPageErrors).toEqual([]);
      await tableToolbar.getByRole('button', { name: 'Delete table' }).click();
      await expect(editor.locator('table')).toHaveCount(1);
      await expect(tableToolbar).toBeHidden();
      expect(adminPageErrors).toEqual([]);

      const productUpdate = waitForApiResponse(
        adminPage,
        'PATCH',
        `${productActionPath}/${productId}`,
      );
      await adminPage.getByRole('button', { name: 'Submit', exact: true }).click();
      await productUpdate;
      const productResponseAfterUpdate = await adminPage.request.get(
        `${productActionPath}/${productId}`,
        { headers },
      );
      expect(productResponseAfterUpdate.ok()).toBeTruthy();
      expect((await productResponseAfterUpdate.json()).productContentForm.descriptionMarkdown).toBe(
        markdown.replace('```ts', '```python'),
      );
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
  'ATP-SPC-02: Product Content link toolbar edits Markdown',
  { tag: ['@admin', '@flow', '@product'] },
  async ({ browser }, testInfo) => {
    test.setTimeout(180_000);
    const suffix = `${testInfo.workerIndex}-${testInfo.parallelIndex ?? testInfo.retry}-${Date.now()}`;
    const categoryName = `E2E Product Link Category ${suffix}`;
    const productTitle = `E2E Product Link ${suffix}`;
    const markdown = `# Product content ${suffix}\n\nA product description.`;
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminPageErrors = collectPageErrors(adminPage);
    const adminConsoleErrors = collectConsoleErrors(adminPage);
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
        data: { name: categoryName, published: false },
        headers,
      });
      expect(categoryResponse.ok()).toBeTruthy();
      categoryId = (await categoryResponse.json()).data;
      expectTableIdentity(categoryId);

      const productResponse = await adminPage.request.post(productActionPath, {
        data: {
          categoryId,
          title: productTitle,
          published: false,
          productContentForm: { descriptionMarkdown: markdown },
        },
        headers,
      });
      expect(productResponse.ok()).toBeTruthy();
      productId = (await productResponse.json()).data;
      expectTableIdentity(productId);

      await adminPage.goto(`${productListPath}/${productId}/edit`, { waitUntil: 'load' });
      await expect(adminPage.locator('html')).toHaveAttribute(
        'data-zova-hydrated',
        'commerceAdmin',
      );
      const editor = adminPage.locator('[contenteditable="true"]');
      await expect(editor).toBeVisible();
      const toolbar = adminPage.getByRole('toolbar', { name: 'Markdown toolbar' });
      await expect(toolbar).toBeVisible();
      const linkButton = toolbar.getByRole('button', { name: 'Link' });
      await expect(linkButton).toHaveAttribute('type', 'button');
      await expect(linkButton).toBeDisabled();

      await editor.locator('h1').selectText();
      await expect(linkButton).toBeEnabled();
      await linkButton.click();
      const linkPrompt = adminPage.locator('.fixed.inset-0.z-50');
      await expect(linkPrompt).toBeVisible();
      const linkInput = linkPrompt.locator('input[type="text"]');
      await linkInput.fill('https://example.com/docs');
      await linkInput.press('Enter');
      await expect(editor.locator('h1 a[href="https://example.com/docs"]')).toHaveText(
        `Product content ${suffix}`,
      );
      await expect(linkButton).toHaveAttribute('aria-pressed', 'true');
      await editor.press('ArrowLeft');
      await expect(linkButton).toHaveAttribute('aria-pressed', 'true');

      await linkButton.click();
      await expect(linkPrompt).toBeVisible();
      await expect(linkInput).toHaveValue('https://example.com/docs');
      await linkInput.fill('https://example.com/updated');
      await linkPrompt.getByRole('button', { name: 'OK' }).click();
      await expect(editor.locator('h1 a[href="https://example.com/updated"]')).toHaveText(
        `Product content ${suffix}`,
      );

      await linkButton.click();
      await expect(linkPrompt).toBeVisible();
      await linkPrompt.getByRole('button', { name: 'Cancel' }).click();
      await expect(editor.locator('h1 a[href="https://example.com/updated"]')).toHaveText(
        `Product content ${suffix}`,
      );

      await editor.locator('h1').selectText();
      await expect(linkButton).toHaveAttribute('aria-pressed', 'true');
      await linkButton.click();
      await expect(linkPrompt).toBeVisible();
      await linkInput.fill('');
      await linkInput.press('Enter');
      await expect(editor.locator('h1 a')).toHaveCount(0);
      await adminPage.getByRole('button', { name: 'Submit', exact: true }).click();
      const productResponseAfterLinkRemoval = await adminPage.request.get(
        `${productActionPath}/${productId}`,
        { headers },
      );
      expect(productResponseAfterLinkRemoval.ok()).toBeTruthy();
      expect(
        (await productResponseAfterLinkRemoval.json()).productContentForm.descriptionMarkdown,
      ).not.toContain('https://example.com/updated');
      expect(adminPageErrors).toEqual([]);
      expect(adminConsoleErrors).toEqual([]);
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
