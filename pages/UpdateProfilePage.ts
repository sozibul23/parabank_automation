import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ProfileUpdateData {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
}

export class UpdateProfilePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly updateProfileButton: Locator;
  readonly successTitle: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[id="customer.firstName"]');
    this.lastNameInput = page.locator('input[id="customer.lastName"]');
    this.addressInput = page.locator('input[id="customer.address.street"]');
    this.cityInput = page.locator('input[id="customer.address.city"]');
    this.stateInput = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput = page.locator('input[id="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[id="customer.phoneNumber"]');
    this.updateProfileButton = page.locator('input[value="Update Profile"]');
    this.successTitle = page.locator('#updateProfileResult h1');
    this.successMessage = page.locator('#updateProfileResult p');
  }

  async goto() {
    await this.navigateTo('/updateprofile.htm');
    // Ensure form is loaded with existing customer data
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async updateContactInfo(data: ProfileUpdateData) {
    if (data.address) await this.addressInput.fill(data.address);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.state) await this.stateInput.fill(data.state);
    if (data.zipCode) await this.zipCodeInput.fill(data.zipCode);
    if (data.phone) await this.phoneInput.fill(data.phone);

    await this.updateProfileButton.click();
  }
}
