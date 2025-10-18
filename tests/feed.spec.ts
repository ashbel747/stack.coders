import { test, expect } from "@playwright/test";

test.describe("Community Feed Page", () => {
  test("renders feeds when available", async ({ page }) => {

    await page.goto("/feed");
    await expect(page.getByTestId("feed-title")).toBeVisible();
    await expect(page.getByTestId("feed-list")).toBeVisible();
  });
});
