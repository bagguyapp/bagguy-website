import { useState, useEffect } from 'react'
import { Shell } from './components/Shell'
import { Home } from './screens/Home'
import { Deals } from './screens/Deals'
import { Scan } from './screens/Scan'
import { Savings } from './screens/Savings'
import { Rewards } from './screens/Rewards'
import { Account } from './screens/Account'
import { Crypto } from './screens/Crypto'
import { useAppData } from './hooks/useBackend'
import { auth } from './auth'
import { MOCK_DEALS } from './mockData'

export default function App() {
  const [screen, setScreen] = useState('home')
  const { data: appData, loading, loggedIn } = useAppData()
  const [deals, setDeals] = useState([])
  const [dealsLoading, setDealsLoading] = useState(true)

  // Fetch live deals from /coupons
  useEffect(() => {
    const token = auth.getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    fetch(`${auth.API}/coupons`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(raw => {
        const list = Array.isArray(raw) ? raw : (raw?.coupons || raw?.items || raw?.deals || [])
        // Normalize to our shape
        const normalized = list.map((d, i) => ({
          id: d.id ?? i,
          store: d.store || d.merchant || d.store_name || 'Any Store',
          product: d.product_name || d.product || d.title || d.description || '',
          discount: d.discount_amount ?? d.discount ?? d.value ?? 0,
          type: d.discount_type === 'percent' || d.type === 'percent' ? 'percent' : 'dollar',
          applied: d.applied ?? d.auto_applied ?? false,
        }))
        setDeals(normalized.length ? normalized : MOCK_DEALS)
      })
      .catch(() => setDeals(MOCK_DEALS))
      .finally(() => setDealsLoading(false))
  }, [])

  const content = (() => {
    switch (screen) {
      case 'home':    return <Home appData={appData} loading={loading} loggedIn={loggedIn} goTo={setScreen} deals={deals} />
      case 'deals':   return <Deals deals={deals} loading={dealsLoading} />
      case 'scan':    return <Scan loggedIn={loggedIn} goTo={setScreen} />
      case 'savings': return <Savings appData={appData} loading={loading} goTo={setScreen} />
      case 'rewards': return <Rewards appData={appData} />
      case 'account': return <Account appData={appData} loggedIn={loggedIn} goTo={setScreen} />
      case 'crypto':  return <Crypto goTo={setScreen} />
      default:        return <Home appData={appData} loading={loading} loggedIn={loggedIn} goTo={setScreen} deals={deals} />
    }
  })()

  return (
    <Shell current={screen} onChange={setScreen}>
      {content}
    </Shell>
  )
}
