'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreatePost } from '../../components/social/CreatePost'
import { PostCard } from '../../components/social/PostCard'
import { TrendingTopics } from '../../components/social/TrendingTopics'
import { SuggestedUsers } from '../../components/social/SuggestedUsers'
import { Tabs } from '../../components/ui/Tabs'

const mockPosts = [
  {
    id: 1,
    author: '0x1234...5678',
    username: 'CryptoTrader',
    avatar: '/api/placeholder/40/40',
    content: 'Just made a successful prediction on BTC! 🚀 The AI assistant really helped with market analysis.',
    image: null,
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3,
    liked: false,
    chainId: 1,
  },
  {
    id: 2,
    author: '0x9876...4321',
    username: 'GameFiMaster',
    avatar: '/api/placeholder/40/40',
    content: 'New NFT achievement unlocked! "Oracle" badge for 80% prediction accuracy 🏆',
    image: '/images/MVB.jpeg',
    timestamp: '4 hours ago',
    likes: 56,
    comments: 15,
    shares: 12,
    liked: true,
    chainId: 56,
  },
]

const tabs = [
  { id: 'feed', label: 'Feed', icon: '🏠' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'following', label: 'Following', icon: '👥' },
  { id: 'explore', label: 'Explore', icon: '🔍' },
]

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState(mockPosts)

  const handleCreatePost = (newPost: any) => {
    setPosts([newPost, ...posts])
  }

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <TrendingTopics />
            <SuggestedUsers />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Create Post */}
              <CreatePost onCreatePost={handleCreatePost} />

              {/* Tabs */}
              <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard post={post} onLike={handleLike} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Live Activity</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">1,247 users online</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">32 active predictions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">8 NFTs minted today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
