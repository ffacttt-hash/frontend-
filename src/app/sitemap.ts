
import { MetadataRoute } from 'next'
import { apiClient } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  try {
    // Fetch movies for dynamic routes
    const moviesResponse = await apiClient.getMovies({ limit: 1000 })
    const movieRoutes: MetadataRoute.Sitemap = []
    
    if (moviesResponse.success) {
      moviesResponse.data.movies.forEach((movie: any) => {
        movieRoutes.push({
          url: `${baseUrl}/movie/${movie.slug || movie._id}`,
          lastModified: new Date(movie.updatedAt || movie.createdAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      })
    }

    // Fetch categories for dynamic routes
    const categoriesResponse = await apiClient.getCategories()
    const categoryRoutes: MetadataRoute.Sitemap = []
    
    if (categoriesResponse.success) {
      categoriesResponse.data.forEach((category: string) => {
        categoryRoutes.push({
          url: `${baseUrl}/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    }

    // Fetch genres for dynamic routes
    const genresResponse = await apiClient.getGenres()
    const genreRoutes: MetadataRoute.Sitemap = []
    
    if (genresResponse.success) {
      genresResponse.data.forEach((genre: string) => {
        genreRoutes.push({
          url: `${baseUrl}/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    }

    // Year routes (last 25 years)
    const currentYear = new Date().getFullYear()
    const yearRoutes: MetadataRoute.Sitemap = []
    
    for (let year = currentYear; year >= currentYear - 25; year--) {
      yearRoutes.push({
        url: `${baseUrl}/year/${year}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }

    return [...staticRoutes, ...movieRoutes, ...categoryRoutes, ...genreRoutes, ...yearRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}


