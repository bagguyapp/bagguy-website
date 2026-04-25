import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { DealCard } from '../components/DealCard'
import { MOCK_DEALS } from '../mockData'

const STORE_FILTERS = ['All', 'Walmart', 'Target', 'Kroger', 'CVS', 'Walgreens']

export function Deals({ deals, loading }) {
  const [query, setQuery] = useState('')
  const [activeStore, setActiveStore] = useState('All')

  const allDeals = deals.length ? deals : MOCK_DEALS

  // Build dynamic store filter list from actual deals
  const storeFilters = useMemo(() => {
    const fromDeals = [...new Set(allDeals.map(d => d.store).filter(Boolean))].slice(0, 5)
    const merged = ['All', ...new Set([...STORE_FILTERS.slice(1), ...fromDeals])]
    return merged.slice(0, 7)
  }, [allDeals])

  const filtered = useMemo(() => {
    let list = [...allDeals]
    if (activeStore !== 'All') list = list.filter(d => d.store === activeStore)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(d =>
        (d.product || d.product_name || '').toLowerCase().includes(q) ||
        (d.store || '').toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => Number(b.applied) - Number(a.applied))
  }, [allDeals, activeStore, query])

  return (
    <div className="px-5 pt-12 pb-8 space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {loading ? 'Loading…' : 'Live coupons'}
        </p>
        <h1 className="text-3xl font-extrabold text-brand-navy">All Deals</h1>
      </header>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search deals or stores"
          className="focus:outline-none w-full rounded-2xl bg-white border border-slate-200 pl-11 pr-4 py-3 text-sm placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {storeFilters.map(s => (
          <button
            key={s}
            onClick={() => setActiveStore(s)}
            className={`focus:outline-none shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${activeStore === s ? 'bg-brand-navy text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-white/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0
            ? <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 border border-slate-100">No deals match your filter.</div>
            : filtered.map(d => <DealCard key={d.id} deal={d} />)
          }
        </div>
      )}
    </div>
  )
}
