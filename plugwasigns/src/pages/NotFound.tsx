import { Link } from 'react-router-dom';
import { ArrowLeft, MapPinOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-8 text-accent">
          <MapPinOff size={48} />
        </div>
        <h1 className="text-6xl font-display font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Looks like this sign is pointing somewhere else.</h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center bg-accent text-black px-8 py-4 rounded-full font-bold hover:bg-accent-hover transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          BACK HOME
        </Link>
      </div>
    </div>
  );
}
