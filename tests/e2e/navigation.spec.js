const { test, expect } = require('@playwright/test');

const publicRoutes = [
  { path: '/',              title: /orbito/i },
  { path: '/tours',         title: /tours/i },
  { path: '/attractions',   title: /attractions/i },
  { path: '/destinations',  title: /destinations/i },
  { path: '/tour-guides',   title: /tour guides/i },
  { path: '/about',         title: /about/i },
  { path: '/help',          title: /help/i },
  { path: '/contact',       title: /contact/i },
  { path: '/privacy',       title: /privacy/i },
  { path: '/terms',         title: /terms/i },
];

test.describe('Public page routing', () => {
  for (const { path, title } of publicRoutes) {
    test(`${path} loads without error`, async ({ page }) => {
      const response = await page.goto(path);
      // No 404 / 500
      expect(response?.status() ?? 200).toBeLessThan(400);
      await expect(page).toHaveTitle(title);
    });
  }
});

test.describe('Footer links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  const footer = (page) => page.getByRole('contentinfo');

  test('About link is in footer', async ({ page }) => {
    await expect(footer(page).getByRole('link', { name: /about/i })).toBeVisible();
  });

  test('Privacy link is in footer', async ({ page }) => {
    await expect(footer(page).getByRole('link', { name: /privacy/i })).toBeVisible();
  });

  test('Terms link is in footer', async ({ page }) => {
    await expect(footer(page).getByRole('link', { name: 'Terms of Service' })).toBeVisible();
  });

  test('Register as Tour Guide link is in footer', async ({ page }) => {
    await expect(footer(page).getByRole('link', { name: /register as a tour guide/i })).toBeVisible();
  });
});

test.describe('404 handling', () => {
  test('unknown route does not crash the app', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz');
    // App should still render (SPA 404 fallback)
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
