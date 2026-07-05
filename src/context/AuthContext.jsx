import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getMe } from '../services/apis/auth.js';
import { getAuthToken } from '../services/api.client.js';

const ACTIVE_ORG_KEY = 'active_org_slug';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOrgSlug, setActiveOrgSlugState] = useState(() =>
    localStorage.getItem(ACTIVE_ORG_KEY)
  );

  const refetch = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  function setActiveOrgSlug(slug) {
    setActiveOrgSlugState(slug);
    if (slug) {
      localStorage.setItem(ACTIVE_ORG_KEY, slug);
    } else {
      localStorage.removeItem(ACTIVE_ORG_KEY);
    }
  }

  const organizations = user?.organizations ?? [];
  const activeOrg =
    organizations.find((membership) => membership.organization.slug === activeOrgSlug)
      ?.organization ?? null;

  const value = {
    user,
    organizations,
    loading,
    refetch,
    activeOrg,
    activeOrgSlug,
    setActiveOrgSlug,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
