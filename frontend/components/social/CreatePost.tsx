'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon, MapPinIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface CreatePostProps {
  onCreatePost: (post: any) => void
}

export function CreatePost({ onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)

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

    setIsPosting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newPost = {
        id: Date.now(),
        author: '0x1234...5678',
        username: 'You',
        avatar: '/api/placeholder/40/40',
        content,
        image: image ? URL.createObjectURL(image) : null,
        timestamp: 'now',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        chainId: 1,
      }

      onCreatePost(newPost)
      setContent('')
      setImage(null)
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsPosting(false)
    }
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
            <span className="text-sm font-semibold text-white">Y</span>
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in the crypto world?"
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-lg"
              rows={3}
              maxLength={280}
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
              >
                <PhotoIcon className="h-5 w-5 text-primary-400" />
              </motion.button>
            </div>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <FaceSmileIcon className="h-5 w-5 text-yellow-400" />
            </motion.button>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <MapPinIcon className="h-5 w-5 text-green-400" />
            </motion.button>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-sm ${content.length > 250 ? 'text-red-400' : 'text-gray-400'}`}>
              {content.length}/280
            </span>
            
            <motion.button
              type="submit"
              disabled={!content.trim() || isPosting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
