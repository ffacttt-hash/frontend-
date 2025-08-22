import Header from '@/components/Header'
import MovieGrid from '@/components/MovieGrid'
import CategoryTabs from '@/components/CategoryTabs'
import GenreTags from '@/components/GenreTags'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <CategoryTabs />
        <GenreTags />
        <MovieGrid />
      </main>
    </div>
  )
}
