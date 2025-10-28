import React from 'react'
import { connect, mapProps } from '@formily/react'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Switch } from './ui/switch'
import { DatePicker } from './ui/date-picker'
import { FormItem } from './ui/form-item'

// Input 适配器
export const FormilyInput = connect(
  Input,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapProps((props: any) => {
    return {
      ...props,
      value: props.value || '',
    }
  })
)

// NumberPicker 适配器 - 使用 Input with type="number"
export const FormilyNumberPicker = connect(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: any) => <Input type="number" {...props} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapProps((props: any) => {
    return {
      ...props,
      value: props.value ?? '',
    }
  })
)

// Select 适配器
export const FormilySelect = connect(
  Select,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapProps((props: any) => {
    return {
      ...props,
      value: props.value || '',
    }
  })
)

// Switch 适配器
export const FormilySwitch = connect(
  Switch,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapProps((props: any) => {
    return {
      ...props,
      checked: props.value ?? false,
    }
  })
)

// DatePicker 适配器
export const FormilyDatePicker = connect(
  DatePicker,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapProps((props: any) => {
    return {
      ...props,
      value: props.value || '',
    }
  })
)

// FormItem 装饰器
export const FormilyFormItem = connect(
  FormItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapProps((props: any, field) => {
    return {
      ...props,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      title: (field as any).title || props.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      required: Boolean((field as any).required) || props.required,
    }
  })
)

