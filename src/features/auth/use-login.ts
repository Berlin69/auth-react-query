import {useMutation} from '@tanstack/react-query'
import type {LoginBody, LoginOk} from '@/shared/api/types'
import {mockLogin} from '@/shared/api/mock'

export function useLogin() {
  return useMutation<LoginOk, unknown, LoginBody>({
    mutationFn: (body) => mockLogin(body),
  })
}