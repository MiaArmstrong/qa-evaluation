# E2E Test Framework for Feature Flags Admin

This repository contains end‑to‑end tests for the Coalesce Feature Flags Admin tool, built with [CodeceptJS](https://codecept.io/) and [Playwright](https://playwright.dev/).

---

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Mock API running at `http://localhost:4000`
- Frontend running at `http://localhost:5173`

---

## Installation

### 1. Clone this repo and `cd` into it  
### 2. Install dependencies  
```bash
   npm install
   # or
   yarn install
```
## Start your mock API and frontend in separate terminals:

```bash
npm run mock-api    # launches mock server on port 4000
npm run dev         # launches app on port 5173
```
## Running Tests

- Standard Run: 
```bash
npx codeceptjs run
```
- Verbose + debug + HTML report
```bash
npx codeceptjs run
  --verbose
  --debug 
  --reporter mochawesome
```
- Parallel execution (2 workers)
```bash
npx codeceptjs run-workers 2 
  --verbose
  --debug
  --reporter mochawesome
```
## Key Customizations

### 1. Custom actor methods (steps_file.ts)
```typescript
I.goToPage(path, apiEndpoint)
```
Navigates to a URL and waits for the matching API response before proceeding.
```typescript
I.waitForResponseAfterClick(locator, apiEndpoint)
```
Clicks a UI element (or presses Enter) and waits for the matching network call.

These keep our tests in sync with backend requests instead of using fixed timeouts.

### 2. codecept.conf.ts highlights
  - Playwright helper pointed at http://localhost:5173

  - screenshotOnFail plugin captures a PNG in output/ on every failure

  - mochawesome reporter configured for HTML/JSON output

  - Session restart set to "session" so the browser stays open between scenarios

## Screenshots & Reporting

- On any test failure, a screenshot is saved in output/

- The Mochawesome HTML report embeds those screenshots and gives a clear pass/fail summary

---

## You can slot this whole suite into your CI/CD pipeline in just a few steps:

### 1. Trigger on PRs & Merges
Configure your pipeline (GitHub Actions, GitLab CI, CircleCI, etc.) to kick off whenever someone opens or updates a pull‑request against main (or merges to main/develop).

### 2. Install & Build

  - Install your Node dependencies (npm ci or yarn --frozen-lockfile)

  - Build your front‑end app (npm run build or npm run dev -- --headless)

  - Start your mock API (npm run mock-api)

  - Serve your built app (e.g. serve -s dist or npm run preview)

### 3. Run E2E Suite

  - Invoke CodeceptJS in headless mode:

```bash
npx codeceptjs run --verbose --reporter mochawesome
```
Or for a faster feedback loop, run in parallel workers:

```bash
npx codeceptjs run-workers 5 --verbose --reporter mochawesome
```
### 4. Publish & Fail‑Fast

  - Fail the build if any scenario errors out (exit code ≠ 0)

  - Collect artifacts:

    - Mochawesome JSON/HTML report

    - output/*.png screenshots on failure

  - Optionally upload those to your CI’s artifacts store or attach them to the PR

### 5. Feedback to Developers

  - Your CI status badge immediately shows pass/fail

  - Developers can click through the HTML report to see exactly which step or network call failed, plus a screenshot

## Example (GitHub Actions)
```yaml
name: E2E Tests

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  e2e:
    runs-on: ubuntu-latest
    services:
      mock-api:
        image: node:16
        # your repo is mounted into /github/workspace by default
        working-directory: /github/workspace
        command: sh -c "npm ci && npm run mock-api"
        ports: ["4000:4000"]
    steps:
      - uses: actions/checkout@v3

      # Install your dependencies (including wait‑on for health checks)
      - name: Install dependencies
        run: npm ci

      # Wait until your mock API is responding
      - name: Wait for Mock API to be up
        run: npx wait-on http://localhost:4000/orgs

      # Build your front end
      - name: Build front‑end
        run: npm run build

      # Serve it in the background
      - name: Serve front‑end
        run: npx serve -s dist -l 5173 &

      # Wait until your front end is responding
      - name: Wait for front‑end to be up
        run: npx wait-on http://localhost:5173

      # Run your CodeceptJS + Playwright suite, with verbose logs and Mochawesome reporting
      - name: Run E2E suite
        run: npx codeceptjs run --verbose --debug --reporter mochawesome

      # Upload any screenshots captured on failure
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        with:
          name: e2e-screenshots
          path: output/*.png

      # Upload the Mochawesome HTML/JSON report
      - name: Upload test report
        uses: actions/upload-artifact@v3
        with:
          name: mochawesome-report
          path: mochawesome-report/*
```
With this in place, every PR will automatically spin up your mock‑server and app, execute the CodeceptJS/Playwright scenarios, and give you a pass/fail signal (plus rich HTML + screenshots) right in your pull‑request checks.

## QA Metrics Dashboard

A Grafana‑backed dashboard for key test KPIs (pass rate, flake rate, coverage %, PR feedback time). See [QA Metrics Dashboard Design](docs/qa‑metrics‑dashboard.md) for details.

### That’s it! You now have a simple, network‑aware E2E suite you can run locally or in CI. Happy testing!