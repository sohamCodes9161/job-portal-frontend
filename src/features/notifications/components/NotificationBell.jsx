import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsApi } from "../api/notificationsApi";
import { IconBell, IconInbox } from "@/shared/components/icons";

const POLL_INTERVAL_MS = 30000;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getAll();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // Fail silently — a broken notification fetch shouldn't disrupt the rest of the app
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  const handleItemClick = async (notification) => {
    setOpen(false);

    if (!notification.readAt) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      notificationsApi.markRead(notification._id).catch(() => {});
    }

    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await notificationsApi.markAllRead();
    } catch {
      // If this fails silently, the next poll will resync the real state anyway
    }
  };

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        type="button"
        className="btn btn--ghost btn--icon"
        onClick={handleOpen}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <IconBell />
        {unreadCount > 0 && <span className="notification-bell__badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown" role="menu">
          <div className="notification-dropdown__header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="notification-dropdown__mark-all" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-dropdown__list">
            {notifications.length === 0 ? (
              <div className="notification-dropdown__empty">
                <IconInbox />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  className={`notification-item${!n.readAt ? " notification-item--unread" : ""}`}
                  onClick={() => handleItemClick(n)}
                  role="menuitem"
                >
                  <p className="notification-item__message">{n.message}</p>
                  <span className="notification-item__time">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
