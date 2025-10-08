import type {ApiError} from './types'

export function mapApiErrorToUi(err: unknown): { common?: string; fields?: Record<string, string[]> } {
  const e = err as ApiError
  if (!e || typeof e !== 'object' || !('code' in e)) return {common: 'Unknown error'}

  switch (e.code) {
    case 'INVALID_CREDENTIALS':
      return {common: 'Invalid email or password'}
    case 'BLOCKED_USER':
      return {common: 'Account is blocked'}
    case 'EMAIL_NOT_VERIFIED':
      return {common: 'Please verify your email'}
    case 'RATE_LIMIT':
      return {common: 'Too many attempts. Try later'}
    case 'MAINTENANCE':
      return {common: 'Maintenance mode. Try later'}
    case 'SERVER_ERROR':
      return {common: 'Network or server error'}
    case 'VALIDATION_ERROR':
      return {fields: e.details ?? {}}
    case 'INVALID_OTP':
      return {common: 'Invalid code'}
    default:
      return {common: 'Unknown error'}
  }
}
