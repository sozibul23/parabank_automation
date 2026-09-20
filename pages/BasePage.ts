import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '') {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullPath = cleanPath.startsWith('/parabank') ? cleanPath : `/parabank${cleanPath}`;
    await this.page.goto(fullPath);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
