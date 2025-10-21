import React from 'react'
import { motion } from 'framer-motion'
import { ChefHat, Clock, TrendingUp, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

const ChallengeBanner: React.FC = () => {
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)

  if (!dishChallenge) {
    return (
      <motion.div
        className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-gray-400" />
          <div>
            <h3 className="font-bold text-gray-600">No Challenge Yet</h3>
            <p className="text-sm text-gray-500">Complete board setup to generate your family challenge!</p>
          </div>
        </div>
      </motion.div>
    )
  }

  const totalIngredients = dishChallenge.ingredients.length
  const collectedCount = collectedIngredients.filter(ing => ing.collected).length
  const progress = (collectedCount / totalIngredients) * 100

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl shadow-lg overflow-hidden mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <ChefHat className="w-8 h-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">Today's Family Challenge</h2>
              <p className="text-purple-100 text-sm">Cook together and bond as a family!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{dishChallenge.estimated_time} mins</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <TrendingUp className="w-4 h-4" />
              <span className="capitalize">{dishChallenge.difficulty_level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Dish Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">{dishChallenge.dish_name}</h3>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">{dishChallenge.description}</p>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Cooking Method</h4>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {dishChallenge.cooking_method.replace('-', ' ')}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Cultural Context
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{dishChallenge.cultural_context}</p>
            </div>
          </div>

          {/* Right: Ingredients */}
          <div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Ingredients Required</h4>
                <span className="text-sm font-medium text-purple-600">
                  {collectedCount}/{totalIngredients} collected
                </span>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Ingredients List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {dishChallenge.ingredients.map((ingredient, index) => {
                  const isCollected = collectedIngredients.find(
                    ing => ing.name.toLowerCase() === ingredient.name.toLowerCase()
                  )?.collected || false

                  return (
                    <motion.div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        isCollected
                          ? 'bg-green-50 border-2 border-green-300'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        {isCollected ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                        )}
                        <span className={`font-medium ${isCollected ? 'text-green-800' : 'text-gray-700'}`}>
                          {ingredient.name}
                        </span>
                      </div>
                      <span className={`text-sm ${isCollected ? 'text-green-600' : 'text-gray-500'}`}>
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Rewards Preview */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Completion Rewards</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${dishChallenge.completion_reward.money}
                  </div>
                  <div className="text-xs text-gray-600">Money</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {dishChallenge.completion_reward.points}
                  </div>
                  <div className="text-xs text-gray-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    +{dishChallenge.completion_reward.cultural_knowledge}
                  </div>
                  <div className="text-xs text-gray-600">Culture</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Hint */}
        {collectedCount < totalIngredients && (
          <motion.div
            className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-blue-800">
              <strong>Next Step:</strong> Visit the <strong>Delivery App</strong> or <strong>Supermarket</strong> in Game Actions to collect missing ingredients!
            </p>
          </motion.div>
        )}

        {collectedCount === totalIngredients && (
          <motion.div
            className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-green-800">
              <strong>🎉 All ingredients collected!</strong> Head to the <strong>Cooking Game</strong> in Game Actions to start cooking!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ChallengeBanner
