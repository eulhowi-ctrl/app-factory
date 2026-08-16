import { useEffect, useState } from 'react'
import { initAds } from './ads'
import { HomeScreen } from './components/HomeScreen'
import { PuzzleScreen } from './components/PuzzleScreen'
import type { Difficulty, PuzzleImage } from './engine/config'

type Screen = { name: 'home' } | { name: 'puzzle'; image: PuzzleImage; difficulty: Difficulty }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  useEffect(() => {
    // 안드로이드(WebView)에서만 실제로 광고를 초기화한다. 웹에선 no-op.
    void initAds()
  }, [])

  if (screen.name === 'puzzle') {
    return (
      <PuzzleScreen
        image={screen.image}
        difficulty={screen.difficulty}
        onExit={() => setScreen({ name: 'home' })}
      />
    )
  }

  return (
    <HomeScreen onStart={(image, difficulty) => setScreen({ name: 'puzzle', image, difficulty })} />
  )
}

export default App
