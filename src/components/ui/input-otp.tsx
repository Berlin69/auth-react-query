import * as React from "react"
import {OTPInput, OTPInputContext} from "input-otp"
import {MinusIcon} from "lucide-react"

import {cn} from "@/lib/utils"

function InputOTP({
                    className,
                    containerClassName,
                    ...props
                  }: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "w-full flex items-center gap-3 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({className, ...props}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center w-full", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
                        index,
                        className,
                        ...props
                      }: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const {char, hasFakeCaret, isActive} = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-[60px] flex-1 min-w-0 items-center justify-center rounded-md border text-lg border-input shadow-xs outline-none transition-all data-[active=true]:z-10 data-[active=true]:ring-[3px] data-[active=true]:border-[#1677ff] data-[active=true]:ring-[#e6f4ff]/50 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000"/>
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({...props}: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon/>
    </div>
  )
}

export {InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator}
