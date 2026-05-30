const { test, expect } = require('@playwright/test');

test.describe('Tour Guides public listing', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/tour-guides');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('specialty filter pills are visible', async ({ page }) => {
    await page.goto('/tour-guides');
    await expect(page.locator('button').filter({ hasText: 'All' }).first()).toBeVisible();
  });

  test('CTA to register is visible', async ({ page }) => {
    await page.goto('/tour-guides');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole('main').getByRole('link', { name: /register|become a guide/i })).toBeVisible();
  });
});

test.describe('Tour Guide registration form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tour-guides/register');
  });

  test('registration form fields are visible', async ({ page }) => {
    await expect(page.getByPlaceholder('Jane Smith')).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Min 6 characters')).toBeVisible();
  });

  test('submitting empty form shows validation errors', async ({ page }) => {
    // Scroll to the submit button (form is long) then click
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    // Validation runs synchronously — "Required" error messages appear
    await expect(page.getByText('Required').first()).toBeVisible();
  });

  test('password mismatch shows error', async ({ page }) => {
    await page.getByPlaceholder('Jane Smith').fill('Test Guide');
    await page.getByPlaceholder('you@example.com').fill('test@example.com');
    await page.getByPlaceholder('Min 6 characters').fill('password123');
    await page.getByPlaceholder('Repeat password').fill('different456');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
});

test.describe('Tour Guide login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tour-guides/login');
  });

  test('login form is visible', async ({ page }) => {
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Your password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('invalid credentials shows toast error', async ({ page }) => {
    await page.getByPlaceholder('you@example.com').fill('notauser@example.com');
    await page.getByPlaceholder('Your password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    // Toast has title "Sign in failed" — give Supabase up to 20s to respond
    await expect(page.getByText('Sign in failed', { exact: true })).toBeVisible({ timeout: 20000 });
  });

  test('link to registration page works', async ({ page }) => {
    await page.getByRole('link', { name: 'Register here' }).click();
    await expect(page).toHaveURL(/tour-guides\/register/i);
  });
});
