import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-wrapper min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-sm">
        <div className="text-8xl sm:text-9xl font-black text-gradient leading-none mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-white/50 text-sm mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/events" className="btn-secondary">Browse Events</Link>
        </div>
      </div>
    </div>
  );
}
