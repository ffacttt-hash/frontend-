'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient, Movie } from '@/lib/api'
import { ArrowLeft, Calendar, Eye, Star } from 'lucide-react'

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      if (!params.id || typeof params.id !== 'string') return
      
      try {
        setLoading(true)
        const response = await apiClient.getMovieById(params.id)
        if (response.success) {
          setMovie(response.data)
        } else {
          setError(response.message || 'Failed to fetch movie details')
        }
      } catch (err) {
        setError('Failed to fetch movie details')
        console.error('Error fetching movie:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-700 rounded mb-6"></div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Movie not found'}</p>
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => router.push('/')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Vegamovies
            </button>
            <span className="text-gray-500">»</span>
            <span className="text-cyan-400">Dual Audio [Hindi-English] Movies</span>
            <span className="text-gray-500">»</span>
            <span className="text-gray-300 truncate">{movie.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Movie Poster */}
            <div className="mb-6">
              <div className="aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden">
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
                <div className={`w-full h-full flex items-center justify-center ${movie.posterUrl ? 'hidden' : ''}`}>
                  <span className="text-gray-500 text-sm">Movie Poster</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">RECENT POSTS</h3>
              <div className="space-y-3">
                {[
                  { title: "Ghost Project 2023 Hindi Dual Audio WEB-DL 720p - 480p - 1080p", color: "bg-red-600" },
                  { title: "Elio 2025 Hindi Dual Audio WEB-DL 720p - 480p - 1080p", color: "bg-green-600" },
                  { title: "Mission: Impossible – The Final Reckoning 2025", color: "bg-blue-600" },
                  { title: "Mahavatar Narsimha 2025 Hindi Dual Audio", color: "bg-orange-600" },
                  { title: "Baaghi 3 2020 Hindi WEB-DL 720p - 480p - 1080p", color: "bg-purple-600" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`w-8 h-6 ${item.color} rounded text-xs flex items-center justify-center font-bold text-white`}>
                      {40 + index}
                    </div>
                    <a href="#" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors line-clamp-2">
                      {item.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Movie Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              {movie.title}
            </h1>
            
            {/* Date */}
            <p className="text-gray-400 mb-4">
              {formatDate(movie.releaseDate || movie.createdAt)}
            </p>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">
                {movie.description || "Three young programmers come across an abandoned technology meant to detect supernatural presence. They reverse engineer the tech and create an app for their phones which allows them to see ghosts, thus endangering their own lives."}
              </p>
            </div>

            {/* Download Title */}
            <h2 className="text-xl font-bold mb-4 text-cyan-400">
              Download {movie.title} English 480p, 720p & 1080p ~ Vegamovies.ly
            </h2>

            {/* Social Share Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Share', 'Tweet', 'Share', 'Share', 'Share', 'Share'].map((action, index) => (
                <button key={index} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                  {action}
                </button>
              ))}
            </div>

            {/* Download Description */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300 text-sm leading-relaxed">
                ✅ Download {movie.title}! {movie.title.split(' ')[0]} ({new Date(movie.releaseDate || movie.createdAt).getFullYear()}) WEB-DL 720p - 480p - 1080p Full Movie 730MB - 270MB - 1.5GB Qualities. This is a <span className="text-red-400 font-semibold">Dual Audio [Hindi-English] Movies, Hollywood Movies, {movie.genres.join(', ')}</span> Movie and Available in <span className="text-red-400 font-semibold">Dual Audio (Hindi - English)</span> in 730MB - 270MB - 1.5GB in MKV Format. This is one of the best movie based on {movie.genres.join(', ')}. This Movie Is Now Available. Download Now!
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mt-3">
                <span className="text-cyan-400 font-semibold">Vegamovies.ly</span> is the best online platform for downloading <span className="text-cyan-400">Dual Audio [Hindi-English] Movies, Hollywood Movies, {movie.genres.join(', ')}</span>. We provide direct <span className="text-green-400 font-semibold">G-Drive</span> download link for fast and secure downloading. Click on the download button below and follow the steps to start download.
              </p>
            </div>

            {/* Watch Online Section */}
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              Watch {movie.title} Online
            </h3>

            {/* Movie Info Section */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Movie Info</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-yellow-400 font-semibold w-32">👉IMDb Rating:</span>
                    <span className="text-white">⭐ {movie.rating}/10</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Movie Name:</span>
                    <span className="text-white">{movie.title.split(' ')[0]} {movie.title.split(' ')[1]}</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Release Year:</span>
                    <span className="text-white">{new Date(movie.releaseDate || movie.createdAt).getFullYear()}</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Language:</span>
                    <span className="text-red-400 font-semibold">{movie.language}</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Size:</span>
                    <span className="text-white">730MB - 270MB - 1.5GB</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Format:</span>
                    <span className="text-white">MKV</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Runtime:</span>
                    <span className="text-white">1h 17m minutes</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Quality:</span>
                    <span className="text-red-400 font-semibold">WEB-DL 720p - 480p - 1080p</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Original language:</span>
                    <span className="text-white">En</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Genres:</span>
                    <span className="text-white">{movie.genres.join(', ')}</span>
                  </div>
                  <div className="flex">
                    <span className="text-white font-semibold w-32">Views:</span>
                    <span className="text-white">{movie.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Movie Synopsis */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Movie-SYNOPSIS/PLOT:</h3>
              <p className="text-gray-300 leading-relaxed">
                {movie.description || "Three young programmers come across an abandoned technology meant to detect supernatural presence. They reverse engineer the tech and create an app for their phones which allows them to see ghosts, thus endangering their own lives."}
              </p>
            </div>

            {/* Screenshots Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Screenshots: (Must See Before Downloading)...</h3>
              <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
                <span className="text-gray-500">Movie Screenshots</span>
              </div>
            </div>

            {/* Download Links Section */}
            <div className="mb-8">
              <h3 className="text-center text-xl font-semibold mb-6 text-cyan-400">
                —–== Download Links ==—–
              </h3>
              
              <div className="space-y-4">
                {movie.downloadLinks.map((link, index) => (
                  <div key={index} className="text-center">
                    <h4 className="text-lg font-semibold mb-2 text-red-400">{link.quality}</h4>
                    <button className="w-full max-w-md mx-auto block bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                      📥 CLICK HERE TO DOWNLOAD [{link.size}]
                    </button>
                  </div>
                ))}
              </div>

              {/* G-Direct Links */}
              <div className="mt-8">
                <h3 className="text-center text-xl font-semibold mb-6 text-cyan-400">
                  —–==⚡G-Direct [Instant]⚡==—–
                </h3>
                
                <div className="space-y-4">
                  {movie.downloadLinks.map((link, index) => (
                    <div key={index} className="text-center">
                      <h4 className="text-lg font-semibold mb-2 text-red-400">{link.quality}</h4>
                      <button className="w-full max-w-md mx-auto block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                        ⚡ G-DIRECT DOWNLOAD [{link.size}]
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm">
                If you find any broken link then please report <a href="#" className="text-cyan-400 hover:text-cyan-300">here</a>
              </p>
            </div>

            {/* Winding Up */}
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Winding Up ❤️</h3>
              <p className="text-gray-300">
                Thank You For Visiting <span className="text-cyan-400 font-semibold">Vegamovies.ly</span> The Perfect Spot For HD Dual Audio (Hindi-English) Movies & TV Series Download. So Please Keep Downloading & Keep Sharing. Enjoy!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

