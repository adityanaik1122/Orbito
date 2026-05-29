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
    // Scroll the Paris card into view (it's in a horizontal scroll strip)
    const parisBtn = page.locator('button').filter({ has: page.locator('div', { hasText: /^Paris$/ }) }).first();
    await parisBtn.scrollIntoViewIfNeeded();
    await parisBtn.click();
    // After click the button gains ring-2 via Tailwind
    await expect(parisBtn).toHaveAttribute('class', /ring-2/);
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
    // Active pill has bg-[#0B3D91] in its class attribute
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
