import { useState } from 'react';
import AchievementBadges from './components/AchievementBadges';
import ChaptersOverview from './components/ChaptersOverview';
import ProgressDashboard from './components/ProgressDashboard';
import QuizTracker from './components/QuizTracker';
import ReminderNotice from './components/ReminderNotice';
import SettingsModal from './components/SettingsModal';
import StreakCounter from './components/StreakCounter';
import XPProgress from './components/XPProgress';
import './App.css';
import { useProgressStore } from './store/progressStore';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const notificationsEnabled = useProgressStore((state) => state.notifications.remindersEnabled);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Learning Progression Tracker</h1>
          <p className="helper-text">Track your growth, unlock achievements, and stay motivated.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setSettingsOpen(true)}>
          Settings &amp; Reminders
        </button>
      </header>

      {notificationsEnabled ? <ReminderNotice /> : null}

      <div className="layout-grid two-column">
        <section className="card">
          <ProgressDashboard />
          <XPProgress />
          <StreakCounter />
        </section>

        <section className="card">
          <AchievementBadges />
        </section>
      </div>

      <div className="layout-grid" style={{ marginTop: '1.5rem' }}>
        <section className="card">
          <ChaptersOverview />
        </section>

        <section className="card">
          <QuizTracker />
        </section>
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;
