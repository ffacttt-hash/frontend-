
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

export default function CategoryTabs() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCategories()
        if (response.success) {
          setCategories(response.data.map((cat: string) => ({ _id: cat, name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-'), count: 0 }))) // Assuming count is not returned from API yet
        } else {
          setError(response.message || 'Failed to fetch categories')
        }
      } catch (err) {
        setError('Failed to fetch categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`)
  }

  if (loading) {
    return <div className="mb-6">Loading categories...</div>
  }

  if (error) {
    return <div className="mb-6 text-red-400">Error: {error}</div>
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`px-6 py-3 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 bg-gray-700`}
          >
            {category.name}
            {category.count > 0 && (
              <span className="ml-2 bg-black bg-opacity-30 px-2 py-1 rounded text-xs">
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

