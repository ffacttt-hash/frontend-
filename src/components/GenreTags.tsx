
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface Genre {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

export default function GenreTags() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getGenres()
        if (response.success) {
          setGenres(response.data.map((genre: string) => ({ _id: genre, name: genre, slug: genre.toLowerCase().replace(/\s+/g, '-'), count: 0 }))) // Assuming count is not returned from API yet
        } else {
          setError(response.message || 'Failed to fetch genres')
        }
      } catch (err) {
        setError('Failed to fetch genres')
        console.error('Error fetching genres:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  const handleGenreClick = (slug: string) => {
    router.push(`/genre/${slug}`)
  }

  if (loading) {
    return <div className="mb-8">Loading genres...</div>
  }

  if (error) {
    return <div className="mb-8 text-red-400">Error: {error}</div>
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre._id}
            onClick={() => handleGenreClick(genre.slug)}
            className={`px-3 py-2 rounded text-xs font-medium text-white transition-all hover:opacity-90 bg-gray-700`}
          >
            {genre.name}
            {genre.count > 0 && (
              <span className="ml-1 bg-black bg-opacity-30 px-1 py-0.5 rounded text-xs">
                {genre.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

