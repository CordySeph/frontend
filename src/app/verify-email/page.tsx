'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState('กำลังตรวจสอบ...')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('ไม่พบ token สำหรับการยืนยันอีเมล')
      setMessage('')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`)

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Verification failed')
        }

        setMessage('ยืนยันอีเมลสำเร็จแล้ว! กำลังพาไปหน้าเข้าสู่ระบบ...')
        setTimeout(() => router.push('/login'), 3000)
      } catch (err: any) {
        setError(err.message)
        setMessage('')
      }
    }

    verify()
  }, [searchParams, router])

  return (
    <div className="max-w-md mx-auto mt-20 text-center p-4">
      {message && <p className="text-green-600 font-medium">{message}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </div>
  )
}
