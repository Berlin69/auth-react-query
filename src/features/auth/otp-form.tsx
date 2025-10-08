import {useEffect, useState, useRef} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/components/ui/button'
import {InputOTP, InputOTPSlot} from '@/components/ui/input-otp'
import {useVerifyOtp} from "@/features/auth/use-verify-otp.ts";
import {mapApiErrorToUi} from "@/shared/api/error-mapping.ts";
import {Logo} from "@/components/ui/logo.tsx";
import {useOtpCountdown} from "@/features/auth/use-otp-countdown.ts";
import {mockResendOtp} from "@/shared/api/mock.ts";

import {otpSchema, type OtpForm} from './otp.schema'
import {REGEXP_ONLY_DIGITS_AND_CHARS} from "input-otp"
import {ArrowLeft} from "lucide-react";
import {useOtpStore} from "@/shared/store/otp.ts";
import {cn} from "@/lib/utils.ts";

export function OtpForm({
                          tempToken,
                          onBack,
                          onDone,
                        }: {
  tempToken: string
  onBack: () => void
  onDone: () => void
}) {
  const start = useOtpStore(s => s.start)
  const reset = useOtpStore(s => s.reset)
  const {expired} = useOtpCountdown()

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: {errors, submitCount},
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {code: ''},
    mode: 'onSubmit',           // валидируем по сабмиту (по умолчанию так, но фиксируем явно)
  })

  const [commonError, setCommonError] = useState<string | null>(null)
  const code = watch('code')
  const verify = useVerifyOtp()
  const lastSubmitted = useRef<string | null>(null)

  const submit = (data: OtpForm) => {
    setCommonError(null)
    if (expired) {
      setCommonError('Code expired')
      return
    }
    verify.mutate(
      {tempToken, code: data.code},
      {
        onError: (e) => {
          const mapped = mapApiErrorToUi(e)
          if (mapped.common) setCommonError(mapped.common)
        },
        onSuccess: () => onDone(),
      }
    )
  }

  useEffect(() => {
    start()
  }, [start, tempToken])

  // автосабмит когда ввели 6 цифр
  useEffect(() => {
    const run = async () => {
      if (code?.length === 6 && !verify.isPending && !expired) {
        const ok = await trigger('code')
        if (!ok) return
        if (lastSubmitted.current !== code) {
          lastSubmitted.current = code
          void submit({code})
        }
      }
    }
    void run()
  }, [code, verify.isPending, expired, trigger])

  useEffect(() => {
    if ((code?.length ?? 0) < 6) lastSubmitted.current = null
  }, [code])

  const onGetNew = async () => {
    await mockResendOtp(tempToken)
    setValue('code', '', {shouldValidate: true})
    setCommonError(null)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="relative grid gap-4 bg-white max-w-[440px] w-full rounded-sm p-8">
      <div>
        <Logo className='w-fit mx-auto py-5'/>
        <h1 className="text-2xl font-semibold text-center">Two-Factor Authentication</h1>
        <p className="text-gray-600 text-center mt-1">Enter the 6-digit code from the Google Authenticator app</p>
      </div>

      <div className="grid gap-2">
        <InputOTP
          value={code}
          onChange={(v) => setValue('code', v, {
            shouldValidate: v.length === 6,
            shouldDirty: true,
            shouldTouch: true,
          })}
          aria-label="One-time code"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPSlot index={0} className={cn(commonError && 'border-red-500')}/>
          <InputOTPSlot index={1} className={cn(commonError && 'border-red-500')}/>
          <InputOTPSlot index={2} className={cn(commonError && 'border-red-500')}/>
          <InputOTPSlot index={3} className={cn(commonError && 'border-red-500')}/>
          <InputOTPSlot index={4} className={cn(commonError && 'border-red-500')}/>
          <InputOTPSlot index={5} className={cn(commonError && 'border-red-500')}/>
        </InputOTP>
        {Boolean(errors.code?.message) &&
          (submitCount > 0 || (code?.length ?? 0) === 6) && (
            <span className="text-xs text-red-600">{errors.code!.message}</span>
          )
        }
        {commonError && <div role="alert" className="text-red-500 text-sm">{commonError}</div>}
      </div>

      {expired && (
        <Button type="button" onClick={onGetNew}>
          Get new
        </Button>
      )}
      <Button variant={'ghost'} className={'w-fit absolute top-8 left-8 cursor-pointer bg-transparent'} type="button"
              onClick={onBack}
              disabled={verify.isPending}><ArrowLeft/></Button>
    </form>
  )
}