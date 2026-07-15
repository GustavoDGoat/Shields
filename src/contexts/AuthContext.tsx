import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from "react";
import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const CACHE_KEY = "cybershield_session";

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  authReady: boolean;
  signIn: (email?: string, password?: string) => Promise<void>;
  signUp: (email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const fallbackAuthContext: AuthContextType = {
  user: null,
  loading: true,
  isAdmin: false,
  authReady: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
};

const AuthContext = createContext<AuthContextType>(fallbackAuthContext);

const getCached = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !d.id) return null;
    return { id: d.id, email: d.email || undefined, name: d.name || undefined, isAdmin: !!d.isAdmin };
  } catch {
    return null;
  }
};

const setCached = (u: AuthUser) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(u)); } catch {}
};

const clearCached = () => {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: workosUser, isLoading, signIn: workosSignIn, signUp: workosSignUp, signOut: workosSignOut } = useWorkOSAuth();
  const createProfile = useMutation(api.users.createProfile);
  const dbIsAdmin = useQuery(api.users.isAdmin, workosUser?.id ? { userId: workosUser.id } : "skip");

  const cachedRef = useRef<AuthUser | null>(null);
  const [cachedUser, setCachedUser] = useState<AuthUser | null>(() => {
    const c = getCached();
    cachedRef.current = c;
    return c;
  });
  const [hydrating, setHydrating] = useState(true);
  const initialLoadDone = useRef(false);
  if (!isLoading) initialLoadDone.current = true;

  useEffect(() => {
    if (workosUser?.id) {
      createProfile({
        userId: workosUser.id,
        fullName: `${workosUser.firstName ?? ""} ${workosUser.lastName ?? ""}`.trim() || undefined,
        email: workosUser.email ?? undefined,
      }).catch((err) => {
        console.error("Failed to create/update user profile:", err);
      });
    }
  }, [workosUser?.id]);

  useEffect(() => {
    if (!isLoading) {
      setHydrating(false);
      if (!workosUser) {
        clearCached();
        setCachedUser(null);
        cachedRef.current = null;
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (workosUser) {
      const u: AuthUser = {
        id: workosUser.id,
        email: workosUser.email ?? undefined,
        name: `${workosUser.firstName ?? ""} ${workosUser.lastName ?? ""}`.trim() || undefined,
        isAdmin: dbIsAdmin ?? false,
      };
      cachedRef.current = u;
      setCached(u);
      setCachedUser(u);
    }
  }, [workosUser?.id]);

  useEffect(() => {
    if (workosUser?.id && dbIsAdmin !== undefined) {
      const updated: AuthUser = {
        id: workosUser.id,
        email: workosUser.email ?? undefined,
        name: `${workosUser.firstName ?? ""} ${workosUser.lastName ?? ""}`.trim() || undefined,
        isAdmin: dbIsAdmin,
      };
      cachedRef.current = updated;
      setCached(updated);
      setCachedUser(updated);
    }
  }, [dbIsAdmin, workosUser?.id]);

  const user: AuthUser | null = workosUser
    ? {
        id: workosUser.id,
        email: workosUser.email ?? undefined,
        name: `${workosUser.firstName ?? ""} ${workosUser.lastName ?? ""}`.trim() || undefined,
        isAdmin: dbIsAdmin ?? (cachedRef.current?.isAdmin ?? false),
      }
    : hydrating
      ? cachedUser
      : null;

  const loading = isLoading || (hydrating && !workosUser);

  const signIn = useCallback(async () => { await workosSignIn({}); }, [workosSignIn]);
  const signUp = useCallback(async () => { await workosSignUp({}); }, [workosSignUp]);
  const signOut = useCallback(async () => {
    clearCached();
    setCachedUser(null);
    cachedRef.current = null;
    await workosSignOut({});
  }, [workosSignOut]);
  const signInWithGoogle = useCallback(async () => { await workosSignIn({}); }, [workosSignIn]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: (user?.isAdmin) ?? false,
      authReady: initialLoadDone.current,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
