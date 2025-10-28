import * as React from 'react'
import { cn } from '../../lib/utils'
import { Input } from './input'

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  valueFormat?: string
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onChange, valueFormat = 'YYYY-MM-DD', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onChange?.(newValue)
    }

    return (
      <Input
        type="date"
        ref={ref}
        className={cn(className)}
        value={value}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
DatePicker.displayName = 'DatePicker'

export { DatePicker }

