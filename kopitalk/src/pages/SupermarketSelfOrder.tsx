import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Search, ShoppingCart, Plus, Minus, Trash2, HelpCircle,
  CreditCard, DollarSign, CheckCircle, Package, Filter, X,
  Sparkles, TrendingUp, Users, Monitor, BookOpen, Gamepad2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'

interface Product {
  id: string
  name: string
  category: 'vegetables' | 'meat' | 'seafood' | 'grains' | 'condiments' | 'dairy' | 'spices'
  price: number
  unit: string
  stock: number
  isRequired: boolean
  alreadyCollected: boolean
}

interface CartItem extends Product {
  quantity: number
}

type TutorialStep = 'welcome' | 'search' | 'categories' | 'select_item' | 'adjust_quantity' | 'add_to_cart' | 'checkout' | 'payment' | 'complete'

const SupermarketSelfOrder: React.FC = () => {
  const navigate = useNavigate()
  
  // Zustand selectors for optimal performance
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const markIngredientCollected = useGameStore(state => state.markIngredientCollected)
  const family_budget = useGameStore(state => state.family_budget)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const activeWeatherChallenge = useGameStore(state => state.activeWeatherChallenge)
  const players = useGameStore(state => state.players)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('welcome')
  const [tutorialActive, setTutorialActive] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<Set<TutorialStep>>(new Set())

  // Helper function to check if ingredient is already collected
  const isIngredientCollected = (itemName: string): boolean => {
    return collectedIngredients.some(
      ing => ing.name.toLowerCase() === itemName.toLowerCase()
    )
  }

  // Helper function to infer category from ingredient name
  function inferCategory(ingredientName: string): string {
    const name = ingredientName.toLowerCase()
    if (/chicken|pork|beef|fish|prawn|seafood|meat|mutton|duck/.test(name)) return 'meat'
    if (/vegetable|carrot|onion|garlic|ginger|chili|tomato|cucumber|lettuce|cabbage|bok choy|kailan|spinach|broccoli/.test(name)) return 'vegetables'
    if (/rice|noodle|flour|sugar|salt|oil|sauce|pasta|bread/.test(name)) return 'grains'
    if (/milk|cheese|yogurt|butter|egg|cream/.test(name)) return 'dairy'
    if (/soy sauce|oyster|vinegar|ketchup|paste|sambal|belacan/.test(name)) return 'condiments'
    if (/pepper|chili|spice|curry/.test(name)) return 'spices'
    return 'grains'
  }

  // Generate products based on dish challenge
  const products: Product[] = useMemo(() => {
    const requiredIngredients = dishChallenge?.ingredients || []
    const items: Product[] = []
    
    // Add required ingredients
    requiredIngredients.forEach((ingredient, index) => {
      const category = inferCategory(ingredient.name) as any
      const alreadyCollected = isIngredientCollected(ingredient.name)
      const basePrice = Math.random() * 4 + 2
      const priceMultiplier = activeWeatherChallenge?.effects.priceMultiplier || 1
      
      items.push({
        id: `required-${index}`,
        name: ingredient.name,
        category,
        price: basePrice * priceMultiplier,
        unit: ingredient.unit || 'piece',
        stock: 50,
        isRequired: true,
        alreadyCollected
      })
    })
    
    // Add common supermarket items
    const commonItems = [
      { id: 'veg-1', name: 'Chinese Cabbage', category: 'vegetables', price: 2.50, unit: 'kg', stock: 50 },
      { id: 'veg-2', name: 'Bok Choy', category: 'vegetables', price: 1.80, unit: 'kg', stock: 40 },
      { id: 'veg-3', name: 'Spring Onions', category: 'vegetables', price: 1.20, unit: 'bunch', stock: 30 },
      { id: 'meat-1', name: 'Chicken Breast', category: 'meat', price: 8.90, unit: 'kg', stock: 30 },
      { id: 'meat-2', name: 'Pork Belly', category: 'meat', price: 12.50, unit: 'kg', stock: 25 },
      { id: 'seafood-1', name: 'Fish Fillet', category: 'seafood', price: 18.00, unit: 'kg', stock: 15 },
      { id: 'grain-1', name: 'Jasmine Rice', category: 'grains', price: 12.00, unit: '5kg', stock: 40 },
      { id: 'grain-2', name: 'Egg Noodles', category: 'grains', price: 2.50, unit: 'pack', stock: 50 },
      { id: 'sauce-1', name: 'Soy Sauce', category: 'condiments', price: 4.50, unit: 'bottle', stock: 60 },
      { id: 'sauce-2', name: 'Oyster Sauce', category: 'condiments', price: 5.20, unit: 'bottle', stock: 50 },
      { id: 'dairy-1', name: 'Fresh Eggs', category: 'dairy', price: 5.50, unit: '10pcs', stock: 70 },
      { id: 'spice-1', name: 'White Pepper', category: 'spices', price: 3.20, unit: 'pack', stock: 30 }
    ]
    
    commonItems.forEach(item => {
      if (!items.find(i => i.name.toLowerCase() === item.name.toLowerCase())) {
        items.push({
          ...item,
          category: item.category as any,
          isRequired: false,
          alreadyCollected: false
        })
      }
    })
    
    return items
  }, [dishChallenge, collectedIngredients, activeWeatherChallenge])

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'vegetables', name: 'Vegetables', icon: '��' },
    { id: 'meat', name: 'Meat & Poultry', icon: '🍖' },
    { id: 'seafood', name: 'Seafood', icon: '🐟' },
    { id: 'grains', name: 'Rice & Noodles', icon: '🍚' },
    { id: 'condiments', name: 'Sauces', icon: '🧂' },
    { id: 'dairy', name: 'Eggs & Dairy', icon: '🥚' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
  ]

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [searchQuery, selectedCategory, products])

  // Tutorial system
  const tutorialSteps = {
    welcome: {
      title: "Welcome to Self-Order Kiosk!",
      content: "Hi! I'm here to help you learn how to use this digital kiosk. Many supermarkets now have these self-service stations. Let's go through it step by step!",
      highlight: "",
      action: "Let's Start!"
    },
    search: {
      title: "Step 1: Search for Items",
      content: "You can type the name of any product you're looking for in this search box. Try typing something like 'rice' or 'chicken'.",
      highlight: "search-bar",
      action: "Try searching!"
    },
    categories: {
      title: "Step 2: Browse Categories", 
      content: "You can also browse by category. Each category has a picture to make it easy to understand. Tap on 'Vegetables' to see what's available.",
      highlight: "categories",
      action: "Select a category!"
    },
    select_item: {
      title: "Step 3: Select an Item",
      content: "Great! Now tap on any item you want to buy. Items with green borders are needed for your recipe.",
      highlight: "products",
      action: "Select an item!"
    },
    adjust_quantity: {
      title: "Step 4: Adjust Quantity",
      content: "You can increase or decrease the quantity using the + and - buttons. Very simple!",
      highlight: "quantity-controls",
      action: "Adjust quantity!"
    },
    add_to_cart: {
      title: "Step 5: Add to Cart",
      content: "When you're happy with the quantity, tap 'Add to Cart'. The item will be saved for checkout.",
      highlight: "add-to-cart",
      action: "Add to cart!"
    },
    checkout: {
      title: "Step 6: View Your Cart",
      content: "Click the cart icon to see all your selected items. You can review everything before paying.",
      highlight: "cart-button",
      action: "Open cart!"
    },
    payment: {
      title: "Step 7: Choose Payment",
      content: "Select how you want to pay - with cash or card. Both options are safe and secure.",
      highlight: "payment-methods",
      action: "Choose payment!"
    },
    complete: {
      title: "Congratulations! 🎉",
      content: "You've successfully learned how to use a self-order kiosk! This knowledge will help you shop independently at many modern supermarkets.",
      highlight: "",
      action: "Complete Tutorial!"
    }
  }

  const currentTutorial = tutorialSteps[tutorialStep]

  const nextTutorialStep = () => {
    const steps: TutorialStep[] = ['welcome', 'search', 'categories', 'select_item', 'adjust_quantity', 'add_to_cart', 'checkout', 'payment', 'complete']
    const currentIndex = steps.indexOf(tutorialStep)
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      setTutorialStep(nextStep)
      setCompletedSteps(prev => new Set([...prev, tutorialStep]))
    }
  }

  // Cart functions
  const addToCart = (product: Product) => {
    if (product.alreadyCollected) return
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })

    if (tutorialActive && tutorialStep === 'select_item') {
      nextTutorialStep()
    }
  }

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change
          if (newQuantity <= 0) return item
          if (newQuantity > item.stock) return item
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(item => item.quantity > 0)
    )

    if (tutorialActive && tutorialStep === 'adjust_quantity') {
      nextTutorialStep()
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    if (cartTotal > family_budget) {
      alert(`❌ Not enough budget! Need $${cartTotal.toFixed(2)} but only have $${family_budget.toFixed(2)}`)
      return
    }

    if (!paymentMethod) {
      alert('Please select a payment method')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      // Calculate earnings and mark ingredients as collected
      const requiredItemsInCart = cart.filter(item => item.isRequired)
      const earnings = Math.floor(requiredItemsInCart.length * 2.5) + 8 // $8 base + $2.5 per required ingredient
      
      // Mark ingredients as collected
      cart.forEach(item => {
        if (item.isRequired && !item.alreadyCollected) {
          markIngredientCollected(item.name, 'supermarket')
        }
      })

      // Update budget (deduct cost, add earnings)
      updateFamilyBudget(family_budget - cartTotal + earnings)

      // Track activity
      addCompletedActivity({
        id: `supermarket-${Date.now()}`,
        type: 'digital_skills',
        earnings,
        timestamp: new Date().toISOString(),
        participants: players.map(p => p.id),
        details: `Completed self-order kiosk tutorial - collected ${requiredItemsInCart.length} required ingredients`
      })

      setIsProcessing(false)
      setTutorialActive(false)
      setTutorialStep('complete')
      
      // Show success modal after brief delay
      setTimeout(() => {
        navigate('/game')
      }, 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {tutorialActive && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{currentTutorial.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{currentTutorial.content}</p>
              
              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-6">
                {Object.keys(tutorialSteps).map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded ${
                      completedSteps.has(step as TutorialStep) || step === tutorialStep
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setTutorialActive(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold min-h-[44px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skip Tutorial
                </motion.button>
                <motion.button
                  onClick={nextTutorialStep}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold min-h-[44px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentTutorial.action}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={() => navigate('/game')}
              className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-lg min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-medium">Back to Game</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm opacity-90">Budget</p>
                <p className="text-lg font-bold">${family_budget.toFixed(2)}</p>
              </div>
              
              <motion.button
                onClick={() => {
                  setShowCart(true)
                  if (tutorialActive && tutorialStep === 'checkout') {
                    nextTutorialStep()
                  }
                }}
                className={`relative flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-lg min-h-[44px] ${
                  tutorialStep === 'checkout' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                onClick={() => setTutorialActive(true)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors min-h-[44px] min-w-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HelpCircle className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Self-Order Kiosk Tutorial</h1>
          <p className="text-lg opacity-90">Learn digital shopping skills step by step</p>
        </div>
      </div>

      {/* Challenge Info */}
      {dishChallenge && (
        <motion.div
          className="max-w-7xl mx-auto p-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Shopping for: {dishChallenge.dish_name}</h3>
                <p className="text-sm text-gray-700">
                  Need {dishChallenge.ingredients.filter(i => !isIngredientCollected(i.name)).length} more ingredients
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Search Bar */}
        <div className={`bg-white rounded-2xl p-4 shadow-md mb-6 ${
          tutorialStep === 'search' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
        }`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (tutorialActive && tutorialStep === 'search' && e.target.value.length > 0) {
                  nextTutorialStep()
                }
              }}
              placeholder="Search products... (Try 'rice' or 'chicken')"
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none min-h-[44px]"
            />
          </div>
        </div>

        {/* Categories */}
        <div className={`bg-white rounded-2xl p-4 shadow-md mb-6 ${
          tutorialStep === 'categories' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800 text-lg">Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  if (tutorialActive && tutorialStep === 'categories') {
                    nextTutorialStep()
                  }
                }}
                className={`p-4 rounded-xl text-center transition-all min-h-[80px] ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-sm font-medium">{cat.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${
          tutorialStep === 'select_item' ? 'ring-4 ring-yellow-400 ring-opacity-50 rounded-xl p-2' : ''
        }`}>
          {filteredProducts.map(product => {
            const inCart = cart.find(item => item.id === product.id)

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-md overflow-hidden ${
                  product.isRequired ? 'ring-2 ring-green-400' : ''
                } ${
                  product.alreadyCollected ? 'opacity-60' : ''
                }`}
              >
                {/* Product Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg flex-1">
                      {product.name}
                    </h3>
                    {product.isRequired && (
                      <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                        {product.alreadyCollected ? 'Collected' : 'Required'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{product.unit}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </div>
                  </div>

                  {product.alreadyCollected ? (
                    <div className="w-full py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold text-lg text-center">
                      Already Collected
                    </div>
                  ) : inCart ? (
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                      <motion.button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-5 h-5 text-gray-700" />
                      </motion.button>
                      <span className="text-xl font-semibold text-gray-800 px-4">
                        {inCart.quantity}
                      </span>
                      <motion.button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-5 h-5 text-gray-700" />
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-5 h-5" />
                      Add to Cart
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Cart Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Cart</h2>
                  <motion.button
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
                <p className="text-sm opacity-90 mt-1">{cartItemCount} items</p>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className={`rounded-xl p-4 ${
                        item.isRequired ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} per {item.unit}</p>
                            {item.isRequired && (
                              <span className="text-xs text-green-600 font-medium">✓ Required ingredient</span>
                            )}
                          </div>
                          <motion.button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors min-h-[44px] min-w-[44px]"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 bg-white rounded hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="font-medium px-2 text-lg">{item.quantity}</span>
                            <motion.button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 bg-white rounded hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <div className="text-lg font-bold text-blue-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Section */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  {/* Payment Method */}
                  <div className={tutorialStep === 'payment' ? 'ring-4 ring-yellow-400 ring-opacity-50 rounded-xl p-2' : ''}>
                    <p className="font-semibold text-gray-800 mb-3">Payment Method:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        onClick={() => {
                          setPaymentMethod('cash')
                          if (tutorialActive && tutorialStep === 'payment') {
                            setTimeout(() => nextTutorialStep(), 500)
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all min-h-[80px] ${
                          paymentMethod === 'cash'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <DollarSign className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-sm font-medium">Cash</div>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setPaymentMethod('card')
                          if (tutorialActive && tutorialStep === 'payment') {
                            setTimeout(() => nextTutorialStep(), 500)
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all min-h-[80px] ${
                          paymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-sm font-medium">Card</div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between text-lg font-semibold mb-2">
                      <span>Total:</span>
                      <span className="text-2xl text-blue-600">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Budget Available:</span>
                      <span className={family_budget >= cartTotal ? 'text-green-600' : 'text-red-600'}>
                        ${family_budget.toFixed(2)}
                      </span>
                    </div>
                    {cart.filter(c => c.isRequired).length > 0 && (
                      <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg mt-2">
                        <span className="text-sm text-green-800 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Tutorial completion bonus
                        </span>
                        <span className="text-lg font-bold text-green-700">
                          +${(Math.floor(cart.filter(c => c.isRequired).length * 2.5) + 8).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    onClick={handleCheckout}
                    disabled={!paymentMethod || family_budget < cartTotal || isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Complete Purchase
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {tutorialStep === 'complete' && !tutorialActive && (
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
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutorial Complete! 🎉</h2>
              <p className="text-gray-600 mb-4">
                You've successfully learned how to use a self-order kiosk! This digital skill will help you shop independently.
              </p>
              <div className="bg-green-100 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 text-green-800">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Skills Learned</span>
                </div>
                <ul className="text-sm text-green-700 mt-2 text-left">
                  <li>• Digital kiosk navigation</li>
                  <li>• Product searching and selection</li>
                  <li>• Digital payment methods</li>
                  <li>• Independent grocery shopping</li>
                </ul>
              </div>
              <motion.button
                onClick={() => navigate('/game')}
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
  )
}

export default SupermarketSelfOrder
