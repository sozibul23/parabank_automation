import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PayeeData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  accountNumber: string;
  verifyAccount: string;
  amount: string;
}

export class BillPayPage extends BasePage {
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly accountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly sendPaymentButton: Locator;
  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountIdSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('input[value="Send Payment"]');
    this.successTitle = page.getByRole('heading', { name: 'Bill Payment Complete' });
    this.successMessage = page.locator('#billpayResult p').first();
    this.errorMessage = page.locator('.error');
  }

  async goto() {
    await this.navigateTo('/billpay.htm');
  }

  async fillBillPayment(data: Partial<PayeeData>) {
    if (data.name !== undefined) await this.payeeNameInput.fill(data.name);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.accountNumber !== undefined) await this.accountNumberInput.fill(data.accountNumber);
    if (data.verifyAccount !== undefined) await this.verifyAccountInput.fill(data.verifyAccount);
    if (data.amount !== undefined) await this.amountInput.fill(data.amount);
  }

  async submitPayment() {
    await this.sendPaymentButton.click();
  }
}
