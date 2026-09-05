import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

interface IRectangle {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}

interface IBlogsGeometry {
  cards: IRectangle[];
  grid: IRectangle & { display: string };
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
    if (message.type() === 'error' || /hydration mismatch/i.test(text)) {
      errors.push(text);
    }
  });
  return errors;
}

function getDocumentHorizontalOverflow(page: Page) {
  return page.evaluate(() => {
    return (
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
    );
  });
}

function getBlogsGeometry(page: Page) {
  return page.locator('.cabloy-blog-grid').evaluate(grid => {
    const toRectangle = (element: Element) => {
      const { bottom, height, left, right, top, width } = element.getBoundingClientRect();
      return { bottom, height, left, right, top, width };
    };
    const cards = Array.from(grid.querySelectorAll('.cabloy-blog-card'), toRectangle);
    return {
      grid: {
        ...toRectangle(grid),
        display: getComputedStyle(grid).display,
      },
      cards,
    };
  }) as Promise<IBlogsGeometry>;
}

test(
  'DOCS-BLOGS-01: Blogs index uses a wide desktop card grid',
  { tag: '@layout' },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);

    const documentResponse = await page.goto('/blogs/', { waitUntil: 'load' });
    expect(documentResponse?.ok()).toBeTruthy();

    await expect(page.locator('.Layout.cabloy-blogs-index')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Blogs', level: 1 })).toBeVisible();
    await expect(page.locator('.VPDoc.has-sidebar')).toHaveCount(0);
    await expect(page.locator('.VPDoc.has-aside')).toHaveCount(0);

    const cards = page.locator('.cabloy-blog-card');
    await expect(cards).toHaveCount(4);
    for (let index = 0; index < 4; index++) {
      await expect(cards.nth(index)).toBeVisible();
      await expect(cards.nth(index).locator('.cabloy-blog-card__cover img')).toBeVisible();
    }

    const geometry = await getBlogsGeometry(page);
    expect(geometry.grid.display).toBe('grid');
    expect(geometry.cards).toHaveLength(4);

    const [firstCard, ...remainingCards] = geometry.cards;
    expect(firstCard.width).toBeGreaterThanOrEqual(279);
    for (const card of remainingCards) {
      expect(Math.abs(card.top - firstCard.top)).toBeLessThanOrEqual(1);
      expect(Math.abs(card.width - firstCard.width)).toBeLessThanOrEqual(1);
      expect(card.left).toBeGreaterThan(firstCard.left);
      expect(card.left).toBeGreaterThanOrEqual(geometry.grid.left - 1);
      expect(card.right).toBeLessThanOrEqual(geometry.grid.right + 1);
      expect(card.right).toBeLessThanOrEqual(1441);
    }
    expect(firstCard.left).toBeGreaterThanOrEqual(geometry.grid.left - 1);
    expect(firstCard.right).toBeLessThanOrEqual(geometry.grid.right + 1);
    expect(firstCard.right).toBeLessThanOrEqual(1441);

    await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);
