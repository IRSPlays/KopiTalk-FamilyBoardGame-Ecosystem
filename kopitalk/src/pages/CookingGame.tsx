import React, { useState, useEffect } from 'react'
import { ArrowLeft, ChefHat, Clock, Users, Star, CheckCircle, Play, Pause } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { gameStorage } from '../utils/gameStorage'
import { GameSession } from '../types'
import { getCookingRecipe } from '../utils/geminiApi'

interface Recipe {
  id: string
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  duration: number
  serves: number
  ingredients: string[]
  steps: string[]
  tips: string[]
  cultural_note: string
}

const CookingGame: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([])

  useEffect(() => {
    if (sessionId) {
      const session = gameStorage.getGame(sessionId);
      if (session) {
        setGameSession(session);
        const ingredients = session.challenge?.purchased_ingredients || [];
        if (ingredients.length > 0) {
          getCookingRecipe(ingredients).then(generatedRecipe => {
            setRecipe({
              id: 'gemini-recipe',
              name: generatedRecipe.name,
              difficulty: 'Medium',
              duration: 45,
              serves: 4,
              ingredients: ingredients,
              steps: generatedRecipe.steps,
              tips: generatedRecipe.tips,
              cultural_note: generatedRecipe.description
            });
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    }
  }, [sessionId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && selectedRecipe) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1)
      }, 1000)
    } else if (!isActive && timer !== 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timer, selectedRecipe])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'  
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const completeStep = () => {
    if (selectedRecipe && currentStep < selectedRecipe.steps.length - 1) {
      const newCompleted = [...completedSteps]
      newCompleted[currentStep] = true
      setCompletedSteps(newCompleted)
      setCurrentStep(currentStep + 1)
    } else if (selectedRecipe && currentStep === selectedRecipe.steps.length - 1) {
      const newCompleted = [...completedSteps]
      newCompleted[currentStep] = true
      setCompletedSteps(newCompleted)
      setIsActive(false)
    }
  }

  const startCooking = () => {
    if (selectedRecipe) {
      setCompletedSteps(new Array(selectedRecipe.steps.length).fill(false))
      setCurrentStep(0)
      setTimer(0)
      setIsActive(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Family Cooking</h1>
            <p className="text-gray-600">Learn traditional Singapore recipes together</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kopi-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your recipe...</p>
          </div>
        ) : !recipe ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">No ingredients found!</h2>
            <p className="text-gray-600 mb-4">Go to the supermarket in the main game to buy ingredients for your challenge.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-kopi-500 text-white px-6 py-2 rounded-lg hover:bg-kopi-600 transition-colors"
            >
              Back to Game
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recipe Info & Steps */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{recipe.name}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Serves {recipe.serves}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <p className="text-orange-800 text-sm">{recipe.cultural_note}</p>
                </div>

                {!isActive && completedSteps.length === 0 && (
                  <button
                    onClick={startCooking}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <ChefHat className="w-5 h-5" />
                    Start Cooking
                  </button>
                )}
              </div>

              {/* Cooking Steps */}
              {completedSteps.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Cooking Steps</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Timer:</span>
                      <span className="font-mono font-semibold text-orange-600">{formatTime(timer)}</span>
                      <button
                        onClick={() => setIsActive(!isActive)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded"
                      >
                        {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {recipe.steps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          index === currentStep && !completedSteps[index]
                            ? 'border-orange-300 bg-orange-50'
                            : completedSteps[index]
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                            completedSteps[index]
                              ? 'bg-green-500 text-white'
                              : index === currentStep
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {completedSteps[index] ? <CheckCircle className="w-4 h-4" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800">{step}</p>
                            {index === currentStep && !completedSteps[index] && (
                              <button
                                onClick={completeStep}
                                className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium"
                              >
                                Complete Step
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ingredients */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-sm text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro Tips</h3>
                <div className="space-y-3">
                  {recipe.tips.map((tip, index) => (
                    <div key={index} className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CookingGame
