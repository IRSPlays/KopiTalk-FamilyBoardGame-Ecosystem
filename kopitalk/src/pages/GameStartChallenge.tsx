import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Sparkles, Clock, Award, BookOpen, Loader2, RefreshCw } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useGameStore, DishChallenge } from '../stores/gameStore'

interface GameStartChallengeProps {
  onChallengeReady: (challenge: DishChallenge) => void
  onCancel: () => void
}

const GameStartChallenge: React.FC<GameStartChallengeProps> = ({ onChallengeReady, onCancel }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedChallenge, setGeneratedChallenge] = useState<DishChallenge | null>(null)
  const [error, setError] = useState<string | null>(null)

  const setDishChallenge = useGameStore(state => state.setDishChallenge)

  const generateDishChallenge = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('Gemini API key not configured')
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

      const prompt = `Generate a random traditional Singapore dish challenge for a family cooking game. 
      
      Requirements:
      - Must be an authentic Singapore/Singaporean Chinese/Malay/Indian dish
      - Include 8-12 specific ingredients with quantities
      - Choose one cooking method: steam, fry, boil, stir-fry, grill, or bake
      - Difficulty: easy, medium, or hard
      - Estimated cooking time in minutes
      - Brief cultural context about the dish
      - Rewards based on difficulty (easy: $40-50, medium: $60-80, hard: $90-120)
      
      Return ONLY valid JSON in this exact format:
      {
        "dish_name": "Hainanese Chicken Rice",
        "description": "A fragrant rice dish cooked in chicken stock",
        "ingredients": [
          {"name": "Chicken thigh", "quantity": 500, "unit": "g"},
          {"name": "Jasmine rice", "quantity": 2, "unit": "cups"}
        ],
        "cooking_method": "boil",
        "difficulty_level": "medium",
        "estimated_time": 45,
        "cultural_context": "Originally from Hainan, China, this dish became a Singaporean icon...",
        "completion_reward": {
          "money": 70,
          "points": 150,
          "cultural_knowledge": 25
        }
      }`

      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response')
      }

      const challengeData = JSON.parse(jsonMatch[0])
      
      // Create full challenge object
      const challenge: DishChallenge = {
        id: `dish-${Date.now()}`,
        dish_name: challengeData.dish_name,
        description: challengeData.description,
        ingredients: challengeData.ingredients.map((ing: any) => ({
          ...ing,
          collected: false,
          collectionMethod: null
        })),
        cooking_method: challengeData.cooking_method,
        difficulty_level: challengeData.difficulty_level,
        estimated_time: challengeData.estimated_time,
        cultural_context: challengeData.cultural_context,
        completion_reward: challengeData.completion_reward
      }

      setGeneratedChallenge(challenge)
    } catch (err) {
      console.error('Error generating dish challenge:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate challenge')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAcceptChallenge = () => {
    if (generatedChallenge) {
      setDishChallenge(generatedChallenge)
      onChallengeReady(generatedChallenge)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCookingMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      steam: '♨️',
      fry: '🍳',
      boil: '🫕',
      'stir-fry': '🥘',
      grill: '🔥',
      bake: '🔥'
    }
    return icons[method] || '👨‍🍳'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <ChefHat className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">Today's Cooking Challenge</h2>
              <p className="text-orange-100">AI-Generated Singapore Dish</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!generatedChallenge && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to Cook Together?
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI will generate a unique Singapore traditional dish challenge for your family!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateDishChallenge}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                Generate Challenge
              </motion.button>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-orange-500 animate-spin" />
              <p className="text-lg font-medium text-gray-900">Generating your challenge...</p>
              <p className="text-sm text-gray-600 mt-2">AI is creating a unique Singapore dish</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4"
            >
              <p className="text-red-800 font-medium">⚠️ {error}</p>
              <button
                onClick={generateDishChallenge}
                className="mt-2 text-red-600 underline text-sm"
              >
                Try again
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {generatedChallenge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Dish Name & Difficulty */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {generatedChallenge.dish_name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(generatedChallenge.difficulty_level)}`}>
                      {generatedChallenge.difficulty_level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700">{generatedChallenge.description}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">Cooking Time</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{generatedChallenge.estimated_time} min</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <span className="text-xl">{getCookingMethodIcon(generatedChallenge.cooking_method)}</span>
                      <span className="text-sm font-semibold">Method</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 capitalize">{generatedChallenge.cooking_method}</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <span>🥬</span> Ingredients ({generatedChallenge.ingredients.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {generatedChallenge.ingredients.map((ing, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-2 text-sm">
                        <span className="font-medium text-gray-900">{ing.name}</span>
                        <span className="text-gray-600 ml-2">
                          {ing.quantity} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural Context */}
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Cultural Story
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {generatedChallenge.cultural_context}
                  </p>
                </div>

                {/* Rewards */}
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Completion Rewards
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">💰</div>
                      <div className="text-xl font-bold text-green-600">
                        ${generatedChallenge.completion_reward.money}
                      </div>
                      <div className="text-xs text-gray-600">Money</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">⭐</div>
                      <div className="text-xl font-bold text-blue-600">
                        {generatedChallenge.completion_reward.points}
                      </div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">📚</div>
                      <div className="text-xl font-bold text-purple-600">
                        +{generatedChallenge.completion_reward.cultural_knowledge}
                      </div>
                      <div className="text-xs text-gray-600">Knowledge</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setGeneratedChallenge(null)
                      generateDishChallenge()
                    }}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generate New
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAcceptChallenge}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg"
                  >
                    Accept Challenge! 🎉
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameStartChallenge
