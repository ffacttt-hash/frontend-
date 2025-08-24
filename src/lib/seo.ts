import { Metadata } from 'next'

export interface MovieSEOData {
  title: string
  description: string
  year?: number
  rating?: number
  genres?: string[]
  categories?: string[]
  posterUrl?: string
  backdropUrl?: string
  slug: string
  cast?: Array<{ name: string; character?: string }>
  crew?: Array<{ name: string; role: string }>
  releaseDate?: string
  language?: string
  duration?: number
}

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
}

export function generateMovieMetadata(movie: MovieSEOData, config?: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
  
  const title = config?.title || `${movie.title} (${movie.year || 'N/A'}) - Watch Online | VegaMovies`
  const description = config?.description || 
    `Watch ${movie.title} ${movie.year ? `(${movie.year})` : ''} online on VegaMovies. ${movie.description || ''} ${movie.genres?.length ? `Genres: ${movie.genres.join(', ')}.` : ''} ${movie.rating ? `Rating: ${movie.rating}/10.` : ''}`
  
  const keywords = config?.keywords || [
    movie.title,
    ...(movie.genres || []),
    ...(movie.categories || []),
    ...(movie.cast?.slice(0, 5).map(c => c.name) || []),
    'watch online',
    'movie',
    'streaming',
    movie.year?.toString() || '',
    movie.language || ''
  ].filter(Boolean)

  const movieUrl = `${baseUrl}/movie/${movie.slug}`
  const posterImage = movie.posterUrl ? `${apiBaseUrl}${movie.posterUrl}` : `${baseUrl}/og-image.jpg`
  const backdropImage = movie.backdropUrl ? `${apiBaseUrl}${movie.backdropUrl}` : posterImage

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'VegaMovies Team' }],
    creator: 'VegaMovies',
    publisher: 'VegaMovies',
    alternates: {
      canonical: config?.canonicalUrl || movieUrl,
    },
    robots: config?.noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: 'video.movie',
      title,
      description,
      url: movieUrl,
      siteName: 'VegaMovies',
      images: [
        {
          url: config?.ogImage || backdropImage,
          width: 1200,
          height: 630,
          alt: `${movie.title} poster`,
        },
        {
          url: posterImage,
          width: 500,
          height: 750,
          alt: `${movie.title} poster`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: config?.twitterCard || 'summary_large_image',
      title,
      description,
      images: [config?.ogImage || backdropImage],
      creator: '@vegamovies',
    },
  }
}

export function generateCategoryMetadata(category: string, config?: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const title = config?.title || `${category} Movies - Watch Online | VegaMovies`
  const description = config?.description || 
    `Discover and watch the best ${category} movies online on VegaMovies. Browse our extensive collection of ${category} films with detailed information, ratings, and reviews.`
  
  const keywords = config?.keywords || [
    category,
    `${category} movies`,
    'watch online',
    'streaming',
    'movie database',
    'film collection'
  ]

  const categoryUrl = `${baseUrl}/category/${category.toLowerCase().replace(/\s+/g, '-')}`

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'VegaMovies Team' }],
    alternates: {
      canonical: config?.canonicalUrl || categoryUrl,
    },
    robots: config?.noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: 'website',
      title,
      description,
      url: categoryUrl,
      siteName: 'VegaMovies',
      images: [
        {
          url: config?.ogImage || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${category} movies on VegaMovies`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [config?.ogImage || `${baseUrl}/og-image.jpg`],
    },
  }
}

export function generateGenreMetadata(genre: string, config?: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const title = config?.title || `${genre} Movies - Watch Online | VegaMovies`
  const description = config?.description || 
    `Explore ${genre} movies on VegaMovies. Watch the latest and classic ${genre} films online with comprehensive information, cast details, and user ratings.`
  
  const keywords = config?.keywords || [
    genre,
    `${genre} movies`,
    `${genre} films`,
    'watch online',
    'streaming',
    'movie genre'
  ]

  const genreUrl = `${baseUrl}/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'VegaMovies Team' }],
    alternates: {
      canonical: config?.canonicalUrl || genreUrl,
    },
    robots: config?.noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: 'website',
      title,
      description,
      url: genreUrl,
      siteName: 'VegaMovies',
      images: [
        {
          url: config?.ogImage || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${genre} movies on VegaMovies`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [config?.ogImage || `${baseUrl}/og-image.jpg`],
    },
  }
}

export function generateYearMetadata(year: number, config?: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const title = config?.title || `${year} Movies - Watch Online | VegaMovies`
  const description = config?.description || 
    `Watch ${year} movies online on VegaMovies. Discover the best films released in ${year} with detailed information, cast, crew, and user reviews.`
  
  const keywords = config?.keywords || [
    `${year} movies`,
    `${year} films`,
    `movies ${year}`,
    'watch online',
    'streaming',
    'movie year'
  ]

  const yearUrl = `${baseUrl}/year/${year}`

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'VegaMovies Team' }],
    alternates: {
      canonical: config?.canonicalUrl || yearUrl,
    },
    robots: config?.noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: 'website',
      title,
      description,
      url: yearUrl,
      siteName: 'VegaMovies',
      images: [
        {
          url: config?.ogImage || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${year} movies on VegaMovies`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [config?.ogImage || `${baseUrl}/og-image.jpg`],
    },
  }
}

export function generateMovieJsonLd(movie: MovieSEOData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
  
  const movieUrl = `${baseUrl}/movie/${movie.slug}`
  const posterImage = movie.posterUrl ? `${apiBaseUrl}${movie.posterUrl}` : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    url: movieUrl,
    description: movie.description,
    ...(movie.year && { datePublished: `${movie.year}-01-01` }),
    ...(movie.releaseDate && { datePublished: movie.releaseDate }),
    ...(posterImage && { image: posterImage }),
    ...(movie.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: movie.rating,
        ratingCount: 1,
        bestRating: 10,
        worstRating: 0,
      },
    }),
    ...(movie.genres?.length && {
      genre: movie.genres,
    }),
    ...(movie.language && { inLanguage: movie.language }),
    ...(movie.duration && { duration: `PT${movie.duration}M` }),
    ...(movie.cast?.length && {
      actor: movie.cast.map(actor => ({
        '@type': 'Person',
        name: actor.name,
        ...(actor.character && { characterName: actor.character }),
      })),
    }),
    ...(movie.crew?.length && {
      director: movie.crew
        .filter(member => member.role.toLowerCase().includes('director'))
        .map(director => ({
          '@type': 'Person',
          name: director.name,
        })),
    }),
    publisher: {
      '@type': 'Organization',
      name: 'VegaMovies',
      url: baseUrl,
    },
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.url,
      })),
    ],
  }
}

export function generateItemListJsonLd(
  movies: MovieSEOData[],
  listName: string,
  listUrl: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl,
    numberOfItems: movies.length,
    itemListElement: movies.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        url: `${baseUrl}/movie/${movie.slug}`,
        ...(movie.posterUrl && { image: `${apiBaseUrl}${movie.posterUrl}` }),
        ...(movie.year && { datePublished: `${movie.year}-01-01` }),
        ...(movie.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: movie.rating,
            bestRating: 10,
          },
        }),
      },
    })),
  }
}

export function generateWebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VegaMovies',
    url: baseUrl,
    description: 'Discover comprehensive movie information, reviews, ratings, and detailed insights on VegaMovies.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/browse?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VegaMovies',
      url: baseUrl,
    },
  }
}

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VegaMovies',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Your ultimate destination for movie discovery and entertainment information.',
    sameAs: [
      // Add social media URLs here
    ],
  }
}

