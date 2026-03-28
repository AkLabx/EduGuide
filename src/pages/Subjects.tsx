import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronLeft, Download, FileText, PlayCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useDownloads, StudyMaterial } from '../contexts/DownloadsContext';
import { Button } from '../components/ui/Button';

const subjects = [
  { id: 'maths', name: 'Mathematics', color: 'bg-blue-500', iconColor: 'text-blue-500', bgLight: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'science', name: 'Science', color: 'bg-emerald-500', iconColor: 'text-emerald-500', bgLight: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'english', name: 'English', color: 'bg-amber-500', iconColor: 'text-amber-500', bgLight: 'bg-amber-100 dark:bg-amber-900/30' },
];

const mockMaterials: Record<string, StudyMaterial[]> = {
  maths: [
    { id: 'm1', title: 'Chapter 1: Real Numbers', subject: 'Mathematics', type: 'notes', size: '1.2 MB' },
    { id: 'm2', title: 'Polynomials - Full Lecture', subject: 'Mathematics', type: 'video', size: '45.5 MB' },
    { id: 'm3', title: 'Quadratic Equations Formula Sheet', subject: 'Mathematics', type: 'pdf', size: '0.5 MB' },
  ],
  science: [
    { id: 's1', title: 'Chemical Reactions Notes', subject: 'Science', type: 'notes', size: '2.1 MB' },
    { id: 's2', title: 'Acids, Bases and Salts', subject: 'Science', type: 'pdf', size: '3.4 MB' },
    { id: 's3', title: 'Life Processes Animation', subject: 'Science', type: 'video', size: '28.0 MB' },
  ],
  english: [
    { id: 'e1', title: 'A Letter to God - Summary', subject: 'English', type: 'notes', size: '0.8 MB' },
    { id: 'e2', title: 'Nelson Mandela - Long Walk to Freedom', subject: 'English', type: 'pdf', size: '1.5 MB' },
  ]
};

export default function Subjects() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const { isDownloaded, isDownloading, downloadItem } = useDownloads();

  const getIcon = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'pdf': return <FileText size={20} />;
      case 'video': return <PlayCircle size={20} />;
      case 'notes': return <BookOpen size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
        <div className="flex items-center">
          {selectedSubject && (
            <button 
              onClick={() => setSelectedSubject(null)}
              className="mr-3 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : 'Subjects'}
          </h1>
        </div>
      </header>

      <main className="px-4 pt-6">
        <AnimatePresence mode="wait">
          {!selectedSubject ? (
            <motion.div
              key="subjects-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-4"
            >
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className="flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900"
                >
                  <div className={`w-3 self-stretch ${subject.color}`} />
                  <div className="flex flex-1 items-center justify-between p-5">
                    <div className="flex items-center space-x-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${subject.bgLight} ${subject.iconColor}`}>
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{subject.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {mockMaterials[subject.id]?.length || 0} Materials
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="materials-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {mockMaterials[selectedSubject]?.map((material) => {
                const downloaded = isDownloaded(material.id);
                const downloading = isDownloading(material.id);

                return (
                  <div
                    key={material.id}
                    className="flex items-center space-x-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {getIcon(material.type)}
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {material.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="uppercase">{material.type}</span>
                        <span>•</span>
                        <span>{material.size}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => !downloaded && !downloading && downloadItem(material)}
                      disabled={downloaded || downloading}
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        downloaded 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : downloading
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400'
                      }`}
                    >
                      {downloaded ? (
                        <CheckCircle2 size={20} />
                      ) : downloading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Download size={20} />
                      )}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
