import { expect, test } from '@playwright/test';

const omni = 'https://omnimaster-cloudflare-preview.cabo-solutions-za.workers.dev/';
const artist = 'https://cabo-artist-static-preview.cabo-solutions-za.workers.dev/';

for (const viewport of [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test('OmniMaster standalone Worker renders on ' + viewport.name, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    try {
      const page = await context.newPage();
      const response = await page.goto(omni, { waitUntil: 'domcontentloaded', timeout: 110_000 });
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/OMNIMASTER/i);
      await expect(page.getByText(/CABO Learning Hub/i).first()).toBeVisible();
      const body = await page.locator('body').innerText();
      expect(body).toContain('OmniMaster');
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.waitForTimeout(750);
      expect(pageErrors).toEqual([]);
    } finally {
      await context.close();
    }
  });

  test('Artist Hub demo falls back to fictional data on ' + viewport.name, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    try {
      const page = await context.newPage();
      const response = await page.goto(artist, { waitUntil: 'domcontentloaded', timeout: 110_000 });
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/CABO Artist Hub/i);
      await expect(page.getByText(/fictional artists and synthetic insights/i).first()).toBeVisible();
      await expect(page.locator('#artist-load-error')).toContainText(/Public preview mode/i, { timeout: 30_000 });
      await expect(page.getByText('Echo Dune').first()).toBeVisible();
      // Bookings and credentials are forbidden in this static preview.
      const api = await page.request.post(new URL('/api/bookings', artist).toString(), {
        data: { name: 'synthetic only' }
      });
      expect(api.status()).toBe(405);
    } finally {
      await context.close();
    }
  });
}
