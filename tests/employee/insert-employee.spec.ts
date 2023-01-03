import { test, expect } from '@playwright/test';
import { EmployeeData, fillOutEmployeeCreationForm, new_employee_data } from './employee-helper';

test.describe('Insert employees', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://x.hr.dmerej.info/add_employee');
  })

  test.afterEach(async ({ page }) => {
    await page.goto('https://x.hr.dmerej.info/reset_db')
    await page.getByText('Proceed').click()
  })

  test('Insert a valid employee', async ({ page }) => {
    await fillOutEmployeeCreationForm(page, new_employee_data)
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.locator('h2')).toContainText('Employees (1)')
  })

  test('Insert an Employee with a negative Post Code', async ({ page }) => {
    const employee_data: EmployeeData = {
      ...new_employee_data,
      zip_code: '-1'
    }

    await fillOutEmployeeCreationForm(page, employee_data)
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.locator('h2')).not.toContainText('Employees (1)')
  })

  test('Insert an employee whom Zip code is 20 characters long', async ({ page }) => {
    const employee_data: EmployeeData = {
      ...new_employee_data,
      zip_code: '12345678912345600000'
    }

    await fillOutEmployeeCreationForm(page, employee_data)
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.locator('h2')).not.toContainText('Server Error (500)')
  })
})
