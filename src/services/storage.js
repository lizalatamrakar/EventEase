// src/services/storage.js
// Abstraction layer over localStorage. Handles JSON serialization and seed initialization.

import seedEvents from '../data/events.json';
import seedUsers from '../data/users.json';

const KEYS = {
  EVENTS: 'ee_events',
  USERS: 'ee_users',
  BOOKINGS: 'ee_bookings',
  CURRENT_USER: 'ee_current_user',
};

function get(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

function remove(key) {
  localStorage.removeItem(key);
}

/** Initialize seed data on first load */
export function initStorage() {
  if (!get(KEYS.EVENTS)) {
    set(KEYS.EVENTS, seedEvents);
  }
  if (!get(KEYS.USERS)) {
    set(KEYS.USERS, seedUsers);
  }
  if (!get(KEYS.BOOKINGS)) {
    set(KEYS.BOOKINGS, []);
  }
}

// --- Events ---
export function getEvents() {
  return get(KEYS.EVENTS) || [];
}
export function setEvents(events) {
  set(KEYS.EVENTS, events);
}

// --- Users ---
export function getUsers() {
  return get(KEYS.USERS) || [];
}
export function setUsers(users) {
  set(KEYS.USERS, users);
}

// --- Bookings ---
export function getBookings() {
  return get(KEYS.BOOKINGS) || [];
}
export function setBookings(bookings) {
  set(KEYS.BOOKINGS, bookings);
}

// --- Session ---
export function getCurrentUser() {
  return get(KEYS.CURRENT_USER);
}
export function setCurrentUser(user) {
  if (user) set(KEYS.CURRENT_USER, user);
  else remove(KEYS.CURRENT_USER);
}
