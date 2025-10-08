import {useState} from 'react'
import './App.css'
import {AppQueryProvider} from "@/shared/lib/query.tsx";
import {LoginForm} from "@/features/auth/login-form.tsx";
import {OtpForm} from "@/features/auth/otp-form.tsx";
import {DevPanel} from "@/dev/dev-panel.tsx";
import {Toaster} from "sonner";

export function App() {
  const [tempToken, setTempToken] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)

  return (
    <AppQueryProvider>
      <main className="relative min-h-screen grid place-items-center p-6 bg-[#f5f5f5]">
        <DevPanel/>
        <div className="w-full max-w-[440px]">
          {!tempToken && !isDone && (
            <LoginForm onSuccess={(t) => setTempToken(t)}/>
          )}

          {tempToken && !isDone && (
            <OtpForm
              tempToken={tempToken}
              onBack={() => setTempToken(null)}
              onDone={() => setIsDone(true)}
            />
          )}

          {isDone && (
            <div className="grid gap-2 bg-white p-8 rounded-sm">
              <h1 className="text-2xl text-center">You are signed in</h1>
              <p className="text-sm text-gray-600 text-center">Demo completed.</p>
            </div>
          )}
        </div>
      </main>
      <Toaster position={'top-center'}/>
    </AppQueryProvider>
  )
}
