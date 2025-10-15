import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ChefHat, Flame, Droplets, Clock, CheckCircle,
  AlertCircle, Sparkles, Trophy, DollarSign, Star
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DishChallenge, Ingredient } from '../types'

interface Props {
  dish: DishChallenge
  collectedIngredients: Ingredient[]
  onComplete: (rewards: { money: number; points: number; culturalKnowledge: number }) => void
}

interface CookingStep {
  id: number
  instruction: string
  duration: number // seconds
  action: 'add' | 'stir' | 'wait' | 'flip' | 'check'
  completed: boolean
}

const CookingGameMode: React.FC<Props> = ({ dish, collectedIngredients, onComplete }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [temperature, setTemperature] = useState(50) // 0-100
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActing, setIsActing] = useState(false)
  const [gameState, setGameState] = useState<'intro' | 'cooking' | 'complete'>('intro')
  const [score, setScore] = useState(100) // Start at 100, deduct for mistakes
  const [feedback, setFeedback] = useState<string[]>([])

  // Generate cooking steps based on method
  const [cookingSteps] = useState<CookingStep[]>(() => {
    const steps: CookingStep[] = []
    let stepId = 1

    if (dish.cooking_method === 'steam') {
      steps.push(
        { id: stepId++, instruction: 'Add water to steamer', duration: 5, action: 'add', completed: false },
        { id: stepId++, instruction: 'Place ingredients in steamer', duration: 8, action: 'add', completed: false },
        { id: stepId++, instruction: 'Cover with lid', duration: 3, action: 'add', completed: false },
        { id: stepId++, instruction: 'Steam on medium heat', duration: 15, action: 'wait', completed: false },
        { id: stepId++, instruction: 'Check if cooked through', duration: 5, action: 'check', completed: false }
      )
    } else if (dish.cooking_method === 'fry') {
      steps.push(
        { id: stepId++, instruction: 'Heat oil in pan', duration: 8, action: 'wait', completed: false },
        { id: stepId++, instruction: 'Add ingredients to pan', duration: 5, action: 'add', completed: false },
        { id: stepId++, instruction: 'Stir ingredients', duration: 10, action: 'stir', completed: false },
        { id: stepId++, instruction: 'Flip to other side', duration: 8, action: 'flip', completed: false },
        { id: stepId++, instruction: 'Check golden brown color', duration: 5, action: 'check', completed: false }
      )
    } else {
      // Default generic steps
      steps.push(
        { id: stepId++, instruction: 'Prepare ingredients', duration: 5, action: 'add', completed: false },
        { id: stepId++, instruction: 'Start cooking', duration: 10, action: 'wait', completed: false },
        { id: stepId++, instruction: 'Monitor progress', duration: 8, action: 'check', completed: false },
        { id: stepId++, instruction: 'Final touches', duration: 5, action: 'add', completed: false }
      )
    }

    return steps
  })

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && gameState === 'cooking') {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, gameState])

  // Temperature control (for frying)
  useEffect(() => {
    if (gameState === 'cooking' && dish.cooking_method === 'fry') {
      // Auto-adjust temperature slightly
      const interval = setInterval(() => {
        setTemperature(prev => {
          const randomChange = (Math.random() - 0.5) * 5
          return Math.max(0, Math.min(100, prev + randomChange))
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [gameState, dish.cooking_method])

  const startCooking = () => {
    setGameState('cooking')
    setTimeRemaining(cookingSteps[0].duration)
  }

  const performAction = () => {
    if (isActing || currentStep >= cookingSteps.length) return

    setIsActing(true)
    const step = cookingSteps[currentStep]

    // Check if action is performed correctly
    let success = true
    let message = ''

    if (step.action === 'wait') {
      // For wait actions, just check if temperature is okay
      if (dish.cooking_method === 'fry' && (temperature < 40 || temperature > 80)) {
        success = false
        message = '❌ Temperature not ideal! Adjust heat.'
        setScore(prev => Math.max(0, prev - 10))
      } else {
        message = '✅ Perfect timing!'
      }
    } else if (step.action === 'stir' || step.action === 'flip') {
      // Timing-based actions
      if (timeRemaining < 2) {
        success = false
        message = '⚠️ Too late! Food might burn.'
        setScore(prev => Math.max(0, prev - 5))
      } else if (timeRemaining > step.duration - 2) {
        success = false
        message = '⚠️ Too early! Not ready yet.'
        setScore(prev => Math.max(0, prev - 5))
      } else {
        message = '✅ Excellent technique!'
      }
    } else {
      message = '✅ Step completed!'
    }

    setFeedback(prev => [...prev, message])

    setTimeout(() => {
      // Mark step as completed
      cookingSteps[currentStep].completed = true

      // Move to next step
      if (currentStep < cookingSteps.length - 1) {
        setCurrentStep(prev => prev + 1)
        setTimeRemaining(cookingSteps[currentStep + 1].duration)
      } else {
        // Cooking complete
        completeCooking()
      }
      setIsActing(false)
    }, 1000)
  }

  const completeCooking = () => {
    setGameState('complete')

    // Calculate rewards based on score
    const baseRewards = dish.completion_reward
    const multiplier = score / 100

    const rewards = {
      money: Math.round(baseRewards.money * multiplier),
      points: Math.round(baseRewards.points * multiplier),
      culturalKnowledge: Math.round(baseRewards.cultural_knowledge * multiplier)
    }

    onComplete(rewards)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'add': return ChefHat
      case 'stir': return Sparkles
      case 'wait': return Clock
      case 'flip': return Flame
      case 'check': return CheckCircle
      default: return ChefHat
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">{dish.dish_name}</h1>
              <p className="text-sm opacity-90">{dish.description}</p>
            </div>
          </div>

          {gameState === 'cooking' && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <div className="font-bold text-lg">{score}%</div>
                <div className="opacity-90">Score</div>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <div className="font-bold text-lg">{currentStep + 1}/{cookingSteps.length}</div>
                <div className="opacity-90">Step</div>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <div className="font-bold text-lg">{timeRemaining}s</div>
                <div className="opacity-90">Timer</div>
              </div>
              {dish.cooking_method === 'fry' && (
                <div className="bg-white/20 rounded-lg p-2 text-center">
                  <div className="font-bold text-lg">{Math.round(temperature)}°</div>
                  <div className="opacity-90">Heat</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* Intro Screen */}
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Dish Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Dish</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Cooking Method:</strong> {dish.cooking_method.replace('_', ' ').toUpperCase()}</p>
                  <p><strong>Estimated Time:</strong> {dish.estimated_time} minutes</p>
                  <p><strong>Difficulty:</strong> <span className="capitalize">{dish.difficulty}</span></p>
                  <p className="text-sm italic">{dish.cultural_context}</p>
                </div>
              </div>

              {/* Collected Ingredients */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Ingredients Ready
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {collectedIngredients.map((ing, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-800">
                        {ing.name} - {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Steps Preview */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cooking Steps</h2>
                <div className="space-y-2">
                  {cookingSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1">{step.instruction}</p>
                      <span className="text-sm text-gray-500">{step.duration}s</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={startCooking}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-6 h-6" />
                Start Cooking!
              </button>
            </motion.div>
          )}

          {/* Cooking Screen */}
          {gameState === 'cooking' && (
            <motion.div
              key="cooking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Current Step */}
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Step {currentStep + 1}: {cookingSteps[currentStep].instruction}
                </h2>

                {/* Visual Indicator */}
                <div className="mb-6">
                  {dish.cooking_method === 'steam' ? (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="inline-block"
                    >
                      <Droplets className="w-24 h-24 text-blue-500 mx-auto" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="inline-block"
                    >
                      <Flame className="w-24 h-24 text-orange-500 mx-auto" />
                    </motion.div>
                  )}
                </div>

                {/* Timer Progress */}
                <div className="mb-6">
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                      initial={{ width: '100%' }}
                      animate={{ 
                        width: `${(timeRemaining / cookingSteps[currentStep].duration) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-2xl font-bold text-gray-700 mt-2">{timeRemaining}s remaining</p>
                </div>

                {/* Temperature Control (for frying) */}
                {dish.cooking_method === 'fry' && (
                  <div className="mb-6">
                    <p className="text-lg text-gray-700 mb-2">Heat Level</p>
                    <div className="flex items-center gap-4 justify-center">
                      <button
                        onClick={() => setTemperature(prev => Math.max(0, prev - 10))}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                      >
                        Lower Heat
                      </button>
                      <div className="text-3xl font-bold text-orange-600">
                        {Math.round(temperature)}°
                      </div>
                      <button
                        onClick={() => setTemperature(prev => Math.min(100, prev + 10))}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                      >
                        Raise Heat
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Ideal: 40-80°</p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={performAction}
                  disabled={isActing}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                  {React.createElement(getActionIcon(cookingSteps[currentStep].action), { className: 'w-6 h-6' })}
                  {isActing ? 'Processing...' : 'Complete Step'}
                </button>
              </div>

              {/* Feedback Messages */}
              {feedback.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Feedback</h3>
                  <div className="space-y-2">
                    {feedback.slice(-3).map((msg, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-gray-700"
                      >
                        {msg}
                      </motion.p>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Indicators */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
                <div className="space-y-2">
                  {cookingSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        step.completed
                          ? 'bg-green-50'
                          : index === currentStep
                          ? 'bg-orange-50 ring-2 ring-orange-300'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <span className={`text-sm ${
                        step.completed ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {step.instruction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete Screen */}
          {gameState === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Trophy className="w-16 h-16 text-white" />
                </motion.div>

                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  {dish.dish_name} Complete!
                </h2>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Earned</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${Math.round(dish.completion_reward.money * (score / 100))}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Points</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {Math.round(dish.completion_reward.points * (score / 100))}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Cultural Knowledge</p>
                    <p className="text-3xl font-bold text-purple-600">
                      +{Math.round(dish.completion_reward.cultural_knowledge * (score / 100))}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-lg font-semibold text-gray-800 mb-2">Final Score</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{score}%</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  {score >= 90 ? '🌟 Outstanding! You mastered this dish!' :
                   score >= 70 ? '👍 Great job! The dish turned out well.' :
                   '✨ Good effort! Keep practicing to improve.'}
                </p>

                <button
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Return to Game
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CookingGameMode
