import React, { createContext, useContext, useState } from 'react';
import { PORTFOLIO, type PortfolioItem } from '../data/portfolio';
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

interface PortfolioContextType {
  items: PortfolioItem[];
  hasDraftChanges: boolean;
  updateItem: (id: string, updates: Partial<PortfolioItem>) => void;
  addItem: (item: PortfolioItem, newImage?: NewImageUpload) => void;
  deleteItem: (id: string) => void;
  resetToDefault: () => void;
  pendingNewImages: NewImageUpload[];
  publishToGitHub: (customCommitMessage?: string) => Promise<{ success: boolean; message: string; commitUrl?: string }>;
  githubSettings: GitHubSettings;
  saveGitHubSettings: (settings: GitHubSettings) => void;
}

const LOCAL_STORAGE_KEY = 'plugwasigns_portfolio_custom_v1';
const GITHUB_SETTINGS_KEY = 'plugwasigns_github_settings_v1';

const DEFAULT_GITHUB_SETTINGS: GitHubSettings = {
  repo: 'Vkey-karis/plugwasigns',
  branch: 'main',
  token: ''
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
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

  const saveToLocalStorage = (updatedItems: PortfolioItem[]) => {
    setItems(updatedItems);
    setHasDraftChanges(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const updateItem = (id: string, updates: Partial<PortfolioItem>) => {
    const updated = items.map(item => item.id === id ? { ...item, ...updates } : item);
    saveToLocalStorage(updated);
  };

  const addItem = (newItem: PortfolioItem, newImage?: NewImageUpload) => {
    const updated = [newItem, ...items];
    if (newImage) {
      setPendingNewImages(prev => [...prev, newImage]);
    }
    saveToLocalStorage(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveToLocalStorage(updated);
  };

  const resetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setItems(PORTFOLIO);
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
        items,
        newImages: pendingNewImages,
        commitMessage: customCommitMessage || 'admin: update portfolio content & media'
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

  return (
    <PortfolioContext.Provider
      value={{
        items,
        hasDraftChanges,
        updateItem,
        addItem,
        deleteItem,
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
