import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Phone, Mail, Ticket, ArrowLeft, ChevronRight } from 'lucide-react';
import { getEventById } from '../services/eventService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startBooking } = useBooking();
  const [event, setEvent] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const foundEvent = getEventById(id);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="page-wrapper pt-24 flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-500 dark:text-white/40 text-lg">Event not found.</p>
        <Link to="/events" className="btn-secondary">Back to Events</Link>
      </div>
    );
  }

  if (!event) return null;

  const isSoldOut = event.ticketTypes.every((tt) => tt.available === 0);
  const minPrice = event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map((t) => t.price))
    : 0;

  const handleBookClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/book/${event.id}` } } });
      return;
    }
    startBooking(event);
    navigate(`/book/${event.id}`);
  };

  return (
    <div className="page-wrapper pt-16">
      {/* Banner Image */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-slate-900">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Navigation Breadcrumb over Image */}
        <div className="absolute top-6 left-6 flex items-center gap-2 text-xs sm:text-sm bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white border border-white/10 shadow-lg">
          <Link to="/events" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Events
          </Link>
          <ChevronRight className="w-3 h-3 text-white/40" />
          <span className="text-white font-medium truncate max-w-[200px]">{event.title}</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-default text-xs">{event.category}</span>
                {event.featured && (
                  <span className="badge bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/30 text-xs font-semibold">
                    Featured Event
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Quick Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-card p-4 flex items-start gap-3">
                <Calendar className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-white/50">Date</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-white/50">Time & Duration</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {event.time} {event.duration ? `(${event.duration})` : ''}
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-white/50">Venue</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {event.venue?.name}, {event.venue?.city}
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 flex items-start gap-3">
                <User className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-white/50">Organizer</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {event.organizer?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">About the Event</h2>
              <p className="text-slate-700 dark:text-white/80 leading-relaxed text-sm whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Venue & Organizer Details */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Location & Contact</h2>
              <div className="text-sm text-slate-700 dark:text-white/80 space-y-1.5">
                <p><span className="text-slate-500 dark:text-white/40">Address:</span> {event.venue?.address}, {event.venue?.city}</p>
                <p><span className="text-slate-500 dark:text-white/40">Organizer:</span> {event.organizer?.name}</p>
                {event.organizer?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
                    <a href={`mailto:${event.organizer.email}`} className="text-brand-500 hover:underline">
                      {event.organizer.email}
                    </a>
                  </p>
                )}
                {event.organizer?.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
                    <span>{event.organizer.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column / Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 glass-card p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-white/5">
                <Ticket className="w-5 h-5 text-brand-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tickets</h2>
              </div>

              {/* Tiers list */}
              <div className="space-y-3 mb-6">
                {event.ticketTypes.map((tier) => (
                  <div key={tier.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-200 dark:border-white/5 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{tier.name}</p>
                      <p className="text-xs text-slate-500 dark:text-white/50">{tier.available} seats left</p>
                    </div>
                    <span className="font-bold text-brand-500">
                      {tier.price === 0 ? 'Free' : `NPR ${tier.price.toLocaleString()}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-500 dark:text-white/50 mb-0.5">Starting price</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {minPrice === 0 ? 'Free' : `NPR ${minPrice.toLocaleString()}`}
                </p>
              </div>

              <button
                id="book-now-btn"
                type="button"
                onClick={handleBookClick}
                disabled={isSoldOut}
                className="btn-primary w-full justify-center py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSoldOut ? 'Sold Out' : 'Book Tickets'}
              </button>

              {!user && (
                <p className="text-xs text-slate-500 dark:text-white/40 text-center mt-3">
                  You'll be prompted to sign in before checkout.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
