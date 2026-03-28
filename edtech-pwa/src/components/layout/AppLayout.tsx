import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { motion } from 'framer-motion';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mx-auto max-w-md shadow-xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-24 relative z-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
