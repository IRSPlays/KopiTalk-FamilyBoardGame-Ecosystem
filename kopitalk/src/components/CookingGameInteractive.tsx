import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChefHat, Clock, Flame, CheckCircle, X, ArrowLeft, 
  ThermometerSun, Trophy, Star, Sparkles, DollarSign, 
  AlertTriangle, Zap, Timer
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import { useNavigate } from 'react-router-dom'
import { 
  DndContext, 
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import toast from 'react-hot-toast'

// Cooking states
type CookingState = 'idle' | 'raw' | 'cooking' | 'perfect' | 'overdone' | 'burnt'
type CookingMethod = 'steam' | 'fry' | 'boil' | 'bake' | 'stir_fry' | 'grill'
type GamePhase = 'prep' | 'cooking' | 'plating' | 'complete'

interface IngredientSlot {
  id: string
  name: string
  placed: boolean
  cookingState: CookingState
  cookingStartTime: number | null
  position: { x: number; y: number }
}

interface CookingEquipment {
  id: string
  type: 'stove' | 'grill' | 'pot' | 'pan' | 'oven'
  active: boolean
  heatLevel: number // 0-100
  slots: IngredientSlot[]
}

const CookingGameInteractive: React.FC = () => {
  const navigate = useNavigate()
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  const completeDish = useGameStore(state => state.completeGame)
  
  const [gamePhase, setGamePhase] = useState<GamePhase>('prep')
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([])
  const [equipment, setEquipment] = useState<CookingEquipment[]>([])
  const [activeIngredient, setActiveIngredient] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [perfectTiming, setPerfectTiming] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // ✅ DnD Kit sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Check if all ingredients are collected
  const requiredIngredients = dishChallenge?.ingredients || []
  const missingIngredients = requiredIngredients.filter(
    req => !collectedIngredients.some(col => col.name === req.name && col.is_collected)
  )
  const allIngredientsCollected = missingIngredients.length === 0

  // Initialize equipment based on cooking method
  useEffect(() => {
    if (!dishChallenge) return

    const method = dishChallenge.cooking_method
    let equipmentList: CookingEquipment[] = []

    switch (method) {
      case 'fry':
      case 'stir_fry':
        equipmentList = [
          {
            id: 'pan',
            type: 'pan',
            active: false,
            heatLevel: 0,
            slots: Array(4).fill(null).map((_, i) => ({
              id: `slot-${i}`,
              name: '',
              placed: false,
              cookingState: 'idle',
              cookingStartTime: null,
              position: { x: 0, y: 0 }
            }))
          }
        ]
        break
      case 'grill':
        equipmentList = [
          {
            id: 'grill',
            type: 'grill',
            active: false,
            heatLevel: 0,
            slots: Array(6).fill(null).map((_, i) => ({
              id: `slot-${i}`,
              name: '',
              placed: false,
              cookingState: 'idle',
              cookingStartTime: null,
              position: { x: 0, y: 0 }
            }))
          }
        ]
        break
      case 'boil':
      case 'steam':
        equipmentList = [
          {
            id: 'pot',
            type: 'pot',
            active: false,
            heatLevel: 0,
            slots: Array(8).fill(null).map((_, i) => ({
              id: `slot-${i}`,
              name: '',
              placed: false,
              cookingState: 'idle',
              cookingStartTime: null,
              position: { x: 0, y: 0 }
            }))
          }
        ]
        break
      default:
        equipmentList = [
          {
            id: 'general',
            type: 'pan',
            active: false,
            heatLevel: 0,
            slots: Array(4).fill(null).map((_, i) => ({
              id: `slot-${i}`,
              name: '',
              placed: false,
              cookingState: 'idle',
              cookingStartTime: null,
              position: { x: 0, y: 0 }
            }))
          }
        ]
    }

    setEquipment(equipmentList)
    
    // Initialize available ingredients
    const ingredients = collectedIngredients
      .filter(ing => ing.is_collected)
      .map(ing => ing.name)
    setAvailableIngredients(ingredients)
  }, [dishChallenge, collectedIngredients])

  // ✅ Cooking timer - check every 100ms for precise timing
  useEffect(() => {
    if (gamePhase !== 'cooking') return

    timerRef.current = setInterval(() => {
      setTotalTime(prev => prev + 0.1)

      setEquipment(prevEquipment => 
        prevEquipment.map(eq => {
          if (!eq.active) return eq

          return {
            ...eq,
            slots: eq.slots.map(slot => {
              if (!slot.placed || !slot.cookingStartTime) return slot

              const cookingTime = (Date.now() - slot.cookingStartTime) / 1000 // seconds
              let newState: CookingState = slot.cookingState

              // ✅ Cooking state progression based on time
              if (cookingTime < 2) {
                newState = 'raw'
              } else if (cookingTime < 5) {
                newState = 'cooking'
              } else if (cookingTime < 8) {
                newState = 'perfect'
                // ✅ Award points for perfect timing
                if (slot.cookingState !== 'perfect') {
                  setPerfectTiming(prev => prev + 1)
                  toast.success(`Perfect! ${slot.name} is cooked to perfection! 🌟`, {
                    icon: '👨‍🍳'
                  })
                }
              } else if (cookingTime < 12) {
                newState = 'overdone'
                if (slot.cookingState === 'perfect') {
                  toast.error(`${slot.name} is getting overcooked! 😰`)
                }
              } else {
                newState = 'burnt'
                if (slot.cookingState !== 'burnt') {
                  toast.error(`${slot.name} burnt! 🔥`, { icon: '😱' })
                }
              }

              return { ...slot, cookingState: newState }
            })
          }
        })
      )
    }, 100)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gamePhase])

  // ✅ Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveIngredient(active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveIngredient(null)

    if (!over) return

    // Check if dropped on equipment slot
    const [equipmentId, slotId] = (over.id as string).split('-slot-')
    
    if (equipmentId && slotId) {
      const ingredientName = active.id as string
      
      // Add ingredient to slot
      setEquipment(prevEquipment => 
        prevEquipment.map(eq => {
          if (eq.id !== equipmentId) return eq

          return {
            ...eq,
            slots: eq.slots.map((slot, idx) => {
              if (slot.id !== `slot-${slotId}`) return slot
              if (slot.placed) return slot // Slot already occupied

              // Place ingredient
              setAvailableIngredients(prev => prev.filter(ing => ing !== ingredientName))
              
              toast.success(`Added ${ingredientName}!`, { icon: '✨' })

              return {
                ...slot,
                name: ingredientName,
                placed: true,
                cookingState: 'raw',
                cookingStartTime: eq.active ? Date.now() : null
              }
            })
          }
        })
      )
    }
  }

  // ✅ Start cooking
  const startCooking = () => {
    const hasIngredients = equipment.some(eq => eq.slots.some(slot => slot.placed))
    
    if (!hasIngredients) {
      toast.error('Add ingredients first!', { icon: '🍳' })
      return
    }

    setGamePhase('cooking')
    
    // Activate all equipment and start cooking timers
    setEquipment(prevEquipment => 
      prevEquipment.map(eq => ({
        ...eq,
        active: true,
        heatLevel: 75,
        slots: eq.slots.map(slot => ({
          ...slot,
          cookingStartTime: slot.placed ? Date.now() : null,
          cookingState: slot.placed ? 'raw' : 'idle'
        }))
      }))
    )

    toast.success('Cooking started! Watch the timer! ⏰', { icon: '🔥' })
  }

  // ✅ Stop cooking and move to plating
  const stopCooking = () => {
    if (timerRef.current) clearInterval(timerRef.current)

    setEquipment(prevEquipment => 
      prevEquipment.map(eq => ({
        ...eq,
        active: false,
        heatLevel: 0
      }))
    )

    setGamePhase('plating')

    // ✅ Calculate score
    const totalIngredients = equipment.reduce((sum, eq) => 
      sum + eq.slots.filter(slot => slot.placed).length, 0
    )
    const burntCount = equipment.reduce((sum, eq) => 
      sum + eq.slots.filter(slot => slot.cookingState === 'burnt').length, 0
    )
    const overdoneCount = equipment.reduce((sum, eq) => 
      sum + eq.slots.filter(slot => slot.cookingState === 'overdone').length, 0
    )

    const baseScore = 100
    const perfectBonus = perfectTiming * 20
    const burntPenalty = burntCount * 30
    const overdonePenalty = overdoneCount * 10
    const timeBonus = Math.max(0, 50 - Math.floor(totalTime))

    const finalScore = Math.max(0, baseScore + perfectBonus - burntPenalty - overdonePenalty + timeBonus)
    setScore(finalScore)

    toast.success(`Cooking complete! Score: ${finalScore}`, { icon: '🏆' })
  }

  // ✅ Complete dish
  const completeCooking = () => {
    if (!dishChallenge) return

    const reward = dishChallenge.completion_reward.money
    const bonusMultiplier = score > 80 ? 1.5 : score > 50 ? 1.2 : 1.0
    const finalReward = Math.floor(reward * bonusMultiplier)

    updateFamilyBudget(finalReward)
    completeDish()

    setGamePhase('complete')
    
    toast.success(`Earned $${finalReward}! 💰`, { icon: '🎉' })
  }

  // ✅ Get cooking state color
  const getCookingStateColor = (state: CookingState): string => {
    switch (state) {
      case 'raw': return 'bg-pink-200'
      case 'cooking': return 'bg-yellow-300'
      case 'perfect': return 'bg-green-400'
      case 'overdone': return 'bg-orange-400'
      case 'burnt': return 'bg-gray-800'
      default: return 'bg-gray-100'
    }
  }

  // ✅ Error state - no dish challenge
  if (!dishChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ChefHat className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Cooking Challenge</h2>
          <p className="text-gray-600 mb-6">Generate a dish challenge first from the main game!</p>
          <button
            onClick={() => navigate('/game')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="inline w-5 h-5 mr-2" />
            Back to Game
          </button>
        </motion.div>
      </div>
    )
  }

  // ✅ Error state - missing ingredients
  if (!allIngredientsCollected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertTriangle className="w-20 h-20 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Missing Ingredients!</h2>
          <p className="text-gray-600 mb-4">Collect all ingredients before cooking:</p>
          <div className="bg-white rounded-lg p-4 mb-6">
            {missingIngredients.map(ing => (
              <div key={ing.name} className="flex items-center gap-2 text-left py-2 border-b last:border-0">
                <X className="w-5 h-5 text-red-500" />
                <span className="text-gray-700">{ing.name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/delivery')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <div className="flex-1 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <ChefHat className="w-8 h-8 text-orange-500" />
                {dishChallenge.dish_name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{dishChallenge.cooking_method.replace('_', ' ')}</p>
            </div>

            <div className="w-10" />
          </div>

          {/* Timer & Score */}
          <div className="flex gap-4 justify-center">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">{totalTime.toFixed(1)}s</span>
            </div>
            {gamePhase !== 'prep' && (
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{perfectTiming} Perfect</span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Left: Available Ingredients */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Ingredients
            </h3>
            
            <div className="space-y-2">
              <AnimatePresence>
                {availableIngredients.map(ingredient => (
                  <IngredientCard key={ingredient} name={ingredient} />
                ))}
              </AnimatePresence>
            </div>

            {availableIngredients.length === 0 && (
              <p className="text-gray-400 text-center py-8">All ingredients placed!</p>
            )}
          </div>

          {/* Center: Cooking Equipment */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              {equipment[0]?.type.toUpperCase()} {equipment[0]?.active && '(ACTIVE)'}
            </h3>

            {equipment.map(eq => (
              <CookingEquipmentView
                key={eq.id}
                equipment={eq}
                getCookingStateColor={getCookingStateColor}
              />
            ))}

            {/* Controls */}
            <div className="mt-6 flex gap-4">
              {gamePhase === 'prep' && (
                <motion.button
                  onClick={startCooking}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Flame className="inline w-6 h-6 mr-2" />
                  Start Cooking!
                </motion.button>
              )}

              {gamePhase === 'cooking' && (
                <motion.button
                  onClick={stopCooking}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="inline w-6 h-6 mr-2" />
                  Stop & Plate
                </motion.button>
              )}

              {gamePhase === 'plating' && (
                <motion.button
                  onClick={completeCooking}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trophy className="inline w-6 h-6 mr-2" />
                  Complete Dish (Score: {score})
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeIngredient ? (
            <div className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              {activeIngredient}
            </div>
          ) : null}
        </DragOverlay>

        {/* Complete Modal */}
        <AnimatePresence>
          {gamePhase === 'complete' && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dish Complete!</h2>
                <p className="text-lg text-gray-600 mb-4">{dishChallenge.dish_name}</p>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
                  <div className="text-5xl font-bold text-orange-500 mb-2">{score}</div>
                  <div className="text-gray-700">Final Score</div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Perfect Timings:</span>
                      <span className="font-semibold">{perfectTiming}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Time:</span>
                      <span className="font-semibold">{totalTime.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/game')}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  Back to Game
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  )
}

// ✅ Draggable Ingredient Card
const IngredientCard: React.FC<{ name: string }> = ({ name }) => {
  return (
    <motion.div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', name)
      }}
      className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg border-2 border-purple-300 cursor-move hover:shadow-md transition-all"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, rotate: 5 }}
    >
      <div className="font-semibold text-gray-800">{name}</div>
    </motion.div>
  )
}

// ✅ Cooking Equipment View
const CookingEquipmentView: React.FC<{
  equipment: CookingEquipment
  getCookingStateColor: (state: CookingState) => string
}> = ({ equipment, getCookingStateColor }) => {
  return (
    <div className="relative">
      {/* Equipment visualization */}
      <div className={`
        grid gap-3 p-6 rounded-2xl border-4
        ${equipment.active ? 'border-orange-400 bg-gradient-to-br from-orange-100 to-red-100' : 'border-gray-300 bg-gray-50'}
        ${equipment.type === 'pan' || equipment.type === 'pot' ? 'grid-cols-2' : 'grid-cols-3'}
      `}>
        {equipment.slots.map((slot, idx) => (
          <div
            key={slot.id}
            data-equipment={equipment.id}
            data-slot={idx}
            onDrop={(e) => {
              e.preventDefault()
              const ingredientName = e.dataTransfer.getData('text/plain')
              console.log('Dropped:', ingredientName, 'on', equipment.id, 'slot', idx)
            }}
            onDragOver={(e) => e.preventDefault()}
            className={`
              aspect-square rounded-lg border-2 border-dashed
              flex items-center justify-center text-center p-2
              transition-all
              ${slot.placed 
                ? `${getCookingStateColor(slot.cookingState)} border-gray-400`
                : 'bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }
            `}
          >
            {slot.placed ? (
              <div className="text-xs font-semibold">
                {slot.name}
                {slot.cookingState !== 'idle' && (
                  <div className="mt-1 text-[10px] uppercase">{slot.cookingState}</div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-xs">Drop Here</div>
            )}
          </div>
        ))}
      </div>

      {/* Heat indicator */}
      {equipment.active && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Flame className="w-8 h-8 text-orange-500" />
        </motion.div>
      )}
    </div>
  )
}

export default CookingGameInteractive
