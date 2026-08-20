// src/services/bookingService.js
import { getBookings, setBookings } from './storage.js';
import { deductTickets } from './eventService.js';

export function getBookingsByUser(userId) {
  return getBookings().filter((b) => b.userId === userId);
}

export function getBookingById(id) {
  return getBookings().find((b) => b.id === id) || null;
}

export function createBooking({ userId, event, tickets, attendee, paymentMethod = 'esewa' }) {
  const totalAmount = tickets.reduce((sum, t) => {
    const tt = event.ticketTypes.find((x) => x.id === t.ticketTypeId);
    return sum + (tt ? tt.price * t.quantity : 0);
  }, 0);

  const booking = {
    id: `BKG-${Date.now().toString(36).toUpperCase()}`,
    userId,
    eventId: event.id,
    eventSnapshot: {
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      image: event.image,
      category: event.category,
    },
    tickets,
    totalAmount,
    attendee,
    paymentMethod,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  const all = getBookings();
  setBookings([...all, booking]);
  deductTickets(event.id, tickets);

  return booking;
}

export function cancelBooking(id) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], status: 'cancelled' };
  setBookings(bookings);
  return bookings[idx];
}
