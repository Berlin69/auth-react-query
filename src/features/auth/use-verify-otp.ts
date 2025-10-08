'use client'
import {useMutation} from '@tanstack/react-query'
import type {VerifyOtpBody, VerifyOtpOk} from '@/shared/api/types'
import {mockVerifyOtp} from '@/shared/api/mock'

export function useVerifyOtp() {
  return useMutation<VerifyOtpOk, unknown, VerifyOtpBody>({
    mutationFn: (body) => mockVerifyOtp(body),
    onSuccess: (data) => {
      // демо
      sessionStorage.setItem('token', data.token)
    },
  })
}