import { useState, useEffect } from 'react';
import axios from 'axios';
import PollCard from './PollCard';

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchPolls = async () => {
    const res = await axios.get(`http://localhost:5000/api/polls?filter=${filter}`);
    setPolls(res.data);
  };

  useEffect(() => { fetchPolls(); }, [filter]);

  const filters = ['all', 'active', 'expired'];

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              filter === f
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-500'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Poll Cards */}
      {polls.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🗳️</p>
          <p className="text-sm">No polls found. Create one above!</p>
        </div>
      ) : (
        polls.map(p => <PollCard key={p._id} poll={p} onVote={fetchPolls} />)
      )}
    </div>
  );
}