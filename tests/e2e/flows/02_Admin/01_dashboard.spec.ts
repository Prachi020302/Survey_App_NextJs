import { Page, test, expect } from "@playwright/test";
import { login } from "../../helpers/login";
import { adminEmail, adminPassword } from "../../constants/login.mockdata";
import { Surveys } from "@/locales/surveys";
import moment from "moment";

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await login(page, adminEmail, adminPassword);
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/dashboard/analytics") &&
      response.status() === 200
  );
});

test.afterAll(async () => {
  await page.close();
});

test.describe("Admin Dashboard Flow", () => {
  test("default dashboard view", async () => {
    const title = page.getByTestId("dashboard-title");
    expect(await title.textContent()).toBe(Surveys.dashboard.title);
    await expect(page.getByText("Total Surveys")).toBeVisible();
    await expect(page.getByText("Total Responses")).toBeVisible();
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByTestId("total-surveys-card")).toHaveText("7");
    await expect(page.getByTestId("total-responses-card")).toHaveText("5");
    await expect(page.getByTestId("total-users-card")).toHaveText("2");
  });

  test("chart series visibility toggle", async () => {
    const title = page.getByTestId("survey-chart-title");
    expect(await title.textContent()).toBe(Surveys.dashboard.surveyChartTitle);
    await page
      .locator('div.apexcharts-legend-series[seriesname="Surveys"]')
      .first()
      .click();
    await page.waitForTimeout(1000);
    await page
      .locator('div.apexcharts-legend-series[seriesname="Responses"]')
      .first()
      .click();

    await page
      .locator('div.apexcharts-legend-series[seriesname="Surveys"]')
      .first()
      .click();
    await page.waitForTimeout(500);
    await page
      .locator('div.apexcharts-legend-series[seriesname="Responses"]')
      .first()
      .click();
  });

  test("check the dateRange filter", async () => {
    await page.getByTestId("date-range-button").first().click();

    const firstDate = moment().format("D");
    await page
      .locator(
        `//button[contains(@class,'rdrDay') and not(contains(@class,' rdrDayPassive'))]//span[.='${firstDate}']`
      )
      .first()
      .click();

    await page.getByTestId("date-range-cancel-button").first().click();
    await page.waitForTimeout(500);
    await page.getByTestId("date-range-button").first().click();

    const secondDate = moment().format("D");
    await page
      .locator(
        `//button[contains(@class,'rdrDay') and not(contains(@class,' rdrDayPassive'))]//span[.='${secondDate}']`
      )
      .first()
      .click();
    const lastDate = moment().add(1, "day").format("D");
    await page
      .locator(
        `//button[contains(@class,'rdrDay') and not(contains(@class,' rdrDayPassive'))]//span[.='${lastDate}']`
      )
      .first()
      .click();
    await page.getByTestId("date-range-save-button").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/dashboard/analytics") &&
        response.status() === 200
    );
  });
});
