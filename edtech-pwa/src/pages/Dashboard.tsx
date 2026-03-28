import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useProgressStore } from '../store/progressStore';
import { boards } from '../data/boards';
import { Card } from '../components/ui/Card';
import { BookOpen, Trophy, FileText, Video, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { profile } = useUserStore();
  const { getSubjectProgress } = useProgressStore();
  const navigate = useNavigate();

  if (!profile) return null;

  const boardId = profile.board.toLowerCase();
  const classData = boards[boardId]?.classes[profile.className];
  const subjects = classData?.subjects || [];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen pb-32">
      {/* Header section with welcome and profile */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <p className="text-gray-500 font-medium text-sm">Welcome back,</p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
          <p className="text-primary-600 font-semibold text-sm mt-1">{profile.board} • Class {profile.className}</p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-100 to-indigo-50 border-2 border-primary-100 flex items-center justify-center text-primary-600 shadow-sm">
          <Trophy size={28} />
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 bg-gradient-to-br from-indigo-50 to-white hover:-translate-y-1 transition-transform cursor-pointer border-indigo-100/50">
          <div className="p-3 bg-indigo-100/50 rounded-2xl text-indigo-600">
            <FileText size={24} />
          </div>
          <span className="font-semibold text-gray-800 text-sm">Notes & PDFs</span>
        </Card>
        <Card className="p-5 flex flex-col items-center justify-center text-center gap-3 bg-gradient-to-br from-emerald-50 to-white hover:-translate-y-1 transition-transform cursor-pointer border-emerald-100/50">
          <div className="p-3 bg-emerald-100/50 rounded-2xl text-emerald-600">
            <Video size={24} />
          </div>
          <span className="font-semibold text-gray-800 text-sm">Video Lessons</span>
        </Card>
      </motion.div>

      {/* Subjects Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Your Subjects</h2>
          <span className="text-sm font-semibold text-primary-600 cursor-pointer hover:underline">View All</span>
        </div>

        <div className="grid gap-4">
          {subjects.map((subject) => {
            const progress = getSubjectProgress(subject.id, subject.chapters.length);

            return (
              <Card
                key={subject.id}
                className="p-5 flex flex-col gap-4 border-gray-100 hover:border-primary-200 transition-colors"
                onClick={() => navigate(`/syllabus/${subject.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${subject.color} flex items-center justify-center text-white shadow-lg shadow-${subject.color.split('-')[1]}-500/30`}>
                    <BookOpen size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{subject.name}</h3>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                      <BookOpen size={14} className="text-gray-400" />
                      {subject.chapters.length} Chapters
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-2xl font-black text-primary-600 tracking-tighter">{progress}%</span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-primary-500 h-2.5 rounded-full"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity or Tips Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-600/20 relative overflow-hidden"
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Award size={28} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Keep it up!</h3>
            <p className="text-primary-100 text-sm font-medium leading-relaxed">
              You are making great progress. Review your Mathematics notes before the next chapter.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-8 -mb-8" />
      </motion.div>
    </div>
  );
}
