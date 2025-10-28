import * as React from 'react'
import { Label } from './label'
import { cn } from '../../lib/utils'

export interface FormItemProps {
  title?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ title, required, children, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-2 w-full', className)}>
        {title && (
          <Label>
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        {children}
      </div>
    )
  }
)
FormItem.displayName = 'FormItem'

export { FormItem }

