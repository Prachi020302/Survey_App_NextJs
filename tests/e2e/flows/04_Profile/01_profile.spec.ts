import { test, Page, expect } from "@playwright/test";
import { login } from "../../helpers/login";
import { userEmail, userPassword } from "../../constants/login.mockdata";
import { Profile } from "@/locales/profile";

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.coverage.startJSCoverage();
  await login(page, userEmail, userPassword);
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/surveys") && response.status() === 200
  );
  await page.waitForTimeout(2000);
});

test.afterAll(async () => {
  await page.close();
});

test.describe("User Profile Flow", () => {
  test("should display user profile page", async () => {
    await page.getByTestId("user-menu-button").first().click();
    await page
      .getByTestId("user-profile-menu-item")
      .first()
      .waitFor({ state: "visible" });
    await page.getByTestId("user-profile-menu-item").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/profile") && response.status() === 200
    );
    const title = page.getByTestId("user-profile-title");
    expect(await title.textContent()).toBe(Profile.title);
    expect(
      await page.getByTestId("firstName").locator("input").inputValue()
    ).toBe("Test");
    expect(
      await page.getByTestId("lastName").locator("input").inputValue()
    ).toBe("User");
    expect(await page.getByTestId("email").locator("input").inputValue()).toBe(
      userEmail
    );
  });

  test("should display the error on empty input", async () => {
    await page.getByTestId("edit-profile-button").first().click();
    await page.getByTestId("firstName").locator("input").fill("");
    await page.getByTestId("lastName").locator("input").fill("");
    await page.getByTestId("email").locator("input").fill("");
    await page.getByTestId("save-profile-button").first().click();
    expect(page.getByText("First name is required")).toBeVisible();
    expect(page.getByText("Last name is required")).toBeVisible();
    expect(page.getByText("Email is required")).toBeVisible();
    await page.getByTestId("cancel-profile-button").first().click();
  });

  test("should update profile successfully", async () => {
    await page.getByTestId("edit-profile-button").first().click();
    await page.getByTestId("firstName").locator("input").fill("John");
    await page.getByTestId("lastName").locator("input").fill("Doe");
    await page
      .getByTestId("email")
      .locator("input")
      .fill(`john.user@yopmail.com`);
    await page.getByTestId("save-profile-button").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/profile") && response.status() === 200
    );
    await page.waitForTimeout(1000); // wait for the success message to disappear
    await expect(page.getByTestId("profile-success-alert")).toHaveText(
      "Profile updated successfully!"
    );
    expect(
      await page.getByTestId("firstName").locator("input").inputValue()
    ).toBe("John");
  });
});
