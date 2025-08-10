'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Social Feed', href: '/social', icon: UserGroupIcon },
  { name: 'GameFi', href: '/gamefi', icon: RocketLaunchIcon },
  { name: 'Predictions', href: '/predictions', icon: ChartBarIcon },
  { name: 'Quiz', href: '/quiz', icon: AcademicCapIcon },
  { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
  { name: 'AI Assistant', href: '/ai', icon: SparklesIcon },
  { name: 'Trading', href: '/trading', icon: CurrencyDollarIcon },
  { name: 'NFT Markets', href: '/nft', icon: BuildingStorefrontIcon },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-dark-800 border border-dark-600 rounded-lg text-white"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-dark-800/90 backdrop-blur-xl border-r border-dark-700 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-dark-700">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">ZetaSocialFi</h1>
                <p className="text-xs text-gray-400">Cross-Chain GameFi</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative
                      ${isActive 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' 
                        : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Bottom section - Premium Upgrade */}
          <div className="p-4 border-t border-dark-700">
            <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border border-primary-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Premium</p>
                  <p className="text-xs text-gray-400">Upgrade now</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-xs bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Get Premium
              </motion.button>
            </div>

            {/* User Stats Preview */}
            <div className="mt-4 text-center">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Rank</p>
                  <p className="text-white font-semibold">#247</p>
                </div>
                <div>
                  <p className="text-gray-400">Accuracy</p>
                  <p className="text-green-400 font-semibold">78%</p>
                </div>
                <div>
                  <p className="text-gray-400">GUI</p>
                  <p className="text-yellow-400 font-semibold">1,247</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
