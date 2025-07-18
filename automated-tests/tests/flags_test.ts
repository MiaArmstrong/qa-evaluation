Feature('Feature Flags - Organization Listing').tag("@flags");

import assert from 'assert';

Scenario('List of organizations is rendered on page load',  async ({ I, flagsPage }) => {
    
    const orgs = await I.goToPage("/", "/orgs");
    console.log(orgs)
    assert.ok(Array.isArray(orgs.data) && orgs.data.length > 0, 'Expected at least one organization in API response');

    I.waitForText(orgs.data[0], 10);

    const expectedPaginationText = `1–${orgs.pageSize} of ${orgs.total}`;
    flagsPage.seePaginationText(expectedPaginationText);
});

Scenario('Pagination - Next Page Loads Additional Orgs', async ({ I, flagsPage }) => {
    // Load initial orgs from page 0
    const page0Data = await I.goToPage('/', '/orgs?page=0');
    const page0FirstOrg = page0Data.data[0];
  
    // Click next page and wait for new orgs to load
    const page1Data = await I.waitForResponseAfterClick(
      flagsPage.nextPageButton,
      '/orgs?page=1'
    );
  
    const page1FirstOrg = page1Data.data[0];
  
    // Assert that it's a different org
    assert.notStrictEqual(
      page1FirstOrg,
      page0FirstOrg,
      'Expected a different org to be loaded on the next page'
    );
  
    // Assert that the org ID appears in the UI
    I.waitForText(page1FirstOrg, 10);
  });

  Scenario('Pagination - Changing page size updates results', async ({ I, flagsPage }) => {
    // Go to the homepage and wait for the initial data to load
    await I.goToPage('/', '/orgs?page=0');
  
    // Grab the dropdown options dynamically
    const options = await flagsPage.getPaginationOptions();
    I.say(`Found pagination options: ${options.join(', ')}`);
  
    for (const option of options) {
        I.say(`Testing page size: ${option}`);
      
        // Select a new page size
        await flagsPage.selectPageSize(option);
      
        // Wait for updated data to load on next page
        const page = 1;
        const pageSize = parseInt(option);
      
        const data = await I.waitForResponseAfterClick(
          flagsPage.nextPageButton,
          `/orgs?page=${page}&pageSize=${pageSize}`
        );
      
        assert.strictEqual(
          data.data.length,
          pageSize,
          `Expected ${pageSize} orgs, but got ${data.data.length}`
        );
      
        const start = page * pageSize + 1;
        const end = start + data.data.length - 1;
        const expectedText = `${start}–${end} of ${data.total}`;
      
        flagsPage.seePaginationText(expectedText);
      
        // Reset before next iteration
        I.refreshPage();
        I.waitForElement(flagsPage.paginationText, 5);
      }
  });

  Scenario('Load flags for specific organization via sidebar input', async ({ I, flagsPage }) => {
    // Go to home and load orgs
    const orgs = await I.goToPage('/', '/orgs?page=0');
  
    const targetOrg = orgs.data[0]; // Use a real org ID
  
    // Enter org ID in sidebar input
    I.fillField(flagsPage.sidebarSearchInput, targetOrg);
  
    // Wait for flags to load
    const flags = await I.waitForResponseAfterClick(
        flagsPage.loadFlagsButton,
      `/flags/${targetOrg}`
    );
  });

    Scenario('Invalid Org Search Doesn’t Default Back to First Org Flags', async ({ I, flagsPage }) => {
        //Load initial org list
        await I.goToPage('/', '/orgs?page=0');
      
        //Search for an org that doesn’t exist
        I.fillField(flagsPage.sidebarSearchInput, 'no-such-org-xyz');
        I.click(flagsPage.loadFlagsButton);
      
        //Expect an error message
        I.waitForText('Error fetching feature flags', 5);
      
        //Also the flags table should be empty
        const rowCount = await I.grabNumberOfVisibleElements(flagsPage.flagRows);
        assert.strictEqual(
          rowCount,
          0,
          'Expected no flags to be displayed when org is invalid'
        );
    });
 
    Scenario('Toggle Flag - Optimistic UI and PUT request', async ({ I, flagsPage }) => {
    
        const orgs = await I.goToPage('/', '/orgs?page=0');
        const orgId = orgs.data[0]; // Use a real org ID
        
        // Load flags for specific org first
        I.fillField(flagsPage.sidebarSearchInput, orgId);
        const flags = await I.waitForResponseAfterClick(
            flagsPage.loadFlagsButton,
        `/flags/${orgId}`
        );

        // Get keys and pick a random one
        const flagKeys = Object.keys(flags);
        const flagKey = flagKeys[Math.floor(Math.random() * flagKeys.length)];
        const flagValue = flags[flagKey];
    
        // Click the toggle and wait for the PUT request
        const toggleResponse = await I.waitForResponseAfterClick(
            flagsPage.flagToggle(flagKey),
            `/flags/${orgId}/${flagKey}`
        );
        
        // Assert the API actually flipped the flag
        assert.strictEqual(
            toggleResponse.value,
            !flagValue,
            `Expected API to update flag "${flagKey}" to ${!flagValue}, but got ${toggleResponse.value}`
        );
        
        // Now assert the UI switched too
        if (!flagValue) {
            I.seeCheckboxIsChecked(flagsPage.flagToggle(flagKey));
        } else {
            I.dontSeeCheckboxIsChecked(flagsPage.flagToggle(flagKey));
        }   
    });