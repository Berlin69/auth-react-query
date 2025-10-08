import {z} from 'zod'

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter 6 digits'),
})
export type OtpForm = z.infer<typeof otpSchema>
