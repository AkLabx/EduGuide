import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  board?: string | null;
  class_name?: string | null;
  selected_subjects?: string[];
  [key: string]: any;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setProfile: (profile: UserProfile | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true, // start loading
  setSession: (session) => set({ session, user: session?.user ?? null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setProfile: (profile) => set({ profile }),
  signOut: () => set({ session: null, user: null, profile: null }),
}));
