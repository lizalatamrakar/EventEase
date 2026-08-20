import { Minus, Plus, ArrowRight } from 'lucide-react';

export default function TicketSelectStep({ event, selectedTickets, setSelectedTickets, onNext }) {
  const handleQuantityChange = (ticketTypeId, delta) => {
    setSelectedTickets((prev) => {
      const ticketTier = event.ticketTypes.find((t) => t.id === ticketTypeId);
      const existing = prev.find((t) => t.ticketTypeId === ticketTypeId);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        return prev.filter((t) => t.ticketTypeId !== ticketTypeId);
      }
      if (ticketTier && newQty > ticketTier.available) {
        return prev;
      }

      if (!existing) {
        return [...prev, { ticketTypeId, quantity: newQty }];
      }

      return prev.map((t) =>
        t.ticketTypeId === ticketTypeId ? { ...t, quantity: newQty } : t
      );
    });
  };

  const totalTicketsSelected = selectedTickets.reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select Tickets</h2>
      <p className="text-slate-600 dark:text-white/50 text-sm mb-6">Choose your preferred ticket tiers and quantities.</p>

      <div className="space-y-3 mb-8">
        {event.ticketTypes.map((tier) => {
          const selected = selectedTickets.find((t) => t.ticketTypeId === tier.id);
          const quantity = selected ? selected.quantity : 0;
          const isSoldOut = tier.available === 0;

          return (
            <div
              key={tier.id}
              className={`glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSoldOut ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-base">{tier.name}</span>
                  {tier.available > 0 && tier.available <= 15 && (
                    <span className="badge bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs">
                      Only {tier.available} left
                    </span>
                  )}
                  {isSoldOut && (
                    <span className="badge bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30 text-xs">
                      Sold Out
                    </span>
                  )}
                </div>
                <p className="text-slate-500 dark:text-white/40 text-sm">{tier.description || 'General entry pass'}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <p className="font-bold text-brand-600 dark:text-brand-400 text-lg">
                  {tier.price === 0 ? 'Free' : `NPR ${tier.price.toLocaleString()}`}
                </p>

                {/* Counter controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id={`minus-${tier.id}`}
                    disabled={quantity === 0 || isSoldOut}
                    onClick={() => handleQuantityChange(tier.id, -1)}
                    className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-slate-700 dark:text-white hover:border-brand-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center font-bold text-slate-900 dark:text-white text-sm">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    id={`plus-${tier.id}`}
                    disabled={isSoldOut || quantity >= tier.available}
                    onClick={() => handleQuantityChange(tier.id, 1)}
                    className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-300 hover:bg-brand-500/25 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        id="step1-next"
        type="button"
        disabled={totalTicketsSelected === 0}
        onClick={onNext}
        className="btn-primary w-full justify-center py-3 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed !text-white"
      >
        <span>Continue to Attendee Info</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
