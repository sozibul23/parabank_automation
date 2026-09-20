import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FindTransactionsPage extends BasePage {
  readonly accountSelect: Locator;
  readonly transactionIdInput: Locator;
  readonly findByIdButton: Locator;
  readonly transactionDateInput: Locator;
  readonly findByDateButton: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly findByDateRangeButton: Locator;
  readonly amountInput: Locator;
  readonly findByAmountButton: Locator;
  readonly transactionTable: Locator;
  readonly transactionRows: Locator;

  constructor(page: Page) {
    super(page);
    this.accountSelect = page.locator('#accountId');
    this.transactionIdInput = page.locator('#transactionId');
    this.findByIdButton = page.locator('button[id="findById"]');
    this.transactionDateInput = page.locator('#transactionDate');
    this.findByDateButton = page.locator('button[id="findByDate"]');
    this.fromDateInput = page.locator('#fromDate');
    this.toDateInput = page.locator('#toDate');
    this.findByDateRangeButton = page.locator('button[id="findByDateRange"]');
    this.amountInput = page.locator('#amount');
    this.findByAmountButton = page.locator('button[id="findByAmount"]');
    this.transactionTable = page.locator('#transactionTable');
    this.transactionRows = page.locator('#transactionTable tbody tr');
  }

  async goto() {
    await this.navigateTo('/findtrans.htm');
    await this.accountSelect.waitFor({ state: 'visible' });
  }

  async searchByAmount(amount: string) {
    await this.amountInput.fill(amount);
    await this.findByAmountButton.click();
    await this.transactionTable.waitFor({ state: 'visible', timeout: 10000 });
  }

  async searchByDate(date: string) {
    await this.transactionDateInput.fill(date);
    await this.findByDateButton.click();
    await this.transactionTable.waitFor({ state: 'visible', timeout: 10000 });
  }
}
