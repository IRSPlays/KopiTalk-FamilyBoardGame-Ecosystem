import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Heart, Sparkles, Send, X, CheckCircle, Loader2 } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useGameStore } from '../stores/gameStore'

interface StorySharingProps {
  currentPlayerId: number
  onClose: () => void
}

const StorySharing: React.FC<StorySharingProps> = ({ currentPlayerId, onClose }) => {
  const [story, setStory] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    earnings: number
    culturalDepth: number
    emotionalConnection: number
    feedback: string
  } | null>(null)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const player = useGameStore(state => state.players.find(p => p.id === currentPlayerId))

  const analyzeStory = async () => {
    if (story.trim().length < 100) {
      alert('Please write at least 100 characters to share your story!')
      return
    }

    setAnalyzing(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

        const prompt = `Analyze this family cooking memory/traditional recipe story for a Singapore intergenerational game.

Story: "${story}"

Rate on a scale of 1-10 and provide JSON:
{
  "cultural_depth": number (how much Singapore cultural context),
  "emotional_connection": number (how heartfelt and personal),
  "intergenerational_insights": number (elderly-youth knowledge transfer),
  "feedback": "2-3 sentences of encouraging feedback"
}

Raw JSON only, no markdown.`

        const result = await model.generateContent(prompt)
        let response = result.response.text().trim()
        
        if (response.startsWith('```json')) response = response.slice(7)
        if (response.startsWith('```')) response = response.slice(3)
        if (response.endsWith('```')) response = response.slice(0, -3)
        response = response.trim()

        const analysis = JSON.parse(response)
        
        const avgScore = (analysis.cultural_depth + analysis.emotional_connection + analysis.intergenerational_insights) / 3
        const earnings = Math.floor(10 + (avgScore / 10) * 10) // $10-20

        setResult({
          earnings,
          culturalDepth: analysis.cultural_depth,
          emotionalConnection: analysis.emotional_connection,
          feedback: analysis.feedback
        })
      } else {
        // Fallback without AI
        const lengthScore = Math.min(story.length / 100, 10)
        const earnings = Math.floor(10 + lengthScore)
        
        setResult({
          earnings,
          culturalDepth: 7,
          emotionalConnection: 8,
          feedback: 'Thank you for sharing your precious family memories! These stories preserve our cultural heritage.'
        })
      }
    } catch (error) {
      console.error('Analysis error:', error)
      // Fallback
      const earnings = 12
      setResult({
        earnings,
        culturalDepth: 7,
        emotionalConnection: 7,
        feedback: 'Beautiful story! Your family memories are treasures worth preserving.'
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const acceptReward = () => {
    if (result) {
      addCompletedActivity({
        id: `story-${Date.now()}`,
        type: 'story',
        timestamp: new Date().toISOString(),
        earnings: result.earnings,
        participants: [currentPlayerId],
        details: {
          storyLength: story.length,
          culturalDepth: result.culturalDepth,
          emotionalConnection: result.emotionalConnection
        }
      })

      alert(`🎉 Earned $${result.earnings}! Family stories preserved!`)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Story Sharing</h2>
                  <p className="text-purple-100 text-sm">Share Family Cooking Memories</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!result ? (
              <>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-purple-900 mb-1">Share Your Story</h3>
                      <p className="text-sm text-purple-700">
                        Write about a cherished family cooking memory, traditional recipe, or cultural food tradition. 
                        Share the wisdom passed down through generations! (500-1000 characters)
                      </p>
                    </div>
                  </div>
                </div>

                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value.slice(0, 1000))}
                  disabled={analyzing}
                  placeholder="Example: 'My grandmother's secret laksa recipe has been in our family for 3 generations. She would wake up at 5am to prepare the broth, teaching me patience and the importance of taking time to create something special...'"
                  className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-900"
                />
                
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className={`${story.length < 100 ? 'text-red-600' : story.length > 900 ? 'text-orange-600' : 'text-gray-600'}`}>
                    {story.length}/1000 characters {story.length < 100 && '(minimum 100)'}
                  </span>
                </div>

                <button
                  onClick={analyzeStory}
                  disabled={analyzing || story.trim().length < 100}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Story...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Share Story
                    </>
                  )}
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Story Shared!</h3>
                  <p className="text-green-700">{result.feedback}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Cultural Depth</p>
                    <p className="text-3xl font-bold text-purple-600">{result.culturalDepth}/10</p>
                  </div>
                  <div className="bg-white border-2 border-pink-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Emotion</p>
                    <p className="text-3xl font-bold text-pink-600">{result.emotionalConnection}/10</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">${result.earnings}</p>
                  <p className="text-xs text-gray-600">Family stories preserved!</p>
                </div>

                <button
                  onClick={acceptReward}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Collect Reward
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StorySharing
