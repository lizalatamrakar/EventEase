import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

const INITIAL_STATE = {
  event: null,
  selectedTickets: [], // [{ ticketTypeId, quantity }]
  attendee: { name: '', email: '', phone: '' },
  step: 1,
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(INITIAL_STATE);

  const startBooking = useCallback((event) => {
    setBooking({ ...INITIAL_STATE, event, selectedTickets: [], attendee: { name: '', email: '', phone: '' }, step: 1 });
  }, []);

  const setSelectedTickets = useCallback((ticketsOrUpdater) => {
    setBooking((prev) => {
      const prevTickets = Array.isArray(prev.selectedTickets) ? prev.selectedTickets : [];
      const updated = typeof ticketsOrUpdater === 'function' ? ticketsOrUpdater(prevTickets) : ticketsOrUpdater;
      return {
        ...prev,
        selectedTickets: Array.isArray(updated) ? updated : [],
      };
    });
  }, []);

  const setAttendee = useCallback((attendeeOrUpdater) => {
    setBooking((prev) => {
      const prevAttendee = prev.attendee || { name: '', email: '', phone: '' };
      const updated = typeof attendeeOrUpdater === 'function' ? attendeeOrUpdater(prevAttendee) : attendeeOrUpdater;
      return {
        ...prev,
        attendee: updated,
      };
    });
  }, []);

  const setStep = useCallback((step) => {
    setBooking((prev) => ({ ...prev, step }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(INITIAL_STATE);
  }, []);

  const totalAmount = (Array.isArray(booking.selectedTickets) ? booking.selectedTickets : []).reduce((sum, st) => {
    const tt = booking.event?.ticketTypes?.find((t) => t.id === st.ticketTypeId);
    return sum + (tt ? tt.price * st.quantity : 0);
  }, 0);

  return (
    <BookingContext.Provider
      value={{ booking, startBooking, setSelectedTickets, setAttendee, setStep, resetBooking, totalAmount }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}
