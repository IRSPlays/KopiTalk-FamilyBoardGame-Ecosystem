import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Store, MessageSquare, Coins, Award, ShoppingBag, Fish, Leaf, Drumstick } from 'lucide-react'
import { useGameStore, Ingredient } from '../stores/gameStore'

interface WetMarketProps {
  currentPlayerId: number
  requiredIngredients: Ingredient[]
  onClose: () => void
  onPurchaseComplete?: (purchasedItems: string[], totalCost: number, earnings: number) => void
}

interface Stall {
  id: string
  name: string
  category: 'vegetable' | 'fish' | 'meat' | 'tofu'
  icon: React.ComponentType<any>
  color: string
  products: MarketProduct[]
}

interface MarketProduct {
  name: string
  price: number
  negotiablePrice: number
  freshness: number // 1-100
  tips: string
}

const WetMarketShopping: React.FC<WetMarketProps> = ({
  currentPlayerId,
  requiredIngredients,
  onClose,
  onPurchaseComplete
}) => {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)
  const [cart, setCart] = useState<{ product: MarketProduct; stallId: string }[]>([])
  const [negotiating, setNegotiating] = useState<MarketProduct | null>(null)
  const [offer, setOffer] = useState(0)
  const [negotiationResult, setNegotiationResult] = useState<'success' | 'failed' | null>(null)

  const player = useGameStore(state => state.players.find(p => p.id === currentPlayerId))
  const markIngredientCollected = useGameStore(state => state.markIngredientCollected)
  const family_budget = useGameStore(state => state.family_budget) // FIXED: Use family budget
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget) // FIXED: Use family budget
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  if (!player) return null

  const stalls: Stall[] = [
    {
      id: 'veg',
      name: 'Vegetable Stall',
      category: 'vegetable',
      icon: Leaf,
      color: 'from-green-500 to-green-600',
      products: [
        { name: 'Bok Choy', price: 2.50, negotiablePrice: 2.00, freshness: 95, tips: 'Look for bright green leaves, no yellowing' },
        { name: 'Chinese Cabbage', price: 3.00, negotiablePrice: 2.50, freshness: 90, tips: 'Check for firm, tightly packed leaves' },
        { name: 'Kai Lan', price: 2.80, negotiablePrice: 2.30, freshness: 92, tips: 'Stems should be crisp and snap easily' },
        { name: 'Spring Onion', price: 1.50, negotiablePrice: 1.20, freshness: 98, tips: 'Avoid wilted or slimy ones' },
        { name: 'Ginger', price: 2.00, negotiablePrice: 1.50, freshness: 100, tips: 'Skin should be smooth and firm' },
        { name: 'Garlic', price: 1.80, negotiablePrice: 1.50, freshness: 100, tips: 'Look for plump, firm bulbs' }
      ]
    },
    {
      id: 'fish',
      name: 'Fish Monger',
      category: 'fish',
      icon: Fish,
      color: 'from-blue-500 to-blue-600',
      products: [
        { name: 'Pomfret', price: 12.00, negotiablePrice: 10.00, freshness: 85, tips: 'Eyes should be clear, not cloudy. Gills should be bright red' },
        { name: 'Seabass', price: 15.00, negotiablePrice: 13.00, freshness: 90, tips: 'Flesh should be firm and spring back when pressed' },
        { name: 'Prawns', price: 18.00, negotiablePrice: 15.00, freshness: 88, tips: 'Look for translucent shells, avoid black spots' },
        { name: 'Squid', price: 8.00, negotiablePrice: 7.00, freshness: 92, tips: 'Should smell like the sea, not fishy' }
      ]
    },
    {
      id: 'meat',
      name: 'Butcher',
      category: 'meat',
      icon: Drumstick,
      color: 'from-red-500 to-red-600',
      products: [
        { name: 'Chicken Thigh', price: 8.00, negotiablePrice: 7.00, freshness: 95, tips: 'Meat should be pink, not grey. No strong smell' },
        { name: 'Pork Belly', price: 12.00, negotiablePrice: 10.00, freshness: 92, tips: 'Good ratio of meat to fat. Firm texture' },
        { name: 'Beef Slice', price: 15.00, negotiablePrice: 13.00, freshness: 90, tips: 'Bright red color. Marbling is good for flavor' },
        { name: 'Duck', price: 18.00, negotiablePrice: 15.00, freshness: 88, tips: 'Skin should be smooth, not sticky' }
      ]
    },
    {
      id: 'tofu',
      name: 'Tofu & Bean Products',
      category: 'tofu',
      icon: Store,
      color: 'from-yellow-500 to-yellow-600',
      products: [
        { name: 'Soft Tofu', price: 1.50, negotiablePrice: 1.20, freshness: 100, tips: 'Should be white, not yellowed. Store in water' },
        { name: 'Firm Tofu', price: 1.80, negotiablePrice: 1.50, freshness: 100, tips: 'Check expiry date. Should feel solid' },
        { name: 'Tau Kwa', price: 2.00, negotiablePrice: 1.70, freshness: 98, tips: 'Pressed tofu. Good for stir-frying' },
        { name: 'Bean Sprouts', price: 1.20, negotiablePrice: 1.00, freshness: 95, tips: 'Should be crisp and white. Use within 1 day' }
      ]
    }
  ]

  const isRequired = (productName: string) => {
    return requiredIngredients.some(ing => 
      ing.name.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(ing.name.toLowerCase())
    )
  }

  const startNegotiation = (product: MarketProduct) => {
    setNegotiating(product)
    setOffer(product.price)
    setNegotiationResult(null)
  }

  const handleNegotiate = () => {
    if (!negotiating) return

    const minAcceptable = negotiating.negotiablePrice
    const maxAcceptable = negotiating.price

    if (offer >= minAcceptable && offer <= maxAcceptable) {
      // Success! Add to cart at negotiated price
      setCart([...cart, { 
        product: { ...negotiating, price: offer }, 
        stallId: selectedStall?.id || '' 
      }])
      setNegotiationResult('success')
      setTimeout(() => {
        setNegotiating(null)
        setNegotiationResult(null)
      }, 1500)
    } else {
      setNegotiationResult('failed')
      setTimeout(() => {
        setNegotiationResult(null)
      }, 2000)
    }
  }

  const handleCheckout = () => {
    const totalCost = cart.reduce((sum, item) => sum + item.product.price, 0)
    const potentialSavings = cart.reduce((sum, item) => {
      const originalPrice = stalls
        .flatMap(s => s.products)
        .find(p => p.name === item.product.name)?.price || item.product.price
      return sum + (originalPrice - item.product.price)
    }, 0)

    // Calculate earnings based on negotiation success
    const earnings = Math.floor(potentialSavings * 2) + 5 // Base $5 + double the savings

    // FIXED: Use family_budget for family game
    if (family_budget >= totalCost) {
      // Deduct cost and add earnings
      updateFamilyBudget(-totalCost + earnings)
      
      // Mark collected ingredients
      cart.forEach(item => {
        markIngredientCollected(item.product.name, 'wet_market')
      })

      // Record activity (earnings added automatically by addCompletedActivity)
      addCompletedActivity({
        id: `market-${Date.now()}`,
        type: 'market_roleplay',
        timestamp: new Date().toISOString(),
        earnings: earnings,
        participants: [currentPlayerId],
        details: {
          items: cart.map(c => c.product.name),
          totalCost,
          savings: potentialSavings
        }
      })

      if (onPurchaseComplete) {
        onPurchaseComplete(cart.map(c => c.product.name), totalCost, earnings)
      }

      alert(`✅ Purchased ${cart.length} items for $${totalCost.toFixed(2)}!\n💰 Earned $${earnings} for family!\n💡 Saved $${potentialSavings.toFixed(2)} through negotiation!`)
      onClose()
    } else {
      alert(`❌ Insufficient funds! Need $${totalCost.toFixed(2)}, family has $${family_budget.toFixed(2)}`)
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price, 0)
  const cartCount = cart.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !selectedStall && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-3xl">
          <button
            onClick={() => selectedStall ? setSelectedStall(null) : onClose()}
            className="mb-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-10 h-10" />
              <div>
                <h2 className="text-2xl font-bold">Wet Market</h2>
                <p className="text-orange-100">Traditional Shopping Experience</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-100">Family Budget</p>
              <p className="text-2xl font-bold">${family_budget.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!selectedStall ? (
            // Stall Selection
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👵👴</div>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">💡 Elderly Wisdom:</p>
                    <p>Learn how to select fresh ingredients, negotiate prices, and build relationships with vendors. This is traditional Singapore shopping!</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose a Stall</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stalls.map((stall) => (
                  <motion.button
                    key={stall.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStall(stall)}
                    className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-orange-300 transition text-left shadow-lg"
                  >
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${stall.color} flex items-center justify-center mb-3`}>
                      <stall.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">{stall.name}</h4>
                    <p className="text-sm text-gray-600">{stall.products.length} products available</p>
                    {stall.products.some(p => isRequired(p.name)) && (
                      <div className="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Has required ingredients
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Cart Summary */}
              {cartCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 z-10"
                >
                  <ShoppingBag className="w-8 h-8" />
                  <div>
                    <p className="text-sm opacity-90">Cart ({cartCount} items)</p>
                    <p className="text-2xl font-bold">${cartTotal.toFixed(2)}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckout}
                    className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold ml-4"
                  >
                    Checkout
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            // Product Selection
            <div className="space-y-4">
              <div className={`bg-gradient-to-r ${selectedStall.color} text-white rounded-xl p-4 flex items-center gap-3`}>
                <selectedStall.icon className="w-8 h-8" />
                <h3 className="text-xl font-bold">{selectedStall.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStall.products.map((product, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white rounded-xl p-4 border-2 ${
                      isRequired(product.name) ? 'border-green-300 ring-2 ring-green-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          {product.name}
                          {isRequired(product.name) && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Required</span>}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-600">Freshness:</span>
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${product.freshness}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-green-600">{product.freshness}%</span>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-gray-900 ml-2">${product.price.toFixed(2)}</p>
                    </div>

                    <p className="text-xs text-gray-600 mb-3 italic">💡 {product.tips}</p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startNegotiation(product)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Negotiate Price
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Negotiation Modal */}
        <AnimatePresence>
          {negotiating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                  Negotiate: {negotiating.name}
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Original Price: ${negotiating.price.toFixed(2)}</p>
                  <p className="text-sm text-green-600 font-semibold mb-4">
                    Vendor will accept: ${negotiating.negotiablePrice.toFixed(2)} - ${negotiating.price.toFixed(2)}
                  </p>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Offer: ${offer.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min={negotiating.negotiablePrice * 0.8}
                    max={negotiating.price}
                    step={0.10}
                    value={offer}
                    onChange={(e) => setOffer(parseFloat(e.target.value))}
                    className="w-full mb-4"
                  />
                </div>

                {negotiationResult === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-4 text-center"
                  >
                    <p className="text-green-700 font-bold text-lg mb-1">✅ Deal Accepted!</p>
                    <p className="text-sm text-green-600">Added to cart at ${offer.toFixed(2)}</p>
                  </motion.div>
                )}

                {negotiationResult === 'failed' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4 text-center"
                  >
                    <p className="text-red-700 font-bold text-lg mb-1">❌ Too Low!</p>
                    <p className="text-sm text-red-600">Vendor rejected your offer. Try higher!</p>
                  </motion.div>
                )}

                {!negotiationResult && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNegotiating(null)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNegotiate}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold"
                    >
                      Make Offer
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default WetMarketShopping
