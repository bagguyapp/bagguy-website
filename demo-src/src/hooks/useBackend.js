import { useState, useEffect } from 'react'
import { auth } from '../auth'
import { MOCK_USER, MOCK_DEALS, MOCK_STORE_SAVINGS } from '../mockData'

const STORE_COLORS = {
  walmart: '#0071CE', target: '#CC0000', kroger: '#0F4FA2',
  cvs: '#CC0000', walgreens: '#E4002B', costco: '#E31837',
  safeway: '#E31837', publix: '#008F4C', aldi: '#00529F',
}

function storeColor(name) {
  const key = (name || '').toLowerCase().replace(/[^a-z]/g, '')
  return STORE_COLORS[key] || '#64748B'
}

function storeInitials(name) {
  return (name || '?').slice(0, 1).toUpperCase()
}

export function useAppData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggedIn] = useState(() => auth.isLoggedIn())

  useEffect(() => {
    if (!loggedIn) {
      setData({ user: MOCK_USER, storeSavings: MOCK_STORE_SAVINGS, receipts: [], isDemo: true })
      setLoading(false)
      return
    }

    const token = auth.getToken()
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${auth.API}/auth/me`, { headers }).then(r => r.ok ? r.json() : null),
      fetch(`${auth.API}/receipts`, { headers }).then(r => r.ok ? r.json() : []),
    ]).then(([me, receiptsRaw]) => {
      const receipts = Array.isArray(receiptsRaw)
        ? receiptsRaw
        : (receiptsRaw?.receipts || receiptsRaw?.items || [])

      const totalSaved = receipts.reduce((s, r) => s + (r.savings ?? r.total_savings ?? 0), 0)
      const weekMs = 7 * 24 * 60 * 60 * 1000
      const weekReceipts = receipts.filter(r => {
        const d = r.created_at || r.date || r.scanned_at
        return d && Date.now() - new Date(d).getTime() < weekMs
      })
      const weekSaved = weekReceipts.reduce((s, r) => s + (r.savings ?? r.total_savings ?? 0), 0)

      // Aggregate store breakdown
      const storeMap = {}
      receipts.forEach(r => {
        const key = r.store || r.merchant || r.store_name || 'Other'
        storeMap[key] = (storeMap[key] || 0) + (r.savings ?? r.total_savings ?? 0)
      })
      const storeSavings = Object.entries(storeMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([store, saved]) => ({ store, saved, color: storeColor(store), initials: storeInitials(store) }))

      const email = me?.email || ''
      const name = me?.name || email.split('@')[0] || 'Saver'
      const bagPoints = Math.round(totalSaved * 10)

      setData({
        user: {
          name,
          email,
          joined: me?.created_at ? new Date(me.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
          totalSaved,
          weekSaved,
          bagPoints,
          plan: me?.plan || me?.subscription || 'free',
        },
        storeSavings: storeSavings.length ? storeSavings : MOCK_STORE_SAVINGS,
        receipts,
        isDemo: false,
      })
    }).catch(() => {
      setData({ user: MOCK_USER, storeSavings: MOCK_STORE_SAVINGS, receipts: [], isDemo: true })
    }).finally(() => setLoading(false))
  }, [loggedIn])

  return { data, loading, loggedIn }
}
