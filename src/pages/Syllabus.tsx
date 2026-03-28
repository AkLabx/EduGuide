import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, FileText, Video } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useProgressStore } from '../store/progressStore';
import { boards } from '../data/boards';
import { Card } from '../components/ui/Card';

export function Syllabus() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const { completedChapters, toggleChapterProgress, getSubjectProgress } = useProgressStore();

  if (!profile || !subjectId) return null;

  const boardId = profile.board.toLowerCase();
  const classData = boards[boardId]?.classes[profile.className];
  const subject = classData?.subjects.find((s) => s.id === subjectId);

  if (!subject) return <div className="p-8 text-center text-gray-500 font-medium">Subject not found</div>;

  const progress = getSubjectProgress(subject.id, subject.chapters.length);

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* Header */}
      <div className={`bg-gradient-to-br ${subject.color} p-8 pb-12 rounded-b-[2.5rem] shadow-xl text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 p-2.5 bg-white/20 hover:bg-white/30 rounded-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <ArrowLeft size={24} className="text-white drop-shadow-md" />
          </button>

          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">{subject.name}</h1>
              <p className="opacity-90 mt-2 font-medium text-lg text-white/90 drop-shadow-sm">{subject.chapters.length} Chapters • Class {profile.className}</p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black drop-shadow-lg tracking-tighter">{progress}%</span>
            </div>
          </div>

          <div className="mt-8 bg-white/20 rounded-full h-3 backdrop-blur-sm overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full rounded-full drop-shadow-md shadow-[0_0_15px_rgba(255,255,255,0.6)]"
            />
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="px-5 -mt-6 relative z-20 space-y-4">
        {subject.chapters.map((chapter, index) => {
          const isCompleted = completedChapters[subject.id]?.includes(chapter.id);

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-5 transition-all duration-300 border-2 ${isCompleted ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100 hover:border-primary-100'} group`}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleChapterProgress(subject.id, chapter.id)}
                    className={`mt-1 flex-shrink-0 transition-all active:scale-90 p-1 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-500 shadow-inner' : 'text-gray-300 hover:text-primary-400 hover:bg-primary-50'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={32} className="fill-emerald-500 text-white" />
                    ) : (
                      <Circle size={32} strokeWidth={2.5} />
                    )}
                  </button>

                  <div className="flex-1">
                    <h3 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-800'}`}>
                      {index + 1}. {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed font-medium">{chapter.description}</p>

                    {/* Resources */}
                    <div className="flex gap-3 mt-4">
                      {chapter.resources?.pdf && (
                        <a href={chapter.resources.pdf} className="flex items-center gap-1.5 text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl hover:bg-primary-100 transition-colors">
                          <FileText size={14} /> PDF Notes
                        </a>
                      )}
                      {chapter.resources?.video && (
                        <a href={chapter.resources.video} className="flex items-center gap-1.5 text-xs font-bold text-coral-600 bg-coral-50 px-3 py-1.5 rounded-xl hover:bg-coral-100 transition-colors">
                          <Video size={14} /> Lesson
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
