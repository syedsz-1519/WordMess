import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { ACHIEVEMENTS } from '../constants/achievements';
import { ParticleCanvas } from '../themes/ParticleCanvas';
import { 
  ArrowLeft, Trophy, Flame, Coins, ShieldAlert,
  Volume2, VolumeX, Shield, Swords, Sparkles, User,
  CheckCircle2, Lock
} from 'lucide-react';

// Dynamic icon resolver helper mapping Lucide names
const iconMap: Record<string, React.ComponentType<any>> = {
  Trophy, Flame, Zap: Sparkles, Swords, ShieldAlert, Crown: Swords,
  Moon: Volume2, ShieldCheck: Shield, CaseSensitive: swords => <span className="font-bold">Aa</span>,
  Award: Trophy, Sparkles, Undo: swords => <span className="font-bold">↩</span>,
  CheckSquare: CheckCircle2, Compass: Shield, RotateCcw: Volume2,
  UserCheck: User, HelpCircle: Shield, Timer: Flame, Share2: Swords,
  Smile: User, BookOpen: Trophy, Map: Swords, Coins, Layers: Trophy,
  Binary: Coins, Send: Swords, RefreshCw: swords => <span className="font-bold">↻</span>,
  Shield, Gem: Sparkles
};

export const Profile = () => {
  const navigate = useNavigate();
  const user = useUserStore();

  const handleToggleHaptic = () => {
    user.toggleHaptic();
  };

  const handleToggleMute = () => {
    const isMuted = user.theme === 'muted';
    user.setTheme(isMuted ? 'dark' : 'muted');
  };

  const setPlan = (plan: 'free' | 'pro' | 'plus') => {
    user.setUser({ plan });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col p-4 sm:p-8">
      <ParticleCanvas modeId="hub" />

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8 z-10">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 text-white transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest text-[var(--wm-correct)]">
          Player Profile
        </h1>
        <div className="w-10 h-10" />
      </header>

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
        {/* Left Side: Stats and Info */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* User Card */}
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--wm-correct)]/20 border-2 border-[var(--wm-correct)] flex items-center justify-center mb-4 text-3xl font-black text-[var(--wm-correct)]">
              {user.displayName ? user.displayName[0].toUpperCase() : 'W'}
            </div>
            <h2 className="text-xl font-bold">{user.displayName || 'Anonymous Player'}</h2>
            <p className="text-xs text-white/50 mb-4">{user.email || 'guest@wordmess.in'}</p>
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              Tier: {user.plan}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[10px] text-white/50 uppercase font-black mb-1">Streak</div>
              <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                <Flame size={20} />
                {user.streak}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/50 uppercase font-black mb-1">Best</div>
              <div className="text-2xl font-black text-sky-400 flex items-center justify-center gap-1">
                <Trophy size={18} />
                {user.bestStreak}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/50 uppercase font-black mb-1">Coins</div>
              <div className="text-2xl font-black text-yellow-300 flex items-center justify-center gap-1">
                <Coins size={18} className="animate-bounce" />
                {user.coins}
              </div>
            </div>
          </div>

          {/* Plan Settings (Demo Switcher) */}
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-xs uppercase font-black text-white/70 mb-4 tracking-widest text-center">Plan Sandbox</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setPlan('free')}
                className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${user.plan === 'free' ? 'bg-white/20 border-white/30 border' : 'bg-transparent hover:bg-white/5 border border-white/5'}`}
              >
                Free
              </button>
              <button 
                onClick={() => setPlan('pro')}
                className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${user.plan === 'pro' ? 'bg-orange-500/20 border-orange-500/50 border text-orange-400' : 'bg-transparent hover:bg-white/5 border border-white/5'}`}
              >
                Pro
              </button>
              <button 
                onClick={() => setPlan('plus')}
                className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${user.plan === 'plus' ? 'bg-sky-500/20 border-sky-500/50 border text-sky-400' : 'bg-transparent hover:bg-white/5 border border-white/5'}`}
              >
                Plus
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Haptic Feedback</span>
              <button 
                onClick={handleToggleHaptic}
                className={`w-12 h-6 rounded-full transition-all relative ${user.isHapticEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${user.isHapticEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Sound Effects</span>
              <button 
                onClick={handleToggleMute}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                {user.theme === 'muted' ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Achievements */}
        <div className="md:col-span-2 bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col h-[70vh]">
          <h3 className="text-sm uppercase font-black text-white/70 tracking-widest mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-300" />
            Achievements ({user.achievements.length} / 30)
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = user.achievements.includes(ach.id);
              const Icon = iconMap[ach.icon] || Trophy;

              return (
                <div 
                  key={ach.id} 
                  className={`p-3 rounded-2xl border transition-all flex gap-3 items-center ${
                    isUnlocked 
                      ? 'bg-slate-800/40 border-emerald-500/30' 
                      : 'bg-slate-950/20 border-white/5 opacity-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isUnlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black uppercase tracking-wider truncate flex items-center gap-1.5">
                      {ach.name}
                      {!isUnlocked && <Lock size={10} className="text-white/30" />}
                    </h4>
                    <p className="text-[10px] text-white/50 truncate">{ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
