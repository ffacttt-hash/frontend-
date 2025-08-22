'use client'

import { useState } from 'react'

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState('BOLLYWOOD MOVIES')

  const tabs = [
    { name: 'BOLLYWOOD MOVIES', count: 13, color: 'bg-green-600' },
    { name: 'DUAL AUDIO CONTENT', count: 14, color: 'bg-red-600' },
    { name: 'HOLLYWOOD MOVIES', count: 15, color: 'bg-orange-500' },
    { name: 'JOIN OUR TELEGRAM', count: 16, color: 'bg-blue-500' },
  ]

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-6 py-3 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 ${
              activeTab === tab.name ? tab.color : 'bg-gray-700'
            }`}
          >
            {tab.name}
            <span className="ml-2 bg-black bg-opacity-30 px-2 py-1 rounded text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

