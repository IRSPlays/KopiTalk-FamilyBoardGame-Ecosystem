import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChefHat, Clock, Flame, CheckCircle, X, ArrowLeft, 
  ThermometerSun, Trophy, Star, Sparkles, DollarSign
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import { useNavigate } from 'react-router-dom'

type CookingStep = 'check_ingredients' | 'prep' | 'cooking' | 'plating' | 'complete'

const CookingGameComponent: React.FC = () => {
  const navigate = useNavigate()
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  const completeDish = useGameStore(state => state.completeGame)
  
  const [currentStep, setCurrentStep] = useState<CookingStep>('check_ingredients')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [addedIngredients, setAddedIngredients] = useState<string[]>([])
  const [cookingProgress, setCookingProgress] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  // Check if all ingredients are collected
  const requiredIngredients = dishChallenge?.ingredients || []
  const missingIngredients = requiredIngredients.filter(
    req => !collectedIngredients.some(col => col.name === req.name)
  )
  const allIngredientsCollected = missingIngredients.length === 0

  useEffect(() => {
    if (currentStep === 'cooking' && isTimerRunning && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            setCookingProgress(100)
            setTimeout(() => setCurrentStep('plating'), 1000)
            return 0
          }
          setCookingProgress(((dishChallenge?.estimated_time || 30) - prev) / (dishChallenge?.estimated_time || 30) * 100)
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [currentStep, isTimerRunning, timeRemaining, dishChallenge])

  const startPrep = () => {
    if (!allIngredientsCollected) {
      alert('❌ You need all ingredients before you can start cooking!')
      return
    }
    setCurrentStep('prep')
  }

  const addIngredientToPot = (ingredientName: string) => {
    if (!addedIngredients.includes(ingredientName)) {
      setAddedIngredients([...addedIngredients, ingredientName])
    }
  }

  const startCooking = () => {
    // Check if all ingredients were added
    const allAdded = requiredIngredients.every(req => 
      addedIngredients.includes(req.name)
    )
    
    if (!allAdded) {
      alert('❌ Add all ingredients to the pot first!')
      return
    }

    setCurrentStep('cooking')
    setTimeRemaining(Math.min(dishChallenge?.estimated_time || 30, 60)) // Max 60 seconds for game
    setIsTimerRunning(true)
  }

  const completeCooking = () => {
    // Calculate score based on performance
    const baseScore = 100
    const ingredientBonus = (addedIngredients.length / requiredIngredients.length) * 50
    const timeBonus = cookingProgress === 100 ? 30 : 0
    const methodBonus = 20 // Correct cooking method bonus
    
    const score = Math.round(baseScore + ingredientBonus + timeBonus + methodBonus)
    setFinalScore(score)
    
    // Award rewards
    if (dishChallenge?.completion_reward) {
      updateFamilyBudget(dishChallenge.completion_reward.money)
    }
    
    completeDish(score)
    setCurrentStep('complete')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!dishChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Cooking Challenge</h2>
          <p className="text-gray-600 mb-6">You need to generate a dish challenge first!</p>
          <button
            onClick={() => navigate('/board-game')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
          >
            Back to Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/board-game')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Game</span>
            </button>
            
            <h1 className="text-xl sm:text-2xl font-bold text-orange-600 flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              Cooking: {dishChallenge.dish_name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900 capitalize">
                  {dishChallenge.cooking_method}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Check Ingredients */}
          {currentStep === 'check_ingredients' && (
            <motion.div
              key="check"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Ingredient Check
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {requiredIngredients.map((ingredient, index) => {
                    const isCollected = collectedIngredients.some(col => col.name === ingredient.name)
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 ${
                          isCollected 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{ingredient.name}</p>
                            <p className="text-sm text-gray-600">{ingredient.quantity} {ingredient.unit}</p>
                          </div>
                          {isCollected ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <X className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {!allIngredientsCollected && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
                    <p className="text-red-900 font-medium mb-2">
                      ❌ Missing {missingIngredients.length} ingredient(s)
                    </p>
                    <p className="text-sm text-red-800">
                      Visit the Supermarket or Delivery App to get: {missingIngredients.map(i => i.name).join(', ')}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/board-game')}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                  >
                    Back to Game
                  </button>
                  <button
                    onClick={startPrep}
                    disabled={!allIngredientsCollected}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Cooking
                  </button>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Recipe Info</h3>
                <p className="text-gray-700 mb-4">{dishChallenge.description}</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Cooking Time</p>
                      <p className="font-bold text-gray-900">{dishChallenge.estimated_time} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Difficulty</p>
                      <p className="font-bold text-gray-900 capitalize">{dishChallenge.difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Prep - Add Ingredients */}
          {currentStep === 'prep' && (
            <motion.div
              key="prep"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🥘 Add Ingredients to Pot
                </h2>

                <p className="text-gray-600 mb-6">
                  Click on each ingredient to add it to your cooking pot
                </p>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {requiredIngredients.map((ingredient, index) => {
                    const isAdded = addedIngredients.includes(ingredient.name)
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => addIngredientToPot(ingredient.name)}
                        disabled={isAdded}
                        whileHover={!isAdded ? { scale: 1.05 } : {}}
                        whileTap={!isAdded ? { scale: 0.95 } : {}}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isAdded
                            ? 'border-green-300 bg-green-100 cursor-not-allowed'
                            : 'border-orange-300 bg-white hover:bg-orange-50 cursor-pointer'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{ingredient.name}</p>
                        <p className="text-sm text-gray-600">{ingredient.quantity} {ingredient.unit}</p>
                        {isAdded && (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mt-2" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-orange-900 mb-3">Cooking Pot</h3>
                  <div className="flex flex-wrap gap-2">
                    {addedIngredients.length === 0 ? (
                      <p className="text-orange-700">Click ingredients above to add them...</p>
                    ) : (
                      addedIngredients.map((name, i) => (
                        <span key={i} className="px-3 py-1 bg-white border-2 border-orange-300 rounded-full text-sm font-medium text-orange-900">
                          {name}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-orange-800">
                      {addedIngredients.length} / {requiredIngredients.length} ingredients added
                    </p>
                  </div>
                </div>

                <button
                  onClick={startCooking}
                  disabled={addedIngredients.length !== requiredIngredients.length}
                  className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Flame className="w-6 h-6" />
                  Start Cooking!
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Cooking with Timer */}
          {currentStep === 'cooking' && (
            <motion.div
              key="cooking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Flame className="w-16 h-16 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Cooking in Progress...</h2>
                <p className="text-gray-600 mb-6 capitalize">{dishChallenge.cooking_method} method</p>

                <div className="mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <p className="text-5xl font-bold text-orange-600">{formatTime(timeRemaining)}</p>
                  </div>
                  <p className="text-sm text-gray-500">Time remaining</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-6 mb-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cookingProgress}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-white">
                      {Math.round(cookingProgress)}%
                    </span>
                  </motion.div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  <p className="text-yellow-900 font-medium">
                    🔥 Keep an eye on the timer! Perfect timing leads to perfect taste!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Plating */}
          {currentStep === 'plating' && (
            <motion.div
              key="plating"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">Dish is Ready!</h2>
                <p className="text-gray-600 mb-6">Time to plate your masterpiece</p>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-6">
                  <p className="text-lg font-bold text-orange-900 mb-2">{dishChallenge.dish_name}</p>
                  <p className="text-sm text-orange-800">{dishChallenge.description}</p>
                </div>

                <button
                  onClick={completeCooking}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-6 h-6" />
                  Serve the Dish
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Complete */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ repeat: 3, duration: 0.5 }}
                  className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Trophy className="w-20 h-20 text-white" />
                </motion.div>

                <h2 className="text-4xl font-bold text-gray-900 mb-2">Cooking Complete! 🎉</h2>
                <p className="text-xl text-gray-600 mb-6">You've mastered {dishChallenge.dish_name}!</p>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
                  <p className="text-sm text-purple-800 mb-3">Your Score</p>
                  <p className="text-6xl font-bold text-purple-900 mb-4">{finalScore}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-lg p-3">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Money</p>
                      <p className="font-bold text-green-600">+${dishChallenge.completion_reward.money}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <Star className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Points</p>
                      <p className="font-bold text-yellow-600">+{dishChallenge.completion_reward.points}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Culture</p>
                      <p className="font-bold text-purple-600">+{dishChallenge.completion_reward.cultural_knowledge}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/board-game')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold text-lg"
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

export default CookingGameComponent
