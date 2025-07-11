Feature('Feature Flags - Organization Listing').tag("@flags");

Scenario('List of organizations is rendered on page load',  ({ I }) => {
    I.amOnPage("/");
});
