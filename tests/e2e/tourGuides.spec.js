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
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
  });

  test('submitting empty form shows validation', async ({ page }) => {
    await page.getByRole('button', { name: /register|submit|create/i }).click();
    // HTML5 required validation or our own error message should appear
    const hasNativeError = await page.evaluate(() =>
      [...document.querySelectorAll('input')].some(i => !i.validity.valid)
    );
    const hasCustomError = await page.locator('text=/required|fill in|must/i').count() > 0;
    expect(hasNativeError || hasCustomError).toBeTruthy();
  });

  test('password mismatch shows error', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Test Guide');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('different456');
    await page.getByLabel(/location/i).fill('London');
    await page.getByRole('button', { name: /register|submit/i }).click();
    await expect(page.getByText(/passwords? do not match|passwords? must match/i)).toBeVisible();
  });
});

test.describe('Tour Guide login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tour-guides/login');
  });

  test('login form is visible', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });

  test('invalid credentials shows error', async ({ page }) => {
    await page.getByLabel(/email/i).fill('notauser@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await expect(page.getByText(/invalid|incorrect|not found|error/i)).toBeVisible({ timeout: 10000 });
  });

  test('link to registration page works', async ({ page }) => {
    await page.getByRole('link', { name: /register|sign up|create/i }).click();
    await expect(page).toHaveURL(/tour-guides\/register/i);
  });
});
