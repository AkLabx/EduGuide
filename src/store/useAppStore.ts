import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  hasSeenOnboarding: boolean;
  selectedBoard: 'CBSE' | 'STATE' | null;
  selectedClass: string | null;
  theme: Theme;
  streak: number;
  lastActiveDate: string | null;
  setHasSeenOnboarding: (value: boolean) => void;
  setSelectedBoard: (board: 'CBSE' | 'STATE' | null) => void;
  setSelectedClass: (cls: string | null) => void;
  setTheme: (theme: Theme) => void;
  updateStreak: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasSeenOnboarding: false,
      selectedBoard: null,
      selectedClass: null,
      theme: 'system',
      streak: 0,
      lastActiveDate: null,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setSelectedBoard: (board) => set({ selectedBoard: board }),
      setSelectedClass: (cls) => set({ selectedClass: cls }),
      setTheme: (theme) => set({ theme }),
      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, streak } = get();
        
        if (lastActiveDate === today) return; // Already updated today
        
        if (!lastActiveDate) {
          set({ streak: 1, lastActiveDate: today });
          return;
        }

        const lastDate = new Date(lastActiveDate);
        const currentDate = new Date(today);
        const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          set({ streak: streak + 1, lastActiveDate: today });
        } else if (diffDays > 1) {
          // Streak broken
          set({ streak: 1, lastActiveDate: today });
        }
      },
      reset: () => set({ selectedBoard: null, selectedClass: null }),
    }),
    {
      name: 'eduguide-storage',
    }
  )
);
