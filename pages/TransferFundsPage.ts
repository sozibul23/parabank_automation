import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferFundsPage extends BasePage {
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly successTitle: Locator;
  readonly confirmationMessage: Locator;
  readonly fromAccountOptions: Locator;
  readonly toAccountOptions: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.successTitle = page.getByRole('heading', { name: 'Transfer Complete!' });
    this.confirmationMessage = page.locator('#showResult p').first();
    this.fromAccountOptions = page.locator('#fromAccountId option');
    this.toAccountOptions = page.locator('#toAccountId option');
  }

  async goto() {
    await this.navigateTo('/transfer.htm');
    await this.waitForAccountOptions();
  }

  /**
   * Waits for AJAX to populate the account options
   */
  async waitForAccountOptions() {
    await this.fromAccountSelect.waitFor({ state: 'visible' });
    // Wait until at least one option is present in the dropdown
    await expect(this.fromAccountOptions.first()).toBeAttached({ timeout: 15000 });
  }

  async transfer(amount: string, fromAccountId?: string, toAccountId?: string) {
    await this.amountInput.fill(amount);
    await this.waitForAccountOptions();

    if (fromAccountId) {
      await this.fromAccountSelect.selectOption(fromAccountId);
    }
    if (toAccountId) {
      await this.toAccountSelect.selectOption(toAccountId);
    }

    await this.transferButton.click();
  }
}
