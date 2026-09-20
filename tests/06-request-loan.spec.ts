import { test, expect } from '@playwright/test';
import { registerDynamicUser } from '../utils/testHelper';
import { RequestLoanPage } from '../pages/RequestLoanPage';
import loanData from '../data/loanData.json';

test.describe('ParaBank - Loan Application Suite', () => {
  test('TC-01: Should successfully apply for a loan with valid down payment', async ({ page }) => {
    // 1. Dynamic user registration to start clean
    await registerDynamicUser(page);

    // 2. Navigate to Loan Request
    const loanPage = new RequestLoanPage(page);
    await loanPage.goto();

    // 3. Apply for loan using external test data
    const { amount, downPayment } = loanData.approvedLoan;
    await loanPage.applyForLoan(amount, downPayment);

    // 4. Validate loan request outcome
    await expect(loanPage.successTitle).toHaveText('Loan Request Processed');
    await expect(loanPage.loanStatus).toBeVisible();
  });
});
