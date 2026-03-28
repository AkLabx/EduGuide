import React, { createContext, useContext, useState, useEffect } from 'react';

export type MaterialType = 'pdf' | 'video' | 'notes';

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: MaterialType;
  size: string;
  downloadedAt?: string;
}

interface DownloadsContextType {
  downloadedItems: StudyMaterial[];
  isDownloaded: (id: string) => boolean;
  downloadItem: (item: StudyMaterial) => Promise<void>;
  removeItem: (id: string) => void;
  isDownloading: (id: string) => boolean;
}

const DownloadsContext = createContext<DownloadsContextType | undefined>(undefined);

export const DownloadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloadedItems, setDownloadedItems] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('eduguide_downloads');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem('eduguide_downloads', JSON.stringify(downloadedItems));
  }, [downloadedItems]);

  const isDownloaded = (id: string) => {
    return downloadedItems.some(item => item.id === id);
  };

  const isDownloading = (id: string) => {
    return downloadingIds.has(id);
  };

  const downloadItem = async (item: StudyMaterial) => {
    if (isDownloaded(item.id)) return;
    
    setDownloadingIds(prev => new Set(prev).add(item.id));
    
    // Simulate network download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDownloadedItems(prev => [
      ...prev, 
      { ...item, downloadedAt: new Date().toISOString() }
    ]);
    
    setDownloadingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(item.id);
      return newSet;
    });
  };

  const removeItem = (id: string) => {
    setDownloadedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <DownloadsContext.Provider value={{
      downloadedItems,
      isDownloaded,
      downloadItem,
      removeItem,
      isDownloading
    }}>
      {children}
    </DownloadsContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadsContext);
  if (context === undefined) {
    throw new Error('useDownloads must be used within a DownloadsProvider');
  }
  return context;
};
