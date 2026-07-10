import { createContext, useContext, ReactNode } from "react";
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const fallbackAuthContext: AuthContextType = {
  user: null,
  loading: false,
  isAdmin: false,
  signIn: async () => { throw new Error("Auth not initialized"); },
  signUp: async () => { throw new Error("Auth not initialized"); },
  signOut: async () => { throw new Error("Auth not initialized"); },
  signInWithGoogle: async () => { throw new Error("Auth not initialized"); },
};

const AuthContext = createContext<AuthContextType>(fallbackAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  const currentUser = useQuery(api.users.current);
  const isAdminQuery = useQuery(api.users.currentUserIsAdmin);

  const isAdmin = isAdminQuery ?? false;

  const signIn = async (email: string, password: string) => {
    await convexSignIn("password", { email, password });
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    await convexSignIn("password", { email, password, name: fullName });
  };

  const signInWithGoogle = async () => {
    await convexSignIn("google", { redirectTo: window.location.origin });
  };

  const signOut = async () => {
    await convexSignOut();
  };

  const user: AuthUser | null =
    isAuthenticated && currentUser
      ? {
          id: currentUser._id,
          email: currentUser.profile?.email ?? undefined,
          name: currentUser.profile?.fullName ?? undefined,
          isAdmin: currentUser.isAdmin,
        }
      : null;

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, isAdmin, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
