import { expect, test } from '@playwright/test';

async function signIn(page: Parameters<typeof test>[0]['page']): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill('teacher@school.local');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Appointments workspace' })).toBeVisible();
}

test('[P0] creates and updates contact from dedicated list view', async ({ page }) => {
  await signIn(page);
  await page.getByRole('link', { name: 'Contacts' }).click();
  await expect(page.getByRole('heading', { name: 'Contacts workspace' })).toBeVisible();

  const contactName = `E2E Contact ${Date.now()}`;

  await page.getByRole('button', { name: 'Create contact' }).click();
  await expect(page.getByRole('heading', { name: 'Create contact' })).toBeVisible();
  await page.locator('#contact-name').fill(contactName);
  await page.locator('#contact-role').selectOption('parent');
  await page.getByRole('button', { name: 'Save contact' }).first().click();

  await expect(page.locator('.status-stack')).toContainText(`Contact created: ${contactName}`);
  await expect(page.locator('.contact-list')).toContainText(contactName);

  await page.locator('.contact-list li').filter({ hasText: contactName }).first().locator('button').click();
  await expect(page.getByRole('heading', { name: 'Maintain contact' })).toBeVisible();
  await page.locator('#contact-phone').fill('+49-123-4567');
  await page.getByRole('button', { name: 'Save contact' }).first().click();

  await expect(page.locator('.status-stack')).toContainText(`Contact updated: ${contactName}`);
  await expect(page.locator('.contact-list li').filter({ hasText: contactName }).first()).toContainText('+49-123-4567');

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Delete contact' }).click();
  await expect(page.locator('.status-stack')).toContainText('Contact deleted.');
  await expect(page.locator('.contact-list')).not.toContainText(contactName);
});
