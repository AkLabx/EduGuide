import { motion } from "motion/react";
import { Spinner } from "./Spinner";

export function PageLoader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-ping rounded-full bg-indigo-100 opacity-75 dark:bg-indigo-900/50"></div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl dark:bg-slate-900">
          <Spinner size={32} />
        </div>
      </div>
      <p className="mt-6 text-sm font-medium text-slate-500 animate-pulse dark:text-slate-400">Loading amazing content...</p>
    </motion.div>
  );
}
