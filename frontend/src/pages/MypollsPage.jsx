import { useState, useEffect } from 'react'
import axios from 'axios'
import PollCard from '../components/PollCard'
import { MdOutlineFindInPage } from "react-icons/md";
import { useAuth } from '../context/AuthContext'

export default function MyPollsPage({ navigate }) {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/polls')
      setPolls(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

const deletePoll = async (id, e) => {
  e.stopPropagation()
  if (!confirm('Are you you want dlt thus pole?')) return
  try {
    await axios.delete(`http://localhost:5000/api/polls/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchPolls()
  } catch (err) {
    console.log('Delete error:', err.response?.data)
    alert(err.response?.data?.error || 'Delete failed')
  }
}

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4ff]">
      <div className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Polls</h1>
            <p className="text-gray-400 text-sm mt-1">Manage and track all your polls</p>
          </div>
          <button
            onClick={() => navigate('create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Poll
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Polls', value: polls.length, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Active', value: polls.filter(p => new Date(p.expiresAt) > new Date()).length, color: 'bg-green-50 text-green-600' },
            { label: 'Expired', value: polls.filter(p => new Date(p.expiresAt) <= new Date()).length, color: 'bg-red-50 text-red-500' }
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-5`}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium mt-1 opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-16 mb-4" />
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-6" />
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded" />
                  <div className="h-2 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 justify-center text-center" > </div>
            <p className="text-gray-400 text-lg font-medium">No polls yet</p>
            <button
              onClick={() => navigate('create')}
              className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Create Poll
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls.map(p => (
              <div key={p._id} className="relative group">
                <PollCard poll={p} navigate={navigate} />
                <button
                  onClick={(e) => deletePoll(p._id, e)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 w-7 h-7 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-200 z-10"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      <footer className="border-t border-gray-100 bg-white w-full">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <p className="font-bold text-gray-900 text-lg">Decisive.</p>
            <p className="text-gray-400 text-xs mt-1">© 2024 DECISIVE. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex gap-8 text-xs text-gray-400 font-medium uppercase tracking-wide">
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-600 cursor-pointer">Contact Support</span>
            <span className="hover:text-gray-600 cursor-pointer">API Docs</span>
          </div>
        </div>
      </footer>
    </div>
  )
}