import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { 
  ChefHat, Sparkles, Clock, AlertCircle, CheckCircle, 
  Lightbulb, ArrowRight, Award, X, Target, TrendingUp,
  Flame, ThermometerSun, Droplet, Zap, Timer, RotateCcw,
  AlertTriangle, XCircle
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

type CookingStage = 'loading' | 'prep' | 'cooking' | 'complete' | 'spoiled'
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
  ingredients: string[]
  status: ApplianceStatus
  startTime: number | null
  cookingTime: number
  isOvertime: boolean
}

interface DraggedIngredient {
  name: string
  index: number
}

const appliances: Appliance[] = [
  // Prep appliances
  { id: 'cutting-board', name: 'Cutting Board', icon: '🔪', type: 'prep', capacity: 3, description: 'Wash, cut, chop ingredients', optimalTime: 120, toleranceTime: 30 },
  { id: 'mixing-bowl', name: 'Mixing Bowl', icon: '🥣', type: 'prep', capacity: 5, description: 'Mix and combine ingredients', optimalTime: 90, toleranceTime: 20 },
  { id: 'mortar-pestle', name: 'Mortar & Pestle', icon: '🫚', type: 'prep', capacity: 2, description: 'Grind spices and herbs', optimalTime: 180, toleranceTime: 40 },
  { id: 'blender', name: 'Blender', icon: '🌪️', type: 'prep', capacity: 4, description: 'Blend and grind', optimalTime: 60, toleranceTime: 15 },
  { id: 'food-processor', name: 'Food Processor', icon: '⚙️', type: 'prep', capacity: 4, description: 'Slice, dice, shred', optimalTime: 45, toleranceTime: 10 },
  
  // Cook appliances
  { id: 'wok', name: 'Wok', icon: '🥘', type: 'cook', capacity: 4, description: 'Stir-fry at high heat', optimalTime: 300, toleranceTime: 60 },
  { id: 'rice-cooker', name: 'Rice Cooker', icon: '🍚', type: 'cook', capacity: 2, description: 'Cook rice and steam', optimalTime: 600, toleranceTime: 120 },
  { id: 'steamer', name: 'Steamer', icon: '🥟', type: 'cook', capacity: 3, description: 'Steam delicate foods', optimalTime: 480, toleranceTime: 90 },
  { id: 'stove', name: 'Stove', icon: '🔥', type: 'cook', capacity: 2, description: 'Boil, simmer, cook', optimalTime: 420, toleranceTime: 80 },
  { id: 'microwave', name: 'Microwave', icon: '📦', type: 'cook', capacity: 1, description: 'Quick heating', optimalTime: 180, toleranceTime: 30 },
  { id: 'oven', name: 'Oven', icon: '♨️', type: 'cook', capacity: 2, description: 'Bake and roast', optimalTime: 900, toleranceTime: 180 },
  { id: 'grill', name: 'Grill', icon: '🍖', type: 'cook', capacity: 3, description: 'Grill and char', optimalTime: 360, toleranceTime: 70 },
  { id: 'air-fryer', name: 'Air Fryer', icon: '�', type: 'cook', capacity: 2, description: 'Crispy with less oil', optimalTime: 480, toleranceTime: 90 },
  { id: 'pressure-cooker', name: 'Pressure Cooker', icon: '⚡', type: 'cook', capacity: 3, description: 'Fast high-pressure cooking', optimalTime: 300, toleranceTime: 50 },
  { id: 'slow-cooker', name: 'Slow Cooker', icon: '🐢', type: 'cook', capacity: 4, description: 'Low and slow cooking', optimalTime: 1800, toleranceTime: 600 },
  { id: 'deep-fryer', name: 'Deep Fryer', icon: '🍟', type: 'cook', capacity: 2, description: 'Deep frying', optimalTime: 240, toleranceTime: 40 },
  { id: 'toaster-oven', name: 'Toaster Oven', icon: '�', type: 'cook', capacity: 1, description: 'Toast and small baking', optimalTime: 300, toleranceTime: 50 },
]

const CookingGameAI: React.FC = () => {
  const navigate = useNavigate()
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  
  const [stage, setStage] = useState<CookingStage>('loading')
  const [recipe, setRecipe] = useState<CookingRecipe | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [hintCount, setHintCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState('')
  const [selectedAppliance, setSelectedAppliance] = useState<string | null>(null)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [stepScores, setStepScores] = useState<number[]>([])
  
  // Load AI-generated recipe on mount
  useEffect(() => {
    loadRecipe()
  }, [])
  
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
        .map(ing => ing.name)
      
      if (ingredients.length === 0) {
        toast.error('No ingredients collected! Please shop first.')
        setTimeout(() => navigate('/gameplay'), 2000)
        return
      }
      
      const generatedRecipe = await generateCookingInstructions(
        dishChallenge.dish_name,
        ingredients
      )
      
      setRecipe(generatedRecipe)
      setStage('prep')
      
      toast.success(`🤖 AI Chef prepared ${generatedRecipe.totalSteps} cooking steps!`, {
        duration: 4000
      })
      
    } catch (error) {
      console.error('Failed to load recipe:', error)
      toast.error('Failed to generate cooking instructions. Using fallback recipe.')
      
      // Continue with fallback from geminiCookingAssistant
    }
  }
  
  const handleStepAction = async () => {
    if (!recipe || !selectedAppliance) {
      toast.error('Please select an appliance first!')
      return
    }
    
    setIsValidating(true)
    const currentStep = recipe.steps[currentStepIndex]
    
    try {
      const validation = await validateCookingAction(currentStep, {
        appliance: selectedAppliance,
        ingredients: selectedIngredients
      })
      
      if (validation.valid || validation.score >= 50) {
        // Success or partial success
        toast.success(validation.feedback, { duration: 4000 })
        
        setCompletedSteps(prev => [...prev, currentStepIndex])
        setStepScores(prev => [...prev, validation.score])
        setTotalScore(prev => prev + validation.score)
        
        if (currentStepIndex < recipe.totalSteps - 1) {
          // Move to next step
          setCurrentStepIndex(prev => prev + 1)
          setSelectedAppliance(null)
          setSelectedIngredients([])
          setHintCount(0)
          setShowHint(false)
        } else {
          // All steps completed!
          setStage('complete')
          completeCooking(validation.score)
        }
      } else {
        toast.error(validation.feedback, { duration: 4000 })
      }
      
    } catch (error) {
      console.error('Validation error:', error)
      toast.error('Unable to validate action. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }
  
  const completeCooking = (finalStepScore: number) => {
    if (!recipe || !dishChallenge) return
    
    const averageScore = Math.round((totalScore + finalStepScore) / recipe.totalSteps)
    const timeBonus = hintCount === 0 ? 20 : Math.max(0, 20 - (hintCount * 5))
    const finalScore = averageScore + timeBonus
    
    // Calculate earnings based on score
    const baseEarnings = dishChallenge.completion_reward.money
    const earnedMoney = Math.round(baseEarnings * (finalScore / 100))
    
    // Award money and activity
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
        stepsCompleted: completedSteps.length + 1,
        hintsUsed: hintCount
      }
    })
    
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
  
  const toggleIngredient = (ingredientName: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientName)
        ? prev.filter(i => i !== ingredientName)
        : [...prev, ingredientName]
    )
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <ChefHat className="w-20 h-20 text-orange-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            AI Chef is analyzing your ingredients...
          </h2>
          <p className="text-gray-600">
            Creating personalized cooking steps for {dishChallenge.dish_name}
          </p>
          <div className="flex items-center gap-2 justify-center mt-4 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    )
  }
  
  if (stage === 'complete') {
    const averageScore = totalScore / recipe!.totalSteps
    const grade = averageScore >= 90 ? 'A+' : averageScore >= 80 ? 'A' : averageScore >= 70 ? 'B' : averageScore >= 60 ? 'C' : 'D'
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Award className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Cooking Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {recipe!.dishName}
            </p>
            
            {/* Score Display */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Grade</p>
              <p className="text-6xl font-bold text-green-600 mb-4">{grade}</p>
              <p className="text-lg text-gray-700">Average Score: {Math.round(averageScore)}/100</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Steps</p>
                <p className="text-2xl font-bold text-gray-900">{completedSteps.length + 1}/{recipe!.totalSteps}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <Lightbulb className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Hints Used</p>
                <p className="text-2xl font-bold text-gray-900">{hintCount}/3</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4">
                <TrendingUp className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{recipe!.difficulty}</p>
              </div>
            </div>
            
            {/* Cultural Context */}
            {recipe!.culturalBackground && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-700">{recipe!.culturalBackground}</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/gameplay')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Back to Game
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Cook Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }
  
  if (!recipe) return null
  
  const currentStep = recipe.steps[currentStepIndex]
  const progress = ((completedSteps.length) / recipe.totalSteps) * 100
  const availableIngredients = collectedIngredients.filter(ing => ing.collected)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <ChefHat className="w-8 h-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">{dishChallenge.dish_name}</h1>
              </div>
              <p className="text-sm text-gray-600">{recipe.culturalBackground}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Difficulty</p>
              <p className="text-lg font-bold text-orange-600 capitalize">{recipe.difficulty}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Step {currentStepIndex + 1} of {recipe.totalSteps} • Score: {Math.round(totalScore / Math.max(completedSteps.length, 1))}/100
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Step Instructions (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Card */}
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-2xl font-bold text-white">{currentStep.stepNumber}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.instruction}</h2>
                {currentStep.culturalContext && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-gray-600 bg-amber-50 border-l-4 border-amber-400 p-3 rounded mt-3"
                  >
                    <Sparkles className="w-4 h-4 inline mr-2 text-amber-600" />
                    {currentStep.culturalContext}
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Required Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Required for this step:
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentStep.requiredIngredients.map((ing, idx) => (
                  <span key={idx} className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {ing}
                  </span>
                ))}
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {currentStep.requiredAppliance}
                </span>
                {currentStep.estimatedTime && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{Math.round(currentStep.estimatedTime / 60)} min
                  </span>
                )}
              </div>
            </div>
            
            {/* Appliances Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Select Appliance:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {appliances.map((appliance) => (
                  <motion.button
                    key={appliance.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAppliance(appliance.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedAppliance === appliance.id
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    title={appliance.description}
                  >
                    <div className="text-3xl mb-2">{appliance.icon}</div>
                    <p className="text-xs font-medium text-gray-700 text-center">{appliance.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStepAction}
              disabled={!selectedAppliance || isValidating}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                !selectedAppliance || isValidating
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700'
              }`}
            >
              {isValidating ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  AI is validating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Complete Step <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </motion.button>
            
            {/* Hint Button */}
            <div className="mt-3 flex gap-3">
              <button
                onClick={requestHint}
                disabled={hintCount >= 3}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  hintCount >= 3
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                <Lightbulb className="w-5 h-5 inline mr-2" />
                Need Hint? ({hintCount}/3)
              </button>
              <button
                onClick={() => navigate('/gameplay')}
                className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                <X className="w-5 h-5 inline mr-2" />
                Exit
              </button>
            </div>
            
            {/* Hint Display */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 flex-1">{hintText}</p>
                    <button
                      onClick={() => setShowHint(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Sidebar (1/3 width) */}
        <div className="space-y-6">
          {/* Available Ingredients */}
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-green-600" />
              Your Ingredients
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableIngredients.map((ing, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all cursor-pointer"
                  onClick={() => toggleIngredient(ing.name)}
                >
                  <span className="text-sm font-medium text-gray-700">{ing.name}</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Progress Tracker */}
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Progress
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recipe.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg transition-all ${
                    completedSteps.includes(idx)
                      ? 'bg-green-50 border-2 border-green-200'
                      : idx === currentStepIndex
                      ? 'bg-orange-50 border-2 border-orange-200 ring-2 ring-orange-300'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {completedSteps.includes(idx) ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : idx === currentStepIndex ? (
                      <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 animate-pulse" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">
                        Step {step.stepNumber}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{step.instruction}</p>
                      {stepScores[idx] !== undefined && (
                        <p className="text-xs font-bold text-green-600 mt-1">
                          Score: {stepScores[idx]}/100
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookingGameAI
