import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

export type NotificationType = 'test' | 'material' | 'announcement';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  priority?: string;
  isSupabase?: boolean; // flag to identify db announcements
}

export interface NotificationPreferences {
  testReminders: boolean;
  newMaterials: boolean;
  announcements: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  preferences: NotificationPreferences;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: AppNotification[] = [
  {
    id: 'local-1',
    title: 'Welcome to EduGuide!',
    message: 'Explore your subjects and start learning.',
    type: 'announcement',
    createdAt: new Date().toISOString(),
    isRead: false,
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedBoard, selectedClass } = useAppStore();

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('eduguide_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('eduguide_notification_prefs');
    return saved ? JSON.parse(saved) : {
      testReminders: true,
      newMaterials: true,
      announcements: true,
    };
  });

  // Load announcements from Supabase
  useEffect(() => {
    if (!selectedBoard || !selectedClass) return;

    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Filter based on user's class and board
          const relevantAnnouncements = data.filter(a => {
            const classMatch = !a.target_class || a.target_class === selectedClass;
            const boardMatch = !a.target_board || a.target_board === selectedBoard;
            return classMatch && boardMatch;
          });

          setNotifications(prev => {
            // Keep local non-announcement notifications and already read db notifications (by id)
            const readDbIds = new Set(prev.filter(n => n.isSupabase && n.isRead).map(n => n.id));
            const newDbNotifications: AppNotification[] = relevantAnnouncements.map(a => ({
              id: a.id,
              title: a.title,
              message: a.message,
              type: 'announcement',
              createdAt: a.created_at,
              isRead: readDbIds.has(a.id),
              priority: a.priority,
              isSupabase: true
            }));

            // Keep only local notifications that are not DB announcements
            const localOnly = prev.filter(n => !n.isSupabase);

            // Merge and sort
            const merged = [...localOnly, ...newDbNotifications].sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            return merged;
          });
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };

    fetchAnnouncements();

    // Subscribe to real-time changes
    const channel = supabase.channel('public:announcements')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, (payload) => {
        const a = payload.new;
        if (a.is_active) {
          const classMatch = !a.target_class || a.target_class === selectedClass;
          const boardMatch = !a.target_board || a.target_board === selectedBoard;

          if (classMatch && boardMatch) {
            const newNotification: AppNotification = {
              id: a.id,
              title: a.title,
              message: a.message,
              type: 'announcement',
              createdAt: a.created_at,
              isRead: false,
              priority: a.priority,
              isSupabase: true
            };

            setNotifications(prev => {
              if (prev.some(n => n.id === a.id)) return prev;
              return [newNotification, ...prev].sort((x, y) =>
                new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()
              );
            });

            // Show toast
            toast(`New Announcement: ${a.title}`, {
              icon: '🔔',
              duration: 5000,
            });
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedBoard, selectedClass]);

  // Persist local state
  useEffect(() => {
    localStorage.setItem('eduguide_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('eduguide_notification_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Filter notifications based on preferences
  const filteredNotifications = notifications.filter(n => {
    if (n.type === 'test' && !preferences.testReminders) return false;
    if (n.type === 'material' && !preferences.newMaterials) return false;
    if (n.type === 'announcement' && !preferences.announcements) return false;
    return true;
  });

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    // We only delete from local state, not from the DB (admin does that)
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  return (
    <NotificationContext.Provider value={{
      notifications: filteredNotifications,
      preferences,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      updatePreferences
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
