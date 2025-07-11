# Feature Flags Admin Tool - Quality Engineering Evaluation

## Overview

Welcome to the Feature Flags Admin Tool Quality Engineering evaluation! This is a **fully functional React application** with a mock API backend that manages feature flags for multiple organizations. Your task is to evaluate the application's quality, identify bugs, and create test a first pass at some basic test automation.

## Application Description

This is a feature flags management system that allows administrators to:

1. **View organizations** from a paginated list (1000 pre-loaded orgs)
2. **Load feature flags** for any selected organization
3. **Toggle boolean flags** with optimistic UI updates
4. **Edit non-boolean values** through a prompt dialog
5. **Search and filter** flags by name, key, or category

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the mock API server:**
   ```bash
   npm run mock-api
   ```
   
   This starts the API server on `http://localhost:4000`

3. **Start the React development server** (in a new terminal):
   ```bash
   npm run dev
   ```
   
   This starts the UI on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173/flags`

## API Endpoints

- `GET /orgs?page=0&pageSize=20` - Get paginated list of organization IDs
- `GET /flags/:orgId` - Get all feature flags for an organization
- `PUT /flags/:orgId/:flagKey` - Update a specific flag value
- `GET /flag-definitions` - Get metadata for all available flags
- `GET /health` - Health check endpoint

## Test Data

The mock API is pre-loaded with:
- **1000 randomly generated organizations** with IDs like `org-abc123`
- Each organization has **randomized flag values** (50% use defaults, 50% randomized)
- Flag types include: boolean, number, and string values

## QE Evaluation Tasks

We have sugguested some time allocation for each part of the evaluation to set expectations.

### Part 1: Exploratory Testing (~15 minutes)

Explore the application and document:

1. **Functionality Assessment**
   - Explore all user interactions and workflows
   - Verify API integration and data flow
   - Check edge cases and boundary conditions

2. **Bug Discovery**
   - Document any bugs or UI/UX issues 
   - Categorize bugs by severity (Critical, Major, Minor)
   - Note any unexpected behaviors

### Part 2: Test Strategy Development (~15 minutes)

Create a basic test strategy including:

1. **Test Plan**
   - Define test objectives and scope
   - Identify different types of testing needed
   - Prioritize test areas based on risk

2. **Automation Strategy**
   - Identify candidates for test automation
   - Recommend testing frameworks/tools
   - Outline CI/CD integration approach

### Part 3: Test Automation Implementation (~60 minutes)

Implement automated tests based on your strategy from Part 2:

1. **Setup Test Framework**
   - Configure your chosen testing framework
   - Set up necessary dependencies and helpers
   - Create reusable test utilities

2. **Implement Core Tests**
   - Write automated tests for critical user flows
   - Include API integration tests
   - Add UI component tests as appropriate
   - Ensure tests follow best practices (maintainable, reliable, fast)

3. **Demonstrate Test Execution**
   - Run your test suite
   - Show test reports/results
   - Explain how these tests would integrate into CI/CD

## Application Features to Test

### Organizations List
- Core Interactions

### Feature Flags Management
- Managing the Flags in an Org

### API Behaviors
- Up to you!

## Known Implementation Details

- **Optimistic Updates**: UI updates immediately, rolls back on API failure
- **State Management**: Uses React hooks (useState, useEffect)
- **UI Framework**: Material-UI with DataGrid component
- **TypeScript**: Fully typed with strict mode
- **Mock Data**: 1000 orgs with randomized flag values

## Deliverables

1. **Bug Report** - List of all issues found with reproduction steps
2. **Test Strategy Document** - Basic testing approach including automation strategy
3. **Automated Test Suite** - Working test automation code with at least 5-10 test cases
4. **Test Execution Report** - Results from running your automated tests

## Evaluation Criteria

We will focus on a few core areas during the discussion:

- Thoroughness of exploratory testing and bug discovery
- Quality and practicality of test strategy
- Test automation code quality and coverage
- Choice of testing tools and frameworks
- Clear documentation and communication

---

**Note**: This is a realistic production-like application. Focus on demonstrating your QE expertise through systematic testing, practical automation implementation, and clear documentation. 