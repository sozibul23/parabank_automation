import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('ParaBank - Authentication Suite', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-01: Should show error for invalid login credentials', async ({ page }) => {
    await loginPage.login('invalid_user_xyz', 'WrongPassword123');
    await expect(loginPage.errorMessage).toHaveText(/The username and password could not be verified|An internal error has occurred/);
  });

  test('TC-02: Should successfully log in and log out with registered user', async ({ page }) => {
    // 1. Create a dynamic user first
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    const randomId = Math.floor(Math.random() * 90000) + 10000;
    const username = `authuser_${randomId}`;
    const password = 'Password123!';

    await registerPage.fillRegistrationForm({
      firstName: 'Auth',
      lastName: 'User',
      address: '77 Bank Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '555-1234',
      ssn: `${randomId}`,
      username,
      password
    });
    await registerPage.submitRegistration();

    // 2. Log out
    await page.locator('a[href*="logout.htm"]').click();
    await expect(loginPage.usernameInput).toBeVisible();

    // 3. Log back in with registered credentials
    await loginPage.login(username, password);
    await expect(page.locator('#accountTable')).toBeVisible();

    // 4. Clean logout
    await page.locator('a[href*="logout.htm"]').click();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
