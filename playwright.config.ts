import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  timeout: 60 * 1000,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : 1,
  reporter: [["dot"], ["json", {
    outputFile: "jsonReports/jsonReport.json"
  }], ["html", {
      open: "always"
  }]],
  use: {
    baseURL: 'https://www.edgewordstraining.co.uk/demo-site/',
    trace: 'on',
    headless: process.env.CI ? true : false,
    launchOptions: {args: ["--start-maximized"]},
    viewport: null,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // testMatch: ["eCommerce.spec.tes"]
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome-test',
      use: {
        browserName: 'chromium', 
        headless: false,
        launchOptions: {
          args: ["--start-maximized"],
          //slowMo: 1500
      }},
    },

    {
      name: 'firefox-test', 
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit-test',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
