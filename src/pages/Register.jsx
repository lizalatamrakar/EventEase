import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';


export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    navigate('/');
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({ name, email, password });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message || 'Registration failed. Try again.');
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-600 dark:text-white/50 text-sm mt-1">Join EventEase to discover and book events</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-4 border border-slate-200 dark:border-white/10 shadow-sm">
          {serverError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className="label-text">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
              <input
                id="reg-name"
                type="text"
                placeholder="e.g. Spiderman"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`input-field pl-10 ${fieldErrors.name ? 'ring-2 ring-red-500 border-red-500/50' : ''}`}
              />
            </div>
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="label-text">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                }}
                className={`input-field pl-10 ${fieldErrors.email ? 'ring-2 ring-red-500 border-red-500/50' : ''}`}
              />
            </div>
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="label-text">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
                className={`input-field pl-10 pr-10 ${fieldErrors.password ? 'ring-2 ring-red-500 border-red-500/50' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60 !text-white"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-white/50 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
