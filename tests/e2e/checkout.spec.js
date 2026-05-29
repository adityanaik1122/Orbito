const { test, expect } = require('@playwright/test');

test.describe('Checkout page', () => {
  test('visiting /checkout without session shows redirect message', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByText(/no checkout session found/i)).toBeVisible();
    await expect(page.getByText(/redirecting/i)).toBeVisible();
  });

  test('redirects away from /checkout after a few seconds', async ({ page }) => {
    await page.goto('/checkout');
    // Should redirect to /tours within ~4 seconds
    await page.waitForURL(/\/tours/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/tours/);
  });
});
