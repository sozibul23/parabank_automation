import { test, expect } from '@playwright/test';
import { registerDynamicUser } from '../utils/testHelper';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';

test.describe('ParaBank - Transfer Funds Suite', () => {
  test('TC-01: Should transfer funds successfully between two accounts', async ({ page }) => {
    // 1. Dynamic user registration
    await registerDynamicUser(page);

    // 2. Open a second account so we have both From and To accounts
    const openAccountPage = new OpenAccountPage(page);
    await openAccountPage.goto();
    const newAccountId = await openAccountPage.openAccount('SAVINGS');

    // 3. Navigate to Transfer Funds
    const transferPage = new TransferFundsPage(page);
    await transferPage.goto();

    const transferAmount = '50.00';
    await transferPage.transfer(transferAmount, undefined, newAccountId);

    // 4. Assert transfer confirmation
    await expect(transferPage.successTitle).toHaveText('Transfer Complete!');
    await expect(transferPage.confirmationMessage).toContainText(`$${transferAmount}`);
    await expect(transferPage.confirmationMessage).toContainText(newAccountId);
  });
});
