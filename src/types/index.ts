import { Form } from '@formily/core'
import { Atom } from 'jotai'

export interface FormZustandSlice<
  T extends Record<string, any>,
  D extends Record<string, any>
> {
  /** form instance */
  formIns: Form<T>
  /** form data */
  formData: T
  /** Additional data to save outside form data */
  extraData: D
  /** Enable bidirectional sync between form and store */
  syncFormAndStore: () => void
  /** Stop bidirectional sync function */
  stopSyncFormAndStore?: () => void
  /** Reset form state */
  resetFormState: () => void
  /** Remount form instance */
  remountForm: () => void
}

export interface FormJotaiSlice<
  T extends Record<string, any>,
  D extends Record<string, any>
> {
  formInsAtom: Atom<Form<T>>
  formDataAtom: Atom<T>
  extraDataAtom: Atom<D>
  syncFormAndStore: () => void
  stopSyncFormAndStore?: () => void
  resetFormState: () => void
  remountForm: () => void
}
