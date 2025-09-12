import { test, Page, expect } from "@playwright/test";
import { login } from "../../helpers/login";
import { adminEmail, adminPassword } from "../../constants/login.mockdata";
import { Surveys } from "@/locales/surveys";

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await login(page, adminEmail, adminPassword);
  await page.getByTestId("menu-button").first().click();
  await page.getByTestId("add-survey").first().waitFor({ state: "visible" });
  await page.getByTestId("add-survey").first().click();
  await page.waitForTimeout(2000);
});

test.afterAll(async () => {
  await page.close();
});

test.describe("Admin Add Survey Flow", () => {
  test("should display add survey form", async () => {
    const title = page.getByTestId("add-survey-title");
    expect(await title.textContent()).toBe(Surveys.addSurvey.title);
    expect(page.getByTestId("title")).toBeVisible();
    expect(page.getByTestId("description")).toBeVisible();
    expect(await page.getByTestId("no-survey").textContent()).toBe(
      Surveys.addSurvey.noSurveyText
    );
  });

  test("check the validation", async () => {
    await page.getByTestId("add-text-field").first().click();
    await page.getByTestId("add-survey-submit").first().click();

    await expect(
      page.locator("p.MuiFormHelperText-root", {
        hasText: "Survey title is required",
      })
    ).toBeVisible();
  });

  test("add and remove a field", async () => {
    await page.getByTestId("add-text-field").first().click();
    await page.getByTestId("add-number-field").first().click();
    await page.getByTestId("add-checkbox-field").first().click();
    await page.getByTestId("add-select-field").first().click();
    await page.getByTestId("add-radio-field").first().click();

    for (let i = 0; i < 6; i++) {
      await page.getByTestId("remove-field").first().click();
    }
    await page.waitForTimeout(500);
    await expect(page.getByTestId("no-survey")).toBeVisible();
  });

  test("add a valid fields", async () => {
    await page.getByTestId("title").locator("input").fill("Test Survey");
    await page
      .getByTestId("description")
      .getByRole("textbox")
      .fill("Test Description");

    // text field
    await page.getByTestId("add-text-field").first().click();
    await page.getByTestId("Untitled").first().dblclick();
    await page.getByTestId("edit-label").locator("input").fill("Text");
    await page.press("input", "Enter");

    // number field
    await page.getByTestId("add-number-field").first().click();
    await page.getByTestId("Untitled").first().dblclick();
    await page.getByTestId("edit-label").locator("input").fill("Number");

    // checkbox field
    await page.getByTestId("add-checkbox-field").first().click();
    await page.getByTestId("Untitled").first().dblclick();
    await page
      .getByTestId("edit-label")
      .locator("input")
      .fill("Updated Checkbox");
    await page.getByTestId("add-checkbox-option").first().click();
    await page.getByTestId("add-checkbox").first().dblclick();
    await page
      .getByTestId("add-checkbox-text")
      .first()
      .locator("input")
      .fill("Option 1");

    // select field
    await page.getByTestId("add-select-field").first().click();
    await page.getByTestId("Untitled").first().dblclick();
    await page.getByTestId("edit-label").locator("input").fill("Select");
    await page.getByTestId("add-select-option").first().click();
    await page.getByTestId("add-select").first().dblclick();
    await page
      .getByTestId("add-select-text")
      .first()
      .locator("input")
      .fill("Select 1");

    // radio field
    await page.getByTestId("add-radio-field").first().click();
    await page.getByTestId("Untitled").first().dblclick();
    await page.getByTestId("edit-label").locator("input").fill("Radio");
    await page.getByTestId("add-radio-option").first().click();
    await page.getByTestId("add-radio").first().dblclick();
    await page
      .getByTestId("add-radio-text")
      .first()
      .locator("input")
      .fill("Radio 1");

    // submit survey
    await page.getByTestId("add-survey-submit").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/addSurvey") && response.status() === 201
    );
  });

  test("should reorder fields by drag and drop", async () => {
    await page.goto("http://localhost:3000/addSurvey");
    await page.waitForTimeout(2000);
    await page.getByTestId("title").locator("input").fill("New Survey");
    await page.getByTestId("add-text-field").first().click();
    await page.getByTestId("add-checkbox-field").first().click();

    // Get the drag handles for both fields
    const dragHandle1 = page.getByTestId("drag-button").nth(0);
    const dragHandle2 = page.getByTestId("drag-button").nth(1);

    // Drag the first field below the second field
    const box2 = await dragHandle2.boundingBox();
    if (!box2) {
      throw new Error("Could not get bounding box for drag handle 2");
    }
    await dragHandle1.hover();
    await page.mouse.down();
    await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2, {
      steps: 5,
    });
    await page.mouse.up();
    await page.waitForTimeout(1000); // Wait for the UI to update after drag-and-drop
    // Assert the order has changed
    const labels = await page
      .locator('[data-testid="edit-label"]')
      .allTextContents();
    expect(labels[0]).not.toBe("Untitled"); // The first field should not be the original "Untitled" text field

    // Field name
    await page.getByTestId("Untitled").first().dblclick();
    await page.getByTestId("edit-label").locator("input").fill("Checkbox");

    await page.getByTestId("Untitled").first().dblclick();
    await page.getByTestId("edit-label").locator("input").fill("Text");

    // submit survey
    await page.getByTestId("add-survey-submit").first().click();
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/addSurvey") && response.status() === 201
    );
  });
});
