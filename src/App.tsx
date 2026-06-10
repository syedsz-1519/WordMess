import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Game } from './pages/Game';
import { Landing } from './pages/Landing';
import { Leaderboard } from './pages/Leaderboard';
import { useSubscription } from './hooks/useSubscription';

const ProtectedRoute = ({ children, isAllowed }: { children: any, isAllowed: boolean }) => {
  if (!isAllowed) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { canUseLeaderboard } = useSubscription();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/play" element={<Game />} />
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute isAllowed={canUseLeaderboard}>
              <Leaderboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
