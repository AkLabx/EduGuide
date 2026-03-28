import { motion } from 'motion/react';
import { Bell, CheckCircle2, BookOpen, AlertCircle, Trash2 } from 'lucide-react';
import { useNotifications, AppNotification } from '../contexts/NotificationContext';
import { Button } from '../components/ui/Button';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'test':
        return <CheckCircle2 className="text-rose-500" size={20} />;
      case 'material':
        return <BookOpen className="text-indigo-500" size={20} />;
      case 'announcement':
        return <AlertCircle className="text-amber-500" size={20} />;
    }
  };

  const getBgColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'test':
        return 'bg-rose-100 dark:bg-rose-900/30';
      case 'material':
        return 'bg-indigo-100 dark:bg-indigo-900/30';
      case 'announcement':
        return 'bg-amber-100 dark:bg-amber-900/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <header className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          {notifications.some(n => !n.isRead) && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-indigo-600 dark:text-indigo-400">
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <main className="px-4 pt-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Bell className="text-slate-400 dark:text-slate-500" size={32} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">No notifications yet</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              When you get notifications, they'll show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`relative flex items-start space-x-4 rounded-2xl p-4 transition-colors ${
                  notification.isRead
                    ? 'bg-white dark:bg-slate-900'
                    : 'bg-indigo-50/50 dark:bg-indigo-900/10'
                }`}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
                
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getBgColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className={`text-sm font-semibold ${notification.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${notification.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {notification.message}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
