import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { getEventById } from '../services/eventService.js';
import { createBooking } from '../services/bookingService.js';
import BookingStepper from '../components/booking/BookingStepper.jsx';
import TicketSelectStep from '../components/booking/TicketSelectStep.jsx';
import AttendeeFormStep from '../components/booking/AttendeeFormStep.jsx';
import ReviewStep from '../components/booking/ReviewStep.jsx';
import PaymentStep from '../components/booking/PaymentStep.jsx';

export default function BookingFlow() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    booking,
    startBooking,
    setSelectedTickets,
    setAttendee,
    setStep,
    resetBooking,
    totalAmount
  } = useBooking();

  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize booking context with event and default user info
  useEffect(() => {
    if (!booking.event || booking.event.id !== eventId) {
      const eventData = getEventById(eventId);
      if (!eventData) {
        navigate('/events');
        return;
      }
      startBooking(eventData);
      if (user) {
        setAttendee({
          name: user.name || '',
          email: user.email || '',
          phone: ''
        });
      }
    }
  }, [eventId, user]);

  const { event, step, selectedTickets = [], attendee = {} } = booking;

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleProcessPayment = async (chosenMethod = 'esewa') => {
    setIsProcessing(true);
    // Short simulated network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newBooking = createBooking({
      userId: user.id,
      event,
      tickets: selectedTickets,
      attendee,
      paymentMethod: chosenMethod,
    });

    setIsProcessing(false);
    resetBooking();
    navigate(`/booking/confirmation/${newBooking.id}`);
  };

  if (!event) return null;

  return (
    <div className="page-wrapper pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Event Header Banner */}
        <div className="glass-card p-4 flex items-center gap-4 mb-6 border border-slate-200 dark:border-white/5 shadow-sm">
          <img
            src={event.image}
            alt={event.title}
            className="w-16 h-12 rounded-lg object-cover shrink-0 bg-slate-800"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80';
            }}
          />
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{event.title}</h1>
            <p className="text-slate-600 dark:text-white/50 text-xs mt-0.5">
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })} · {event.venue?.city}
            </p>
          </div>
        </div>

        {/* Multi-step progress indicator */}
        <BookingStepper currentStep={step} />

        {/* Step Content Container */}
        <div className="glass-card p-6 md:p-8 animate-fade-in border border-slate-200 dark:border-white/10 shadow-sm">
          {step === 1 && (
            <TicketSelectStep
              event={event}
              selectedTickets={selectedTickets}
              setSelectedTickets={setSelectedTickets}
              onNext={handleNextStep}
            />
          )}

          {step === 2 && (
            <AttendeeFormStep
              attendee={attendee}
              setAttendee={setAttendee}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          )}

          {step === 3 && (
            <ReviewStep
              event={event}
              selectedTickets={selectedTickets}
              attendee={attendee}
              totalAmount={totalAmount}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          )}

          {step === 4 && (
            <PaymentStep
              totalAmount={totalAmount}
              onPay={handleProcessPayment}
              onBack={handlePrevStep}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>
    </div>
  );
}
