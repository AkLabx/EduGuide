import { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  subMonths,
  addMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, FileText, Download, Eye, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';

interface HomeworkItem {
  id: string;
  date: string;
  title: string;
  subject: string;
  file_url: string;
  created_at: string;
  target_class?: string | null;
  target_board?: string | null;
}

export default function DailyHomework() {
  const { selectedClass, selectedBoard } = useAppStore();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [homeworkDates, setHomeworkDates] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHomework();
  }, [currentMonth, selectedClass, selectedBoard]);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);


      let query = supabase
        .from('homework')
        .select('*')
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'));

      // In Supabase, we can use an OR clause for the class and board logic
      // target_class is null OR target_class = selectedClass
      if (selectedClass) {
        query = query.or(`target_class.is.null,target_class.eq.${selectedClass}`);
      } else {
        query = query.is('target_class', null);
      }

      if (selectedBoard) {
        query = query.or(`target_board.is.null,target_board.eq.${selectedBoard}`);
      } else {
        query = query.is('target_board', null);
      }

      const { data, error } = await query.order('date', { ascending: false });


      if (error) throw error;

      if (data) {
        setHomework(data);
        const dates = new Set(data.map(item => item.date));
        setHomeworkDates(dates);
      }
    } catch (error: any) {
      console.error('Error fetching homework:', error);
      toast.error('Failed to load homework');
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day: Date) => setSelectedDate(day);


  const handleDownload = async (url: string, title: string, id: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL to release memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file. Please try viewing it instead.');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-semibold text-xs text-slate-500 py-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dateString = format(day, 'yyyy-MM-dd');
        const isSelected = isSameDay(day, selectedDate);
        const hasHomework = homeworkDates.has(dateString);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            className={`relative flex items-center justify-center h-10 w-10 mx-auto cursor-pointer rounded-full transition-all duration-200
              ${!isCurrentMonth ? "text-slate-300 dark:text-slate-600" : ""}
              ${isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50" :
                isCurrentMonth ? "hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200" : ""}
            `}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="z-10">{formattedDate}</span>
            {hasHomework && !isSelected && isCurrentMonth && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            )}
            {hasHomework && isSelected && (
               <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white"></span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-y-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const selectedHomework = homework.filter(h => h.date === selectedDateString);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900 flex items-center">
        <button
          onClick={() => navigate('/homework')}
          className="mr-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daily Homework</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View assignments by date</p>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-6">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
            Assignments for {format(selectedDate, 'MMM do, yyyy')}
            {loading && <Loader2 size={16} className="ml-2 animate-spin text-indigo-500" />}
          </h3>

          <AnimatePresence mode="popLayout">
            {!loading && selectedHomework.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="text-slate-400" size={24} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No homework for this date</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Take a break or review past material!</p>
              </motion.div>
            )}

            {!loading && selectedHomework.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm mb-3 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wider">{item.subject}</p>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white truncate">{item.title}</h4>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.target_class && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                        Class {item.target_class}
                      </span>
                    )}
                    {item.target_board && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {item.target_board}
                      </span>
                    )}
                  </div>


                  <div className="flex gap-2 mt-3">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye size={16} /> View
                    </a>
                    <button
                      onClick={() => handleDownload(item.file_url, item.title, item.id)}
                      disabled={downloadingId === item.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-100 dark:border-indigo-800 disabled:opacity-70"
                    >
                      {downloadingId === item.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <><Download size={16} /> Download</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
