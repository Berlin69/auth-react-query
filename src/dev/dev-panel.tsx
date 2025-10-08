import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {useOtpStore} from '@/shared/store/otp'
import {Copy} from "lucide-react";
import {toast} from "sonner";

export function DevPanel() {
  const [open, setOpen] = useState(false)
  const expirySec = useOtpStore(s => s.expirySec)
  const setExpirySec = useOtpStore(s => s.setExpirySec)

  const handleCopyClick = async () => {
    const text = '123456'

    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Copy failed =[')
    }
  }

  return (
    <div className="absolute top-2 left-2 z-50">
      <Button type="button" onClick={() => setOpen(o => !o)} className="h-8 px-3 text-xs">
        Scenarios
      </Button>

      {open && (
        <div className="mt-2 w-[300px] rounded-md border bg-white p-3 text-xs shadow">
          <div className="mb-2 font-medium">Test scenarios</div>
          <ul className="list-disc ml-5 space-y-1">
            <li>Success → user@example.com / Password1!</li>
            <li>rate@user.com → 429 Too many attempts</li>
            <li>maint@user.com → 503 Maintenance</li>
            <li>blocked@user.com → 403 Blocked</li>
            <li>unverified@user.com → 403 Verify email</li>
            <li>422@user.com → 422 validation errors</li>
            <li>Anything else → 401 invalid credentials</li>
          </ul>

          <div className={'mt-5 flex items-center gap-2'}>
            OTP code:
            <span onClick={handleCopyClick} className={'p-1 rounded-sm bg-secondary flex items-center gap-2'}>
              123456 <Button variant={'ghost'} className={'!p-0 h-fit bg-transparent'}>
              <Copy size={16}/>
            </Button>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-2">
            <label className="text-[11px] tracking-wide">OTP expire (sec)</label>
            <Input
              type="number"
              min={5}
              max={300}
              value={expirySec}
              onChange={(e) => setExpirySec(Number(e.target.value))}
              className="h-8"
            />
          </div>
        </div>
      )}
    </div>
  )
}
