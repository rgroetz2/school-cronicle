import { expect, test } from '@playwright/test';

async function signIn(page: Parameters<typeof test>[0]['page']): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill('teacher@school.local');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Appointments workspace' })).toBeVisible();
}

test('[P0] creates and submits appointment from modal', async ({ page }) => {
  await signIn(page);

  const title = `E2E Appointment ${Date.now()}`;

  await page.getByRole('button', { name: 'Create appointment' }).click();
  await expect(page.getByRole('heading', { name: 'Create appointment' })).toBeVisible();

  await page.locator('#modal-draft-title').fill(title);
  await page.locator('#modal-draft-date').fill('2026-06-20');
  await page.locator('#modal-draft-category').selectOption('meeting');
  await page.getByRole('button', { name: 'Create appointment' }).nth(1).click();

  await expect(page.getByRole('button', { name: 'Create appointment' })).toBeVisible();
  await expect(page.locator('.draft-list')).toContainText(title);

  const createdRow = page.locator('.draft-list li').filter({ hasText: title }).first();
  await createdRow.locator('.draft-button').click();
  await expect(page.getByRole('heading', { name: 'Edit appointment' })).toBeVisible();

  await page.getByRole('button', { name: 'Submit appointment' }).click();
  await expect(page.locator('form .state-pill').filter({ hasText: 'Last edited after submit' })).toBeHidden();
  await page.getByRole('button', { name: 'Close' }).click();

  await expect(createdRow).toContainText('submitted');
});
