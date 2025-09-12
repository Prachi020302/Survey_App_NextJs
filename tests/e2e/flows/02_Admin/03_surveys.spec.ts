import { test, Page, expect } from "@playwright/test";
import { login } from "../../helpers/login";
import { adminEmail, adminPassword } from "../../constants/login.mockdata";
import { Surveys } from "@/locales/surveys";

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await login(page, adminEmail, adminPassword);
  await page.getByTestId("menu-button").first().click();
  await page.getByTestId("surveys").first().waitFor({ state: "visible" });
  await page.getByTestId("surveys").first().click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/surveys") && response.status() === 200
  );
  await page.waitForTimeout(2000);
});

test.afterAll(async () => {
  await page.close();
});

test.describe("Admin Survey List Flow", () => {
  test("should display survey list page", async () => {
    const title = page.getByTestId("survey-list-title");
    expect(await title.textContent()).toBe(Surveys.surveyList.title);
    await page.mouse.wheel(0, 50);
    expect(await page.getByTestId("survey-title-7").textContent()).toBe(
      "Test Survey"
    );
    expect(await page.getByTestId("survey-description-7").textContent()).toBe(
      "Test Description"
    );
    expect(page.getByTestId("delete-survey-button-7")).toBeVisible();
    expect(await page.getByTestId("survey-status-7").textContent()).toBe(
      "Active"
    );
    expect(page.getByTestId("survey-toggle-7")).toBeVisible();
  });

  test("toggle the active status of a survey", async () => {
    await page.mouse.wheel(0, 50);
    const toggle = page.getByTestId("survey-toggle-8");
    await toggle.first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/surveys") && response.status() === 200
    );
    await toggle.first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/surveys") && response.status() === 200
    );
  });

  test("take a survey from admin user", async () => {
    await page.mouse.wheel(0, 50);
    await page.getByTestId("take-survey-button-7").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/add-response?surveyId") &&
        response.status() === 200
    );
    await expect(page.getByTestId("response-alert")).toHaveText(
      "You are viewing this survey as an Admin. All fields are disabled."
    );

    await page.getByTestId("cancel-button").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/surveys") && response.status() === 200
    );
  });

  test("delete a survey from admin user", async () => {
    await page.mouse.wheel(0, 50);
    await page.getByTestId("delete-survey-button-8").first().click();
    await page.getByTestId("confirm-delete-button").click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/surveys/") && response.status() === 200
    );
    await expect(page.getByTestId("survey-title-8")).not.toBeVisible();
  });
});
