export interface Address {
  id: number
  userId: number
  label: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  phone: string
  isDefault: boolean
}

export type AddressInput = Omit<Address, 'id' | 'userId'>
