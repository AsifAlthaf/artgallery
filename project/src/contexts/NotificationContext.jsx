import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('artbloom_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, text: "Welcome to ArtBloom Enterprise! Your account is active.", read: false, type: "system", timestamp: new Date().toISOString() }
    ];
  });

  useEffect(() => {
    localStorage.setItem('artbloom_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (text, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now(),
      text,
      read: false,
      type,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
