import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { 
  ChefHat, Clock, Flame, ThermometerSun, Trophy, Star, 
  ArrowLeft, AlertCircle, CheckCircle, Sparkles, Award
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import { useNavigate } from 'react-router-dom'
import { navigateToGame } from '../utils/navigationHelper'
import toast from 'react-hot-toast'

// Types
type CookingState = 'raw' | 'cooking' | 'perfect' | 'burnt'
type CookingMethod = 'stove' | 'grill' | 'oven'

interface Ingredient {
  id: string
  name: string
  image?: string
  cookingTime: number // seconds for perfect cook
  burnTime: number // seconds until burnt
  method: CookingMethod
}

interface CookingSlot {
  id: string
  ingredient: Ingredient | null
  state: CookingState
  timer: number // seconds elapsed
  startTime: number | null
}

// Draggable Ingredient Component
const DraggableIngredient: React.FC<{ ingredient: Ingredient; isUsed: boolean }> = ({ ingredient, isUsed }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
    disabled: isUsed,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.8 : 1,
  } : undefined

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative bg-white rounded-xl p-4 shadow-lg border-2 cursor-grab active:cursor-grabbing transition-all
        ${isUsed ? 'opacity-30 cursor-not-allowed' : 'border-orange-300 hover:border-orange-500 hover:shadow-2xl'}
        ${isDragging ? 'z-50 shadow-2xl ring-4 ring-orange-300 ring-opacity-50 scale-110' : 'z-10'}
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={!isUsed ? { scale: 1.05, y: -5, rotate: isDragging ? 0 : [0, -2, 2, 0] } : {}}
      whileTap={!isUsed ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Ingredient Icon/Emoji */}
      <div className="text-4xl text-center mb-2">{getIngredientEmoji(ingredient.name)}</div>
      
      {/* Ingredient Name */}
      <p className="text-sm font-semibold text-gray-800 text-center">{ingredient.name}</p>
      
      {/* Cooking Method Badge */}
      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-600">
        {ingredient.method === 'stove' && <Flame className="w-3 h-3 text-red-500" />}
        {ingredient.method === 'grill' && <ThermometerSun className="w-3 h-3 text-orange-500" />}
        <span className="capitalize">{ingredient.method}</span>
      </div>

      {isUsed && (
        <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
      )}
    </motion.div>
  )
}

// Droppable Cooking Appliance
const CookingAppliance: React.FC<{ 
  method: CookingMethod
  slot: CookingSlot
  onCook: (ingredientId: string) => void
}> = ({ method, slot, onCook }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${method}-slot`,
    data: { method },
  })

  const getApplianceEmoji = () => {
    switch (method) {
      case 'stove': return '🍳'
      case 'grill': return '🔥'
      case 'oven': return '🍞'
      default: return '🍳'
    }
  }

  const getStateColor = () => {
    switch (slot.state) {
      case 'raw': return 'bg-blue-100 border-blue-300'
      case 'cooking': return 'bg-yellow-100 border-yellow-400 animate-pulse'
      case 'perfect': return 'bg-green-100 border-green-400'
      case 'burnt': return 'bg-red-100 border-red-400'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getCookingProgress = () => {
    if (!slot.ingredient || !slot.startTime) return 0
    const elapsed = slot.timer
    const perfectTime = slot.ingredient.cookingTime
    return Math.min((elapsed / perfectTime) * 100, 100)
  }

  return (
    <motion.div
      ref={setNodeRef}
      className={`
        relative w-full h-48 rounded-2xl border-4 transition-all duration-300
        ${slot.ingredient ? getStateColor() : 'bg-gray-50 border-gray-300'}
        ${isOver && !slot.ingredient ? 'border-green-400 bg-green-50 scale-105' : ''}
      `}
      whileHover={!slot.ingredient ? { scale: 1.02 } : {}}
    >
      {/* Appliance Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <span className="text-2xl">{getApplianceEmoji()}</span>
          <span className="font-semibold text-gray-700 capitalize">{method}</span>
        </div>

        {slot.ingredient && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-mono text-sm font-bold">{slot.timer}s</span>
          </div>
        )}
      </div>

      {/* Cooking Slot Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!slot.ingredient ? (
          <motion.div 
            className="text-center text-gray-400"
            animate={isOver ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isOver ? Infinity : 0 }}
          >
            <div className="text-6xl mb-2">⬇️</div>
            <p className="text-sm font-medium">Drop {method} ingredients here</p>
          </motion.div>
        ) : (
          <div className="text-center relative">
            {/* Cooking Steam/Smoke Effect */}
            {slot.state === 'cooking' && (
              <>
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl opacity-70"
                  animate={{ y: [-20, -40], opacity: [0.7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                >
                  💨
                </motion.div>
                <motion.div
                  className="absolute -top-8 left-1/3 transform -translate-x-1/2 text-3xl opacity-60"
                  animate={{ y: [-15, -35], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                >
                  💨
                </motion.div>
              </>
            )}

            {/* Burnt Smoke Effect */}
            {slot.state === 'burnt' && (
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl"
                animate={{ y: [-20, -50], opacity: [0.9, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              >
                💨
              </motion.div>
            )}

            {/* Ingredient Being Cooked */}
            <motion.div
              className="text-6xl mb-3 relative z-10"
              animate={slot.state === 'cooking' ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : slot.state === 'burnt' ? {
                scale: [1, 0.9, 1],
                rotate: [0, -10, 10, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getIngredientEmoji(slot.ingredient.name)}
            </motion.div>

            <p className="text-lg font-bold text-gray-800">{slot.ingredient.name}</p>
            
            {/* Enhanced Cooking Progress Bar with Visual Feedback */}
            {slot.state === 'cooking' && (
              <div className="mt-4 space-y-2">
                {/* Linear Progress Bar */}
                <div className="w-40 mx-auto">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className={`h-full transition-colors duration-300 ${
                        getCookingProgress() < 50 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                          : getCookingProgress() < 80 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : 'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${getCookingProgress()}%` }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  </div>
                  {/* Progress Label */}
                  <p className="text-xs font-medium text-gray-600 mt-1 text-center">
                    {slot.timer}s / {slot.ingredient.cookingTime}s
                    {slot.timer >= slot.ingredient.cookingTime * 0.8 && (
                      <span className="ml-1 text-red-600 font-bold animate-pulse">⚠️ Almost Perfect!</span>
                    )}
                  </p>
                </div>

                {/* Circular Timer Indicator */}
                <div className="flex justify-center">
                  <svg width="60" height="60" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="30"
                      cy="30"
                      r="25"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                      cx="30"
                      cy="30"
                      r="25"
                      stroke={
                        getCookingProgress() < 50 
                          ? '#60a5fa' // blue
                          : getCookingProgress() < 80 
                          ? '#f59e0b' // orange
                          : '#ef4444' // red
                      }
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 25}`}
                      strokeDashoffset={`${2 * Math.PI * 25 * (1 - getCookingProgress() / 100)}`}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 2 * Math.PI * 25 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 25 * (1 - getCookingProgress() / 100) }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* State Badge with Enhanced Visual Feedback */}
            <motion.div
              className={`
                mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold shadow-lg
                ${slot.state === 'perfect' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' : ''}
                ${slot.state === 'burnt' ? 'bg-gradient-to-r from-red-400 to-red-600 text-white' : ''}
                ${slot.state === 'cooking' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : ''}
              `}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                ...(slot.state === 'perfect' && {
                  boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 10px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
                }),
                ...(slot.state === 'burnt' && {
                  boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)']
                })
              }}
              transition={{
                scale: { type: "spring", stiffness: 300, damping: 15 },
                rotate: { type: "spring", stiffness: 300, damping: 15 },
                boxShadow: { duration: 1.5, repeat: Infinity }
              }}
            >
              {slot.state === 'perfect' && (
                <>
                  <Star className="w-4 h-4" fill="currentColor" /> 
                  <span>Perfect! Click to collect</span>
                </>
              )}
              {slot.state === 'burnt' && (
                <>
                  <AlertCircle className="w-4 h-4" /> 
                  <span>Burnt! Click to remove</span>
                </>
              )}
              {slot.state === 'cooking' && (
                <>
                  <Flame className="w-4 h-4" /> 
                  <span>Cooking... Watch the timer!</span>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Pulsing Ring Effect for Perfect State */}
      {slot.state === 'perfect' && (
        <motion.div
          className="absolute inset-0 border-4 border-green-400 rounded-2xl pointer-events-none"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.2, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Burnt Warning Effect */}
      {slot.state === 'burnt' && (
        <motion.div
          className="absolute inset-0 border-4 border-red-500 rounded-2xl pointer-events-none"
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0.7, 0.3, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}

// Main Component
const CookingGame2D: React.FC = () => {
  const navigate = useNavigate()
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  const family_budget = useGameStore(state => state.family_budget)

  const [cookingSlots, setCookingSlots] = useState<Record<CookingMethod, CookingSlot>>({
    stove: { id: 'stove', ingredient: null, state: 'raw', timer: 0, startTime: null },
    grill: { id: 'grill', ingredient: null, state: 'raw', timer: 0, startTime: null },
    oven: { id: 'oven', ingredient: null, state: 'raw', timer: 0, startTime: null },
  })

  const [usedIngredients, setUsedIngredients] = useState<Set<string>>(new Set())
  const [gameComplete, setGameComplete] = useState(false)
  const [perfectCount, setPerfectCount] = useState(0)
  const [burntCount, setBurntCount] = useState(0)

  // Convert ACTUALLY collected ingredients to Ingredient objects (filter by collected === true)
  const ingredients: Ingredient[] = collectedIngredients
    .filter(ing => ing.collected === true) // ✅ FIXED: Only show truly collected ingredients
    .map((ing, index) => ({
      id: `ingredient-${index}`,
      name: ing.name,
      cookingTime: 10, // 10 seconds for perfect
      burnTime: 15, // 15 seconds until burnt
      method: index % 3 === 0 ? 'stove' : index % 3 === 1 ? 'grill' : 'oven',
    }))
  
  console.log(`👨‍🍳 [COOKING GAME] Ingredients available:`, {
    total: collectedIngredients.length,
    actuallyCollected: ingredients.length,
    ingredients: ingredients.map(i => i.name)
  })

  // Timer effect - Using React best practice with immutable updates (no state mutation)
  useEffect(() => {
    const interval = setInterval(() => {
      setCookingSlots(prev => {
        const updated: Record<CookingMethod, CookingSlot> = {} as any
        let hasChanges = false

        Object.keys(prev).forEach(key => {
          const method = key as CookingMethod
          const slot = prev[method]
          
          if (slot.ingredient && slot.startTime) {
            const elapsed = Math.floor((Date.now() - slot.startTime) / 1000)
            const hasTimerChange = slot.timer !== elapsed

            // Check state transitions
            let newState = slot.state
            let stateChanged = false

            // Perfect state (cooking -> perfect)
            if (slot.state === 'cooking' && elapsed >= slot.ingredient.cookingTime && elapsed < slot.ingredient.burnTime) {
              newState = 'perfect'
              stateChanged = true
              // Use functional update to prevent stale closures
              setPerfectCount(c => c + 1)
              toast.success(`🌟 ${slot.ingredient.name} is perfectly cooked!`, { 
                icon: '✨',
                duration: 2000 
              })
            }
            // Burnt state (cooking/perfect -> burnt)
            else if (slot.state !== 'burnt' && elapsed >= slot.ingredient.burnTime) {
              newState = 'burnt'
              stateChanged = true
              // Use functional update to prevent stale closures
              setBurntCount(c => c + 1)
              toast.error(`🔥 ${slot.ingredient.name} is burnt!`, { 
                icon: '🔥',
                duration: 2000 
              })
            }

            // Immutable update - create new object only if changed
            if (hasTimerChange || stateChanged) {
              updated[method] = {
                ...slot,
                timer: elapsed,
                state: newState
              }
              hasChanges = true
            } else {
              updated[method] = slot
            }
          } else {
            updated[method] = slot
          }
        })

        // Only return new state object if something changed
        return hasChanges ? updated : prev
      })
    }, 100)

    return () => clearInterval(interval)
  }, []) // Empty deps - functional updates prevent stale closures

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const ingredientId = active.id as string
    const ingredient = ingredients.find(i => i.id === ingredientId)
    const targetMethod = over.data.current?.method as CookingMethod

    if (!ingredient || !targetMethod) return

    // Check if ingredient matches the cooking method
    if (ingredient.method !== targetMethod) {
      toast.error(`❌ ${ingredient.name} can't be cooked on ${targetMethod}!`, { icon: '⚠️' })
      return
    }

    // Check if slot is already occupied
    if (cookingSlots[targetMethod].ingredient) {
      toast.error(`❌ ${targetMethod} is already occupied!`, { icon: '⚠️' })
      return
    }

    // Start cooking
    setCookingSlots(prev => ({
      ...prev,
      [targetMethod]: {
        id: targetMethod,
        ingredient,
        state: 'cooking',
        timer: 0,
        startTime: Date.now(),
      },
    }))

    setUsedIngredients(prev => new Set([...prev, ingredientId]))
    toast.success(`🔥 Started cooking ${ingredient.name}!`, { icon: '👨‍🍳' })
  }, [ingredients, cookingSlots])

  // Remove ingredient from slot
  const handleRemoveIngredient = (method: CookingMethod) => {
    const slot = cookingSlots[method]
    if (!slot.ingredient) return

    if (slot.state === 'perfect') {
      toast.success(`✅ ${slot.ingredient.name} collected!`, { icon: '🎯' })
    }

    setCookingSlots(prev => ({
      ...prev,
      [method]: {
        id: method,
        ingredient: null,
        state: 'raw',
        timer: 0,
        startTime: null,
      },
    }))
  }

  // Check if all ingredients are used
  const allIngredientsUsed = usedIngredients.size === ingredients.length

  // Calculate score
  const score = (perfectCount * 100) - (burntCount * 50)
  const maxScore = ingredients.length * 100

  // Complete game
  const handleCompleteGame = () => {
    if (!allIngredientsUsed) {
      toast.error('Please cook all ingredients first!', { icon: '⚠️' })
      return
    }

    // Check if all cooked ingredients are removed
    const hasIngredientsInSlots = Object.values(cookingSlots).some(slot => slot.ingredient !== null)
    if (hasIngredientsInSlots) {
      toast.error('Please remove all cooked ingredients first!', { icon: '⚠️' })
      return
    }

    // Calculate reward
    const baseReward = dishChallenge?.completion_reward.money || 50
    const bonusMultiplier = perfectCount / ingredients.length
    const finalReward = Math.floor(baseReward * (1 + bonusMultiplier))

    updateFamilyBudget(finalReward)
    setGameComplete(true)
    
    // Confetti effect with multiple toasts
    const confettiEmojis = ['🎉', '✨', '🌟', '💫', '🎊']
    confettiEmojis.forEach((emoji, i) => {
      setTimeout(() => {
        toast.success(`${emoji}`, { 
          position: i % 2 === 0 ? 'top-left' : 'top-right',
          duration: 1500,
        })
      }, i * 200)
    })
    
    toast.success(`🎉 Earned $${finalReward}!`, { 
      icon: '💰',
      duration: 3000 
    })
  }

  // Loading state
  if (!dishChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Cooking Challenge</h2>
          <p className="text-gray-600 mb-6">You need to generate a dish challenge first!</p>
          <button
            onClick={() => navigateToGame(navigate)}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
          >
            Back to Game
          </button>
        </motion.div>
      </div>
    )
  }

  // Success Modal
  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Confetti Background */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
            }}
            animate={{
              y: ['0vh', '120vh'],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              opacity: [1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            {['🎉', '✨', '🌟', '💫', '🎊', '🏆'][i % 6]}
          </motion.div>
        ))}

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        >
          <div className="text-center">
            <motion.div
              className="inline-block mb-4"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto drop-shadow-lg" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Cooking Complete! 🎉
            </h2>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="font-semibold text-gray-700">Perfect Dishes</span>
                <span className="text-2xl font-bold text-green-600">{perfectCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <span className="font-semibold text-gray-700">Burnt Dishes</span>
                <span className="text-2xl font-bold text-red-600">{burntCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <span className="font-semibold text-gray-700">Score</span>
                <span className="text-2xl font-bold text-blue-600">{score}/{maxScore}</span>
              </div>
            </div>

            <motion.button
              onClick={() => navigateToGame(navigate)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Game
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateToGame(navigate)}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>

              <div className="flex items-center gap-3">
                <ChefHat className="w-6 h-6 text-orange-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  {dishChallenge.dish_name}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Perfect</p>
                  <p className="text-lg font-bold text-green-600">{perfectCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Burnt</p>
                  <p className="text-lg font-bold text-red-600">{burntCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Ingredients */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                  Available Ingredients
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {ingredients.map(ingredient => (
                    <DraggableIngredient
                      key={ingredient.id}
                      ingredient={ingredient}
                      isUsed={usedIngredients.has(ingredient.id)}
                    />
                  ))}
                </div>

                {ingredients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No ingredients collected yet!</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  How to Play
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">1.</span>
                    <span>Drag ingredients to the matching cooking appliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">2.</span>
                    <span>Watch the timer! Remove at <strong>10s</strong> for perfect cook</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">3.</span>
                    <span>Food burns after <strong>15s</strong> - don't wait too long!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">4.</span>
                    <span>Click cooked ingredients to remove them</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Cooking Appliances */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-red-500" />
                Cooking Stations
              </h2>

              {/* Stove */}
              <div 
                onClick={() => handleRemoveIngredient('stove')}
                className="cursor-pointer"
              >
                <CookingAppliance
                  method="stove"
                  slot={cookingSlots.stove}
                  onCook={(id) => {}}
                />
              </div>

              {/* Grill */}
              <div 
                onClick={() => handleRemoveIngredient('grill')}
                className="cursor-pointer"
              >
                <CookingAppliance
                  method="grill"
                  slot={cookingSlots.grill}
                  onCook={(id) => {}}
                />
              </div>

              {/* Oven */}
              <div 
                onClick={() => handleRemoveIngredient('oven')}
                className="cursor-pointer"
              >
                <CookingAppliance
                  method="oven"
                  slot={cookingSlots.oven}
                  onCook={(id) => {}}
                />
              </div>

              {/* Complete Button */}
              <motion.button
                onClick={handleCompleteGame}
                disabled={!allIngredientsUsed}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg transition-all
                  ${allIngredientsUsed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
                whileHover={allIngredientsUsed ? { scale: 1.02 } : {}}
                whileTap={allIngredientsUsed ? { scale: 0.98 } : {}}
              >
                {allIngredientsUsed ? '✨ Complete Cooking!' : '🔒 Cook All Ingredients First'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}

// Helper function to get ingredient emoji
function getIngredientEmoji(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('chicken')) return '🍗'
  if (lower.includes('beef')) return '🥩'
  if (lower.includes('pork')) return '🥓'
  if (lower.includes('fish')) return '🐟'
  if (lower.includes('prawn') || lower.includes('shrimp')) return '🦐'
  if (lower.includes('egg')) return '🥚'
  if (lower.includes('rice')) return '🍚'
  if (lower.includes('noodle')) return '🍜'
  if (lower.includes('vegetable') || lower.includes('veg')) return '🥬'
  if (lower.includes('tomato')) return '🍅'
  if (lower.includes('onion')) return '🧅'
  if (lower.includes('garlic')) return '🧄'
  if (lower.includes('pepper') || lower.includes('chili')) return '🌶️'
  if (lower.includes('coconut')) return '🥥'
  if (lower.includes('milk')) return '🥛'
  if (lower.includes('oil')) return '🫗'
  if (lower.includes('spice') || lower.includes('curry')) return '🌶️'
  return '🥘'
}

export default CookingGame2D
