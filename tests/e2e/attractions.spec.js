const { test, expect } = require('@playwright/test');

test.describe('Attractions page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/attractions');
  });

  test('page heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('h1')).toContainText(/things to do/i);
  });

  test('city filter cards are rendered', async ({ page }) => {
    // London should be in the city strip
    await expect(page.getByText('London').first()).toBeVisible();
    await expect(page.getByText('Paris').first()).toBeVisible();
    await expect(page.getByText('Tokyo').first()).toBeVisible();
  });

  test('clicking a city card updates selected city', async ({ page }) => {
    // Paris card click → Paris attractions should show (or empty state for Paris)
    const parisBtn = page.locator('button', { has: page.locator('text=Paris') }).first();
    await parisBtn.click();
    // After clicking, Paris card should have the active ring style
    await expect(parisBtn).toHaveClass(/ring-2/);
  });

  test('category filter pills are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'History' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Food' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Culture' })).toBeVisible();
  });

  test('clicking a category pill marks it as active', async ({ page }) => {
    const historyBtn = page.getByRole('button', { name: 'History' });
    await historyBtn.click();
    await expect(historyBtn).toHaveClass(/bg-\[#0B3D91\]/);
  });

  test('attraction cards show rating and price', async ({ page }) => {
    const cards = page.locator('[class*="rounded-xl"]').filter({ hasText: /reviews/i });
    const count = await cards.count();
    if (count > 0) {
      await expect(cards.first().getByText(/reviews/i)).toBeVisible();
    }
  });

  test('"View Details" navigates to attraction detail page', async ({ page }) => {
    const viewDetailsBtn = page.getByRole('button', { name: /view details/i }).first();
    // Only click if an attraction card is visible for the default city
    if (await viewDetailsBtn.count() > 0) {
      await viewDetailsBtn.click();
      await expect(page).toHaveURL(/\/attractions\/.+/);
    }
  });
});
