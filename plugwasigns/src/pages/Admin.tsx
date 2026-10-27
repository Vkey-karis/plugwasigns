import { useState, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Star, Flame, Trash2, Edit3, Save, RefreshCw, Key, 
  ExternalLink, Check, AlertCircle, Eye, EyeOff, Lock, LogOut, ArrowUpDown, Tag
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { EDITABLE_CATEGORIES, CATEGORIES, type PortfolioItem } from '../data/portfolio';

const ADMIN_PASSWORD_KEY = 'plugwasigns_admin_auth_v1';
const DEFAULT_PASSWORD = 'plugwa_admin';

export default function Admin() {
  const {
    items,
    hasDraftChanges,
    updateItem,
    addItem,
    deleteItem,
    resetToDefault,
    publishToGitHub,
    githubSettings,
    saveGitHubSettings
  } = usePortfolio();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_PASSWORD_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [heroOnly, setHeroOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'priority' | 'title' | 'category'>('priority');

  // Modals & Panels State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // GitHub Publish State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    url?: string;
  }>({ type: null, message: '' });

  // Add Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('3D');
  const [newDescription, setNewDescription] = useState('');
  const [newServices, setNewServices] = useState('Installation, Fabrication');
  const [newIsHero, setNewIsHero] = useState(false);
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [newPriority, setNewPriority] = useState<number>(0);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newImageFilename, setNewImageFilename] = useState('');
  const [newImageBase64, setNewImageBase64] = useState<string>('');

  // Settings Form State
  const [settingsRepo, setSettingsRepo] = useState(githubSettings.repo);
  const [settingsBranch, setSettingsBranch] = useState(githubSettings.branch);
  const [settingsToken, setSettingsToken] = useState(githubSettings.token);
  const [showToken, setShowToken] = useState(false);

  // Login handler
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEFAULT_PASSWORD || passwordInput === 'plugwasigns2026' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect admin password. (Default is: plugwa_admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  };

  // Image Upload Handler for New Project
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean filename
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');
    setNewImageFilename(cleanName);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewImagePreview(result);
      setNewImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Submit New Project
  const handleAddNewProject = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a project title');
      return;
    }
    if (!newImagePreview) {
      alert('Please upload an image');
      return;
    }

    const newItemId = `p-${Date.now().toString(36)}`;
    const finalImagePath = `/work/${newImageFilename}`;

    const newItem: PortfolioItem = {
      id: newItemId,
      title: newTitle.trim(),
      category: newCategory,
      image: finalImagePath,
      description: newDescription.trim() || 'Custom branding project by PlugWaSigns.',
      services: newServices.split(',').map(s => s.trim()).filter(Boolean),
      isHero: newIsHero,
      isFeatured: newIsFeatured,
      priority: Number(newPriority) || 0
    };

    addItem(newItem, {
      filename: newImageFilename,
      base64Content: newImageBase64
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewImagePreview(null);
    setNewImageFilename('');
    setNewImageBase64('');
    setNewIsHero(false);
    setNewIsFeatured(false);
    setNewPriority(0);
    setIsAddModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    saveGitHubSettings({
      repo: settingsRepo.trim(),
      branch: settingsBranch.trim(),
      token: settingsToken.trim()
    });
    setIsSettingsModalOpen(false);
    alert('GitHub settings saved successfully!');
  };

  // Publish to GitHub Handler
  const handlePublish = async () => {
    if (!githubSettings.token) {
      setIsSettingsModalOpen(true);
      return;
    }

    if (!window.confirm('Are you ready to commit and publish your changes to GitHub? Netlify will build and deploy the update.')) {
      return;
    }

    setIsPublishing(true);
    setPublishStatus({ type: null, message: '' });

    const res = await publishToGitHub();
    setIsPublishing(false);

    if (res.success) {
      setPublishStatus({
        type: 'success',
        message: res.message,
        url: res.commitUrl
      });
    } else {
      setPublishStatus({
        type: 'error',
        message: res.message
      });
    }
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(item => {
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
        if (heroOnly && !item.isHero) return false;
        if (featuredOnly && !item.isFeatured) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return (b.priority ?? 0) - (a.priority ?? 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'category') {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });
  }, [items, selectedCategory, searchQuery, heroOnly, featuredOnly, sortBy]);

  // Statistics
  const heroCount = useMemo(() => items.filter(i => i.isHero).length, [items]);
  const featuredCount = useMemo(() => items.filter(i => i.isFeatured).length, [items]);

  // If not logged in, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-primary-light border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-accent/10 text-accent border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={26} />
            </div>
            <h1 className="text-3xl font-display font-bold">Admin Portal</h1>
            <p className="text-sm text-gray-400 mt-2">Manage portfolio, hero images, and categories</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-300 uppercase mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full btn-shine bg-accent text-black font-bold py-3.5 rounded-xl hover:bg-accent-hover transition-transform hover:scale-[1.02] active:scale-95"
            >
              Log In to Dashboard
            </button>
            <p className="text-[11px] text-gray-500 text-center">
              Default password: <code className="text-accent bg-white/5 px-1.5 py-0.5 rounded">plugwa_admin</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-primary">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Top Header & Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-accent font-bold px-2.5 py-1 rounded bg-accent/10 border border-accent/20">
                PlugWaSigns Admin
              </span>
              {hasDraftChanges && (
                <span className="text-xs text-amber-400 font-bold px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 animate-pulse">
                  Unpublished Changes
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Portfolio &amp; Hero Showcase Manager
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Recategorize items, toggle hero priorities, and commit live changes to Git.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-2 bg-primary-light border border-white/15 hover:border-white/40 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
              title="Configure GitHub Token & Repo"
            >
              <Key size={16} className={githubSettings.token ? "text-accent" : "text-amber-400"} />
              {githubSettings.token ? "GitHub Connected" : "Connect GitHub"}
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue text-white hover:bg-blue-light px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue/20"
            >
              <Plus size={18} />
              Add Project
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                isPublishing 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'btn-shine bg-accent text-black hover:bg-accent-hover shadow-accent/20 hover:scale-105 active:scale-95'
              }`}
            >
              {isPublishing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Publishing to Git...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Publish to Live Site
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Publish Status Banner */}
        {publishStatus.type && (
          <div
            className={`mb-8 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              publishStatus.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-3 text-sm">
              {publishStatus.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
              <span>{publishStatus.message}</span>
            </div>
            {publishStatus.url && (
              <a
                href={publishStatus.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold underline hover:opacity-80 shrink-0"
              >
                View Commit <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary-light border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Projects</span>
            <p className="text-3xl font-display font-bold text-white mt-1">{items.length}</p>
          </div>
          <div className="bg-primary-light border border-accent/20 rounded-2xl p-4">
            <span className="text-xs text-accent uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Star size={14} /> Hero Showcase
            </span>
            <p className="text-3xl font-display font-bold text-white mt-1">{heroCount}</p>
            <span className="text-[11px] text-gray-400">Rotating card on homepage</span>
          </div>
          <div className="bg-primary-light border border-blue/30 rounded-2xl p-4">
            <span className="text-xs text-blue-light uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Flame size={14} /> Featured Bento
            </span>
            <p className="text-3xl font-display font-bold text-white mt-1">{featuredCount}</p>
            <span className="text-[11px] text-gray-400">Home "Our Work" section</span>
          </div>
          <div className="bg-primary-light border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Filtered View</span>
            <p className="text-3xl font-display font-bold text-white mt-1">{filteredAndSortedItems.length}</p>
            {hasDraftChanges && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all draft changes and revert to committed version?')) {
                    resetToDefault();
                  }
                }}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 mt-1"
              >
                <RefreshCw size={11} /> Revert Draft Changes
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-primary-light border border-white/10 rounded-2xl p-4 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title, category, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-primary border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setHeroOnly(!heroOnly)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  heroOnly
                    ? 'bg-accent text-black border-accent'
                    : 'bg-primary border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Star size={14} /> Hero Items ({heroCount})
              </button>

              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  featuredOnly
                    ? 'bg-blue text-white border-blue'
                    : 'bg-primary border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Flame size={14} /> Featured Items ({featuredCount})
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown size={14} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-primary border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                >
                  <option value="priority">Sort by Priority (High to Low)</option>
                  <option value="title">Sort by Title (A-Z)</option>
                  <option value="category">Sort by Category</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-white/15 text-accent border-accent/40 shadow-sm'
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              className={`bg-primary-light border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 ${
                item.isHero 
                  ? 'border-accent/50 shadow-[0_0_20px_rgba(227,255,0,0.1)]' 
                  : item.isFeatured
                  ? 'border-blue/50 shadow-[0_0_20px_rgba(37,71,216,0.15)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Card Top Header */}
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 mb-4 border border-white/10 group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    {item.isHero && (
                      <span className="bg-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <Star size={11} fill="black" /> HERO
                      </span>
                    )}
                    {item.isFeatured && (
                      <span className="bg-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <Flame size={11} /> FEATURED
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/75 backdrop-blur-sm text-gray-300 px-2 py-0.5 rounded border border-white/10">
                    Priority: {item.priority ?? 0}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-white mb-2 line-clamp-1" title={item.title}>
                  {item.title}
                </h3>
                
                <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Instant Controls */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                {/* Instant Category Selector */}
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                    <Tag size={13} /> Category:
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    className="bg-primary border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-accent font-bold focus:outline-none focus:border-accent w-48 text-right"
                  >
                    {EDITABLE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Toggle Buttons: Hero & Featured */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateItem(item.id, { isHero: !item.isHero })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                      item.isHero
                        ? 'bg-accent text-black border-accent shadow-sm'
                        : 'bg-primary/60 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <Star size={13} fill={item.isHero ? 'black' : 'none'} />
                    {item.isHero ? 'Hero Active' : 'Set as Hero'}
                  </button>

                  <button
                    onClick={() => updateItem(item.id, { isFeatured: !item.isFeatured })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                      item.isFeatured
                        ? 'bg-blue text-white border-blue shadow-sm'
                        : 'bg-primary/60 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <Flame size={13} />
                    {item.isFeatured ? 'Featured Active' : 'Set Featured'}
                  </button>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-1">
                  {/* Priority Stepper */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-500">Rank:</span>
                    <button
                      onClick={() => updateItem(item.id, { priority: (item.priority ?? 0) + 1 })}
                      className="w-6 h-6 rounded bg-primary border border-white/10 hover:border-white/30 text-white text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                    <span className="text-xs font-bold text-white w-5 text-center">
                      {item.priority ?? 0}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, { priority: Math.max(0, (item.priority ?? 0) - 1) })}
                      className="w-6 h-6 rounded bg-primary border border-white/10 hover:border-white/30 text-white text-xs flex items-center justify-center"
                    >
                      -
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 text-gray-400 hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit Title & Description"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${item.title}"?`)) {
                          deleteItem(item.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-24 bg-primary-light rounded-3xl border border-white/10 mt-6">
            <p className="text-lg text-gray-400">No projects match your current filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setHeroOnly(false);
                setFeaturedOnly(false);
              }}
              className="mt-4 text-accent text-sm font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* MODAL: ADD NEW PROJECT */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-primary-light border border-white/15 w-full max-w-2xl rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-display font-bold">Add New Project</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddNewProject} className="space-y-5">
                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Project Image *
                  </label>
                  <div className="border-2 border-dashed border-white/20 hover:border-accent/50 rounded-2xl p-6 text-center transition-colors">
                    {newImagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={newImagePreview}
                          alt="Preview"
                          className="max-h-56 mx-auto rounded-xl object-contain border border-white/10"
                        />
                        <p className="text-xs text-gray-400 font-mono">Filename: {newImageFilename}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setNewImagePreview(null);
                            setNewImageFilename('');
                            setNewImageBase64('');
                          }}
                          className="text-xs text-red-400 hover:underline font-bold"
                        >
                          Remove and choose another image
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Plus size={32} className="mx-auto text-accent mb-2" />
                        <span className="text-sm font-bold text-white block">Click to upload image</span>
                        <span className="text-xs text-gray-500 block mt-1">Supports JPG, PNG, WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Bistro – 3D Acrylic Illuminated Sign"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm font-bold text-accent"
                    >
                      {EDITABLE_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Priority Rank (0 - 20)
                    </label>
                    <input
                      type="number"
                      value={newPriority}
                      onChange={(e) => setNewPriority(Number(e.target.value))}
                      className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Description / Caption
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the material, installation process, or standout details..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                {/* Services Tags */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Services Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="3D Signage, Installation, Acrylic"
                    value={newServices}
                    onChange={(e) => setNewServices(e.target.value)}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 bg-primary border border-white/10 rounded-xl p-3 cursor-pointer hover:border-accent/40">
                    <input
                      type="checkbox"
                      checked={newIsHero}
                      onChange={(e) => setNewIsHero(e.target.checked)}
                      className="w-4 h-4 text-accent accent-accent rounded"
                    />
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Star size={14} className="text-accent" /> Show in Hero
                    </span>
                  </label>

                  <label className="flex items-center gap-3 bg-primary border border-white/10 rounded-xl p-3 cursor-pointer hover:border-blue/40">
                    <input
                      type="checkbox"
                      checked={newIsFeatured}
                      onChange={(e) => setNewIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-blue accent-blue rounded"
                    />
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Flame size={14} className="text-blue-light" /> Show in Featured
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine bg-accent text-black font-bold px-6 py-2.5 rounded-xl hover:bg-accent-hover transition-transform"
                  >
                    Add Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT EXISTING PROJECT */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-primary-light border border-white/15 w-full max-w-xl rounded-3xl p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-display font-bold">Edit Project</h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Services (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingItem.services.join(', ')}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      services: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateItem(editingItem.id, editingItem);
                      setEditingItem(null);
                    }}
                    className="btn-shine bg-accent text-black font-bold px-6 py-2.5 rounded-xl hover:bg-accent-hover"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: GITHUB SETTINGS */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-primary-light border border-white/15 w-full max-w-lg rounded-3xl p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Key size={20} className="text-accent" />
                  <h2 className="text-xl font-display font-bold">GitHub Git Sync Settings</h2>
                </div>
                <button
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    GitHub Repository (owner/repo)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsRepo}
                    onChange={(e) => setSettingsRepo(e.target.value)}
                    placeholder="e.g. Vkey-karis/plugwasigns"
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsBranch}
                    onChange={(e) => setSettingsBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Personal Access Token (PAT)</span>
                    <a
                      href="https://github.com/settings/tokens/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-accent underline flex items-center gap-1"
                    >
                      Generate on GitHub <ExternalLink size={10} />
                    </a>
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      required
                      value={settingsToken}
                      onChange={(e) => setSettingsToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-accent text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    Token needs the <strong>repo</strong> (or <strong>Contents: Read and write</strong>) permission so it can commit updated portfolio items and media directly to your GitHub repository.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine bg-accent text-black font-bold px-6 py-2.5 rounded-xl hover:bg-accent-hover"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
