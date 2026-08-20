import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TYPE_STYLES = {
  success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-300',
  error:   'border-red-500/30 bg-red-950/90 text-red-300',
  info:    'border-brand-500/30 bg-dark-800 text-brand-300',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border text-sm shadow-lg animate-fade-in ${
              TYPE_STYLES[item.type] || TYPE_STYLES.info
            }`}
          >
            {item.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : item.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <Info className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium text-white/90">{item.message}</span>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="text-white/40 hover:text-white ml-1 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
