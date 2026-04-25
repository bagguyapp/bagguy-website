import { useState, useRef } from 'react'
import { ScanLine, Loader, Check, ChevronRight } from 'lucide-react'
import { auth } from '../auth'
import { MOCK_SCAN } from '../mockData'

function Corner({ position }) {
  const cls = {
    'top-left': 'top-4 left-4 border-t-2 border-l-2 rounded-tl-xl',
    'top-right': 'top-4 right-4 border-t-2 border-r-2 rounded-tr-xl',
    'bottom-left': 'bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl',
    'bottom-right': 'bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl',
  }[position]
  return <div className={`absolute h-8 w-8 border-brand-green ${cls}`} />
}

export function Scan({ loggedIn, goTo }) {
  const [status, setStatus] = useState('idle') // idle | scanning | result | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('scanning')
    setErrorMsg('')
    setResult(null)

    try {
      const token = auth.getToken()
      const form = new FormData()
      form.append('image', file)

      const res = await fetch(`${auth.API}/receipts/scan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Server error ${res.status}: ${txt}`)
      }

      const data = await res.json()
      const items = data.items || data.matched_items || []
      const totalSaved = data.total_savings ?? items.reduce((s, i) => s + (i.savings || i.discount || 0), 0)
      const matched = items.filter(i => i.applied || (i.savings || i.discount || 0) > 0).length

      setResult({
        store: data.store || data.merchant || 'Store',
        totalItems: items.length || data.total_items || data.item_count || items.length,
        matched,
        saved: totalSaved,
        items,
      })
      setStatus('result')
    } catch (err) {
      setErrorMsg(err.message || 'Scan failed')
      setStatus('error')
    } finally {
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const reset = () => { setStatus('idle'); setResult(null); setErrorMsg('') }

  if (!loggedIn) return (
    <div className="px-5 pt-12 pb-8 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Bag Guy Scanner</p>
        <h1 className="text-3xl font-extrabold text-brand-navy">Scan once. <span className="text-brand-green">Save instantly.</span></h1>
      </header>
      <div className="relative aspect-square w-full rounded-3xl bg-brand-navy overflow-hidden shadow-soft flex items-center justify-center">
        <ScanLine size={120} strokeWidth={1} className="text-white/20" />
        <Corner position="top-left" /><Corner position="top-right" />
        <Corner position="bottom-left" /><Corner position="bottom-right" />
      </div>
      <div className="rounded-3xl bg-white p-6 text-center shadow-soft border border-slate-100 space-y-3">
        <p className="text-sm font-semibold text-brand-navy">Sign in to scan a receipt</p>
        <p className="text-xs text-slate-500">Create a free account to upload receipts and find your savings.</p>
        <a href="/login.html" className="inline-block rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white">
          Sign in
        </a>
      </div>
    </div>
  )

  return (
    <div className="px-5 pt-12 pb-8 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Bag Guy Scanner</p>
        <h1 className="text-3xl font-extrabold text-brand-navy">Scan once. <span className="text-brand-green">Save instantly.</span></h1>
      </header>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative aspect-square w-full rounded-3xl bg-brand-navy overflow-hidden shadow-soft">
        <div className="absolute inset-0 flex items-center justify-center">
          {status === 'scanning' && (
            <div className="text-white text-center space-y-3">
              <Loader size={48} className="animate-spin mx-auto opacity-80" strokeWidth={2.5} />
              <p className="text-sm font-semibold">Reading your receipt…</p>
            </div>
          )}
          {status === 'result' && result && (
            <div className="text-center space-y-2 px-6">
              <div className="mx-auto h-14 w-14 rounded-full bg-brand-green flex items-center justify-center animate-pop">
                <Check size={32} strokeWidth={3.5} className="text-white" />
              </div>
              <p className="text-white text-lg font-bold">{result.store}</p>
              <p className="text-white/70 text-xs">{result.totalItems} items detected</p>
            </div>
          )}
          {(status === 'idle' || status === 'error') && (
            <ScanLine size={120} strokeWidth={1} className="text-white/20" />
          )}
        </div>
        <Corner position="top-left" /><Corner position="top-right" />
        <Corner position="bottom-left" /><Corner position="bottom-right" />
        {status === 'scanning' && (
          <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-brand-green shadow-[0_0_20px_4px_rgba(34,197,94,0.6)] animate-pulse" />
        )}
      </div>

      {status === 'error' && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 font-medium">
          {errorMsg || 'Something went wrong. Try again.'}
        </div>
      )}

      {status !== 'result' ? (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={status === 'scanning'}
          className="focus:outline-none w-full rounded-3xl bg-brand-green py-5 text-white text-lg font-extrabold shadow-lift active:scale-[0.98] disabled:opacity-60"
        >
          {status === 'scanning' ? 'Scanning…' : status === 'error' ? 'Try Again' : 'Start Scan'}
        </button>
      ) : (
        <div className="space-y-4 animate-pop">
          <div className="rounded-3xl bg-gradient-to-br from-brand-green to-brand-lime p-5 text-white shadow-lift">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">You saved</p>
            <p className="text-4xl font-extrabold mt-1">${result.saved.toFixed(2)}</p>
            <p className="text-xs mt-1 opacity-90">{result.matched} of {result.totalItems} items matched coupons</p>
          </div>
          <div className="rounded-2xl bg-white shadow-soft border border-slate-100 divide-y divide-slate-100">
            {result.items.map((item, i) => {
              const saving = item.savings ?? item.discount ?? 0
              const applied = item.applied || saving > 0
              return (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-navy truncate">{item.name || item.product || item.description}</p>
                    <p className="text-xs text-slate-500">${(item.price || 0).toFixed(2)}</p>
                  </div>
                  {applied
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-brand-softGreen px-3 py-1 text-xs font-bold text-brand-green shrink-0"><Check size={12} strokeWidth={3} />-${saving.toFixed(2)}</span>
                    : <span className="text-xs text-slate-400 font-medium shrink-0">No deal</span>
                  }
                </div>
              )
            })}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => goTo('savings')}
              className="focus:outline-none flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-navy py-4 text-white font-bold active:scale-[0.98]"
            >
              View savings <ChevronRight size={18} />
            </button>
            <button
              onClick={reset}
              className="focus:outline-none rounded-2xl bg-white border border-slate-200 px-4 py-4 font-bold text-slate-600 active:scale-[0.98]"
            >
              Scan again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
