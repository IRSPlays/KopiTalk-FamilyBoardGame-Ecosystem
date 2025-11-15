import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, MessageCircle, ChefHat, Navigation, Heart, Utensils,
  BookOpen, Award, X, DollarSign, TrendingUp
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

// Import all activity components - USING ENHANCED VERSIONS
import DigitalSkillsTeachingEnhanced from './DigitalSkillsTeachingEnhanced'
import LanguageExchangeEnhanced from './LanguageExchangeEnhanced'
import CookingTipsExchange from './CookingTipsExchange'
import TransportNavigation from './TransportNavigation'
import HealthyEating from './HealthyEating'
import RecipeChallenge from './RecipeChallenge'
import StorySharing from './StorySharing'
import CulturalQuiz from './CulturalQuiz'

interface ActivitiesHubProps {
  currentPlayerId: number
  onClose: () => void
}

type ActivityType = 'digital_skills' | 'language' | 'cooking_tips' | 'transport' | 'healthy_eating' | 
  'recipe' | 'story' | 'quiz' | null

type ActivityInfo = {
  id: ActivityType
  name: string
  description: string
  icon: React.ReactNode
  earnings: string
  color: string
  category: 'Teaching' | 'Exchange' | 'Challenge'
}

const ActivitiesHub: React.FC<ActivitiesHubProps> = ({ currentPlayerId, onClose }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(null)
  const [filter, setFilter] = useState<'all' | 'Teaching' | 'Exchange' | 'Challenge'>('all')

  const completedActivities = useGameStore(state => state.completedActivities)
  const totalEarnings = completedActivities.reduce((sum, activity) => sum + activity.earnings, 0)

  const activities: ActivityInfo[] = [
    {
      id: 'digital_skills',
      name: 'Digital Skills',
      description: 'Youth teach elderly mobile payments, QR codes, kiosks',
      icon: <Smartphone className="w-6 h-6" />,
      earnings: '$10-15',
      color: 'from-blue-600 to-cyan-600',
      category: 'Teaching'
    },
    {
      id: 'language',
      name: 'Language Exchange',
      description: 'Learn dialects from elderly, teach modern slang',
      icon: <MessageCircle className="w-6 h-6" />,
      earnings: '$5-10',
      color: 'from-purple-600 to-pink-600',
      category: 'Exchange'
    },
    {
      id: 'cooking_tips',
      name: 'Cooking Tips',
      description: 'Share traditional techniques & modern shortcuts',
      icon: <ChefHat className="w-6 h-6" />,
      earnings: '$10-20',
      color: 'from-orange-600 to-red-600',
      category: 'Exchange'
    },
    {
      id: 'transport',
      name: 'Transport Navigation',
      description: 'Plan MRT routes together, discuss accessibility',
      icon: <Navigation className="w-6 h-6" />,
      earnings: '$10-18',
      color: 'from-green-600 to-teal-600',
      category: 'Challenge'
    },
    {
      id: 'healthy_eating',
      name: 'Healthy Eating',
      description: 'Analyze nutrition, balance tradition with health',
      icon: <Heart className="w-6 h-6" />,
      earnings: '$5-12',
      color: 'from-pink-600 to-rose-600',
      category: 'Challenge'
    },
    {
      id: 'recipe',
      name: 'Recipe Challenge',
      description: 'Guess ingredients, learn cultural significance',
      icon: <Utensils className="w-6 h-6" />,
      earnings: '$5-15',
      color: 'from-indigo-600 to-purple-600',
      category: 'Challenge'
    },
    {
      id: 'story',
      name: 'Story Sharing',
      description: 'Share family memories, preserve heritage',
      icon: <BookOpen className="w-6 h-6" />,
      earnings: '$10-20',
      color: 'from-amber-600 to-yellow-600',
      category: 'Exchange'
    },
    {
      id: 'quiz',
      name: 'Cultural Quiz',
      description: 'Test knowledge of Singapore food heritage',
      icon: <Award className="w-6 h-6" />,
      earnings: '$5-20',
      color: 'from-emerald-600 to-green-600',
      category: 'Challenge'
    }
  ]

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.category === filter)

  const getActivityCompletionCount = (activityId: string) => {
    return completedActivities.filter(a => a.type === activityId).length
  }

  const renderActivityComponent = () => {
    const props = { currentPlayerId, onClose: () => setSelectedActivity(null) }
    
    switch (selectedActivity) {
      case 'digital_skills': return <DigitalSkillsTeachingEnhanced {...props} />
      case 'language': return <LanguageExchangeEnhanced {...props} />
      case 'cooking_tips': return <CookingTipsExchange {...props} />
      case 'transport': return <TransportNavigation {...props} />
      case 'healthy_eating': return <HealthyEating {...props} />
      case 'recipe': return <RecipeChallenge {...props} />
      case 'story': return <StorySharing {...props} />
      case 'quiz': return <CulturalQuiz {...props} />
      default: return null
    }
  }

  return (
    <>
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
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Activities Hub</h2>
                    <p className="text-violet-100 text-sm">Earn Money Through Bonding</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xs text-violet-200">Total Activities</p>
                  <p className="text-2xl font-bold">{completedActivities.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xs text-violet-200">Total Earned</p>
                  <p className="text-2xl font-bold">${totalEarnings}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xs text-violet-200">Available</p>
                  <p className="text-2xl font-bold">{activities.length}</p>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="sticky top-[196px] bg-white border-b-2 border-gray-100 p-4 z-10">
              <div className="flex gap-2">
                {['all', 'Teaching', 'Exchange', 'Challenge'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab as typeof filter)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      filter === tab
                        ? 'bg-violet-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredActivities.map((activity) => {
                  const completions = getActivityCompletionCount(activity.id as string)
                  
                  return (
                    <motion.button
                      key={activity.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedActivity(activity.id)}
                      className="bg-white border-2 border-gray-200 hover:border-violet-300 rounded-2xl p-5 transition-all text-left relative overflow-hidden"
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-5`} />
                      
                      {/* Completion Badge */}
                      {completions > 0 && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {completions}
                        </div>
                      )}

                      {/* Content */}
                      <div className="relative">
                        <div className="flex items-start gap-4 mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{activity.name}</h3>
                            <p className="text-xs text-gray-600 line-clamp-2">{activity.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">{activity.earnings}</span>
                          </div>
                          <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                            {activity.category}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No activities found in this category</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Render Selected Activity Component */}
      {selectedActivity && renderActivityComponent()}
    </>
  )
}

export default ActivitiesHub
