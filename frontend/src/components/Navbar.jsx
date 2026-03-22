export default function Navbar({ navigate, currentPage }) {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="text-3xl font-bold text-indigo-600 cursor-pointer tracking-tight"
          onClick={() => navigate('home')}
        >
          Decisive
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <span
            onClick={() => navigate('home')}
            className={`cursor-pointer transition-colors ${currentPage === 'home' ? 'text-gray-900 border-b-2 border-indigo-500 pb-0.5' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Home
          </span>
          <span
            onClick={() => navigate('mypolls')}
            className={`cursor-pointer transition-colors ${
              currentPage === 'mypolls'
                ? 'text-gray-900 border-b-2 border-indigo-500 pb-0.5'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            My Polls
          </span>
<span
  onClick={() => navigate('poll')}
  className={`cursor-pointer transition-colors ${
    currentPage === 'poll'
      ? 'text-gray-900 border-b-2 border-indigo-500 pb-0.5'
      : 'text-gray-400 hover:text-gray-700'
  }`}
>
  Poll Details
</span>
          <span
            onClick={() => navigate('create')}
            className={`cursor-pointer transition-colors ${currentPage === 'create' ? 'text-gray-900 border-b-2 border-indigo-500 pb-0.5' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Create Poll
          </span>
        </div>

         
      </div>
    </nav>
  )
}