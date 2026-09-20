import { test, expect } from '@playwright/test';
import { registerDynamicUser } from '../utils/testHelper';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';

test.describe('ParaBank - Open New Account Suite', () => {
  test('TC-01: Should successfully open a new SAVINGS account', async ({ page }) => {
    // 1. Dynamic registration to get a fresh session
    await registerDynamicUser(page);

    // 2. Open new SAVINGS account
    const openAccountPage = new OpenAccountPage(page);
    await openAccountPage.goto();

    const newAccountId = await openAccountPage.openAccount('SAVINGS');

    // 3. Verify Account Opened success
    await expect(openAccountPage.successTitle).toHaveText('Account Opened!');
    expect(newAccountId).toBeTruthy();
    expect(newAccountId.length).toBeGreaterThan(3);
  });

  test('TC-02: New account should be visible in Accounts Overview', async ({ page }) => {
    await registerDynamicUser(page);

    const openAccountPage = new OpenAccountPage(page);
    await openAccountPage.goto();
    const newAccountId = await openAccountPage.openAccount('CHECKING');

    // Navigate to Accounts Overview
    const overviewPage = new AccountsOverviewPage(page);
    await overviewPage.goto();

    // Verify table contains the new account ID link
    const newAccountLink = page.locator(`#accountTable a[href*="activity.htm?id=${newAccountId}"]`);
    await expect(newAccountLink).toBeVisible();
  });
});
