'use client'

export default function GenreTags() {
  const genres = [
    { name: 'Dual Audio [Hindi] 720P', count: 17, color: 'bg-teal-600' },
    { name: 'Hollywood Movies 1080P', count: 18, color: 'bg-purple-600' },
    { name: 'Telugu', count: 19, color: 'bg-blue-600' },
    { name: 'Action', count: 20, color: 'bg-orange-600' },
    { name: 'Adventure', count: 21, color: 'bg-green-600' },
    { name: 'Animation', count: 22, color: 'bg-pink-600' },
    { name: 'Cartoon', count: 23, color: 'bg-yellow-600' },
    { name: 'Comedy', count: 24, color: 'bg-indigo-600' },
    { name: 'Crime', count: 25, color: 'bg-red-600' },
    { name: 'Documentary', count: 26, color: 'bg-gray-600' },
    { name: 'Drama', count: 27, color: 'bg-purple-700' },
    { name: 'Family', count: 28, color: 'bg-green-700' },
    { name: 'Fantasy', count: 29, color: 'bg-pink-700' },
    { name: 'History', count: 30, color: 'bg-yellow-700' },
    { name: 'Horror', count: 31, color: 'bg-red-700' },
    { name: 'Mystery', count: 32, color: 'bg-gray-700' },
    { name: 'Romance', count: 33, color: 'bg-rose-600' },
    { name: 'Thriller', count: 34, color: 'bg-slate-600' },
    { name: 'War', count: 35, color: 'bg-stone-600' },
    { name: 'Web Series', count: 36, color: 'bg-cyan-600' },
    { name: 'Tamil 720P', count: 37, color: 'bg-emerald-600' },
    { name: 'Pakistani', count: 38, color: 'bg-lime-600' },
    { name: 'Punjabi Movies 720P', count: 39, color: 'bg-amber-600' },
  ]

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre.name}
            className={`px-3 py-2 rounded text-xs font-medium text-white transition-all hover:opacity-90 ${genre.color}`}
          >
            {genre.name}
            <span className="ml-1 bg-black bg-opacity-30 px-1 py-0.5 rounded text-xs">
              {genre.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

