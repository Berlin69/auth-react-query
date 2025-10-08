import * as React from "react"
import {Input} from "@/components/ui/input"
import {cn} from "@/lib/utils"

type IconComponent = React.ComponentType<{ className?: string; size?: number }>

type AdornedInputProps = Omit<React.ComponentProps<"input">, "className"> & {
  icon?: IconComponent
  iconProps?: { className?: string; size?: number; onClick?: () => void; title?: string }
  className?: string
  wrapperClassName?: string
  offset?: number
  clickable?: boolean
}

export const AdornedInput = React.forwardRef<HTMLInputElement, AdornedInputProps>(
  (
    {
      icon: Icon,
      iconProps,
      className,
      wrapperClassName,
      offset = 40,
      clickable = false,
      ...inputProps
    },
    ref
  ) => {

    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        {Icon ? (
          <Icon
            aria-hidden
            size={iconProps?.size ?? 16}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground left-3",
              clickable && "cursor-pointer",
              iconProps?.className
            )}
            {...iconProps}
          />
        ) : null}

        <Input
          ref={ref}
          className={cn('pl-8', className)}
          {...inputProps}
        />
      </div>
    )
  }
)
AdornedInput.displayName = "AdornedInput"
