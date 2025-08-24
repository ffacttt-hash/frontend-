'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SmartSearch from './SmartSearch'

export default function Header() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'HOME', href: '/', active: pathname === '/' },
    { name: 'Movies', href: '/movies', active: pathname === '/movies' },
    { name: 'Admin', href: '/admin', active: pathname.startsWith('/admin') },
    { name: 'Login', href: '/login', active: pathname === '/login' },
    { name: 'Register', href: '/register', active: pathname === '/register' },
  ]

  const handleSearch = (query: string, results: unknown[]) => {
    console.log('Search performed:', query, results);
    // Handle search results here
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      {/* Top Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
              VEG<span className="text-yellow-400">⚡</span>MOVIES
            </Link>
          </div>

          {/* Smart Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SmartSearch 
              onSearch={handleSearch}
              placeholder="Search movies, actors, directors..."
              showFilters={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

