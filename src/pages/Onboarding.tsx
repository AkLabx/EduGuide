import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { Button } from '../components/ui/Button';
import { ChevronRight, ArrowLeft, BookOpen, User, Trophy, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = [
  {
    title: 'Welcome to EdTech Guide',
    description: 'Your personalized learning companion. Track syllabus, access study materials, and prepare for exams easily.',
    icon: Compass,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    title: 'Track Your Progress',
    description: 'Stay on top of your subjects with our interactive syllabus tracker. Check off chapters as you learn.',
    icon: Trophy,
    color: 'text-accent-500',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Access Study Materials',
    description: 'Get instant access to curated lesson plans, worksheets, and objective question banks.',
    icon: BookOpen,
    color: 'text-coral-500',
    bg: 'bg-rose-50',
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUserStore();
  const [step, setStep] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [className, setClassName] = useState('10');

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      if (!name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      completeOnboarding({ name, board, className, avatar: 'default', hasCompletedOnboarding: true });
      navigate('/dashboard');
      toast.success('Welcome to EdTech Guide!');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white overflow-hidden relative">
      <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
        <AnimatePresence mode="wait">
          {step < steps.length ? (
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className={`w-32 h-32 rounded-full ${steps[step].bg} flex items-center justify-center mb-6`}>
                {
                  (() => {
                    const Icon = steps[step].icon;
                    return <Icon size={64} className={steps[step].color} />;
                  })()
                }
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{steps[step].title}</h2>
                <p className="text-lg text-gray-500 leading-relaxed px-4">{steps[step].description}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-8 w-full"
            >
              <div className="space-y-2 text-center mb-4">
                <div className="w-24 h-24 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User size={48} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Let's Get Started</h2>
                <p className="text-gray-500 text-lg">Tell us a bit about yourself to personalize your experience.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-14 px-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Select Board</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['CBSE', 'State Board'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBoard(b)}
                        className={`h-14 rounded-2xl border-2 text-base font-medium transition-all ${
                          board === b
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Select Class</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all text-lg appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-8 pb-12 pt-6 bg-white relative z-20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            {[...Array(steps.length + 1)].map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-primary-600' : 'w-2.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
          {step > 0 && (
            <button onClick={handleBack} className="p-3 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full">
              <ArrowLeft size={24} />
            </button>
          )}
        </div>
        <Button size="lg" className="w-full text-lg shadow-lg shadow-primary-500/30" onClick={handleNext}>
          {step === steps.length ? 'Start Journey' : 'Continue'}
          <ChevronRight className="ml-2" size={24} />
        </Button>
      </div>
    </div>
  );
}
