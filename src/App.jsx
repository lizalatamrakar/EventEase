import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { initStorage } from './services/storage.js';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

// Initialize localStorage from seed data on first load
initStorage();

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
