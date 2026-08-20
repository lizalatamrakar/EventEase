import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';


export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    navigate(redirectPath, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(result.message || 'Failed to sign in. Check your credentials.');
    }
  };

  const handleFillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@eventease.com');
      setPassword('admin123');
    } else {
      setEmail('user@eventease.com');
      setPassword('user123');
    }
  };

  return (
    <div className="page-wrapper flex items-center justify-center px-4 py-20 min-h-screen">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl font-extrabold text-gradient">EventEase</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-600 dark:text-white/50 text-sm mt-1">Sign in to book tickets and manage your events</p>
        </div>

        {/* Demo Account Quick-Fill Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => handleFillDemo('user')}
            className="flex-1 text-xs py-2 px-3 rounded-lg glass-card hover:border-brand-500/40 text-slate-700 dark:text-white/70 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Fill Demo User
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('admin')}
            className="flex-1 text-xs py-2 px-3 rounded-lg glass-card hover:border-brand-500/40 text-slate-700 dark:text-white/70 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            Fill Demo Admin
          </button>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-4 border border-slate-200 dark:border-white/10 shadow-sm">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="label-text">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="label-text">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60 !text-white"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-white/50 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
