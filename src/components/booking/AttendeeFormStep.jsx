import { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, Phone } from 'lucide-react';

export default function AttendeeFormStep({ attendee, setAttendee, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!attendee.name?.trim()) {
      errs.name = 'Full name is required';
    }
    if (!attendee.email?.trim() || !/\S+@\S+\.\S+/.test(attendee.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!attendee.phone?.trim()) {
      errs.phone = 'Contact phone number is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleContinue}>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Attendee Information</h2>
      <p className="text-slate-600 dark:text-white/50 text-sm mb-6">Enter the contact details of the primary ticket holder.</p>

      <div className="space-y-4 mb-8">
        {/* Full Name */}
        <div>
          <label htmlFor="att-name" className="label-text">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
            <input
              id="att-name"
              type="text"
              placeholder="e.g. Spiderman"
              value={attendee.name || ''}
              onChange={(e) => {
                setAttendee((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`input-field pl-10 ${errors.name ? 'ring-2 ring-red-500 border-red-500/50' : ''}`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="att-email" className="label-text">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
            <input
              id="att-email"
              type="email"
              placeholder="e.g. attendee@example.com"
              value={attendee.email || ''}
              onChange={(e) => {
                setAttendee((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={`input-field pl-10 ${errors.email ? 'ring-2 ring-red-500 border-red-500/50' : ''}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="att-phone" className="label-text">Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
            <input
              id="att-phone"
              type="tel"
              placeholder="e.g. +977 9800000000"
              value={attendee.phone || ''}
              onChange={(e) => {
                setAttendee((prev) => ({ ...prev, phone: e.target.value }));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              className={`input-field pl-10 ${errors.phone ? 'ring-2 ring-red-500 border-red-500/50' : ''}`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex-1 justify-center flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          id="step2-next"
          type="submit"
          className="btn-primary flex-1 justify-center flex items-center gap-2 !text-white"
        >
          <span>Review Order</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
