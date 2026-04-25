import { useState } from 'react'
import { ChevronLeft, Copy, Check, ExternalLink } from 'lucide-react'

const MINT = '5EguQYitVgoC2ZdSbZFXRvNk9JhTkacN2fXDPQgBKE1W'

const TOKENOMICS = [
  { label: 'Community Rewards', pct: 40, desc: 'Earned through grocery scans, referrals, and purchases', color: '#9945FF' },
  { label: 'Liquidity Pool', pct: 20, desc: 'Locked in Raydium and Jupiter for trading', color: '#14F195' },
  { label: 'Team & Development', pct: 15, desc: '3-year linear vesting · Funds app dev', color: '#F59E0B' },
  { label: 'Marketing & Growth', pct: 15, desc: 'Partnerships, ads, and community growth', color: '#F97316' },
  { label: 'Reserve', pct: 10, desc: 'Strategic reserve for ecosystem expansion', color: '#64748B' },
]

const TRADE_LINKS = [
  { icon: '🪐', name: 'Buy on Jupiter', desc: 'Swap SOL → BGT instantly', href: 'https://jup.ag/swap/SOL-5EguQYitVgoC2ZdSbZFXRvNk9JhTkacN2fXDPQgBKE1W' },
  { icon: '💧', name: 'Add Liquidity', desc: 'Provide LP on Raydium', href: 'https://raydium.io/liquidity/increase/?mode=add&pool_id=7yX6uP3vgFcFFn9onayhirn7Qvhb3Js8LiEHogjDnYnY' },
  { icon: '📊', name: 'DEX Screener', desc: 'Live chart + order book', href: 'https://www.dexscreener.com/solana/7yX6uP3vgFcFFn9onayhirn7Qvhb3Js8LiEHogjDnYnY' },
]

export function Crypto({ goTo }) {
  const [copied, setCopied] = useState(false)

  const copyMint = () => {
    navigator.clipboard.writeText(MINT).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = MINT; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="px-5 pt-10 pb-8 space-y-6" style={{ background: 'linear-gradient(135deg, #0a0a16 0%, #0a0a16 100%)', minHeight: '100%' }}>
      {/* Back button */}
      <button
        onClick={() => goTo('account')}
        className="focus:outline-none inline-flex items-center gap-1 text-sm font-semibold"
        style={{ color: '#14F195' }}
      >
        <ChevronLeft size={18} />Back to Account
      </button>

      {/* Hero */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.3)', color: '#14F195' }}>
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: '#14F195' }} />
          Live on Solana
        </div>
        <h1 className="text-4xl font-black" style={{ color: '#f1f1f1' }}>
          <span style={{ background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BGT</span>
          {' '}Token
        </h1>
        <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#8b8bab' }}>
          Real-utility SPL token on Solana. Earned on every grocery scan. Trade it on Jupiter and Raydium.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Supply', value: '1,000,000,000', sub: 'BGT · Fixed forever' },
          { label: 'Network', value: 'Solana', sub: 'SPL Token' },
          { label: 'DEX', value: 'Jupiter + Raydium', sub: 'Live & tradeable' },
          { label: 'Tax', value: '0%', sub: 'No transfer fee' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(17,17,42,0.8)', border: '1px solid rgba(153,69,255,0.2)' }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b8bab' }}>{s.label}</p>
            <p className="text-base font-extrabold" style={{ background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#8b8bab' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Mint address */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(17,17,42,0.8)', border: '1px solid rgba(153,69,255,0.18)' }}>
        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8b8bab' }}>Mint Address</p>
        <div className="flex items-center gap-2">
          <p className="flex-1 text-xs font-mono break-all" style={{ color: '#14F195' }}>{MINT}</p>
          <button
            onClick={copyMint}
            className="focus:outline-none shrink-0 rounded-lg px-3 py-2 text-xs font-bold flex items-center gap-1"
            style={{ background: 'rgba(153,69,255,0.18)', color: '#9945FF' }}
          >
            {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
          </button>
        </div>
      </div>

      {/* Trade links */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9945FF' }}>Trade BGT</p>
        {TRADE_LINKS.map(link => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl p-4 no-underline transition-transform active:scale-[0.98]"
            style={{ background: 'rgba(17,17,42,0.8)', border: '1px solid rgba(153,69,255,0.18)' }}
          >
            <span className="text-2xl">{link.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: '#f1f1f1' }}>{link.name}</p>
              <p className="text-xs" style={{ color: '#8b8bab' }}>{link.desc}</p>
            </div>
            <ExternalLink size={14} style={{ color: '#9945FF' }} />
          </a>
        ))}
      </div>

      {/* Tokenomics */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9945FF' }}>Tokenomics</p>
        {TOKENOMICS.map(item => (
          <div key={item.label} className="rounded-2xl p-4" style={{ background: 'rgba(17,17,42,0.8)', border: '1px solid rgba(153,69,255,0.12)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold" style={{ color: '#f1f1f1' }}>{item.label}</p>
              <p className="text-sm font-extrabold" style={{ color: item.color }}>{item.pct}%</p>
            </div>
            <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.pct}%`, background: item.color }} />
            </div>
            <p className="text-xs" style={{ color: '#8b8bab' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs pb-4" style={{ color: '#8b8bab' }}>
        BGT is a real-utility token. Always do your own research before trading.
      </p>
    </div>
  )
}
