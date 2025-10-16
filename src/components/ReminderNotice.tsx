import { useProgressStore } from '../store/progressStore';

const frequencyCopy: Record<string, string> = {
  daily: 'Daily reminders enabled',
  weekly: 'Weekly reminder configured',
  weekdays: 'Weekday reminders enabled',
  off: 'Reminders off',
};

const ReminderNotice = () => {
  const notifications = useProgressStore((state) => state.notifications);

  if (!notifications.remindersEnabled) {
    return null;
  }

  return (
    <div className="notification-banner" role="status">
      <strong>{frequencyCopy[notifications.reminderFrequency] ?? 'Reminders enabled'}</strong>
      <span>
        You will be reminded at {notifications.reminderTime}. Keep your streak going!
        {notifications.pushOptIn ? ' Push notifications are enabled.' : ''}
      </span>
    </div>
  );
};

export default ReminderNotice;
