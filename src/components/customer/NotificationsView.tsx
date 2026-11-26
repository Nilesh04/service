import { ArrowLeft, Bell, CheckCheck, Package, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

interface NotificationsViewProps {
  onBack: () => void;
  onSelectNotificationTarget: (notif: AppNotification) => void;
}

export function NotificationsView({
  onBack,
  onSelectNotificationTarget,
}: NotificationsViewProps) {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } =
    useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3 -ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="min-h-[40px] px-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div>
        <h1 className="text-xl font-bold text-navy-900">Notifications</h1>
        <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
          {unreadCount > 0
            ? `${unreadCount} unread service update${unreadCount === 1 ? '' : 's'}`
            : 'All caught up'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {notifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-navy-900">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                markNotificationRead(n.id);
                onSelectNotificationTarget(n);
              }}
              className={`w-full p-4 text-left transition-colors flex items-start gap-3.5 ${
                n.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/45 hover:bg-blue-50'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.targetType === 'spare_part'
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                {n.targetType === 'spare_part' ? (
                  <Package className="w-4 h-4" />
                ) : (
                  <Wrench className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-navy-900 truncate">
                    {n.title}
                  </span>
                  {!n.read && (
                    <span className="text-[11px] font-semibold text-blue-700 shrink-0">
                      Unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                <p className="text-[11px] text-slate-400 tabular-nums">{n.timestamp}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
