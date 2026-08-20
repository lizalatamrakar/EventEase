import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Tickets' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Payment' },
];

export default function BookingStepper({ currentStep }) {
  return (
    <nav aria-label="Booking progress" className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                aria-current={active ? 'step' : undefined}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? 'bg-brand-600 text-white'
                    : active
                    ? 'bg-brand-600 text-white shadow-md scale-110'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 border border-slate-200 dark:border-white/10'
                }`}
              >
                {done ? <Check className="w-4 h-4 text-white" aria-hidden="true" /> : step.id}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block transition-colors duration-200 ${
                  active
                    ? 'text-brand-600 dark:text-brand-400 font-semibold'
                    : done
                    ? 'text-slate-600 dark:text-white/60'
                    : 'text-slate-400 dark:text-white/30'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-1 mb-5 transition-all duration-300 ${
                  done ? 'bg-brand-600' : 'bg-slate-200 dark:bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
