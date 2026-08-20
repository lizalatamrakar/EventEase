// src/services/authService.js
import { getUsers, setUsers, getCurrentUser, setCurrentUser } from './storage.js';

export function login(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return { success: false, message: 'Invalid email or password.' };
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
  setCurrentUser(session);
  return { success: true, user: session };
}

export function register({ name, email, password }) {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { success: false, message: 'An account with this email already exists.' };

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  setUsers([...users, newUser]);
  const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  setCurrentUser(session);
  return { success: true, user: session };
}

export function logout() {
  setCurrentUser(null);
}

export function getSession() {
  return getCurrentUser();
}

export function updateUser(id, data) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...data };
    setUsers(users);
    
    // Also update session if it's the current user
    const current = getCurrentUser();
    if (current && current.id === id) {
      setCurrentUser({ ...current, ...data, password: undefined });
    }
    return true;
  }
  return false;
}

export function verifyPassword(id, password) {
  const users = getUsers();
  const user = users.find(u => u.id === id);
  return user && user.password === password;
}
