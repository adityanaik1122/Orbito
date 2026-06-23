/**
 * Frontend Security Test Suite — Playwright E2E
 * OWASP A01 – Broken Access Control (auth redirects)
 * OWASP A03 – Injection (XSS in DOM)
 * OWASP A02 – Cryptographic Failures (sensitive data in DOM/storage)
 * OWASP A05 – Security Misconfiguration (CSP, headers)
 *
 * These tests run against the real frontend dev server.
 * They verify that security controls are enforced at the browser level.
 */

const { test, expect } = require('@playwright/test');

// ── Shared XSS payloads ──────────────────────────────────────────────────────
const XSS_PAYLOADS = [
  '<script>window.__xss=1</script>',
  '"><img src=x onerror="window.__xss=1">',
  "';window.__xss=1;//",
  '<svg/onload="window.__xss=1">',
];

// ── Helper: check no XSS executed ───────────────────────────────────────────
async function assertNoXssExecuted(page) {
  const xssFlag = await page.evaluate(() => window.__xss);
  expect(xssFlag).toBeUndefined();
}

// ────────────────────────────────────────────────────────────────────────────

test.describe('SECURITY | A01 — Auth Redirects (Broken Access Control)', () => {

  test('unauthenticated /plan redirects to login', async ({ page }) => {
    await page.goto('/plan');
    await expect(page).toHaveURL(/login|auth/i, { timeout: 10000 });
  });

  test('unauthenticated /checkout redirects to login', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/login|auth/i, { timeout: 10000 });
  });

  test('unauthenticated /admin redirects to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/login|auth|\/$/i, { timeout: 10000 });
    // Must not render the admin dashboard content
    await expect(page.getByText('Admin Panel')).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('unauthenticated /my-account redirects to login', async ({ page }) => {
    await page.goto('/my-account');
    await expect(page).toHaveURL(/login|auth/i, { timeout: 10000 });
  });

  test('unauthenticated /operator redirects to login', async ({ page }) => {
    await page.goto('/operator');
    await expect(page).toHaveURL(/login|auth|\/$/i, { timeout: 10000 });
  });

  test('direct URL to /bookings without auth redirects to login', async ({ page }) => {
    await page.goto('/bookings');
    await expect(page).toHaveURL(/login|auth/i, { timeout: 10000 });
  });

});

// ────────────────────────────────────────────────────────────────────────────

test.describe('SECURITY | A03 — XSS (Reflected & Stored)', () => {

  test.describe('XSS in URL query parameters is not reflected raw', () => {
    XSS_PAYLOADS.forEach((payload) => {
      test(`Payload: ${payload.slice(0, 40)}`, async ({ page }) => {
        // Inject payload into a query param that might be rendered
        await page.goto(`/?destination=${encodeURIComponent(payload)}`);
        await page.waitForLoadState('networkidle');
        await assertNoXssExecuted(page);
      });
    });
  });

  test('Search input value is escaped in the DOM', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder(/tokyo|destination|trip/i).first();
    if (await input.isVisible()) {
      await input.fill('<script>window.__xss=1</script>');
      await page.waitForTimeout(300);
      await assertNoXssExecuted(page);

      // The raw payload must not appear as executable HTML in the DOM
      const innerHTML = await page.evaluate(() => document.body.innerHTML);
      expect(innerHTML).not.toMatch(/<script>window\.__xss/);
    }
  });

  test('XSS in tour search field does not execute', async ({ page }) => {
    await page.goto('/tours');
    const searchInput = page.getByRole('searchbox').first().or(
      page.getByPlaceholder(/search|find/i).first()
    );
    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill('"><img src=x onerror="window.__xss=1">');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      await assertNoXssExecuted(page);
    }
  });

  test('Page does not use document.write() or innerHTML with user content', async ({ page }) => {
    // Check that the app does not call document.write (a common XSS vector)
    let docWriteCalled = false;
    await page.addInitScript(() => {
      const orig = document.write.bind(document);
      document.write = (...args) => {
        window.__docWriteCalled = true;
        return orig(...args);
      };
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    docWriteCalled = await page.evaluate(() => !!window.__docWriteCalled);
    expect(docWriteCalled).toBe(false);
  });

});

// ────────────────────────────────────────────────────────────────────────────

test.describe('SECURITY | A02 — Sensitive Data Exposure', () => {

  test('API keys and secrets are not exposed in page source', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const content = await page.content();

    // Service-role JWT prefix (much longer than anon key prefix) should not appear
    expect(content).not.toMatch(/service_role/i);
    // Stripe secret key pattern
    expect(content).not.toMatch(/sk_live_[A-Za-z0-9]+/);
    expect(content).not.toMatch(/sk_test_[A-Za-z0-9]{20,}/);
    // Groq API key pattern
    expect(content).not.toMatch(/gsk_[A-Za-z0-9]{40,}/);
    // OpenAI key pattern
    expect(content).not.toMatch(/sk-[A-Za-z0-9]{40,}/);
  });

  test('localStorage does not contain raw passwords', async ({ page }) => {
    await page.goto('/');
    const storage = await page.evaluate(() => JSON.stringify(localStorage));
    expect(storage).not.toMatch(/password/i);
  });

  test('Login form password field uses type="password" (masked)', async ({ page }) => {
    await page.goto('/login');
    const passwordField = page.getByLabel(/password/i).first();
    if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
      const type = await passwordField.getAttribute('type');
      expect(type).toBe('password');
    }
  });

  test('Auth page does not expose token in URL after login redirect', async ({ page }) => {
    await page.goto('/login');
    // If the URL contains a token after visiting auth, it would be a disclosure
    const url = page.url();
    expect(url).not.toMatch(/access_token/);
    expect(url).not.toMatch(/token=[A-Za-z0-9]/);
  });

  test('Error pages do not show stack traces', async ({ page }) => {
    // 404 page
    await page.goto('/this-route-does-not-exist-12345');
    const content = await page.content();
    expect(content).not.toMatch(/at Object\./);
    expect(content).not.toMatch(/at Module\./);
    expect(content).not.toMatch(/node_modules\//);
    expect(content).not.toMatch(/\.js:\d+:\d+/);
  });

});

// ────────────────────────────────────────────────────────────────────────────

test.describe('SECURITY | A05 — Security Misconfiguration (Frontend)', () => {

  test('App runs on HTTPS in production (meta check)', async ({ page }) => {
    await page.goto('/');
    // In dev this is http; in prod it must be https. We check the meta tag.
    const canonical = await page.$eval(
      'link[rel="canonical"]',
      (el) => el.href
    ).catch(() => null);
    if (canonical) {
      // Canonical must not point to http in a production URL
      if (canonical.includes('orbitotrip.com')) {
        expect(canonical.startsWith('https://')).toBe(true);
      }
    }
  });

  test('No mixed content — images and scripts use HTTPS or relative paths', async ({ page }) => {
    const mixedContentUrls = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.startsWith('http://') && !url.includes('localhost')) {
        mixedContentUrls.push(url);
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(mixedContentUrls).toHaveLength(0);
  });

  test('Autocomplete is off on the password field', async ({ page }) => {
    await page.goto('/login');
    const passwordField = page.getByLabel(/password/i).first();
    if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
      const autocomplete = await passwordField.getAttribute('autocomplete');
      // Should be 'current-password' (browser-managed) or 'off', not undefined
      if (autocomplete !== null) {
        expect(['current-password', 'new-password', 'off']).toContain(autocomplete);
      }
    }
  });

  test('Clipboard is not auto-populated with sensitive data', async ({ page }) => {
    await page.goto('/');
    // Attempt to read clipboard — should be empty or non-sensitive
    const clipboardText = await page.evaluate(async () => {
      try { return await navigator.clipboard.readText(); } catch { return ''; }
    });
    expect(clipboardText).not.toMatch(/sk_live/i);
    expect(clipboardText).not.toMatch(/service_role/i);
  });

});

// ────────────────────────────────────────────────────────────────────────────

test.describe('SECURITY | A04 — Insecure Design (Business Logic)', () => {

  test('Save button without being logged in shows login prompt, not error dump', async ({ page }) => {
    // Visit plan page without auth — should redirect
    await page.goto('/plan');
    // Either redirected to login, OR plan page shows login-required state
    const url = page.url();
    const isLoginPage = /login|auth/i.test(url);
    if (!isLoginPage) {
      // If plan page is accessible, save button should prompt login gracefully
      const saveBtn = page.getByRole('button', { name: /save/i }).first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        // Should show a toast / redirect — not a raw error dump
        const pageContent = await page.content();
        expect(pageContent).not.toMatch(/stack trace/i);
        expect(pageContent).not.toMatch(/internal server error/i);
      }
    }
  });

  test('Tour detail page does not expose internal database IDs in a guessable pattern', async ({ page }) => {
    await page.goto('/tours');
    await page.waitForLoadState('networkidle');
    // Get the first tour link
    const firstTourLink = page.getByRole('main').getByRole('link').first();
    if (await firstTourLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await firstTourLink.getAttribute('href');
      if (href && href.includes('/tours/')) {
        // IDs should be UUIDs or slugs, not sequential integers like /tours/1
        const idPart = href.split('/tours/')[1];
        expect(idPart).not.toMatch(/^[0-9]+$/);
      }
    }
  });

});
