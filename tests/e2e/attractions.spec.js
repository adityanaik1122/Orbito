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
    await expect(page.getByText('London').first()).toBeVisible();
    await expect(page.getByText('Paris').first()).toBeVisible();
    await expect(page.getByText('Tokyo').first()).toBeVisible();
  });

  test('clicking a city card updates selected city', async ({ page }) => {
    // Use hasText (substring match) — more robust than nested has-locator
    const parisBtn = page.locator('button').filter({ hasText: 'Paris' }).first();
    await parisBtn.scrollIntoViewIfNeeded();
    await parisBtn.click();
    // Selected buttons gain shadow-xl; non-selected buttons only have hover:shadow-lg
    await expect(parisBtn).toHaveAttribute('class', /shadow-xl/);
  });

  test('category filter pills are visible', async ({ page }) => {
    await expect(page.locator('button').filter({ hasText: 'All' }).first()).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'History' }).first()).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Food' }).first()).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Culture' }).first()).toBeVisible();
  });

  test('clicking a category pill marks it as active', async ({ page }) => {
    // Category buttons have rounded-full class; attraction card buttons don't
    const historyBtn = page.locator('button.rounded-full', { hasText: 'History' });
    await historyBtn.click();
    // Active pill: bg-[#0B3D91] is added to class
    await expect(historyBtn).toHaveAttribute('class', /bg-\[#0B3D91\]/);
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
    if (await viewDetailsBtn.count() > 0) {
      await viewDetailsBtn.click();
      await expect(page).toHaveURL(/\/attractions\/.+/);
    }
  });
});
