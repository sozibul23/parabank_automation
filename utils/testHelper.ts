import { Page } from '@playwright/test';
import { RegisterPage, CustomerData } from '../pages/RegisterPage';

/**
 * Generates unique random customer data for dynamic testing.
 */
export function generateRandomCustomer(): CustomerData {
  const randomId = Math.floor(Math.random() * 900000) + 100000;
  return {
    firstName: 'TestFirst',
    lastName: 'TestLast',
    address: '123 Innovation Drive',
    city: 'Metropolis',
    state: 'NY',
    zipCode: '10001',
    phone: '555-0199',
    ssn: `${randomId}`,
    username: `user_${randomId}`,
    password: 'Password123!'
  };
}

/**
 * Creates a new user dynamically and leaves the page logged in.
 */
export async function registerDynamicUser(page: Page): Promise<CustomerData> {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  const customer = generateRandomCustomer();
  await registerPage.fillRegistrationForm(customer);
  await registerPage.submitRegistration();
  return customer;
}
