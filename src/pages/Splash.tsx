import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from '@/components/ui/Logo';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function Splash() {
  const navigate = useNavigate();
  const { hasSeenOnboarding, selectedBoard, selectedClass } = useAppStore();
  const { session, isLoading } = useAuthStore();

  useEffect(() => {
    // We only want to transition away if auth has finished loading
    if (isLoading) return;

    // Minimum display time for the splash screen (e.g. 1.5s) to avoid ungraceful flashing
    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        navigate('/onboarding', { replace: true });
      } else if (!session) {
        navigate('/auth', { replace: true });
      } else if (!selectedBoard || !selectedClass) {
        navigate('/home', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, hasSeenOnboarding, selectedBoard, selectedClass, session, isLoading]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-indigo-600 text-white dark:bg-slate-950 overflow-hidden relative">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(139,69,255,0.15)_0%,transparent_100%)]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          type: 'spring',
          bounce: 0.4
        }}
        className="flex flex-col items-center z-10"
      >
        <motion.div
          className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white text-indigo-600 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] dark:bg-slate-900"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Logo className="h-16 w-16 drop-shadow-sm" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-5xl font-extrabold tracking-tight drop-shadow-sm"
        >
          EduGuide
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 text-lg font-medium text-indigo-100 dark:text-indigo-300"
        >
          Your Ultimate Study Companion
        </motion.p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-safe-offset-12 z-10 pb-12"
      >
        <div className="flex space-x-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] dark:bg-indigo-400 dark:shadow-[0_0_8px_rgba(139,69,255,0.5)]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
