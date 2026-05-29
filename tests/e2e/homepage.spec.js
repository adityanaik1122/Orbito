const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('h1')).toContainText(/plan|trip|itinerary/i);
  });

  test('hero search input is visible and accepts text', async ({ page }) => {
    const input = page.getByPlaceholder(/tokyo|destination|trip/i).first();
    await expect(input).toBeVisible();
    await input.fill('5 days in Paris');
    await expect(input).toHaveValue('5 days in Paris');
  });

  test('EXAMPLE OUTPUT section with 3 day cards is visible', async ({ page }) => {
    await page.getByText(/example output/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/this is what you'll get/i)).toBeVisible();
    const dayCards = page.locator('text=Day 1, text=Day 2, text=Day 3');
    await expect(page.getByText('Day 1')).toBeVisible();
    await expect(page.getByText('Day 2')).toBeVisible();
    await expect(page.getByText('Day 3')).toBeVisible();
  });

  test('"Generate my Tokyo itinerary" button is visible', async ({ page }) => {
    const btn = page.getByRole('button', { name: /generate my tokyo itinerary/i });
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toBeVisible();
  });

  test('navigation bar contains key links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /tours/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /attractions/i }).first()).toBeVisible();
  });

  test('footer is present with copyright text', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/orbito/i).last()).toBeVisible();
    await expect(page.getByText(/all rights reserved/i)).toBeVisible();
  });

  test('page title is set correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/orbito/i);
  });
});
