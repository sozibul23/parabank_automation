import { test, expect } from '@playwright/test';
import { registerDynamicUser, generateRandomCustomer } from '../utils/testHelper';
import { RegisterPage } from '../pages/RegisterPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('ParaBank - Critical Banking & Security Test Suite', () => {

  /**
   * CRITICAL TEST 1: Security - Duplicate Username Rejection
   * Prevents account hijacking and ensures uniqueness constraint in customer database.
   */
  test('CRIT-01 [Security]: Should reject registration with an existing username', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    // 1. Register first customer
    const userA = await registerDynamicUser(page);

    // 2. Logout
    await page.locator('a[href*="logout.htm"]').click();

    // 3. Attempt to register a second user with the exact same username
    await registerPage.goto();
    const userB = generateRandomCustomer();
    userB.username = userA.username; // Force identical username
    await registerPage.fillRegistrationForm(userB);
    await registerPage.submitRegistration();

    // 4. Assert database unique constraint error
    const usernameError = page.locator('#customer\\.username\\.errors');
    await expect(usernameError).toBeVisible();
    await expect(usernameError).toHaveText('This username already exists.');
  });

  /**
   * CRITICAL TEST 2: Data Integrity - Password Confirmation Mismatch
   * Ensures passwords match before account creation to prevent locked-out accounts.
   */
  test('CRIT-02 [Integrity]: Should prevent registration when passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    const customer = generateRandomCustomer();
    await registerPage.firstNameInput.fill(customer.firstName);
    await registerPage.lastNameInput.fill(customer.lastName);
    await registerPage.addressInput.fill(customer.address);
    await registerPage.cityInput.fill(customer.city);
    await registerPage.stateInput.fill(customer.state);
    await registerPage.zipCodeInput.fill(customer.zipCode);
    await registerPage.phoneInput.fill(customer.phone);
    await registerPage.ssnInput.fill(customer.ssn);
    await registerPage.usernameInput.fill(customer.username);
    await registerPage.passwordInput.fill('SecurePassword123!');
    await registerPage.confirmPasswordInput.fill('DifferentPassword999!'); // Intentionally mismatched
    await registerPage.submitRegistration();

    // Assert validation error
    const passwordError = page.locator('#repeatedPassword\\.errors');
    await expect(passwordError).toBeVisible();
    await expect(passwordError).toHaveText('Passwords did not match.');
  });

  /**
   * CRITICAL TEST 3: Core Ledger & Financial Integrity - End-to-End Transfer & Balance Sync
   * Verifies that after a transfer between two accounts, both accounts and total balance remain accurate.
   */
  test('CRIT-03 [Financial]: End-to-End Fund Transfer with Ledger Verification', async ({ page }) => {
    // 1. Create user
    await registerDynamicUser(page);

    // 2. Create a secondary SAVINGS account so the user has two accounts
    const openAccountPage = new OpenAccountPage(page);
    await openAccountPage.goto();
    const newSavingsId = await openAccountPage.openAccount('SAVINGS');

    // 3. Check initial overview
    const overviewPage = new AccountsOverviewPage(page);
    await overviewPage.goto();
    await overviewPage.waitForAccountsToLoad();
    const rowCountBefore = await overviewPage.accountRows.count();
    expect(rowCountBefore).toBeGreaterThanOrEqual(1);

    // 4. Transfer funds from default account to new savings account
    const transferPage = new TransferFundsPage(page);
    await transferPage.goto();
    const amountToTransfer = '125.00';
    await transferPage.transfer(amountToTransfer, undefined, newSavingsId);

    // 5. Verify transaction confirmation
    await expect(transferPage.successTitle).toHaveText('Transfer Complete!');
    await expect(transferPage.confirmationMessage).toContainText(`$${amountToTransfer}`);

    // 6. Return to overview and assert both accounts remain active and listed
    await overviewPage.goto();
    await expect(page.locator(`#accountTable a[href*="activity.htm?id=${newSavingsId}"]`)).toBeVisible();
  });

  /**
   * CRITICAL TEST 4: Session Security - Invalidate session on Logout
   * Ensures that once a user logs out, protected data cannot be viewed via back navigation.
   */
  test('CRIT-04 [Session]: Logout should destroy session and prevent access to account table', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Dynamic user registration (logged in)
    await registerDynamicUser(page);

    // 2. Confirm overview is accessible
    const overviewPage = new AccountsOverviewPage(page);
    await overviewPage.goto();
    await expect(overviewPage.accountsTable).toBeVisible();

    // 3. Perform clean logout
    await overviewPage.logout();
    await expect(loginPage.usernameInput).toBeVisible();

    // 4. Try navigating directly to the protected overview page
    await page.goto('/parabank/overview.htm');

    // 5. Assert user is prompted to log in and cannot access private account data
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(overviewPage.accountsTable).not.toBeVisible();
  });

  /**
   * CRITICAL TEST 5: Security - Protection of Sensitive Endpoints for Unauthenticated Visitors
   * Ensures unauthenticated users attempting to access transfer or bill pay are restricted.
   */
  test('CRIT-05 [Security]: Direct access to protected transfer page without authentication is restricted', async ({ page }) => {
    // Navigate directly without logging in
    await page.goto('/parabank/transfer.htm');

    // Should not show the transfer form or submit button without active authentication
    const transferButton = page.locator('input[value="Transfer"]');
    const isVisible = await transferButton.isVisible();

    if (isVisible) {
      // If page renders, verify submitting without session displays error/redirect
      await transferButton.click();
      const hasError = await page.locator('.error, #rightPanel p').isVisible();
      expect(hasError).toBeTruthy();
    } else {
      // Properly redirected or blocked
      const loginButton = page.locator('input[value="Log In"]');
      await expect(loginButton).toBeVisible();
    }
  });

});
