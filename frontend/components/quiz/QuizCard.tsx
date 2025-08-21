'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Quiz {
  id: number
  questions: Question[]
  difficulty: string
  category: string
  timeLimit: number
}

interface QuizCardProps {
  quiz: Quiz
  onComplete: (results: any) => void
}

export function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  const [showResults, setShowResults] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleQuizComplete()
    }
  }, [timeLeft, showResults])

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    setIsAnswered(true)

    // Auto advance after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setIsAnswered(false)
      } else {
        handleQuizComplete()
      }
    }, 1500)
  }

  const handleQuizComplete = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === quiz.questions[index]?.correctAnswer
    ).length

    const results = {
      score: correctAnswers,
      total: quiz.questions.length,
      percentage: Math.round((correctAnswers / quiz.questions.length) * 100),
      reward: calculateReward(correctAnswers, quiz.questions.length, quiz.difficulty),
      answers: selectedAnswers,
      timeSpent: quiz.timeLimit - timeLeft
    }

    setShowResults(true)
    setTimeout(() => onComplete(results), 3000)
  }

  const calculateReward = (correct: number, total: number, difficulty: string) => {
    const baseReward = difficulty === 'hard' ? 100 : difficulty === 'medium' ? 50 : 25
    const percentage = correct / total
    return Math.floor(baseReward * percentage)
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === quiz.questions[index]?.correctAnswer
    ).length
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 max-w-md w-full text-center"
        >
          <div className="mb-6">
            {percentage >= 80 ? (
              <div className="text-6xl mb-4">🎉</div>
            ) : percentage >= 60 ? (
              <div className="text-6xl mb-4">👍</div>
            ) : (
              <div className="text-6xl mb-4">📚</div>
            )}
            
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-gray-400">Great job on completing the quiz</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Your Score</p>
              <p className="text-3xl font-bold text-green-400">{correctAnswers}/{quiz.questions.length}</p>
              <p className="text-sm text-gray-400">{percentage}% Accuracy</p>
            </div>

            <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Reward Earned</p>
              <p className="text-2xl font-bold text-yellow-400">
                +{calculateReward(correctAnswers, quiz.questions.length, quiz.difficulty)} GUI
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Submitting results to blockchain...
          </div>
        </motion.div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">
                {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)} Quiz
              </h1>
              <p className="text-sm text-gray-400 capitalize">{quiz.difficulty} Level</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-yellow-400">
              <ClockIcon className="h-5 w-5" />
              <span className="font-mono font-bold">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {currentQuestion + 1} / {quiz.questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-dark-600 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index
              const isCorrect = index === question.correctAnswer
              const showAnswer = isAnswered

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    isAnswered 
                      ? isSelected
                        ? isCorrect
                          ? 'border-green-500 bg-green-500/20 text-green-300'
                          : 'border-red-500 bg-red-500/20 text-red-300'
                        : isCorrect
                          ? 'border-green-500 bg-green-500/10 text-green-300'
                          : 'border-dark-600 bg-dark-700/30 text-gray-400'
                      : 'border-dark-600 bg-dark-700/30 text-white hover:border-primary-500 hover:bg-primary-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showAnswer && (
                      <div className="flex-shrink-0 ml-4">
                        {isCorrect ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-400" />
                        ) : isSelected ? (
                          <XCircleIcon className="h-6 w-6 text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
            >
              <h4 className="font-medium text-blue-300 mb-2">Explanation:</h4>
              <p className="text-sm text-blue-200">{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1)
                setIsAnswered(selectedAnswers[currentQuestion - 1] !== undefined)
              }
            }}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {isAnswered && currentQuestion < quiz.questions.length - 1 && (
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion + 1)
                setIsAnswered(selectedAnswers[currentQuestion + 1] !== undefined)
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors"
            >
              <span>Next</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}

          {isAnswered && currentQuestion === quiz.questions.length - 1 && (
            <button
              onClick={handleQuizComplete}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            >
              <span>Complete Quiz</span>
              <CheckCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}