import { Page } from "@playwright/test"

export type EmployeeData = {
    name: string
    email: string
    address_line1: string
    address_line2: string
    city: string
    zip_code: string
    hiring_date: string
    job_title: string
}

export const new_employee_data: EmployeeData = {
    name: 'Fake Name',
    email: 'fake_email@mail.com',
    address_line1: 'Fake Address Line 1',
    address_line2: 'Fake Address Line 2',
    city: 'Fake City',
    zip_code: '12345',
    hiring_date: '06122022',
    job_title: 'Fake Job Title'
}

export async function fillOutForm(employee_data: EmployeeData, page: Page) {
    for (const [key, value] of Object.entries(employee_data)) {
        await page.type(`#id_${key}`, value)
    }
}
