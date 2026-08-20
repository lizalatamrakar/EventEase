// src/routes/AppRoutes.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import Loader from '../components/common/Loader.jsx';

const Home = lazy(() => import('../pages/Home.jsx'));
const EventListing = lazy(() => import('../pages/EventListing.jsx'));
const EventDetails = lazy(() => import('../pages/EventDetails.jsx'));
const BookingFlow = lazy(() => import('../pages/BookingFlow.jsx'));
const BookingConfirmation = lazy(() => import('../pages/BookingConfirmation.jsx'));
const MyBookings = lazy(() => import('../pages/MyBookings.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullPage />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventListing />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/book/:eventId" element={
          <ProtectedRoute><BookingFlow /></ProtectedRoute>
        } />
        <Route path="/booking/confirmation/:bookingId" element={
          <ProtectedRoute><BookingConfirmation /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><MyBookings /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
