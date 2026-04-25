import { Award, Lock } from 'lucide-react'
import { MOCK_TIERS } from '../mockData'

const TIERS = MOCK_TIERS

export function Rewards({ appData }) {
  const bagPoints = appData?.user?.bagPoints || 0
  const currentTier = [...TIERS].reverse().find(t => bagPoints >= t.minPoints) || TIERS[0]
  const nextTier = TIERS.find(t => t.minPoints > bagPoints)
  const progress = nextTier
    ? ((bagPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <div className="px-5 pt-12 pb-8 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Bag Guy Rewards</p>
        <h1 className="text-3xl font-extrabold text-brand-navy">My Bag Points</h1>
      </header>

      <div className="relative overflow-hidden rounded-3xl bg-brand-navy p-6 text-white shadow-soft">
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand-orange/30 blur-2xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Available balance</p>
          <p className="mt-2 text-6xl font-black tracking-tight">{bagPoints.toLocaleString()}</p>
          <p className="text-sm font-semibold opacity-80">Bag Points</p>
          {nextTier && (
            <div className="mt-5">
              <div className="flex justify-between text-xs font-semibold opacity-90 mb-1.5">
                <span>{currentTier.name}</span>
                <span>{(nextTier.minPoints - bagPoints).toLocaleString()} pts to {nextTier.name}</span>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-green to-brand-lime transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-brand-navy">Your bag tiers</h2>
        {TIERS.map(tier => {
          const unlocked = bagPoints >= tier.minPoints
          const isCurrent = tier.name === currentTier.name
          return (
            <div key={tier.name} className={`relative rounded-2xl p-4 transition-all ${isCurrent ? 'bg-white shadow-lift ring-2 ring-brand-green' : unlocked ? 'bg-white shadow-soft' : 'bg-slate-100/60'}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: unlocked ? `${tier.color}20` : '#E2E8F0', color: unlocked ? tier.color : '#94A3B8' }}>
                  {unlocked ? <Award size={22} strokeWidth={2.5} /> : <Lock size={18} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${unlocked ? 'text-brand-navy' : 'text-slate-400'}`}>{tier.name}</p>
                    {isCurrent && <span className="rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Current</span>}
                  </div>
                  <p className={`text-xs ${unlocked ? 'text-slate-500' : 'text-slate-400'}`}>{tier.perks}</p>
                </div>
                <p className={`text-xs font-bold ${unlocked ? 'text-slate-500' : 'text-slate-400'}`}>{tier.minPoints.toLocaleString()} pts</p>
              </div>
            </div>
          )
        })}
      </section>

      <p className="text-xs text-slate-500 text-center px-4">
        Earn 10 Bag Points per $1 saved. Cash in your points for free perks, exclusive deals, and bigger bag tiers.
      </p>
    </div>
  )
}
