# Functionality Assessment  
**App:** Feature Flags Admin Tool  
**Tester:** Mia Armstrong  
**Date:** July 17, 2025

---

## 1. User Interactions and Workflows

### Organizations Sidebar  
- Displays paginated list of organization IDs  
- User can:
  - Scroll through pages
  - Adjust rows per page (max 100)
  - Search by ID
- Selecting an org updates the flags table

### Feature Flags Table  
- Displays flags for selected org  
- Table includes:
  - Flag Key
  - Description
  - Category
  - Default Value
  - Current Value
  - Actions column
- Columns can be shown/hidden via “Show Columns” modal
- User can:
  - Toggle boolean flags
  - Search/filter by any column (partially functional — see bugs)
  - Sort columns

### Filters and Search  
- Filter inputs on each column  
- Known limitations with filter logic in several columns (documented in bug report)

### Flag Actions  
- Boolean flags can be toggled directly in the table  
- When clicked:
  - PUT request sent to mock API  
  - UI shows updated state immediately (optimistic update)  
  - If error occurs, state reverts and error toast appears  

---

## 2. API Integration and Data Flow

### API Observations
- **GET /orgs** populates the sidebar with org IDs  
- **GET /flags/:orgId** fetches flag state for selected org  
- **PUT /flags/:orgId/:flagKey** updates flag values

### Observed Behaviors  
- API requests are correctly fired on org select and flag toggle  
- On failed PUT, UI rolls back and shows toast — handled gracefully  
- On invalid org search, backend returns empty result but frontend mishandles this (Bug #1)  
- DataGrid updates dynamically based on API response  

---

## 3. Edge Cases & Boundary Conditions

| Case | Behavior | Notes |
|------|----------|-------|
| Org search → no results | ❌ Fails with JSON error | Bug 1 |
| Toggle flag with backend down | ✅ Shows error, UI reverts | Working |
| Hide all columns | ❌ Cannot recover without refresh | Bug 4 |
| Filtering “Current Value” column | ❌ Does not return any results | Bug 5 |
| Invalid row count (e.g. > 100) | ❌ Crashes app | Bug 3 |
| Actions column filter | ❌ No visible effect | Bug 6 |
| No non-boolean flags | ❌ Docs claim support for number/string | Bug 2 & 7 |

---

## Summary  
The app offers a responsive UI and generally accurate API interaction. Core flows work as expected, but several filters, boundary conditions, and error handling behaviors are either broken or misleading. These are covered in the submitted bug report.
