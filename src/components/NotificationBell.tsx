"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Bell, Package, Clock, CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Prottek 30 seconds e refresh koro
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Bahire click korle dropdown bondho hobe
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      // Local state update koro
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("deliver")) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (title.toLowerCase().includes("transit")) return <Package className="w-5 h-5 text-blue-500" />;
    return <Clock className="w-5 h-5 text-orange-500" />;
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell className="w-10 h-10 text-gray-300 mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => {
                    if (!n.is_read) handleMarkAsRead(n.id);
                  }}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 ${!n.is_read ? "bg-blue-50/30" : ""}`}
                >
                  <div className="shrink-0 mt-1">
                    {getIcon(n.title)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm ${!n.is_read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                        {n.title}
                      </p>
                      {!n.is_read && <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5"></span>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">{n.message}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
            <button 
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/notifications"); // Jodi alada page banate chao
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}