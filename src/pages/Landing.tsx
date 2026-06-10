import { useNavigate } from 'react-router-dom';
import { PLANS } from '../constants/plans';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--wm-bg-dark)] text-white p-6 flex flex-col items-center">
      <header className="mb-12 text-center mt-10">
        <h1 className="text-5xl font-black tracking-widest mb-4">
          WORDLE <span className="text-[var(--wm-correct)]">MESS</span>
        </h1>
        <p className="text-xl text-gray-400">guess it. mess it. share it.</p>
      </header>

      <section className="max-w-4xl w-full grid md:grid-cols-3 gap-6 mb-12">
        {Object.values(PLANS).map((plan) => (
          <div key={plan.id} className="border border-[var(--wm-border)] rounded-lg p-6 bg-[var(--wm-surface)] flex flex-col">
            <h3 className="text-2xl font-bold mb-2 uppercase">{plan.name}</h3>
            <p className="text-3xl font-black mb-6 text-[var(--wm-correct)]">
              ₹{plan.price}<span className="text-sm text-gray-400 font-normal">/mo</span>
            </p>
            <ul className="flex-1 space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[var(--wm-correct)]">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate(plan.price === 0 ? '/play' : '/checkout')}
              className={`w-full py-3 rounded font-bold uppercase tracking-wider transition-opacity ${
                plan.price > 0 ? 'bg-[var(--wm-correct)] text-[var(--wm-bg-dark)]' : 'border border-[var(--wm-border)] hover:bg-[var(--wm-border)]'
              }`}
            >
              {plan.price === 0 ? 'Play Free' : 'Upgrade'}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};
