import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {loginSchema, type LoginForm} from './login.schema'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {useLogin} from "@/features/auth/use-login.ts";
import {mapApiErrorToUi} from "@/shared/api/error-mapping.ts";
import {Logo} from "@/components/ui/logo.tsx";
import {AdornedInput} from "@/components/ui/adorned-input.tsx";
import {LockKeyhole, User} from "lucide-react";

export function LoginForm({onSuccess}: { onSuccess: (tempToken: string) => void }) {
  const {register, handleSubmit, formState: {errors}, setError, watch} =
    useForm<LoginForm>({
      resolver: zodResolver(loginSchema),
      mode: 'onSubmit',
      defaultValues: {email: '', password: ''},
    })

  const [commonError, setCommonError] = useState<string | null>(null)
  const login = useLogin()

  const email = watch('email')
  const password = watch('password')
  const isDisabled = login.isPending || !email?.trim() || !password?.trim()

  const onSubmit = (data: LoginForm) => {
    setCommonError(null)
    login.mutate(
      {email: data.email, password: data.password},
      {
        onError: (e) => {
          const mapped = mapApiErrorToUi(e)
          if (mapped.common) setCommonError(mapped.common)
          if (mapped.fields) {
            Object.entries(mapped.fields).forEach(([name, msgs]) => {
              // @ts-expect-error narrow name
              setError(name, {type: 'server', message: msgs[0]})
            })
          }
        },
        onSuccess: (res) => onSuccess(res.tempToken),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'grid gap-4 p-8 bg-white max-w-[440px] w-full rounded-sm'}>
      <div className={'flex flex-col items-center justify-center'}>
        <Logo className={'py-5'}/>
        <h2 className={'font-semibold text-2xl text-center'}>Sign in to your account to continue</h2>
      </div>

      <label htmlFor={'email'} className="grid gap-1">
        <AdornedInput id={'email'} icon={User} type="email" placeholder="Email"
                      autoComplete="email" {...register('email')}/>
        {errors.email?.message && <span className="text-xs text-red-600">{errors.email.message}</span>}
      </label>

      <label className="grid gap-1">
        <AdornedInput id={'password'} icon={LockKeyhole} type="password" placeholder="Password"
                      autoComplete="current-password" {...register('password')} />
        {errors.password?.message && <span className="text-xs text-red-600">{errors.password.message}</span>}
      </label>

      {commonError && <div role="alert" className=" text-red-500 text-sm">{commonError}</div>}

      <Button type="submit" disabled={isDisabled}>
        {login.isPending ? 'Signing in…' : 'Log in'}
      </Button>

    </form>
  )
}