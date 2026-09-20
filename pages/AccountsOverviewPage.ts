import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountsOverviewPage extends BasePage {
  readonly accountsTable: Locator;
  readonly accountRows: Locator;
  readonly totalBalance: Locator;
  readonly logoutLink: Locator;
  readonly transferFundsLink: Locator;
  readonly openNewAccountLink: Locator;
  readonly billPayLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountsTable = page.locator('#accountTable');
    this.accountRows = page.locator('#accountTable tbody tr');
    this.totalBalance = page.locator('#accountTable tr:has-text("Total") b');
    this.logoutLink = page.locator('a[href*="logout.htm"]');
    this.transferFundsLink = page.locator('a[href*="transfer.htm"]');
    this.openNewAccountLink = page.locator('a[href*="openaccount.htm"]');
    this.billPayLink = page.locator('a[href*="billpay.htm"]');
  }

  async goto() {
    await this.navigateTo('/overview.htm');
  }

  async waitForAccountsToLoad() {
    await expect(this.accountsTable).toBeVisible();
    await expect(this.accountRows.first()).toBeVisible({ timeout: 15000 });
  }

  async logout() {
    await this.logoutLink.click();
  }
}
