import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
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
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const navigate = useNavigate();
  const setHasSeenOnboarding = useAppStore(state => state.setHasSeenOnboarding);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b45ff', '#10b981', '#f59e0b'] // Using brand color
      });
      setHasSeenOnboarding(true);
      setTimeout(() => navigate('/home'), 1000);
    } else {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipeConfidenceThreshold = 10000;
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (swipePower < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipePower > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const CurrentIcon = slides[currentSlide].icon;

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 100 : -100,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0
      };
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden touch-none">
      <div className="flex flex-1 flex-col items-center justify-center p-8 relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute flex w-full flex-col items-center text-center px-8 cursor-grab active:cursor-grabbing"
          >
            <div className={`mb-10 flex h-48 w-48 items-center justify-center rounded-full shadow-inner ${slides[currentSlide].color}`}>
              <CurrentIcon size={96} strokeWidth={1.5} />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">{slides[currentSlide].title}</h2>
            <p className="max-w-xs text-lg text-slate-500 leading-relaxed dark:text-slate-400">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-safe-offset-12 z-10 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-950 dark:via-slate-950 pt-12">
        <div className="mb-8 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-indigo-600 dark:bg-indigo-500'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
              animate={{ width: index === currentSlide ? 32 : 8 }}
            />
          ))}
        </div>
        
        <Button 
          size="lg" 
          className="w-full flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-[rgba(67,56,202,1)]"
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
          {currentSlide !== slides.length - 1 && <ChevronRight size={20} />}
        </Button>
      </div>
    </div>
  );
}
