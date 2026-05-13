import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("loads home and navigates between bottom tabs", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/KEBABEATS/);
    await expect(page.getByText("Vinyl Lovers • Party Makers")).toBeVisible();

    const nav = page.getByRole("navigation");
    const mixesTab = nav.getByRole("button", { name: "Mixes" });
    const galleryTab = nav.getByRole("button", { name: "Gallery" });
    const radioTab = nav.getByRole("button", { name: "Radio" });

    await expect(mixesTab).toBeVisible();
    await expect(galleryTab).toBeVisible();
    await expect(radioTab).toBeVisible();

    await galleryTab.click();
    await expect(page.getByAltText("Poster 1")).toBeVisible();

    await radioTab.click();
    await expect(page.getByText("Radio Meuh").first()).toBeVisible();

    await mixesTab.click();
    await expect(page.getByText("Vinyl Lovers • Party Makers")).toBeVisible();
  });
});
