import { Trophy, Coins, Share2 } from 'lucide-react'
import { MOCK_STORE_SAVINGS, MOCK_TIERS } from '../mockData'

const TIERS = MOCK_TIERS

export function Savings({ appData, loading, goTo }) {
  const user = appData?.user
  const storeSavings = appData?.storeSavings || MOCK_STORE_SAVINGS
  const total = storeSavings.reduce((s, r) => s + r.saved, 0)
  const maxSaved = Math.max(...storeSavings.map(r => r.saved), 1)
  const bagPoints = user?.bagPoints || 0
  const weekSaved = user?.weekSaved || 0

  if (loading) return (
    <div className="px-5 pt-12 pb-8 flex items-center justify-center min-h-[60vh]">
      <div className="h-10 w-10 rounded-full border-4 border-brand-green border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="px-5 pt-12 pb-8 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">This week</p>
        <h1 className="text-3xl font-extrabold text-brand-navy">Savings Recap</h1>
      </header>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green via-brand-lime to-brand-orange p-6 text-white shadow-lift animate-pop">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
            <Trophy size={12} />Personal best
          </div>
          <p className="mt-4 text-sm font-semibold opacity-90">You saved</p>
          <p className="text-6xl font-black tracking-tight">${total.toFixed(2)}</p>
          <p className="mt-1 text-sm font-semibold opacity-90">
            {appData?.isDemo ? 'this week (demo data)' : weekSaved > 0 ? `$${weekSaved.toFixed(2)} just this week!` : 'total lifetime'}
          </p>
        </div>
      </div>

      {/* Store breakdown */}
      <section className="rounded-3xl bg-white p-5 shadow-soft border border-slate-100">
        <h2 className="text-sm font-bold text-brand-navy mb-4">Where you saved</h2>
        {storeSavings.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Scan receipts to see your store breakdown.</p>
        ) : (
          <div className="space-y-4">
            {storeSavings.map(r => {
              const pct = (r.saved / maxSaved) * 100
              return (
                <div key={r.store}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold text-white shrink-0" style={{ backgroundColor: r.color }}>{r.initials}</div>
                    <p className="flex-1 text-sm font-semibold text-brand-navy">{r.store}</p>
                    <p className="text-sm font-extrabold text-brand-green">${r.saved.toFixed(2)}</p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden ml-11">
                    <div className="h-full rounded-full bg-brand-green transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Bag Points */}
      <section className="rounded-3xl bg-brand-navy p-5 text-white shadow-soft">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center">
            <Coins size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Bag Points earned</p>
            <p className="text-2xl font-extrabold">+{bagPoints.toLocaleString()} pts</p>
          </div>
        </div>
        <p className="mt-3 text-xs opacity-70">Cash these in for free perks, exclusive coupons, and bigger bags.</p>
      </section>

      <button
        onClick={() => goTo('rewards')}
        className="focus:outline-none w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-brand-navy font-bold border border-slate-200 active:scale-[0.98]"
      >
        <Share2 size={16} />View my Bag Points
      </button>
    </div>
  )
}
