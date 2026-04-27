import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock storage and session functions
vi.mock('@/lib/habits', async () => {
  const actual = await vi.importActual('@/lib/habits');
  return {
    ...actual as any,
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
    setSession: vi.fn(),
  };
});

describe('auth flow', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('submits the signup form and creates a session', async () => {
    const { findUserByEmail, createUser, setSession } = await import('@/lib/habits');

    vi.mocked(findUserByEmail).mockReturnValue(null);
    vi.mocked(createUser).mockReturnValue({
      id: '1',
      email: 'test@example.com',
      password: 'password',
      createdAt: '2024-01-01T00:00:00.000Z',
    });

    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith('test@example.com', 'password');
      expect(setSession).toHaveBeenCalledWith({
        userId: '1',
        email: 'test@example.com',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    const { findUserByEmail } = await import('@/lib/habits');

    vi.mocked(findUserByEmail).mockReturnValue({
      id: '1',
      email: 'test@example.com',
      password: 'password',
      createdAt: '2024-01-01T00:00:00.000Z',
    });

    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('submits the login form and stores the active session', async () => {
    const { findUserByEmail, setSession } = await import('@/lib/habits');

    vi.mocked(findUserByEmail).mockReturnValue({
      id: '1',
      email: 'test@example.com',
      password: 'password',
      createdAt: '2024-01-01T00:00:00.000Z',
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(setSession).toHaveBeenCalledWith({
        userId: '1',
        email: 'test@example.com',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    const { findUserByEmail } = await import('@/lib/habits');

    vi.mocked(findUserByEmail).mockReturnValue(null);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});