import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, GraduationCap, BookOpenCheck, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import confetti from 'canvas-confetti';

const slides = [
  {
    title: "Welcome to EduGuide",
    description: "The most comprehensive learning platform for CBSE and State Board students.",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
  },
  {
    title: "Structured Curriculum",
    description: "Access chapter-wise notes, solutions, and practice papers from Class 1 to 12.",
    icon: BookOpenCheck,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
  },
  {
    title: "Achieve Excellence",
    description: "Track your progress and score higher in your board examinations.",
    icon: Trophy,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const setHasSeenOnboarding = useAppStore(state => state.setHasSeenOnboarding);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
      setHasSeenOnboarding(true);
      setTimeout(() => navigate('/home'), 1000);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className={`mb-8 flex h-40 w-40 items-center justify-center rounded-full ${slides[currentSlide].color}`}>
              <CurrentIcon size={80} strokeWidth={1.5} />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">{slides[currentSlide].title}</h2>
            <p className="max-w-xs text-lg text-slate-500 leading-relaxed dark:text-slate-400">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12">
        <div className="mb-8 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-indigo-600 dark:bg-indigo-500' 
                  : 'w-2 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
        
        <Button 
          size="lg" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
