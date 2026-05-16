import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const outputDir = path.join(root, "demo-recordings");
await fs.mkdir(outputDir, { recursive: true });

const pause = (ms = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  recordVideo: {
    dir: outputDir,
    size: { width: 1440, height: 960 }
  }
});
const page = await context.newPage();

async function login(email, password) {
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await pause(1600);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForLoadState("networkidle");
  await pause(8000);
}

async function openTab(name) {
  await page.getByRole("button", { name }).click();
  await page.waitForLoadState("networkidle");
  await pause(11000);
}

await login("admin@teamtask.local", "Password@123");
await openTab("Projects");
await openTab("Tasks");
await openTab("Team");
await openTab("Dashboard");
await pause(10000);

await page.getByRole("button", { name: "Sign out" }).first().click();
await pause(5000);

await login("arjun@teamtask.local", "Password@123");
await openTab("Tasks");
const finalizeRow = page.locator("tr", { hasText: "Finalize dashboard UI" });
if (await finalizeRow.count()) {
  await finalizeRow.locator("select").selectOption("done");
  await page.waitForLoadState("networkidle");
  await pause(10000);
}
await openTab("Dashboard");
await pause(12000);

await context.close();
await browser.close();

const videoPath = await page.video().path();
const finalPath = path.join(outputDir, "team-task-manager-demo.webm");
await fs.copyFile(videoPath, finalPath);
console.log(finalPath);
