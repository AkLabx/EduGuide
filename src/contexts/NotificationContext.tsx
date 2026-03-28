import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationType = 'test' | 'material' | 'announcement';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
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
    id: '1',
    title: 'Upcoming Mock Test',
    message: 'Your Physics mock test is scheduled for tomorrow at 10:00 AM.',
    type: 'test',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
  },
  {
    id: '2',
    title: 'New Study Material',
    message: 'Chapter 4: Thermodynamics notes have been uploaded.',
    type: 'material',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: false,
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'The app will be down for maintenance on Sunday from 2 AM to 4 AM.',
    type: 'announcement',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
