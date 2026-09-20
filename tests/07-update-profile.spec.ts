import { test, expect } from '@playwright/test';
import { registerDynamicUser } from '../utils/testHelper';
import { UpdateProfilePage } from '../pages/UpdateProfilePage';
import profileData from '../data/profileData.json';

test.describe('ParaBank - Update Contact Info Suite', () => {
  test('TC-01: Should successfully update customer contact information', async ({ page }) => {
    // 1. Dynamic user registration
    await registerDynamicUser(page);

    // 2. Navigate to Update Profile
    const profilePage = new UpdateProfilePage(page);
    await profilePage.goto();

    // 3. Update address and phone with external test data
    await profilePage.updateContactInfo(profileData.updatedProfile);

    // 4. Assert profile update confirmation
    await expect(profilePage.successTitle).toHaveText('Profile Updated');
    await expect(profilePage.successMessage).toContainText('Your updated address and phone number have been added');
  });
});
