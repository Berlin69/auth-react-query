import {useEffect, useState} from 'react'
import {useOtpStore} from '@/shared/store/otp'

export function useOtpCountdown() {
  const {startedAt, expirySec} = useOtpStore()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0
  const left = Math.max(0, (expirySec ?? 0) - elapsed)
  const expired = startedAt != null && left <= 0
  return {left, expired}
}
