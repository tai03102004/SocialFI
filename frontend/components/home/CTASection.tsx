'use client'

import { motion } from 'framer-motion'
import { RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border border-primary-500/30 rounded-2xl p-12 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <SparklesIcon className="h-16 w-16 text-primary-400 mx-auto mb-6" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-gradient">Journey?</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the future of social gaming today. Connect your wallet, start playing, 
              and begin earning rewards in the most innovative GameFi platform.
            </p>
            
            <div className="flex-col sm:flex-row gap-4 justify-center items-center flex">
              <Link href="/gamefi">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4 min-w-[200px] flex"
                >
                  <RocketLaunchIcon className="h-6 w-6 mr-2" />
                  Get Started
                </motion.button>
              </Link>
              
              <Link href="/social">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-xl font-medium text-lg min-w-[200px] transition-all"
                >
                  Explore Community
                </motion.button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient mb-2">Free to Play</div>
                <div className="text-gray-400 text-sm">Start earning immediately</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient mb-2">Cross-Chain</div>
                <div className="text-gray-400 text-sm">Multi-blockchain support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient mb-2">AI-Powered</div>
                <div className="text-gray-400 text-sm">Smart insights & predictions</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
