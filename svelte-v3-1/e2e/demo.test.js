import { expect, test } from '@playwright/test';

test.describe('Venture Audit Form', () => {
test('should show proper form validation', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('h1')).toHaveText('Venture Audit');
	await expect(page.locator('button[type="submit"]')).toBeDisabled();

	await expect(page.locator('p:has-text("required fields unanswered")')).toBeVisible();
});

test('should allow form submission when all fields are filled', async ({ page }) => {
	await page.goto('/');

	await page.fill('#name', 'Test Two');
	await page.fill('#email', 'test2@example.com');

	// Select the 1st option
	const questionGroups = await page.locator('fieldset').all();
	for (const fieldset of questionGroups) {
		const firstRadio = await fieldset.locator('input[type="radio"]').first();
		await firstRadio.click();
	}

	// Submit Button
	await expect(page.locator('button[type="submit"]')).toBeEnabled();

	// Submit
	await page.click('button[type="submit"]');

	// Results
	await expect(page.locator('h3:has-text("Your Venture Audit Results")')).toBeVisible();
	await expect(page.locator('canvas#radar-chart')).toBeVisible();
});

test('should allow taking the assessment again after submission', async ({ page }) => {
	await page.goto('/');

	await page.fill('#name', 'Test Three');
	await page.fill('#email', 'test3@example.com');

	const questionGroups = await page.locator('fieldset').all();
	for (const fieldset of questionGroups) {
		const firstRadio = await fieldset.locator('input[type="radio"]').first();
		await firstRadio.click();
	}

	await page.click('button[type="submit"]');

	// Verify the results page
	await expect(page.locator('h3:has-text("Your Venture Audit Results")')).toBeVisible();

	// Click on "Take Assessment Again" button
	await page.click('button:has-text("Take Assessment Again")');

	// Verify back at the form
	await expect(page.locator('input#name')).toBeVisible();
	await expect(page.locator('input#name')).toHaveValue('');
	await expect(page.locator('input#email')).toHaveValue('');
});

});