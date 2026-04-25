import { TrendingUp } from 'lucide-react'

export function SavingsCard({ label, amount, delta, variant = 'green' }) {
  const fmt = (n) => (n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
  const navy = variant === 'navy'
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 shadow-soft ${navy ? 'bg-brand-navy text-white' : 'bg-gradient-to-br from-brand-green to-brand-lime text-white'}`}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-2 text-5xl font-extrabold tracking-tight">{fmt(amount)}</p>
      {delta && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
          <TrendingUp size={14} />{delta}
        </div>
      )}
    </div>
  )
}
