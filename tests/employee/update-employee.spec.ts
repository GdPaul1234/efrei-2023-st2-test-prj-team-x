import { test, expect, Page } from '@playwright/test';
import { fillOutEmployeeCreationForm, EmployeeData, new_employee_data } from './employee-helper';

type Input = {
  key: keyof EmployeeData
  value: string
}

async function updateEmployee(page: Page, linkName: string, inputs: Input[]) {
  await page.getByRole('link', { name: linkName }).click()

  for (const { key, value } of inputs) {
    await page.fill(`#id_${key}`, value)
  }
  await page.getByRole('button', { name: 'Update' }).click()
}

async function assertEmployee(page: Page, linkName: string, expected: Input[]) {
  await page.getByRole('link', { name: linkName }).click()

  for (const { key, value } of expected) {
    expect(await page.locator(`#id_${key}`).inputValue()).toEqual(value)
  }
}

test.describe('Update employee', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://x.hr.dmerej.info/add_employee');
    await fillOutEmployeeCreationForm(page, new_employee_data)
    await page.getByRole('button', { name: 'Add' }).click()

    await page.goto('https://x.hr.dmerej.info/employees')
    await page.getByText('Edit').first().click() // edit the first employee
  })

  test.afterEach(async ({ page }) => {
    await page.goto('https://x.hr.dmerej.info/reset_db')
    await page.getByText('Proceed').click()
  })

  test.describe('Update address', () => {
    test('Update Address 1 and Address 2', async ({ page }) => {
      const linkName = ' Update address '
      const inputs: Input[] = [
        { key: 'address_line1', value: 'Fake Address 1' },
        { key: 'address_line2', value: 'Fake Address 2' }
      ]

      await updateEmployee(page, linkName, inputs)
      await assertEmployee(page, linkName, inputs)
    })

    test('Update City', async ({ page }) => {
      const linkName = ' Update address '
      const inputs: Input[] = [{ key: 'city', value: 'New City' }]

      await updateEmployee(page, linkName, inputs)
      await assertEmployee(page, linkName, inputs)
    })
  })

  test.describe('Update contract', () => {
    test('should persist update', async ({ page }) => {
      const linkName = ' Update contract '
      const inputs: Input[] = [{ key: 'job_title', value: 'New job' }]

      await updateEmployee(page, linkName, inputs)
      await assertEmployee(page, linkName, inputs)
    })
  })

  test.describe('Update basic info', () => {
    test('should persist update', async ({ page }) => {
      const linkName = ' Update basic info '
      const inputs: Input[] = [
        { key: 'name', value: 'New Name' },
        { key: 'email', value: 'a@b.com' }
      ]

      await updateEmployee(page, linkName, inputs)
      await assertEmployee(page, linkName, inputs)
    })
  })
})
