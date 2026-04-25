import { useState } from 'react'
import { Check, Scissors } from 'lucide-react'

export function DealCard({ deal, onClip }) {
  const [clipped, setClipped] = useState(deal.applied)
  const label = deal.type === 'percent' ? `${deal.discount}% OFF` : `$${(+deal.discount).toFixed(2)} OFF`
  const clip = () => { if (!clipped) { setClipped(true); onClip?.(deal) } }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft border border-slate-100">
      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-brand-softOrange text-brand-orange shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider">Save</span>
        <span className="text-lg font-extrabold leading-none">
          {deal.type === 'percent' ? `${deal.discount}%` : `$${deal.discount}`}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{deal.store}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-brand-navy">{deal.product || deal.product_name}</p>
        <p className="mt-1 text-xs font-medium text-brand-orange">{label}</p>
      </div>
      {clipped ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-softGreen px-3 py-1.5 text-xs font-bold text-brand-green shrink-0">
          <Check size={12} strokeWidth={3} />Auto Applied
        </span>
      ) : (
        <button
          onClick={clip}
          className="focus:outline-none inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors bg-brand-navy text-white hover:bg-slate-700 active:scale-95 shrink-0"
        >
          <Scissors size={12} strokeWidth={3} />Clip
        </button>
      )}
    </div>
  )
}
