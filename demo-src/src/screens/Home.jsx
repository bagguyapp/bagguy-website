import { Bell, ChevronRight, ScanLine } from 'lucide-react'
import { SavingsCard } from '../components/SavingsCard'
import { MascotBubble } from '../components/MascotBubble'
import { DealCard } from '../components/DealCard'
import { MOCK_DEALS } from '../mockData'

export function Home({ appData, loading, loggedIn, goTo, deals }) {
  const user = appData?.user
  const previewDeals = (deals.length ? deals : MOCK_DEALS).slice(0, 3)

  if (loading) return (
    <div className="px-5 pt-12 pb-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="h-10 w-10 rounded-full border-4 border-brand-green border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-400">Loading your savings…</p>
      </div>
    </div>
  )

  return (
    <div className="px-5 pt-12 pb-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Welcome back</p>
          <h1 className="text-3xl font-extrabold text-brand-navy">
            Hi, {user?.name || 'Saver'}!
          </h1>
        </div>
        <button aria-label="Notifications" className="focus:outline-none relative h-11 w-11 rounded-2xl bg-white shadow-soft text-brand-navy flex items-center justify-center">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-orange" />
        </button>
      </header>

      {!loggedIn && (
        <div className="rounded-2xl bg-brand-navy text-white p-4 text-center space-y-2">
          <p className="text-sm font-semibold">Sign in to see your real savings data</p>
          <a href="/login.html" className="inline-block rounded-full bg-brand-green px-4 py-1.5 text-xs font-bold text-white">
            Sign in
          </a>
        </div>
      )}

      <SavingsCard
        label="Total Savings"
        amount={user?.totalSaved || 0}
        delta={user?.weekSaved ? `+$${user.weekSaved.toFixed(2)} this week` : null}
      />

      <button
        onClick={() => goTo('scan')}
        className="focus:outline-none group relative w-full overflow-hidden rounded-3xl bg-brand-green py-5 px-6 shadow-lift active:scale-[0.98] transition-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="relative flex items-center justify-center gap-3 text-white">
          <ScanLine size={26} strokeWidth={2.5} />
          <span className="text-lg font-extrabold tracking-tight">Scan to Save</span>
        </div>
        <p className="relative mt-1 text-center text-xs font-semibold text-white/80 tracking-wide">One Scan. All the Savings.</p>
      </button>

      <MascotBubble
        message={`I just spotted ${previewDeals.length} deals at your favorite stores!`}
        cta="Let's go shopping"
        onCtaClick={() => goTo('deals')}
      />

      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Bag Guy found deals for you</h2>
            <p className="text-xs text-slate-500">Tap any deal to clip + save</p>
          </div>
          <button onClick={() => goTo('deals')} className="focus:outline-none inline-flex items-center text-xs font-bold text-brand-green">
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {previewDeals.map(d => <DealCard key={d.id} deal={d} />)}
        </div>
      </section>
    </div>
  )
}
