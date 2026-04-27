# Running Tests - Habit Tracker PWA

This guide explains how to run the test suite for the Habit Tracker application.

## Quick Start

Run all tests at once:

```bash
npm test
```

This will run unit tests, integration tests, and end-to-end tests in sequence.

---

## Test Types

### 1. Unit Tests

**What they test:** Individual utility functions in isolation (slugs, validators, streaks, habits).

**Run unit tests only:**

```bash
npm run test:unit
```

**What to expect:**
- Tests for `getHabitSlug()` 
- Tests for `validateHabitName()`
- Tests for `calculateCurrentStreak()`
- Tests for `toggleHabitCompletion()`
- Coverage report for `src/lib/` files (minimum 80% line coverage required)

**Files tested:**
- `tests/unit/slug.test.ts`
- `tests/unit/validators.test.ts`
- `tests/unit/streaks.test.ts`
- `tests/unit/habits.test.ts`

---

### 2. Integration / Component Tests

**What they test:** React components and forms working together with the app logic.

**Run integration tests only:**

```bash
npm run test:integration
```

**What to expect:**
- Auth flow tests (signup, login, error handling)
- Habit form tests (create, edit, delete, completion, streak updates)

**Files tested:**
- `tests/integration/auth-flow.test.tsx`
- `tests/integration/habit-form.test.tsx`

---

### 3. End-to-End (E2E) Tests

**What they test:** Full user workflows in a real browser (Playwright).

**Run E2E tests only:**

```bash
npm run test:e2e
```

**What to expect:**
- Splash screen and navigation
- Authentication flows (signup, login, logout)
- Habit creation, completion, and deletion
- Streak display and updates
- Session and habits persistence
- Offline functionality (app shell caching)
- Page reload state retention

**Files tested:**
- `tests/e2e/app.spec.ts`

---

## Running All Tests

To run the entire test suite (unit → integration → E2E):

```bash
npm test
```

This runs tests in this order:
1. Unit tests (with coverage report)
2. Integration tests
3. E2E tests

---

## Test Output

### Unit Tests Output Example

```
✓ src/lib/slug.test.ts (3 tests)
  ✓ getHabitSlug
    ✓ returns lowercase hyphenated slug for a basic habit name
    ✓ trims outer spaces and collapses repeated internal spaces
    ✓ removes non alphanumeric characters except hyphens

✓ src/lib/validators.test.ts (3 tests)
  ✓ validateHabitName
    ✓ returns an error when habit name is empty
    ✓ returns an error when habit name exceeds 60 characters
    ✓ returns a trimmed value when habit name is valid

✓ src/lib/streaks.test.ts (5 tests)
  ✓ calculateCurrentStreak
    ✓ returns 0 when completions is empty
    ✓ returns 0 when today is not completed
    ✓ returns the correct streak for consecutive completed days
    ✓ ignores duplicate completion dates
    ✓ breaks the streak when a calendar day is missing

✓ src/lib/habits.test.ts (4 tests)
  ✓ toggleHabitCompletion
    ✓ adds a completion date when the date is not present
    ✓ removes a completion date when the date already exists
    ✓ does not mutate the original habit object
    ✓ does not return duplicate completion dates

Coverage: 80%+ (lines covered in src/lib/)
```

### Integration Tests Output Example

```
✓ tests/integration/auth-flow.test.tsx (4 tests)
  ✓ auth flow
    ✓ submits the signup form and creates a session
    ✓ shows an error for duplicate signup email
    ✓ submits the login form and stores the active session
    ✓ shows an error for invalid login credentials

✓ tests/integration/habit-form.test.tsx (5 tests)
  ✓ habit form
    ✓ shows a validation error when habit name is empty
    ✓ creates a new habit and renders it in the list
    ✓ edits an existing habit and preserves immutable fields
    ✓ deletes a habit only after explicit confirmation
    ✓ toggles completion and updates the streak display
```

### E2E Tests Output Example

```
✓ tests/e2e/app.spec.ts (10 tests)
  ✓ Habit Tracker app
    ✓ shows the splash screen and redirects unauthenticated users to /login
    ✓ redirects authenticated users from / to /dashboard
    ✓ prevents unauthenticated access to /dashboard
    ✓ signs up a new user and lands on the dashboard
    ✓ logs in an existing user and loads only that user's habits
    ✓ creates a habit from the dashboard
    ✓ completes a habit for today and updates the streak
    ✓ persists session and habits after page reload
    ✓ logs out and redirects to /login
    ✓ loads the cached app shell when offline after the app has been loaded once
```

---

## Test Requirements Summary

| Test Type | Tool | Files | Count |
|-----------|------|-------|-------|
| Unit | Vitest | 4 files | 15 tests |
| Integration | Vitest + React Testing Library | 2 files | 9 tests |
| E2E | Playwright | 1 file | 10 tests |
| **Total** | | **7 files** | **34 tests** |

---

## Important Notes

1. **localStorage is cleared** before each test to ensure isolation
2. **Tests verify exact test titles** as specified in the TRD
3. **Coverage reports** are generated automatically with unit tests
4. **E2E tests use a real browser** (Chromium by default)
5. **Offline tests** verify service worker caching and app shell fallback

---

## Troubleshooting

### Tests won't run
```bash
# Ensure dependencies are installed
npm install

# Clear cache and reinstall
npm run clean
npm install
```

### E2E tests hang or fail to start
```bash
# Install Playwright browsers
npx playwright install

# Then run E2E tests
npm run test:e2e
```

### Coverage report missing
```bash
# Unit tests generate coverage by default
# If missing, run:
npm run test:unit
```

### localStorage not clearing between tests
- This is handled by the test setup file: `tests/setup.ts`
- Check that it properly clears localStorage before each test

---

## Development Workflow

**During development:**
```bash
# Watch mode for unit tests
npm run test:unit -- --watch
```

**Before committing:**
```bash
# Run full test suite
npm test
```

**Quick validation:**
```bash
# Just integration tests (faster than E2E)
npm run test:integration
```

