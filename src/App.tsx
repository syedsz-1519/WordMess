import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Hub } from './pages/Hub';
import { GameLayout } from './pages/GameLayout';
import { ClassicGame } from './games/classic/ClassicGame';
import { DoubleGame } from './games/double/DoubleGame';
import { SpeedGame } from './games/speed/SpeedGame';
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
          {/* We will add the other 5 games here as we build them */}
          {/* For now, redirect any unimplemented game back to classic or hub */}
          <Route path="*" element={<Navigate to="/game/classic" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
