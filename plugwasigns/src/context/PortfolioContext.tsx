import React, { createContext, useContext, useState } from 'react';
import { PORTFOLIO, DEFAULT_CATEGORIES, type PortfolioItem } from '../data/portfolio';
import { syncPortfolioToGitHub } from '../utils/githubSync';

interface GitHubSettings {
  repo: string;
  branch: string;
  token: string;
}

interface NewImageUpload {
  filename: string;
  base64Content: string;
}

interface LocalSavedPayload {
  categories?: string[];
  items?: PortfolioItem[];
}

interface PortfolioContextType {
  items: PortfolioItem[];
  categories: string[];
  allDisplayCategories: string[];
  hasDraftChanges: boolean;
  updateItem: (id: string, updates: Partial<PortfolioItem>) => void;
  addItem: (item: PortfolioItem, newImage?: NewImageUpload) => void;
  deleteItem: (id: string) => void;
  batchUpdate: (ids: string[], updates: Partial<PortfolioItem>) => void;
  batchDelete: (ids: string[]) => void;
  addCategory: (name: string) => boolean;
  removeCategory: (name: string) => boolean;
  renameCategory: (oldName: string, newName: string) => boolean;
  resetToDefault: () => void;
  pendingNewImages: NewImageUpload[];
  publishToGitHub: (customCommitMessage?: string) => Promise<{ success: boolean; message: string; commitUrl?: string }>;
  githubSettings: GitHubSettings;
  saveGitHubSettings: (settings: GitHubSettings) => void;
}

const LOCAL_STORAGE_KEY = 'plugwasigns_portfolio_custom_v2';
const GITHUB_SETTINGS_KEY = 'plugwasigns_github_settings_v1';

const DEFAULT_GITHUB_SETTINGS: GitHubSettings = {
  repo: 'Vkey-karis/plugwasigns',
  branch: 'main',
  token: ''
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved categories and items
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: LocalSavedPayload = JSON.parse(saved);
        if (parsed.categories && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
          return parsed.categories;
        }
      }
    } catch (e) {
      console.warn('Could not load custom categories from localStorage', e);
    }
    return DEFAULT_CATEGORIES;
  });

  const [items, setItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: LocalSavedPayload | PortfolioItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
        if ((parsed as LocalSavedPayload).items && Array.isArray((parsed as LocalSavedPayload).items)) {
          return (parsed as LocalSavedPayload).items!;
        }
      }
    } catch (e) {
      console.warn('Could not load custom portfolio from localStorage', e);
    }
    return PORTFOLIO;
  });

  const [hasDraftChanges, setHasDraftChanges] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
  });

  const [pendingNewImages, setPendingNewImages] = useState<NewImageUpload[]>([]);

  const [githubSettings, setGithubSettings] = useState<GitHubSettings>(() => {
    try {
      const saved = localStorage.getItem(GITHUB_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_GITHUB_SETTINGS;
  });

  const saveToLocalStorage = (updatedItems: PortfolioItem[], updatedCategories: string[]) => {
    setItems(updatedItems);
    setCategories(updatedCategories);
    setHasDraftChanges(true);
    try {
      const payload: LocalSavedPayload = {
        categories: updatedCategories,
        items: updatedItems
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const updateItem = (id: string, updates: Partial<PortfolioItem>) => {
    const updated = items.map(item => item.id === id ? { ...item, ...updates } : item);
    saveToLocalStorage(updated, categories);
  };

  const addItem = (newItem: PortfolioItem, newImage?: NewImageUpload) => {
    const updated = [newItem, ...items];
    if (newImage) {
      setPendingNewImages(prev => [...prev, newImage]);
    }
    saveToLocalStorage(updated, categories);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveToLocalStorage(updated, categories);
  };

  const batchUpdate = (ids: string[], updates: Partial<PortfolioItem>) => {
    const idSet = new Set(ids);
    const updated = items.map(item => idSet.has(item.id) ? { ...item, ...updates } : item);
    saveToLocalStorage(updated, categories);
  };

  const batchDelete = (ids: string[]) => {
    const idSet = new Set(ids);
    const updated = items.filter(item => !idSet.has(item.id));
    saveToLocalStorage(updated, categories);
  };

  // Category management
  const addCategory = (name: string): boolean => {
    const trimmed = name.trim().toUpperCase();
    if (!trimmed || categories.includes(trimmed)) return false;
    const updatedCategories = [...categories, trimmed];
    saveToLocalStorage(items, updatedCategories);
    return true;
  };

  const removeCategory = (name: string): boolean => {
    const trimmed = name.trim().toUpperCase();
    if (categories.length <= 1) return false;
    const updatedCategories = categories.filter(c => c !== trimmed);
    // Move any items in that category to the first remaining category
    const fallbackCategory = updatedCategories[0];
    const updatedItems = items.map(item => 
      item.category === trimmed ? { ...item, category: fallbackCategory } : item
    );
    saveToLocalStorage(updatedItems, updatedCategories);
    return true;
  };

  const renameCategory = (oldName: string, newName: string): boolean => {
    const oldTrimmed = oldName.trim().toUpperCase();
    const newTrimmed = newName.trim().toUpperCase();
    if (!newTrimmed || categories.includes(newTrimmed)) return false;
    const updatedCategories = categories.map(c => c === oldTrimmed ? newTrimmed : c);
    const updatedItems = items.map(item => 
      item.category === oldTrimmed ? { ...item, category: newTrimmed } : item
    );
    saveToLocalStorage(updatedItems, updatedCategories);
    return true;
  };

  const resetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setItems(PORTFOLIO);
    setCategories(DEFAULT_CATEGORIES);
    setHasDraftChanges(false);
    setPendingNewImages([]);
  };

  const saveGitHubSettings = (settings: GitHubSettings) => {
    setGithubSettings(settings);
    localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(settings));
  };

  const publishToGitHub = async (customCommitMessage?: string) => {
    if (!githubSettings.token) {
      return {
        success: false,
        message: 'GitHub Personal Access Token is required. Please add it in Admin Settings.'
      };
    }

    try {
      const result = await syncPortfolioToGitHub({
        token: githubSettings.token,
        repo: githubSettings.repo || 'Vkey-karis/plugwasigns',
        branch: githubSettings.branch || 'main',
        categories,
        items,
        newImages: pendingNewImages,
        commitMessage: customCommitMessage || 'admin: update portfolio content & categories'
      });

      if (result.success) {
        setPendingNewImages([]);
        setHasDraftChanges(false);
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || 'Failed to sync with GitHub API.'
      };
    }
  };

  const allDisplayCategories = ['ALL', ...categories];

  return (
    <PortfolioContext.Provider
      value={{
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
        pendingNewImages,
        publishToGitHub,
        githubSettings,
        saveGitHubSettings
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
