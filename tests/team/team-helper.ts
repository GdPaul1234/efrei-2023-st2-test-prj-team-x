import { Page } from '@playwright/test';

export async function createTeam(page: Page, name: string) {
  await page.goto('https://x.hr.dmerej.info/add_team');
  await page.getByPlaceholder('Name').fill(name);
  await page.getByRole('button', { name: 'Add' }).click();
}
