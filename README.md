# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits with local storage persistence.

## Features

- User authentication (signup/login)
- Create, edit, and delete habits
- Mark habits complete for today
- View current streak for each habit
- PWA support with offline caching
- Responsive mobile-first design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **Persistence**: localStorage
- **PWA**: Service Worker + Web App Manifest

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Run Instructions

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm run start`

## Test Instructions

- **Unit Tests**: `npm run test:unit` (includes coverage report)
- **Integration Tests**: `npm run test:integration`
- **E2E Tests**: `npm run test:e2e`
- **All Tests**: `npm run test`

## Local Persistence Structure

The app uses localStorage with three keys:

- `habit-tracker-users`: Array of user objects
  ```json
  [
    {
      "id": "string",
      "email": "string",
      "password": "string",
      "createdAt": "string"
    }
  ]
  ```

- `habit-tracker-session`: Current session or null
  ```json
  {
    "userId": "string",
    "email": "string"
  }
  ```

- `habit-tracker-habits`: Array of habit objects
  ```json
  [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "description": "string",
      "frequency": "daily",
      "createdAt": "string",
      "completions": ["string"]
    }
  ]
  ```

## PWA Implementation

### Service Worker
- Caches the app shell for offline access
- Located at `public/sw.js`
- Registered in the dashboard page

### Web App Manifest
- Located at `public/manifest.json`
- Includes app metadata, icons, and display settings
- Enables installable PWA functionality

### Icons
- `public/icons/icon-192.png`: 192x192 icon
- `public/icons/icon-512.png`: 512x512 icon

## Trade-offs and Limitations

- **Local Persistence**: The app uses `localStorage`, meaning data is limited to the specific browser and device used. Clearing browser data will delete all habits and user accounts.
- **Security**: Authentication is handled client-side for demonstration purposes. Passwords are stored in plain text in `localStorage`. This is not suitable for production use with sensitive data.
- **Single Frequency**: Only 'daily' habit frequency is implemented as per the technical requirements.
- **Offline Support**: The Service Worker provides basic offline support by caching the app shell, but dynamic data (like creating new habits) while offline is not synchronized with a backend.

## Test Mapping

Each test file in the `tests/` directory verifies specific behaviors defined in the Technical Requirements Document:

### Unit Tests (`tests/unit/`)
- **`slug.test.ts`**: Verifies `getHabitSlug` utility (lowercase conversion, space handling, alphanumeric filtering).
- **`validators.test.ts`**: Verifies `validateHabitName` (required field, length limits, trimming).
- **`streaks.test.ts`**: Verifies `calculateCurrentStreak` (consecutive days, gap handling, duplicate removal).
- **`habits.test.ts`**: Verifies `toggleHabitCompletion` (adding/removing dates, immutability, duplicate prevention).

### Integration Tests (`tests/integration/`)
- **`auth-flow.test.tsx`**: Verifies signup/login UI flows, error messages for duplicate emails or invalid credentials.
- **`habit-form.test.tsx`**: Verifies habit CRUD operations, validation errors, and streak display updates.

### End-to-End Tests (`tests/e2e/`)
- **`app.spec.ts`**: Verifies full user journeys including splash screen redirects, session persistence across reloads, multi-user isolation, and PWA offline capability.
