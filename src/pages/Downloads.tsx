import { motion } from 'motion/react';
import { Download, FileText, PlayCircle, BookOpen, Trash2, HardDrive } from 'lucide-react';
import { useDownloads, StudyMaterial } from '../contexts/DownloadsContext';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Downloads() {
  const { downloadedItems, removeItem } = useDownloads();

  const getIcon = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-rose-500" size={20} />;
      case 'video':
        return <PlayCircle className="text-emerald-500" size={20} />;
      case 'notes':
        return <BookOpen className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'pdf':
        return 'bg-rose-100 dark:bg-rose-900/30';
      case 'video':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'notes':
        return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const handleOpen = (item: StudyMaterial) => {
    toast.success(`Opening ${item.title} offline`);
  };

  const calculateTotalSize = () => {
    // Simple mock calculation based on string sizes like "2.4 MB"
    let totalMB = 0;
    downloadedItems.forEach(item => {
      const sizeStr = item.size.replace(/[^0-9.]/g, '');
      totalMB += parseFloat(sizeStr) || 0;
    });
    return `${totalMB.toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Offline Downloads</h1>
        </div>
      </header>

      <main className="px-4 pt-6">
        {downloadedItems.length > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <HardDrive size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Storage Used</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{calculateTotalSize()} / 500 MB</p>
              </div>
            </div>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div 
                className="h-full bg-indigo-600 dark:bg-indigo-500" 
                style={{ width: `${Math.min((parseFloat(calculateTotalSize()) / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {downloadedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Download className="text-slate-400 dark:text-slate-500" size={32} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">No downloads yet</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Download study materials to access them without an internet connection.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloadedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900"
                onClick={() => handleOpen(item)}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getBgColor(item.type)}`}>
                  {getIcon(item.type)}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                      {item.subject}
                    </span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                    toast.success('Removed from downloads');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
