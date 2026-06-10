import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Hub } from './pages/Hub';
import { GameLayout } from './pages/GameLayout';
import { ClassicGame } from './games/classic/ClassicGame';
import { DoubleGame } from './games/double/DoubleGame';
import { SpeedGame } from './games/speed/SpeedGame';
import { QuadGame } from './games/quad/QuadGame';
import { ReverseGame } from './games/reverse/ReverseGame';
import { NumberGame } from './games/number/NumberGame';
import { DuelGame } from './games/duel/DuelGame';
import { AIGame } from './games/ai/AIGame';
import { SplashScreen } from './assets/logos/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        
        <Route path="/game" element={<GameLayout />}>
          <Route path="classic" element={<ClassicGame />} />
          <Route path="double" element={<DoubleGame />} />
          <Route path="speed" element={<SpeedGame />} />
          <Route path="quad" element={<QuadGame />} />
          <Route path="reverse" element={<ReverseGame />} />
          <Route path="number" element={<NumberGame />} />
          <Route path="duel" element={<DuelGame />} />
          <Route path="ai" element={<AIGame />} />
          <Route path="*" element={<Navigate to="/game/classic" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
