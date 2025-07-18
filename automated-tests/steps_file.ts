// in this file you can append custom step methods to 'I' object
import { config } from 'codeceptjs';
import assert from 'assert';

export = function() {
  const baseUrl: string = config.get().helpers.Playwright.url;

  return actor({

   /**
   * Navigates to a given relative path and waits for a specific network response.
   *
   * This custom function constructs the full URL based on the configured base URL and a provided relative path,
   * navigates to the page, and waits for a network response that matches the provided API endpoint.
   * It returns the parsed JSON response from that network call.
   *
   * @param {string} relativePath - The path to navigate to (e.g. '/', '/dashboard', etc.).
   * @param {string} apiEndpoint - A substring of the API endpoint URL to wait for in the network response (e.g. '/orgs').
   * @returns {Promise<any>} Parsed JSON data from the matched API response.
   *
   * @example
   * const orgs = await I.goToPage('/', '/orgs');
   */
    goToPage: async function (relativePath: string, apiEndpoint: string, expectedStatus: number = 200): Promise<any> {
      return this.usePlaywrightTo('navigate and wait for API response', async ({ page }) => {
        let response: any;

        const fullUrl = baseUrl.endsWith('/') || relativePath.startsWith('/')
          ? baseUrl + relativePath.replace(/^\/+/, '')
          : `${baseUrl}/${relativePath}`;
    
        await Promise.all([
          page.waitForResponse((res) => res.url().includes(apiEndpoint), { timeout: 60000 })
            .then((res) => { response = res; }),
          page.goto(fullUrl, { waitUntil: 'domcontentloaded' }),
        ]);
    
        assert(await response.status() === expectedStatus, `Response code is unexpected: ${await response.status()}`);
        const data = await response.json();
        return data;
      });
    },

   /**
   * Clicks an element (or presses Enter) and waits for a matching API response.
   *
   * Useful for verifying that a UI interaction triggers the correct network request and
   * receiving the response payload for further assertions.
   *
   * @param {string} locator - Selector for the clickable element, or the string "ENTER" to use keyboard interaction.
   * @param {string} apiEndpoint - Substring to match in the response URL.
   * @param {number} [expectedStatus=200] - Optional expected HTTP status code of the response.
   * @returns {Promise<any>} Parsed JSON response from the network call.
   *
   * @example
   * const result = await I.waitForResponseAfterClick('[data-testid="save-button"]', '/api/flags');
   *
   * @example
   * const result = await I.waitForResponseAfterClick('ENTER', '/api/search');
   */
  waitForResponseAfterClick: async function (locator: string, apiEndpoint: string, expectedStatus: number = 200): Promise<any> {
    return this.usePlaywrightTo('click and wait for API response', async ({ page }) => {
    let response: any;

    await Promise.all([
      page.waitForResponse((res) => res.url().includes(apiEndpoint), { timeout: 60000 })
        .then((res) => { response = res; }),
      locator === 'ENTER'
        ? page.keyboard.press('Enter')
        : page.locator(locator).click(),
    ]);

    assert(
      await response.status() === expectedStatus,
      `Response code is unexpected: ${await response.status()}`
    );

    const data = await response.json();
    return data;
    });
  }
  
})}
