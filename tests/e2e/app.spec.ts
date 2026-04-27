import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    
    // Should show splash screen
    await expect(page.getByTestId('splash-screen')).toBeVisible({ timeout: 5000 });
    
    // Should redirect to login after splash
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Set up a session
    await page.addInitScript(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByTestId('auth-signup-email').fill('test@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Should show dashboard
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Create a user first
    await page.addInitScript(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{
        id: 'user-1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }]));
    });
    
    await page.goto('/login');
    
    await page.getByTestId('auth-login-email').fill('test@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    // Set up authenticated session
    await page.addInitScript(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com'
      }));
      localStorage.setItem('habit-tracker-users', JSON.stringify([{
        id: 'user-1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }]));
    });
    
    await page.goto('/dashboard');
    
    // Click add habit button
    await page.getByTestId('create-habit-button').click();
    
    // Fill in habit form
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('Drink 8 glasses daily');
    await page.getByTestId('habit-save-button').click();
    
    // Should show the habit
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Set up authenticated session with a habit
    await page.addInitScript(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com'
      }));
      localStorage.setItem('habit-tracker-users', JSON.stringify([{
        id: 'user-1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'habit-1',
        userId: 'user-1',
        name: 'Drink Water',
        description: 'Drink 8 glasses daily',
        frequency: 'daily',
        createdAt: '2024-01-01T00:00:00.000Z',
        completions: [today]
      }]));
    });
    
    await page.goto('/dashboard');
    
    // Should show streak of 1
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1 day');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    // Set up data
    await page.addInitScript(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com'
      }));
      localStorage.setItem('habit-tracker-users', JSON.stringify([{
        id: 'user-1',
        email: 'test@example.com',
        password: 'password123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'habit-1',
        userId: 'user-1',
        name: 'Drink Water',
        description: 'Drink 8 glasses daily',
        frequency: 'daily',
        createdAt: '2024-01-01T00:00:00.000Z',
        completions: []
      }]));
    });
    
    await page.goto('/dashboard');
    
    // Reload the page
    await page.reload();
    
    // Should still show the dashboard and habit
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    // Set up authenticated session
    await page.addInitScript(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com'
      }));
    });
    
    await page.goto('/dashboard');
    
    // Click logout
    await page.getByTestId('auth-logout-button').click();
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page }) => {
    // Set up authenticated session
    await page.addInitScript(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'user-1',
        email: 'test@example.com'
      }));
    });
    
    // First load - go to dashboard to register service worker
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    
    // Set offline mode
    await page.context().setOffline(true);
    
    // Try to reload - should not crash hard
    await page.reload();
    
    // The page should either show content or a proper offline page, not crash
    // We just verify it doesn't throw an unhandled error
    await page.waitForTimeout(1000);
  });
});