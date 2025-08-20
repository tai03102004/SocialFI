'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon, MapPinIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

interface CreatePostProps {
  onCreatePost: (content: string) => Promise<boolean>
}

export function CreatePost({ onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  
  const { isConnected } = useAccount()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImage(acceptedFiles[0])
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsPosting(true)
    
    try {
      const success = await onCreatePost(content)
      if (success) {
        setContent('')
        setImage(null)
        toast.success('Post created on blockchain! 🎉')
      }
    } catch (error: any) {
      console.error('Failed to create post:', error)
      toast.error(error.message || 'Failed to create post')
    } finally {
      setIsPosting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 text-center">
        <h3 className="text-white font-medium mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 text-sm">Connect your wallet to create posts on the blockchain</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">🚀</span>
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your crypto insights with the community..."
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-lg"
              rows={3}
              maxLength={500}
            />
            
            {image && (
              <div className="relative mt-4">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="max-h-64 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-600">
          <div className="flex items-center space-x-4">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  isDragActive ? 'bg-primary-600' : 'hover:bg-dark-700'
                }`}
                disabled={isPosting}
              >
                <PhotoIcon className="h-5 w-5 text-primary-400" />
              </motion.button>
            </div>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              disabled={isPosting}
            >
              <FaceSmileIcon className="h-5 w-5 text-yellow-400" />
            </motion.button>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              disabled={isPosting}
            >
              <MapPinIcon className="h-5 w-5 text-green-400" />
            </motion.button>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-sm ${content.length > 450 ? 'text-red-400' : 'text-gray-400'}`}>
              {content.length}/500
            </span>
            
            <motion.button
              type="submit"
              disabled={!content.trim() || isPosting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors min-w-[120px]"
            >
              {isPosting ? '⛓️ Posting...' : '🚀 Post to Chain'}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}