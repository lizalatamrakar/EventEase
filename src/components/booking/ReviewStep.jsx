import { ArrowLeft, ArrowRight, Calendar, MapPin } from 'lucide-react';

export default function ReviewStep({ event, selectedTickets, attendee, totalAmount, onNext, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review Your Order</h2>
      <p className="text-slate-600 dark:text-white/50 text-sm mb-6">Please verify your booking details before proceeding to payment.</p>

      {/* Event Summary */}
      <div className="glass-card p-5 mb-4">
        <h3 className="text-xs uppercase font-bold text-slate-500 dark:text-white/40 tracking-wider mb-3">Event</h3>
        <div className="flex gap-4 items-center">
          <img
            src={event.image}
            alt={event.title}
            className="w-20 h-16 rounded-xl object-cover shrink-0 bg-slate-800"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80';
            }}
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-base">{event.title}</p>
            <p className="text-slate-600 dark:text-white/60 text-xs mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })} · {event.time}
            </p>
            <p className="text-slate-500 dark:text-white/40 text-xs mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
              {event.venue?.name}, {event.venue?.city}
            </p>
          </div>
        </div>
      </div>

      {/* Tickets Breakdown */}
      <div className="glass-card p-5 mb-4">
        <h3 className="text-xs uppercase font-bold text-slate-500 dark:text-white/40 tracking-wider mb-3">Selected Tickets</h3>
        <div className="divide-y divide-slate-200 dark:divide-white/5 text-sm">
          {selectedTickets.map((item) => {
            const tier = event.ticketTypes.find((t) => t.id === item.ticketTypeId);
            const lineTotal = (tier?.price || 0) * item.quantity;
            return (
              <div key={item.ticketTypeId} className="py-2.5 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{tier?.name || 'General Ticket'}</p>
                  <p className="text-xs text-slate-500 dark:text-white/40">
                    {item.quantity} × NPR {(tier?.price || 0).toLocaleString()}
                  </p>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">NPR {lineTotal.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200 dark:border-white/10">
          <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
          <span className="font-extrabold text-brand-600 dark:text-brand-400 text-lg">
            NPR {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Attendee Summary */}
      <div className="glass-card p-5 mb-8">
        <h3 className="text-xs uppercase font-bold text-slate-500 dark:text-white/40 tracking-wider mb-3">Primary Attendee</h3>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{attendee.name}</p>
        <p className="text-xs text-slate-600 dark:text-white/50 mt-0.5">{attendee.email} · {attendee.phone}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex-1 justify-center flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          id="step3-next"
          type="button"
          onClick={onNext}
          className="btn-primary flex-1 justify-center flex items-center gap-2 !text-white"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
