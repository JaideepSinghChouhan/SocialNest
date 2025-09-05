import React from 'react'

const RightSidebar = () => {
  return (
    <aside className="hidden lg:block space-y-6">
            {/* Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Your upcoming events</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Garden BBQ</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">City Council Vote</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Town Hall</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Post-punk Festival</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Maybe Boring Stand-up</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yabonue Tour 2023</p>
                    <p className="text-xs text-gray-500">Sat 16 June, Tom's Garden</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Community Chats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Community chats</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🐶</div>
                  <span className="text-sm text-gray-700">Dog Lovers</span>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🇩🇰</div>
                  <span className="text-sm text-gray-700">Copenhagen friends</span>
                </li>
                <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">🚗</div>
                  <span className="text-sm text-gray-700">Y2K Car owners</span>
                </li>
              </ul>
            </div>
          </aside>
  )
}

export default RightSidebar
