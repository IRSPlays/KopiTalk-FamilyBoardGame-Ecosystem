import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, RefreshCw, Lightbulb, Heart, MapPin, Users, HelpCircle, Sparkles } from 'lucide-react'

interface ConversationStarterProps {
  location: string
  familyRoles: string[] // e.g., ['grandmother', 'grandson']
  currentActivity?: string
  onSuggestionUsed?: (suggestion: string) => void
  autoRotate?: boolean
  rotateInterval?: number // seconds
}

export const ConversationStarter: React.FC<ConversationStarterProps> = ({
  location,
  familyRoles,
  currentActivity,
  onSuggestionUsed,
  autoRotate = false,
  rotateInterval = 30
}) => {
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [suggestionsUsed, setSuggestionsUsed] = useState<string[]>([])

  // Location-based conversation starters
  const getLocationSuggestions = (loc: string): string[] => {
    const locationMap: { [key: string]: string[] } = {
      'wet_market': [
        "What was this place like 40 years ago?",
        "Can you teach me how to pick fresh vegetables?",
        "What's the secret to good haggling?",
        "Do you remember coming here with your parents?",
        "How has the wet market changed over the years?",
        "Can you teach me a Hokkien phrase for ordering?",
        "What's your favorite stall here and why?",
        "How do you know if fish is fresh?"
      ],
      'supermarket': [
        "How did people shop before supermarkets existed?",
        "What's the difference between this and a wet market?",
        "Do you prefer traditional markets or supermarkets?",
        "Can I help you use the self-checkout scanner?",
        "What items would you never buy at a supermarket?",
        "How has grocery shopping changed in your lifetime?",
        "Would you like me to explain these food labels?",
        "What do you think about online grocery delivery?"
      ],
      'mrt_station': [
        "What was transport like when you were young?",
        "Can you remember Singapore before the MRT?",
        "What do you think about the MRT app?",
        "How much did bus tickets cost back then?",
        "Can I show you how to check bus timings?",
        "Do you prefer buses or MRT? Why?",
        "What's your earliest memory of public transport?",
        "How did you get around before EZ-Link cards?"
      ],
      'cooking_area': [
        "What's your earliest cooking memory?",
        "How did you learn to cook this dish?",
        "What's the secret ingredient?",
        "Can you teach me your cooking technique?",
        "How has cooking changed with modern appliances?",
        "What kitchen tools did you use when young?",
        "What's a traditional recipe you'd like to share?",
        "How do you know when the dish is ready?"
      ],
      'home': [
        "Can you tell me a story about your childhood?",
        "What games did you play when you were young?",
        "How was your neighborhood different back then?",
        "What was school like in your time?",
        "Can you teach me something you learned from your parents?",
        "What's your favorite family memory?",
        "How did you celebrate festivals?",
        "What technology amazes you the most today?"
      ],
      'bus_stop': [
        "Do you remember the old bus tickets?",
        "How much did bus rides cost in the past?",
        "Can I teach you the bus timing app?",
        "What's your favorite bus route memory?",
        "How has the bus system improved?",
        "Did you take the bus to school?",
        "What changes have you seen in buses?",
        "Do you know any bus route shortcuts?"
      ]
    }

    return locationMap[loc] || locationMap['home']
  }

  // Activity-based conversation starters
  const getActivitySuggestions = (activity: string): string[] => {
    const activityMap: { [key: string]: string[] } = {
      'shopping': [
        "Let's compare prices - wet market vs supermarket",
        "Can you teach me how to spot fresh ingredients?",
        "What would you buy differently today vs 40 years ago?",
        "How do you plan your shopping list?"
      ],
      'cooking': [
        "What's the story behind this recipe?",
        "Can you share a cooking tip your mother taught you?",
        "How would you adapt this recipe for modern tastes?",
        "What tools make cooking easier now vs then?"
      ],
      'transport': [
        "Let's compare our routes - traditional vs app",
        "Can I show you real-time bus arrivals?",
        "What's the biggest change in Singapore transport?",
        "How did you navigate before GPS?"
      ],
      'learning': [
        "Can you teach me a word in your dialect?",
        "What slang do young people use today?",
        "How do you say 'delicious' in Hokkien?",
        "What's a phrase you use that's uniquely Singaporean?"
      ]
    }

    return activityMap[activity] || []
  }

  // Role-specific questions
  const getRoleBasedSuggestions = (roles: string[]): string[] => {
    const hasElderly = roles.some(r => ['grandfather', 'grandmother', 'elderly', 'grandparent'].includes(r))
    const hasYouth = roles.some(r => ['son', 'daughter', 'youth', 'child'].includes(r))

    if (hasElderly && hasYouth) {
      return [
        "Young person: Ask about life before smartphones",
        "Elder: Share a traditional skill or wisdom",
        "Young person: Explain a modern app feature",
        "Elder: Tell a story about your youth",
        "Young person: Show how you search for information",
        "Elder: Teach a dialect phrase or traditional saying",
        "Young person: Explain social media in simple terms",
        "Elder: Share how you solved problems without technology"
      ]
    }

    return []
  }

  // Combine all suggestions
  const getAllSuggestions = (): string[] => {
    const locationSuggestions = getLocationSuggestions(location)
    const activitySuggestions = currentActivity ? getActivitySuggestions(currentActivity) : []
    const roleSuggestions = getRoleBasedSuggestions(familyRoles)

    return [...locationSuggestions, ...activitySuggestions, ...roleSuggestions]
  }

  const suggestions = getAllSuggestions()
  const currentSuggestion = suggestions[currentSuggestionIndex]

  // Auto-rotate suggestions
  useEffect(() => {
    if (autoRotate && suggestions.length > 1) {
      const timer = setInterval(() => {
        setCurrentSuggestionIndex(prev => (prev + 1) % suggestions.length)
      }, rotateInterval * 1000)

      return () => clearInterval(timer)
    }
  }, [autoRotate, rotateInterval, suggestions.length])

  const handleNextSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length)
  }

  const handleUseSuggestion = (suggestion: string) => {
    setSuggestionsUsed([...suggestionsUsed, suggestion])
    if (onSuggestionUsed) {
      onSuggestionUsed(suggestion)
    }
    handleNextSuggestion()
  }

  const getSugestionIcon = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('teach')) return Heart
    if (suggestion.toLowerCase().includes('learn')) return Lightbulb
    if (suggestion.toLowerCase().includes('remember') || suggestion.toLowerCase().includes('memory')) return Sparkles
    if (suggestion.toLowerCase().includes('compare')) return Users
    if (suggestion.toLowerCase().includes('show') || suggestion.toLowerCase().includes('explain')) return HelpCircle
    return MessageCircle
  }

  const Icon = getSugestionIcon(currentSuggestion)

  return (
    <div className="w-full">
      {/* Compact View */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-4 shadow-lg cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h4 className="font-semibold text-sm">Conversation Starter</h4>
                <p className="text-xs opacity-90">Tap for suggestions</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
              {suggestions.length} ideas
            </div>
          </div>
        </motion.div>
      )}

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-2xl border-2 border-blue-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold text-lg">Conversation Starters</h3>
                    <p className="text-xs opacity-90">Break the ice and connect</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Location Badge */}
              <div className="mt-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm capitalize">{location.replace('_', ' ')}</span>
                {currentActivity && (
                  <>
                    <span className="opacity-60">•</span>
                    <span className="text-sm capitalize">{currentActivity}</span>
                  </>
                )}
              </div>
            </div>

            {/* Current Suggestion */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSuggestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200 mb-4"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <p className="text-lg text-gray-800 font-medium leading-relaxed">
                      {currentSuggestion}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleNextSuggestion}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Next Suggestion
                </button>
                <button
                  onClick={() => handleUseSuggestion(currentSuggestion)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  <Heart className="w-5 h-5" />
                  Use This
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {currentSuggestionIndex + 1} / {suggestions.length}
                </span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentSuggestionIndex + 1) / suggestions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Used Suggestions Counter */}
              {suggestionsUsed.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>You've used {suggestionsUsed.length} conversation starter{suggestionsUsed.length > 1 ? 's' : ''} today!</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ConversationStarter
