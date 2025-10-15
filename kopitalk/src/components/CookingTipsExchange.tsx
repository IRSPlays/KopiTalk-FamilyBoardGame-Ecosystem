import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Lightbulb, CheckCircle, X, Camera } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface CookingTipsExchangeProps {
  currentPlayerId: number
  onClose: () => void
}

type Tip = {
  id: string
  category: 'Traditional' | 'Modern'
  title: string
  description: string
  expert: string
  value: number
}

const CookingTipsExchange: React.FC<CookingTipsExchangeProps> = ({ currentPlayerId, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'Traditional' | 'Modern' | ''>('')
  const [selectedTips, setSelectedTips] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  const traditionalTips: Tip[] = [
    { id: 't1', category: 'Traditional', title: 'Knife Skills', description: 'Hold knife at 45° angle, let weight do the work', expert: 'Ah Ma', value: 5 },
    { id: 't2', category: 'Traditional', title: 'Seasoning Secrets', description: 'Always taste before adding salt, season in layers', expert: 'Uncle Tan', value: 6 },
    { id: 't3', category: 'Traditional', title: 'Wok Hei Technique', description: 'High heat + constant motion = breath of the wok', expert: 'Auntie Lee', value: 7 },
    { id: 't4', category: 'Traditional', title: 'Stock from Bones', description: 'Simmer chicken bones for 4 hours for rich broth', expert: 'Ah Kong', value: 5 },
  ]

  const modernTips: Tip[] = [
    { id: 'm1', category: 'Modern', title: 'Air Fryer Shortcut', description: 'Crispy results with 70% less oil in 15 minutes', expert: 'Sarah', value: 5 },
    { id: 'm2', category: 'Modern', title: 'Instant Pot Magic', description: 'Pressure cook tough meats in 20 mins vs 3 hours', expert: 'Ryan', value: 6 },
    { id: 'm3', category: 'Modern', title: 'Meal Prep Batching', description: 'Cook once, freeze portions for busy weekdays', expert: 'Emma', value: 5 },
    { id: 'm4', category: 'Modern', title: 'Kitchen Apps', description: 'Use timer apps and recipe converters for precision', expert: 'Marcus', value: 4 },
  ]

  const tips = selectedCategory === 'Traditional' ? traditionalTips : selectedCategory === 'Modern' ? modernTips : []

  const toggleTip = (tipId: string) => {
    if (selectedTips.includes(tipId)) {
      setSelectedTips(selectedTips.filter(id => id !== tipId))
    } else {
      setSelectedTips([...selectedTips, tipId])
    }
  }

  const completeExchange = () => {
    const totalValue = tips
      .filter(tip => selectedTips.includes(tip.id))
      .reduce((sum, tip) => sum + tip.value, 0)

    const earnings = Math.floor(totalValue * 2) + 5

    addCompletedActivity({
      id: `cooking-tips-${Date.now()}`,
      type: 'cooking_tips',
      timestamp: new Date().toISOString(),
      earnings,
      participants: [currentPlayerId],
      details: {
        category: selectedCategory,
        tipsShared: selectedTips.length
      }
    })

    setCompleted(true)
  }

  const acceptReward = () => {
    const totalValue = tips
      .filter(tip => selectedTips.includes(tip.id))
      .reduce((sum, tip) => sum + tip.value, 0)
    const earnings = Math.floor(totalValue * 2) + 5

    alert(`🎉 Tips exchanged! Earned $${earnings}!`)
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
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Cooking Tips Exchange</h2>
                  <p className="text-orange-100 text-sm">Share Knowledge Across Generations</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!selectedCategory ? (
              <div className="space-y-4">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-orange-900">
                    👨‍🍳 <strong>Knowledge Sharing:</strong> Learn traditional techniques from elderly, teach modern shortcuts to them!
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory('Traditional')}
                  className="w-full bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-xl p-6 transition-all"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">Traditional Techniques</h3>
                    <p className="text-amber-700">Learn from elderly: Knife skills, seasoning, wok hei</p>
                    <p className="text-sm text-amber-600 mt-2">{traditionalTips.length} tips available</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory('Modern')}
                  className="w-full bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-300 rounded-xl p-6 transition-all"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-cyan-900 mb-2">Modern Shortcuts</h3>
                    <p className="text-cyan-700">Teach youth: Air fryer, instant pot, meal prep</p>
                    <p className="text-sm text-cyan-600 mt-2">{modernTips.length} tips available</p>
                  </div>
                </motion.button>
              </div>
            ) : !completed ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setSelectedTips([])
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    ←
                  </button>
                  <h3 className="font-bold text-gray-900">{selectedCategory} Tips</h3>
                  <div className="text-sm text-gray-600">
                    {selectedTips.length} selected
                  </div>
                </div>

                <div className="space-y-3">
                  {tips.map((tip) => (
                    <motion.div
                      key={tip.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => toggleTip(tip.id)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedTips.includes(tip.id)
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedTips.includes(tip.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {selectedTips.includes(tip.id) ? <CheckCircle className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{tip.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">By {tip.expert}</p>
                            <p className="text-xs font-semibold text-orange-600">+${tip.value}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedTips.length > 0 && (
                  <button
                    onClick={completeExchange}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Complete Exchange ({selectedTips.length} tips)
                  </button>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Exchange Complete!</h3>
                  <p className="text-green-700">Knowledge shared successfully!</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">
                    ${Math.floor(tips.filter(tip => selectedTips.includes(tip.id)).reduce((sum, tip) => sum + tip.value, 0) * 2) + 5}
                  </p>
                  <p className="text-xs text-gray-600">{selectedTips.length} tips shared</p>
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

export default CookingTipsExchange
