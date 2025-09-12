import { test, Page, expect } from "@playwright/test";
import { login } from "../../helpers/login";
import { userEmail, userPassword } from "../../constants/login.mockdata";
import { Surveys } from "@/locales/surveys";
import { Response } from "@/locales/response";

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

test.describe("User Add Survey Flow", () => {
  test("should display survey list page", async () => {
    const title = page.getByTestId("survey-list-title");
    expect(await title.textContent()).toBe(Surveys.surveyList.title);
    await page.mouse.wheel(0, 50);
    for (let i = 0; i < 7; i++) {
      expect(page.getByTestId(`survey-title-${i}`)).toBeVisible();
      expect(page.getByTestId(`survey-description-${i}`)).toBeVisible();
      expect(page.getByTestId(`delete-survey-button-${i}`)).not.toBeVisible();
      expect(page.getByTestId(`survey-toggle-${i}`)).toBeVisible();
    }
  });

  test("should render correct input field for each question type", async () => {
    for (let i = 0; i < 7; i++) {
      await page.getByTestId(`take-survey-button-${i}`).first().click();
      await page.waitForResponse(
        (response) =>
          response.url().includes("/add-response?surveyId") &&
          response.status() === 200
      );
      await page.waitForTimeout(1000);

      if (await page.getByTestId("text").isVisible()) {
        expect(page.getByTestId("text")).toBeVisible();
      }
      if (await page.getByTestId("number").isVisible()) {
        expect(page.getByTestId("number")).toBeVisible();
      }
      if (await page.getByTestId("checkbox").isVisible()) {
        expect(page.getByTestId("checkbox")).toBeVisible();
      }
      if (await page.getByTestId("select").isVisible()) {
        expect(page.getByTestId("select")).toBeVisible();
      }
      if (await page.getByTestId("radio").isVisible()) {
        expect(page.getByTestId("radio")).toBeVisible();
      }
      // Go back after checking
      await page.getByTestId("cancel-button").first().click();
    }
  });

  test("check the validation of the survey response form", async () => {
    await page.getByTestId("take-survey-button-7").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/add-response?surveyId") &&
        response.status() === 200
    );
    await page.getByTestId("text").locator("input").fill("Text");
    await page.waitForTimeout(1000);

    await page.getByTestId("number").locator("input").fill("2");
    await page.waitForTimeout(1000);
    await page.getByTestId("text").locator("input").fill("Text");

    await page.getByTestId("submit-response-button").first().click();

    expect(await page.getByTestId("checkbox-error").textContent()).toBe(
      Response.error.checkBoxError
    );
    expect(await page.getByTestId("select-error").textContent()).toBe(
      Response.error.requiredField
    );
    expect(await page.getByTestId("radio-error").textContent()).toBe(
      Response.error.requiredField
    );
    await expect(page.getByTestId("survey-alert")).toHaveText(
      Response.error.allRequired
    );
    await page.getByTestId("cancel-button").first().click();
  });

  test("add the valid survey response", async () => {
    await page.getByTestId("take-survey-button-7").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/add-response?surveyId") &&
        response.status() === 200
    );
    await page.getByTestId("text").locator("input").fill("Survey");
    await page.waitForTimeout(1000);
    await page.getByTestId("number").locator("input").fill("10");
    await page.waitForTimeout(1000);
    await page.getByTestId("text").locator("input").fill("Survey");

    await page.getByTestId("checkbox-option-0").first().click();
    await page.getByTestId("select").first().click();
    await page.getByTestId("select-option-0").first().click();
    await page.getByTestId("radio-option-0").first().click();
    await page.getByTestId("submit-response-button").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/responses") && response.status() === 200
    );
  });

  test("should display the response in response list page", async () => {
    await page.waitForTimeout(500);
    await page.goto("http://localhost:3000/my-responses");
    const row = page.locator("tr", { hasText: "Test Survey" });

    await expect(row).toContainText("Test Survey");
    await expect(row).toContainText("Test Description");
    await expect(row).toContainText("completed");
    await expect(row).toContainText("5 questions");
  });
});
