
import { Suspense } from 'react'
import MovieGrid from '@/components/MovieGrid'

interface YearPageProps {
  params: { year: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function YearPage({ params, searchParams }: YearPageProps) {
  const year = params.year

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Movies from {year}</h1>
      <Suspense fallback={<div>Loading movies...</div>}>
        <MovieGrid searchParams={{ ...searchParams, year }} />
      </Suspense>
    </div>
  )
}


