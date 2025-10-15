import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, X, Fish, Carrot, Beef, PackageOpen, 
  MessageSquare, DollarSign, TrendingDown, Sparkles, CheckCircle
} from 'lucide-react'
import { useGameStore, type Ingredient } from '../stores/gameStore'

interface WetMarketShoppingProps {
  currentPlayerId: number
  onClose: () => void
}

interface MarketStall {
  id: string
  name: string
  icon: React.ReactNode
  products: MarketProduct[]
  stallkeeper: {
    name: string
    personality: 'friendly' | 'strict' | 'humorous'
  }
}

interface MarketProduct {
  id: string
  name: string
  basePrice: number
  unit: string
  quality: 'premium' | 'standard' | 'economy'
  freshness: number // 1-10
}

interface BargainAttempt {
  offer: number
  response: string
  accepted: boolean
}

const WetMarketShopping: React.FC<WetMarketShoppingProps> = ({
  currentPlayerId,
  onClose
}) => {
  const [selectedStall, setSelectedStall] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null)
  const [bargainPrice, setBargainPrice] = useState<number>(0)
  const [bargainHistory, setBargainHistory] = useState<BargainAttempt[]>([])
  const [cart, setCart] = useState<Array<{ product: MarketProduct; quantity: number; finalPrice: number }>>([])
  
  const player = useGameStore(state => state.players.find(p => p.id === currentPlayerId))
  const spendMoney = useGameStore(state => state.spendMoney)
  const markIngredientCollected = useGameStore(state => state.markIngredientCollected)
  const requiredIngredients = useGameStore(state => state.collectedIngredients)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  const marketStalls: MarketStall[] = [
    {
      id: 'vegetable',
      name: 'Ah Huat Vegetables',
      icon: <Carrot className="w-6 h-6" />,
      stallkeeper: { name: 'Uncle Ah Huat', personality: 'friendly' },
      products: [
        { id: 'veg-1', name: 'Kai Lan', basePrice: 3.50, unit: 'bundle', quality: 'standard', freshness: 9 },
        { id: 'veg-2', name: 'Chye Sim', basePrice: 3.00, unit: 'bundle', quality: 'standard', freshness: 9 },
        { id: 'veg-3', name: 'Spring Onions', basePrice: 2.00, unit: 'bunch', quality: 'standard', freshness: 8 },
        { id: 'veg-4', name: 'Ginger', basePrice: 5.00, unit: '200g', quality: 'premium', freshness: 10 },
        { id: 'veg-5', name: 'Garlic', basePrice: 4.00, unit: '100g', quality: 'standard', freshness: 9 },
        { id: 'veg-6', name: 'Tomatoes', basePrice: 3.50, unit: '500g', quality: 'standard', freshness: 8 },
      ]
    },
    {
      id: 'fish',
      name: 'Soon Lee Seafood',
      icon: <Fish className="w-6 h-6" />,
      stallkeeper: { name: 'Auntie May', personality: 'strict' },
      products: [
        { id: 'fish-1', name: 'Pomfret', basePrice: 18.00, unit: 'whole', quality: 'premium', freshness: 10 },
        { id: 'fish-2', name: 'Seabass', basePrice: 15.00, unit: 'whole', quality: 'premium', freshness: 9 },
        { id: 'fish-3', name: 'Prawns', basePrice: 22.00, unit: '500g', quality: 'premium', freshness: 10 },
        { id: 'fish-4', name: 'Squid', basePrice: 12.00, unit: '300g', quality: 'standard', freshness: 9 },
        { id: 'fish-5', name: 'Cockles', basePrice: 8.00, unit: '200g', quality: 'standard', freshness: 8 },
      ]
    },
    {
      id: 'meat',
      name: 'Swee Heng Meat',
      icon: <Beef className="w-6 h-6" />,
      stallkeeper: { name: 'Uncle Tan', personality: 'humorous' },
      products: [
        { id: 'meat-1', name: 'Pork Belly', basePrice: 14.00, unit: '500g', quality: 'premium', freshness: 9 },
        { id: 'meat-2', name: 'Chicken Thigh', basePrice: 10.00, unit: '500g', quality: 'standard', freshness: 9 },
        { id: 'meat-3', name: 'Chicken Breast', basePrice: 9.00, unit: '500g', quality: 'standard', freshness: 9 },
        { id: 'meat-4', name: 'Minced Pork', basePrice: 8.00, unit: '300g', quality: 'standard', freshness: 8 },
        { id: 'meat-5', name: 'Pork Ribs', basePrice: 16.00, unit: '500g', quality: 'premium', freshness: 10 },
      ]
    },
    {
      id: 'dry_goods',
      name: 'Lim Brothers Dry Goods',
      icon: <PackageOpen className="w-6 h-6" />,
      stallkeeper: { name: 'Ah Boy', personality: 'friendly' },
      products: [
        { id: 'dry-1', name: 'Rice', basePrice: 12.00, unit: '2kg', quality: 'standard', freshness: 10 },
        { id: 'dry-2', name: 'Rice Noodles', basePrice: 4.00, unit: '500g', quality: 'standard', freshness: 10 },
        { id: 'dry-3', name: 'Dried Shrimp', basePrice: 8.00, unit: '100g', quality: 'premium', freshness: 10 },
        { id: 'dry-4', name: 'Sesame Oil', basePrice: 6.00, unit: '250ml', quality: 'premium', freshness: 10 },
        { id: 'dry-5', name: 'Soy Sauce', basePrice: 5.00, unit: '500ml', quality: 'standard', freshness: 10 },
      ]
    }
  ]

  const isRequired = (productName: string) => {
    return requiredIngredients.some(
      ing => !ing.collected && ing.name.toLowerCase().includes(productName.toLowerCase())
    )
  }

  const getPersonalityResponse = (
    personality: 'friendly' | 'strict' | 'humorous',
    offer: number,
    basePrice: number,
    attemptNumber: number
  ): { response: string; accepted: boolean } => {
    const discount = ((basePrice - offer) / basePrice) * 100

    if (discount < 5) {
      return { 
        response: "Okay lah, good price already!", 
        accepted: true 
      }
    }

    if (discount < 15) {
      if (personality === 'friendly') {
        return {
          response: attemptNumber > 1 
            ? "Aiyo, okay lah for you! Take take!" 
            : "Hmm... can you add a bit more?",
          accepted: attemptNumber > 1
        }
      } else if (personality === 'strict') {
        return {
          response: attemptNumber > 2
            ? "Last price! Cannot go lower!"
            : "Too low! You try again!",
          accepted: attemptNumber > 2
        }
      } else {
        return {
          response: attemptNumber > 1
            ? "Wah you very good at bargaining! Okay deal!"
            : "You trying to rob me ah? Haha add a bit more lah!",
          accepted: attemptNumber > 1
        }
      }
    }

    if (discount < 25) {
      if (personality === 'friendly') {
        return {
          response: "Sorry ah, cannot go so low... maybe add $1 more?",
          accepted: false
        }
      } else if (personality === 'strict') {
        return {
          response: "Cannot! This one fresh from farm this morning!",
          accepted: false
        }
      } else {
        return {
          response: "Wah lau! You want me to close shop ah? Too cheap liao!",
          accepted: false
        }
      }
    }

    return {
      response: personality === 'strict'
        ? "Don't play play! Serious customers only!"
        : "No no no, cannot cannot! Too low already!",
      accepted: false
    }
  }

  const attemptBargain = () => {
    if (!selectedProduct || bargainPrice <= 0) return

    const stall = marketStalls.find(s => s.id === selectedStall)
    if (!stall) return

    const attempt = bargainHistory.length + 1
    const result = getPersonalityResponse(
      stall.stallkeeper.personality,
      bargainPrice,
      selectedProduct.basePrice,
      attempt
    )

    setBargainHistory([...bargainHistory, {
      offer: bargainPrice,
      response: result.response,
      accepted: result.accepted
    }])

    if (result.accepted) {
      // Add to cart
      setCart([...cart, {
        product: selectedProduct,
        quantity: 1,
        finalPrice: bargainPrice
      }])

      // Mark ingredient as collected if it matches
      if (isRequired(selectedProduct.name)) {
        markIngredientCollected(selectedProduct.name, 'wet_market')
      }

      alert(`✅ Deal! You bought ${selectedProduct.name} for $${bargainPrice.toFixed(2)}!`)
      setSelectedProduct(null)
      setBargainHistory([])
      setBargainPrice(0)
    }
  }

  const calculateSavings = () => {
    return cart.reduce((sum, item) => {
      return sum + (item.product.basePrice - item.finalPrice)
    }, 0)
  }

  const completeShopping = () => {
    const totalSpent = cart.reduce((sum, item) => sum + item.finalPrice, 0)
    const savings = calculateSavings()
    
    if (spendMoney(currentPlayerId, totalSpent)) {
      // Calculate earnings based on bargaining success
      const earnings = Math.floor(savings * 0.5) + 8 // Base + bonus

      addCompletedActivity({
        id: `wet-market-${Date.now()}`,
        type: 'market_roleplay',
        timestamp: new Date().toISOString(),
        earnings,
        participants: [currentPlayerId],
        details: {
          itemsPurchased: cart.length,
          totalSpent,
          savings,
          bargainSuccessRate: cart.length / (cart.length + bargainHistory.length)
        }
      })

      alert(`🎉 Shopping complete!\n💰 Spent: $${totalSpent.toFixed(2)}\n💚 Saved: $${savings.toFixed(2)}\n⭐ Earned: $${earnings}!`)
      onClose()
    } else {
      alert(`❌ Insufficient cash! Need $${totalSpent.toFixed(2)}, have $${player?.cash.toFixed(2)}`)
    }
  }

  if (!player) return null

  const currentStall = marketStalls.find(s => s.id === selectedStall)

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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Wet Market</h2>
                  <p className="text-orange-100 text-sm">Traditional Singapore Shopping Experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
              <div>
                <p className="text-xs text-orange-100">Your Cash</p>
                <p className="text-xl font-bold">${player.cash.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-orange-100">Cart ({cart.length})</p>
                <p className="text-xl font-bold">
                  ${cart.reduce((sum, item) => sum + item.finalPrice, 0).toFixed(2)}
                </p>
              </div>
              {cart.length > 0 && (
                <div>
                  <p className="text-xs text-orange-100">Saved</p>
                  <p className="text-xl font-bold text-green-300">
                    ${calculateSavings().toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {!selectedStall ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Choose a Stall</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {marketStalls.map((stall) => (
                    <motion.button
                      key={stall.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStall(stall.id)}
                      className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 text-left hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                          {stall.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{stall.name}</h4>
                          <p className="text-sm text-gray-600">{stall.stallkeeper.name}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{stall.products.length} products available</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : !selectedProduct ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedStall(null)}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                    >
                      ←
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{currentStall?.name}</h3>
                      <p className="text-sm text-gray-600">
                        🙋 {currentStall?.stallkeeper.name} • {currentStall?.stallkeeper.personality}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentStall?.products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedProduct(product)
                        setBargainPrice(product.basePrice * 0.9) // Start at 10% discount
                      }}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        isRequired(product.name)
                          ? 'border-green-400 bg-green-50 shadow-lg ring-2 ring-green-200'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      {isRequired(product.name) && (
                        <div className="mb-2">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            ✓ Needed
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{product.name}</h4>
                        <span className="text-lg font-bold text-orange-600">
                          ${product.basePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{product.unit}</span>
                        <span>•</span>
                        <span className="capitalize">{product.quality}</span>
                        <span>•</span>
                        <span>Fresh: {product.freshness}/10</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      setSelectedProduct(null)
                      setBargainHistory([])
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    ←
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">Bargain Time!</h3>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{selectedProduct.unit}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedProduct.quality}</span>
                    <span>•</span>
                    <span>Freshness: {selectedProduct.freshness}/10</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-sm text-gray-600">Starting Price</p>
                    <p className="text-3xl font-bold text-gray-900">${selectedProduct.basePrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Bargain Interface */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Offer
                  </label>
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={bargainPrice || ''}
                          onChange={(e) => setBargainPrice(parseFloat(e.target.value) || 0)}
                          step="0.50"
                          min="0"
                          max={selectedProduct.basePrice}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl text-lg font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="mt-2 flex gap-2">
                        {[0.7, 0.8, 0.9].map(mult => (
                          <button
                            key={mult}
                            onClick={() => setBargainPrice(selectedProduct.basePrice * mult)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-xs font-medium transition-all"
                          >
                            {Math.round((1 - mult) * 100)}% off
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={attemptBargain}
                      disabled={bargainPrice <= 0 || bargainPrice > selectedProduct.basePrice}
                      className="px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Offer
                    </button>
                  </div>

                  {bargainPrice > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">You're offering:</span>
                        <span className="font-bold text-gray-900">${bargainPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-bold text-green-600">
                          {Math.round(((selectedProduct.basePrice - bargainPrice) / selectedProduct.basePrice) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bargain History */}
                {bargainHistory.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                    <h5 className="font-semibold text-gray-900 text-sm mb-3">Negotiation History</h5>
                    {bargainHistory.map((attempt, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg ${
                          attempt.accepted ? 'bg-green-100' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Attempt #{idx + 1}</span>
                          <span className="font-bold text-gray-900">${attempt.offer.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          💬 "{attempt.response}"
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Summary & Checkout */}
            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
              >
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Your Cart ({cart.length} items)
                </h4>
                <div className="space-y-2 mb-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.product.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through text-xs">
                          ${item.product.basePrice.toFixed(2)}
                        </span>
                        <span className="font-bold text-green-600">
                          ${item.finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-green-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total Savings</span>
                    <span className="font-bold text-green-600">
                      ${calculateSavings().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total to Pay</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${cart.reduce((sum, item) => sum + item.finalPrice, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={completeShopping}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Complete Shopping
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default WetMarketShopping
