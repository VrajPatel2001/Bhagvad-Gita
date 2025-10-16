import { useMemo, useState } from 'react'
import './App.css'
import GameScreen from './components/GameScreen'
import LobbyScreen from './components/LobbyScreen'
import ResultsScreen from './components/ResultsScreen'
import type { GameMode } from './engine/gameEngine'
import type { GameResult } from './types/session'
import { getModeMeta } from './data/modes'

type ScreenState = 'lobby' | 'game' | 'results'

interface SessionConfig {
  mode: GameMode
  questionCount: number
}

function App() {
  const [screen, setScreen] = useState<ScreenState>('lobby')
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const [lastResult, setLastResult] = useState<GameResult | null>(null)
  const [gameInstance, setGameInstance] = useState(0)

  const activeModeMeta = useMemo(
    () => (sessionConfig ? getModeMeta(sessionConfig.mode) : null),
    [sessionConfig],
  )

  const startGame = (config: SessionConfig) => {
    setSessionConfig(config)
    setLastResult(null)
    setGameInstance((prev) => prev + 1)
    setScreen('game')
  }

  const handleComplete = (result: GameResult) => {
    setLastResult(result)
    setScreen('results')
  }

  const handleReplay = () => {
    if (!sessionConfig) return
    setLastResult(null)
    setGameInstance((prev) => prev + 1)
    setScreen('game')
  }

  const goToLobby = () => {
    setScreen('lobby')
    setSessionConfig(null)
  }

  return (
    <div className="app-shell">
      <div className="app-background" aria-hidden />
      <div className="app-content">
        {screen === 'lobby' && <LobbyScreen onStart={startGame} />}
        {screen === 'game' && sessionConfig && (
          <GameScreen key={gameInstance} config={sessionConfig} onComplete={handleComplete} onExit={goToLobby} />
        )}
        {screen === 'results' && lastResult && (
          <ResultsScreen result={lastResult} onReplay={handleReplay} onReturnToLobby={goToLobby} />
        )}
      </div>
      {activeModeMeta && screen === 'game' && (
        <div className="mode-watermark" style={{ borderColor: activeModeMeta.accent }}>
          {activeModeMeta.title}
        </div>
      )}
    </div>
  )
}

export default App
