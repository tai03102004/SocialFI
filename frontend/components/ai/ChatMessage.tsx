'use client'

import { motion } from 'framer-motion'
import { SparklesIcon, UserIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex space-x-3 max-w-4xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.isUser 
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }`}>
          {message.isUser ? (
            <UserIcon className="h-5 w-5 text-white" />
          ) : (
            <SparklesIcon className="h-5 w-5 text-white" />
          )}
        </div>
        
        <div className={`rounded-2xl px-4 py-3 ${
          message.isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-dark-700 text-gray-100'
        }`}>
          {message.isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <ReactMarkdown 
              components={{
                p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({children}) => <li className="mb-1">{children}</li>,
                strong: ({children}) => <strong className="font-semibold text-primary-300">{children}</strong>,
                code: ({children}) => <code className="bg-dark-600 px-1 py-0.5 rounded text-xs">{children}</code>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
          <p className={`text-xs mt-2 ${
            message.isUser ? 'text-primary-200' : 'text-gray-400'
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
