# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tourGuides.spec.js >> Tour Guide login >> link to registration page works
- Location: tests\e2e\tourGuides.spec.js:72:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /register|sign up|create/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "404" [level=1] [ref=e4]
    - heading "Page Not Found" [level=2] [ref=e5]
    - paragraph [ref=e6]: The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    - link "Go Back Home" [ref=e7] [cursor=pointer]:
      - /url: /
      - img [ref=e8]
      - text: Go Back Home
  - button "Open Next.js Dev Tools" [ref=e15] [cursor=pointer]:
    - img [ref=e16]
  - alert [ref=e19]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Tour Guides public listing', () => {
  4  |   test('page loads with heading', async ({ page }) => {
  5  |     await page.goto('/tour-guides');
  6  |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  7  |   });
  8  | 
  9  |   test('specialty filter pills are visible', async ({ page }) => {
  10 |     await page.goto('/tour-guides');
  11 |     await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible();
  12 |   });
  13 | 
  14 |   test('CTA to register is visible', async ({ page }) => {
  15 |     await page.goto('/tour-guides');
  16 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  17 |     await expect(page.getByRole('link', { name: /register|become a guide/i })).toBeVisible();
  18 |   });
  19 | });
  20 | 
  21 | test.describe('Tour Guide registration form', () => {
  22 |   test.beforeEach(async ({ page }) => {
  23 |     await page.goto('/tour-guides/register');
  24 |   });
  25 | 
  26 |   test('registration form fields are visible', async ({ page }) => {
  27 |     await expect(page.getByLabel(/full name/i)).toBeVisible();
  28 |     await expect(page.getByLabel(/email/i)).toBeVisible();
  29 |     await expect(page.getByLabel(/phone/i)).toBeVisible();
  30 |     await expect(page.getByLabel(/^password/i)).toBeVisible();
  31 |   });
  32 | 
  33 |   test('submitting empty form shows validation', async ({ page }) => {
  34 |     await page.getByRole('button', { name: /register|submit|create/i }).click();
  35 |     // HTML5 required validation or our own error message should appear
  36 |     const hasNativeError = await page.evaluate(() =>
  37 |       [...document.querySelectorAll('input')].some(i => !i.validity.valid)
  38 |     );
  39 |     const hasCustomError = await page.locator('text=/required|fill in|must/i').count() > 0;
  40 |     expect(hasNativeError || hasCustomError).toBeTruthy();
  41 |   });
  42 | 
  43 |   test('password mismatch shows error', async ({ page }) => {
  44 |     await page.getByLabel(/full name/i).fill('Test Guide');
  45 |     await page.getByLabel(/email/i).fill('test@example.com');
  46 |     await page.getByLabel(/^password/i).fill('password123');
  47 |     await page.getByLabel(/confirm password/i).fill('different456');
  48 |     await page.getByLabel(/location/i).fill('London');
  49 |     await page.getByRole('button', { name: /register|submit/i }).click();
  50 |     await expect(page.getByText(/passwords? do not match|passwords? must match/i)).toBeVisible();
  51 |   });
  52 | });
  53 | 
  54 | test.describe('Tour Guide login', () => {
  55 |   test.beforeEach(async ({ page }) => {
  56 |     await page.goto('/tour-guides/login');
  57 |   });
  58 | 
  59 |   test('login form is visible', async ({ page }) => {
  60 |     await expect(page.getByLabel(/email/i)).toBeVisible();
  61 |     await expect(page.getByLabel(/password/i)).toBeVisible();
  62 |     await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  63 |   });
  64 | 
  65 |   test('invalid credentials shows error', async ({ page }) => {
  66 |     await page.getByLabel(/email/i).fill('notauser@example.com');
  67 |     await page.getByLabel(/password/i).fill('wrongpassword');
  68 |     await page.getByRole('button', { name: /login|sign in/i }).click();
  69 |     await expect(page.getByText(/invalid|incorrect|not found|error/i)).toBeVisible({ timeout: 10000 });
  70 |   });
  71 | 
  72 |   test('link to registration page works', async ({ page }) => {
> 73 |     await page.getByRole('link', { name: /register|sign up|create/i }).click();
     |                                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  74 |     await expect(page).toHaveURL(/tour-guides\/register/i);
  75 |   });
  76 | });
  77 | 
```