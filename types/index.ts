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
  isActive?: boolean
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
  /** Hex codes for available colourways. First entry is the photographed colour. */
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
  color?: string
  colorLabel?: string
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
  placeId?: string
  lat?: number
  lng?: number
}

export interface Order {
  id: string
  items: OrderItem[]
  address: Address
  paymentMethod: string
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  paidAt?: string | null
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
