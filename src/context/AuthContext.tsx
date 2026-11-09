import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SteamUser, UserTransaction } from '../types';
import { parseSteamTradeUrl } from '../services/steamService';

interface AuthContextType {
  user: SteamUser | null;
  isLoading: boolean;
  isCabinetOpen: boolean;
  openCabinet: () => void;
  closeCabinet: () => void;
  loginWithSteam: () => void;
  loginWithSteamId: (steamIdOrUrl: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateTradeUrl: (url: string) => void;
  syncUserWithTradeUrl: (url: string) => Promise<SteamUser | null>;
  updateBalance: (delta: number) => void;
  transactions: UserTransaction[];
  addTransaction: (tx: Omit<UserTransaction, 'id' | 'date'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = 'skintocash_steam_user_v3';
const STORAGE_TX_KEY = 'skintocash_transactions_v3';

function sanitizeUserData(u: SteamUser | null): SteamUser | null {
  if (!u) return null;
  const rawBalance = Number(u.balance || 0);
  const cleanBalance = (rawBalance === 145.5 || rawBalance === 145 || rawBalance === 145.50) ? 0.00 : rawBalance;
  const rawWithdrawn = Number(u.totalWithdrawn || 0);
  const cleanWithdrawn = rawWithdrawn === 420 ? 0.00 : rawWithdrawn;
  const rawSales = Number(u.totalSales || 0);
  const cleanSales = rawSales === 7 ? 0 : rawSales;

  return {
    ...u,
    balance: cleanBalance,
    totalWithdrawn: cleanWithdrawn,
    totalSales: cleanSales,
  };
}

const INITIAL_TRANSACTIONS: UserTransaction[] = [];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SteamUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCabinetOpen, setIsCabinetOpen] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<UserTransaction[]>(() => {
    try {
      // Clear legacy mock data and balances from all storage slots
      localStorage.removeItem('skintocash_steam_user');
      localStorage.removeItem('skintocash_steam_user_v2');
      localStorage.removeItem('skintocash_transactions');
      localStorage.removeItem('skintocash_transactions_v2');

      const saved = localStorage.getItem(STORAGE_TX_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any mock transactions
          const clean = parsed.filter((t: any) => t.id !== 'STC-98421' && t.id !== 'STC-98110' && t.id !== 'STC-97804' && t.amount !== 145.5 && t.amount !== 145);
          return clean;
        }
      }
    } catch {
      // Ignore JSON parse error
    }
    return INITIAL_TRANSACTIONS;
  });

  // Fetch updated profile from server proxy
  const fetchSteamProfile = useCallback(async (steamId64: string): Promise<Partial<SteamUser> | null> => {
    try {
      const res = await fetch(`/api/auth/steam/user?steamId64=${steamId64}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.user) {
          return data.user;
        }
      }
    } catch {
      // Ignore background refresh errors
    }
    return null;
  }, []);

  // Save transactions to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TX_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Could not save transactions to localStorage', e);
    }
  }, [transactions]);

  // Check URL parameters/hash on mount
  useEffect(() => {
    let parsedUser: SteamUser | null = null;

    try {
      // 1. Check URL Hash (e.g. #steam_auth=...)
      const hash = window.location.hash;
      if (hash && hash.includes('steam_auth=')) {
        const raw = hash.replace(/^#.*?steam_auth=/, '').split('&')[0];
        if (raw) {
          const decoded = decodeURIComponent(raw);
          parsedUser = sanitizeUserData(JSON.parse(decoded));
          if (parsedUser) {
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(parsedUser));
          }
          
          // Clean the hash and navigate directly to the /cabinet page
          window.history.replaceState(null, '', '/cabinet');
          window.dispatchEvent(new PopStateEvent('popstate'));
          setIsCabinetOpen(true);
        }
      }

      // 2. Check search params fallback (e.g. ?auth_user=...)
      if (!parsedUser) {
        const params = new URLSearchParams(window.location.search);
        const authParam = params.get('auth_user') || params.get('steam_auth');
        if (authParam) {
          parsedUser = sanitizeUserData(JSON.parse(decodeURIComponent(authParam)));
          if (parsedUser) {
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(parsedUser));
          }
          params.delete('auth_user');
          params.delete('steam_auth');
          window.history.replaceState(null, '', '/cabinet');
          window.dispatchEvent(new PopStateEvent('popstate'));
          setIsCabinetOpen(true);
        }
      }

      // 3. Fallback to localStorage
      if (!parsedUser) {
        const saved = localStorage.getItem(STORAGE_USER_KEY);
        if (saved) {
          parsedUser = sanitizeUserData(JSON.parse(saved));
        }
      }
    } catch (err) {
      console.warn('Error reading Steam auth from URL/storage:', err);
    }

    if (parsedUser) {
      setUser(parsedUser);
      // Background refresh user profile summary to keep data fresh
      fetchSteamProfile(parsedUser.steamId64).then((fresh) => {
        if (fresh) {
          setUser((prev) => {
            const next = prev ? sanitizeUserData({ ...prev, ...fresh }) : null;
            if (next) {
              try {
                localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(next));
              } catch {}
            }
            return next;
          });
        }
      });

      // Load user transactions from database
      fetch(`/api/transactions?steamId64=${parsedUser.steamId64}`)
        .then(res => res.json())
        .then(data => {
          if (data?.success && Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
          }
        })
        .catch(() => {});
    }

    setIsLoading(false);
  }, [fetchSteamProfile]);

  const loginWithSteam = useCallback(() => {
    // Redirect to the backend Steam OpenID endpoint
    window.location.href = '/api/auth/steam/login';
  }, []);

  const loginWithSteamId = useCallback(async (steamIdOrUrl: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const parsed = parseSteamTradeUrl(steamIdOrUrl);
      const steamId64 = parsed.steamId64;

      if (!steamId64) {
        setIsLoading(false);
        return { success: false, message: 'Недійсний SteamID або Trade URL' };
      }

      // Fetch user profile from backend
      const res = await fetch(`/api/auth/steam/user?steamId64=${steamId64}`);
      if (!res.ok) {
        throw new Error('Не вдалося отримати дані профілю Steam');
      }

      const data = await res.json();
      if (!data.success || !data.user) {
        throw new Error(data.error || 'Профіль Steam не знайдено');
      }

      const newUser: SteamUser = sanitizeUserData({
        ...data.user,
        tradeUrl: parsed.isValid ? steamIdOrUrl : '',
      })!;

      setUser(newUser);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err?.message || 'Помилка авторизації' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    setIsCabinetOpen(false);
  }, []);

  const updateTradeUrl = useCallback((url: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const parsed = parseSteamTradeUrl(url);
      const newSteamId = parsed.steamId64 || prev.steamId64;
      const updated = { ...prev, tradeUrl: url, steamId64: newSteamId };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));

      // Persist to server SQLite database
      fetch('/api/user/trade-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steamId64: newSteamId, tradeUrl: url }),
      }).catch(() => {});

      return updated;
    });
  }, []);

  const syncUserWithTradeUrl = useCallback(async (url: string): Promise<SteamUser | null> => {
    const parsed = parseSteamTradeUrl(url);
    const steamId64 = parsed.steamId64;

    if (!steamId64) {
      updateTradeUrl(url);
      return null;
    }

    try {
      const res = await fetch(`/api/auth/steam/user?steamId64=${steamId64}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.user) {
          const freshUser: SteamUser = {
            ...data.user,
            tradeUrl: url,
            steamId64,
          };
          setUser(freshUser);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(freshUser));
          return freshUser;
        }
      }
    } catch (e) {
      console.warn('Error fetching Steam profile in syncUserWithTradeUrl:', e);
    }

    let fallbackUser: SteamUser | null = null;
    setUser((prev) => {
      const base: SteamUser = prev || {
        steamId64,
        personaname: `Player_${steamId64.slice(-4)}`,
        avatar: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
        avatarmedium: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
        avatarfull: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        profileurl: `https://steamcommunity.com/profiles/${steamId64}`,
        loccountrycode: 'UA',
        personastate: 1,
        timecreated: Math.floor(Date.now() / 1000) - 86400 * 365 * 3,
        steamLevel: 1,
        tradeBanned: false,
        balance: 0,
        totalWithdrawn: 0,
        totalSales: 0,
        joinedAt: '2024',
      };
      fallbackUser = {
        ...base,
        tradeUrl: url,
        steamId64,
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(fallbackUser));
      return fallbackUser;
    });

    return fallbackUser;
  }, [updateTradeUrl]);

  const updateBalance = useCallback((delta: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const newBalance = Math.max(0, Math.round(((prev.balance || 0) + delta) * 100) / 100);
      const updated = sanitizeUserData({ ...prev, balance: newBalance })!;
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));

      // Persist to server SQLite database
      fetch('/api/user/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steamId64: prev.steamId64, delta }),
      }).catch(() => {});

      return updated;
    });
  }, []);

  const addTransaction = useCallback((tx: Omit<UserTransaction, 'id' | 'date'>) => {
    const newTx: UserTransaction = {
      ...tx,
      id: `STC-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Persist to server SQLite database
    setUser((currentUser) => {
      if (currentUser?.steamId64) {
        fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ steamId64: currentUser.steamId64, tx: newTx }),
        }).catch(() => {});
      }
      return currentUser;
    });
  }, []);

  const openCabinet = useCallback(() => {
    setIsCabinetOpen(true);
    if (window.location.pathname !== '/cabinet') {
      window.history.pushState({}, '', '/cabinet');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeCabinet = useCallback(() => {
    setIsCabinetOpen(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isCabinetOpen,
        openCabinet,
        closeCabinet,
        loginWithSteam,
        loginWithSteamId,
        logout,
        updateTradeUrl,
        syncUserWithTradeUrl,
        updateBalance,
        transactions,
        addTransaction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
