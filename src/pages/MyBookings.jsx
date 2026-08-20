import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getBookingsByUser, cancelBooking } from '../services/bookingService.js';
import { useToast } from '../context/ToastContext.jsx';

function BookingCard({ booking, onCancelClick }) {
  const isPast = new Date(booking.eventSnapshot?.date) < new Date();
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className={`glass-card overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm ${isCancelled ? 'opacity-60' : ''}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Event Thumbnail */}
        <div className="sm:w-40 h-32 sm:h-auto shrink-0 bg-slate-800">
          <img
            src={booking.eventSnapshot?.image}
            alt={booking.eventSnapshot?.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80';
            }}
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`badge text-xs capitalize ${
                    isCancelled
                      ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30'
                      : isPast
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/50 border border-slate-200 dark:border-white/10'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {booking.status}
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-white/50">{booking.id}</span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                {booking.eventSnapshot?.title}
              </h3>

              <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-white/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(booking.eventSnapshot?.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })} · {booking.eventSnapshot?.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {booking.eventSnapshot?.venue?.name}, {booking.eventSnapshot?.venue?.city}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-slate-500 dark:text-white/40 mb-0.5">Total Paid</p>
              <p className="font-extrabold text-brand-600 dark:text-brand-400 text-base">
                NPR {booking.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/60">
              <Ticket className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>
                {booking.tickets?.reduce((s, t) => s + t.quantity, 0)} Ticket(s)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/booking/confirmation/${booking.id}`}
                className="btn-ghost text-xs py-1.5 px-3"
              >
                View Ticket <ArrowRight className="w-3 h-3" />
              </Link>

              {!isCancelled && !isPast && (
                <button
                  id={`cancel-${booking.id}`}
                  type="button"
                  onClick={() => onCancelClick(booking.id)}
                  className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [cancelTargetId, setCancelTargetId] = useState(null);

  const loadBookings = () => {
    const list = getBookingsByUser(user.id);
    setBookings(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    loadBookings();
  }, [user.id]);

  const handleConfirmCancel = () => {
    if (cancelTargetId) {
      cancelBooking(cancelTargetId);
      loadBookings();
      setCancelTargetId(null);
      toast.success('Booking cancelled successfully.');
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.eventSnapshot?.date) >= new Date()
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'cancelled' || new Date(b.eventSnapshot?.date) < new Date()
  );

  return (
    <div className="page-wrapper pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Bookings</h1>
        <p className="text-slate-600 dark:text-white/50 text-sm mb-8">
          Manage your upcoming event tickets and view booking receipts
        </p>

        {bookings.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center gap-4 border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-slate-400 dark:text-white/30">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white text-lg font-semibold mb-1">No bookings yet</p>
              <p className="text-slate-600 dark:text-white/50 text-sm">When you book tickets for events, they will show up here.</p>
            </div>
            <Link to="/events" className="btn-primary text-sm mt-2 !text-white">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {upcomingBookings.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Upcoming ({upcomingBookings.length})
                </h2>
                <div className="space-y-4">
                  {upcomingBookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onCancelClick={(id) => setCancelTargetId(id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-slate-700 dark:text-white/60 mb-4">
                  Past & Cancelled ({pastBookings.length})
                </h2>
                <div className="space-y-4">
                  {pastBookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onCancelClick={(id) => setCancelTargetId(id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTargetId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-sm w-full animate-fade-in shadow-xl border border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Cancel Booking?</h3>
            </div>
            <p className="text-slate-600 dark:text-white/60 text-sm mb-6">
              Are you sure you want to cancel this booking? This will free up the reserved tickets.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCancelTargetId(null)}
                className="btn-secondary flex-1 justify-center"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="btn-danger flex-1 justify-center"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
