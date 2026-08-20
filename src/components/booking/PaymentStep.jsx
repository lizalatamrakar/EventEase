import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, Smartphone, ShieldCheck, Check } from 'lucide-react';

export default function PaymentStep({ totalAmount, onPay, onBack, isProcessing }) {
  const [method, setMethod] = useState('esewa'); // 'esewa' | 'khalti' | 'card'
  const [esewaId, setEsewaId] = useState('9841234567');
  const [esewaPin, setEsewaPin] = useState('1234');
  const [khaltiId, setKhaltiId] = useState('9801234567');
  const [khaltiPin, setKhaltiPin] = useState('1234');

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    onPay(method);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Choose Payment Method</h2>
      <p className="text-slate-600 dark:text-white/50 text-sm mb-6">
        Select your preferred digital wallet or card to complete your booking.
      </p>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* eSewa */}
        <button
          type="button"
          onClick={() => setMethod('esewa')}
          className={`glass-card p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all border ${
            method === 'esewa'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'hover:border-slate-300 dark:hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-sm mb-2 shadow-sm">
            e
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">eSewa</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Digital Wallet</span>
        </button>

        {/* Khalti */}
        <button
          type="button"
          onClick={() => setMethod('khalti')}
          className={`glass-card p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all border ${
            method === 'khalti'
              ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-600/5 dark:bg-purple-600/10'
              : 'hover:border-slate-300 dark:hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-[#5c2d91] flex items-center justify-center text-white font-black text-sm mb-2 shadow-sm">
            K
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Khalti</span>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Digital Wallet</span>
        </button>

        {/* Credit / Debit Card */}
        <button
          type="button"
          onClick={() => setMethod('card')}
          className={`glass-card p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all border ${
            method === 'card'
              ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-500/5 dark:bg-brand-500/10'
              : 'hover:border-slate-300 dark:hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white mb-2 shadow-sm">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Cards</span>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">Debit / Credit</span>
        </button>
      </div>

      {/* Method-Specific Form */}
      <form onSubmit={handleSubmitPayment}>
        <div className="glass-card p-5 sm:p-6 mb-6 border border-slate-200 dark:border-white/10 shadow-sm">
          {/* eSewa Form */}
          {method === 'esewa' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                    e
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">eSewa Mobile Wallet</span>
                </div>
                <span className="badge bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure Connection
                </span>
              </div>

              <div>
                <label className="label-text" htmlFor="esewa-id">eSewa ID / Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
                  <input
                    id="esewa-id"
                    type="text"
                    required
                    value={esewaId}
                    onChange={(e) => setEsewaId(e.target.value)}
                    placeholder="e.g. 9841234567"
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="label-text" htmlFor="esewa-pin">eSewa Password / MPIN</label>
                <input
                  id="esewa-pin"
                  type="password"
                  required
                  value={esewaPin}
                  onChange={(e) => setEsewaPin(e.target.value)}
                  placeholder="••••"
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your transaction is secured with eSewa instant validation.</span>
              </div>
            </div>
          )}

          {/* Khalti Form */}
          {method === 'khalti' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#5c2d91] flex items-center justify-center text-white font-bold text-xs">
                    K
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Khalti Digital Wallet</span>
                </div>
                <span className="badge bg-purple-500/15 text-purple-600 dark:text-purple-300 text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure Connection
                </span>
              </div>

              <div>
                <label className="label-text" htmlFor="khalti-id">Khalti Registered Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
                  <input
                    id="khalti-id"
                    type="text"
                    required
                    value={khaltiId}
                    onChange={(e) => setKhaltiId(e.target.value)}
                    placeholder="e.g. 9801234567"
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="label-text" htmlFor="khalti-pin">4-Digit Khalti MPIN</label>
                <input
                  id="khalti-pin"
                  type="password"
                  required
                  value={khaltiPin}
                  onChange={(e) => setKhaltiPin(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-500/10 p-2.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your transaction is secured with Khalti instant validation.</span>
              </div>
            </div>
          )}

          {/* Card Form */}
          {method === 'card' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Credit or Debit Card</span>
                </div>
                <span className="badge bg-brand-500/15 text-brand-600 dark:text-brand-300 text-[10px] font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Connection
                </span>
              </div>

              <div>
                <label className="label-text" htmlFor="card-num">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
                  <input
                    id="card-num"
                    type="text"
                    value="4242 •••• •••• 4242"
                    readOnly
                    className="input-field pl-10 cursor-not-allowed text-slate-700 dark:text-white/70 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text" htmlFor="card-exp">Expiry</label>
                  <input
                    id="card-exp"
                    type="text"
                    value="12 / 28"
                    readOnly
                    className="input-field cursor-not-allowed text-slate-700 dark:text-white/70 text-sm"
                  />
                </div>
                <div>
                  <label className="label-text" htmlFor="card-cvv">CVV</label>
                  <input
                    id="card-cvv"
                    type="text"
                    value="•••"
                    readOnly
                    className="input-field cursor-not-allowed text-slate-700 dark:text-white/70 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 bg-brand-500/10 p-2.5 rounded-lg">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Payments are PCI-DSS compliant and encrypted.</span>
              </div>
            </div>
          )}
        </div>

        {/* Total Due Summary Card */}
        <div className="glass-card p-5 mb-6 flex justify-between items-center border border-slate-200 dark:border-white/10 shadow-sm">
          <div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Amount Due</span>
            <p className="text-xs text-slate-500 dark:text-white/40">Includes all taxes and booking fees</p>
          </div>
          <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">
            NPR {totalAmount.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onBack}
            className="btn-secondary flex-1 justify-center flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            id="pay-now-btn"
            type="submit"
            disabled={isProcessing}
            className={`btn-primary flex-1 justify-center py-3 text-sm sm:text-base flex items-center gap-2 disabled:opacity-60 !text-white ${
              method === 'esewa' ? '!bg-emerald-600 hover:!bg-emerald-500' : method === 'khalti' ? '!bg-[#5c2d91] hover:!bg-[#6b35a8]' : ''
            }`}
          >
            {isProcessing ? (
              <span>Processing Payment...</span>
            ) : (
              <span>
                Pay NPR {totalAmount.toLocaleString()} via {method === 'esewa' ? 'eSewa' : method === 'khalti' ? 'Khalti' : 'Card'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
