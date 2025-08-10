'use client'

import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const features = [
  {
    icon: ChartBarIcon,
    title: 'Price Predictions',
    description: 'Make crypto price predictions and earn rewards for accuracy. AI-powered insights help you make better forecasts.',
    color: 'from-blue-500 to-cyan-500',
    href: '/predictions'
  },
  {
    icon: UserGroupIcon,
    title: 'Social Gaming',
    description: 'Connect with fellow traders and gamers. Share insights, celebrate wins, and build your reputation.',
    color: 'from-purple-500 to-pink-500',
    href: '/social'
  },
  {
    icon: SparklesIcon,
    title: 'AI Assistant',
    description: 'Get personalized trading strategies and market analysis powered by Google Gemini AI technology.',
    color: 'from-green-500 to-emerald-500',
    href: '/ai'
  },
  {
    icon: TrophyIcon,
    title: 'NFT Achievements',
    description: 'Unlock unique NFT achievements as you progress. Show off your skills and build your digital identity.',
    color: 'from-yellow-500 to-orange-500',
    href: '/achievements'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Cross-Chain Trading',
    description: 'Trade across multiple blockchains seamlessly with ZetaChain Universal Smart Contracts.',
    color: 'from-indigo-500 to-purple-500',
    href: '/trading'
  },
  {
    icon: ArrowPathIcon,
    title: 'Real-time Rewards',
    description: 'Earn GUI tokens instantly for every activity. The more you engage, the more you earn.',
    color: 'from-red-500 to-pink-500',
    href: '/gamefi'
  }
]

export function FeatureSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why Choose <span className="text-gradient">ZetaSocialFi</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of social gaming with cutting-edge features 
            designed for the modern crypto enthusiast
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={feature.href}>
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300 cursor-pointer h-full">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-primary-400 hover:text-primary-300 transition-colors">
                    <span className="text-sm font-medium mr-2">Learn more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
