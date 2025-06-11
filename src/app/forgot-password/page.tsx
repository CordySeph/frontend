'use client'

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || 'If the email exists, a reset link has been sent.')
        setEmail('')
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to send request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-gray-900 placeholder:text-gray-400">
        <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>

        {message && <div className="text-green-600 mb-3">{message}</div>}
        {error && <div className="text-red-600 mb-3">{error}</div>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-900 placeholder:text-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
