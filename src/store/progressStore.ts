import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProgressState {
  completedChapters: Record<string, string[]>; // { subjectId: [chapterId1, chapterId2] }
  toggleChapterProgress: (subjectId: string, chapterId: string) => void;
  getSubjectProgress: (subjectId: string, totalChapters: number) => number; // Returns percentage
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedChapters: {},
      toggleChapterProgress: (subjectId, chapterId) => {
        set((state) => {
          const subjectProgress = state.completedChapters[subjectId] || [];
          const isCompleted = subjectProgress.includes(chapterId);

          let updatedProgress;
          if (isCompleted) {
            updatedProgress = subjectProgress.filter((id) => id !== chapterId);
          } else {
            updatedProgress = [...subjectProgress, chapterId];
          }

          return {
            completedChapters: {
              ...state.completedChapters,
              [subjectId]: updatedProgress,
            },
          };
        });
      },
      getSubjectProgress: (subjectId, totalChapters) => {
        if (totalChapters === 0) return 0;
        const completedCount = get().completedChapters[subjectId]?.length || 0;
        return Math.round((completedCount / totalChapters) * 100);
      },
    }),
    {
      name: 'edtech-progress-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
