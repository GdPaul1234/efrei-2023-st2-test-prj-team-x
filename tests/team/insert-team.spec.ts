import { test, expect, Page } from '@playwright/test';

async function createTeam(page: Page, name: string) {
  await page.goto('https://x.hr.dmerej.info/add_team')
  await page.getByPlaceholder('Name').fill(name)
  await page.getByRole('button', { name: 'Add' }).click()
}

test.describe('Insert team', () => {
  test.afterEach(async ({ page }) => {
    await page.goto('https://x.hr.dmerej.info/reset_db')
    await page.getByText('Proceed').click()
  })

  test('should persist new team', async ({ page }) => {
    const input = 'Team A'
    await createTeam(page, input)

    await page.goto('https://x.hr.dmerej.info/teams')
    expect(await page.getByRole('cell').allTextContents()).toContain(input)
  })

  test('should not create new team with the same name', async ({ page }) => {
    const input = 'Team A'
    await createTeam(page, input)

    await createTeam(page, input)
    await expect(page.locator('.invalid-feedback')).toHaveText('a team with the same name already exists')
  })

  test('should not crash if team is blank', async ({ page }) => {
    const input = ' '
    await createTeam(page, input)

    await expect(page.locator('h2')).not.toContainText('Server Error (500)')
  })
})
