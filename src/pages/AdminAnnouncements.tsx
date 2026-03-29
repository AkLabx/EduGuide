import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Bell, Loader2, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminAnnouncements() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [targetBoard, setTargetBoard] = useState('');
  const [priority, setPriority] = useState('low');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title,
          message,
          target_class: targetClass || null,
          target_board: targetBoard || null,
          priority,
          is_active: true
        }]);

      if (error) throw error;

      toast.success('Announcement broadcasted!');
      setShowForm(false);
      setTitle('');
      setMessage('');
      setTargetClass('');
      setTargetBoard('');
      setPriority('low');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Announcement deleted');
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="sticky top-0 z-10 bg-indigo-600 px-4 py-4 text-white shadow-md dark:bg-indigo-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Announcements</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            {showForm ? <span>Cancel</span> : <><Plus size={16} /><span>New</span></>}
          </button>
        </div>
      </header>

      <main className="px-4 pt-6">
        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Bell size={20} className="text-amber-500" />
              <span>Create Announcement</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
                  placeholder="E.g., Tomorrow is a holiday"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
                  placeholder="Enter details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Target Class</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
                  >
                    <option value="">All Classes</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Target Board</label>
                  <select
                    value={targetBoard}
                    onChange={(e) => setTargetBoard(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
                  >
                    <option value="">All Boards</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
                >
                  <option value="low">Low (Info)</option>
                  <option value="medium">Medium (Warning)</option>
                  <option value="high">High (Alert)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Bell size={20} />
                    <span>Broadcast</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Recent Announcements</h2>
          {fetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative">
                   <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                       <div className={`w-2 h-2 rounded-full ${item.priority === 'high' ? 'bg-rose-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                       <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    </div>
                    <button
                      onClick={() => deleteAnnouncement(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.message}</p>
                   <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-500">
                     <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}</span>
                     {(item.target_class || item.target_board) && (
                       <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-md">
                         Target: {item.target_class ? `Class ${item.target_class}` : 'All Classes'} • {item.target_board || 'All Boards'}
                       </span>
                     )}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
