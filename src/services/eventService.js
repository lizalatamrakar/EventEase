// src/services/eventService.js
import { getEvents, setEvents } from './storage.js';

export function getAllEvents() {
  return getEvents();
}

export function getEventById(id) {
  return getEvents().find((e) => e.id === id) || null;
}

export function createEvent(eventData) {
  const events = getEvents();
  const newEvent = {
    ...eventData,
    id: `evt_${Date.now()}`,
    featured: eventData.featured || false,
    ticketTypes: eventData.ticketTypes || [],
  };
  setEvents([...events, newEvent]);
  return newEvent;
}

export function updateEvent(id, updates) {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  events[idx] = { ...events[idx], ...updates };
  setEvents(events);
  return events[idx];
}

export function deleteEvent(id) {
  const events = getEvents().filter((e) => e.id !== id);
  setEvents(events);
}

export function searchEvents(query, filters = {}) {
  let events = getEvents();

  if (query) {
    const q = query.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.includes(q))
    );
  }

  if (filters.category && filters.category !== 'All') {
    events = events.filter((e) => e.category === filters.category);
  }

  if (filters.city) {
    events = events.filter((e) =>
      e.venue.city.toLowerCase().includes(filters.city.toLowerCase())
    );
  }

  if (filters.dateFrom) {
    events = events.filter((e) => e.date >= filters.dateFrom);
  }

  if (filters.dateTo) {
    events = events.filter((e) => e.date <= filters.dateTo);
  }

  if (filters.maxPrice != null) {
    events = events.filter((e) =>
      e.ticketTypes.some((tt) => tt.price <= Number(filters.maxPrice))
    );
  }

  // Sorting
  if (filters.sort === 'price_asc') {
    events = events.sort((a, b) => Math.min(...a.ticketTypes.map((t) => t.price)) - Math.min(...b.ticketTypes.map((t) => t.price)));
  } else if (filters.sort === 'price_desc') {
    events = events.sort((a, b) => Math.min(...b.ticketTypes.map((t) => t.price)) - Math.min(...a.ticketTypes.map((t) => t.price)));
  } else if (filters.sort === 'date_asc') {
    events = events.sort((a, b) => a.date.localeCompare(b.date));
  } else {
    // Default: featured first, then by date
    events = events.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.date.localeCompare(b.date);
    });
  }

  return events;
}

export function getFeaturedEvents() {
  return getEvents().filter((e) => e.featured).slice(0, 4);
}

export function getCategories() {
  const cats = [...new Set(getEvents().map((e) => e.category))];
  return ['All', ...cats.sort()];
}

/** Deduct ticket quantities after a booking */
export function deductTickets(eventId, tickets) {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return;
  tickets.forEach(({ ticketTypeId, quantity }) => {
    const tt = events[idx].ticketTypes.find((t) => t.id === ticketTypeId);
    if (tt) tt.available = Math.max(0, tt.available - quantity);
  });
  setEvents(events);
}
