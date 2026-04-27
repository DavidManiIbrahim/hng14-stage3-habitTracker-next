import { User, Session } from '@/types/auth';
import { getItem, setItem, removeItem } from './storage';
import { USERS_KEY, SESSION_KEY } from './constants';

export function getUsers(): User[] {
  return getItem<User[]>(USERS_KEY) || [];
}

export function saveUsers(users: User[]): void {
  setItem(USERS_KEY, users);
}

export function getSession(): Session | null {
  return getItem<Session>(SESSION_KEY);
}

export function setSession(session: Session): void {
  setItem(SESSION_KEY, session);
}

export function clearSession(): void {
  removeItem(SESSION_KEY);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function createUser(email: string, password: string): User {
  const users = getUsers();
  const newUser: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}
