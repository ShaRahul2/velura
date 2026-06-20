export type ProductCategory =
  | 'everyday'
  | 'pushup'
  | 'lace'
  | 'sports'
  | 'seamless'
  | 'plus'
  | 'bridal'

export type ImageType = 'front' | 'back' | 'lifestyle' | 'detail'

export interface ProductImage {
  id:          number
  url:         string
  key:         string | null
  alt:         string | null
  position:    number
  type:        ImageType
  isPrimary:   boolean
  blurDataURL: string | null
}

export type BadgeType =
  | 'Bestseller'
  | 'New'
  | 'Sale'
  | 'Premium'
  | 'Comfort Fit'
  | null

export type SupportLevel = 'Light' | 'Medium' | 'High'

export interface Product {
  id: number
  name: string
  story: string
  sub: string
  price: number
  oldPrice: number | null
  emoji: string
  badge: BadgeType
  cat: ProductCategory
  rating: number
  reviews: number
  fabric: string
  support: SupportLevel
  sizes: string
  images:      string[]
  blurDataURL?: string
  /** Up to 4 hex colour codes representing available colorways for swatch display */
  colorways?:  string[]
}

export interface BuilderState {
  sizeMode: 'standard' | 'fit'
  band: string | null
  cup: string | null
  braType: string | null
  strapStyle: string | null
  padding: string | null
  underwire: string | null
  closure: string | null
  support: string | null
  fabric: string | null
  color: string | null
  fitUnit: 'cm' | 'in'
}

export interface CartItem {
  id: number
  name: string
  price: number
  qty: number
  size: string
  emoji: string
  images: string[]
  isCustom?: boolean
  customSpec?: BuilderState
  customGrad?: string
}

export interface OrderItem {
  productId: number | null
  name: string
  qty: number
  price: number
  size: string
  customSpec?: BuilderState
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine: string
  city: string
  state: string
  pinCode: string
}

export interface Order {
  id: string
  items: OrderItem[]
  address: Address
  paymentMethod: string
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
}

export interface Category {
  id:          number
  slug:        ProductCategory
  label:       string
  description: string | null
  imageUrl:    string | null
  sortOrder:   number
}

export interface Review {
  id:        number
  productId: number
  rating:    number
  body:      string | null
  author:    string
  verified:  boolean
  createdAt: string
}

export interface FitCalculatorInput {
  bust: number
  underbust: number
  unit: 'cm' | 'in'
}

export interface FitCalculatorResult {
  band: string
  cup: string
  size: string
  confidence: 'high' | 'medium'
}
