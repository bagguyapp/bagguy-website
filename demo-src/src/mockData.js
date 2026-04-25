export const MOCK_USER = {
  name: 'Saver',
  email: 'saver@bagguyapp.com',
  joined: 'April 2026',
  totalSaved: 1247.83,
  weekSaved: 48.62,
  bagPoints: 2480,
}

export const MOCK_DEALS = [
  { id: 1, store: 'Walmart', product: 'Tide Pods 42ct', discount: 5, type: 'dollar', applied: true },
  { id: 2, store: 'Target', product: 'Coca-Cola 12pk', discount: 2, type: 'dollar', applied: true },
  { id: 3, store: 'Kroger', product: 'Cheerios Honey Nut', discount: 1.5, type: 'dollar', applied: false },
  { id: 4, store: 'CVS', product: 'Bounty Paper Towels', discount: 3, type: 'dollar', applied: false },
  { id: 5, store: 'Walgreens', product: 'Crest Toothpaste', discount: 25, type: 'percent', applied: false },
  { id: 6, store: 'Target', product: 'Doritos Cool Ranch', discount: 1, type: 'dollar', applied: false },
  { id: 7, store: 'Kroger', product: 'Folgers Coffee 32oz', discount: 4.5, type: 'dollar', applied: true },
  { id: 8, store: 'Walmart', product: 'Pampers Mega Pack', discount: 10, type: 'percent', applied: false },
]

export const MOCK_STORE_SAVINGS = [
  { store: 'Walmart', saved: 18.42, color: '#0071CE', initials: 'W' },
  { store: 'Target', saved: 12.10, color: '#CC0000', initials: 'T' },
  { store: 'Kroger', saved: 9.85, color: '#0F4FA2', initials: 'K' },
  { store: 'CVS', saved: 8.25, color: '#CC0000', initials: 'C' },
]

export const MOCK_TIERS = [
  { name: 'Free Tier', minPoints: 0, perks: '1x points · exclusive coupons', color: '#22C55E' },
  { name: 'Large Bag', minPoints: 15000, perks: '3x points · priority cashback', color: '#F97316' },
]

export const MOCK_SCAN = {
  store: 'Walmart',
  totalItems: 8,
  matched: 3,
  saved: 7.85,
  items: [
    { name: 'Tide Pods 42ct', price: 19.99, discount: 5, applied: true },
    { name: 'Coca-Cola 12pk', price: 5.49, discount: 2, applied: true },
    { name: 'Cheerios Honey Nut', price: 4.79, discount: 0.85, applied: true },
    { name: 'Milk 1 Gallon', price: 3.79, discount: 0, applied: false },
    { name: 'Bread White Loaf', price: 2.49, discount: 0, applied: false },
  ],
}
