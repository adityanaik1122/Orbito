const { test, expect } = require('@playwright/test');

test.describe('Checkout page', () => {
  test('visiting /checkout without auth redirects to login', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login/i);
  });

  test('login page is shown when accessing /checkout unauthenticated', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByRole('tab', { name: /login/i })).toBeVisible();
  });
});
