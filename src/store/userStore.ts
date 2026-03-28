import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  avatar: string;
  board: string;
  className: string;
  hasCompletedOnboarding: boolean;
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : (updates as UserProfile),
        })),
      completeOnboarding: (profile) =>
        set({
          profile: { ...profile, hasCompletedOnboarding: true },
        }),
      resetProfile: () => set({ profile: null }),
    }),
    {
      name: 'edtech-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
