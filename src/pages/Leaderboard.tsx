import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Flame, ArrowLeft } from 'lucide-react';

export const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(collection(db, 'leaderboard'), orderBy('streak', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        setLeaders(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Error fetching leaderboard", e);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--wm-bg-dark)] text-white p-6 max-w-2xl mx-auto flex flex-col">
      <header className="flex items-center mb-8 gap-4 border-b border-[var(--wm-border)] pb-4">
        <button onClick={() => navigate(-1)} className="hover:text-[var(--wm-correct)]">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black tracking-widest uppercase">Global Rank</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {leaders.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Loading elite players...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {leaders.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between p-4 bg-[var(--wm-surface)] rounded border border-[var(--wm-border)]">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-black text-xl w-6">#{idx + 1}</span>
                  <span className="font-bold text-lg">{player.displayName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2 text-orange-500 font-black text-xl">
                  <Flame size={20} />
                  {player.streak}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
