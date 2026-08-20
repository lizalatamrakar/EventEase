import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, Ticket, ArrowRight, Edit2, Check, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getBookingsByUser } from '../services/bookingService.js';
import { useToast } from '../context/ToastContext.jsx';
import { updateUser, verifyPassword } from '../services/authService.js';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const userBookings = getBookingsByUser(user.id);
  const activeBookings = userBookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.eventSnapshot?.date) >= new Date()
  );
  const totalSpent = userBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name || '');

  // Password Change State
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSaveName = () => {
    if (!nameInput.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    updateUser(user.id, { name: nameInput.trim() });
    refreshUser?.();
    setIsEditingName(false);
    toast.success('Name updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!verifyPassword(user.id, currentPassword)) {
      setPasswordError('Current password is incorrect.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    updateUser(user.id, { password: newPassword });
    refreshUser?.();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordSection(false);
    toast.success('Password changed successfully!');
  };

  const userInitials = (user.name || user.email || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="page-wrapper pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* User Profile Card */}
        <div className="glass-card p-6 md:p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xl font-extrabold shrink-0 shadow-md">
            {userInitials}
          </div>

          <div className="flex-1 text-center sm:text-left">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                <input
                  id="profile-name-input"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="input-field py-1.5 px-3 text-base font-bold max-w-xs"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/30 flex items-center justify-center"
                  title="Save name"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(user.name);
                    setIsEditingName(false);
                  }}
                  className="w-8 h-8 rounded-lg glass-card text-slate-500 dark:text-white/40 flex items-center justify-center"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name || 'User'}</h1>
                <button
                  id="edit-name-btn"
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 dark:text-white/30 hover:text-brand-500 transition-colors p-1"
                  title="Edit name"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-600 dark:text-white/50 text-sm justify-center sm:justify-start mb-3">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </div>

            <div className="flex justify-center sm:justify-start">
              <span className="badge bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/30 text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {user.role === 'admin' ? 'Administrator' : 'Verified Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5 text-center">
            <p className="text-xs text-slate-500 dark:text-white/40 mb-1">Total Bookings</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{userBookings.length}</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-xs text-slate-500 dark:text-white/40 mb-1">Active Events</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{activeBookings.length}</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-xs text-slate-500 dark:text-white/40 mb-1">Total Spent</p>
            <p className="text-xl sm:text-2xl font-extrabold text-brand-600 dark:text-brand-300">
              NPR {totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider mb-4">Quick Navigation</h2>
          <div className="space-y-2">
            <Link
              to="/my-bookings"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">My Bookings</p>
                  <p className="text-xs text-slate-500 dark:text-white/40">View booking history and ticket receipts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors" />
            </Link>

            <Link
              to="/events"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">Browse Events</p>
                  <p className="text-xs text-slate-500 dark:text-white/40">Discover more upcoming experiences</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors" />
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">Admin Dashboard</p>
                    <p className="text-xs text-slate-500 dark:text-white/40">Manage events and system bookings</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors" />
              </Link>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Security & Password</h2>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Update your login password</p>
            </div>
            <button
              type="button"
              id="change-password-toggle"
              onClick={() => {
                setShowPasswordSection((prev) => !prev);
                setPasswordError('');
              }}
              className="btn-secondary text-xs py-2 px-3"
            >
              {showPasswordSection ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handleChangePassword} className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
              {passwordError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="label-text" htmlFor="current-pw">Current Password</label>
                <input
                  id="current-pw"
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field text-sm"
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text" htmlFor="new-pw">New Password</label>
                  <input
                    id="new-pw"
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field text-sm"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="label-text" htmlFor="confirm-pw">Confirm New Password</label>
                  <input
                    id="confirm-pw"
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field text-sm"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => !prev)}
                  className="text-xs text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
                >
                  {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswords ? 'Hide passwords' : 'Show passwords'}</span>
                </button>

                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 !text-white"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
