import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Check, MessageCircle, Sparkles, Phone, Mail, 
  ShieldCheck, Clock, Award, Rocket, Palette, Smartphone, 
  Search, Headphones, ShoppingCart, Code2, RefreshCw, Layers, Calculator,
  CheckCircle2
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { WEBSITE_PACKAGES, ADDON_SERVICES, WHY_WORK_WITH_US } from '../data/websitePricing';

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Palette,
  Smartphone,
  Search,
  ShieldCheck,
  Clock,
  Headphones,
  Award
};

const PACKAGE_ICONS: Record<string, React.ElementType> = {
  starter: Globe,
  business: Sparkles,
  professional: Layers,
  ecommerce: ShoppingCart,
  'custom-app': Code2,
  redesign: RefreshCw
};

export default function Websites() {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('business');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [extraPagesCount, setExtraPagesCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'small' | 'growth' | 'custom'>('all');

  // Filter packages based on active tab
  const displayedPackages = useMemo(() => {
    if (activeTab === 'small') {
      return WEBSITE_PACKAGES.filter(p => ['starter', 'business'].includes(p.id));
    }
    if (activeTab === 'growth') {
      return WEBSITE_PACKAGES.filter(p => ['professional', 'ecommerce'].includes(p.id));
    }
    if (activeTab === 'custom') {
      return WEBSITE_PACKAGES.filter(p => ['custom-app', 'redesign'].includes(p.id));
    }
    return WEBSITE_PACKAGES;
  }, [activeTab]);

  // Selected package object for calculator
  const selectedPackage = useMemo(() => {
    return WEBSITE_PACKAGES.find(p => p.id === selectedPackageId) || WEBSITE_PACKAGES[1];
  }, [selectedPackageId]);

  // Calculate total price in calculator
  const calculatedTotal = useMemo(() => {
    let total = selectedPackage.price;
    selectedAddons.forEach(addonId => {
      const addon = ADDON_SERVICES.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    total += extraPagesCount * 2000;
    return total;
  }, [selectedPackage, selectedAddons, extraPagesCount]);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // WhatsApp pre-filled message generator for the calculator
  const calculatorWhatsAppUrl = useMemo(() => {
    const addonNames = selectedAddons
      .map(id => ADDON_SERVICES.find(a => a.id === id)?.name)
      .filter(Boolean);

    if (extraPagesCount > 0) {
      addonNames.push(`${extraPagesCount} Extra Page(s)`);
    }

    const addonsText = addonNames.length > 0 
      ? `%0A%0A*Selected Add-ons:*%0A• ${addonNames.join('%0A• ')}`
      : '';

    const text = `Hi PlugWaSigns! I'm interested in getting a website.%0A%0A*Selected Package:* ${encodeURIComponent(selectedPackage.name)} (KSh ${selectedPackage.priceDisplay})${addonsText}%0A%0A*Estimated Total:* KSh ${calculatedTotal.toLocaleString()}%0A%0ACan we discuss the next steps?`;
    
    return `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${text}`;
  }, [selectedPackage, selectedAddons, extraPagesCount, calculatedTotal]);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">

        {/* ── Header / Hero ────────────────────────────────────────── */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue/15 border border-blue/30 text-blue-light text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles size={14} className="text-accent" /> Digital Solutions • Your Vision. Our Code.
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            WEBSITE DESIGN &amp; DEVELOPMENT
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            Professional, responsive, and high-converting websites crafted for Kenyan businesses, startups, retailers, and ambitious individuals.
          </p>

          {/* Quick Pillars Strip */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-accent" /> Mobile &amp; Desktop Optimized
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-accent" /> M-Pesa &amp; WhatsApp Integration
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-accent" /> Local SEO &amp; Google Maps
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-accent" /> Transparent Pricing in KSh
            </span>
          </div>
        </div>

        {/* ── Category Filter Tabs ─────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-10">
          {[
            { id: 'all', label: 'All Packages (6)' },
            { id: 'small', label: 'Starter & Business' },
            { id: 'growth', label: 'Professional & E-Commerce' },
            { id: 'custom', label: 'Custom App & Redesign' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-accent text-black border-accent shadow-[0_0_20px_rgba(227,255,0,0.3)]'
                  : 'bg-primary-light text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Pricing Cards Grid ───────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {displayedPackages.map((pkg) => {
            const PkgIcon = PACKAGE_ICONS[pkg.id] || Globe;
            const isSelectedInCalc = selectedPackageId === pkg.id;

            return (
              <motion.div
                key={pkg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative bg-primary-light border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  pkg.popular 
                    ? 'border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.12)] bg-gradient-to-b from-primary-light to-[#0e1726]' 
                    : pkg.recommended
                    ? 'border-violet-500/50 shadow-[0_0_35px_rgba(139,92,246,0.12)] bg-gradient-to-b from-primary-light to-[#14122d]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Floating Badges */}
                {pkg.popular && (
                  <div className="absolute -top-3.5 right-6 bg-emerald-500 text-black text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                {pkg.recommended && (
                  <div className="absolute -top-3.5 right-6 bg-violet-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    RECOMMENDED
                  </div>
                )}

                <div>
                  {/* Package Icon & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: `${pkg.color}25`, border: `1px solid ${pkg.color}60` }}
                    >
                      <PkgIcon size={24} style={{ color: pkg.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display text-white">{pkg.name}</h3>
                      <p className="text-xs text-gray-400 font-medium">{pkg.tagline}</p>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-3 pb-5 mb-5 border-y border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">KSh</span>
                      <span className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
                        {pkg.priceDisplay}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>{pkg.revisions}</span>
                    </div>
                  </div>

                  {/* Ideal For callout */}
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Ideal For
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {pkg.idealFor}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Key Features Included
                    </span>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300 leading-normal">
                          <Check size={14} className="text-accent shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-6 border-t border-white/5">
                  <a
                    href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns!%20I'm%20interested%20in%20the%20*${encodeURIComponent(pkg.name)}*%20package%20(KSh%20${pkg.priceDisplay}).%20Can%20we%20discuss?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle size={15} />
                    Inquire on WhatsApp
                  </a>

                  <button
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      const el = document.getElementById('quote-calculator');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      isSelectedInCalc 
                        ? 'bg-blue/30 text-blue-light border border-blue/50' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <Calculator size={14} />
                    {isSelectedInCalc ? 'Selected in Calculator ↓' : 'Customize with Add-ons ↓'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Interactive Quote Calculator ─────────────────────────── */}
        <section id="quote-calculator" className="py-16 px-8 md:px-12 bg-primary rounded-3xl border border-blue/30 mb-24 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-3.5 py-1 rounded-full border border-accent/20 mb-3 inline-block">
                Interactive Estimate
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                BUILD YOUR CUSTOM WEBSITE QUOTE
              </h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                Select your package, pick any optional add-ons, and instantly send your customized specification directly to our team on WhatsApp.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Left 2 Cols: Package Selection + Add-ons */}
              <div className="md:col-span-2 space-y-8">
                {/* 1. Base Package Picker */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 block">
                    1. Select Base Package:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {WEBSITE_PACKAGES.map(pkg => {
                      const isSelected = selectedPackageId === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-blue/20 border-accent text-white shadow-md'
                              : 'bg-primary-light border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-white">{pkg.name}</span>
                            <span className="text-xs font-bold text-accent">KSh {pkg.priceDisplay}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 line-clamp-1">{pkg.tagline}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Optional Extra Pages */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                      2. Additional Custom Pages (+2,000 KSh each):
                    </label>
                    <span className="text-xs text-accent font-bold">
                      {extraPagesCount > 0 ? `+KSh ${(extraPagesCount * 2000).toLocaleString()}` : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExtraPagesCount(Math.max(0, extraPagesCount - 1))}
                      className="w-10 h-10 rounded-xl bg-primary-light border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center text-lg"
                    >
                      -
                    </button>
                    <span className="w-14 text-center font-display font-bold text-lg text-white">
                      {extraPagesCount}
                    </span>
                    <button
                      onClick={() => setExtraPagesCount(extraPagesCount + 1)}
                      className="w-10 h-10 rounded-xl bg-primary-light border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center text-lg"
                    >
                      +
                    </button>
                    <span className="text-xs text-gray-400 ml-2">
                      {extraPagesCount === 0 ? 'Base pages only' : `${extraPagesCount} extra page(s) added`}
                    </span>
                  </div>
                </div>

                {/* 3. Add-on Services Checkboxes */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 block">
                    3. Optional Add-ons &amp; Extras:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ADDON_SERVICES.filter(a => a.id !== 'extra_page').map(addon => {
                      const isChecked = selectedAddons.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-blue/15 border-blue text-white'
                              : 'bg-primary-light border-white/5 text-gray-400 hover:border-white/15'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon.id)}
                            className="mt-0.5 rounded border-white/20 text-accent focus:ring-accent"
                          />
                          <div className="flex-1 text-xs">
                            <span className="font-semibold text-white block">{addon.name}</span>
                            <span className="text-[11px] text-accent font-bold">
                              {addon.priceDisplay} KSh {addon.unit && `(${addon.unit})`}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Col: Quote Summary Card */}
              <div className="bg-primary-light rounded-2xl border border-white/10 p-6 sticky top-28 shadow-xl">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">
                  Live Summary
                </span>
                <h3 className="text-xl font-display font-bold text-white mb-4">
                  {selectedPackage.name}
                </h3>

                <div className="space-y-3 pb-6 border-b border-white/10 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Base Package</span>
                    <span className="font-mono font-bold text-white">KSh {selectedPackage.priceDisplay}</span>
                  </div>

                  {extraPagesCount > 0 && (
                    <div className="flex justify-between text-gray-300">
                      <span>{extraPagesCount}x Extra Pages</span>
                      <span className="font-mono font-bold text-white">
                        +KSh {(extraPagesCount * 2000).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedAddons.map(id => {
                    const addon = ADDON_SERVICES.find(a => a.id === id);
                    if (!addon) return null;
                    return (
                      <div key={id} className="flex justify-between text-gray-300">
                        <span className="truncate pr-2">{addon.name}</span>
                        <span className="font-mono font-bold text-white shrink-0">
                          +KSh {addon.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="pt-5 pb-6">
                  <span className="text-xs text-gray-400 block mb-1">Estimated Project Total</span>
                  <div className="flex items-baseline gap-1 text-accent font-display font-bold text-3xl">
                    <span className="text-base text-gray-400">KSh</span>
                    <span>{calculatedTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    *Final quote may vary based on exact custom scope and requirements.
                  </p>
                </div>

                {/* Action CTA */}
                <a
                  href={calculatorWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine w-full bg-accent hover:bg-accent-hover text-black font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle size={16} />
                  SEND QUOTE TO WHATSAPP
                </a>

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  Instantly opens WhatsApp with your configured breakdown ready to send.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Add-ons & Extra Services Table ───────────────────────── */}
        <section className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-2 inline-block">
                Transparent Pricing
              </span>
              <h2 className="text-3xl font-display font-bold mb-3">ADD-ONS &amp; EXTRA SERVICES</h2>
              <p className="text-gray-400 text-sm">Need something extra? Customize any package with these standalone options.</p>
            </div>

            <div className="bg-primary-light border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="divide-y divide-white/5">
                {ADDON_SERVICES.map(addon => (
                  <div key={addon.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm font-semibold text-white">{addon.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-accent">
                        {addon.priceDisplay} {addon.priceDisplay !== 'At cost' && 'KSh'}
                      </span>
                      {addon.unit && (
                        <span className="text-xs text-gray-400 ml-1.5 font-normal">
                          {addon.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Work With Us ─────────────────────────────────────── */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-3 inline-block">
              The PlugWaSigns Advantage
            </span>
            <h2 className="text-4xl font-display font-bold mb-4">WHY BUILD YOUR SITE WITH US?</h2>
            <p className="text-gray-400 text-base">
              We bridge the gap between physical branding and high-impact digital presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_WORK_WITH_US.map((item, idx) => {
              const IconComponent = ICON_MAP[item.icon] || Sparkles;
              return (
                <div
                  key={idx}
                  className="bg-primary-light p-6 rounded-2xl border border-white/5 hover:border-accent/40 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-accent group-hover:text-black text-blue-light flex items-center justify-center mb-5 transition-colors">
                      <IconComponent size={22} />
                    </div>
                    <h3 className="text-lg font-bold font-display text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Physical + Digital Synergy Banner ────────────────────── */}
        <section className="bg-gradient-to-r from-blue/20 via-primary to-primary-light border border-blue/30 rounded-3xl p-8 md:p-12 mb-20 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                Signage + Website Synergy
              </span>
              <h3 className="text-3xl font-display font-bold text-white">
                GETTING A PHYSICAL SIGN? BUNDLE YOUR WEBSITE &amp; SAVE.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                When we build both your storefront signage and your website, your branding is 100% unified across colors, fonts, photography, and messaging. Inquire today for exclusive bundle rates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20PlugWaSigns!%20I'd%20like%20to%20inquire%20about%20bundling%20my%20signage%20and%20a%20website.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine bg-accent text-black font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider text-center shadow-lg"
              >
                Inquire About Bundle
              </a>
              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="border border-white/20 hover:border-white text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider text-center transition-colors"
              >
                Call: {BUSINESS_CONFIG.phone}
              </a>
            </div>
          </div>
        </section>

        {/* ── Bottom Direct Contact ─────────────────────────────────── */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h4 className="text-2xl font-display font-bold text-white">Have Questions or a Custom Scope?</h4>
          <p className="text-sm text-gray-400">
            Reach out directly. We provide free consultations and quick turnaround on quotes.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 pt-2 text-sm">
            <a href={`tel:${BUSINESS_CONFIG.phone}`} className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors">
              <Phone size={16} className="text-accent" />
              <span>{BUSINESS_CONFIG.phone}</span>
            </a>
            <a href={`mailto:${BUSINESS_CONFIG.email}`} className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors">
              <Mail size={16} className="text-accent" />
              <span>{BUSINESS_CONFIG.email}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
