'use client'

import { useState } from 'react'
import SmartSearch from './SmartSearch'

export default function Header() {
  const navItems = [
    { name: 'HOME', href: '/', active: true },
    { name: 'Bollywood', href: '/bollywood', count: 5 },
    { name: 'Hollywood', href: '/hollywood', count: 4 },
    { name: 'Dual Audio', href: '/dual-audio', count: 5 },
    { name: 'Telugu', href: '/telugu', count: 6 },
    { name: 'Tamil', href: '/tamil', count: 2 },
    { name: 'Tv Shows', href: '/tv-shows', count: 3 },
    { name: 'Genre', href: '/genre', count: 5 },
    { name: 'By Year', href: '/by-year', count: 10 },
  ]

  const handleSearch = (query: string, results: any[]) => {
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
            <div className="text-2xl font-bold text-green-400">
              VEG<span className="text-yellow-400">⚡</span>MOVIES
            </div>
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
              <a
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                } ${item.count ? 'relative' : ''}`}
              >
                {item.name}
                {item.count && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

