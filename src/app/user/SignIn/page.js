'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Navbar from '../../../Components/Navbar';

export default function SignIn() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle sign in logic
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      // Set cookie for middleware
      document.cookie = `token=${data.token}; path=/; max-age=604800`; // 7 days
      toast.success('Signed in successfully');
      // Dispatch custom event to notify navbar of auth change
      window.dispatchEvent(new CustomEvent('authChange'));
      router.push('/');
    } else {
      toast.error(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-gray-800">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Sign In
            </button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account? <Link href="/user/SignUp" className="text-blue-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}