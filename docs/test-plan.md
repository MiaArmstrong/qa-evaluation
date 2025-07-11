# Test Plan – Feature Flags Admin Tool

**Author:** Mia Armstrong  
**Date:** July 11, 2025  
**Environment:** Local development environment (`localhost:5173` with mock API at `localhost:4000`)

---

## Test Objectives

- Validate core workflows for managing feature flags per organization
- Identify and report critical defects affecting reliability, usability, or correctness
- Ensure mock API interactions are functioning as expected
- Establish a foundation for automation to reduce regression risk

---

## Scope of Testing

### In Scope
- Organization list and pagination behavior
- Feature flag table for selected organization
- Toggle behavior for boolean flags (including optimistic UI handling)
- Column filter/sorting/searching in DataGrid
- API interactions (GET, PUT endpoints)
- Error handling in the UI

### Out of Scope
- Authentication or role-based access control (not implemented)
- Performance or load testing (not required for mock environment)
- Testing real production environments

---

## Types of Testing

- **Functional UI Testing**: Validate that user-facing features work as expected
- **API Testing**: Confirm expected responses for GET/PUT requests to mock API
- **Boundary Testing**: Test extreme input values (e.g., row count selectors)
- **Exploratory Testing**: Free-form bug discovery
- **Regression Testing**: Ensure basic functionality is not broken by future changes
- **Negative Testing**: Validate error states and invalid inputs (e.g. org not found)

---

## Test Prioritization by Risk

| Area                             | Risk Level | Rationale |
|----------------------------------|------------|-----------|
| Toggle flag functionality        | High       | Critical to primary app purpose |
| Org list pagination/search       | Medium     | Impacts usability but not correctness |
| Column visibility + filters      | Medium     | Known bugs, impacts UX |
| Non-existent org ID behavior     | High       | Causes misleading errors, confusing fallback |
| PUT failure recovery             | High       | UI reverts state, must behave correctly |
| Value filtering                  | Medium     | Broken logic affects findability |
| Optimistic UI updates            | Medium     | Potential race conditions if desynced |