# 🎯 COMPREHENSIVE PROJECT IMPROVEMENT PLAN
**Created:** November 3, 2025  
**Purpose:** Fix critical bugs and implement major enhancements to SingaPlayGO

---

## 📋 EXECUTIVE SUMMARY

### Critical Bugs Identified
1. **GameplayInterface Error**: `currentPlayerIndex` property doesn't exist on GameSession type
2. **Supermarket Ingredient Display**: Shows all ingredients as collected incorrectly
3. **Activities Hub Statistics**: Statistics not properly connected to game state
4. **QR Code Scanner**: Activity mentions QR scanning but no actual implementation

### Major Enhancement Areas
1. **AI-Powered Cooking Game**: Step-by-step cooking process controlled by Gemini AI
2. **Interactive Activities**: All 8 Activities Hub activities must be fully functional
3. **Multi-Appliance Kitchen**: Expand beyond stove/grill/oven to realistic kitchen setup
4. **Ingredient Preparation**: Add prep stage before cooking (wash, cut, marinate, mix)

---

## 🔧 PHASE 1: CRITICAL BUG FIXES (Priority: HIGH)

### 1.1 Fix GameplayInterface currentPlayerIndex Error
**File:** `kopitalk/src/components/GameplayInterface.tsx` line 963  
**Issue:** GameSession type doesn't have `currentPlayerIndex` property

**Solution:**
```typescript
// Option 1: Use gameSession.current_player
{showActivitiesHub && (
  <ActivitiesHub
    currentPlayerId={gameSession.current_player || 0}
    onClose={() => setShowActivitiesHub(false)}
  />
)}

// Option 2: Define currentPlayerIndex in GameSession type
// File: types.ts
export interface GameSession {
  // ... existing properties
  currentPlayerIndex: number
}
```

**Testing:**
- Click Activities Hub button from gameplay interface
- Verify modal opens without errors
- Check browser console for TypeScript errors

---

### 1.2 Fix Supermarket Ingredient Collection Display
**File:** `kopitalk/src/pages/SupermarketSelfOrder.tsx` lines 80-100  
**Issue:** User reports seeing "all ingredients collected" when they haven't purchased anything

**Root Cause Analysis:**
```typescript
// Current logic (line 85):
const alreadyCollected = isIngredientCollected(ingredient.name)

// isIngredientCollected (line 59-62):
const isIngredientCollected = (itemName: string): boolean => {
  return collectedIngredients.some(
    ing => ing.name.toLowerCase() === itemName.toLowerCase() && ing.collected === true
  )
}
```

**Investigation Needed:**
1. Check if `collectedIngredients` array is populated with all ingredients at initialization
2. Verify `collected` flag is initially set to `false`
3. Ensure `markIngredientCollected` is only called after successful purchase

**Debug Logging:**
```typescript
// Add at line 86:
console.log(`🛒 [SUPERMARKET] Checking ingredient: ${ingredient.name}`, {
  alreadyCollected,
  collectedIngredients: collectedIngredients.filter(i => 
    i.name.toLowerCase() === ingredient.name.toLowerCase()
  )
})
```

**Solution:**
```typescript
// Verify initialization in gameStore.ts:
const initializeChallenge = () => {
  set({
    collectedIngredients: dishChallenge.ingredients.map(ing => ({
      ...ing,
      collected: false // ✅ Ensure explicitly set to false
    }))
  })
}
```

---

### 1.3 Fix Activities Hub Statistics
**File:** `kopitalk/src/components/ActivitiesHub.tsx` lines 38-40, 121-122  
**Issue:** User reports statistics are wrong

**Current Implementation:**
```typescript
const completedActivities = useGameStore(state => state.completedActivities)
const totalEarnings = completedActivities.reduce((sum, activity) => sum + activity.earnings, 0)
```

**Verification Checklist:**
- [ ] Check `completedActivities` structure in gameStore
- [ ] Verify earnings are numbers not strings
- [ ] Ensure activities are added to store on completion
- [ ] Check if localStorage persistence is working
- [ ] Validate getActivityCompletionCount logic

**Debug Logging:**
```typescript
useEffect(() => {
  console.log(`📊 [ACTIVITIES HUB] Statistics:`, {
    totalActivities: completedActivities.length,
    totalEarnings,
    breakdown: completedActivities.map(a => ({
      type: a.type,
      earnings: a.earnings,
      timestamp: a.timestamp
    }))
  })
}, [completedActivities])
```

---

## 🎮 PHASE 2: INTERACTIVE ACTIVITIES (Priority: HIGH)

### 2.1 Create QR Code Scanner Activity
**New File:** `kopitalk/src/components/QRCodeScanner.tsx`

**Requirements:**
1. Generate random QR codes for practice
2. Simulate camera scanning or click interaction
3. Success/failure feedback with audio/visual cues
4. Track scan attempts and success rate
5. Reward earnings on successful scans
6. Multiple difficulty levels (static QR, moving QR, QR with distractions)

**Implementation:**
```typescript
import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Camera, CheckCircle, XCircle, Target } from 'lucide-react'

interface QRCodeScannerProps {
  currentPlayerId: number
  onClose: () => void
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ currentPlayerId, onClose }) => {
  const [qrData, setQrData] = useState('')
  const [scanMode, setScanMode] = useState<'practice' | 'test'>('practice')
  const [attempts, setAttempts] = useState(0)
  const [successes, setSuccesses] = useState(0)
  
  // Generate random QR code
  const generateQR = () => {
    const types = ['payment', 'menu', 'safeentry', 'wifi']
    const type = types[Math.floor(Math.random() * types.length)]
    setQrData(`https://singaplay.sg/${type}/${Date.now()}`)
  }
  
  // Simulate scanning
  const handleScan = () => {
    setAttempts(prev => prev + 1)
    const success = Math.random() > 0.2 // 80% success rate
    
    if (success) {
      setSuccesses(prev => prev + 1)
      toast.success('✅ QR Code scanned successfully!')
      // Award earnings
    } else {
      toast.error('❌ Scan failed, try again!')
    }
  }
  
  return (
    <motion.div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      {/* QR Scanner UI */}
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">QR Code Scanner Practice</h2>
        
        {/* Generated QR Code */}
        <div className="bg-gray-50 rounded-xl p-8 mb-4 flex justify-center">
          <QRCodeSVG value={qrData} size={200} />
        </div>
        
        {/* Scan Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScan}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl"
        >
          <Camera className="w-6 h-6 inline mr-2" />
          Scan QR Code
        </motion.button>
        
        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-600">Attempts</p>
            <p className="text-2xl font-bold text-blue-700">{attempts}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-sm text-green-600">Successes</p>
            <p className="text-2xl font-bold text-green-700">{successes}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default QRCodeScanner
```

**Integration:**
- Add to DigitalSkillsTeaching component as a lesson option
- Include in Activities Hub as standalone activity
- Track completions in gameStore

**Dependencies:**
```bash
npm install qrcode.react
```

---

### 2.2 Verify All 8 Activities Are Functional

**Activity Checklist:**

#### ✅ 1. Digital Skills Teaching
- [x] Component exists: `DigitalSkillsTeaching.tsx`
- [ ] QR Code Scanner integration (NEW)
- [ ] Mobile payment simulation
- [ ] Kiosk tutorial
- [ ] App navigation basics
- [ ] Earnings properly awarded
- [ ] State persistence working

#### ❓ 2. Language Exchange
- [ ] Component exists and accessible
- [ ] Interactive dialogue system
- [ ] Dialect learning mechanics
- [ ] Modern slang teaching
- [ ] Earnings awarded
- [ ] Completion tracking

#### ❓ 3. Cooking Tips Exchange
- [ ] Component exists and accessible
- [ ] Traditional technique database
- [ ] Modern shortcut tips
- [ ] Interactive demonstrations
- [ ] Earnings awarded
- [ ] Knowledge retention quiz

#### ❓ 4. Transport Navigation
- [ ] Component exists and accessible
- [ ] MRT route planning
- [ ] Accessibility discussion
- [ ] Real-time navigation simulation
- [ ] Earnings awarded
- [ ] Progress tracking

#### ❓ 5. Healthy Eating
- [ ] Component exists and accessible
- [ ] Nutrition analysis tool
- [ ] Traditional vs healthy balance
- [ ] Meal planning mechanics
- [ ] Earnings awarded
- [ ] Health score tracking

#### ❓ 6. Recipe Challenge
- [ ] Component exists and accessible
- [ ] Ingredient guessing game
- [ ] Cultural significance education
- [ ] Multiple difficulty levels
- [ ] Earnings awarded
- [ ] Score leaderboard

#### ❓ 7. Story Sharing
- [ ] Component exists and accessible
- [ ] Memory recording system
- [ ] Story playback
- [ ] Heritage preservation
- [ ] Earnings awarded
- [ ] Story library

#### ❓ 8. Cultural Quiz
- [ ] Component exists and accessible
- [ ] Question database
- [ ] Multiple choice/true-false
- [ ] Score tracking
- [ ] Earnings awarded
- [ ] Difficulty progression

**Action Items:**
1. Read each component file
2. Test in browser
3. Verify game mechanics
4. Check state persistence
5. Validate earnings calculation

---

## 🍳 PHASE 3: AI-POWERED COOKING GAME (Priority: CRITICAL)

### 3.1 Architecture Overview

**Current State:**
- Simple drag-and-drop cooking
- Fixed cooking times
- Limited appliances (stove, grill, oven)
- No preparation stage
- No ingredient combinations

**Target State:**
- AI-controlled step-by-step process
- Dynamic cooking instructions from Gemini
- Multiple appliances with unique mechanics
- Preparation stage (wash, cut, marinate, mix)
- Ingredient combination system
- Cultural context and education

---

### 3.2 Gemini AI Cooking Assistant

**New File:** `kopitalk/src/utils/geminiCookingAssistant.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export interface CookingStep {
  stepNumber: number
  instruction: string
  requiredIngredients: string[]
  requiredAppliance: string
  estimatedTime: number // seconds
  culturalContext?: string
  tips?: string[]
}

export interface CookingRecipe {
  dishName: string
  totalSteps: number
  steps: CookingStep[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  culturalBackground: string
}

/**
 * Generate step-by-step cooking instructions using Gemini AI
 */
export async function generateCookingInstructions(
  dishName: string,
  ingredients: string[]
): Promise<CookingRecipe> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  
  const prompt = `You are a Singapore heritage cooking instructor teaching families how to prepare traditional dishes.

Dish: ${dishName}
Available Ingredients: ${ingredients.join(', ')}

Generate a detailed, step-by-step cooking recipe with the following requirements:
1. Break down into clear, sequential steps
2. Specify which ingredients are used in each step
3. Indicate required kitchen appliances (wok, rice cooker, steamer, cutting board, etc.)
4. Provide time estimates for each step
5. Include cultural context about the dish and traditional cooking methods
6. Add helpful tips for beginners and elderly learners

Return response in JSON format:
{
  "dishName": "string",
  "totalSteps": number,
  "difficulty": "beginner" | "intermediate" | "advanced",
  "culturalBackground": "string",
  "steps": [
    {
      "stepNumber": number,
      "instruction": "string",
      "requiredIngredients": ["string"],
      "requiredAppliance": "string",
      "estimatedTime": number,
      "culturalContext": "string (optional)",
      "tips": ["string (optional)"]
    }
  ]
}

Focus on making instructions clear for intergenerational bonding - young teaching old and old teaching young.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/)
    const jsonText = jsonMatch ? jsonMatch[1] : response
    
    const recipe: CookingRecipe = JSON.parse(jsonText)
    
    console.log(`🤖 [AI COOKING] Generated recipe for ${dishName}:`, recipe)
    return recipe
    
  } catch (error) {
    console.error('❌ [AI COOKING] Error generating instructions:', error)
    throw error
  }
}

/**
 * Validate if player action matches current step
 */
export async function validateCookingAction(
  currentStep: CookingStep,
  playerAction: {
    appliance: string
    ingredients: string[]
  }
): Promise<{ valid: boolean; feedback: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  
  const prompt = `As a cooking instructor, validate if the player's action is correct.

Current Step: ${currentStep.instruction}
Required Ingredients: ${currentStep.requiredIngredients.join(', ')}
Required Appliance: ${currentStep.requiredAppliance}

Player Action:
- Used Appliance: ${playerAction.appliance}
- Used Ingredients: ${playerAction.ingredients.join(', ')}

Return JSON:
{
  "valid": boolean,
  "feedback": "string (encouraging if correct, helpful guidance if wrong)"
}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/)
    const jsonText = jsonMatch ? jsonMatch[1] : response
    
    return JSON.parse(jsonText)
  } catch (error) {
    console.error('❌ [AI COOKING] Error validating action:', error)
    return { valid: false, feedback: 'Unable to validate action, please try again.' }
  }
}

/**
 * Get hint for stuck players
 */
export async function getCookingHint(
  currentStep: CookingStep,
  hintLevel: 1 | 2 | 3
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  
  const hintPrompts = {
    1: 'Give a subtle hint without revealing the answer',
    2: 'Provide more specific guidance',
    3: 'Explain exactly what to do step by step'
  }
  
  const prompt = `Current cooking step: ${currentStep.instruction}

The player is stuck. ${hintPrompts[hintLevel]}.

Respond with a single helpful hint (2-3 sentences max).`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('❌ [AI COOKING] Error getting hint:', error)
    return 'Try focusing on the ingredients mentioned in the step.'
  }
}

/**
 * Suggest ingredient substitutions
 */
export async function suggestSubstitutions(
  missingIngredient: string,
  dishContext: string
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  
  const prompt = `In the context of cooking ${dishContext}, the player is missing "${missingIngredient}".

Suggest 3 common Singapore household substitutions that would work.

Return JSON array: ["substitution1", "substitution2", "substitution3"]`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/)
    const jsonText = jsonMatch ? jsonMatch[1] : response
    
    return JSON.parse(jsonText)
  } catch (error) {
    console.error('❌ [AI COOKING] Error getting substitutions:', error)
    return []
  }
}
```

---

### 3.3 Multi-Stage Cooking System

**New File:** `kopitalk/src/components/CookingGameAI.tsx`

```typescript
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChefHat, Sparkles, Clock, AlertCircle, CheckCircle, 
  Lightbulb, ArrowRight, Award
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import { 
  generateCookingInstructions, 
  validateCookingAction, 
  getCookingHint,
  CookingRecipe,
  CookingStep
} from '../utils/geminiCookingAssistant'
import toast from 'react-hot-toast'

type CookingStage = 'loading' | 'prep' | 'cooking' | 'complete'

interface Appliance {
  id: string
  name: string
  icon: string
  type: 'prep' | 'cook'
  capacity: number
}

const appliances: Appliance[] = [
  { id: 'cutting-board', name: 'Cutting Board', icon: '🔪', type: 'prep', capacity: 3 },
  { id: 'mixing-bowl', name: 'Mixing Bowl', icon: '🥣', type: 'prep', capacity: 5 },
  { id: 'wok', name: 'Wok', icon: '🥘', type: 'cook', capacity: 4 },
  { id: 'rice-cooker', name: 'Rice Cooker', icon: '🍚', type: 'cook', capacity: 2 },
  { id: 'steamer', name: 'Steamer', icon: '🥟', type: 'cook', capacity: 3 },
  { id: 'oven', name: 'Oven', icon: '🔥', type: 'cook', capacity: 2 },
  { id: 'blender', name: 'Blender', icon: '🌪️', type: 'prep', capacity: 4 },
  { id: 'microwave', name: 'Microwave', icon: '📦', type: 'cook', capacity: 1 },
]

const CookingGameAI: React.FC = () => {
  const dishChallenge = useGameStore(state => state.dishChallenge)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  
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
  
  // Load AI-generated recipe on mount
  useEffect(() => {
    loadRecipe()
  }, [])
  
  const loadRecipe = async () => {
    try {
      setStage('loading')
      
      const ingredients = collectedIngredients
        .filter(ing => ing.collected)
        .map(ing => ing.name)
      
      const generatedRecipe = await generateCookingInstructions(
        dishChallenge.name,
        ingredients
      )
      
      setRecipe(generatedRecipe)
      setStage('prep')
      
      toast.success(`🤖 AI Chef generated ${generatedRecipe.totalSteps} steps!`)
      
    } catch (error) {
      console.error('Failed to load recipe:', error)
      toast.error('Failed to generate cooking instructions')
    }
  }
  
  const handleStepAction = async () => {
    if (!recipe || !selectedAppliance) return
    
    setIsValidating(true)
    const currentStep = recipe.steps[currentStepIndex]
    
    try {
      const validation = await validateCookingAction(currentStep, {
        appliance: selectedAppliance,
        ingredients: selectedIngredients
      })
      
      if (validation.valid) {
        toast.success(validation.feedback)
        setCompletedSteps(prev => [...prev, currentStepIndex])
        
        if (currentStepIndex < recipe.totalSteps - 1) {
          setCurrentStepIndex(prev => prev + 1)
          setSelectedAppliance(null)
          setSelectedIngredients([])
        } else {
          setStage('complete')
          // Award completion rewards
        }
      } else {
        toast.error(validation.feedback)
      }
      
    } catch (error) {
      console.error('Validation error:', error)
      toast.error('Unable to validate action')
    } finally {
      setIsValidating(false)
    }
  }
  
  const requestHint = async () => {
    if (!recipe) return
    
    const hintLevel = Math.min(hintCount + 1, 3) as 1 | 2 | 3
    setHintCount(hintLevel)
    
    const currentStep = recipe.steps[currentStepIndex]
    const hint = await getCookingHint(currentStep, hintLevel)
    
    setHintText(hint)
    setShowHint(true)
  }
  
  if (stage === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <ChefHat className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl font-semibold text-gray-700">
            AI Chef is preparing your recipe...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Analyzing {dishChallenge.name} with Gemini AI
          </p>
        </div>
      </div>
    )
  }
  
  if (!recipe) return null
  
  const currentStep = recipe.steps[currentStepIndex]
  const progress = (completedSteps.length / recipe.totalSteps) * 100
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{dishChallenge.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{recipe.culturalBackground}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Difficulty</p>
              <p className="text-lg font-bold text-orange-600 capitalize">{recipe.difficulty}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Step {currentStepIndex + 1} of {recipe.totalSteps}
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Step Instructions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-orange-600">{currentStep.stepNumber}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{currentStep.instruction}</h2>
              {currentStep.culturalContext && (
                <p className="text-sm text-gray-600 bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                  <Sparkles className="w-4 h-4 inline mr-2 text-amber-600" />
                  {currentStep.culturalContext}
                </p>
              )}
            </div>
          </div>
          
          {/* Required Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Required:</h3>
            <div className="flex flex-wrap gap-2">
              {currentStep.requiredIngredients.map((ing, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {ing}
                </span>
              ))}
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {currentStep.requiredAppliance}
              </span>
            </div>
          </div>
          
          {/* Appliances Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Select Appliance:</h3>
            <div className="grid grid-cols-4 gap-3">
              {appliances.map((appliance) => (
                <motion.button
                  key={appliance.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAppliance(appliance.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAppliance === appliance.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{appliance.icon}</div>
                  <p className="text-xs font-medium text-gray-700">{appliance.name}</p>
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
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? (
              <>Validating with AI...</>
            ) : (
              <>
                Continue <ArrowRight className="w-5 h-5 inline ml-2" />
              </>
            )}
          </motion.button>
          
          {/* Hint Button */}
          <button
            onClick={requestHint}
            className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
          >
            <Lightbulb className="w-5 h-5 inline mr-2" />
            Need a Hint? ({hintCount}/3)
          </button>
          
          {/* Hint Display */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
              >
                <p className="text-sm text-gray-700">{hintText}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Sidebar: Ingredients & Progress */}
        <div className="space-y-6">
          {/* Available Ingredients */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Your Ingredients</h3>
            <div className="space-y-2">
              {collectedIngredients
                .filter(ing => ing.collected)
                .map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">{ing.name}</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                ))}
            </div>
          </div>
          
          {/* Completed Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Progress</h3>
            <div className="space-y-2">
              {recipe.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    completedSteps.includes(idx)
                      ? 'bg-green-50 border-2 border-green-200'
                      : idx === currentStepIndex
                      ? 'bg-orange-50 border-2 border-orange-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {completedSteps.includes(idx) ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : idx === currentStepIndex ? (
                      <Clock className="w-4 h-4 text-orange-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      Step {step.stepNumber}
                    </span>
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
```

---

### 3.4 Ingredient Combination System

**New File:** `kopitalk/src/utils/ingredientCombinations.ts`

```typescript
export interface IngredientCombo {
  id: string
  name: string
  ingredients: string[]
  result: string
  culturalNote: string
}

export const predefinedCombinations: IngredientCombo[] = [
  {
    id: 'marinade-basic',
    name: 'Basic Marinade',
    ingredients: ['soy sauce', 'garlic', 'ginger'],
    result: 'Seasoned Marinade',
    culturalNote: 'Traditional base for many Singaporean meat dishes'
  },
  {
    id: 'curry-paste',
    name: 'Curry Paste',
    ingredients: ['turmeric', 'chili', 'shallots', 'lemongrass'],
    result: 'Curry Paste',
    culturalNote: 'Foundation of Peranakan and Malay curries'
  },
  {
    id: 'sambal',
    name: 'Sambal',
    ingredients: ['chili', 'shrimp paste', 'garlic', 'lime'],
    result: 'Sambal Sauce',
    culturalNote: 'Essential condiment in Malay and Peranakan cuisine'
  },
  {
    id: 'stir-fry-sauce',
    name: 'Stir Fry Sauce',
    ingredients: ['soy sauce', 'oyster sauce', 'sesame oil', 'sugar'],
    result: 'Stir Fry Sauce',
    culturalNote: 'Quick sauce for Chinese-style vegetables and meat'
  }
]

/**
 * Check if selected ingredients form a valid combination
 */
export function checkCombination(selectedIngredients: string[]): IngredientCombo | null {
  const normalizedSelected = selectedIngredients.map(i => i.toLowerCase().trim())
  
  for (const combo of predefinedCombinations) {
    const normalizedCombo = combo.ingredients.map(i => i.toLowerCase().trim())
    
    // Check if all combo ingredients are in selected
    const hasAllIngredients = normalizedCombo.every(ing =>
      normalizedSelected.some(sel => sel.includes(ing) || ing.includes(sel))
    )
    
    if (hasAllIngredients && normalizedSelected.length === normalizedCombo.length) {
      return combo
    }
  }
  
  return null
}

/**
 * Get AI-suggested combinations for current ingredients
 */
export async function suggestCombinations(
  availableIngredients: string[]
): Promise<string[]> {
  // This can be enhanced with Gemini API for dynamic suggestions
  const suggestions: string[] = []
  
  for (const combo of predefinedCombinations) {
    const hasAllIngredients = combo.ingredients.every(ing =>
      availableIngredients.some(avail =>
        avail.toLowerCase().includes(ing.toLowerCase())
      )
    )
    
    if (hasAllIngredients) {
      suggestions.push(`Try combining: ${combo.ingredients.join(' + ')} → ${combo.result}`)
    }
  }
  
  return suggestions
}
```

---

## 📊 PHASE 4: TESTING & VALIDATION (Priority: MEDIUM)

### 4.1 Testing Checklist

**Unit Tests:**
- [ ] SupermarketSelfOrder ingredient collection logic
- [ ] GameStore state mutations
- [ ] Ingredient combination validation
- [ ] AI cooking step validation
- [ ] QR code generation and scanning

**Integration Tests:**
- [ ] Full cooking game flow (prep → cook → complete)
- [ ] Activities Hub statistics calculation
- [ ] Multi-appliance cooking coordination
- [ ] State persistence across page reloads

**User Acceptance Tests:**
- [ ] Elderly users can complete QR scanner activity
- [ ] Cooking game instructions are clear
- [ ] All activities award correct earnings
- [ ] UI is responsive on mobile devices
- [ ] Performance with Gemini API calls

---

## 🚀 IMPLEMENTATION TIMELINE

### Week 1: Critical Bug Fixes
- Day 1-2: Fix GameplayInterface and Supermarket bugs
- Day 3-4: Fix Activities Hub statistics
- Day 5: Testing and validation

### Week 2: QR Scanner & Activities
- Day 1-3: Implement QR Code Scanner component
- Day 4-5: Verify and fix all 8 activities
- Weekend: Integration testing

### Week 3: AI Cooking Assistant
- Day 1-2: Implement geminiCookingAssistant.ts
- Day 3-4: Create CookingGameAI component
- Day 5: Appliance system and UI

### Week 4: Advanced Features
- Day 1-2: Ingredient combination system
- Day 3: Preparation stage
- Day 4-5: Polish, testing, deployment

---

## 💡 ADDITIONAL IMPROVEMENTS

### 5.1 Accessibility Enhancements
- Text-to-speech for instructions
- High contrast mode for elderly
- Font size controls
- Simplified mode toggle

### 5.2 Engagement Features
- Daily challenges
- Achievement badges
- Family leaderboards
- Photo memories gallery

### 5.3 Educational Content
- Cultural video clips
- Traditional music during cooking
- Story archives from elderly
- Language pronunciation guides

### 5.4 Technical Optimizations
- Lazy loading for activities
- Image optimization
- Offline mode with service workers
- Performance monitoring

---

## 📝 NOTES

**Key Principles:**
1. **Intergenerational Focus**: Every feature should promote elderly-youth bonding
2. **Cultural Preservation**: Highlight Singapore heritage in all activities
3. **Accessibility First**: Design for elderly users (large fonts, clear icons, audio guidance)
4. **AI as Assistant**: Gemini AI enhances but doesn't replace human interaction
5. **Progressive Complexity**: Start simple, unlock advanced features gradually

**Dependencies:**
- Gemini API (already integrated)
- QR Code library (qrcode.react)
- Drag-and-drop library (@dnd-kit)
- Animation library (framer-motion - already installed)

**Performance Considerations:**
- Cache AI-generated recipes for common dishes
- Limit simultaneous Gemini API calls
- Optimize image assets
- Implement proper error boundaries

---

## ✅ SUCCESS CRITERIA

**Must Have:**
- [ ] Zero TypeScript errors
- [ ] All 8 activities fully functional
- [ ] QR scanner working
- [ ] AI cooking game operational
- [ ] Statistics accurately displayed
- [ ] State persists across sessions

**Should Have:**
- [ ] Multi-appliance cooking
- [ ] Ingredient combinations
- [ ] Cultural context overlays
- [ ] Hint system working
- [ ] Achievement tracking

**Nice to Have:**
- [ ] Text-to-speech narration
- [ ] Photo memory gallery
- [ ] Multi-player collaboration
- [ ] Offline mode
- [ ] Analytics dashboard

---

**END OF PLAN**

This comprehensive plan addresses all user concerns and adds significant value to the SingaPlayGO project. Implementation should be done incrementally, with testing at each phase.