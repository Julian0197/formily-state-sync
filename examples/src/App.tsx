import React from 'react'
import 'react-json-view-lite/dist/index.css'
import './App.css'
import { Field, FormProvider, Observer } from '@formily/react'
import { JsonView, darkStyles } from 'react-json-view-lite'
import { useUserInfo } from './model/zustand-store/state'
import {
  FormilyFormItem,
  FormilyInput,
  FormilyNumberPicker,
  FormilySelect,
  FormilySwitch,
  FormilyDatePicker,
} from './components/formily-adapters'
import { Button } from './components/ui/button'
import { createForm } from '@formily/core'

function Toolbar() {
  const actions = [
    useUserInfo((s) => ({
      resetFormState: s.resetFormState,
      remountForm: s.remountForm,
      syncFormAndStore: s.syncFormAndStore,
      stopSyncFormAndStore: s.stopSyncFormAndStore,
    })),
  ]
  const centerRow: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    margin: '12px 0 16px',
    flexWrap: 'wrap',
  }
  return (
    <div style={centerRow}>
      <Button onClick={() => actions.forEach((a) => a.resetFormState())}>
        重置全部
      </Button>
      <Button onClick={() => actions.forEach((a) => a.remountForm())}>
        Remount 全部
      </Button>
      <Button onClick={() => actions.forEach((a) => a.syncFormAndStore())}>
        开始同步
      </Button>
      <Button
        onClick={() => actions.forEach((a) => a.stopSyncFormAndStore?.())}
      >
        停止同步
      </Button>
    </div>
  )
}

function Card({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  title: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        width: 520,
        padding: 12,
        border: '1px solid #eee',
        borderRadius: 8,
        boxShadow: active ? '0 0 0 2px #1677ff' : 'none',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  )
}

function App() {
  // const userForm = useUserInfo((s) => s.formIns)
  const userForm = createForm({
    values: {
      name: 'Alice',
      email: 'a@a.com',
      age: 18,
      subscribed: true,
      birthday: undefined,
    },
  })


  // const userData = useUserInfo((s) => ({
  //   formData: s.formData,
  //   extraData: s.extraData,
  // }))
  const userData = {}

  const grid: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    alignItems: 'stretch',
    flexWrap: 'wrap',
  }
  const sectionTitle: React.CSSProperties = {
    fontSize: 12,
    color: '#666',
    margin: '8px 0 4px',
  }
  const fieldCol: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 360,
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
        Formily x Zustand 表单和状态双向同步示例
      </h2>
      <Toolbar />

      <div style={grid}>
        <div>
          <Card title="用户信息" active={true}>
            <FormProvider form={userForm}>
              <div style={fieldCol}>
                <div style={sectionTitle}>基本信息</div>
                <Field
                  name="name"
                  title="Name"
                  decorator={[FormilyFormItem]}
                  component={[
                    FormilyInput,
                    {
                      placeholder: 'Input name',
                      onChange: (value) => {
                        console.log('value', value)
                      },
                    },
                  ]}
                  required
                />
                <Field
                  name="email"
                  title="Email"
                  decorator={[FormilyFormItem]}
                  component={[FormilyInput, { placeholder: 'Input email' }]}
                  required
                />
                <Field
                  name="age"
                  title="Age"
                  decorator={[FormilyFormItem]}
                  component={[
                    FormilyNumberPicker,
                    {
                      min: 0,
                    },
                  ]}
                  required
                />
                <Field
                  name="subscribed"
                  title="Subscribed"
                  decorator={[FormilyFormItem]}
                  component={[FormilySwitch]}
                />
                <Field
                  name="birthday"
                  title="Birthday"
                  decorator={[FormilyFormItem]}
                  component={[FormilyDatePicker, { valueFormat: 'YYYY-MM-DD' }]}
                />
                <Field
                  name="dataFormat"
                  title="Data Format"
                  decorator={[FormilyFormItem]}
                  component={[
                    FormilySelect,
                    {
                      placeholder: 'Select data format',
                      children: (
                        <>
                          <option value="">Select data format</option>
                          <option value="json">JSON</option>
                          <option value="xml">XML</option>
                          <option value="csv">CSV</option>
                          <option value="yaml">YAML</option>
                        </>
                      ),
                    },
                  ]}
                  required
                />
              </div>
            </FormProvider>
          </Card>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 12,
          alignItems: 'start',
        }}
      >
        <div>
          <div style={sectionTitle}>User</div>
          <Observer>
            <JsonView
              data={userData}
              style={darkStyles}
              shouldExpandNode={(level) => level < 2}
            />
          </Observer>
        </div>
      </div>
    </div>
  )
}

export default App
