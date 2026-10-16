import type { Product } from '@/data/products'

export type CartLine = { product: Product; quantity: number }
export type CartState = CartLine[]
export type CartAction =
  | { type: 'add'; product: Product; quantity?: number }
  | { type: 'increment'; productId: string }
  | { type: 'decrement'; productId: string }
  | { type: 'remove'; productId: string }

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
