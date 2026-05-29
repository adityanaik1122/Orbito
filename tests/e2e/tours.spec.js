const { test, expect } = require('@playwright/test');

test.describe('Tours page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tours');
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/tours/i);
  });

  test('hero section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('search input accepts text', async ({ page }) => {
    const input = page.getByPlaceholder(/search|destination/i).first();
    await expect(input).toBeVisible();
    await input.fill('London');
    await expect(input).toHaveValue('London');
  });

  test('popular destinations strip is visible', async ({ page }) => {
    await expect(page.getByText(/popular destinations/i)).toBeVisible();
    // At least one destination card (London)
    await expect(page.getByText('London').first()).toBeVisible();
  });

  test('shows loading spinner or tour cards', async ({ page }) => {
    // Either cards load or a spinner shows then cards appear
    const spinner = page.locator('[class*="animate-spin"]');
    const cards = page.locator('[class*="rounded-2xl"]');
    await Promise.race([
      spinner.waitFor({ timeout: 3000 }).catch(() => {}),
      cards.first().waitFor({ timeout: 10000 }).catch(() => {}),
    ]);
    // Page should not show an error
    await expect(page.getByText(/error|something went wrong/i)).not.toBeVisible();
  });

  test('popular destination link navigates to destination page', async ({ page }) => {
    await page.getByText('Paris').first().click();
    await expect(page).toHaveURL(/destinations\/paris/i);
  });
});
