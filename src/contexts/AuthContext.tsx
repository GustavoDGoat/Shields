import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-react";
import { useMutation, useQuery } from "convex/react";
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
  signIn: (email?: string, password?: string) => Promise<void>;
  signUp: (email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const fallbackAuthContext: AuthContextType = {
  user: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
};

const AuthContext = createContext<AuthContextType>(fallbackAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: workosUser, isLoading, signIn: workosSignIn, signUp: workosSignUp, signOut: workosSignOut } = useWorkOSAuth();
  const createProfile = useMutation(api.users.createProfile);
  const isAdmin = useQuery(api.users.isAdmin, workosUser?.id ? { userId: workosUser.id } : "skip");

  useEffect(() => {
    if (workosUser?.id) {
      createProfile({
        userId: workosUser.id,
        fullName: `${workosUser.firstName ?? ""} ${workosUser.lastName ?? ""}`.trim() || undefined,
        email: workosUser.email ?? undefined,
      });
    }
  }, [workosUser?.id]);

  const signIn = async () => {
    await workosSignIn({});
  };

  const signUp = async () => {
    await workosSignUp({});
  };

  const signInWithGoogle = async () => {
    await workosSignIn({});
  };

  const user: AuthUser | null = workosUser
    ? {
        id: workosUser.id,
        email: workosUser.email ?? undefined,
        name: `${workosUser.firstName ?? ""} ${workosUser.lastName ?? ""}`.trim() || undefined,
        isAdmin: isAdmin ?? false,
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, isAdmin: isAdmin ?? false, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
