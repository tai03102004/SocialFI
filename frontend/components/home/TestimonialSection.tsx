'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Crypto Trader',
    content: 'ZetaSocialFi has revolutionized how I approach crypto trading. The AI insights are incredibly accurate, and earning while socializing makes it even better!',
    rating: 5,
    avatar: '🚀'
  },
  {
    name: 'Sarah Johnson',
    role: 'GameFi Enthusiast',
    content: 'The cross-chain capabilities are amazing! I can trade and earn across different blockchains seamlessly. The NFT achievements keep me motivated.',
    rating: 5,
    avatar: '💎'
  },
  {
    name: 'Mike Rodriguez',
    role: 'DeFi Investor',
    content: 'Best platform for combining social interaction with trading. The prediction games are addictive and the rewards are real. Highly recommended!',
    rating: 5,
    avatar: '🏆'
  }
]

export function TestimonialSection() {
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
            What Our <span className="text-gradient">Community Says</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied users who are already earning and playing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
