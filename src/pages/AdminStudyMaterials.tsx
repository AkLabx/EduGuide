import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Video, BookOpen, Loader2, CheckCircle2, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { getSubjectsForClass, getChaptersForSubject } from '../data/ncertChapters';

interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  chapter_name: string;
  type: string;
  file_url: string;
  size: string;
  target_class: string;
  target_board: string;
  created_at: string;
}

export default function AdminStudyMaterials() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    target_class: '',
    subject: '',
    chapter_name: '',
    type: 'pdf', // 'pdf', 'notes', 'video'
    target_board: 'CBSE'
  });

  const availableSubjects = formData.target_class ? getSubjectsForClass(formData.target_class) : [];
  const availableChapters = (formData.target_class && formData.subject)
    ? getChaptersForSubject(formData.target_class, formData.subject)
    : [];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load recent materials');
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Reset subject and chapter if class changes
      if (name === 'target_class') {
        newData.subject = '';
        newData.chapter_name = '';
      }

      // Reset chapter if subject changes
      if (name === 'subject') {
        newData.chapter_name = '';
      }

      return newData;
    });
    setSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Simple validation
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }

      setFile(selectedFile);
      setSuccess(false);

      // Auto-fill title if empty
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: selectedFile.name.replace(/\.[^/.]+$/, "")
        }));
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.type !== 'video' && !file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (formData.type === 'video' && !videoUrl) {
      toast.error('Please enter a video URL');
      return;
    }

    if (!formData.target_class || !formData.subject || !formData.chapter_name) {
      toast.error('Please select class, subject and chapter');
      return;
    }

    setLoading(true);

    try {
      let fileUrl = '';
      let fileSize = '';

      if (formData.type === 'video') {
        fileUrl = videoUrl;
        fileSize = 'Link';
      } else if (file) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${formData.target_class}/${formData.subject}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('study-materials')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('study-materials')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileSize = formatFileSize(file.size);
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('study_materials')
        .insert([{
          title: formData.title,
          subject: formData.subject,
          chapter_name: formData.chapter_name,
          type: formData.type,
          file_url: fileUrl,
          size: fileSize,
          target_class: formData.target_class,
          target_board: formData.target_board
        }]);

      if (dbError) throw dbError;

      toast.success('Study material uploaded successfully!');
      fetchMaterials();
      setSuccess(true);
      setFile(null);
      setVideoUrl('');
      setFormData(prev => ({ ...prev, title: '' })); // Keep class, subject, chapter for quick multiple uploads

      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error uploading material:', error);
      toast.error(error.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string, type: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      // 1. Delete from storage if it's a file
      if (type !== 'video' && fileUrl.includes('supabase.co')) {
        const urlObj = new URL(fileUrl);
        const pathParts = urlObj.pathname.split('/');
        // Extract the path after 'study-materials/'
        const bucketIndex = pathParts.findIndex(p => p === 'study-materials');
        if (bucketIndex !== -1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');

          if (filePath) {
             const { error: storageError } = await supabase.storage
              .from('study-materials')
              .remove([filePath]);

             if (storageError) console.error('Storage deletion error:', storageError);
          }
        }
      }

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success('Material deleted successfully');
      setMaterials(materials.filter(m => m.id !== id));

    } catch (error: any) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900 flex items-center">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mr-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Study Materials</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Upload notes & videos</p>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">

          {success && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={20} />
              <p className="text-sm font-medium">Material uploaded successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Class
                </label>
                <select
                  name="target_class"
                  value={formData.target_class}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
                  required
                >
                  <option value="">Select Class</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(c => (
                    <option key={c} value={c.toString()}>Class {c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Board
                </label>
                <select
                  name="target_board"
                  value={formData.target_board}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
                >
                  <option value="CBSE">CBSE (NCERT)</option>
                  <option value="STATE">State Board</option>
                  <option value="">All Boards</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white disabled:opacity-50"
                required
                disabled={!formData.target_class}
              >
                <option value="">Select Subject</option>
                {availableSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Chapter
              </label>
              <select
                name="chapter_name"
                value={formData.chapter_name}
                onChange={handleInputChange}
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white disabled:opacity-50"
                required
                disabled={!formData.subject}
              >
                <option value="">Select Chapter</option>
                {availableChapters.map((chapter, idx) => (
                  <option key={idx} value={chapter}>Ch {idx + 1}: {chapter}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Material Type
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'pdf', label: 'PDF Book', icon: FileText },
                  { id: 'notes', label: 'Notes', icon: BookOpen },
                  { id: 'video', label: 'Video Link', icon: Video }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, type: type.id }));
                      if (type.id === 'video') setFile(null);
                      else setVideoUrl('');
                    }}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border ${
                      formData.type === type.id
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <type.icon size={20} className="mb-1" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Material Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Important Formulas, Full Lecture"
                className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
                required
              />
            </div>

            {formData.type === 'video' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  YouTube / Video URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-white"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  File Upload
                </label>

                <div className="mt-1 flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                  {file ? (
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <FileText size={32} className="text-indigo-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{formatFileSize(file.size)}</p>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="mt-3 text-xs text-rose-500 hover:text-rose-600 font-medium bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 dark:text-indigo-400"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500 mt-1">
                        PDF or Word up to 50MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                  Upload Material
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Materials</h2>

          {loadingMaterials ? (
            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : materials.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No materials uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {materials.map((mat) => (
                <div key={mat.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="overflow-hidden pr-2 flex-1">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                      Class {mat.target_class} • {mat.subject}
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{mat.chapter_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 uppercase">
                        {mat.type}
                      </span>
                      <p className="text-xs text-slate-500 truncate">{mat.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(mat.id, mat.file_url, mat.type)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
