import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Sparkles, Clock, TrendingUp, Award, RefreshCw, Check, Loader2 } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { DishChallenge } from '../stores/gameStore'

interface GameStartChallengeProps {
  onChallengeGenerated: (challenge: DishChallenge) => void
  onClose: () => void
}

const GameStartChallenge: React.FC<GameStartChallengeProps> = ({
  onChallengeGenerated,
  onClose
}) => {
  const [generating, setGenerating] = useState(false)
  const [generatedChallenge, setGeneratedChallenge] = useState<DishChallenge | null>(null)
  const [error, setError] = useState<string | null>(null)

  const singaporeDishes = [
    'Hainanese Chicken Rice', 'Laksa', 'Char Kway Teow', 'Hokkien Mee',
    'Bak Kut Teh', 'Chilli Crab', 'Rojak', 'Satay', 'Nasi Lemak',
    'Fish Head Curry', 'Popiah', 'Carrot Cake', 'Kueh Pie Tee',
    'Lor Mee', 'Mee Rebus', 'Oyster Omelette', 'Tau Huay', 'Kaya Toast'
  ]

  const cookingMethods: Array<DishChallenge['cooking_method']> = [
    'steam', 'fry', 'boil', 'stir-fry', 'grill', 'bake'
  ]

  const generateWithAI = async () => {
    setGenerating(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('Gemini API key not configured')
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

      const randomDish = singaporeDishes[Math.floor(Math.random() * singaporeDishes.length)]
      const randomMethod = cookingMethods[Math.floor(Math.random() * cookingMethods.length)]

      const prompt = `You are a Singapore culinary expert. Generate a traditional Singapore dish challenge for a family cooking game.

Dish: ${randomDish}
Cooking Method: ${randomMethod}

Provide a JSON response with this EXACT structure (no markdown, just raw JSON):
{
  "dish_name": "name of dish",
  "description": "2-3 sentences about the dish's cultural significance",
  "ingredients": [
    {"name": "ingredient name", "quantity": number, "unit": "unit like grams, ml, pieces"},
    // 8-12 ingredients total
  ],
  "cooking_method": "${randomMethod}",
  "difficulty_level": "easy" or "medium" or "hard",
  "estimated_time": number in minutes,
  "cultural_context": "3-4 sentences about history, traditions, family memories associated with this dish"
}

Make ingredients realistic and available in Singapore supermarkets/wet markets. Include specific quantities.`

      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      // Clean response - remove markdown code blocks if present
      let cleanedResponse = response.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.slice(7)
      }
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.slice(3)
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.slice(0, -3)
      }
      cleanedResponse = cleanedResponse.trim()

      const parsedData = JSON.parse(cleanedResponse)

      // Calculate rewards based on difficulty
      const rewardMultipliers = { easy: 1, medium: 1.5, hard: 2 }
      const multiplier = rewardMultipliers[parsedData.difficulty_level as keyof typeof rewardMultipliers] || 1

      const challenge: DishChallenge = {
        id: `dish-${Date.now()}`,
        dish_name: parsedData.dish_name,
        description: parsedData.description,
        ingredients: parsedData.ingredients.map((ing: any) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          collected: false,
          collectionMethod: null
        })),
        cooking_method: parsedData.cooking_method,
        difficulty_level: parsedData.difficulty_level,
        estimated_time: parsedData.estimated_time,
        cultural_context: parsedData.cultural_context,
        completion_reward: {
          money: Math.floor(50 * multiplier),
          points: Math.floor(100 * multiplier),
          cultural_knowledge: Math.floor(30 * multiplier)
        }
      }

      setGeneratedChallenge(challenge)
    } catch (err) {
      console.error('AI generation error:', err)
      setError('Failed to generate challenge. Using fallback...')
      
      // Fallback: Generate without AI
      generateFallback()
    } finally {
      setGenerating(false)
    }
  }

  const generateFallback = () => {
    const randomDish = singaporeDishes[Math.floor(Math.random() * singaporeDishes.length)]
    const randomMethod = cookingMethods[Math.floor(Math.random() * cookingMethods.length)]
    const difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'

    // Predefined ingredient sets for common dishes
    const ingredientSets: Record<string, any[]> = {
      'Hainanese Chicken Rice': [
        { name: 'Chicken', quantity: 1, unit: 'whole' },
        { name: 'Jasmine Rice', quantity: 400, unit: 'grams' },
        { name: 'Ginger', quantity: 50, unit: 'grams' },
        { name: 'Garlic', quantity: 30, unit: 'grams' },
        { name: 'Pandan Leaves', quantity: 3, unit: 'pieces' },
        { name: 'Chicken Stock', quantity: 500, unit: 'ml' },
        { name: 'Sesame Oil', quantity: 2, unit: 'tablespoons' },
        { name: 'Dark Soy Sauce', quantity: 2, unit: 'tablespoons' },
        { name: 'Cucumber', quantity: 1, unit: 'piece' },
        { name: 'Spring Onions', quantity: 3, unit: 'stalks' }
      ],
      'Laksa': [
        { name: 'Laksa Paste', quantity: 200, unit: 'grams' },
        { name: 'Coconut Milk', quantity: 400, unit: 'ml' },
        { name: 'Rice Noodles', quantity: 400, unit: 'grams' },
        { name: 'Prawns', quantity: 200, unit: 'grams' },
        { name: 'Fish Cake', quantity: 150, unit: 'grams' },
        { name: 'Bean Sprouts', quantity: 100, unit: 'grams' },
        { name: 'Tofu Puffs', quantity: 100, unit: 'grams' },
        { name: 'Cockles', quantity: 100, unit: 'grams' },
        { name: 'Laksa Leaves', quantity: 1, unit: 'bunch' },
        { name: 'Sambal', quantity: 3, unit: 'tablespoons' }
      ]
    }

    const ingredients = ingredientSets[randomDish] || [
      { name: 'Main Protein', quantity: 300, unit: 'grams' },
      { name: 'Rice/Noodles', quantity: 400, unit: 'grams' },
      { name: 'Vegetables', quantity: 200, unit: 'grams' },
      { name: 'Garlic', quantity: 20, unit: 'grams' },
      { name: 'Ginger', quantity: 30, unit: 'grams' },
      { name: 'Soy Sauce', quantity: 3, unit: 'tablespoons' },
      { name: 'Sesame Oil', quantity: 1, unit: 'tablespoon' },
      { name: 'Salt', quantity: 1, unit: 'teaspoon' }
    ]

    const rewardMultipliers = { easy: 1, medium: 1.5, hard: 2 }
    const multiplier = rewardMultipliers[difficulty]

    const challenge: DishChallenge = {
      id: `dish-${Date.now()}`,
      dish_name: randomDish,
      description: `A beloved Singapore dish that brings families together at the dining table.`,
      ingredients: ingredients.map(ing => ({
        ...ing,
        collected: false,
        collectionMethod: null
      })),
      cooking_method: randomMethod,
      difficulty_level: difficulty,
      estimated_time: 45 + Math.floor(Math.random() * 30),
      cultural_context: `${randomDish} is a cherished part of Singapore's culinary heritage, passed down through generations. This dish represents the multicultural flavors that define our food culture.`,
      completion_reward: {
        money: Math.floor(50 * multiplier),
        points: Math.floor(100 * multiplier),
        cultural_knowledge: Math.floor(30 * multiplier)
      }
    }

    setGeneratedChallenge(challenge)
    setError(null)
  }

  const acceptChallenge = () => {
    if (generatedChallenge) {
      onChallengeGenerated(generatedChallenge)
      onClose()
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getMethodIcon = (method: string) => {
    return '🔥' // Simplified for now
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-3xl text-white">
            <div className="flex items-center gap-3 mb-2">
              <ChefHat className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Today's Family Cooking Challenge</h2>
            </div>
            <p className="text-orange-100">AI will generate a unique Singapore traditional dish for your family!</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {!generatedChallenge && !generating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Start?</h3>
                <p className="text-gray-600 mb-6">
                  Click below to generate a random Singapore traditional dish challenge!
                </p>
                <button
                  onClick={generateWithAI}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Challenge with AI
                </button>
              </motion.div>
            )}

            {generating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Loader2 className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Your Challenge...</h3>
                <p className="text-gray-600">AI is creating a unique Singapore dish just for you!</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4"
              >
                <p className="text-yellow-800 text-sm">{error}</p>
              </motion.div>
            )}

            {generatedChallenge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Dish Header */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {generatedChallenge.dish_name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{generatedChallenge.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 uppercase">Difficulty</p>
                    <p className={`text-sm font-bold mt-1 px-2 py-1 rounded-lg inline-block ${getDifficultyColor(generatedChallenge.difficulty_level)}`}>
                      {generatedChallenge.difficulty_level}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 uppercase">Time</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{generatedChallenge.estimated_time} min</p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
                    <span className="text-2xl mx-auto mb-2 block">{getMethodIcon(generatedChallenge.cooking_method)}</span>
                    <p className="text-xs text-gray-500 uppercase">Method</p>
                    <p className="text-sm font-bold text-gray-900 mt-1 capitalize">{generatedChallenge.cooking_method}</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    Required Ingredients ({generatedChallenge.ingredients.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {generatedChallenge.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{ing.name}</p>
                          <p className="text-xs text-gray-600">{ing.quantity} {ing.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Context */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">🏛️</span>
                    Cultural Heritage
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {generatedChallenge.cultural_context}
                  </p>
                </div>

                {/* Rewards */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Completion Rewards
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${generatedChallenge.completion_reward.money}
                      </p>
                      <p className="text-xs text-gray-600">Money</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {generatedChallenge.completion_reward.points}
                      </p>
                      <p className="text-xs text-gray-600">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        +{generatedChallenge.completion_reward.cultural_knowledge}
                      </p>
                      <p className="text-xs text-gray-600">Knowledge</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={generateWithAI}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generate New
                  </button>
                  <button
                    onClick={acceptChallenge}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Accept Challenge
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default GameStartChallenge
