import { Zap } from 'lucide-react'

export function MascotBubble({ message = "I just spotted deals at your favorite stores!", cta, onCtaClick }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-soft border border-slate-100">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-softGreen blur-2xl pointer-events-none" />
      <div className="relative flex items-start gap-4">
        <div className="shrink-0 animate-float">
          <svg width="72" height="84" viewBox="0 0 120 140" aria-hidden="true">
            <path d="M40 32 Q40 16 60 16 Q80 16 80 32" fill="none" stroke="#F97316" strokeWidth="6" strokeLinecap="round"/>
            <path d="M22 38 L98 38 L92 130 Q92 134 88 134 L32 134 Q28 134 28 130 Z" fill="#22C55E"/>
            <circle cx="48" cy="68" r="5" fill="#0F172A"/>
            <circle cx="72" cy="68" r="5" fill="#0F172A"/>
            <path d="M46 88 Q60 100 74 88" fill="none" stroke="#0F172A" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1 rounded-full bg-brand-softGreen px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green">
            <Zap size={10} />Bag Guy says
          </div>
          <p className="mt-2 text-sm font-semibold text-brand-navy leading-snug">{message}</p>
          {cta && (
            <button
              onClick={onCtaClick}
              className="focus:outline-none mt-3 inline-flex items-center gap-1 rounded-full bg-brand-navy px-3 py-1.5 text-xs font-bold text-white transition active:scale-95 hover:bg-slate-700"
            >
              {cta}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
