
import { apiClient, Movie } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import MovieGrid from "@/components/MovieGrid"; // Import MovieGrid for related movies

export default async function MovieDetailPage({ params }) {
  const { slug } = params;

  const response = await apiClient.getMovieBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  const movie: Movie = response.data.data; // Access the movie object correctly

  const movieJsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.seo?.title || movie.title,
    "description": movie.seo?.description || movie.description,
    "image": movie.posterUrl ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${movie.posterUrl}` : undefined,
    "url": movie.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/movie/${movie.slug}`,
    "director": movie.crew?.filter(c => c.role === 'Director').map(d => ({ "@type": "Person", "name": d.name })) || undefined,
    "actor": movie.cast?.map(c => ({ "@type": "Person", "name": c.name })) || undefined,
    "datePublished": movie.releaseDate ? new Date(movie.releaseDate).toISOString().split("T")[0] : undefined,
    "genre": movie.genres || undefined,
    "trailer": movie.trailerUrl ? {
      "@type": "VideoObject",
      "name": `${movie.title} Trailer`,
      "description": `${movie.title} Official Trailer`,
      "uploadDate": movie.releaseDate ? new Date(movie.releaseDate).toISOString().split("T")[0] : undefined,
      "embedUrl": movie.trailerUrl,
    } : undefined,
    "aggregateRating": movie.rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "ratingCount": movie.views || 1, // Using views as a proxy for ratingCount if not available
    } : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": movie.title,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/movie/${movie.slug}`
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 relative">
          {movie.posterUrl && (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${movie.posterUrl}`}
              alt={movie.title}
              width={500}
              height={750}
              className="rounded-lg shadow-lg w-full"
              priority
            />
          )}
          {!movie.posterUrl && (
            <div className="w-full h-[750px] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
              No Poster Available
            </div>
          )}
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg text-gray-300 mb-4">{movie.description}</p>

          <div className="mb-4">
            <span className="text-yellow-500 font-bold text-xl">⭐ {movie.rating}/10</span>
            {movie.views && <span className="text-gray-400 ml-2">({movie.views} views)</span>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.categories?.map((category) => (
              <Link key={category} href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 cursor-pointer">
                  {category}
                </span>
              </Link>
            ))}
            {movie.genres?.map((genre) => (
              <Link key={genre} href={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700 cursor-pointer">
                  {genre}
                </span>
              </Link>
            ))}
            {movie.year && (
              <Link href={`/year/${movie.year}`}>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 cursor-pointer">
                  {movie.year}
                </span>
              </Link>
            )}
          </div>

          {movie.language && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-400">Language:</h3>
              <p>{movie.language}</p>
            </div>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-400">Cast:</h3>
              <p>{movie.cast.map(c => c.name).join(", ")}</p>
            </div>
          )}
          {movie.crew && movie.crew.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-400">Crew:</h3>
              <p>{movie.crew.map(c => `${c.name} (${c.role})`).join(", ")}</p>
            </div>
          )}

          {movie.trailerUrl && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-400 mb-2">Trailer:</h3>
              <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={movie.trailerUrl}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {movie.screenshots && movie.screenshots.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-400 mb-2">Screenshots:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {movie.screenshots.map((screenshot, index) => (
                  <Image
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${screenshot}`}
                    alt={`${movie.title} Screenshot ${index + 1}`}
                    width={400}
                    height={225}
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Download/External Links Panel */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-3">Download/External Links</h3>
            {movie.linksAvailable && movie.downloadLinks && movie.downloadLinks.length > 0 ? (
              <ul className="list-disc list-inside">
                {movie.downloadLinks.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}/go/${movie._id}?url=${encodeURIComponent(link.url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {link.quality} - {link.size}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Links currently unavailable.</p>
            )}
          </div>

          {/* Related Movies */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Related Movies</h3>
            <Suspense fallback={<div>Loading related movies...</div>}>
              <MovieGrid searchParams={{ genre: movie.genres?.[0], limit: "6" }} />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  );
}


