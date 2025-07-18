const { I } = inject();

export = {

  // Locators
  paginationDropdownButton: '.MuiTablePagination-input div[role="combobox"]', //data-testid="ArrowDropDownIcon"
  paginationMenu: 'ul[role="listbox"]',//id=":r7:"
  paginationOption: (number: string) => `[data-value="${number}"]`,
  paginationText: '.MuiTablePagination-displayedRows',
  nextPageButton: 'button[aria-label="Go to next page"]', //data-testid="KeyboardArrowRightIcon"
  allPaginationOptions: '[role="option"]',
  sidebarSearchInput: '#\\:r1\\:',
  loadFlagsButton: 'button:has-text("LOAD FLAGS")',
  flagToggle: (flagKey: string) => `div[data-id="${flagKey}"] input[type="checkbox"]`,
  flagRows: '[data-field="flagKey"]',

  // Actions

  /**
   * Clicks the "Next page" button and waits for the pagination text to update.
   * @returns {void}
   * @example
   *   flagsPage.goToNextPage();
   */
  goToNextPage: function (): void {
    I.click(this.nextPageButton);
    I.waitForElement(this.paginationText, 10);
  },

  /**
   * Asserts that the pagination display matches the expected string.
   * @param {string} expected - Expected pagination string, e.g. "1–20 of 1000".
   * @returns {void}
   * @example
   *   flagsPage.seePaginationText('1–20 of 1000');
   */
  seePaginationText: function (expected: string): void {
    I.see(expected, this.paginationText);
  },

   /**
   * Checks whether the pagination dropdown menu is currently open.
   * @returns {Promise<boolean>} Resolves to true if the menu popover is visible.
   * @example
   *   const open = await flagsPage.isPaginationMenuOpen();
   */
  isPaginationMenuOpen: async function (): Promise<boolean> {
    return await I.grabNumberOfVisibleElements(this.paginationMenu) > 0;
  },

  /**
   * Opens the pagination dropdown and grabs all numeric page-size options.
   * @returns {Promise<string[]>} A list of option texts (e.g. ["10", "20", "50", "100"]).
   * @example
   *   const opts = await flagsPage.getPaginationOptions();
   */
  getPaginationOptions: async function(): Promise<string[]> {
    I.waitForElement(this.paginationDropdownButton, 5);
    I.click(this.paginationDropdownButton);
    const options = await I.grabTextFromAll(this.allPaginationOptions);
    return options.map(text => text.trim()).filter(t => /^\d+$/.test(t));
  }, 

  /**
   * Selects a page-size value from the pagination dropdown.
   * @param {string} option - The numeric page size to select (e.g. "50").
   * @returns {Promise<void>}
   * @example
   *   await flagsPage.selectPageSize("50");
   */
  selectPageSize: async function(option: string): Promise<void> {
    const { I } = inject();
  
    I.say(`Selecting page size: ${option}`);
    
    // Open the dropdown
    if(!(await this.isPaginationMenuOpen())) I.click(this.paginationDropdownButton);
  
    // Wait for dropdown menu to be visible
    I.waitForElement(locate(this.paginationMenu), 5);
  
    // Click the desired option from the popover menu
    I.click(this.paginationOption(option));
  
    // Wait for dropdown to close (popover disappears)
    I.waitForInvisible(locate(this.paginationMenu), 5);
  }
 
};