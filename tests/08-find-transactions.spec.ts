import { test, expect } from '@playwright/test';
import { registerDynamicUser } from '../utils/testHelper';
import { FindTransactionsPage } from '../pages/FindTransactionsPage';

test.describe('ParaBank - Find Transactions Suite', () => {
  test('TC-01: Should search transactions by amount', async ({ page }) => {
    // 1. Dynamic user registration
    await registerDynamicUser(page);

    // 2. Navigate to Find Transactions
    const findTransPage = new FindTransactionsPage(page);
    await findTransPage.goto();

    // 3. Search for initial account deposit amount or standard query
    // ParaBank registers with initial funds (commonly 100 or 515) or any test amount
    await findTransPage.searchByAmount('100');

    // 4. Assert transaction results table is displayed
    await expect(findTransPage.transactionTable).toBeVisible();
  });
});
