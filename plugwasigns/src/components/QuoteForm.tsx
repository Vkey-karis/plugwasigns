import { useState } from 'react';
import { SERVICES } from '../data/services';
import { Send, CheckCircle } from 'lucide-react';

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // IMPORTANT: Replace this with your actual Web3Forms Access Key
    // Get yours for free at: https://web3forms.com/
    formData.append("access_key", "437ecc7a-d080-4478-ab20-570911f10ba6");
    formData.append("subject", "New Quote Request from PlugWaSigns Website");
    formData.append("from_name", "PlugWaSigns Website");

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-primary-light p-8 md:p-12 rounded-2xl border border-white/10 text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-black" size={28} />
        </div>
        <h3 className="text-2xl font-display font-bold mb-4">Request Received!</h3>
        <p className="text-gray-400 mb-8">
          Thanks for reaching out. We've received your quote request and will get back to you shortly via phone or email.
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
    <form
      onSubmit={handleSubmit}
      className="bg-primary-light p-8 md:p-12 rounded-2xl border border-white/10 space-y-6"
    >
      <h3 className="text-2xl font-display font-bold mb-6">Get a Custom Quote</h3>

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
          Something went wrong. Please try again or contact us on WhatsApp.
        </div>
      )}

      {/* Honeypot Spam Protection */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Name *</label>
          <input
            required
            name="name"
            type="text"
            className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Business Name</label>
          <input
            name="business"
            type="text"
            className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="Your Company Ltd"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Phone Number *</label>
          <input
            required
            name="phone"
            type="tel"
            className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Email Address</label>
          <input
            name="email"
            type="email"
            className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Service Required *</label>
        <select
          required
          name="service"
          className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
        >
          <option value="">Select a service...</option>
          {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Project Description *</label>
        <textarea
          required
          name="message"
          rows={4}
          className="w-full bg-primary border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          placeholder="Tell us about the size, location, and what you're trying to achieve..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-accent text-black font-bold py-4 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Quote Request
          </>
        )}
      </button>
    </form>
  );
}
