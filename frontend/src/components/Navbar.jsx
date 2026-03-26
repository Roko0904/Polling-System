import { useAuth } from '../context/AuthContext'
import { IoReorderThree } from "react-icons/io5";

export default function Navbar({ navigate, currentPage }) {
  const { user, logout, isLoggedIn } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('home')
  }

  return (
    <>
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 cursor-pointer tracking-tight"
          onClick={() => navigate('home')}
        >
          Decisive
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 xl:gap-8 text-sm font-medium">
          <span
            onClick={() => navigate('home')}
            className={`cursor-pointer transition-colors ${currentPage === 'home' ? 'text-gray-900 border-b-2 border-indigo-500 pb-1' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Home
          </span>
          <span
            onClick={() => navigate('mypolls')}
            className={`cursor-pointer transition-colors ${currentPage === 'mypolls' ? 'text-gray-900 border-b-2 border-indigo-500 pb-1' : 'text-gray-400 hover:text-gray-700'}`}
          >
            My Polls
          </span>
          <span
            onClick={() => navigate('create')}
            className={`cursor-pointer transition-colors ${currentPage === 'create' ? 'text-gray-900 border-b-2 border-indigo-500 pb-1' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Create Poll
          </span>
        </div>

        {/* Mobile Icon */}

        {/* Auth Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs sm:text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-500 text-xs sm:text-sm font-medium px-2 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('login')}
                className="text-gray-500 hover:text-indigo-600 text-xs sm:text-sm font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-colors"
              >
                Register
              </button>
            </>
          )}
        </div>

          {/* <div className="md:hidden text-2xl sm:text-3xl text-gray-600">
          <IoReorderThree />
        </div> */}

      </div>

        
    </nav>

      <div className="md:hidden justify-around my-3 flex items-center gap-5 xl:gap-8 text-sm font-medium">
          <span
            onClick={() => navigate('home')}
            className={`cursor-pointer transition-colors ${currentPage === 'home' ? 'text-gray-900 border-b-2 border-indigo-500 pb-1' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Home
          </span>
          <span
            onClick={() => navigate('mypolls')}
            className={`cursor-pointer transition-colors ${currentPage === 'mypolls' ? 'text-gray-900 border-b-2 border-indigo-500 pb-1' : 'text-gray-400 hover:text-gray-700'}`}
          >
            My Polls
          </span>
          <span
            onClick={() => navigate('create')}
            className={`cursor-pointer transition-colors ${currentPage === 'create' ? 'text-gray-900 border-b-2 border-indigo-500 pb-1' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Create Poll
          </span>
        </div>
    </>
    

    
  )
}