import { useState } from 'react';
import { Search } from 'lucide-react';

export default function BookingsTable({ bookings }) {
  const [search, setSearch] = useState('');

  const filteredBookings = bookings.filter((b) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      b.id.toLowerCase().includes(term) ||
      b.eventSnapshot?.title?.toLowerCase().includes(term) ||
      b.attendee?.name?.toLowerCase().includes(term) ||
      b.attendee?.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="glass-card overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, event name, or attendee..."
            aria-label="Search bookings"
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
        <span className="text-slate-500 dark:text-white/40 text-sm">{filteredBookings.length} bookings</span>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider bg-slate-50/50 dark:bg-transparent">
              <th className="py-3.5 px-4">Booking Ref</th>
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-4">Attendee</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4 font-mono text-xs text-brand-600 dark:text-brand-300 font-semibold">
                  {booking.id}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{booking.eventSnapshot?.title}</p>
                  <p className="text-xs text-slate-500 dark:text-white/40">{booking.eventSnapshot?.venue?.city}</p>
                </td>
                <td className="py-3.5 px-4">
                  <p className="text-slate-900 dark:text-white/90">{booking.attendee?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-white/40">{booking.attendee?.email}</p>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-white/60">
                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  NPR {booking.totalAmount?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`badge text-xs capitalize ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="py-16 text-center text-slate-500 dark:text-white/40 text-sm">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
