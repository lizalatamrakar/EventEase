import { useState } from 'react';
import { Search, Calendar, Tag, Edit2, Trash2 } from 'lucide-react';

export default function EventTable({ events, onEdit, onDeleteClick }) {
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter((event) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      event.title.toLowerCase().includes(term) ||
      event.category.toLowerCase().includes(term) ||
      event.venue?.city?.toLowerCase().includes(term)
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
            placeholder="Search events by title or category..."
            aria-label="Search events"
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
        <span className="text-slate-500 dark:text-white/40 text-sm">{filteredEvents.length} events</span>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider bg-slate-50/50 dark:bg-transparent">
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Ticket Tiers</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-12 h-9 rounded-lg object-cover shrink-0 bg-slate-800"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&q=80';
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{event.title}</p>
                      {event.featured && (
                        <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-brand-600 dark:text-brand-300 bg-brand-500/15 px-1.5 py-0.5 rounded border border-brand-500/30">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="badge badge-default text-xs">{event.category}</span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/60">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
                    <span>{event.date}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/60">
                    <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
                    <span>{event.ticketTypes?.length || 0} tier{event.ticketTypes?.length !== 1 ? 's' : ''}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      id={`edit-${event.id}`}
                      onClick={() => onEdit(event)}
                      className="w-8 h-8 rounded-lg glass-card hover:border-brand-500/40 text-slate-600 dark:text-white/60 hover:text-brand-600 dark:hover:text-brand-300 flex items-center justify-center transition-colors"
                      title="Edit event"
                      aria-label={`Edit ${event.title}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`delete-${event.id}`}
                      onClick={() => onDeleteClick(event.id)}
                      className="w-8 h-8 rounded-lg glass-card hover:border-red-500/40 text-slate-600 dark:text-white/60 hover:text-red-500 flex items-center justify-center transition-colors"
                      title="Delete event"
                      aria-label={`Delete ${event.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center text-slate-500 dark:text-white/40 text-sm">
            No events match your search.
          </div>
        )}
      </div>
    </div>
  );
}
