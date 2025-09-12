import { Page } from "@playwright/test";

export const login = async (page: Page, email: string, password: string) => {
  await page.goto("http://localhost:3000/login");
  const emailInput = page.getByTestId("email").locator("input");
  const passwordInput = page.getByTestId("password").locator("input");
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.getByTestId("login-button").click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/login") && response.status() === 200
  );
};
