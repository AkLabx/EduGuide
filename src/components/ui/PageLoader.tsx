import { motion } from 'motion/react';
import { Logo } from './Logo';

export function PageLoader() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative mb-6"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 rounded-full bg-indigo-500/20 blur-xl dark:bg-indigo-400/20" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-2xl">
            <Logo className="h-14 w-14" />
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          EduGuide
        </h2>

        <div className="mt-8 flex items-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
