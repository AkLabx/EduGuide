import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminHomework() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    subject: '',
    title: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a PDF file to upload');
      return;
    }

    if (!formData.subject || !formData.title || !formData.date) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `homework/${formData.date}/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('homework_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('homework_files')
        .getPublicUrl(filePath);

      // 3. Save to database
      const { error: dbError } = await supabase
        .from('homework')
        .insert([{
          date: formData.date,
          subject: formData.subject,
          title: formData.title,
          file_url: publicUrl
        }]);

      if (dbError) throw dbError;

      toast.success('Homework uploaded successfully!');
      setSuccess(true);
      setFile(null);
      setFormData(prev => ({ ...prev, title: '' })); // Reset title, keep date/subject for quicker subsequent uploads

      // Reset file input UI
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error uploading homework:', error);
      toast.error(error.message || 'Failed to upload homework');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900 flex items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="mr-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin: Upload HW</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add daily assignments</p>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">

          {success && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={20} />
              <p className="text-sm font-medium">Homework added to calendar successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Assignment Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
                required
              >
                <option value="">Select a subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Hindi">Hindi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Algebra Worksheet Ch-3"
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                PDF File
              </label>
              <div className="mt-1 flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-500 mt-1">
                    {file ? file.name : "PDF up to 10MB"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Homework
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
