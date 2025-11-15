import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, PanInfo, Reorder } from 'framer-motion'
import { 
  ChefHat, Sparkles, Clock, AlertCircle, CheckCircle, 
  Lightbulb, ArrowRight, Award, X, Target, TrendingUp,
  Flame, ThermometerSun, Droplet, Zap, Timer, RotateCcw,
  AlertTriangle, XCircle, Play, Pause, RefreshCw
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import { useNavigate } from 'react-router-dom'
import { 
  generateCookingInstructions, 
  validateCookingAction, 
  getCookingHint,
  CookingRecipe,
  CookingStep
} from '../utils/geminiCookingAssistant'
import toast from 'react-hot-toast'

type CookingStage = 'loading' | 'active' | 'complete' | 'spoiled'
type ApplianceStatus = 'idle' | 'cooking' | 'ready' | 'spoiled'

interface Appliance {
  id: string
  name: string
  icon: string
  type: 'prep' | 'cook'
  capacity: number
  description: string
  optimalTime: number // seconds
  toleranceTime: number // seconds before spoiling
}

interface ApplianceState {
  id: string
  applianceId: string
  ingredients: string[]
  status: ApplianceStatus
  startTime: number | null
  elapsedTime: number
  optimalTime: number
  toleranceTime: number
}

interface DraggedIngredient {
  name: string
  collected: boolean
}

const appliances: Appliance[] = [
  // Prep appliances (5) - All under 30 seconds
  { id: 'cutting-board', name: 'Cutting Board', icon: '🔪', type: 'prep', capacity: 3, description: 'Wash, cut, chop', optimalTime: 20, toleranceTime: 5 },
  { id: 'mixing-bowl', name: 'Mixing Bowl', icon: '🥣', type: 'prep', capacity: 5, description: 'Mix and combine', optimalTime: 15, toleranceTime: 5 },
  { id: 'mortar-pestle', name: 'Mortar & Pestle', icon: '🫚', type: 'prep', capacity: 2, description: 'Grind spices', optimalTime: 25, toleranceTime: 5 },
  { id: 'blender', name: 'Blender', icon: '🌪️', type: 'prep', capacity: 4, description: 'Blend and grind', optimalTime: 10, toleranceTime: 3 },
  { id: 'food-processor', name: 'Food Processor', icon: '⚙️', type: 'prep', capacity: 4, description: 'Slice, dice, shred', optimalTime: 12, toleranceTime: 3 },
  
  // Cook appliances (12) - All under 30 seconds
  { id: 'wok', name: 'Wok', icon: '🥘', type: 'cook', capacity: 4, description: 'Stir-fry high heat', optimalTime: 25, toleranceTime: 5 },
  { id: 'rice-cooker', name: 'Rice Cooker', icon: '🍚', type: 'cook', capacity: 2, description: 'Cook rice & steam', optimalTime: 30, toleranceTime: 5 },
  { id: 'steamer', name: 'Steamer', icon: '🥟', type: 'cook', capacity: 3, description: 'Steam delicate foods', optimalTime: 28, toleranceTime: 5 },
  { id: 'stove', name: 'Stove', icon: '🔥', type: 'cook', capacity: 2, description: 'Boil, simmer, cook', optimalTime: 25, toleranceTime: 5 },
  { id: 'microwave', name: 'Microwave', icon: '📦', type: 'cook', capacity: 1, description: 'Quick heating', optimalTime: 15, toleranceTime: 3 },
  { id: 'oven', name: 'Oven', icon: '♨️', type: 'cook', capacity: 2, description: 'Bake and roast', optimalTime: 30, toleranceTime: 5 },
  { id: 'grill', name: 'Grill', icon: '🍖', type: 'cook', capacity: 3, description: 'Grill and char', optimalTime: 22, toleranceTime: 5 },
  { id: 'air-fryer', name: 'Air Fryer', icon: '💨', type: 'cook', capacity: 2, description: 'Crispy less oil', optimalTime: 20, toleranceTime: 5 },
  { id: 'pressure-cooker', name: 'Pressure Cooker', icon: '⚡', type: 'cook', capacity: 3, description: 'Fast pressure cook', optimalTime: 18, toleranceTime: 4 },
  { id: 'slow-cooker', name: 'Slow Cooker', icon: '🐢', type: 'cook', capacity: 4, description: 'Low and slow', optimalTime: 30, toleranceTime: 5 },
  { id: 'deep-fryer', name: 'Deep Fryer', icon: '🍟', type: 'cook', capacity: 2, description: 'Deep frying', optimalTime: 20, toleranceTime: 4 },
  { id: 'toaster-oven', name: 'Toaster Oven', icon: '🍞', type: 'cook', capacity: 1, description: 'Toast & small bake', optimalTime: 18, toleranceTime: 4 },
]

const CookingGameAIEnhanced: React.FC = () => {
  const navigate = useNavigate()
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  
  const [stage, setStage] = useState<CookingStage>('loading')
  const [recipe, setRecipe] = useState<CookingRecipe | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [applianceStates, setApplianceStates] = useState<ApplianceState[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<DraggedIngredient[]>([])
  const [draggedIngredient, setDraggedIngredient] = useState<DraggedIngredient | null>(null)
  const [hintCount, setHintCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState('')
  const [totalScore, setTotalScore] = useState(0)
  const [spoiledCount, setSpoiledCount] = useState(0)
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Load AI-generated recipe on mount
  useEffect(() => {
    loadRecipe()
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])
  
  // Timer update loop
  useEffect(() => {
    if (stage === 'active') {
      timerIntervalRef.current = setInterval(() => {
        updateTimers()
      }, 1000)
      
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current)
        }
      }
    }
  }, [stage, applianceStates])
  
  const loadRecipe = async () => {
    try {
      setStage('loading')
      
      if (!dishChallenge) {
        toast.error('No cooking challenge found!')
        setTimeout(() => navigate('/gameplay'), 2000)
        return
      }
      
      const ingredients = collectedIngredients
        .filter(ing => ing.collected)
        .map(ing => ({ name: ing.name, collected: true }))
      
      if (ingredients.length === 0) {
        toast.error('No ingredients collected! Please shop first.')
        setTimeout(() => navigate('/gameplay'), 2000)
        return
      }
      
      const generatedRecipe = await generateCookingInstructions(
        dishChallenge.dish_name,
        ingredients.map(i => i.name)
      )
      
      setRecipe(generatedRecipe)
      setAvailableIngredients(ingredients)
      setStage('active')
      
      toast.success(`🤖 AI Chef prepared ${generatedRecipe.totalSteps} cooking steps!`, {
        duration: 4000
      })
      
    } catch (error) {
      console.error('Failed to load recipe:', error)
      toast.error('Failed to generate cooking instructions.')
      setTimeout(() => navigate('/gameplay'), 3000)
    }
  }
  
  const updateTimers = () => {
    const now = Date.now()
    let hasSpoiled = false
    
    setApplianceStates(prev => prev.map(state => {
      if (state.status === 'cooking' && state.startTime) {
        const elapsed = Math.floor((now - state.startTime) / 1000)
        const maxTime = state.optimalTime + state.toleranceTime
        
        if (elapsed >= maxTime) {
          hasSpoiled = true
          toast.error(`${state.applianceId} overcooked! Food spoiled! 🔥`, {
            duration: 5000,
            icon: '😱'
          })
          
          return {
            ...state,
            elapsedTime: elapsed,
            status: 'spoiled' as ApplianceStatus
          }
        } else if (elapsed >= state.optimalTime && state.status === 'cooking') {
          toast.success(`${state.applianceId} is ready! Remove ingredients before spoiling!`, {
            duration: 3000,
            icon: '✅'
          })
          
          return {
            ...state,
            elapsedTime: elapsed,
            status: 'ready' as ApplianceStatus
          }
        }
        
        return {
          ...state,
          elapsedTime: elapsed
        }
      }
      return state
    }))
    
    if (hasSpoiled) {
      setSpoiledCount(prev => prev + 1)
      handleSpoilage()
    }
  }
  
  const handleSpoilage = () => {
    setStage('spoiled')
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
  }
  
  const handleIngredientDragStart = (ingredient: DraggedIngredient) => {
    setDraggedIngredient(ingredient)
  }
  
  const handleIngredientDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, applianceId: string) => {
    if (!draggedIngredient || !recipe) return
    
    const appliance = appliances.find(a => a.id === applianceId)
    if (!appliance) return
    
    // Check if appliance already has an active state
    const existingState = applianceStates.find(s => s.applianceId === applianceId && s.status !== 'spoiled')
    
    if (existingState) {
      if (existingState.ingredients.length >= appliance.capacity) {
        toast.error(`${appliance.name} is at capacity (${appliance.capacity} ingredients max)`)
        setDraggedIngredient(null)
        return
      }
      
      // Add ingredient to existing appliance
      setApplianceStates(prev => prev.map(state => 
        state.id === existingState.id
          ? { ...state, ingredients: [...state.ingredients, draggedIngredient.name] }
          : state
      ))
    } else {
      // Create new appliance state
      const newState: ApplianceState = {
        id: `${applianceId}-${Date.now()}`,
        applianceId,
        ingredients: [draggedIngredient.name],
        status: 'idle',
        startTime: null,
        elapsedTime: 0,
        optimalTime: appliance.optimalTime,
        toleranceTime: appliance.toleranceTime
      }
      
      setApplianceStates(prev => [...prev, newState])
    }
    
    // Remove from available ingredients
    setAvailableIngredients(prev => prev.filter(i => i.name !== draggedIngredient.name))
    setDraggedIngredient(null)
    
    toast.success(`Added ${draggedIngredient.name} to ${appliance.name}`)
  }
  
  const startCooking = async (stateId: string) => {
    const state = applianceStates.find(s => s.id === stateId)
    if (!state || !recipe) return
    
    const appliance = appliances.find(a => a.id === state.applianceId)
    if (!appliance) return
    
    if (state.ingredients.length === 0) {
      toast.error('Add ingredients first!')
      return
    }
    
    // Start cooking timer
    setApplianceStates(prev => prev.map(s => 
      s.id === stateId
        ? { ...s, status: 'cooking' as ApplianceStatus, startTime: Date.now() }
        : s
    ))
    
    toast.success(`🔥 ${appliance.name} started! Watch the timer!`, {
      icon: appliance.icon
    })
    
    // AI validation in background
    validateStepWithAI(state, appliance)
  }
  
  const validateStepWithAI = async (state: ApplianceState, appliance: Appliance) => {
    if (!recipe) return
    
    const currentStep = recipe.steps[currentStepIndex]
    
    try {
      const validation = await validateCookingAction(currentStep, {
        appliance: appliance.id,
        ingredients: state.ingredients
      })
      
      // AI determines actual optimal time
      if (validation.valid) {
        const aiOptimalTime = validation.score >= 90 ? appliance.optimalTime * 0.9 : appliance.optimalTime
        
        setApplianceStates(prev => prev.map(s => 
          s.id === state.id
            ? { ...s, optimalTime: Math.floor(aiOptimalTime) }
            : s
        ))
      }
      
    } catch (error) {
      console.error('AI validation error:', error)
    }
  }
  
  const collectFromAppliance = async (stateId: string) => {
    const state = applianceStates.find(s => s.id === stateId)
    if (!state || !recipe) return
    
    const appliance = appliances.find(a => a.id === state.applianceId)
    if (!appliance) return
    
    if (state.status === 'spoiled') {
      toast.error('Food is spoiled! Cannot use it. Restart required.')
      return
    }
    
    if (state.status !== 'ready') {
      toast.error('Wait for cooking to complete!')
      return
    }
    
    // Calculate score based on timing precision
    const timingScore = calculateTimingScore(state)
    setTotalScore(prev => prev + timingScore)
    
    toast.success(`Collected! Timing score: ${timingScore}/100 🎯`)
    
    // Move to next step
    if (currentStepIndex < recipe.totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1)
      
      // Return ingredients to available pool (now prepared)
      const preparedIngredients = state.ingredients.map(name => ({
        name: `Prepared ${name}`,
        collected: true
      }))
      setAvailableIngredients(prev => [...prev, ...preparedIngredients])
      
      // Remove this appliance state
      setApplianceStates(prev => prev.filter(s => s.id !== stateId))
    } else {
      // Complete cooking
      completeCooking(timingScore)
    }
  }
  
  const calculateTimingScore = (state: ApplianceState): number => {
    const deviation = Math.abs(state.elapsedTime - state.optimalTime)
    const maxDeviation = state.toleranceTime
    
    if (deviation === 0) return 100
    if (deviation >= maxDeviation) return 50
    
    return Math.floor(100 - (deviation / maxDeviation) * 50)
  }
  
  const completeCooking = (finalStepScore: number) => {
    if (!recipe || !dishChallenge) return
    
    const averageScore = Math.round((totalScore + finalStepScore) / recipe.totalSteps)
    const spoilPenalty = spoiledCount * 10
    const hintPenalty = hintCount * 5
    const finalScore = Math.max(0, averageScore - spoilPenalty - hintPenalty)
    
    const baseEarnings = dishChallenge.completion_reward.money
    const earnedMoney = Math.round(baseEarnings * (finalScore / 100))
    
    updateFamilyBudget(earnedMoney)
    
    addCompletedActivity({
      id: `cooking-ai-${Date.now()}`,
      type: 'cooking_tips',
      timestamp: new Date().toISOString(),
      earnings: earnedMoney,
      participants: [0],
      details: {
        dishName: recipe.dishName,
        difficulty: recipe.difficulty,
        score: finalScore,
        stepsCompleted: recipe.totalSteps,
        hintsUsed: hintCount,
        spoiledCount
      }
    })
    
    setStage('complete')
    
    toast.success(`🎉 Dish complete! Score: ${finalScore}/100 | Earned: $${earnedMoney}`, {
      duration: 6000,
      icon: '🏆'
    })
  }
  
  const requestHint = async () => {
    if (!recipe || hintCount >= 3) return
    
    const hintLevel = (Math.min(hintCount + 1, 3)) as 1 | 2 | 3
    setHintCount(hintLevel)
    
    const currentStep = recipe.steps[currentStepIndex]
    
    toast.loading('AI Chef is thinking...', { id: 'hint-loading' })
    
    const hint = await getCookingHint(currentStep, hintLevel)
    
    toast.dismiss('hint-loading')
    setHintText(hint)
    setShowHint(true)
  }
  
  const restartFromSpoilage = () => {
    setStage('loading')
    setApplianceStates([])
    setCurrentStepIndex(0)
    setTotalScore(0)
    setSpoiledCount(0)
    setHintCount(0)
    loadRecipe()
  }
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const getGrade = (score: number): string => {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'B+'
    if (score >= 80) return 'B'
    if (score >= 75) return 'C+'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }
  
  // Early return if no dish challenge
  if (!dishChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Cooking Challenge</h2>
          <p className="text-gray-600 mb-6">Please start a challenge from the gameplay screen</p>
          <button
            onClick={() => navigate('/gameplay')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Gameplay
          </button>
        </div>
      </div>
    )
  }
  
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <ChefHat className="w-16 h-16 text-orange-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Chef is Preparing...</h2>
          <p className="text-gray-600">
            Creating personalized cooking steps for {dishChallenge.dish_name}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            <span className="text-sm text-gray-500">Analyzing ingredients with Gemini AI</span>
          </div>
        </motion.div>
      </div>
    )
  }
  
  if (stage === 'spoiled') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Food Spoiled!</h2>
          <p className="text-gray-600 mb-6">
            You left ingredients cooking for too long. The food burned and spoiled.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>Tip:</strong> Watch the timers carefully! Remove food when it reaches optimal cooking time,
              or it will spoil after the tolerance period ends.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={restartFromSpoilage}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Start Over
            </button>
            <button
              onClick={() => navigate('/gameplay')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Exit
            </button>
          </div>
        </motion.div>
      </div>
    )
  }
  
  if (stage === 'complete') {
    const finalScore = totalScore - (spoiledCount * 10) - (hintCount * 5)
    const grade = getGrade(Math.max(0, finalScore))
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-center mb-6"
          >
            <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Cooking Complete!</h2>
            <p className="text-xl text-gray-600">{recipe?.dishName}</p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
              <p className="text-sm text-blue-600 mb-1">Final Score</p>
              <p className="text-3xl font-bold text-blue-900">{Math.max(0, finalScore)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
              <p className="text-sm text-purple-600 mb-1">Grade</p>
              <p className="text-3xl font-bold text-purple-900">{grade}</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Steps Completed</span>
              <span className="font-semibold text-gray-900">{recipe?.totalSteps || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Hints Used</span>
              <span className="font-semibold text-gray-900">{hintCount} (-{hintCount * 5}pts)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Spoiled Ingredients</span>
              <span className="font-semibold text-gray-900">{spoiledCount} (-{spoiledCount * 10}pts)</span>
            </div>
          </div>
          
          {recipe?.culturalBackground && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-orange-900 mb-2">Cultural Context</h3>
              <p className="text-sm text-orange-800">{recipe.culturalBackground}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStage('loading')
                setCurrentStepIndex(0)
                setTotalScore(0)
                setSpoiledCount(0)
                setHintCount(0)
                setApplianceStates([])
                loadRecipe()
              }}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Cook Again
            </button>
            <button
              onClick={() => navigate('/gameplay')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Gameplay
            </button>
          </div>
        </motion.div>
      </div>
    )
  }
  
  // Main cooking interface
  const currentStep = recipe?.steps[currentStepIndex]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{recipe?.dishName}</h1>
                <p className="text-sm text-gray-600">Step {currentStepIndex + 1} of {recipe?.totalSteps}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/gameplay')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / (recipe?.totalSteps || 1)) * 100}%` }}
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
            />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-600">Score</p>
              <p className="font-bold text-blue-900">{totalScore}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs text-purple-600">Hints</p>
              <p className="font-bold text-purple-900">{hintCount}/3</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
              <p className="text-xs text-red-600">Spoiled</p>
              <p className="font-bold text-red-900">{spoiledCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Current Step Instructions */}
      {currentStep && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Step {currentStep.stepNumber}</h2>
                <p className="text-gray-600 mb-2">{currentStep.instruction}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {currentStep.requiredAppliance}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    {formatTime(currentStep.estimatedTime)}
                  </span>
                </div>
                {currentStep.requiredIngredients && currentStep.requiredIngredients.length > 0 && (
                  <p className="text-sm text-gray-500">
                    <strong>Needs:</strong> {currentStep.requiredIngredients.join(', ')}
                  </p>
                )}
                {currentStep.culturalContext && (
                  <p className="text-sm text-orange-600 mt-2 italic">{currentStep.culturalContext}</p>
                )}
              </div>
            </div>
            
            {hintCount < 3 && (
              <button
                onClick={requestHint}
                className="mt-3 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Get Hint ({3 - hintCount} remaining)
              </button>
            )}
            
            {showHint && hintText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p className="text-sm text-yellow-900">{hintText}</p>
              </motion.div>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredients Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Available Ingredients
            </h3>
            <div className="space-y-2">
              {availableIngredients.map((ingredient, index) => (
                <motion.div
                  key={`${ingredient.name}-${index}`}
                  drag
                  dragSnapToOrigin
                  onDragStart={() => handleIngredientDragStart(ingredient)}
                  onDragEnd={() => setDraggedIngredient(null)}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, rotate: 5, zIndex: 1000 }}
                  className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg cursor-grab active:cursor-grabbing"
                >
                  <p className="text-sm font-medium text-gray-900">{ingredient.name}</p>
                  <p className="text-xs text-gray-500">Drag to appliance →</p>
                </motion.div>
              ))}
              {availableIngredients.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">All ingredients in use</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Appliances Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Kitchen Appliances
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {appliances.map((appliance) => {
                const activeState = applianceStates.find(s => s.applianceId === appliance.id && s.status !== 'spoiled')
                const isActive = !!activeState
                
                return (
                  <motion.div
                    key={appliance.id}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                    onPointerUp={(e) => {
                      if (draggedIngredient) {
                        handleIngredientDragEnd(e.nativeEvent, { point: { x: 0, y: 0 }, delta: { x: 0, y: 0 }, offset: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } }, appliance.id)
                      }
                    }}
                  >
                    <div className="text-center mb-2">
                      <span className="text-3xl">{appliance.icon}</span>
                      <p className="text-xs font-semibold text-gray-900 mt-1">{appliance.name}</p>
                      <p className="text-xs text-gray-500">{appliance.description}</p>
                    </div>
                    
                    {activeState && (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {activeState.ingredients.map((ing, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              {ing}
                            </span>
                          ))}
                        </div>
                        
                        {activeState.status === 'cooking' && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Time:</span>
                              <span className={`font-mono font-bold ${
                                activeState.elapsedTime >= activeState.optimalTime
                                  ? 'text-red-600'
                                  : 'text-blue-600'
                              }`}>
                                {formatTime(activeState.elapsedTime)} / {formatTime(activeState.optimalTime + activeState.toleranceTime)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                animate={{
                                  width: `${Math.min(100, (activeState.elapsedTime / (activeState.optimalTime + activeState.toleranceTime)) * 100)}%`
                                }}
                                className={`h-2 rounded-full ${
                                  activeState.elapsedTime < activeState.optimalTime
                                    ? 'bg-blue-500'
                                    : activeState.elapsedTime < activeState.optimalTime + activeState.toleranceTime
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                        
                        {activeState.status === 'idle' && (
                          <button
                            onClick={() => startCooking(activeState.id)}
                            className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs flex items-center justify-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Start Cooking
                          </button>
                        )}
                        
                        {activeState.status === 'ready' && (
                          <button
                            onClick={() => collectFromAppliance(activeState.id)}
                            className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs flex items-center justify-center gap-1 animate-pulse"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Collect Now!
                          </button>
                        )}
                      </div>
                    )}
                    
                    {!isActive && (
                      <p className="text-xs text-center text-gray-400 mt-2">
                        Drop ingredients here
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookingGameAIEnhanced
