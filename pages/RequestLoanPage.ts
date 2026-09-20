import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RequestLoanPage extends BasePage {
  readonly amountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly applyNowButton: Locator;
  readonly successTitle: Locator;
  readonly loanStatus: Locator;
  readonly newAccountId: Locator;
  readonly fromAccountOptions: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountIdSelect = page.locator('#fromAccountId');
    this.applyNowButton = page.locator('input[value="Apply Now"]');
    this.successTitle = page.getByRole('heading', { name: 'Loan Request Processed' });
    this.loanStatus = page.locator('#loanStatus');
    this.newAccountId = page.locator('#newAccountId');
    this.fromAccountOptions = page.locator('#fromAccountId option');
  }

  async goto() {
    await this.navigateTo('/requestloan.htm');
    await this.waitForAccountOptions();
  }

  async waitForAccountOptions() {
    await this.fromAccountIdSelect.waitFor({ state: 'visible' });
    await expect(this.fromAccountOptions.first()).toBeAttached({ timeout: 10000 });
  }

  async applyForLoan(amount: string, downPayment: string) {
    await this.waitForAccountOptions();
    await this.amountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);
    await this.applyNowButton.click();
  }
}
