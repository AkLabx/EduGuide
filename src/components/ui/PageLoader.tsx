import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 bg-primary-600 rounded-2xl mb-8"
      />
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-primary-900 font-bold text-xl tracking-tight"
      >
        EdTech Guide
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mt-2 text-sm"
      >
        Preparing your learning space...
      </motion.p>
    </div>
  );
}
