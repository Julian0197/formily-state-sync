import { createStore } from 'jotai/vanilla'
import { atomWithImmer } from 'jotai-immer'
import {
  createForm,
  onFieldInputValueChange,
  onFormUnmount,
} from '@formily/core'
import { toJS } from '@formily/reactive'
import { createUniqueKey } from '../utils'
import { FormJotaiSlice } from '../types'
import { atom } from 'jotai'

/**
 * Create a Jotai adapter that:
 * - Provides a read-only atom for the Formily form instance
 * - Synchronizes form <-> atoms using a vanilla store subscription
 * - Uses jotai-immer for ergonomic immutable updates on complex shapes
 * - Avoids storing functions in atoms (functions remain stable via closures)
 */
export const createFormJotaiAdapter = <
  T extends Record<string, any>,
  D extends Record<string, any>
>(
  initialFormData: T,
  initialExtraData: D,
  opts?: {
    store?: ReturnType<typeof createStore> // inject external jotai store
  }
): FormJotaiSlice<T, D> => {
  const store = opts?.store || createStore()

  const formIns = createForm<T>({
    values: initialFormData,
  })
  // Internal writable atom to hold the instance reference
  const _formInsAtom = atom(formIns)
  // Public read-only projection to prevent accidental writes/subscriptions
  const formInsAtom = atom((get) => get(_formInsAtom))

  // Atoms for data payloads (immer-enabled for ergonomic nested updates)
  const formDataAtom = atomWithImmer(initialFormData)
  const extraDataAtom = atomWithImmer(initialExtraData)

  let isFormTriggered = false
  let unsubscribeAtom: null | (() => void) = null
  let syncEffectKey: Symbol | null = null

  // Form (input change) => Atom
  const setupFormToAtomSync = () => {
    const key = createUniqueKey()
    syncEffectKey = key

    const handleFormInputValueChange = () => {
      onFieldInputValueChange('*', () => {
        isFormTriggered = true
        store.set(formDataAtom, () => toJS(formIns.values))
      })

      // Formily clears effects on unmount; restore our effect on onUnmount
      onFormUnmount(() => {
        setTimeout(() => {
          formIns.addEffects(key, handleFormInputValueChange)
        })
      })
    }
    formIns.addEffects(syncEffectKey, handleFormInputValueChange)
  }

  // Atom => Form
  const setupAtomToFormSync = () => {
    unsubscribeAtom = store.sub(formDataAtom, () => {
      const formData = store.get(formDataAtom)
      if (isFormTriggered) {
        isFormTriggered = false
        return
      }
      formIns.values = { ...formData }
    })
  }

  const syncFormAndStore = () => {
    if (unsubscribeAtom || syncEffectKey) {
      return
    }
    setupFormToAtomSync()
    setupAtomToFormSync()
  }

  const stopSyncFormAndStore = () => {
    if (unsubscribeAtom) {
      unsubscribeAtom()
      unsubscribeAtom = null
    }
    if (syncEffectKey) {
      formIns.removeEffects(syncEffectKey)
      syncEffectKey = null
    }
  }

  const resetFormState = () => {
    // Reset Formily internal state (values, validations, graph)
    formIns.reset()
    formIns.clearFormGraph()
    // Reset atoms to initial snapshots
    store.set(formDataAtom, () => initialFormData)
    store.set(extraDataAtom, () => initialExtraData)
  }

    const remountForm = () => {
      const beforeIsSynced = Boolean(unsubscribeAtom || syncEffectKey)
      if (beforeIsSynced) stopSyncFormAndStore()
      formIns.onUnmount()
      formIns.onMount()
      if (beforeIsSynced) syncFormAndStore()
    }

  return {
    formInsAtom,
    formDataAtom,
    extraDataAtom,
    syncFormAndStore,
    stopSyncFormAndStore,
    resetFormState,
    remountForm,
  }
}
