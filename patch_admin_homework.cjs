const fs = require('fs');

const path = 'src/pages/AdminHomework.tsx';
let content = fs.readFileSync(path, 'utf8');

const imports = `import React, { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router-dom';\nimport { supabase } from '../lib/supabase';\nimport { ArrowLeft, Upload, FileText, Loader2, CheckCircle2, Trash2 } from 'lucide-react';\nimport { format } from 'date-fns';\nimport toast from 'react-hot-toast';\n`;

content = content.replace(/import React, { useState } from 'react';[\s\S]*?import toast from 'react-hot-toast';/, imports);

const interfaceDef = `\ninterface HomeworkItem {\n  id: string;\n  date: string;\n  title: string;\n  subject: string;\n  file_url: string;\n}\n\n`;
content = content.replace('export default function AdminHomework() {', interfaceDef + 'export default function AdminHomework() {');

const stateVars = `
  const [recentHomework, setRecentHomework] = useState<HomeworkItem[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    fetchRecentHomework();
  }, []);

  const fetchRecentHomework = async () => {
    setLoadingRecent(true);
    try {
      const { data, error } = await supabase
        .from('homework')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setRecentHomework(data);
    } catch (error) {
      console.error('Error fetching recent homework:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this homework?')) return;

    try {
      // Extract file path from URL
      // https://.../storage/v1/object/public/homework_files/homework/2023-10-27/file.pdf
      const urlObj = new URL(fileUrl);
      const pathParts = urlObj.pathname.split('/homework_files/');

      if (pathParts.length > 1) {
        const filePath = decodeURIComponent(pathParts[1]);

        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('homework_files')
          .remove([filePath]);

        if (storageError) console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('homework')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success('Homework deleted successfully');
      setRecentHomework(prev => prev.filter(hw => hw.id !== id));
    } catch (error: any) {
      console.error('Error deleting homework:', error);
      toast.error('Failed to delete homework');
    }
  };
`;

content = content.replace('const [file, setFile] = useState<File | null>(null);', 'const [file, setFile] = useState<File | null>(null);\n' + stateVars);

content = content.replace('toast.success(\'Homework uploaded successfully!\');', `toast.success('Homework uploaded successfully!');\n      fetchRecentHomework();`);

const recentList = `
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Uploads</h2>

          {loadingRecent ? (
            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : recentHomework.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No homework uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentHomework.map((hw) => (
                <div key={hw.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="overflow-hidden pr-2">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate">{hw.subject} • {hw.date}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{hw.title}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(hw.id, hw.file_url)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
`;

content = content.replace('</main>', `  </div>\n${recentList}\n      </main>`);

// Fix the unclosed div from previous replacement
content = content.replace('</form>\n        </div>\n  </div>', '</form>\n        </div>');


fs.writeFileSync(path, content);
