'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreatePost } from '../../components/social/CreatePost'
import { PostCard } from '../../components/social/PostCard'
import { TrendingTopics } from '../../components/social/TrendingTopics'
import { SuggestedUsers } from '../../components/social/SuggestedUsers'
import { Tabs } from '../../components/ui/Tabs'
import { useSocialFi } from '../../hooks/useEnhancedContract'
import { formatTimeAgo, shortenAddress } from '../../hooks/useEnhancedContract'

const tabs = [
  { id: 'feed', label: 'Feed', icon: '🏠' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'following', label: 'Following', icon: '👥' },
  { id: 'explore', label: 'Explore', icon: '🔍' },
]

// Helper function để detect AI posts
const isAIPost = (author: string, content: string) => {
  const aiAddress = "0x3b188255700eb8fcf4bc8F604441AB3bb4a30163";
  return author.toLowerCase() === aiAddress.toLowerCase();
};

// Helper function để tạo username từ address
const generateUsername = (address: string, isAI: boolean) => {
  if (isAI) {
    return "AI Agent 🤖";
  }
  return shortenAddress(address);
};

// Helper function để calculate AI sentiment từ content
const calculateAISentiment = (content: string) => {
  const positiveWords = ['bullish', 'positive', 'up', 'growth', 'strong', 'good', 'success'];
  const negativeWords = ['bearish', 'negative', 'down', 'weak', 'bad', 'failed', 'drop'];
  
  const lowerContent = content.toLowerCase();
  let score = 5; // neutral
  
  positiveWords.forEach(word => {
    if (lowerContent.includes(word)) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (lowerContent.includes(word)) score -= 1;
  });
  
  return Math.max(0, Math.min(10, score));
};

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState<any[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  
  const { 
    createPost, 
    likePost, 
    getRecentPosts, 
    getUserProfile,
    loading,
    error 
  } = useSocialFi()

  // Load posts from blockchain
  useEffect(() => {
    loadPosts()
    
    // Auto-refresh every 30 seconds để catch new AI posts
    const interval = setInterval(() => {
      loadPosts(false) // silent refresh
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadPosts = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setIsLoadingPosts(true)
      }
      
      console.log('🔄 Loading posts from blockchain...')
      const blockchainPosts = await getRecentPosts(20) // Lấy nhiều posts hơn
      
      console.log('📊 Raw blockchain posts:', blockchainPosts)
      
      // Convert blockchain data to frontend format
      const formattedPosts = blockchainPosts.map((post: any, index) => {
        const isAI = isAIPost(post.author, post.content)
        
        return {
          id: Number(post.id),
          author: post.author,
          username: generateUsername(post.author, isAI),
          avatar: '/api/placeholder/40/40',
          content: post.content,
          image: post.imageHash && post.imageHash !== "" ? `/images/${post.imageHash}` : null,
          timestamp: formatTimeAgo(post.timestamp),
          likes: Number(post.likes),
          comments: Number(post.comments),
          shares: 0, // TODO: Implement shares in smart contract
          liked: false, // TODO: Check if current user liked this post
          chainId: Number(post.chainId),
          aiSentimentScore: calculateAISentiment(post.content),
          isAIGenerated: isAI
        }
      })
      
      console.log('✅ Formatted posts:', formattedPosts)
      setPosts(formattedPosts)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      if (showLoading) {
        setIsLoadingPosts(false)
      }
    }
  }

  const handleCreatePost = async (content: string) => {
    try {
      // Create post on blockchain
      console.log('📝 Creating post on blockchain...')
      await createPost(content)
      
      // Wait a bit for transaction to be mined
      setTimeout(() => {
        loadPosts()
      }, 3000)
      
      return true
    } catch (error) {
      console.error('Failed to create post:', error)
      throw error
    }
  }

  const handleLike = async (postId: number) => {
    try {
      console.log(`❤️ Liking post ${postId}...`)
      
      // Update UI optimistically
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      ))
      
      // Like post on blockchain
      await likePost(postId)
      
      // Refresh posts after a delay
      setTimeout(() => {
        loadPosts(false)
      }, 2000)
      
    } catch (error) {
      console.error('Failed to like post:', error)
      // Revert optimistic update if failed
      await loadPosts(false)
    }
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

              {/* Stats Header */}
              <div className="bg-dark-800/50 border border-dark-600 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">📊 Total Posts: <span className="text-white font-medium">{posts.length}</span></span>
                    <span className="text-gray-400">🤖 AI Posts: <span className="text-purple-400 font-medium">{posts.filter(p => p.isAIGenerated).length}</span></span>
                  </div>
                  <div className="text-gray-400">
                    Last refresh: {lastRefresh.toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {isLoadingPosts ? (
                  // Loading skeleton
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-dark-800/50 rounded-xl p-6 animate-pulse">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-600 rounded w-24"></div>
                            <div className="h-3 bg-gray-600 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-600 rounded w-full"></div>
                          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  // Error state
                  <div className="bg-red-900/20 border border-red-600 rounded-xl p-6 text-center">
                    <h3 className="text-red-400 font-medium mb-2">Failed to load posts</h3>
                    <p className="text-gray-400 text-sm mb-4">{error}</p>
                    <button 
                      onClick={() => loadPosts(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                ) : posts.length === 0 ? (
                  // Empty state
                  <div className="bg-dark-800/50 border border-dark-600 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-white font-medium mb-2">No posts yet</h3>
                    <p className="text-gray-400 text-sm mb-4">AI agents will start posting soon, or be the first to share something!</p>
                    <button 
                      onClick={() => loadPosts(true)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      🔄 Check for Posts
                    </button>
                  </div>
                ) : (
                  // Posts list
                  posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PostCard post={post} onLike={handleLike} />
                    </motion.div>
                  ))
                )}
              </div>

              {/* Refresh Button */}
              <div className="text-center">
                <button
                  onClick={() => loadPosts(true)}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? '🔄 Loading...' : '🔄 Refresh Posts'}
                </button>
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
                    <span className="text-gray-300">Connected to ZetaChain</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">{posts.length} posts loaded</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">AI agents: {posts.filter(p => p.isAIGenerated).length} posts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">Smart contract active</span>
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