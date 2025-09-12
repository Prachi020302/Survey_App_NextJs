import { test, Page, expect } from "@playwright/test";
import { login } from "../../helpers/login";
import { userEmail, userPassword } from "../../constants/login.mockdata";
import { Response } from "@/locales/response";

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await login(page, userEmail, userPassword);
  await page.getByTestId("menu-button").first().click();
  await page.getByTestId("my-responses").first().waitFor({ state: "visible" });
  await page.getByTestId("my-responses").first().click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/responses") && response.status() === 200
  );
  await page.waitForTimeout(2000);
});

test.afterAll(async () => {
  await page.close();
});

test.describe("User Response List Flow", async () => {
  test("should display response list page", async () => {
    const title = page.getByTestId("my-response-title");
    expect(await title.textContent()).toBe(Response.list.myResponseTitle);
    const subtitle = page.getByTestId("my-response-subtitle");
    expect(await subtitle.textContent()).toBe(Response.list.myResponseSubTitle);
    await expect(page.locator("th")).toContainText([
      "Survey Title",
      "Description",
      "Submitted Date",
      "Status",
      "Questions Answered",
    ]);
  });

  test("should display no survey data", async () => {
    const noResponse = page.getByTestId("no-response-title");
    expect(await noResponse.textContent()).toBe(Response.list.noResponse);
    const noResponseSubtitle = page.getByTestId("no-response-subtitle");
    expect(await noResponseSubtitle.textContent()).toBe(
      Response.list.startSurveySubTitle
    );
  });
});
