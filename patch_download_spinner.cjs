const fs = require('fs');

const path = 'src/pages/DailyHomework.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add downloadingId state
content = content.replace(
  `const [homeworkDates, setHomeworkDates] = useState<Set<string>>(new Set());`,
  `const [homeworkDates, setHomeworkDates] = useState<Set<string>>(new Set());\n  const [downloadingId, setDownloadingId] = useState<string | null>(null);`
);

// Update handleDownload function
const oldHandleDownload = `
  const handleDownload = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = \`\${title}.pdf\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL to release memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file. Please try viewing it instead.');
    }
  };
`;

const newHandleDownload = `
  const handleDownload = async (url: string, title: string, id: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = \`\${title}.pdf\`;
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
`;

content = content.replace(oldHandleDownload.trim(), newHandleDownload.trim());

// Update button render
const oldButton = `<button \n                      onClick={() => handleDownload(item.file_url, item.title)}\n                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-100 dark:border-indigo-800"\n                    >\n                      <Download size={16} /> Download\n                    </button>`;

const newButton = `<button
                      onClick={() => handleDownload(item.file_url, item.title, item.id)}
                      disabled={downloadingId === item.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-100 dark:border-indigo-800 disabled:opacity-70"
                    >
                      {downloadingId === item.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <><Download size={16} /> Download</>
                      )}
                    </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync(path, content);
