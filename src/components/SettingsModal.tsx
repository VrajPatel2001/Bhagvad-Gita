import { useEffect, useState } from 'react';
import type { NotificationPreferences, ReminderFrequency } from '../types/progress';
import { useProgressStore } from '../store/progressStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const reminderOptions: Array<{ label: string; value: ReminderFrequency }> = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Off', value: 'off' },
];

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const updateNotifications = useProgressStore((state) => state.updateNotifications);
  const storedPreferences = useProgressStore((state) => state.notifications);

  const [formState, setFormState] = useState<NotificationPreferences>(storedPreferences);

  useEffect(() => {
    if (isOpen) {
      setFormState(storedPreferences);
    }
  }, [isOpen, storedPreferences]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const remindersEnabled = formState.reminderFrequency === 'off' ? false : formState.remindersEnabled;

    updateNotifications({
      reminderFrequency: formState.reminderFrequency,
      remindersEnabled,
      reminderTime: formState.reminderTime,
      pushOptIn: formState.pushOptIn,
    });

    onClose();
  };

  const handleReset = () => {
    const confirmed = window.confirm('This will clear your progress, streak, and achievements. Continue?');
    if (!confirmed) {
      return;
    }

    resetProgress();
    onClose();
  };

  return (
    <div className="settings-backdrop" role="dialog" aria-modal="true">
      <div className="settings-modal">
        <div className="section-title">
          <h2>Settings</h2>
          <button className="secondary-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="settings-section">
          <h3>Notifications</h3>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={formState.remindersEnabled}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  remindersEnabled: event.target.checked,
                  reminderFrequency: event.target.checked ? (prev.reminderFrequency === 'off' ? 'daily' : prev.reminderFrequency) : 'off',
                }))
              }
            />
            Enable reminder notifications
          </label>
          <div>
            <span className="small-label">Reminder cadence</span>
            <div className="inline-actions">
              {reminderOptions.map((option) => (
                <label key={option.value} className="radio-row">
                  <input
                    type="radio"
                    name="reminder-frequency"
                    value={option.value}
                    checked={formState.reminderFrequency === option.value}
                    onChange={() =>
                      setFormState((prev) => ({
                        ...prev,
                        reminderFrequency: option.value,
                        remindersEnabled: option.value === 'off' ? false : true,
                      }))
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="small-label" htmlFor="reminder-time">
              Reminder time
            </label>
            <input
              id="reminder-time"
              type="time"
              value={formState.reminderTime}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  reminderTime: event.target.value,
                }))
              }
              className="select-field"
            />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={formState.pushOptIn}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  pushOptIn: event.target.checked,
                }))
              }
            />
            Enable push notifications (experimental)
          </label>
        </div>

        <div className="settings-section">
          <h3>Reset Progression</h3>
          <p className="helper-text">
            Resetting will clear chapters, quiz history, XP, and streak progress. Achievements will need to be earned again.
          </p>
          <button className="danger-button" type="button" onClick={handleReset}>
            Reset Progress
          </button>
        </div>

        <div className="settings-actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
