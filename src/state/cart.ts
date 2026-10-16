import { products, type Product } from '@/data/products'

export type CartLine = { product: Product; quantity: number }
export type CartState = CartLine[]
export type CartAction =
  | { type: 'add'; product: Product; quantity?: number }
  | { type: 'increment'; productId: string }
  | { type: 'decrement'; productId: string }
  | { type: 'remove'; productId: string }

const STORAGE_KEY = 'wayfarer-supply-cart-v1'

export function loadSavedCart(_: null): CartState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const saved: unknown = JSON.parse(raw)
    if (!Array.isArray(saved)) return []
    return saved.flatMap((item): CartLine[] => {
      if (typeof item !== 'object' || item === null || !('productId' in item) || !('quantity' in item)) return []
      const product = products.find((candidate) => candidate.id === item.productId)
      const quantity = item.quantity
      return product && typeof quantity === 'number' && Number.isInteger(quantity) && quantity > 0 && quantity <= 99
        ? [{ product, quantity }]
        : []
    })
  } catch {
    return []
  }
}

export function saveCart(cart: CartState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.map(({ product, quantity }) => ({ productId: product.id, quantity }))))
  } catch {
    // Keep the in-memory cart usable if storage is disabled or full.
  }
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const quantity = Math.max(1, action.quantity ?? 1)
      const existing = state.find((line) => line.product.id === action.product.id)
      return existing
        ? state.map((line) => line.product.id === action.product.id ? { ...line, quantity: line.quantity + quantity } : line)
        : [...state, { product: action.product, quantity }]
    }
    case 'increment':
      return state.map((line) => line.product.id === action.productId ? { ...line, quantity: line.quantity + 1 } : line)
    case 'decrement':
      return state.flatMap((line) => line.product.id !== action.productId ? [line] : line.quantity > 1 ? [{ ...line, quantity: line.quantity - 1 }] : [])
    case 'remove':
      return state.filter((line) => line.product.id !== action.productId)
    default:
      return state
  }
}
