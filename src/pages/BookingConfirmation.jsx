import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Ticket, ArrowRight, CreditCard, Wallet } from 'lucide-react';
import { getBookingById } from '../services/bookingService.js';
import { getEventById } from '../services/eventService.js';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const b = getBookingById(bookingId);
    setBooking(b);
    if (b) {
      setEvent(getEventById(b.eventId));
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="page-wrapper pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 dark:text-white/40 text-base">Booking not found.</p>
        <Link to="/my-bookings" className="btn-secondary">My Bookings</Link>
      </div>
    );
  }

  const paymentMethodLabel =
    booking.paymentMethod === 'esewa'
      ? 'eSewa Wallet'
      : booking.paymentMethod === 'khalti'
      ? 'Khalti Wallet'
      : 'Card Payment';

  return (
    <div className="page-wrapper pt-24 pb-16">
      <div className="max-w-lg mx-auto px-4 animate-fade-in">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Booking Confirmed!</h1>
          <p className="text-slate-600 dark:text-white/50 text-sm">Your order has been recorded successfully.</p>
        </div>

        {/* Ticket Receipt Card */}
        <div className="glass-card overflow-hidden mb-6 border border-slate-200 dark:border-white/5 shadow-sm">
          {/* Event Header Banner */}
          {event && (
            <div className="relative h-36 bg-slate-900">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="font-bold text-white text-lg line-clamp-1">{event.title}</p>
                <p className="text-white/80 text-xs">
                  {booking.eventSnapshot?.venue?.name}, {booking.eventSnapshot?.venue?.city}
                </p>
              </div>
            </div>
          )}

          {/* Ticket Information Body */}
          <div className="p-5 space-y-4">
            {/* Reference & Payment Method */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">Booking ID</span>
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400 text-sm">{booking.id}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">Paid Via</span>
                <span className="badge bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/30 text-xs font-semibold">
                  {paymentMethodLabel}
                </span>
              </div>
            </div>

            {/* Event Time & Status */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-white/50 flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" /> Date & Time
                </p>
                <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm">
                  {new Date(booking.eventSnapshot?.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })} · {booking.eventSnapshot?.time}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-white/50 mb-0.5">Status</p>
                <span className="badge bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-xs capitalize">
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Attendee Info */}
            <div className="py-3 border-t border-slate-200 dark:border-white/5">
              <p className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-1">Attendee</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{booking.attendee?.name}</p>
              <p className="text-xs text-slate-600 dark:text-white/50">{booking.attendee?.email} · {booking.attendee?.phone}</p>
            </div>

            {/* Ticket Breakdown */}
            <div className="border-t border-slate-200 dark:border-white/5 pt-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Tickets Booked
              </p>
              {booking.tickets?.map((t, i) => {
                const tier = event?.ticketTypes?.find((x) => x.id === t.ticketTypeId);
                return (
                  <div key={i} className="flex justify-between text-xs py-1 text-slate-700 dark:text-white/70">
                    <span>{tier?.name || 'General'} × {t.quantity}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      NPR {((tier?.price || 0) * t.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}

              <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-200 dark:border-white/10 mt-2">
                <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="font-extrabold text-brand-600 dark:text-brand-400 text-base">
                  NPR {booking.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/my-bookings" className="btn-secondary flex-1 justify-center text-sm">
            View All My Bookings
          </Link>
          <Link to="/events" className="btn-primary flex-1 justify-center text-sm flex items-center gap-1.5 !text-white">
            <span>Explore More Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
