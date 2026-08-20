import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Music, Zap, Dumbbell, Palette, Briefcase, UtensilsCrossed, ChevronRight, ArrowRight } from 'lucide-react';
import { getFeaturedEvents, getAllEvents } from '../services/eventService.js';
import EventCard from '../components/events/EventCard.jsx';

const CATEGORIES = [
  { name: 'Music', icon: Music, color: 'from-purple-600 to-pink-600' },
  { name: 'Tech', icon: Zap, color: 'from-blue-600 to-cyan-500' },
  { name: 'Sports', icon: Dumbbell, color: 'from-emerald-600 to-teal-500' },
  { name: 'Arts', icon: Palette, color: 'from-pink-600 to-rose-500' },
  { name: 'Business', icon: Briefcase, color: 'from-amber-600 to-orange-500' },
  { name: 'Food', icon: UtensilsCrossed, color: 'from-orange-600 to-red-500' },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const allEvents = getAllEvents();
  const featuredEvents = getFeaturedEvents();
  const categoryCount = new Set(allEvents.map((e) => e.category)).size;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 section-banner border-b border-slate-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" /> Fast, Simple Event Ticket Booking
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
            Discover & Book Tickets to <br />
            <span className="text-gradient">Nepal's Best Events</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-white/60 mb-8 max-w-xl mx-auto">
            From live concerts and cultural exhibitions to tech conferences and sporting events — secure your spot in seconds.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="glass-card p-2 flex items-center gap-2 shadow-sm border border-slate-200 dark:border-white/10">
              <Search className="w-5 h-5 text-slate-400 dark:text-white/40 ml-3 shrink-0" />
              <input
                id="hero-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event title, artist, or venue..."
                aria-label="Search events"
                className="flex-1 bg-transparent py-2.5 px-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-xl shrink-0 text-sm font-semibold !text-white"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Category Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500 dark:text-white/50">
            <span>Popular:</span>
            {['Jazz Night', 'Tech Summit', 'Trail Run', 'Food Fest'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/events?q=${encodeURIComponent(tag)}`)}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors underline underline-offset-2"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats Bar */}
      <section className="py-8 px-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-brand-500/[0.03]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{allEvents.length}+</p>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">Live Events</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{categoryCount}</p>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">1,500+</p>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">Tickets Booked</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">100%</p>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">Instant Confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
            <p className="text-slate-500 dark:text-white/50 text-xs mt-0.5">Find experiences that match your interests</p>
          </div>
          <Link to="/events" className="btn-ghost text-xs">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              to={`/events?category=${name}`}
              className="glass-card-hover p-4 flex flex-col items-center text-center group rounded-xl"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-6 px-4 max-w-7xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Events</h2>
            <p className="text-slate-500 dark:text-white/50 text-xs mt-0.5">Hand-picked events happening soon</p>
          </div>
          <Link to="/events" className="btn-ghost text-xs">
            All Events <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
