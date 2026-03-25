import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function PollDetailPage({ poll: initialPoll, navigate, onVote }) {
  const { token, isLoggedIn } = useAuth()
  const [poll, setPoll] = useState(initialPoll)
  const [voted, setVoted] = useState(false)
  const [voting, setVoting] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')

  const isActive = poll && new Date(poll.expiresAt) > new Date()
  const totalVotes = poll ? poll.options.reduce((s, o) => s + o.votes, 0) : 0
  const winner = !isActive && poll && [...poll.options].sort((a, b) => b.votes - a.votes)[0]

   

   useEffect(() => {
  if (!poll) return

  const update = () => {
    const diff = new Date(poll.expiresAt) - new Date()
    if (diff <= 0) {
      setTimeLeft('Ended')
      return
    }
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
  }

  update()
  const interval = setInterval(update, 1000)
  return () => clearInterval(interval)
}, [poll])

  const castVote = async () => {
    if (!isLoggedIn) {
      alert('please login first!')
      navigate('login')
      return
    }
    if (selectedOption === null || !isActive || voted) return
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '{}')
    if (votedPolls[poll._id] !== undefined) {
      alert('already voted!')
      setVoted(true)
      return
    }
    setVoting(selectedOption)
    try {
      const res = await axios.post(`http://localhost:5000/api/polls/${poll._id}/vote`, {
        optionIndex: selectedOption
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      votedPolls[poll._id] = selectedOption
      localStorage.setItem('votedPolls', JSON.stringify(votedPolls))
      setPoll(res.data)
      setVoted(true)
      onVote()
    } catch (err) {
      alert(err.response?.data?.error || 'Error voting')
    }
    setVoting(null)
  }

  if (!poll) return null
const timeParts = timeLeft ? timeLeft.split(':') : []
  

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4ff]">
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-indigo-600 mb-8 transition-colors font-semibold uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-3xl border border-gray-100 p-7">
              <div className="flex justify-end mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-500'}`}>
                  {isActive ? 'ACTIVE' : 'EXPIRED'}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  D
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Decision Maker</p>
                  <p className="text-xs text-gray-400">Created recently</p>
                </div>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-6 leading-snug">
                {poll.question}
              </h1>

              {isActive && !voted ? (
                <div className="space-y-3 mb-6">
                  {poll.options.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedOption(i)}
                      className={`border-2 rounded-xl px-5 py-3.5 cursor-pointer transition-all duration-150 ${
                        selectedOption === i
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-800">{opt.text}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {(voted || !isActive) && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Real-time Results</h3>
                  <div className="flex justify-end">
                    <span className="text-indigo-600 text-xs font-semibold">{totalVotes} TOTAL VOTES</span>
                  </div>
                  {[...poll.options].map((opt, i) => {
                    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
                    const isWinner = winner && opt.text === winner.text
                    const isMyVote = voted && selectedOption === i
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{opt.text}</span>
                            {isWinner && (
                              <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">WINNING</span>
                            )}
                            {isMyVote && (
                              <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">Your Vote</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-indigo-600">{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${isWinner ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {isActive && !voted && (
                <button
                  onClick={castVote}
                  disabled={selectedOption === null || voting !== null}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-2xl transition-colors text-sm shadow-sm shadow-indigo-200"
                >
                  {voting !== null ? 'Casting vote...' : 'Cast Vote'}
                </button>
              )}

              {!isLoggedIn && isActive && (
                <p className="text-amber-500 text-sm font-medium mt-3">
                   If you want to vote, please login  !
                </p>
              )}

              {voted && (
                <p className="text-green-600 font-semibold text-sm flex items-center gap-2">
                   Vote cast successfully!
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              {isActive ? (
                <>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">Time Remaining</p>
                  <div className="flex items-end gap-3">
                    {timeParts.map((t, i) => (
                      <div key={i} className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{t}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                          {['Hours', 'Mins', 'Secs'][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-lg"></span>
                    <p className="text-xs text-gray-500">Get notified when this poll concludes.</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-red-500 font-bold text-lg">Poll Ended</p>
                  <p className="text-gray-400 text-xs mt-1">Voting is now closed</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <p className="text-sm font-bold text-gray-800 mb-4">Poll Statistics</p>
              <div className="space-y-3">
                {[
                  { label: 'Total Votes', value: totalVotes },
                  { label: 'Options', value: poll.options.length },
                  { label: 'Status', value: isActive ? 'Active' : 'Expired' }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <span className="text-sm font-semibold text-gray-800">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-6 text-white">
              <p className="font-bold text-base mb-1">Create Your Own</p>
              <p className="text-indigo-200 text-xs mb-4">Need a quick decision? Launch a poll in seconds.</p>
              <button
                onClick={() => navigate('create')}
                className="w-full bg-white text-indigo-600 font-semibold py-2.5 rounded-2xl text-sm hover:bg-indigo-50 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
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