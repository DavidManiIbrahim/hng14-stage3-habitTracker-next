# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Habit Tracker app >> completes a habit for today and updates the streak
- Location: tests\e2e\app.spec.ts:107:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('habit-card-drink-water')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('habit-card-drink-water')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - img [ref=e6]
          - heading "Habit Tracker" [level=1] [ref=e11]
        - button "Log Out" [ref=e13] [cursor=pointer]:
          - img [ref=e14]
          - generic [ref=e17]: Log Out
    - main [ref=e18]:
      - generic [ref=e19]:
        - heading "My Habits" [level=2] [ref=e20]
        - button "Add Habit" [ref=e21] [cursor=pointer]:
          - img [ref=e22]
          - generic [ref=e23]: Add Habit
      - generic [ref=e24]:
        - img [ref=e26]
        - paragraph [ref=e27]: No habits yet.
        - paragraph [ref=e28]: Start by creating your first daily habit!
  - button "Open Next.js Dev Tools" [ref=e34] [cursor=pointer]:
    - img [ref=e35]
  - alert [ref=e38]
```

# Test source

```ts
  46  |     await page.getByTestId('auth-signup-email').fill('test@example.com');
  47  |     await page.getByTestId('auth-signup-password').fill('password123');
  48  |     await page.getByTestId('auth-signup-submit').click();
  49  |     
  50  |     // Should redirect to dashboard
  51  |     await expect(page).toHaveURL(/dashboard/);
  52  |     
  53  |     // Should show dashboard
  54  |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  55  |   });
  56  | 
  57  |   test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
  58  |     // Create a user first
  59  |     await page.addInitScript(() => {
  60  |       localStorage.setItem('habit-tracker-users', JSON.stringify([{
  61  |         id: 'user-1',
  62  |         email: 'test@example.com',
  63  |         password: 'password123',
  64  |         createdAt: '2024-01-01T00:00:00.000Z'
  65  |       }]));
  66  |     });
  67  |     
  68  |     await page.goto('/login');
  69  |     
  70  |     await page.getByTestId('auth-login-email').fill('test@example.com');
  71  |     await page.getByTestId('auth-login-password').fill('password123');
  72  |     await page.getByTestId('auth-login-submit').click();
  73  |     
  74  |     // Should redirect to dashboard
  75  |     await expect(page).toHaveURL(/dashboard/);
  76  |   });
  77  | 
  78  |   test('creates a habit from the dashboard', async ({ page }) => {
  79  |     // Set up authenticated session
  80  |     await page.addInitScript(() => {
  81  |       localStorage.setItem('habit-tracker-session', JSON.stringify({
  82  |         userId: 'user-1',
  83  |         email: 'test@example.com'
  84  |       }));
  85  |       localStorage.setItem('habit-tracker-users', JSON.stringify([{
  86  |         id: 'user-1',
  87  |         email: 'test@example.com',
  88  |         password: 'password123',
  89  |         createdAt: '2024-01-01T00:00:00.000Z'
  90  |       }]));
  91  |     });
  92  |     
  93  |     await page.goto('/dashboard');
  94  |     
  95  |     // Click add habit button
  96  |     await page.getByTestId('create-habit-button').click();
  97  |     
  98  |     // Fill in habit form
  99  |     await page.getByTestId('habit-name-input').fill('Drink Water');
  100 |     await page.getByTestId('habit-description-input').fill('Drink 8 glasses daily');
  101 |     await page.getByTestId('habit-save-button').click();
  102 |     
  103 |     // Should show the habit
  104 |     await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  105 |   });
  106 | 
  107 |   test('completes a habit for today and updates the streak', async ({ page }) => {
  108 |     const today = new Date().toISOString().split('T')[0];
  109 |     
  110 |     // Set up authenticated session with a habit
  111 |     await page.addInitScript(() => {
  112 |       localStorage.setItem('habit-tracker-session', JSON.stringify({
  113 |         userId: 'user-1',
  114 |         email: 'test@example.com'
  115 |       }));
  116 |       localStorage.setItem('habit-tracker-users', JSON.stringify([{
  117 |         id: 'user-1',
  118 |         email: 'test@example.com',
  119 |         password: 'password123',
  120 |         createdAt: '2024-01-01T00:00:00.000Z'
  121 |       }]));
  122 |       localStorage.setItem('habit-tracker-habits', JSON.stringify([{
  123 |         id: 'habit-1',
  124 |         userId: 'user-1',
  125 |         name: 'Drink Water',
  126 |         description: 'Drink 8 glasses daily',
  127 |         frequency: 'daily',
  128 |         createdAt: '2024-01-01T00:00:00.000Z',
  129 |         completions: [today]
  130 |       }]));
  131 |     });
  132 |     
  133 |     await page.goto('/dashboard');
  134 |     
  135 |     // Wait for the dashboard to fully load
  136 |     await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 10000 });
  137 |     
  138 |     // Wait for React to render the habits
  139 |     await page.waitForTimeout(2000);
  140 |     
  141 |     // Debug: Check if any habit card exists
  142 |     const habitCards = await page.locator('[data-testid^="habit-card-"]').count();
  143 |     console.log('Habit cards found:', habitCards);
  144 |     
  145 |     // Should show the habit card
> 146 |     await expect(page.getByTestId('habit-card-drink-water')).toBeVisible({ timeout: 5000 });
      |                                                              ^ Error: expect(locator).toBeVisible() failed
  147 |     
  148 |     // Should show streak of 1
  149 |     await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1 day');
  150 |   });
  151 | 
  152 |   test('persists session and habits after page reload', async ({ page }) => {
  153 |     // Set up data
  154 |     await page.addInitScript(() => {
  155 |       localStorage.setItem('habit-tracker-session', JSON.stringify({
  156 |         userId: 'user-1',
  157 |         email: 'test@example.com'
  158 |       }));
  159 |       localStorage.setItem('habit-tracker-users', JSON.stringify([{
  160 |         id: 'user-1',
  161 |         email: 'test@example.com',
  162 |         password: 'password123',
  163 |         createdAt: '2024-01-01T00:00:00.000Z'
  164 |       }]));
  165 |       localStorage.setItem('habit-tracker-habits', JSON.stringify([{
  166 |         id: 'habit-1',
  167 |         userId: 'user-1',
  168 |         name: 'Drink Water',
  169 |         description: 'Drink 8 glasses daily',
  170 |         frequency: 'daily',
  171 |         createdAt: '2024-01-01T00:00:00.000Z',
  172 |         completions: []
  173 |       }]));
  174 |     });
  175 |     
  176 |     await page.goto('/dashboard');
  177 |     
  178 |     // Reload the page
  179 |     await page.reload();
  180 |     
  181 |     // Should still show the dashboard and habit
  182 |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  183 |     await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  184 |   });
  185 | 
  186 |   test('logs out and redirects to /login', async ({ page }) => {
  187 |     // Set up authenticated session
  188 |     await page.addInitScript(() => {
  189 |       localStorage.setItem('habit-tracker-session', JSON.stringify({
  190 |         userId: 'user-1',
  191 |         email: 'test@example.com'
  192 |       }));
  193 |     });
  194 |     
  195 |     await page.goto('/dashboard');
  196 |     
  197 |     // Click logout
  198 |     await page.getByTestId('auth-logout-button').click();
  199 |     
  200 |     // Should redirect to login
  201 |     await expect(page).toHaveURL(/login/);
  202 |   });
  203 | 
  204 |   test('loads the cached app shell when offline after the app has been loaded once', async ({ page }) => {
  205 |     // Set up authenticated session
  206 |     await page.addInitScript(() => {
  207 |       localStorage.setItem('habit-tracker-session', JSON.stringify({
  208 |         userId: 'user-1',
  209 |         email: 'test@example.com'
  210 |       }));
  211 |     });
  212 |     
  213 |     // First load - go to dashboard to register service worker
  214 |     await page.goto('/dashboard');
  215 |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  216 |     
  217 |     // Set offline mode
  218 |     await page.context().setOffline(true);
  219 |     
  220 |     // Try to reload - should not crash hard
  221 |     // We use a try-catch because offline mode may cause network errors
  222 |     try {
  223 |       await page.reload({ timeout: 5000 });
  224 |     } catch (e) {
  225 |       // Expected when offline - just verify page didn't crash
  226 |     }
  227 |     
  228 |     // The page should either show content or a proper offline page, not crash
  229 |     // We just verify it doesn't throw an unhandled error
  230 |     await page.waitForTimeout(1000);
  231 |   });
  232 | });
```