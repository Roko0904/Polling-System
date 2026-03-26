import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage({ navigate }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
    const {url} = useAuth()
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Saare fields bharo')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords match nahi karde')
      return
    }
    if (form.password.length < 6) {
      setError('Password kam se kam 6 characters da hona chahida')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${url}api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      })
      login(res.data.user, res.data.token)
      navigate('home')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4ff]">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-1">Decisive</h1>
            <p className="text-gray-400 text-sm">Create an account to get started</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create Account</h2>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl mb-5">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Roshan Kumar"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && submit()}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300"
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition-colors text-sm shadow-sm shadow-indigo-200"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-400 mt-5">
              Already have a Acoount?{' '}
              <span
                onClick={() => navigate('login')}
                className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700"
              >
                Login
              </span>
            </p>
          </div>

          <p className="text-center text-xs text-gray-300 mt-6">
            <span onClick={() => navigate('home')} className="cursor-pointer hover:text-gray-400">
              ← Back to Home
            </span>
          </p>
        </div>
      </div>

      <footer className="border-t border-gray-100 bg-white w-full">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-bold text-gray-900">Decisive.</p>
          <p className="text-gray-400 text-xs">© 2024 DECISIVE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  )
}