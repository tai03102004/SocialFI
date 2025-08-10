'use client'

import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  DocumentTextIcon,
  TrophyIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

const aiFeatures = [
  {
    icon: ChartBarIcon,
    title: 'Market Analysis',
    description: 'Get real-time market insights and sentiment analysis',
    prompt: 'Analyze the current crypto market and give me trading insights'
  },
  {
    icon: LightBulbIcon,
    title: 'Trading Strategy',
    description: 'Personalized trading strategies based on your performance',
    prompt: 'Generate a trading strategy suitable for my experience level'
  },
  {
    icon: DocumentTextIcon,
    title: 'Crypto Education',
    description: 'Learn complex crypto concepts explained simply',
    prompt: 'Explain DeFi protocols and how they work'
  },
  {
    icon: TrophyIcon,
    title: 'Performance Coach',
    description: 'Get tips to improve your prediction accuracy',
    prompt: 'How can I improve my prediction accuracy and performance?'
  },
  {
    icon: GiftIcon,
    title: 'Quest Generator',
    description: 'Get personalized daily quests and challenges',
    prompt: 'Generate a challenging daily quest for me'
  },
  {
    icon: SparklesIcon,
    title: 'Social Content',
    description: 'Create engaging posts for the community',
    prompt: 'Help me create an engaging post about today\'s market trends'
  }
]

interface AIFeaturesProps {
  onFeatureClick: (prompt: string) => void
}

export function AIFeatures({ onFeatureClick }: AIFeaturesProps) {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <SparklesIcon className="h-5 w-5 mr-2 text-primary-400" />
        AI Features
      </h3>

      <div className="space-y-3">
        {aiFeatures.map((feature, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFeatureClick(feature.prompt)}
            className="w-full text-left p-4 bg-dark-700/30 hover:bg-dark-600/50 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <SparklesIcon className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">Pro Tip</span>
        </div>
        <p className="text-xs text-purple-200">
          Ask specific questions to get more personalized and actionable advice from ZETA-AI!
        </p>
      </div>
    </div>
  )
}
