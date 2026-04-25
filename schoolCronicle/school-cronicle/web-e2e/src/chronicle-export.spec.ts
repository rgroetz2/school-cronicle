import { expect, test } from '@playwright/test';

async function signIn(page: Parameters<typeof test>[0]['page']): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill('teacher@school.local');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Appointments workspace' })).toBeVisible();
}

test('[P0] exports chronicle from checkbox selection', async ({ page }) => {
  await signIn(page);

  const eligibleCheckbox = page.locator('.draft-list input[type="checkbox"]').first();
  await expect(eligibleCheckbox).toBeVisible();
  await eligibleCheckbox.check();

  await expect(page.locator('.state-pill').filter({ hasText: 'Chronicle selection: 1 selected' })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export chronicle (.docx)' }).click();
  const download = await downloadPromise;

  const fileName = download.suggestedFilename().toLowerCase();
  expect(fileName).toContain('.docx');
});
