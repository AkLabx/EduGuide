import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockQuizzes, Quiz, QuizQuestion } from '../data/quizData';
import { Button } from '../components/ui/Button';

type QuizState = 'idle' | 'active' | 'results';

export default function Tests() {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState === 'active' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (quizState === 'active' && timeRemaining === 0) {
      handleFinishQuiz();
    }
    return () => clearInterval(timer);
  }, [quizState, timeRemaining]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(quiz.timeLimit);
    setQuizState('active');
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (activeQuiz && currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setQuizState('results');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7c22ff', '#a273ff', '#FCD34D', '#10b981', '#f43f5e']
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  // Render Idle State (List of Quizzes)
  if (quizState === 'idle') {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
        <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Mock Tests</h1>
        </header>
        <main className="px-4 pt-6">
          <div className="space-y-4">
            {mockQuizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startQuiz(quiz)}
                className="cursor-pointer rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {quiz.subject}
                  </span>
                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <Clock size={16} className="mr-1" />
                    <span className="text-xs">{formatTime(quiz.timeLimit)}</span>
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">{quiz.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{quiz.questions.length} Questions</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Render Active Quiz State
  if (quizState === 'active' && activeQuiz) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setQuizState('idle')}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center font-mono font-medium text-indigo-600 dark:text-indigo-400">
              <Clock size={18} className="mr-2" />
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="mt-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
          </div>
        </header>

        <main className="flex-1 px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="mb-8 text-xl font-bold text-slate-900 dark:text-white">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-100'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500' 
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        <div className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <Button 
            className="w-full py-6 text-lg"
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
          >
            {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    );
  }

  // Render Results State
  if (quizState === 'results' && activeQuiz) {
    const score = calculateScore();
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);

    return (
      <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
        <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Quiz Results</h1>
        </header>

        <main className="px-4 pt-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <div className="text-center">
                <span className="block text-4xl font-black text-indigo-600 dark:text-indigo-400">{score}</span>
                <span className="text-sm font-medium text-indigo-500 dark:text-indigo-300">out of {activeQuiz.questions.length}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {percentage >= 80 ? 'Excellent Work!' : percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">You scored {percentage}% on {activeQuiz.title}</p>
          </div>

          <div className="mb-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Review Answers</h3>
            {activeQuiz.questions.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{index + 1}. {q.question}</h4>
                    {isCorrect ? (
                      <CheckCircle2 className="shrink-0 text-emerald-500" size={24} />
                    ) : (
                      <XCircle className="shrink-0 text-rose-500" size={24} />
                    )}
                  </div>
                  
                  <div className="mb-4 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let bgClass = 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400';
                      let borderClass = 'border border-transparent';
                      
                      if (optIdx === q.correctAnswer) {
                        bgClass = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300';
                        borderClass = 'border border-emerald-200 dark:border-emerald-800';
                      } else if (optIdx === userAnswer && !isCorrect) {
                        bgClass = 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300';
                        borderClass = 'border border-rose-200 dark:border-rose-800';
                      }

                      return (
                        <div key={optIdx} className={`rounded-xl px-4 py-3 text-sm font-medium ${bgClass} ${borderClass}`}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                      <span className="font-bold">Explanation:</span> {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button 
            className="w-full py-6 text-lg"
            onClick={() => setQuizState('idle')}
            variant="outline"
          >
            <RotateCcw className="mr-2" size={20} />
            Back to Tests
          </Button>
        </main>
      </div>
    );
  }

  return null;
}
