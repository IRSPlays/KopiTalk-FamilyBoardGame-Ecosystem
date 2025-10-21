import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, X, Plus, Minus, DollarSign, CheckCircle, 
  ArrowLeft, Search, Filter, Package, CreditCard, Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useGameStore } from '../stores/gameStore'
import { Ingredient } from '../types'
import { useNavigate } from 'react-router-dom'
import { navigateToGame } from '../utils/navigationHelper'

interface SupermarketProduct {
  id: string
  name: string
  category: string
  price: number
  unit: string
  inStock: boolean
  image?: string
}

const SupermarketShopping: React.FC = () => {
  const navigate = useNavigate()
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const markIngredientCollected = useGameStore(state => state.markIngredientCollected)
  const family_budget = useGameStore(state => state.family_budget)
  const deductFamilyBudget = useGameStore(state => state.deductFamilyBudget)
  
  const [cart, setCart] = useState<Map<string, { product: SupermarketProduct; quantity: number }>>(new Map())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [checkoutStep, setCheckoutStep] = useState<'shopping' | 'scanning' | 'payment' | 'complete'>('shopping')

  // ✅ Fix blank page: Check if dish challenge exists
  if (!dishChallenge) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="mb-6">
            <Package className="w-20 h-20 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Challenge</h2>
            <p className="text-gray-600">
              You need an active dish challenge to shop for ingredients. Return to the game to generate one!
            </p>
          </div>
          <button
            onClick={() => navigateToGame(navigate)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Game
          </button>
        </motion.div>
      </div>
    )
  }

  // Generate available products from required ingredients
  const availableProducts: SupermarketProduct[] = React.useMemo(() => {
    if (!dishChallenge?.ingredients) return []
    
    return dishChallenge.ingredients.map((ingredient, index) => ({
      id: `product-${index}`,
      name: ingredient.name,
      category: 'other', // gameStore Ingredient doesn't have category
      price: 5.0, // Default price since gameStore Ingredient doesn't have estimated_cost
      unit: ingredient.unit,
      inStock: true
    }))
  }, [dishChallenge])

  const categories = ['all', 'vegetable', 'meat', 'seafood', 'spice', 'sauce', 'grain', 'other']

  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory && product.inStock
  })

  const addToCart = (product: SupermarketProduct) => {
    const newCart = new Map(cart)
    const existing = newCart.get(product.id)
    
    if (existing) {
      newCart.set(product.id, { product, quantity: existing.quantity + 1 })
      // ✅ Toast notification for quantity increase
      toast.success(`Added 1 more ${product.name}`, {
        icon: '🛒',
        duration: 2000,
      })
    } else {
      newCart.set(product.id, { product, quantity: 1 })
      // ✅ Toast notification for new item
      toast.success(`${product.name} added to cart!`, {
        icon: '✅',
        duration: 2500,
      })
    }
    
    setCart(newCart)
  }

  const removeFromCart = (productId: string) => {
    const newCart = new Map(cart)
    const existing = newCart.get(productId)
    
    if (existing && existing.quantity > 1) {
      newCart.set(productId, { ...existing, quantity: existing.quantity - 1 })
    } else {
      newCart.delete(productId)
    }
    
    setCart(newCart)
  }

  const clearCart = () => {
    setCart(new Map())
  }

  const cartTotal = Array.from(cart.values()).reduce(
    (sum, { product, quantity }) => sum + (product.price * quantity), 
    0
  )

  const cartItemCount = Array.from(cart.values()).reduce(
    (sum, { quantity }) => sum + quantity, 
    0
  )

  const handleCheckout = () => {
    if (cart.size === 0) return
    setCheckoutStep('scanning')
  }

  const handlePayment = () => {
    if (cartTotal > family_budget) {
      alert(`❌ Insufficient budget! You need $${cartTotal.toFixed(2)} but only have $${family_budget.toFixed(2)}`)
      return
    }

    // Deduct from family budget
    const success = deductFamilyBudget(cartTotal)
    
    if (success) {
      // Mark ingredients as collected
      cart.forEach(({ product }) => {
        markIngredientCollected(product.name, 'supermarket')
      })
      
      setCheckoutStep('complete')
      
      // Return to game after 3 seconds
      setTimeout(() => {
        navigate('/board-game')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateToGame(navigate)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Game</span>
            </button>
            
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Supermarket Shopping
            </h1>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Budget</p>
                <p className="text-lg font-bold text-green-600">${family_budget.toFixed(2)}</p>
              </div>
              <div className="relative">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {checkoutStep === 'shopping' && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Challenge Info */}
              {dishChallenge && (
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 mb-6 border-2 border-orange-300">
                  <h2 className="text-lg font-bold text-orange-900 mb-2">
                    🍳 Shopping for: {dishChallenge.dish_name}
                  </h2>
                  <p className="text-sm text-orange-800">
                    Collect the ingredients you need from the supermarket aisles
                  </p>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Product Listing */}
                <div className="lg:col-span-2">
                  {/* Search & Filter */}
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-md">
                    <div className="flex gap-3 mb-3">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                            selectedCategory === cat
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {filteredProducts.map(product => {
                      const isCollected = collectedIngredients.some(i => i.name === product.name)
                      
                      return (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`bg-white rounded-xl p-4 shadow-md border-2 ${
                            isCollected ? 'border-green-300 bg-green-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{product.name}</h3>
                              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                            </div>
                            {isCollected && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">per {product.unit}</p>
                            </div>
                            
                            {!isCollected && (
                              <button
                                onClick={() => addToCart(product)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="bg-white rounded-xl p-8 text-center">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No products found matching your search</p>
                    </div>
                  )}
                </div>

                {/* Shopping Cart */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl p-4 shadow-lg sticky top-24">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Your Cart ({cartItemCount})
                    </h2>

                    {cart.size === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                          {Array.from(cart.values()).map(({ product, quantity }) => (
                            <div key={product.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">${product.price.toFixed(2)} × {quantity}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                                <button
                                  onClick={() => addToCart(product)}
                                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <p className="text-sm font-bold text-gray-900">
                                ${(product.price * quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-blue-600">${cartTotal.toFixed(2)}</span>
                          </div>

                          <button
                            onClick={clearCart}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Clear Cart
                          </button>

                          <button
                            onClick={handleCheckout}
                            disabled={cart.size === 0}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg font-bold text-lg shadow-lg transition-all disabled:opacity-50"
                          >
                            <CreditCard className="w-5 h-5" />
                            Proceed to Self-Checkout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {checkoutStep === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  🛒 Self-Checkout Scanner
                </h2>

                <div className="bg-gray-100 rounded-xl p-6 mb-6">
                  <p className="text-center text-gray-600 mb-4">Scanning items...</p>
                  
                  <div className="space-y-3 mb-6">
                    {Array.from(cart.values()).map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">Qty: {quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-blue-600">${(product.price * quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex justify-between text-2xl font-bold mb-2">
                      <span>Total:</span>
                      <span className="text-blue-600">${cartTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Budget remaining: ${(family_budget - cartTotal).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('shopping')}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                  >
                    Back to Shopping
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-bold transition-all"
                  >
                    Pay ${cartTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {checkoutStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Purchase Complete! 🎉
                </h2>
                
                <p className="text-gray-600 mb-6">
                  You've successfully purchased {cartItemCount} items for ${cartTotal.toFixed(2)}
                </p>

                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-6">
                  <p className="text-green-800 font-medium">
                    ✅ Ingredients added to your collection
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  Returning to game...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SupermarketShopping
