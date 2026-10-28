import { expect, test } from '@playwright/test';

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test('Cloudflare preview loads real React UI on ' + viewport.name, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    try {
      const page = await context.newPage();
      const response = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 110_000 });
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/CABO Solutions/i);
      await expect(page.locator('#root')).not.toBeEmpty({ timeout: 40_000 });
      await expect(page.locator('#contact')).toBeVisible({ timeout: 40_000 });
      await expect(page.locator('#contact form')).toBeVisible();
      const overflowPx = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflowPx).toBeLessThanOrEqual(5);
      // Never submit test contact forms to the real Render database.
    } finally {
      await context.close();
    }
  });
}
