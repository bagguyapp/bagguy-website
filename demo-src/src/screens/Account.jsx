import { Bell, Shield, HelpCircle, LogOut, CreditCard, ChevronRight, Coins } from 'lucide-react'

function Row({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="focus:outline-none w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition"
    >
      <div className="h-9 w-9 rounded-xl bg-slate-100 text-brand-navy flex items-center justify-center">
        <Icon size={16} />
      </div>
      <span className="flex-1 text-sm font-semibold text-brand-navy">{label}</span>
      <ChevronRight size={16} className="text-slate-400" />
    </button>
  )
}

export function Account({ appData, loggedIn, goTo }) {
  const user = appData?.user
  const initials = (user?.name || 'S').charAt(0).toUpperCase()

  return (
    <div className="px-5 pt-12 pb-8 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">My profile</p>
        <h1 className="text-3xl font-extrabold text-brand-navy">Account</h1>
      </header>

      {!loggedIn ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-soft border border-slate-100 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-brand-softGreen text-brand-green flex items-center justify-center text-2xl font-extrabold">?</div>
          <p className="text-sm font-semibold text-brand-navy">Sign in to see your account</p>
          <a href="/login.html" className="inline-block rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white">Sign in</a>
        </div>
      ) : (
        <section className="rounded-3xl bg-white p-5 shadow-soft border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-green to-brand-lime text-white flex items-center justify-center text-2xl font-extrabold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-extrabold text-brand-navy truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">Bag Guy member since {user?.joined}</p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl bg-white p-5 shadow-soft border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-brand-navy flex items-center justify-center">
            <CreditCard size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-brand-navy">Payment method</p>
            <p className="text-xs text-slate-500">Add a card to claim cash back</p>
          </div>
          <button className="focus:outline-none rounded-full bg-brand-navy px-3 py-1.5 text-xs font-bold text-white active:scale-95">Add</button>
        </div>
      </section>

      {/* Bag Guy Token link */}
      <section className="relative overflow-hidden rounded-3xl p-5 text-white shadow-soft bg-gradient-to-br from-[#0a0a16] to-[#1a0a2e]">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#9945FF]/30 blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 text-[#14F195] flex items-center justify-center backdrop-blur">
            <Coins size={18} />
          </div>
          <div className="flex-1">
            <p className="inline-block rounded-full bg-[#9945FF]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#9945FF]">Live on Solana</p>
            <p className="mt-1 text-sm font-extrabold">Bag Guy Token (BGT)</p>
            <p className="text-xs opacity-80 mt-0.5">Earn BGT on every grocery scan. Trade on Jupiter.</p>
          </div>
        </div>
        <button
          onClick={() => goTo('crypto')}
          className="focus:outline-none mt-4 w-full rounded-2xl bg-gradient-to-r from-[#9945FF] to-[#14F195] py-2.5 text-black font-bold text-xs tracking-wide active:scale-[0.98]"
        >
          View BGT Token Info →
        </button>
      </section>

      <section className="rounded-3xl bg-white shadow-soft border border-slate-100 divide-y divide-slate-100">
        <Row icon={Bell} label="Notifications" />
        <Row icon={Shield} label="Privacy & security" />
        <Row icon={HelpCircle} label="Help & support" />
      </section>

      {loggedIn && (
        <button
          onClick={() => { localStorage.removeItem('bagguy_token'); window.location.href = '/' }}
          className="focus:outline-none w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-red-500 font-bold border border-red-100 active:scale-[0.98]"
        >
          <LogOut size={16} />Sign out
        </button>
      )}

      <p className="text-center text-xs text-slate-400">Bag Guy v0.2 · One Scan. All the Savings.</p>
    </div>
  )
}
