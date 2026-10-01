import { useState } from 'react';
import { SERVICES } from '../data/services';
import { Send } from 'lucide-react';

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate backend submission
    setTimeout(() => {
      setStatus('success');
      // Reset form if needed
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="bg-primary-light p-8 md:p-12 rounded-2xl border border-white/10 text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="text-black" size={24} />
        </div>
        <h3 className="text-2xl font-display font-bold mb-4">Request Received!</h3>
        <p className="text-gray-400 mb-8">
          Thanks for reaching out. We've received your quote request and will get back to you shortly.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-accent font-medium hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-primary-light p-8 md:p-12 rounded-2xl border border-white/10 space-y-6">
      <h3 className="text-2xl font-display font-bold mb-6">Get a Custom Quote</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Name *</label>
          <input required type="text" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Business Name</label>
          <input type="text" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="Your Company Ltd" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Phone Number *</label>
          <input required type="tel" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="+254 7XX XXX XXX" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Email Address</label>
          <input type="email" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="john@example.com" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Service Required *</label>
        <select required className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none">
          <option value="">Select a service...</option>
          {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Project Description *</label>
        <textarea required rows={4} className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="Tell us about the size, location, and what you're trying to achieve..."></textarea>
      </div>

      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full bg-accent text-black font-bold py-4 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-70 flex justify-center items-center"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Quote Request'}
      </button>
    </form>
  );
}
