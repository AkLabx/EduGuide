import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronLeft, Download, FileText, PlayCircle, CheckCircle2, Loader2, FolderOpen, AlertCircle, Plus, Minus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useDownloads } from '../contexts/DownloadsContext';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';
import { getSubjectsForClass } from '../data/ncertChapters';
import { toast } from 'react-hot-toast';

interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  chapter_name: string;
  type: 'pdf' | 'notes' | 'video';
  file_url: string;
  size: string;
  target_class: string;
  target_board: string;
}

const getSubjectColor = (subjectName: string) => {
  const colors = [
    { name: 'Mathematics', color: 'bg-blue-500', iconColor: 'text-blue-500', bgLight: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Science', color: 'bg-emerald-500', iconColor: 'text-emerald-500', bgLight: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { name: 'English', color: 'bg-amber-500', iconColor: 'text-amber-500', bgLight: 'bg-amber-100 dark:bg-amber-900/30' },
    { name: 'Hindi', color: 'bg-rose-500', iconColor: 'text-rose-500', bgLight: 'bg-rose-100 dark:bg-rose-900/30' },
    { name: 'Social Science', color: 'bg-purple-500', iconColor: 'text-purple-500', bgLight: 'bg-purple-100 dark:bg-purple-900/30' },
    { name: 'Sanskrit', color: 'bg-orange-500', iconColor: 'text-orange-500', bgLight: 'bg-orange-100 dark:bg-orange-900/30' }
  ];

  const found = colors.find(c => c.name.toLowerCase() === subjectName.toLowerCase());
  return found || { color: 'bg-indigo-500', iconColor: 'text-indigo-500', bgLight: 'bg-indigo-100 dark:bg-indigo-900/30' };
};

export default function Subjects() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  const { isDownloaded, isDownloading, downloadItem } = useDownloads();
  const { selectedClass, selectedBoard } = useAppStore();
  const { user, profile, setProfile } = useAuthStore();

  useEffect(() => {
    fetchMaterials();
  }, [selectedClass, selectedBoard]);

  const [updatingSubject, setUpdatingSubject] = useState<string | null>(null);

  const toggleSubject = async (e: React.MouseEvent, subjectName: string) => {
    e.stopPropagation(); // Prevent opening the subject
    if (!user || !profile) {
      toast.error('You must be logged in to save subjects.');
      return;
    }

    setUpdatingSubject(subjectName);
    try {
      const currentSubjects = profile.selected_subjects || [];
      const isSelected = currentSubjects.includes(subjectName);

      const newSubjects = isSelected
        ? currentSubjects.filter(s => s !== subjectName)
        : [...currentSubjects, subjectName];

      const { error } = await supabase
        .from('profiles')
        .update({ selected_subjects: newSubjects })
        .eq('id', user.id);

      if (error) throw error;

      // Update local store
      setProfile({ ...profile, selected_subjects: newSubjects });

      toast.success(isSelected ? `Removed ${subjectName} from Dashboard` : `Added ${subjectName} to Dashboard`, {
        icon: isSelected ? '➖' : '✅'
      });
    } catch (error) {
      console.error('Error updating subjects:', error);
      toast.error('Failed to update subjects');
    } finally {
      setUpdatingSubject(null);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      let query = supabase.from('study_materials').select('*');

      // Filter by user's class and board if available
      if (selectedClass) {
        // Just extract the number if "Class 10" format is used
        const classNum = profile?.class_name?.replace(/[^0-9]/g, '') || selectedClass?.replace(/[^0-9]/g, '') || '10';
        if (classNum) {
          query = query.eq('target_class', classNum);
        }
      }

      if (selectedBoard) {
        // If board is specified, get materials for that board OR materials for all boards (null/empty)
        query = query.or(`target_board.eq.${selectedBoard},target_board.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={20} />;
      case 'video': return <PlayCircle size={20} />;
      case 'notes': return <BookOpen size={20} />;
      default: return <FileText size={20} />;
    }
  };

  // Determine subjects to show:
  // 1. Get subjects that actually have materials uploaded
  const subjectsWithMaterials = Array.from(new Set(materials.map(m => m.subject)));

  // 2. Get expected NCERT subjects for the user's class
  const classNum = selectedClass ? selectedClass.replace(/[^0-9]/g, '') : '10'; // Fallback to 10
  const expectedSubjects = getSubjectsForClass(classNum);

  // 3. Combine them, avoiding duplicates
  const allAvailableSubjects = Array.from(new Set([...subjectsWithMaterials, ...expectedSubjects]));

  // Group materials by chapter for the selected subject
  const materialsForSelectedSubject = materials.filter(m => m.subject === selectedSubject);

  const chaptersMap = new Map<string, StudyMaterial[]>();
  materialsForSelectedSubject.forEach(m => {
    if (!chaptersMap.has(m.chapter_name)) {
      chaptersMap.set(m.chapter_name, []);
    }
    chaptersMap.get(m.chapter_name)?.push(m);
  });

  const chapters = Array.from(chaptersMap.keys());

  const handleBack = () => {
    if (selectedChapter) {
      setSelectedChapter(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  };

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center text-indigo-500">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p className="text-sm font-medium">Loading your study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
        <div className="flex items-center">
          {(selectedSubject || selectedChapter) && (
            <button 
              onClick={handleBack}
              className="mr-3 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
            {selectedChapter ? selectedChapter : selectedSubject ? selectedSubject : 'Subjects'}
          </h1>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedSubject ? (
            // VIEW 1: SUBJECTS LIST
            <motion.div
              key="subjects-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-4"
            >
              {allAvailableSubjects.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">No subjects found for your class.</p>
                </div>
              ) : (
                allAvailableSubjects.map((subjectName) => {
                  const style = getSubjectColor(subjectName);
                  const count = materials.filter(m => m.subject === subjectName).length;
                  const isSelected = profile?.selected_subjects?.includes(subjectName);
                  const isUpdating = updatingSubject === subjectName;

                  return (
                    <div
                      key={subjectName}
                      onClick={() => setSelectedSubject(subjectName)}
                      className="flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                    >
                      <div className={`w-3 self-stretch ${style.color}`} />
                      <div className="flex flex-1 items-center justify-between p-5">
                        <div className="flex items-center space-x-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.bgLight} ${style.iconColor}`}>
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{subjectName}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {count} {count === 1 ? 'Material' : 'Materials'} Available
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleSubject(e, subjectName)}
                          disabled={isUpdating}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                            isSelected
                              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                          }`}
                          title={isSelected ? "Remove from Dashboard" : "Add to Dashboard"}
                        >
                          {isUpdating ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : isSelected ? (
                            <Minus size={20} />
                          ) : (
                            <Plus size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          ) : !selectedChapter ? (
            // VIEW 2: CHAPTERS LIST FOR SELECTED SUBJECT
            <motion.div
              key="chapters-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {chapters.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <FolderOpen size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No chapters uploaded yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px] mx-auto">
                    Study materials for {selectedSubject} will appear here once your teacher uploads them.
                  </p>
                </div>
              ) : (
                (() => {
                  // Group chapters by part/unit/chapter number pattern
                  const groupedChapters = new Map<string, string[]>();
                  const ungroupedChapters: string[] = [];

                  chapters.forEach(chapterName => {
                    const match = chapterName.match(/^(Part \d+|Unit \d+|\d+):\s*(.+)$/i);
                    if (match) {
                      const groupName = match[1];
                      if (!groupedChapters.has(groupName)) {
                        groupedChapters.set(groupName, []);
                      }
                      groupedChapters.get(groupName)?.push(chapterName);
                    } else {
                      ungroupedChapters.push(chapterName);
                    }
                  });

                  // If there's no grouping detected, just render the list normally
                  if (groupedChapters.size === 0) {
                    return chapters.map((chapterName) => {
                      const chapterMaterials = chaptersMap.get(chapterName) || [];
                      const pdfCount = chapterMaterials.filter(m => m.type === 'pdf' || m.type === 'notes').length;
                      const videoCount = chapterMaterials.filter(m => m.type === 'video').length;

                      return (
                        <div
                          key={chapterName}
                          onClick={() => setSelectedChapter(chapterName)}
                          className="flex cursor-pointer items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center space-x-4 flex-1 overflow-hidden">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400">
                              <FolderOpen size={24} />
                            </div>
                            <div className="flex-1 overflow-hidden pr-2">
                              <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                                {chapterName}
                              </h3>
                              <div className="mt-1 flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                                {pdfCount > 0 && <span>{pdfCount} Notes/PDFs</span>}
                                {pdfCount > 0 && videoCount > 0 && <span>•</span>}
                                {videoCount > 0 && <span>{videoCount} Videos</span>}
                              </div>
                            </div>
                          </div>
                          <ChevronLeft size={20} className="text-slate-300 dark:text-slate-600 rotate-180 shrink-0" />
                        </div>
                      );
                    });
                  }

                  // Render grouped items
                  const renderChapterItem = (chapterName: string, displayName?: string) => {
                    const chapterMaterials = chaptersMap.get(chapterName) || [];
                    const pdfCount = chapterMaterials.filter(m => m.type === 'pdf' || m.type === 'notes').length;
                    const videoCount = chapterMaterials.filter(m => m.type === 'video').length;

                    return (
                      <div
                        key={chapterName}
                        onClick={() => setSelectedChapter(chapterName)}
                        className="flex cursor-pointer items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center space-x-4 flex-1 overflow-hidden">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <FolderOpen size={24} />
                          </div>
                          <div className="flex-1 overflow-hidden pr-2">
                            <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                              {displayName || chapterName}
                            </h3>
                            <div className="mt-1 flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                              {pdfCount > 0 && <span>{pdfCount} Notes/PDFs</span>}
                              {pdfCount > 0 && videoCount > 0 && <span>•</span>}
                              {videoCount > 0 && <span>{videoCount} Videos</span>}
                            </div>
                          </div>
                        </div>
                        <ChevronLeft size={20} className="text-slate-300 dark:text-slate-600 rotate-180 shrink-0" />
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {Array.from(groupedChapters.entries()).map(([groupName, groupChapters]) => (
                        <div key={groupName} className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-2">{groupName}</h4>
                          <div className="space-y-3">
                            {groupChapters.map(chapterName => {
                              const match = chapterName.match(/^(?:Part \d+|Unit \d+|\d+):\s*(.+)$/i);
                              const displayName = match ? match[1] : chapterName;
                              return renderChapterItem(chapterName, displayName);
                            })}
                          </div>
                        </div>
                      ))}

                      {ungroupedChapters.length > 0 && (
                        <div className="space-y-3 mt-6">
                          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-2">Other Chapters</h4>
                          <div className="space-y-3">
                            {ungroupedChapters.map(chapterName => renderChapterItem(chapterName))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </motion.div>
          ) : (
            // VIEW 3: MATERIALS LIST FOR SELECTED CHAPTER
            <motion.div
              key="materials-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl">
                <BookOpen size={16} />
                <span>{selectedSubject}</span>
              </div>

              {chaptersMap.get(selectedChapter)?.map((material) => {
                const isVideo = material.type === 'video';
                // Only files can be downloaded via DownloadsContext (for now)
                const downloaded = !isVideo && isDownloaded(material.id);
                const downloading = !isVideo && isDownloading(material.id);

                return (
                  <div
                    key={material.id}
                    className="flex items-center space-x-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isVideo
                        ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400'
                        : 'bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {getIcon(material.type)}
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {material.title}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="uppercase">{material.type}</span>
                        {material.size && (
                          <>
                            <span>•</span>
                            <span>{material.size}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isVideo ? (
                      <button
                        onClick={() => handleVideoClick(material.file_url)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-900/50 dark:hover:text-rose-400 transition-colors"
                      >
                        <PlayCircle size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => !downloaded && !downloading && downloadItem({
                          id: material.id,
                          title: material.title,
                          subject: material.subject,
                          type: material.type,
                          size: material.size || 'Unknown',
                          fileUrl: material.file_url // Ensure downloads context can use this
                        })}
                        disabled={downloaded || downloading}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
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
                    )}
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
