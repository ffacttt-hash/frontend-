'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, Movie } from '@/lib/api'

interface MovieGridProps {
  searchParams?: {
    q?: string
    category?: string
    genre?: string
    year?: string
    sort?: string
    page?: string
    limit?: string
  }
}

export default function MovieGrid({ searchParams = {} }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getMovies({
          page: parseInt(searchParams.page || '1'),
          limit: parseInt(searchParams.limit || '12'),
          category: searchParams.category,
          genre: searchParams.genre,
          year: searchParams.year,
          q: searchParams.q,
          sort: searchParams.sort
        })
        
        if (response.success) {
          setMovies(response.data.movies)
          setPagination(response.data.pagination)
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
  }, [searchParams])

  const handleMovieClick = (movie: Movie) => {
    // Use slug if available, otherwise fall back to ID
    const identifier = movie.slug || movie._id
    router.push(`/movie/${identifier}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: parseInt(searchParams.limit || '12') }).map((_, index) => (
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

  if (movies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No movies found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {movies.map((movie, index) => (
          <div
            key={movie._id}
            onClick={() => handleMovieClick(movie)}
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-200 cursor-pointer group hover:scale-105 hover:shadow-lg"
          >
            <div className="relative">
              <div className="aspect-[3/4] bg-gray-700 flex items-center justify-center overflow-hidden">
                {movie.posterUrl ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${movie.posterUrl}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <span className={`text-gray-500 text-sm ${movie.posterUrl ? 'hidden' : ''}`}>Movie Poster</span>
              </div>
              
              {/* Rating badge */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                ⭐ {movie.rating || 0}
              </div>
              
              {/* Year badge */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {movie.year || new Date(movie.releaseDate || movie.createdAt).getFullYear()}
              </div>
              
              {/* Featured badge */}
              {movie.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                  FEATURED
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                {movie.title}
              </h3>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>{movie.language}</span>
                <span>{movie.views || 0} views</span>
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
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          {pagination.hasPrevPage && (
            <button
              onClick={() => {
                const newParams = new URLSearchParams(window.location.search)
                newParams.set('page', (pagination.currentPage - 1).toString())
                router.push(`${window.location.pathname}?${newParams.toString()}`)
              }}
              className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Previous
            </button>
          )}
          
          <span className="text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          {pagination.hasNextPage && (
            <button
              onClick={() => {
                const newParams = new URLSearchParams(window.location.search)
                newParams.set('page', (pagination.currentPage + 1).toString())
                router.push(`${window.location.pathname}?${newParams.toString()}`)
              }}
              className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  )
}

