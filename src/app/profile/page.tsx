'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

// --- User Icon for the picture area ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

export default function WantedProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editableUser, setEditableUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch user data')
      const data = await res.json()
      setUser(data)
      setEditableUser(data)
    } catch (err: any) {
      setError(err.message)
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editableUser),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditableUser(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditableUser(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>
  if (!user) return (
    <div className="min-h-screen bg-[#f3e9d2] flex items-center justify-center">
      <p className={`text-4xl text-gray-700`}>Loading Profile...</p>
    </div>
  )

  return (
    <>
      <Head>
        <title>User Profile</title>
      </Head>
      <main className="min-h-screen bg-[#f3e9d2] flex flex-col items-center justify-center p-4 sm:p-8">
        <div className={`w-full max-w-lg  border-8 border-double border-[#a1824f] shadow-2xl p-8 text-center text-gray-800 relative transition-colors duration-300 ${isEditing ? 'bg-[#d4bfa4]' : 'bg-[#c8ad7f]'}`}>
          
          {isEditing && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md animate-pulse">
              EDIT MODE
            </div>
          )}

          <h1 className={`text-5xl sm:text-6xl font-bold tracking-wider mb-4`}>PROFILE</h1>
          
          <div className="w-4/5 h-64 mx-auto border-4 border-black bg-gray-300 p-2 shadow-inner mb-4">
            <div className="w-full h-full border-2 border-gray-500 bg-white flex items-center justify-center overflow-hidden">
                <UserIcon />
            </div>
          </div>

          {isEditing ? (
            <input 
              type="text" 
              name="name"
              value={editableUser.name || ''} 
              onChange={handleInputChange} 
              className={`text-4xl sm:text-5xl mb-2 w-full bg-transparent text-center border-b-2 border-dashed border-gray-700 focus:outline-none`}
            />
          ) : (
            <h2 className={`text-4xl sm:text-5xl mb-2 break-words`}>{user.name || 'Nameless'}</h2>
          )}
          
          <div className="text-2xl font-bold mb-6 break-all px-4">
            {user.id}
          </div>

          <div className="text-left space-y-2 border-t-4 border-dashed border-gray-700 pt-4">
            {Object.entries(user)
              .filter(([key]) => !['id', 'name'].includes(key))
              .map(([key, value]) => {
                if (isEditing && key === 'phoneNumber') {
                  return (
                     <div key={key} className="flex justify-between items-center">
                        <p className="font-bold capitalize text-lg">{key.replace(/_/g, ' ')}:</p>
                        <input 
                          type="text" 
                          name="phoneNumber"
                          value={editableUser.phoneNumber || ''} 
                          onChange={handleInputChange} 
                          className="w-1/2 bg-transparent text-right border-b-2 border-dashed border-gray-700 focus:outline-none"
                        />
                      </div>
                  )
                }
                return (
                  <div key={key} className="flex justify-between items-baseline">
                    <p className="font-bold capitalize text-lg">{key.replace(/_/g, ' ')}:</p>
                    <p className="text-right break-all">{String(value)}</p>
                  </div>
                )
            })}
          </div>

        </div>
        <div className="flex gap-4 mt-8">
          {isEditing ? (
            <>
              <button onClick={handleSave} className={`py-2 px-8 bg-green-800 text-white rounded-lg border-2 border-green-900 hover:bg-green-700 transition text-xl`}>Save</button>
              <button onClick={handleCancel} className={`py-2 px-8 bg-gray-700 text-white rounded-lg border-2 border-gray-800 hover:bg-gray-600 transition text-xl`}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className={`py-2 px-8 bg-blue-800 text-white rounded-lg border-2 border-blue-900 hover:bg-blue-700 transition text-xl`}>Edit</button>
              <button onClick={handleLogout} className={`py-2 px-8 bg-red-800 text-white rounded-lg border-2 border-red-900 hover:bg-red-700 transition text-xl`}>Logout</button>
            </>
          )}
        </div>
      </main>
    </>
  )
}