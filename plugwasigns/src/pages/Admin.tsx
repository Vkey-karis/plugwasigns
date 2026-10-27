import { useState, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Star, Flame, Trash2, Edit3, Save, RefreshCw, Key, 
  ExternalLink, Check, AlertCircle, Eye, EyeOff, Lock, LogOut, ArrowUpDown, 
  Tag, Layers, CheckSquare, Square, X, FolderPlus
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { type PortfolioItem } from '../data/portfolio';
import { compressImageFile, type CompressedImageResult } from '../utils/imageCompressor';

const ADMIN_PASSWORD_KEY = 'plugwasigns_admin_auth_v1';
const DEFAULT_PASSWORD = 'plugwa_admin';

export default function Admin() {
  const {
    items,
    categories,
    allDisplayCategories,
    hasDraftChanges,
    updateItem,
    addItem,
    deleteItem,
    batchUpdate,
    batchDelete,
    addCategory,
    removeCategory,
    renameCategory,
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
  const [isCompactGrid, setIsCompactGrid] = useState(false);

  // Selection & Batch Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchTargetCategory, setBatchTargetCategory] = useState<string>('');

  // Modals & Panels State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Category Manager State
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState('');

  // GitHub Publish State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    url?: string;
  }>({ type: null, message: '' });

  // Add Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>(categories[0] || '3D');
  const [newDescription, setNewDescription] = useState('');
  const [newServices, setNewServices] = useState('Installation, Fabrication');
  const [newIsHero, setNewIsHero] = useState(false);
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [newPriority, setNewPriority] = useState<number>(0);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newImageFilename, setNewImageFilename] = useState('');
  const [newImageBase64, setNewImageBase64] = useState<string>('');
  const [compressionResult, setCompressionResult] = useState<CompressedImageResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

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
      setAuthError('Incorrect admin password. (Default: plugwa_admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  };

  // Image Upload Handler with Automatic Client-Side Compression
  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean filename
    let cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');
    if (!cleanName.endsWith('.jpg') && !cleanName.endsWith('.jpeg')) {
      cleanName = cleanName.replace(/\.[a-z0-9]+$/, '') + '.jpeg';
    }
    setNewImageFilename(cleanName);

    setIsCompressing(true);
    try {
      // Automatically resize & compress large camera photos down to optimized web size
      const result = await compressImageFile(file, 1600, 1600, 0.84);
      setCompressionResult(result);
      setNewImagePreview(result.base64);
      setNewImageBase64(result.base64);
    } catch (err) {
      console.error('Failed to compress image:', err);
      // Fallback to raw file reading
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        setNewImagePreview(res);
        setNewImageBase64(res);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
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
    setCompressionResult(null);
    setNewIsHero(false);
    setNewIsFeatured(false);
    setNewPriority(0);
    setIsAddModalOpen(false);
  };

  // Category Operations
  const handleAddCategorySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    const added = addCategory(newCatInput);
    if (added) {
      setNewCatInput('');
    } else {
      alert('Category already exists or is invalid.');
    }
  };

  const handleRenameCategorySubmit = (oldName: string) => {
    if (!editingCatNewName.trim()) return;
    const renamed = renameCategory(oldName, editingCatNewName);
    if (renamed) {
      setEditingCatOldName(null);
      setEditingCatNewName('');
    } else {
      alert('Failed to rename category. Ensure the new name is unique.');
    }
  };

  const handleDeleteCategory = (catName: string) => {
    const count = items.filter(i => i.category === catName).length;
    const msg = count > 0
      ? `Category "${catName}" has ${count} items. Deleting it will reassign these items to "${categories.find(c => c !== catName)}". Continue?`
      : `Delete category "${catName}"?`;
    if (window.confirm(msg)) {
      removeCategory(catName);
    }
  };

  // Selection handlers
  const toggleSelectCard = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedIds.length === filteredAndSortedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedItems.map(i => i.id));
    }
  };

  // Batch actions
  const handleBatchCategoryChange = () => {
    if (!batchTargetCategory || selectedIds.length === 0) return;
    batchUpdate(selectedIds, { category: batchTargetCategory });
    alert(`Updated ${selectedIds.length} projects to "${batchTargetCategory}".`);
    setSelectedIds([]);
  };

  const handleBatchHeroToggle = (active: boolean) => {
    if (selectedIds.length === 0) return;
    batchUpdate(selectedIds, { isHero: active });
    setSelectedIds([]);
  };

  const handleBatchFeaturedToggle = (active: boolean) => {
    if (selectedIds.length === 0) return;
    batchUpdate(selectedIds, { isFeatured: active });
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected items?`)) {
      batchDelete(selectedIds);
      setSelectedIds([]);
    }
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

    if (!window.confirm('Ready to commit changes to GitHub? Netlify will detect the commit and deploy automatically.')) {
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
            <p className="text-sm text-gray-400 mt-2">Manage portfolio, categories, and hero images</p>
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
    <div className="pt-28 pb-32 min-h-screen bg-primary">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Top Header & Actions */}
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
              Portfolio &amp; Showcase Manager
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Select, recategorize, rank images, and push commits to Git.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="flex items-center gap-2 bg-primary-light border border-white/15 hover:border-accent/40 text-gray-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors"
              title="Add, rename, or remove categories"
            >
              <FolderPlus size={16} className="text-accent" />
              Manage Categories ({categories.length})
            </button>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-2 bg-primary-light border border-white/15 hover:border-white/40 text-gray-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors"
              title="Configure GitHub Token & Repo"
            >
              <Key size={16} className={githubSettings.token ? "text-accent" : "text-amber-400"} />
              {githubSettings.token ? "GitHub Connected" : "Connect GitHub"}
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue text-white hover:bg-blue-light px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-blue/20"
            >
              <Plus size={16} />
              Add Project
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                isPublishing 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'btn-shine bg-accent text-black hover:bg-accent-hover shadow-accent/20 hover:scale-105 active:scale-95'
              }`}
            >
              {isPublishing ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Publish to Live Site
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title="Log out"
            >
              <LogOut size={16} />
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

        {/* Statistics Bar */}
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
            <span className="text-[11px] text-gray-400">Rotating homepage 3D card</span>
          </div>
          <div className="bg-primary-light border border-blue/30 rounded-2xl p-4">
            <span className="text-xs text-blue-light uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Flame size={14} /> Featured Bento
            </span>
            <p className="text-3xl font-display font-bold text-white mt-1">{featuredCount}</p>
            <span className="text-[11px] text-gray-400">Home "Our Work" grid</span>
          </div>
          <div className="bg-primary-light border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Categories</span>
            <p className="text-3xl font-display font-bold text-white mt-1">{categories.length}</p>
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

        {/* Filters, Search & View Controls */}
        <div className="bg-primary-light border border-white/10 rounded-2xl p-4 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-primary border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Quick Filter Buttons & Density Toggle */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setHeroOnly(!heroOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  heroOnly
                    ? 'bg-accent text-black border-accent'
                    : 'bg-primary border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Star size={13} /> Hero ({heroCount})
              </button>

              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  featuredOnly
                    ? 'bg-blue text-white border-blue'
                    : 'bg-primary border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Flame size={13} /> Featured ({featuredCount})
              </button>

              <button
                onClick={() => setIsCompactGrid(!isCompactGrid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  isCompactGrid
                    ? 'bg-white/20 text-white border-white/40'
                    : 'bg-primary border-white/10 text-gray-400 hover:text-white'
                }`}
                title="Toggle between Compact grid and Detailed cards"
              >
                <Layers size={13} />
                {isCompactGrid ? 'Compact Grid' : 'Detailed Cards'}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown size={13} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-primary border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-accent"
                >
                  <option value="priority">Priority Rank</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            {allDisplayCategories.map(cat => (
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

            <button
              onClick={() => setIsCategoriesModalOpen(true)}
              className="text-xs text-accent hover:underline flex items-center gap-1 ml-auto font-bold"
            >
              + Add / Edit Categories
            </button>
          </div>
        </div>

        {/* Selection Bar / Select All */}
        <div className="flex items-center justify-between px-2 mb-4 text-xs text-gray-400">
          <button
            onClick={handleSelectAllFiltered}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            {selectedIds.length === filteredAndSortedItems.length && filteredAndSortedItems.length > 0 ? (
              <CheckSquare size={16} className="text-accent" />
            ) : (
              <Square size={16} />
            )}
            <span>
              {selectedIds.length > 0 
                ? `${selectedIds.length} of ${filteredAndSortedItems.length} selected`
                : `Select All Filtered (${filteredAndSortedItems.length})`}
            </span>
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="text-gray-400 hover:text-white underline"
            >
              Deselect all
            </button>
          )}
        </div>

        {/* Grid of Projects (Supports Compact and Normal View) */}
        <div className={`grid gap-4 ${
          isCompactGrid 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {filteredAndSortedItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <motion.div
                layout
                key={item.id}
                onClick={(e) => {
                  // If clicking directly on card container (not inside buttons/selects), toggle selection
                  if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'INPUT') {
                    toggleSelectCard(item.id);
                  }
                }}
                className={`bg-primary-light border rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-200 relative group ${
                  isSelected
                    ? 'ring-2 ring-accent border-accent shadow-[0_0_20px_rgba(227,255,0,0.2)] bg-primary-light/90'
                    : item.isHero 
                    ? 'border-accent/50 shadow-[0_0_15px_rgba(227,255,0,0.1)]' 
                    : item.isFeatured
                    ? 'border-blue/50 shadow-[0_0_15px_rgba(37,71,216,0.15)]'
                    : 'border-white/10 hover:border-white/30'
                } ${isCompactGrid ? 'p-2.5' : 'p-3.5'}`}
              >
                {/* Selection Checkbox Floating Overlay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectCard(item.id);
                  }}
                  className={`absolute top-4 left-4 z-20 rounded-md p-1 transition-colors ${
                    isSelected ? 'bg-accent text-black' : 'bg-black/60 text-white hover:bg-black/80'
                  }`}
                >
                  {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                </button>

                {/* Card Top: Image */}
                <div>
                  <div className={`relative rounded-xl overflow-hidden bg-black/60 mb-2.5 border border-white/10 group ${
                    isCompactGrid ? 'aspect-square' : 'aspect-[4/3]'
                  }`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Click Image to Preview Full Size */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImageUrl(item.image);
                      }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      title="Click to view full image"
                    >
                      <Eye size={20} />
                    </button>

                    {/* Badges Overlay */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10 pointer-events-none">
                      {item.isHero && (
                        <span className="bg-accent text-black text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
                          <Star size={9} fill="black" /> HERO
                        </span>
                      )}
                      {item.isFeatured && (
                        <span className="bg-blue text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
                          <Flame size={9} /> FEAT
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono bg-black/80 backdrop-blur-sm text-gray-300 px-1.5 py-0.5 rounded border border-white/10 pointer-events-none">
                      Rank {item.priority ?? 0}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xs text-white mb-1 line-clamp-1" title={item.title}>
                    {item.title}
                  </h3>

                  {!isCompactGrid && (
                    <p className="text-[11px] text-gray-400 line-clamp-1 mb-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Instant Controls */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {/* Category Dropdown */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0">
                      <Tag size={10} /> Cat:
                    </span>
                    <select
                      value={item.category}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateItem(item.id, { category: e.target.value })}
                      className="bg-primary border border-white/15 rounded px-1.5 py-1 text-[11px] text-accent font-bold focus:outline-none focus:border-accent w-full text-right"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hero & Featured Quick Toggles */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItem(item.id, { isHero: !item.isHero });
                      }}
                      className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                        item.isHero
                          ? 'bg-accent text-black border-accent'
                          : 'bg-primary text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <Star size={10} fill={item.isHero ? 'black' : 'none'} />
                      {item.isHero ? 'Hero' : '+Hero'}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItem(item.id, { isFeatured: !item.isFeatured });
                      }}
                      className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                        item.isFeatured
                          ? 'bg-blue text-white border-blue'
                          : 'bg-primary text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <Flame size={10} />
                      {item.isFeatured ? 'Feat' : '+Feat'}
                    </button>
                  </div>

                  {/* Stepper & Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItem(item.id, { priority: (item.priority ?? 0) + 1 });
                        }}
                        className="w-5 h-5 rounded bg-primary border border-white/10 hover:border-white/30 text-white text-[10px] flex items-center justify-center"
                      >
                        +
                      </button>
                      <span className="text-[11px] font-bold text-white w-4 text-center">
                        {item.priority ?? 0}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateItem(item.id, { priority: Math.max(0, (item.priority ?? 0) - 1) });
                        }}
                        className="w-5 h-5 rounded bg-primary border border-white/10 hover:border-white/30 text-white text-[10px] flex items-center justify-center"
                      >
                        -
                      </button>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                        }}
                        className="p-1 text-gray-400 hover:text-accent rounded transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${item.title}"?`)) {
                            deleteItem(item.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
                        title="Delete item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-24 bg-primary-light rounded-3xl border border-white/10 mt-6">
            <p className="text-base text-gray-400">No projects found with current filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setHeroOnly(false);
                setFeaturedOnly(false);
              }}
              className="mt-3 text-accent text-xs font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* FLOATING BATCH ACTIONS TOOLBAR (Appears when 1+ cards are selected) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 z-50 bg-primary-light border border-accent/40 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center gap-3 md:gap-4 backdrop-blur-md max-w-4xl"
          >
            <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
              {selectedIds.length} Selected
            </span>

            {/* Bulk Category Assign */}
            <div className="flex items-center gap-2">
              <select
                value={batchTargetCategory}
                onChange={(e) => setBatchTargetCategory(e.target.value)}
                className="bg-primary border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-accent"
              >
                <option value="">Move to Category...</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={handleBatchCategoryChange}
                disabled={!batchTargetCategory}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Quick Hero / Featured Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleBatchHeroToggle(true)}
                className="bg-accent/20 hover:bg-accent hover:text-black text-accent text-xs font-bold px-3 py-1.5 rounded-xl border border-accent/30 transition-colors"
              >
                ⭐ Set Hero
              </button>
              <button
                onClick={() => handleBatchFeaturedToggle(true)}
                className="bg-blue/20 hover:bg-blue hover:text-white text-blue-light text-xs font-bold px-3 py-1.5 rounded-xl border border-blue/40 transition-colors"
              >
                🔥 Set Featured
              </button>
            </div>

            {/* Delete Selected */}
            <button
              onClick={handleBatchDelete}
              className="text-red-400 hover:bg-red-500/10 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-500/30 transition-colors ml-auto flex items-center gap-1"
            >
              <Trash2 size={13} /> Delete
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-gray-400 hover:text-white p-1"
              title="Deselect all"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: MANAGE CATEGORIES */}
      <AnimatePresence>
        {isCategoriesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-primary-light border border-white/15 w-full max-w-lg rounded-3xl p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <FolderPlus size={20} className="text-accent" />
                  <h2 className="text-xl font-display font-bold">Manage Categories</h2>
                </div>
                <button
                  onClick={() => setIsCategoriesModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              {/* Add New Category */}
              <form onSubmit={handleAddCategorySubmit} className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="New Category Name (e.g. EMBROIDERY)"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="btn-shine bg-accent text-black font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-accent-hover shrink-0"
                >
                  Add
                </button>
              </form>

              {/* Category List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const count = items.filter(i => i.category === cat).length;
                  const isEditing = editingCatOldName === cat;

                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between p-3 bg-primary rounded-xl border border-white/10 text-xs"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingCatNewName}
                            onChange={(e) => setEditingCatNewName(e.target.value.toUpperCase())}
                            className="w-full bg-primary-light border border-accent rounded-lg px-2 py-1 text-xs text-white uppercase focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleRenameCategorySubmit(cat)}
                            className="bg-accent text-black font-bold px-2.5 py-1 rounded-lg text-[10px]"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatOldName(null)}
                            className="text-gray-400 hover:text-white text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white tracking-wider">{cat}</span>
                          <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      )}

                      {!isEditing && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCatOldName(cat);
                              setEditingCatNewName(cat);
                            }}
                            className="p-1 text-gray-400 hover:text-accent rounded"
                            title="Rename Category"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1 text-gray-400 hover:text-red-400 rounded"
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCategoriesModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD NEW PROJECT WITH IMAGE COMPRESSION */}
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
                <div>
                  <h2 className="text-2xl font-display font-bold">Add New Project</h2>
                  <p className="text-xs text-gray-400 mt-1">Photos are automatically optimized for web fast-loading</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddNewProject} className="space-y-4">
                {/* Image Upload Area with Compression Feedback */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Project Image *
                  </label>
                  <div className="border-2 border-dashed border-white/20 hover:border-accent/50 rounded-2xl p-5 text-center transition-colors">
                    {isCompressing ? (
                      <div className="py-8 text-center text-xs text-accent flex flex-col items-center gap-2">
                        <RefreshCw size={24} className="animate-spin" />
                        <span>Optimizing and compressing image...</span>
                      </div>
                    ) : newImagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={newImagePreview}
                          alt="Preview"
                          className="max-h-52 mx-auto rounded-xl object-contain border border-white/10"
                        />
                        {compressionResult && (
                          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full">
                            <Check size={13} />
                            <span>
                              {compressionResult.originalSizeKB} KB &rarr; {compressionResult.compressedSizeKB} KB 
                              ({compressionResult.savingsPercent}% smaller)
                            </span>
                          </div>
                        )}
                        <p className="text-[11px] text-gray-400 font-mono block">Filename: {newImageFilename}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setNewImagePreview(null);
                            setNewImageFilename('');
                            setNewImageBase64('');
                            setCompressionResult(null);
                          }}
                          className="text-xs text-red-400 hover:underline font-bold block mx-auto"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-4">
                        <Plus size={28} className="mx-auto text-accent mb-2" />
                        <span className="text-sm font-bold text-white block">Click or drop image here</span>
                        <span className="text-xs text-gray-500 block mt-1">Automatic compression enabled (JPG, PNG, WEBP)</span>
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
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Bistro – 3D Illuminated Sign"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs font-bold text-accent"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      Priority Rank (0 = Normal, 10 = High)
                    </label>
                    <input
                      type="number"
                      value={newPriority}
                      onChange={(e) => setNewPriority(Number(e.target.value))}
                      className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Description / Caption
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of the sign or branding job..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                {/* Services Tags */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Services Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="3D Signage, Installation, Fabrication"
                    value={newServices}
                    onChange={(e) => setNewServices(e.target.value)}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2.5 bg-primary border border-white/10 rounded-xl p-2.5 cursor-pointer hover:border-accent/40">
                    <input
                      type="checkbox"
                      checked={newIsHero}
                      onChange={(e) => setNewIsHero(e.target.checked)}
                      className="w-4 h-4 text-accent accent-accent rounded"
                    />
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Star size={13} className="text-accent" /> Hero Showcase
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 bg-primary border border-white/10 rounded-xl p-2.5 cursor-pointer hover:border-blue/40">
                    <input
                      type="checkbox"
                      checked={newIsFeatured}
                      onChange={(e) => setNewIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-blue accent-blue rounded"
                    />
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Flame size={13} className="text-blue-light" /> Featured Bento
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine bg-accent text-black font-bold px-6 py-2 rounded-xl text-xs hover:bg-accent-hover"
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
                <h2 className="text-xl font-display font-bold">Edit Project</h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-accent font-bold focus:outline-none focus:border-accent text-xs"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Services Tags
                  </label>
                  <input
                    type="text"
                    value={editingItem.services.join(', ')}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      services: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateItem(editingItem.id, editingItem);
                      setEditingItem(null);
                    }}
                    className="btn-shine bg-accent text-black font-bold px-6 py-2 rounded-xl text-xs hover:bg-accent-hover"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: IMAGE PREVIEW */}
      <AnimatePresence>
        {previewImageUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setPreviewImageUrl(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20">
              <img src={previewImageUrl} alt="Enlarged preview" className="max-w-full max-h-[85vh] object-contain" />
              <button
                onClick={() => setPreviewImageUrl(null)}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
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
                  <h2 className="text-xl font-display font-bold">GitHub Sync Settings</h2>
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
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    GitHub Repository (owner/repo)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsRepo}
                    onChange={(e) => setSettingsRepo(e.target.value)}
                    placeholder="Vkey-karis/plugwasigns"
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Branch
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsBranch}
                    onChange={(e) => setSettingsBranch(e.target.value)}
                    placeholder="main"
                    className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Personal Access Token (PAT)</span>
                    <a
                      href="https://github.com/settings/tokens/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-accent underline flex items-center gap-1"
                    >
                      Generate token <ExternalLink size={10} />
                    </a>
                  </label>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      required
                      value={settingsToken}
                      onChange={(e) => setSettingsToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-primary border border-white/15 rounded-xl px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-accent text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    Token only requires the <strong>repo</strong> scope to commit updates directly to your GitHub repository.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine bg-accent text-black font-bold px-6 py-2 rounded-xl text-xs hover:bg-accent-hover"
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
