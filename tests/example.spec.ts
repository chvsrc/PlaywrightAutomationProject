import { chromium, expect, test } from '@playwright/test';

const log = async (page) => {
  while (true) {
    const [response] = await Promise.all([
      page.waitForResponse(res => res.status() == 200
        &&
        res.url().toString().includes("days")
      ),
    ]);
    const responseData = await response.json();
    console.log(responseData);
  }
}

const googleVoiceNotification = async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"]
  });
  const context = await browser.newContext({});
  const page = await context.newPage();
  const navigationPromise = page.waitForNavigation({
    waitUntil: "domcontentloaded",
  });
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://voice.google.com');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByLabel('Email or phone').click();
  await page.getByLabel('Email or phone').fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter your password').click();
  await page.getByLabel('Enter your password').fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter a name or number').click();
  await page.getByLabel('Enter a name or number').fill('');
  await page.waitForTimeout(500);
  await page.keyboard.down('Enter');
}

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {

  // await googleVoiceNotification();

  // log(page);

  // await page.waitForTimeout(3000000);

  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // create a locator
  const getStarted = page.locator('text=Get Started');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});