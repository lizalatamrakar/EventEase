import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

const CATEGORIES = ['Music', 'Sports', 'Tech', 'Arts', 'Business', 'Food'];

const DEFAULT_EVENT = {
  title: '',
  category: 'Music',
  description: '',
  date: '',
  time: '18:00',
  duration: '',
  image: '',
  venue: { name: '', address: '', city: '' },
  organizer: { name: '', email: '', phone: '' },
  ticketTypes: [
    { id: `tt_${Date.now()}`, name: 'General', price: 500, available: 100, description: 'Standard admission' }
  ],
  featured: false,
  tags: '',
};

export default function EventForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || DEFAULT_EVENT);

  // Handle general top-level field changes
  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle nested venue field changes
  const handleVenueChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      venue: { ...prev.venue, [field]: value }
    }));
  };

  // Handle nested organizer field changes
  const handleOrganizerChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      organizer: { ...prev.organizer, [field]: value }
    }));
  };

  // Handle ticket type updates
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...form.ticketTypes];
    const parsedValue = (field === 'price' || field === 'available') ? Number(value) : value;
    updatedTickets[index] = { ...updatedTickets[index], [field]: parsedValue };
    setForm((prev) => ({ ...prev, ticketTypes: updatedTickets }));
  };

  const handleAddTicket = () => {
    const newTicket = {
      id: `tt_${Date.now()}`,
      name: '',
      price: 0,
      available: 50,
      description: ''
    };
    setForm((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicket]
    }));
  };

  const handleRemoveTicket = (index) => {
    setForm((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedTags = typeof form.tags === 'string'
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : form.tags;

    onSave({ ...form, tags: formattedTags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Event Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label-text" htmlFor="admin-title">Event Title *</label>
          <input
            id="admin-title"
            type="text"
            required
            placeholder="e.g. Kathmandu Summer Music Fest"
            value={form.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="label-text" htmlFor="admin-category">Category</label>
          <select
            id="admin-category"
            value={form.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="input-field cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-text" htmlFor="admin-date">Date *</label>
          <input
            id="admin-date"
            type="date"
            required
            value={form.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            className="input-field [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="label-text" htmlFor="admin-time">Time</label>
          <input
            id="admin-time"
            type="time"
            value={form.time}
            onChange={(e) => handleFieldChange('time', e.target.value)}
            className="input-field [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="label-text" htmlFor="admin-duration">Duration</label>
          <input
            id="admin-duration"
            type="text"
            placeholder="e.g. 3 hours, 2 days"
            value={form.duration}
            onChange={(e) => handleFieldChange('duration', e.target.value)}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-text" htmlFor="admin-desc">Description *</label>
          <textarea
            id="admin-desc"
            required
            rows={3}
            placeholder="Describe the event, schedule, and highlights..."
            value={form.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="input-field resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-text" htmlFor="admin-image">Image URL</label>
          <input
            id="admin-image"
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={form.image}
            onChange={(e) => handleFieldChange('image', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Venue Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/80">Venue Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label-text text-xs" htmlFor="venue-name">Venue Name</label>
            <input
              id="venue-name"
              type="text"
              placeholder="e.g. Patan Museum"
              value={form.venue.name}
              onChange={(e) => handleVenueChange('name', e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="label-text text-xs" htmlFor="venue-address">Street Address</label>
            <input
              id="venue-address"
              type="text"
              placeholder="e.g. Patan Durbar Square"
              value={form.venue.address}
              onChange={(e) => handleVenueChange('address', e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="label-text text-xs" htmlFor="venue-city">City</label>
            <input
              id="venue-city"
              type="text"
              placeholder="e.g. Lalitpur"
              value={form.venue.city}
              onChange={(e) => handleVenueChange('city', e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      {/* Organizer Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/80">Organizer Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label-text text-xs" htmlFor="org-name">Organizer Name</label>
            <input
              id="org-name"
              type="text"
              placeholder="e.g. Live Events Nepal"
              value={form.organizer.name}
              onChange={(e) => handleOrganizerChange('name', e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="label-text text-xs" htmlFor="org-email">Email</label>
            <input
              id="org-email"
              type="email"
              placeholder="e.g. info@events.com"
              value={form.organizer.email}
              onChange={(e) => handleOrganizerChange('email', e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="label-text text-xs" htmlFor="org-phone">Phone</label>
            <input
              id="org-phone"
              type="tel"
              placeholder="e.g. +977 9800000000"
              value={form.organizer.phone}
              onChange={(e) => handleOrganizerChange('phone', e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      {/* Ticket Types Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/80">Ticket Tiers</h3>
          <button
            type="button"
            onClick={handleAddTicket}
            className="btn-ghost text-xs text-brand-400 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Ticket Type
          </button>
        </div>

        <div className="space-y-3">
          {form.ticketTypes.map((ticket, index) => (
            <div key={ticket.id || index} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center glass-card p-3">
              <div>
                <input
                  type="text"
                  placeholder="Ticket Name (e.g. VIP)"
                  value={ticket.name}
                  onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Price (NPR)"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Seats Available"
                  value={ticket.available}
                  onChange={(e) => handleTicketChange(index, 'available', e.target.value)}
                  className="input-field text-sm py-2"
                />
              </div>
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Short perks description"
                  value={ticket.description}
                  onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                  className="input-field text-sm py-2"
                />
              </div>
              <div className="flex justify-end">
                {form.ticketTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTicket(index)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                    title="Remove ticket tier"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags and Featured Checkbox */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="label-text" htmlFor="admin-tags">Tags (comma-separated)</label>
          <input
            id="admin-tags"
            type="text"
            placeholder="music, festival, patan"
            value={typeof form.tags === 'string' ? form.tags : form.tags?.join(', ')}
            onChange={(e) => handleFieldChange('tags', e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            id="admin-featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleFieldChange('featured', e.target.checked)}
            className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
          />
          <label htmlFor="admin-featured" className="text-sm font-medium text-white/70 cursor-pointer">
            Feature this event on the Home Page
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1 justify-center"
        >
          Cancel
        </button>
        <button
          id="admin-save-btn"
          type="submit"
          className="btn-primary flex-1 justify-center flex items-center gap-2"
        >
          <Check className="w-4 h-4" /> Save Event
        </button>
      </div>
    </form>
  );
}
