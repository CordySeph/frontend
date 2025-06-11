'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Unauthorized')
        }

        const data = await res.json()
        setUser(data)
      } catch (err: any) {
        setError(err.message)
        localStorage.removeItem('token')
        router.push('/login')
      }
    }

    fetchProfile()
  }, [router])

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>
  if (!user) return <p className="text-center mt-10">กำลังโหลดข้อมูลผู้ใช้...</p>

  return (
    <div className="max-w-md mx-auto mt-20 text-center p-4">
      <h1 className="text-2xl font-bold mb-4">ข้อมูลผู้ใช้</h1>
      <p><strong>ชื่อ:</strong> {user.name}</p>
      <p><strong>อีเมล:</strong> {user.email}</p>
    </div>
  )
}
