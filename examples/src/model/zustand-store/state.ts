import { create } from 'zustand'
import { setAutoFreeze } from 'immer'
import { immer } from 'zustand/middleware/immer'
import { createFormZustandAdapter } from 'formily-state-sync'

setAutoFreeze(false)

type Extra = { note: string }

// User
type UserProfile = {
  name: string
  email: string
  age: number
  subscribed: boolean
  birthday?: string
}

const initialFormData = {
  name: 'Alice',
  email: 'a@a.com',
  age: 18,
  subscribed: true,
  birthday: undefined,
}

export const UserInfoFormSlice = createFormZustandAdapter<UserProfile, Extra>(
  initialFormData,
  { note: 'User note' }
)

export const useUserInfo = create(immer(UserInfoFormSlice))
useUserInfo.getState().syncFormAndStore()

const { formIns, formData } = useUserInfo.getState()
console.log('formIns', formIns, Object.isFrozen(formIns))
console.log('formData', formData, Object.isFrozen(formData))
