import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookMarked, GraduationCap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const boards = [
  { id: 'CBSE', name: 'CBSE Board', icon: BookMarked, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
  { id: 'STATE', name: 'State Board', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' }
] as const;

const classes = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

export default function Home() {
  const navigate = useNavigate();
  const { selectedBoard, selectedClass, setSelectedBoard, setSelectedClass } = useAppStore();
  
  const [step, setStep] = useState(selectedBoard ? 2 : 1);

  const handleBoardSelect = (boardId: 'CBSE' | 'STATE') => {
    setSelectedBoard(boardId);
    setStep(2);
  };

  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If the user already has a board and class saved in Supabase, sync it
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('board, class_name')
          .eq('id', session.user.id)
          .single();

        if (data && data.board && data.class_name && !selectedBoard && !selectedClass) {
           setSelectedBoard(data.board as 'CBSE' | 'STATE');
           setSelectedClass(data.class_name);
           navigate('/dashboard');
        }
      }
    };
    fetchProfile();
  }, [session, selectedBoard, selectedClass, navigate, setSelectedBoard, setSelectedClass]);

  const handleClassSelect = async (cls: string) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to save your selection.');
      navigate('/auth');
      return;
    }

    setLoading(true);
    setSelectedClass(cls);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ board: selectedBoard, class_name: cls, updated_at: new Date().toISOString() })
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success(`Class ${cls} ${selectedBoard} selected!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save selection. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-md">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {step === 1 ? 'Select Board' : 'Select Class'}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {step === 1 
              ? 'Choose your educational board to continue.' 
              : `You selected ${selectedBoard}. Now choose your class.`}
          </p>
        </header>

        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4"
          >
            {boards.map((board) => {
              const Icon = board.icon;
              return (
                <Card 
                  key={board.id}
                  className={`cursor-pointer border-2 transition-all hover:border-indigo-600 dark:bg-slate-900 dark:hover:border-indigo-500 ${
                    selectedBoard === board.id 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-900/20' 
                      : 'border-transparent dark:border-slate-800'
                  }`}
                  onClick={() => handleBoardSelect(board.id)}
                >
                  <CardContent className="flex items-center p-6">
                    <div className={`mr-4 rounded-xl p-3 ${board.bg} ${board.color}`}>
                      <Icon size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{board.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Comprehensive study material</p>
                    </div>
                    <ChevronRight className="text-slate-400 dark:text-slate-500" />
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <Button 
              variant="ghost" 
              className="mb-6 self-start text-slate-500 dark:text-slate-400"
              onClick={() => setStep(1)}
            >
              â Back to Boards
            </Button>
            
            <div className="grid grid-cols-3 gap-4">
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => handleClassSelect(cls)}
                  disabled={loading}
                  className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 text-xl font-bold transition-all hover:scale-105 active:scale-95 ${
                    selectedClass === cls 
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:border-indigo-500 dark:bg-indigo-500 dark:shadow-none' 
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
                  }`}
                >
                  <span className="text-sm font-medium opacity-70">Class</span>
                  {cls}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
