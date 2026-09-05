import { expect, test } from '@playwright/test';

const repositories = [
  {
    text: 'github.com/cabloy/cabloy',
    link: 'https://github.com/cabloy/cabloy',
  },
  {
    text: 'github.com/cabloy/cabloy-start',
    link: 'https://github.com/cabloy/cabloy-start',
  },
];

test('DOCS-NAV-01: GitHub icon menu exposes both repository links on desktop', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();

  const trigger = page.getByRole('button', { name: 'GitHub repositories' });
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).not.toHaveText(/GitHub/);

  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const menu = page.getByRole('menu', { name: 'GitHub repositories' });
  await expect(menu).toBeVisible();
  for (const repository of repositories) {
    const link = menu.getByRole('menuitem', { name: repository.text, exact: true });
    await expect(link).toHaveAttribute('href', repository.link);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }

  await expect(
    menu.getByRole('menuitem', { name: repositories[0].text, exact: true }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    menu.getByRole('menuitem', { name: repositories[1].text, exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(menu).toBeVisible();
  await page.mouse.click(10, 200);
  await expect(menu).toHaveCount(0);
});

test('DOCS-NAV-02: GitHub repositories remain readable in mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const response = await page.goto('/', { waitUntil: 'load' });
  expect(response?.ok()).toBeTruthy();

  await page.locator('.VPNavBarHamburger').click();

  const screenMenu = page.locator('.VPNavScreen .cabloy-github-repositories--screen');
  await expect(screenMenu).toBeVisible();
  await expect(screenMenu.getByText('GitHub repositories')).toBeVisible();
  for (const repository of repositories) {
    const link = screenMenu.getByRole('link', { name: repository.text, exact: true });
    await expect(link).toHaveAttribute('href', repository.link);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});
