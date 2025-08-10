'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ActivityFeed } from '../social/ActivityFeed'

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)
  const bellRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      console.log("EVENT" , event)
      console.log("BELL", bellRef)
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Search */}
          <div className="flex items-center flex-1 max-w-lg">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, posts, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div ref={bellRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setIsOpen( (prev) => !prev)}
              >
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </motion.button>

              {isOpen && (
                <ActivityFeed/>
              )}
            </div>

            {/* Wallet Connection */}
            {!isConnected ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => open()}
                className="btn-primary"
              >
                Connect Wallet
              </motion.button>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {address?.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-white">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/profile"
                          className={`${active ? 'bg-dark-700' : ''} flex items-center px-4 py-2 text-sm text-white`}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-2" />
                          Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/settings"
                          className={`${active ? 'bg-dark-700' : ''} flex items-center px-4 py-2 text-sm text-white`}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-2" />
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <div className="border-t border-dark-600 my-2"></div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => disconnect()}
                          className={`${active ? 'bg-dark-700' : ''} flex items-center w-full px-4 py-2 text-sm text-white`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                          Disconnect
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
