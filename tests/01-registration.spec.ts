import { test, expect } from '@playwright/test';
import { RegisterPage, CustomerData } from '../pages/RegisterPage';

test.describe('ParaBank - Customer Registration Suite', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('TC-01: Should register a new customer successfully with dynamic data', async ({ page }) => {
    const randomId = Math.floor(Math.random() * 90000) + 10000;
    const testUser: CustomerData = {
      firstName: 'Test',
      lastName: 'Customer',
      address: '123 Test Street',
      city: 'Dhaka',
      state: 'Dhaka',
      zipCode: '1207',
      phone: '+8801700000000',
      ssn: `${randomId}-${randomId}`,
      username: `bankuser_${randomId}`,
      password: 'Password123!'
    };

    console.log(`Registering customer with username: ${testUser.username}`);
    await registerPage.fillRegistrationForm(testUser);
    await registerPage.submitRegistration();

    // Assertion: Welcome message
    await expect(page.locator('#rightPanel h1')).toHaveText(`Welcome ${testUser.username}`);
    await expect(registerPage.successMessage).toContainText('Your account was created successfully. You are now logged in.');
  });

  test('TC-02: Should display error when required field is empty', async ({ page }) => {
    // Click register without filling form
    await registerPage.submitRegistration();

    // Assert field validation errors
    await expect(page.locator('#customer\\.firstName\\.errors')).toHaveText('First name is required.');
    await expect(page.locator('#customer\\.lastName\\.errors')).toHaveText('Last name is required.');
    await expect(page.locator('#customer\\.address\\.street\\.errors')).toHaveText('Address is required.');
  });
});
