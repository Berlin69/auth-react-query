import type {ApiError, LoginBody, LoginOk, VerifyOtpBody, VerifyOtpOk} from './types'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
const okCreds = {email: 'user@example.com', password: 'Password1!'}
const okOtp = '123456'

function apiErr(status: number, code: ApiError['code'], details?: ApiError['details']): ApiError {
  const e = new Error(code) as ApiError
  e.status = status
  e.code = code
  e.details = details
  return e
}

export async function mockLogin(body: LoginBody): Promise<LoginOk> {
  await delay(600)
  if (!navigator.onLine) throw apiErr(0, 'SERVER_ERROR')

  if (body.email === 'rate@user.com') throw apiErr(429, 'RATE_LIMIT')
  if (body.email === 'maint@user.com') throw apiErr(503, 'MAINTENANCE')
  if (body.email === 'blocked@user.com') throw apiErr(403, 'BLOCKED_USER')
  if (body.email === 'unverified@user.com') throw apiErr(403, 'EMAIL_NOT_VERIFIED')
  if (body.email === '422@user.com') {
    throw apiErr(422, 'VALIDATION_ERROR', {
      email: ['Invalid email format'],
      password: ['Password is too short'],
    })
  }
  if (body.email !== okCreds.email || body.password !== okCreds.password) {
    throw apiErr(401, 'INVALID_CREDENTIALS')
  }
  return {tempToken: 'temp.jwt.token', requiresOtp: true}
}

export async function mockVerifyOtp(body: VerifyOtpBody): Promise<VerifyOtpOk> {
  await delay(500)
  if (!navigator.onLine) throw apiErr(0, 'SERVER_ERROR')
  if (body.tempToken !== 'temp.jwt.token') throw apiErr(401, 'INVALID_CREDENTIALS')
  if (body.code !== okOtp) throw apiErr(400, 'INVALID_OTP')

  return {token: 'final.jwt.token', user: {id: 'u_1', email: 'user@example.com'}}
}

export async function mockResendOtp(tempToken: string): Promise<{ tempToken: string }> {
  await new Promise(res => setTimeout(res, 400))
  // В демо токен не меняю — "сброс таймера" на фронте
  return {tempToken}
}