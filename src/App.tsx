import { AppShell } from './components/layout/AppShell';
import { HomeScreen } from './components/home/HomeScreen';
import { GameSection } from './components/sections/GameSection';
import { ReaderSection } from './components/sections/ReaderSection';
import { useAppState } from './state/AppStateContext';

export default function App() {
  const { activeSection } = useAppState();

  return (
    <AppShell>
      {activeSection === 'home' && <HomeScreen />}
      {activeSection === 'reader' && <ReaderSection />}
      {activeSection === 'game' && <GameSection />}
    </AppShell>
  );
}
