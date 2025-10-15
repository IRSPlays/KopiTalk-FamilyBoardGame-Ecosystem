import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, CheckCircle, X, Clock, Trophy } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface RecipeChallengeProps {
  currentPlayerId: number
  onClose: () => void
}

type Challenge = {
  id: string
  difficulty: 'easy' | 'medium' | 'hard'
  dish: string
  ingredients: string[]
  culturalNote: string
  timeLimit: number
}

const RecipeChallenge: React.FC<RecipeChallengeProps> = ({ currentPlayerId, onClose }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [guessedIngredients, setGuessedIngredients] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [completed, setCompleted] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  const challenges: Challenge[] = [
    {
      id: 'c1',
      difficulty: 'easy',
      dish: 'Chicken Rice',
      ingredients: ['Chicken', 'Rice', 'Ginger', 'Garlic', 'Pandan Leaves'],
      culturalNote: 'National dish brought by Hainanese immigrants in early 1900s',
      timeLimit: 60
    },
    {
      id: 'c2',
      difficulty: 'medium',
      dish: 'Laksa',
      ingredients: ['Rice Noodles', 'Coconut Milk', 'Laksa Paste', 'Prawns', 'Fish Cake', 'Bean Sprouts', 'Tofu Puffs'],
      culturalNote: 'Peranakan fusion of Chinese and Malay cuisine',
      timeLimit: 90
    },
    {
      id: 'c3',
      difficulty: 'hard',
      dish: 'Bak Kut Teh',
      ingredients: ['Pork Ribs', 'Garlic', 'White Pepper', 'Star Anise', 'Cinnamon', 'Cloves', 'Dang Gui', 'Mushrooms'],
      culturalNote: 'Created by Chinese laborers to regain strength after hard work',
      timeLimit: 120
    }
  ]

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && selectedChallenge && !completed) {
      completeChallenge()
    }
  }, [timeLeft, completed, selectedChallenge])

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setTimeLeft(challenge.timeLimit)
    setGuessedIngredients([])
  }

  const toggleIngredient = (ingredient: string) => {
    if (guessedIngredients.includes(ingredient)) {
      setGuessedIngredients(guessedIngredients.filter(i => i !== ingredient))
    } else {
      setGuessedIngredients([...guessedIngredients, ingredient])
    }
  }

  const completeChallenge = () => {
    if (!selectedChallenge) return

    const correct = guessedIngredients.filter(g => selectedChallenge.ingredients.includes(g)).length
    const total = selectedChallenge.ingredients.length
    const accuracy = (correct / total) * 100

    const baseEarnings = selectedChallenge.difficulty === 'easy' ? 5 : selectedChallenge.difficulty === 'medium' ? 7 : 10
    const accuracyBonus = Math.floor((accuracy / 100) * 5)
    const earnings = baseEarnings + accuracyBonus

    addCompletedActivity({
      id: `recipe-challenge-${Date.now()}`,
      type: 'recipe_challenge',
      timestamp: new Date().toISOString(),
      earnings,
      participants: [currentPlayerId],
      details: {
        dish: selectedChallenge.dish,
        accuracy,
        difficulty: selectedChallenge.difficulty
      }
    })

    setCompleted(true)
  }

  const acceptReward = () => {
    if (!selectedChallenge) return
    const correct = guessedIngredients.filter(g => selectedChallenge.ingredients.includes(g)).length
    const total = selectedChallenge.ingredients.length
    const accuracy = (correct / total) * 100
    const baseEarnings = selectedChallenge.difficulty === 'easy' ? 5 : selectedChallenge.difficulty === 'medium' ? 7 : 10
    const accuracyBonus = Math.floor((accuracy / 100) * 5)
    const earnings = baseEarnings + accuracyBonus

    alert(`🎉 Recipe challenge complete! Earned $${earnings}!`)
    onClose()
  }

  const allIngredients = ['Chicken', 'Rice', 'Ginger', 'Garlic', 'Pandan Leaves', 'Rice Noodles', 'Coconut Milk', 
    'Laksa Paste', 'Prawns', 'Fish Cake', 'Bean Sprouts', 'Tofu Puffs', 'Pork Ribs', 'White Pepper', 
    'Star Anise', 'Cinnamon', 'Cloves', 'Dang Gui', 'Mushrooms']

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Recipe Challenge</h2>
                  <p className="text-indigo-100 text-sm">Guess the Ingredients</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!selectedChallenge ? (
              <div className="space-y-4">
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-indigo-900">
                    🍜 <strong>Test Your Knowledge:</strong> Can you guess all the ingredients? Learn the cultural story behind each dish!
                  </p>
                </div>

                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <motion.button
                      key={challenge.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startChallenge(challenge)}
                      className="w-full bg-white border-2 border-gray-200 hover:border-indigo-300 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900">{challenge.dish}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              challenge.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {challenge.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">{challenge.ingredients.length} ingredients</span>
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{challenge.timeLimit}s</span>
                          </div>
                        </div>
                        <Utensils className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : !completed ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      setSelectedChallenge(null)
                      setGuessedIngredients([])
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    ←
                  </button>
                  <h3 className="font-bold text-gray-900">{selectedChallenge.dish}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className={timeLeft < 10 ? 'text-red-600 font-bold' : ''}>{timeLeft}s</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
                  <p className="text-sm text-indigo-700 mb-2">Cultural Heritage</p>
                  <p className="text-indigo-900">{selectedChallenge.culturalNote}</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-3">Select ingredients you think are in {selectedChallenge.dish}:</p>
                  <div className="flex flex-wrap gap-2">
                    {allIngredients.map((ingredient) => (
                      <button
                        key={ingredient}
                        onClick={() => toggleIngredient(ingredient)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          guessedIngredients.includes(ingredient)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {ingredient}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={completeChallenge}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Submit Answer ({guessedIngredients.length} selected)
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Challenge Complete!</h3>
                  <p className="text-green-700">
                    {guessedIngredients.filter(g => selectedChallenge.ingredients.includes(g)).length}/{selectedChallenge.ingredients.length} correct!
                  </p>
                </div>

                <div className="bg-white border-2 border-indigo-200 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Correct Ingredients:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className={`px-3 py-1 rounded-full text-sm ${
                          guessedIngredients.includes(ingredient)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">
                    ${(selectedChallenge.difficulty === 'easy' ? 5 : selectedChallenge.difficulty === 'medium' ? 7 : 10) + 
                      Math.floor(((guessedIngredients.filter(g => selectedChallenge.ingredients.includes(g)).length / selectedChallenge.ingredients.length) * 100 / 100) * 5)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {Math.floor((guessedIngredients.filter(g => selectedChallenge.ingredients.includes(g)).length / selectedChallenge.ingredients.length) * 100)}% accuracy
                  </p>
                </div>

                <button
                  onClick={acceptReward}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Collect Reward
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RecipeChallenge
