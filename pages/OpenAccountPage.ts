import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type AccountType = 'CHECKING' | 'SAVINGS';

export class OpenAccountPage extends BasePage {
  readonly accountTypeSelect: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly openAccountButton: Locator;
  readonly successTitle: Locator;
  readonly newAccountIdLink: Locator;
  readonly fromAccountOptions: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountIdSelect = page.locator('#fromAccountId');
    this.openAccountButton = page.locator('input[value="Open New Account"]');
    this.successTitle = page.getByRole('heading', { name: 'Account Opened!' });
    this.newAccountIdLink = page.locator('#newAccountId');
    this.fromAccountOptions = page.locator('#fromAccountId option');
  }

  async goto() {
    await this.navigateTo('/openaccount.htm');
    await this.waitForOptions();
  }

  async waitForOptions() {
    await this.fromAccountIdSelect.waitFor({ state: 'visible' });
    // Wait until account dropdown is populated via AJAX
    await expect(this.fromAccountOptions.first()).toBeAttached({ timeout: 15000 });
  }

  async openAccount(type: AccountType): Promise<string> {
    await this.waitForOptions();
    // Select checking ('0') or savings ('1') by label or value
    if (type === 'SAVINGS') {
      await this.accountTypeSelect.selectOption({ label: 'SAVINGS' });
    } else {
      await this.accountTypeSelect.selectOption({ label: 'CHECKING' });
    }

    await this.openAccountButton.click();
    await expect(this.newAccountIdLink).toBeVisible({ timeout: 10000 });
    const newAccountId = await this.newAccountIdLink.innerText();
    return newAccountId.trim();
  }
}
