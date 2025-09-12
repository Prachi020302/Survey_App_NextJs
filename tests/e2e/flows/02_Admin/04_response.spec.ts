import { test, Page, expect } from "@playwright/test";
import { login } from "../../helpers/login";
import { adminEmail, adminPassword } from "../../constants/login.mockdata";
import { Response } from "@/locales/response";

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await login(page, adminEmail, adminPassword);
  await page.getByTestId("menu-button").first().click();
  await page.getByTestId("response-list").first().waitFor({ state: "visible" });
  await page.getByTestId("response-list").first().click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/responses") && response.status() === 200
  );
  await page.waitForTimeout(2000);
});

test.afterAll(async () => {
  await page.close();
});

test.describe("Admin Response List Flow", async () => {
  test("should display response list page", async () => {
    const title = page.getByTestId("response-list-title");
    expect(await title.textContent()).toBe(Response.list.title);
    const subtitle = page.getByTestId("response-list-subtitle");
    expect(await subtitle.textContent()).toBe(Response.list.subTitle);
    await expect(page.locator("th")).toContainText([
      "Survey Title",
      "User ID",
      "Submitted Date",
      "Status",
      "Questions Answered",
      "Actions",
    ]);
  });

  test("should display all the response of the survey", async () => {
    for (let i = 0; i < 5; i++) {
      await page.getByTestId(`view-response-button-${i}`).first().click();
      await page.waitForResponse(
        (response) =>
          response.url().includes(`/response-detail?responseId`) &&
          response.status() === 200
      );
      await page.waitForTimeout(500);
      expect(page.getByTestId("response-details-title")).toBeVisible();
      expect(page.getByTestId("response-details-summary")).toBeVisible();
      expect(page.getByTestId("response-details-answers")).toBeVisible();
      await page.getByTestId("back-button").first().click();
    }
  });
});
