import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
 

export default function CreatePollPage({ navigate, onCreated }) {
  const { token } = useAuth()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [expiry, setExpiry] = useState('')
  const [loading, setLoading] = useState(false)
    const {url} = useAuth()
  

  const addOption = () => options.length < 4 && setOptions([...options, ''])
  const removeOption = (i) => options.length > 2 && setOptions(options.filter((_, idx) => idx !== i))
  const updateOption = (i, val) => {
    const arr = [...options]
    arr[i] = val
    setOptions(arr)
  }

  const submit = async () => {
    if (!question.trim() || options.filter(Boolean).length < 2 || !expiry) {
      alert('please fill all field!')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${url}/api/polls`, {
        question,
        options: options.filter(Boolean),
        expiresAt: new Date(expiry).toISOString()
      },{
       headers: { Authorization: `Bearer ${token}` } 
      })
      onCreated()
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating poll')
    }
    setLoading(false)
  }

  return (
   <> <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 mb-8 transition-colors font-medium uppercase tracking-wide"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Feed
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create a Poll</h1>
        <p className="text-gray-400 text-sm mb-8">Ask a question and let others decide.</p>

        {/* Question */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Question</label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="What should we decide today?"
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none placeholder-gray-300"
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Options</label>
          <div className="space-y-2.5">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </div>
                <input
                  value={opt}
                  onChange={e => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-300"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="w-7 h-7 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 4 && (
            <button
              onClick={addOption}
              className="mt-3 text-indigo-500 hover:text-indigo-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add option
            </button>
          )}
        </div>

        {/* Expiry */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Poll Expiry</label>
          <input
            type="datetime-local"
            value={expiry}

            onChange={e => setExpiry(e.target.value)}
            min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm shadow-sm shadow-indigo-200"
        >
          {loading ? 'Creating poll...' : 'Launch Poll '}
        </button>
      </div>
         
        
    </div>
     <footer className="border-t border-gray-100 bg-white w-full mt-12">
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
    </>
  )
}