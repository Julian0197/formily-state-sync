import { immer } from 'zustand/middleware/immer'
import { FormZustandSlice } from '../types'
import {
  createForm,
  onFieldInputValueChange,
  onFormUnmount,
} from '@formily/core'
import { toJS } from '@formily/reactive'
import { Draft } from 'immer';
import { createUniqueKey } from '../utils'

export const createFormZustandAdapter = <
  T extends Record<string, any>,
  D extends Record<string, any>
>(
  initialFormData: T,
  initialExtraData: D
) =>
  immer<FormZustandSlice<T, D>>((set, get, api) => ({
    formIns: createForm<T>({
      initialValues: initialFormData,
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
        console.log('store -> form\n', formData)
        formIns.setValues({ ...formData })
      })

      const syncEffectKey = createUniqueKey()
      const formIns = get().formIns
      // form (input change) => store
      const handleFormInputValueChange = () => {
        onFieldInputValueChange('*', () => {
          console.log(toJS(get().formIns.values as any), '999')
          isFormTriggered = true
          console.log('form -> store\n', get().formIns.values)
          set((draft) => {
            draft.formData = toJS(get().formIns.values as any)
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
        draft.formData = initialFormData as Draft<T>
        draft.extraData = initialExtraData as Draft<D>
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
