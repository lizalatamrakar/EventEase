import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function EventCard({ event }) {
  const isSoldOut = event.ticketTypes.every((t) => t.available === 0);
  const isPast = new Date(event.date) < new Date();

  // Find lowest price
  const startingPrice = event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map((t) => t.price))
    : 0;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link
      to={`/events/${event.id}`}
      className="block group"
      aria-label={`${event.title} on ${formattedDate}`}
    >
      <div className={`glass-card-hover overflow-hidden rounded-xl flex flex-col h-full ${
        isSoldOut || isPast ? 'opacity-70' : ''
      }`}>
        {/* Card Thumbnail */}
        <div className="relative h-44 overflow-hidden bg-slate-800">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80';
            }}
          />

          {/* Category Tag overlaid on Image */}
          <div className="absolute top-3 left-3">
            <span className="badge text-xs bg-black/60 backdrop-blur-md border border-white/20 text-white font-medium">
              {event.category}
            </span>
          </div>

          {/* Sold Out or Featured Badge */}
          {isSoldOut ? (
            <div className="absolute top-3 right-3">
              <span className="badge bg-red-600 text-white text-xs font-bold uppercase shadow-sm">
                Sold Out
              </span>
            </div>
          ) : event.featured ? (
            <div className="absolute top-3 right-3">
              <span className="badge bg-brand-600 text-white text-xs font-bold shadow-sm">
                Featured
              </span>
            </div>
          ) : null}
        </div>

        {/* Card Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
              {event.title}
            </h3>

            <div className="space-y-1 text-xs text-slate-600 dark:text-white/60 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-white/40" />
                <span>{formattedDate} · {event.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-white/40" />
                <span className="truncate">{event.venue?.name}, {event.venue?.city}</span>
              </div>
            </div>
          </div>

          {/* Price & Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-wider">Starts from</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {startingPrice === 0 ? 'Free' : `NPR ${startingPrice.toLocaleString()}`}
              </p>
            </div>

            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
