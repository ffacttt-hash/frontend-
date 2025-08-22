'use client'

import { useState, useEffect } from 'react'
import { apiClient, Movie } from '@/lib/api'

export default function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getMovies({ limit: 12 })
        if (response.success) {
          setMovies(response.data.movies)
        } else {
          setError(response.message || 'Failed to fetch movies')
        }
      } catch (err) {
        setError('Failed to fetch movies')
        console.error('Error fetching movies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-gray-700"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {movies.map((movie, index) => (
        <div
          key={movie._id}
          className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer group"
        >
          <div className="relative">
            <div className="aspect-[3/4] bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Movie Poster</span>
            </div>
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {40 + index * 2}
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {new Date(movie.releaseDate || movie.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            {movie.featured && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                FEATURED
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
              {movie.title}
            </h3>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>{movie.language}</span>
              <span>⭐ {movie.rating}/10</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {movie.categories.slice(0, 2).map((category) => (
                <span key={category} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

