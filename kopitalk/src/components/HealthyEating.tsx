import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Apple, CheckCircle, X, AlertCircle } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface HealthyEatingProps {
  currentPlayerId: number
  onClose: () => void
}

type IngredientAnalysis = {
  name: string
  nutrition: { calories: number; protein: number; fiber: number }
  healthScore: number
  benefits: string[]
  alternatives?: string
}

const HealthyEating: React.FC<HealthyEatingProps> = ({ currentPlayerId, onClose }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)

  const analyses: IngredientAnalysis[] = [
    { name: 'White Rice', nutrition: { calories: 130, protein: 2, fiber: 0 }, healthScore: 6, benefits: ['Energy source', 'Easy to digest'], alternatives: 'Brown Rice (+3 fiber, +2 score)' },
    { name: 'Brown Rice', nutrition: { calories: 110, protein: 3, fiber: 3 }, healthScore: 8, benefits: ['High fiber', 'Whole grain', 'Nutrients'], alternatives: undefined },
    { name: 'Coconut Milk', nutrition: { calories: 230, protein: 2, fiber: 0 }, healthScore: 5, benefits: ['Creamy texture', 'Flavor'], alternatives: 'Low-fat Coconut Milk (-150 cal, +2 score)' },
    { name: 'Chicken Breast', nutrition: { calories: 165, protein: 31, fiber: 0 }, healthScore: 9, benefits: ['High protein', 'Low fat', 'Lean meat'], alternatives: undefined },
    { name: 'Pork Belly', nutrition: { calories: 518, protein: 9, fiber: 0 }, healthScore: 4, benefits: ['Traditional flavor', 'Rich taste'], alternatives: 'Lean Pork (-200 cal, +4 score)' },
    { name: 'Vegetables', nutrition: { calories: 25, protein: 2, fiber: 3 }, healthScore: 10, benefits: ['Vitamins', 'Fiber', 'Low calorie'], alternatives: undefined },
  ]

  const availableAnalyses = analyses.filter(a => 
    collectedIngredients.some(ci => ci.name.toLowerCase().includes(a.name.toLowerCase()))
  )

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter(n => n !== name))
    } else {
      setSelectedIngredients([...selectedIngredients, name])
    }
  }

  const completeActivity = () => {
    const avgScore = selectedIngredients.length > 0
      ? selectedIngredients.reduce((sum, name) => sum + (analyses.find(a => a.name === name)?.healthScore || 0), 0) / selectedIngredients.length
      : 5

    const earnings = Math.floor(5 + (avgScore / 10) * 7)

    addCompletedActivity({
      id: `healthy-eating-${Date.now()}`,
      type: 'healthy_eating',
      timestamp: new Date().toISOString(),
      earnings,
      participants: [currentPlayerId],
      details: {
        avgHealthScore: avgScore,
        ingredientsReviewed: selectedIngredients.length
      }
    })

    setCompleted(true)
  }

  const acceptReward = () => {
    const avgScore = selectedIngredients.length > 0
      ? selectedIngredients.reduce((sum, name) => sum + (analyses.find(a => a.name === name)?.healthScore || 0), 0) / selectedIngredients.length
      : 5
    const earnings = Math.floor(5 + (avgScore / 10) * 7)

    alert(`🎉 Health check complete! Earned $${earnings}!`)
    onClose()
  }

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
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Healthy Eating</h2>
                  <p className="text-pink-100 text-sm">Balance Tradition & Health</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!completed ? (
              <div className="space-y-4">
                <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-pink-900">
                    💪 <strong>Nutritional Awareness:</strong> Analyze your ingredients and learn healthier alternatives!
                  </p>
                </div>

                {availableAnalyses.length === 0 ? (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-yellow-900">No collected ingredients to analyze yet!</p>
                    <p className="text-sm text-yellow-700 mt-2">Collect some ingredients first.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {availableAnalyses.map((analysis) => (
                        <motion.div
                          key={analysis.name}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => toggleIngredient(analysis.name)}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            selectedIngredients.includes(analysis.name)
                              ? 'border-pink-400 bg-pink-50'
                              : 'border-gray-200 bg-white hover:border-pink-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              selectedIngredients.includes(analysis.name) ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {selectedIngredients.includes(analysis.name) ? <CheckCircle className="w-5 h-5" /> : <Apple className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900">{analysis.name}</h4>
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    analysis.healthScore >= 8 ? 'bg-green-100 text-green-700' :
                                    analysis.healthScore >= 6 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {analysis.healthScore}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-4 text-xs text-gray-600 mb-2">
                                <span>{analysis.nutrition.calories} cal</span>
                                <span>{analysis.nutrition.protein}g protein</span>
                                <span>{analysis.nutrition.fiber}g fiber</span>
                              </div>
                              <div className="mb-2">
                                {analysis.benefits.map((benefit, idx) => (
                                  <span key={idx} className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                              {analysis.alternatives && (
                                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                  💡 Try: {analysis.alternatives}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {selectedIngredients.length > 0 && (
                      <button
                        onClick={completeActivity}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Complete Analysis ({selectedIngredients.length} items)
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
                  <p className="text-green-700">Health awareness increased!</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">
                    ${Math.floor(5 + (selectedIngredients.reduce((sum, name) => sum + (analyses.find(a => a.name === name)?.healthScore || 0), 0) / selectedIngredients.length / 10) * 7)}
                  </p>
                  <p className="text-xs text-gray-600">{selectedIngredients.length} ingredients analyzed</p>
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

export default HealthyEating
