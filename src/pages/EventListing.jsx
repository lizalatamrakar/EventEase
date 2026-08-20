import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { searchEvents, getCategories } from '../services/eventService.js';
import EventCard from '../components/events/EventCard.jsx';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured First' },
  { value: 'date_asc', label: 'Earliest Date' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const ITEMS_PER_PAGE = 8;

export default function EventListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('default');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Load available categories
  useEffect(() => {
    setCategories(getCategories());
  }, []);

  // Update query/category when URL params change
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlCat = searchParams.get('category') || 'All';
    setQuery(urlQuery);
    setCategory(urlCat);
  }, [searchParams]);

  // Compute filtered events
  const filteredEvents = searchEvents(query, {
    category,
    sort,
    dateFrom,
    dateTo,
    maxPrice: maxPrice ? Number(maxPrice) : null,
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, sort, dateFrom, dateTo, maxPrice]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (query.trim()) params.q = query.trim();
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const params = {};
    if (query.trim()) params.q = query.trim();
    if (newCat !== 'All') params.category = newCat;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setQuery('');
    setCategory('All');
    setSort('default');
    setDateFrom('');
    setDateTo('');
    setMaxPrice('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(query || category !== 'All' || dateFrom || dateTo || maxPrice);

  return (
    <div className="page-wrapper pt-20 pb-16">
      {/* Header Banner */}
      <div className="section-banner border-b border-slate-200 dark:border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Explore Events</h1>
          <p className="text-slate-600 dark:text-white/50 text-sm">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            {category !== 'All' && <span className="text-brand-600 dark:text-brand-400 font-semibold"> in {category}</span>}
          </p>

          {/* Search, Sort, and Filter Controls */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
              <input
                id="events-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events by keyword, artist, or venue..."
                aria-label="Search events"
                className="input-field pl-10"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <label htmlFor="sort-select" className="sr-only">Sort order</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field pr-10 appearance-none cursor-pointer text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40 pointer-events-none" />
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              id="filter-toggle-btn"
              onClick={() => setFiltersOpen((prev) => !prev)}
              aria-expanded={filtersOpen}
              className={`btn-secondary flex items-center justify-center gap-2 ${
                filtersOpen || hasActiveFilters ? 'border-brand-500/50 text-brand-600 dark:text-brand-400 font-semibold' : ''
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500" />
              )}
            </button>
          </form>

          {/* Expandable Filter Panel */}
          {filtersOpen && (
            <div className="mt-4 glass-card p-5 animate-fade-in border border-slate-200 dark:border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label htmlFor="cat-select" className="label-text">Category</label>
                  <select
                    id="cat-select"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="input-field text-sm cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label htmlFor="filter-date-from" className="label-text">From Date</label>
                  <input
                    id="filter-date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label htmlFor="filter-date-to" className="label-text">To Date</label>
                  <input
                    id="filter-date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label htmlFor="filter-max-price" className="label-text">Max Price (NPR)</label>
                  <input
                    id="filter-max-price"
                    type="number"
                    placeholder="e.g. 2000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="btn-ghost text-xs text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {paginatedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center my-8">
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No matching events found</p>
            <p className="text-slate-600 dark:text-white/50 text-sm mb-6">Try adjusting your search terms or clearing your filters.</p>
            <button
              onClick={handleClearFilters}
              className="btn-secondary text-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-slate-700 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-500/40 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-semibold text-slate-600 dark:text-white/60 px-4">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-slate-700 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-500/40 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
