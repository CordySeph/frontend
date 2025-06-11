'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <p className='mt-4 text-sm text-gray-500 text-center'>
            ลืมรหัสผ่าน? <a href="/forgot-password" className="text-blue-600 hover:underline">รีเซ็ตรหัสผ่าน</a>
        </p>
        <p className="mt-4 text-sm text-gray-500 text-center">
          ยังไม่มีบัญชี? <a href="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  );
}
