import {create} from 'zustand'

type OtpStore = {
  expirySec: number
  startedAt: number | null
  setExpirySec: (n: number) => void
  start: () => void
  reset: () => void
}

export const useOtpStore = create<OtpStore>((set) => ({
  expirySec: 20,
  startedAt: null,

  setExpirySec: (n) => set({
    expirySec: Math.max(5, Math.min(300, Math.floor(Number.isFinite(n) ? n : 20)))
  }),
  start: () => set({startedAt: Date.now()}),
  reset: () => set({startedAt: Date.now()}),
}))
