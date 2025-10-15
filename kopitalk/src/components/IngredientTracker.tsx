import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Package, ShoppingCart, Store, Clock } from 'lucide-react'
import { useGameStore, Ingredient } from '../stores/gameStore'

interface IngredientTrackerProps {
  compact?: boolean
  showMethods?: boolean
}

const IngredientTracker: React.FC<IngredientTrackerProps> = ({ 
  compact = false, 
  showMethods = true 
}) => {
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const dishChallenge = useGameStore(state => state.dishChallenge)

  if (!dishChallenge || collectedIngredients.length === 0) {
    return null
  }

  const collectedCount = collectedIngredients.filter(ing => ing.collected).length
  const totalCount = collectedIngredients.length
  const progress = (collectedCount / totalCount) * 100

  const getMethodIcon = (method: string | null | undefined) => {
    switch (method) {
      case 'delivery':
        return <Package className="w-4 h-4 text-blue-600" />
      case 'supermarket':
        return <ShoppingCart className="w-4 h-4 text-green-600" />
      case 'wet_market':
        return <Store className="w-4 h-4 text-orange-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getMethodLabel = (method: string | null | undefined) => {
    switch (method) {
      case 'delivery':
        return 'Delivery'
      case 'supermarket':
        return 'Supermarket'
      case 'wet_market':
        return 'Wet Market'
      default:
        return 'Pending'
    }
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-3"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-sm">Ingredients</h3>
          <span className="text-xs font-semibold text-gray-600">
            {collectedCount}/{totalCount}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-600"
          />
        </div>
        
        {/* Quick List */}
        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
          {collectedIngredients.map((ing, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs ${
                ing.collected ? 'text-green-700' : 'text-gray-500'
              }`}
            >
              {ing.collected ? (
                <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
              )}
              <span className={ing.collected ? 'line-through' : ''}>{ing.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🥬</span> Ingredient Checklist
          </h3>
          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {collectedCount}/{totalCount} Collected
          </span>
        </div>
        
        {/* Progress Bar with Animation */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Ingredient List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {collectedIngredients.map((ing, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl p-3 transition-all ${
                ing.collected
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0 mt-0.5"
                >
                  {ing.collected ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </motion.div>

                {/* Ingredient Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4
                        className={`font-semibold ${
                          ing.collected
                            ? 'text-green-900 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {ing.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {ing.quantity} {ing.unit}
                      </p>
                    </div>

                    {/* Collection Method Badge */}
                    {showMethods && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                          ing.collected
                            ? ing.collectionMethod === 'delivery'
                              ? 'bg-blue-100 text-blue-700'
                              : ing.collectionMethod === 'supermarket'
                              ? 'bg-green-100 text-green-700'
                              : ing.collectionMethod === 'wet_market'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {getMethodIcon(ing.collectionMethod)}
                        <span className="hidden sm:inline">
                          {getMethodLabel(ing.collectionMethod)}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {collectedCount === totalCount && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center"
        >
          <div className="text-3xl mb-2">🎉</div>
          <h4 className="font-bold text-lg">All Ingredients Collected!</h4>
          <p className="text-sm text-green-100 mt-1">
            Ready to start cooking {dishChallenge.dish_name}!
          </p>
        </motion.div>
      )}

      {/* Collection Methods Legend */}
      {showMethods && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Collection Methods:</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
              <Package className="w-3 h-3 text-blue-600" />
              <span>Delivery</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
              <ShoppingCart className="w-3 h-3 text-green-600" />
              <span>Supermarket</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded">
              <Store className="w-3 h-3 text-orange-600" />
              <span>Wet Market</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default IngredientTracker
