import { test, expect } from '@playwright/test';
import { registerDynamicUser } from '../utils/testHelper';
import { BillPayPage, PayeeData } from '../pages/BillPayPage';

test.describe('ParaBank - Bill Payment Suite', () => {
  test('TC-01: Should successfully submit a bill payment', async ({ page }) => {
    await registerDynamicUser(page);

    const billPayPage = new BillPayPage(page);
    await billPayPage.goto();

    const payeeData: PayeeData = {
      name: 'Electric Utility Co',
      address: '456 Energy Way',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      phone: '512-555-0143',
      accountNumber: '88776655',
      verifyAccount: '88776655',
      amount: '75.50'
    };

    await billPayPage.fillBillPayment(payeeData);
    await billPayPage.submitPayment();

    // Verify success confirmation
    await expect(billPayPage.successTitle).toHaveText('Bill Payment Complete');
    await expect(billPayPage.successMessage).toContainText(`Bill Payment to ${payeeData.name} in the amount of $${payeeData.amount}`);
  });

  test('TC-02: Should display validation error when account numbers do not match', async ({ page }) => {
    await registerDynamicUser(page);

    const billPayPage = new BillPayPage(page);
    await billPayPage.goto();

    await billPayPage.fillBillPayment({
      name: 'Water Services',
      address: '100 Lake Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      phone: '512-555-0199',
      accountNumber: '11223344',
      verifyAccount: '99999999', // Mismatched account
      amount: '40.00'
    });
    await billPayPage.submitPayment();

    // Verify mismatch error message
    const mismatchError = page.locator('.error').filter({ hasText: /match/i });
    await expect(mismatchError).toBeVisible();
  });
});
