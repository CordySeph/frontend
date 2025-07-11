'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editableUser, setEditableUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user data');
      }

      const data = await res.json();
      setUser(data);
      setEditableUser(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

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

  if (!user) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading user profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center mb-4">
              <UserIcon />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{user.name || 'Welcome'}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <input type="text" name="name" value={editableUser.name || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                  <input type="text" name="phoneNumber" value={editableUser.phoneNumber || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {/* Add other editable fields as needed */}
              </>
            ) : (
              <>
                {Object.entries(user)
                  .filter(([key]) => key !== 'id') // Exclude the 'id' field from display
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-800 bg-gray-100 px-3 py-1 rounded-md text-sm">{String(value)}</span>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex gap-4">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Save Changes</button>
              <button onClick={handleCancel} className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Edit Profile</button>
          )}
        </div>
         <div className="p-6 bg-gray-50 border-t">
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Logout
            </button>
        </div>
      </div>
    </div>
  )
}
