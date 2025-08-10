'use client'

import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { HeroSection } from '../components/home/HeroSection'
import { FeatureSection } from '../components/home/FeatureSection'
import { StatsSection } from '../components/home/StatsSection'
import { TestimonialSection } from '../components/home/TestimonialSection'
import { CTASection } from '../components/home/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeatureSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              How <span className="text-gradient">ZetaSocialFi</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the future of social gaming with cross-chain capabilities and AI-powered insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your wallet and join the cross-chain gaming ecosystem',
                icon: CurrencyDollarIcon,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02', 
                title: 'Play & Predict',
                description: 'Make price predictions, take quizzes, and engage with the community',
                icon: ChartBarIcon,
                color: 'from-green-500 to-emerald-500'
              },
              {
                step: '03',
                title: 'Earn Rewards',
                description: 'Get GUI tokens and NFT achievements for your activities',
                icon: TrophyIcon,
                color: 'from-purple-500 to-pink-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 text-center hover:border-primary-500/50 transition-all duration-300">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRightIcon className="h-6 w-6 text-primary-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />
      
      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Built on <span className="text-gradient">Cutting-Edge Technology</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powered by the most advanced blockchain and AI technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: 'ZetaChain', logo: '⚡', description: 'Universal Smart Contracts' },
              { name: 'Google AI', logo: '🤖', description: 'Gemini Integration' },
              { name: 'Ethereum', logo: '💎', description: 'Smart Contracts' },
              { name: 'Next.js', logo: '⚛️', description: 'React Framework' },
              { name: 'TypeScript', logo: '📘', description: 'Type Safety' },
              { name: 'Tailwind', logo: '🎨', description: 'CSS Framework' }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-dark-800/30 backdrop-blur-sm border border-dark-600 rounded-lg p-6 text-center hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{tech.logo}</div>
                <h4 className="font-semibold text-white mb-2">{tech.name}</h4>
                <p className="text-xs text-gray-400">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Development <span className="text-gradient">Roadmap</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our journey to revolutionize social gaming and DeFi
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"></div>
            
            <div className="space-y-12">
              {[
                {
                  phase: 'Q1 2024',
                  title: 'Platform Launch',
                  description: 'MVP release with basic GameFi features and social platform',
                  status: 'completed',
                  items: ['Price Prediction Game', 'Social Feed', 'Basic Rewards']
                },
                {
                  phase: 'Q2 2024', 
                  title: 'AI Integration',
                  description: 'Advanced AI features and cross-chain capabilities',
                  status: 'current',
                  items: ['Gemini AI Assistant', 'ZetaChain Integration', 'NFT Achievements']
                },
                {
                  phase: 'Q3 2024',
                  title: 'Advanced Features',
                  description: 'Enhanced gaming mechanics and DeFi integration',
                  status: 'upcoming',
                  items: ['Advanced Trading', 'Yield Farming', 'DAO Governance']
                },
                {
                  phase: 'Q4 2024',
                  title: 'Global Expansion',
                  description: 'Mobile app and international market expansion',
                  status: 'upcoming', 
                  items: ['Mobile App', 'Multi-language', 'Global Marketing']
                }
              ].map((roadmapItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 ${
                      roadmapItem.status === 'completed' ? 'border-green-500/50' :
                      roadmapItem.status === 'current' ? 'border-primary-500/50' :
                      'border-dark-600'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          roadmapItem.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          roadmapItem.status === 'current' ? 'bg-primary-500/20 text-primary-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {roadmapItem.phase}
                        </span>
                        {roadmapItem.status === 'completed' && (
                          <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{roadmapItem.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{roadmapItem.description}</p>
                      
                      <ul className="space-y-1">
                        {roadmapItem.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-xs text-gray-400 flex items-center">
                            <div className="w-1 h-1 bg-primary-400 rounded-full mr-2"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-dark-900"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
