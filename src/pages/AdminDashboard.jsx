import { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService.js';
import { getBookings } from '../services/storage.js';
import { useToast } from '../context/ToastContext.jsx';
import EventForm from '../components/admin/EventForm.jsx';
import EventTable from '../components/admin/EventTable.jsx';
import BookingsTable from '../components/admin/BookingsTable.jsx';

export default function AdminDashboard() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'bookings'
  const [events, setEvents] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  
  // mode: null | 'create' | { id, data } for editing
  const [formMode, setFormMode] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Load events and bookings from storage
  const loadData = () => {
    setEvents(getAllEvents());
    setAllBookings(getBookings());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute key summary metrics
  const totalRevenue = allBookings.reduce(
    (sum, b) => sum + (b.status !== 'cancelled' ? b.totalAmount : 0),
    0
  );
  const activeEventsCount = events.filter((e) => new Date(e.date) >= new Date()).length;

  const stats = [
    { label: 'Total Events', value: events.length },
    { label: 'Total Bookings', value: allBookings.length },
    { label: 'Total Revenue', value: `NPR ${totalRevenue.toLocaleString()}` },
    { label: 'Active Events', value: activeEventsCount },
  ];

  // Event CRUD operations
  const handleSaveEvent = (eventData) => {
    if (formMode === 'create') {
      createEvent(eventData);
      toast.success('Event created successfully!');
    } else {
      updateEvent(formMode.id, eventData);
      toast.success('Event updated successfully!');
    }
    loadData();
    setFormMode(null);
  };

  const handleEditClick = (event) => {
    const formattedData = {
      ...event,
      tags: Array.isArray(event.tags) ? event.tags.join(', ') : (event.tags || '')
    };
    setFormMode({ id: event.id, data: formattedData });
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteEvent(deleteTargetId);
      loadData();
      setDeleteTargetId(null);
      toast.success('Event deleted successfully.');
    }
  };

  return (
    <div className="page-wrapper pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-white/50 text-sm mt-1">Manage events, track tickets, and view bookings</p>
          </div>
          {!formMode && activeTab === 'events' && (
            <button
              id="create-event-btn"
              onClick={() => setFormMode('create')}
              className="btn-primary flex items-center gap-2 !text-white"
            >
              <Plus className="w-4 h-4" /> New Event
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5">
              <p className="text-slate-500 dark:text-white/40 text-xs mb-1 font-medium">{s.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 p-1 glass-card inline-flex rounded-xl">
          <button
            id="tab-events"
            onClick={() => { setActiveTab('events'); setFormMode(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Events ({events.length})
          </button>
          <button
            id="tab-bookings"
            onClick={() => { setActiveTab('bookings'); setFormMode(null); }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bookings ({allBookings.length})
          </button>
        </div>

        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <div>
            {formMode ? (
              <div className="glass-card p-6 md:p-8 mb-8 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  {formMode === 'create' ? 'Create New Event' : 'Edit Event'}
                </h2>
                <EventForm
                  initialData={formMode === 'create' ? null : formMode.data}
                  onSave={handleSaveEvent}
                  onCancel={() => setFormMode(null)}
                />
              </div>
            ) : (
              <EventTable
                events={events}
                onEdit={handleEditClick}
                onDeleteClick={(id) => setDeleteTargetId(id)}
              />
            )}
          </div>
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <BookingsTable bookings={allBookings} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-sm w-full animate-fade-in shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Delete Event?</h3>
            </div>
            <p className="text-slate-600 dark:text-white/60 text-sm mb-6">
              This event will be permanently removed from the system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={handleConfirmDelete}
                className="btn-danger flex-1 justify-center"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
