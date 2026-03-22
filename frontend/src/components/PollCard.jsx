export default function PollCard({ poll, navigate }) {
  const now = new Date()
  const isActive = new Date(poll.expiresAt) > now
  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0)
  const winner = !isActive && [...poll.options].sort((a, b) => b.votes - a.votes)[0]

  const getTimeLeft = () => {
    const diff = new Date(poll.expiresAt) - now
    if (diff <= 0) return null
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h}h ${m}m`
  }

  const timeLeft = getTimeLeft()

  return (
    <div
      onClick={() => navigate('poll', poll)}
      className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-500'}`}>
          {isActive ? 'ACTIVE' : 'EXPIRED'}
        </span>
        {isActive && timeLeft && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ends in {timeLeft}
          </span>
        )}
        {!isActive && (
          <span className="text-xs text-gray-400">Ended</span>
        )}
      </div>

      {/* Question */}
      <h3 className="font-semibold text-gray-800 text-base mb-4 leading-snug line-clamp-2">
        {poll.question}
      </h3>

      {/* Options with bars */}
      <div className="space-y-2 mb-4">
        {poll.options.map((opt, i) => {
          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
          const isWinner = winner && opt.text === winner.text
          return (
            <div key={i}>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className={isWinner ? 'text-indigo-600 font-medium' : ''}>{opt.text}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">{totalVotes} Votes</span>
        <button className="p-1.5 text-gray-300 hover:text-indigo-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  )
}