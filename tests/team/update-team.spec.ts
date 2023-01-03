import { test, expect } from '@playwright/test'

import { fillOutEmployeeCreationForm, new_employee_data } from '../employee/employee-helper'
import { createTeam } from './team-helper'

test.describe('Update team', () => {
  test.afterEach(async ({ page }) => {
    await page.goto('https://x.hr.dmerej.info/reset_db')
    await page.getByText('Proceed').click()
  })

  test('add an employee', async ({ page }) => {
    const teamName = 'Team A'
    await fillOutEmployeeCreationForm(page, new_employee_data)
    await createTeam(page, teamName)

    await page.goto('https://x.hr.dmerej.info/employees')
    await page.getByText('Edit').first().click()
    await page.getByRole('link', { name: 'Add to team' }).click()
    await page.getByLabel('Team').selectOption({ label: `${teamName} team` })
    await page.getByRole('button', { name: 'Add' }).click()

    await page.goto('https://x.hr.dmerej.info/teams')
    await page.getByRole('row', { name: teamName })
      .getByRole('link', { name: 'View members' })
      .click()

    expect(await page.getByRole('listitem').allTextContents()).toContain(new_employee_data['name'])
  })
})
