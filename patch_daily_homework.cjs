const fs = require('fs');

const path = 'src/pages/DailyHomework.tsx';
let content = fs.readFileSync(path, 'utf8');

const downloadFunction = `
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

// Insert the download function before renderHeader
content = content.replace('  const renderHeader = () => {', downloadFunction + '\n  const renderHeader = () => {');

// Replace the download <a> tag with a <button> that calls handleDownload
const oldDownloadLink = `<a \n                      href={item.file_url}\n                      download\n                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-100 dark:border-indigo-800"\n                    >\n                      <Download size={16} /> Download\n                    </a>`;
const newDownloadButton = `<button \n                      onClick={() => handleDownload(item.file_url, item.title)}\n                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-100 dark:border-indigo-800"\n                    >\n                      <Download size={16} /> Download\n                    </button>`;

content = content.replace(oldDownloadLink, newDownloadButton);

fs.writeFileSync(path, content);
