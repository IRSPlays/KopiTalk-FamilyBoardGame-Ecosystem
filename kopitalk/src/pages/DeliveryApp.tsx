import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Package, Clock, ShoppingCart, Check, X, AlertCircle, 
  Sparkles, DollarSign, TrendingUp, Users, CheckCircle2,
  ShoppingBag, Bike, MapPin, Star, Plus, Minus, Gamepad2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import Breadcrumb from '../components/Breadcrumb'
import { navigateToGame } from '../utils/navigationHelper'

interface DeliveryItem {
  id: string
  name: string
  category: 'fresh_produce' | 'meat_seafood' | 'pantry' | 'dairy' | 'condiments'
  price: number
  unit: string
  isRequired: boolean
  alreadyCollected: boolean
  inStock: boolean
}

interface DeliveryStore {
  id: string
  name: string
  icon: string
  deliveryFee: number
  minOrder: number
  estimatedTime: string
  rating: number
  items: DeliveryItem[]
  specialOffer?: string
}

const DeliveryApp: React.FC = () => {
  const navigate = useNavigate()
  
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const markIngredientCollected = useGameStore(state => state.markIngredientCollected)
  const family_budget = useGameStore(state => state.family_budget)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  const deductFamilyBudget = useGameStore(state => state.deductFamilyBudget)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const activeWeatherChallenge = useGameStore(state => state.activeWeatherChallenge)
  
  const [selectedStore, setSelectedStore] = useState<DeliveryStore | null>(null)
  const [cart, setCart] = useState<{ item: DeliveryItem; quantity: number }[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [deliveryComplete, setDeliveryComplete] = useState(false)

  // ✅ Show loading state if dishChallenge hasn't loaded yet
  if (!dishChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Package className="w-16 h-16 text-blue-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Delivery App...</h2>
          <p className="text-gray-600">Preparing your shopping experience</p>
        </motion.div>
      </div>
    )
  }
  const [showStoreSelectionModal, setShowStoreSelectionModal] = useState(true) // Show modal on entry

  const isIngredientCollected = (itemName: string): boolean => {
    return collectedIngredients.some(
      ing => ing.name.toLowerCase() === itemName.toLowerCase() && ing.collected === true
    )
  }

  function inferCategory(ingredientName: string): string {
    const name = ingredientName.toLowerCase()
    if (/chicken|pork|beef|fish|prawn|seafood|meat|mutton|duck/.test(name)) return 'meat_seafood'
    if (/vegetable|carrot|onion|garlic|ginger|chili|tomato|cucumber|lettuce|cabbage|bok choy|kailan|spinach|broccoli/.test(name)) return 'fresh_produce'
    if (/rice|noodle|flour|sugar|salt|oil|sauce|pasta|bread/.test(name)) return 'pantry'
    if (/milk|cheese|yogurt|butter|egg|cream/.test(name)) return 'dairy'
    if (/soy sauce|oyster|vinegar|ketchup|paste|sambal|belacan/.test(name)) return 'condiments'
    return 'pantry'
  }

  const stores: DeliveryStore[] = useMemo(() => {
    const requiredIngredients = dishChallenge?.ingredients || []
    
    const generateStoreItems = (categories: string[]): DeliveryItem[] => {
      const items: DeliveryItem[] = []
      
      requiredIngredients.forEach((ingredient, index) => {
        const category = inferCategory(ingredient.name)
        if (categories.includes(category)) {
          const alreadyCollected = isIngredientCollected(ingredient.name)
          const basePrice = Math.random() * 4 + 2
          const priceMultiplier = activeWeatherChallenge?.effects.priceMultiplier || 1
          
          items.push({
            id: `required-${index}`,
            name: ingredient.name,
            category: category as any,
            price: basePrice * priceMultiplier,
            unit: ingredient.unit || 'piece',
            isRequired: true,
            alreadyCollected,
            inStock: !alreadyCollected
          })
        }
      })
      
      if (categories.includes('fresh_produce')) {
        items.push(
          { id: 'veg-1', name: 'Bok Choy', category: 'fresh_produce', price: 2.50, unit: 'bunch', isRequired: false, alreadyCollected: false, inStock: true },
          { id: 'veg-2', name: 'Cherry Tomatoes', category: 'fresh_produce', price: 3.20, unit: 'pack', isRequired: false, alreadyCollected: false, inStock: true }
        )
      }
      if (categories.includes('meat_seafood')) {
        items.push(
          { id: 'meat-1', name: 'Fresh Prawns', category: 'meat_seafood', price: 12.80, unit: 'kg', isRequired: false, alreadyCollected: false, inStock: true },
          { id: 'meat-2', name: 'Chicken Thigh', category: 'meat_seafood', price: 8.50, unit: 'kg', isRequired: false, alreadyCollected: false, inStock: true }
        )
      }
      if (categories.includes('pantry')) {
        items.push(
          { id: 'pantry-1', name: 'Jasmine Rice', category: 'pantry', price: 5.90, unit: '2kg', isRequired: false, alreadyCollected: false, inStock: true },
          { id: 'pantry-2', name: 'Sesame Oil', category: 'pantry', price: 4.50, unit: 'bottle', isRequired: false, alreadyCollected: false, inStock: true }
        )
      }
      
      return items
    }

    return [
      {
        id: 'fairprice',
        name: 'FairPrice Online',
        icon: '🛒',
        deliveryFee: 2.99,
        minOrder: 20,
        estimatedTime: '2-3 hours',
        rating: 4.5,
        items: generateStoreItems(['fresh_produce', 'pantry', 'dairy']),
        specialOffer: 'Free delivery over $60'
      },
      {
        id: 'coldstorage',
        name: 'Cold Storage',
        icon: '❄️',
        deliveryFee: 3.99,
        minOrder: 30,
        estimatedTime: '3-4 hours',
        rating: 4.6,
        items: generateStoreItems(['meat_seafood', 'dairy', 'pantry']),
        specialOffer: '$5 off first order'
      },
      {
        id: 'redmart',
        name: 'RedMart',
        icon: '🔴',
        deliveryFee: 0,
        minOrder: 40,
        estimatedTime: '1-2 days',
        rating: 4.7,
        items: generateStoreItems(['fresh_produce', 'meat_seafood', 'pantry', 'condiments']),
        specialOffer: 'Free delivery always!'
      },
      {
        id: 'shengsiong',
        name: 'ShengSiong Online',
        icon: '🏪',
        deliveryFee: 2.50,
        minOrder: 25,
        estimatedTime: '4-5 hours',
        rating: 4.4,
        items: generateStoreItems(['fresh_produce', 'pantry', 'condiments']),
        specialOffer: '10% off fresh produce'
      }
    ]
  }, [dishChallenge, collectedIngredients, activeWeatherChallenge])

  const addToCart = (item: DeliveryItem) => {
    if (!item.inStock) return
    
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) {
        return prev.map(c => 
          c.item.id === item.id 
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(c => c.item.id !== itemId))
      return
    }
    setCart(prev => prev.map(c => 
      c.item.id === itemId ? { ...c, quantity: newQuantity } : c
    ))
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const deliveryFee = selectedStore?.deliveryFee || 0
    return subtotal + deliveryFee
  }

  const handleCheckout = () => {
    if (!selectedStore) return
    
    const total = calculateTotal()
    
    console.log(`🛒 [DELIVERY APP] Checkout initiated:`, {
      store: selectedStore.name,
      cartItems: cart.length,
      total,
      currentBudget: family_budget
    })
    
    // Check if can afford
    if (total > family_budget) {
      alert(`Not enough budget! Need $${total.toFixed(2)} but only have $${family_budget.toFixed(2)}`)
      return
    }

    // Deduct the total cost from family budget
    console.log(`🛒 [DELIVERY APP] Attempting to deduct $${total}...`)
    const deducted = deductFamilyBudget(total)
    if (!deducted) {
      alert(`Failed to deduct budget!`)
      console.error(`❌ [DELIVERY APP] Deduction failed!`)
      return
    }
    console.log(`✅ [DELIVERY APP] Budget deducted successfully`)

    const requiredItemsInCart = cart.filter(c => c.item.isRequired)
    const earnings = Math.floor(requiredItemsInCart.length * 3.5) + 10

    console.log(`🛒 [DELIVERY APP] Marking ${requiredItemsInCart.length} ingredients as collected`)
    // Mark ingredients as collected
    cart.forEach(c => {
      if (c.item.isRequired && !c.item.alreadyCollected) {
        markIngredientCollected(c.item.name, 'delivery')
        console.log(`✅ [DELIVERY APP] Marked "${c.item.name}" as collected`)
      }
    })

    // Add the earnings from completing the activity
    console.log(`🛒 [DELIVERY APP] Adding earnings: $${earnings}`)
    updateFamilyBudget(earnings)

    addCompletedActivity({
      id: `delivery-${Date.now()}`,
      type: 'digital_skills',
      earnings,
      timestamp: new Date().toISOString(),
      participants: [],
      details: `Ordered from ${selectedStore.name} - collected ${requiredItemsInCart.length} required ingredients`
    })

    setDeliveryComplete(true)
    setCart([])
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Game', path: '/game' },
          { label: 'Delivery App', path: undefined, isActive: true }
        ]}
        onBack={() => navigateToGame(navigate)}
      />

      {/* Supermarket Selection Modal - Shows on entry */}
      <AnimatePresence>
        {showStoreSelectionModal && !selectedStore && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStoreSelectionModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Choose Your Supermarket</h2>
                </div>
                <p className="text-gray-600">Select where you want to order your ingredients from</p>
                {dishChallenge && (
                  <div className="mt-3 bg-purple-50 rounded-lg p-3">
                    <p className="text-sm text-purple-900">
                      <strong>Challenge:</strong> {dishChallenge.dish_name}
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      {dishChallenge.ingredients.length} ingredients needed
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                {stores.map((store, index) => (
                  <motion.button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store)
                      setShowStoreSelectionModal(false)
                    }}
                    className="w-full bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{store.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{store.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{store.rating}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{store.estimatedTime}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Bike className="w-4 h-4" />
                            <span className="font-semibold text-blue-600">
                              ${store.deliveryFee.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        {store.specialOffer && (
                          <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            <Sparkles className="w-3 h-3" />
                            {store.specialOffer}
                          </div>
                        )}
                      </div>
                      <div className="text-blue-600">
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          →
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                <button
                  onClick={() => setShowStoreSelectionModal(false)}
                  className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium py-2"
                >
                  I'll choose later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => navigateToGame(navigate)}
            className="p-3 hover:bg-white rounded-lg transition-colors min-h-[44px] min-w-[44px]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Delivery Apps</h1>
            <p className="text-gray-600">Order ingredients for your dish</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-lg font-bold text-green-600">${family_budget.toFixed(2)}</p>
            </div>
            <motion.button
              onClick={() => setShowCheckout(true)}
              className="relative p-3 bg-blue-500 text-white rounded-lg min-h-[44px] min-w-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cart.length}
                </motion.div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {dishChallenge && (
          <motion.div
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Current Challenge</h3>
                <p className="text-sm text-gray-700">{dishChallenge.dish_name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Required ingredients: {dishChallenge.ingredients.filter(i => !isIngredientCollected(i.name)).length} remaining
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeWeatherChallenge && (
          <motion.div
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                <strong>{activeWeatherChallenge.type}!</strong> {activeWeatherChallenge.description}
                {activeWeatherChallenge.effects.priceMultiplier && ` (×${activeWeatherChallenge.effects.priceMultiplier})`}
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all ${
                selectedStore?.id === store.id 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedStore(store)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{store.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{store.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{store.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                {selectedStore?.id === store.id && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <p className="text-gray-600">
                    Delivery: <span className="font-semibold text-gray-900">${store.deliveryFee.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-600">
                    Min order: <span className="font-semibold text-gray-900">${store.minOrder}</span>
                  </p>
                </div>
                {store.specialOffer && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {store.specialOffer}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {selectedStore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Items</h2>
            
            {selectedStore.items.filter(item => item.isRequired && item.inStock).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Required for Your Dish
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedStore.items
                    .filter(item => item.isRequired && item.inStock)
                    .map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-300"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.2)" }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.unit}</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                          <motion.button
                            onClick={() => addToCart(item)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 min-h-[44px]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {selectedStore.items.filter(item => !item.isRequired && item.inStock).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Other Available Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedStore.items
                    .filter(item => !item.isRequired && item.inStock)
                    .map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.unit}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                          <motion.button
                            onClick={() => addToCart(item)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 min-h-[44px]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {selectedStore.items.filter(item => !item.inStock).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-500 mb-3">Out of Stock</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedStore.items
                    .filter(item => !item.inStock)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-100 rounded-lg p-4 border border-gray-300 opacity-60"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-600">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.unit}</p>
                          </div>
                          <X className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Already collected</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {showCheckout && cart.length > 0 && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h2>
                
                <div className="space-y-3 mb-6">
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className={`p-3 rounded-lg ${
                        cartItem.item.isRequired ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{cartItem.item.name}</h4>
                          <p className="text-sm text-gray-600">${cartItem.item.price.toFixed(2)} per {cartItem.item.unit}</p>
                          {cartItem.item.isRequired && (
                            <span className="text-xs text-green-600 font-medium">✓ Required ingredient</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="p-1 bg-gray-200 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="text-lg font-semibold w-8 text-center">{cartItem.quantity}</span>
                          <motion.button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="p-1 bg-gray-200 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <span className="text-lg font-bold">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>${(selectedStore?.deliveryFee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  {cart.filter(c => c.item.isRequired).length > 0 && (
                    <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg">
                      <span className="text-sm text-green-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Earnings for collecting ingredients
                      </span>
                      <span className="text-lg font-bold text-green-700">
                        +${(Math.floor(cart.filter(c => c.item.isRequired).length * 3.5) + 10).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold min-h-[44px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                  <motion.button
                    onClick={handleCheckout}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold min-h-[44px]"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Place Order
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deliveryComplete && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                <p className="text-gray-600 mb-6">
                  Your ingredients will be delivered to your home. Earnings have been added to your budget!
                </p>
                <motion.button
                  onClick={() => {
                    setDeliveryComplete(false)
                    navigateToGame(navigate)
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 min-h-[44px]"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Gamepad2 className="w-5 h-5" />
                  Back to Game
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default DeliveryApp
