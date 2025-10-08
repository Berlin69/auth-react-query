export type ApiErrorCode =
  | 'INVALID_CREDENTIALS' | 'BLOCKED_USER' | 'EMAIL_NOT_VERIFIED'
  | 'VALIDATION_ERROR' | 'RATE_LIMIT' | 'MAINTENANCE' | 'SERVER_ERROR'
  | 'INVALID_OTP'

export interface ApiError extends Error {
  status: number
  code: ApiErrorCode
  details?: Record<string, string[]>
}

export type LoginBody = { email: string; password: string }
export type LoginOk   = { tempToken: string; requiresOtp: true }

export type VerifyOtpBody = { tempToken: string; code: string }
export type VerifyOtpOk   = { token: string; user: { id: string; email: string } }
