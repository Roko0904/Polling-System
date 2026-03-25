import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatePollPage from './pages/CreatePollPage'
import PollDetailPage from "./pages/PollCardDetail"
import MyPollsPage from './pages/MypollsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'


function AppContent() {
  const { isLoggedIn } = useAuth()
  const [page, setPage] = useState('home')
  const [selectedPoll, setSelectedPoll] = useState(null)
  const [refresh, setRefresh] = useState(0)

  const navigate = (p, poll = null) => {
    console.log("Navigating:", p, poll)

    
    if ((p === 'create' || p === 'mypolls') && !isLoggedIn) {
      setPage('login')
      return
    }

    setPage(p)

    if (p === 'poll') {
      if (poll) {
        setSelectedPoll(poll)
      } else {
        alert("Please select a poll first!")
        setPage('home')
      }
    } else {
      setSelectedPoll(null)
    }

    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-[#f5f4ff] font-sans">
      <Navbar navigate={navigate} currentPage={page} />

      {page === 'home' && (
        <HomePage navigate={navigate} key={refresh} />
      )}
      {page === 'create' && (
        <CreatePollPage
          navigate={navigate}
          onCreated={() => {
            setRefresh(r => r + 1)
            navigate('home')
          }}
        />
      )}
      {page === 'mypolls' && (
        <MyPollsPage navigate={navigate} key={refresh} />
      )}
      {page === 'poll' && selectedPoll && (
        <PollDetailPage
          poll={selectedPoll}
          navigate={navigate}
          onVote={() => setRefresh(r => r + 1)}
        />
      )}
      {page === 'login' && <LoginPage navigate={navigate} />}
      {page === 'register' && <RegisterPage navigate={navigate} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}