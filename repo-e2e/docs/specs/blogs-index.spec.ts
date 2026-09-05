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

interface IArticleGeometry {
  aside: IRectangle;
  container: IRectangle;
  content: IRectangle;
  contentContainer: IRectangle;
  body: IRectangle;
}

const blogArticlePaths = [
  '/blogs/ai-react-nextjs-enterprise-architecture-cabloy/',
  '/blogs/cabloy-fullstack-resource-addressing/',
  '/blogs/nextjs-integrated-fullstack-cabloy-contract-loop/',
  '/blogs/vue-object-oriented-zova-beginner-mental-model/',
];

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

function getArticleGeometry(page: Page) {
  return page.locator('.VPDoc').evaluate(doc => {
    const getRequiredChild = (parent: Element, selector: string) => {
      const element = parent.querySelector(`:scope > ${selector}`);
      if (!element) throw new Error(`Could not find ${selector}`);
      return element;
    };
    const toRectangle = (element: Element) => {
      const { bottom, height, left, right, top, width } = element.getBoundingClientRect();
      return { bottom, height, left, right, top, width };
    };
    const container = getRequiredChild(doc, '.container');
    const aside = getRequiredChild(container, '.aside');
    const content = getRequiredChild(container, '.content');
    const contentContainer = getRequiredChild(content, '.content-container');
    const body = getRequiredChild(contentContainer, '.main').querySelector('.vp-doc');
    if (!body) throw new Error('Could not find .vp-doc');
    return {
      aside: toRectangle(aside),
      container: toRectangle(container),
      content: toRectangle(content),
      contentContainer: toRectangle(contentContainer),
      body: toRectangle(body),
    };
  }) as Promise<IArticleGeometry>;
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

test(
  'DOCS-BLOGS-02: Blog articles use a wide desktop body with an outline aside',
  { tag: '@layout' },
  async ({ page }) => {
    const pageErrors = collectPageErrors(page);
    const consoleErrors = collectConsoleErrors(page);

    for (const path of blogArticlePaths) {
      const documentResponse = await page.goto(path, { waitUntil: 'load' });
      expect(documentResponse?.ok()).toBeTruthy();

      await expect(page.locator('.Layout.cabloy-blogs-article')).toBeVisible();
      await expect(page.locator('.VPDoc.has-sidebar')).toHaveCount(0);
      await expect(page.locator('.VPDoc.has-aside')).toHaveCount(1);
      await expect(page.locator('.aside')).toBeVisible();

      const geometry = await getArticleGeometry(page);
      expect(geometry.container.width).toBeCloseTo(1216, 0);
      expect(geometry.content.width).toBeCloseTo(960, 0);
      expect(geometry.contentContainer.width).toBeCloseTo(896, 0);
      expect(geometry.body.width).toBeCloseTo(896, 0);
      expect(geometry.aside.left).toBeGreaterThanOrEqual(geometry.content.right - 1);
      expect(geometry.aside.right).toBeLessThanOrEqual(geometry.container.right + 1);
      await expect.poll(() => getDocumentHorizontalOverflow(page)).toBeLessThanOrEqual(1);
    }

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  },
);
