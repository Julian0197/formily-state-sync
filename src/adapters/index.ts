import { immer } from 'zustand/middleware/immer'
import { FormSlice } from '../types'
import {
  createForm,
  onFieldInputValueChange,
  onFormUnmount,
} from '@formily/core'
import { toJS } from '@formily/reactive'
import { createUniqueKey } from '../utils'

export const createFormZustandAdapter = <
  T extends Record<string, any>,
  D extends Record<string, any>
>(
  initialFormData: T,
  initialExtraData: D
) =>
  immer<FormSlice<T, D>>((set, get, api) => ({
    formIns: createForm<T>({
      values: initialFormData,
    }),
    formData: initialFormData,
    extraData: initialExtraData,
    syncFormAndStore: () => {
      if (get().stopSyncFormAndStore) {
        return
      }
      let isFormTriggered = false
      // store => form
      const unsubscribe = api.subscribe((state, preState) => {
        if (state.formData === preState.formData) {
          return
        }
        if (isFormTriggered) {
          isFormTriggered = false
          return
        }
        const { formData, formIns } = state
        formIns.values = { ...formData }
      })

      const syncEffectKey = createUniqueKey()
      const formIns = get().formIns
      // form (input change) => store
      const handleFormInputValueChange = () => {
        onFieldInputValueChange('*', () => {
          isFormTriggered = true
          set((draft) => {
            draft.formData = toJS(get().formIns.values)
          })
        })
        // When FORM components mounts, it triggers form's onUnmounted, clearing all effects
        // But the form instance is reused, sp we need to restore the effect
        onFormUnmount(() => {
          setTimeout(() => {
            formIns.addEffects(syncEffectKey, handleFormInputValueChange)
          })
        })
      }
      formIns.addEffects(syncEffectKey, handleFormInputValueChange)

      // Add stopSyncFormAndStore function to the store
      set((draft) => {
        draft.stopSyncFormAndStore = () => {
          unsubscribe()
          formIns.removeEffects(syncEffectKey)
          draft.stopSyncFormAndStore = undefined
        }
      })
    },
    resetFormState: () => {
      set((draft) => {
        draft.formData = initialFormData
        draft.extraData = initialExtraData
        // reset form values, effects and validate rules (by formily)
        draft.formIns.reset()
        draft.formIns.clearFormGraph()
      })
    },
    // form instance is stored as a singleton, Formily's internal state and mechanisms may not be properly restored when UI components reload
    remountForm: () => {
      const { formIns, stopSyncFormAndStore } = get()
      const beforeIsSynced = Boolean(stopSyncFormAndStore)
      if (beforeIsSynced) {
        stopSyncFormAndStore!()
      }
      formIns.onUnmount() // // Trigger Formily unmount lifecycle
      formIns.onMount() // Trigger Formily mount lifecycle
      if (beforeIsSynced) {
        get().syncFormAndStore() // Restart bidirectional synchronization
      }
    },
  }))
