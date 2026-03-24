import { useState, useEffect } from 'react'
import axios from 'axios'
import PollCard from '../components/PollCard'

export default function HomePage({ navigate }) {
  const [polls, setPolls] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolls()
  }, [filter])

  const fetchPolls = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/polls?filter=${filter}`)
      setPolls(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const activePolls = polls.filter(p => new Date(p.expiresAt) > new Date())
  const expiredPolls = polls.filter(p => new Date(p.expiresAt) <= new Date())

  return (
    <div>
      {/* content Section */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-12 ">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
            Every Voice{' '}
            <span className="text-indigo-600">Counts.</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Make group decisions effortlessly. Create instant polls, gather real-time
            feedback, and reach a consensus in seconds.
          </p>
          <div className="flex">
          <button
            onClick={() => navigate('create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-12 py-3.5 rounded-full flex items-center gap-2 transition-colors shadow-sm shadow-indigo-200 text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Create New Poll
            </button>
             
          </div>
        </div>
      </div>

      {/* Polls Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Polls</h2>
            <p className="text-gray-400 text-sm mt-1">Discover what people are deciding right now.</p>
          </div>

          {/* Filter tabs */}
          <div className="flex bg-white border border-gray-100 rounded-full p-1 gap-1">
            {['all', 'active', 'expired'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Poll Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-16 mb-4" />
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded" />
                  <div className="h-2 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4"></div>
            <p className="text-gray-400 text-lg font-medium">No polls yet</p>
            <p className="text-gray-300 text-sm mt-1">Be the first to create one!</p>
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
              <PollCard key={p._id} poll={p} navigate={navigate} />
            ))}
            {/* Create custom poll card */}
            <div
              onClick={() => navigate('create')}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 flex flex-col items-center justify-center min-h-[180px] gap-3"
            >
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-300 hover:border-indigo-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700 text-sm">Create Custom Poll</p>
                <p className="text-gray-400 text-xs mt-0.5">Start your own decision thread in seconds.</p>
              </div>
            </div>
          </div>
        )}

        
         
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
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