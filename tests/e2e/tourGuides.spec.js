const { test, expect } = require('@playwright/test');

test.describe('Tour Guides public listing', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/tour-guides');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('specialty filter pills are visible', async ({ page }) => {
    await page.goto('/tour-guides');
    await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible();
  });

  test('CTA to register is visible', async ({ page }) => {
    await page.goto('/tour-guides');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole('link', { name: /register|become a guide/i })).toBeVisible();
  });
});

test.describe('Tour Guide registration form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tour-guides/register');
  });

  test('registration form fields are visible', async ({ page }) => {
    // Labels use plain <label> without htmlFor — locate by placeholder
    await expect(page.getByPlaceholder('Jane Smith')).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Min 6 characters')).toBeVisible();
  });

  test('submitting empty form shows validation errors', async ({ page }) => {
    await page.getByRole('button', { name: /register|submit/i }).click();
    // Custom error messages appear as red text below each field
    await expect(page.getByText('Required').first()).toBeVisible({ timeout: 5000 });
  });

  test('password mismatch shows error', async ({ page }) => {
    await page.getByPlaceholder('Jane Smith').fill('Test Guide');
    await page.getByPlaceholder('you@example.com').fill('test@example.com');
    await page.getByPlaceholder('Min 6 characters').fill('password123');
    await page.getByPlaceholder('Repeat password').fill('different456');
    // Scroll to submit button (form is long)
    await page.getByRole('button', { name: /register|submit/i }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /register|submit/i }).click();
    await expect(page.getByText('Passwords do not match')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Tour Guide login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tour-guides/login');
  });

  test('login form is visible', async ({ page }) => {
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Your password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('invalid credentials shows toast error', async ({ page }) => {
    await page.getByPlaceholder('you@example.com').fill('notauser@example.com');
    await page.getByPlaceholder('Your password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Error is shown as a toast notification
    await expect(page.getByText(/sign in failed/i)).toBeVisible({ timeout: 15000 });
  });

  test('link to registration page works', async ({ page }) => {
    // The link text is "Register here" — be specific to avoid matching footer links
    await page.getByRole('link', { name: 'Register here' }).click();
    await expect(page).toHaveURL(/tour-guides\/register/i);
  });
});
