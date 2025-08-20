'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  HeartIcon, 
  ChatBubbleOvalLeftIcon, 
  ArrowPathIcon, 
  ShareIcon,
  EllipsisHorizontalIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface PostCardProps {
  post: {
    id: number
    author: string
    username: string
    avatar: string
    content: string
    image?: string | null
    timestamp: string
    likes: number
    comments: number
    shares: number
    liked: boolean
    chainId: number
    aiSentimentScore?: number
    isAIGenerated?: boolean
  }
  onLike: (postId: number) => void
}

const chainNames = {
  1: 'Ethereum',
  56: 'BSC',
  137: 'Polygon',
  7001: 'ZetaChain'
}

const chainColors = {
  1: 'bg-blue-500',
  56: 'bg-yellow-500',
  137: 'bg-purple-500',
  7001: 'bg-green-500'
}

const getSentimentColor = (score: number) => {
  if (score >= 7) return 'text-green-400'
  if (score >= 4) return 'text-yellow-400'
  return 'text-red-400'
}

const getSentimentEmoji = (score: number) => {
  if (score >= 8) return '😍'
  if (score >= 6) return '😊'
  if (score >= 4) return '😐'
  if (score >= 2) return '😔'
  return '😱'
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    try {
      await onLike(post.id)
    } catch (error) {
      console.error('Failed to like post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 hover:border-dark-500 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {post.username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-white">{post.username}</h4>
              <div className={`w-2 h-2 rounded-full ${chainColors[post.chainId as keyof typeof chainColors]}`}></div>
              <span className="text-xs text-gray-400">
                {chainNames[post.chainId as keyof typeof chainNames]}
              </span>
              {post.isAIGenerated && (
                <div className="flex items-center space-x-1">
                  <SparklesIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-purple-400">AI</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400">{post.author}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{post.timestamp}</span>
          <button className="p-1 hover:bg-dark-700 rounded-full transition-colors">
            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{post.content}</p>
        
        {post.image && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt="Post image"
              width={500}
              height={300}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* AI Sentiment Score */}
        {typeof post.aiSentimentScore === 'number' && (
          <div className="mt-3 flex items-center space-x-2 text-sm">
            <span className="text-gray-400">AI Sentiment:</span>
            <span className={getSentimentColor(post.aiSentimentScore)}>
              {getSentimentEmoji(post.aiSentimentScore)} {post.aiSentimentScore}/10
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-600">
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-2 transition-colors ${
              post.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            } ${isLiking ? 'opacity-50' : ''}`}
          >
            {post.liked ? (
              <HeartIconSolid className="h-5 w-5" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{post.likes}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ChatBubbleOvalLeftIcon className="h-5 w-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span className="text-sm font-medium">{post.shares}</span>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-primary-400 transition-colors"
        >
          <ShareIcon className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-dark-600"
        >
          <div className="space-y-3">
            {/* Comment input */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">Y</span>
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* Sample comments */}
            <div className="text-sm text-gray-400 ml-11">
              Comments coming soon! 💬
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}