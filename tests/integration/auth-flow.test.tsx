import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// Mock auth module (used by SignupForm and LoginForm)
const mockFindUserByEmail = vi.fn();
const mockCreateUser = vi.fn();
const mockSetSession = vi.fn();

vi.mock('@/lib/auth', () => ({
  findUserByEmail: (...args: any[]) => mockFindUserByEmail(...args),
  createUser: (...args: any[]) => mockCreateUser(...args),
  setSession: (...args: any[]) => mockSetSession(...args),
}));

describe('auth flow', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockFindUserByEmail.mockClear();
    mockCreateUser.mockClear();
    mockSetSession.mockClear();
  });

  it('submits the signup form and creates a session', async () => {
    // Setup mock returns for this test
    mockFindUserByEmail.mockReturnValue(null);
    mockCreateUser.mockReturnValue({
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
      expect(mockCreateUser).toHaveBeenCalledWith('test@example.com', 'password');
      expect(mockSetSession).toHaveBeenCalledWith({
        userId: '1',
        email: 'test@example.com',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    // Setup mock to return existing user
    mockFindUserByEmail.mockReturnValue({
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
    // Setup mock to return user on login
    mockFindUserByEmail.mockReturnValue({
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
      expect(mockSetSession).toHaveBeenCalledWith({
        userId: '1',
        email: 'test@example.com',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    // Setup mock to return null (user not found)
    mockFindUserByEmail.mockReturnValue(null);

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'nonexistent@example.com' },
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
