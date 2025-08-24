
import { Suspense } => from 'react'
import MovieGrid from '@/components/MovieGrid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient } from '@/lib/api'

interface BrowsePageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const categoriesResponse = await apiClient.getCategories()
  const genresResponse = await apiClient.getGenres()

  const categories = categoriesResponse.success ? categoriesResponse.data : []
  const genres = genresResponse.success ? genresResponse.data : []

  const currentQuery = searchParams.q || ''
  const currentCategory = searchParams.category || ''
  const currentGenre = searchParams.genre || ''
  const currentYear = searchParams.year || ''
  const currentSort = searchParams.sort || 'createdAt'

  const years = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => (2025 - i).toString())

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Browse Movies</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or description..."
            defaultValue={currentQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newParams = new URLSearchParams(window.location.search)
                if (e.currentTarget.value) {
                  newParams.set('q', e.currentTarget.value)
                } else {
                  newParams.delete('q')
                }
                window.location.search = newParams.toString()
              }
            }}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) => {
              const newParams = new URLSearchParams(window.location.search)
              if (value) {
                newParams.set('category', value)
              } else {
                newParams.delete('category')
              }
              window.location.search = newParams.toString()
            }}
            defaultValue={currentCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select
            onValueChange={(value) => {
              const newParams = new URLSearchParams(window.location.search)
              if (value) {
                newParams.set('genre', value)
              } else {
                newParams.delete('genre')
              }
              window.location.search = newParams.toString()
            }}
            defaultValue={currentGenre}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              {genres.map((gen: string) => (
                <SelectItem key={gen} value={gen}>
                  {gen}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <Select
            onValueChange={(value) => {
              const newParams = new URLSearchParams(window.location.search)
              if (value) {
                newParams.set('year', value)
              } else {
                newParams.delete('year')
              }
              window.location.search = newParams.toString()
            }}
            defaultValue={currentYear}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Years</SelectItem>
              {years.map((yr: string) => (
                <SelectItem key={yr} value={yr}>
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sort">Sort By</Label>
          <Select
            onValueChange={(value) => {
              const newParams = new URLSearchParams(window.location.search)
              newParams.set('sort', value)
              window.location.search = newParams.toString()
            }}
            defaultValue={currentSort}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Recently Added</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Suspense fallback={<div>Loading movies...</div>}>
        <MovieGrid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}


