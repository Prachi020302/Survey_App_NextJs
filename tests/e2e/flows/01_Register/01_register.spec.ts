import { Page, test } from "@playwright/test";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3000/login");
  await page.getByTestId("register-link").first().click();
});

test.afterAll(async () => {
  await page.close();
});

test.describe("User Registration Flow", () => {
  test("check the register form validation", async () => {
    await page.getByTestId("register-button").first().click();
    await page.getByText("First name is required").isVisible();
    await page.getByText("Last name is required").isVisible();
    await page.getByText("Email is required").isVisible();
    await page.getByText("Password is required").isVisible();
  });

  test("check the validation for invalid email and short password", async () => {
    const firstName = page.getByTestId("firstName").locator("input");
    const lastName = page.getByTestId("lastName").locator("input");
    const email = page.getByTestId("email").locator("input");
    const password = page.getByTestId("password").locator("input");

    await firstName.click();
    await firstName.fill("Test");
    await lastName.click();
    await lastName.fill("User");
    await email.click();
    await email.fill("invalid-email");
    await password.click();
    await password.fill("123");
    await page.getByTestId("register-button").first().click();
    await page.getByText("Email must be a valid email").isVisible();
    await page.getByText("Password must be at least 6 characters").isVisible();
  });

  test.skip("register a new user", async () => {
    const firstName = page.getByTestId("firstName").locator("input");
    const lastName = page.getByTestId("lastName").locator("input");
    const email = page.getByTestId("email").locator("input");
    const password = page.getByTestId("password").locator("input");

    const uniqueEmail = `testuser_02@yopmail.com`;
    await firstName.click();
    await firstName.fill("Test");
    await lastName.click();
    await lastName.fill("User");
    await email.click();
    await email.fill(uniqueEmail);
    await password.click();
    await password.fill("password123");
    await page.getByTestId("register-button").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/register") && response.status() === 200
    );
  });
});
