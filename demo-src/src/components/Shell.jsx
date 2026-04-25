import { Home, Tag, ScanLine, TrendingUp, User } from 'lucide-react'

const NAV = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'deals', label: 'Deals', icon: Tag },
  { key: 'scan', label: 'Scan', icon: ScanLine, primary: true },
  { key: 'savings', label: 'Savings', icon: TrendingUp },
  { key: 'account', label: 'Account', icon: User },
]

export function Shell({ children, current, onChange }) {
  const navKey = current === 'rewards' || current === 'crypto' ? 'account' : current
  return (
    <div className="min-h-screen w-full bg-slate-200/60 flex items-center justify-center md:py-8">
      <div className="relative w-full max-w-[420px] min-h-screen md:min-h-[860px] md:max-h-[860px] bg-brand-bg md:rounded-[40px] md:shadow-2xl md:overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto pb-28">{children}</main>
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 px-2 pt-2 pb-3 md:rounded-b-[40px]" aria-label="Primary">
          <ul className="flex items-end justify-around">
            {NAV.map(item => {
              const Icon = item.icon
              const active = navKey === item.key
              if (item.primary) return (
                <li key={item.key} className="-mt-8">
                  <button
                    onClick={() => onChange(item.key)}
                    className="focus:outline-none h-16 w-16 rounded-full bg-brand-green text-white shadow-lift flex items-center justify-center transition-transform active:scale-95 hover:shadow-xl"
                    aria-label="Scan" aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={28} strokeWidth={2.5} />
                  </button>
                </li>
              )
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onChange(item.key)}
                    className={`focus:outline-none flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${active ? 'text-brand-green' : 'text-slate-400 hover:text-slate-600'}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[10px] font-semibold tracking-wide uppercase">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
