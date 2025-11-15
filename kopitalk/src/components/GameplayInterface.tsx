import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { GameSession, FamilyMember } from '../types'
import { 
  Users, Mic, Camera, ShoppingCart, ChefHat, Bus, CreditCard, Train,
  Crown, Heart, Sparkles, DollarSign, ArrowRight, Package, Timer, Trophy,
  Gift, MapPin, Clock, Zap, Target, Activity, TrendingUp,
  Settings, Home, Play, Pause, RotateCcw, CheckCircle,
  AlertCircle, Star, Gamepad2, Wallet, Brain, Eye
} from 'lucide-react'
import AudioRecordingModal from './AudioRecordingModal'
import TikTokRecordingModal from './TikTokRecordingModal'
import ChallengeSystem from './ChallengeSystem'
import EnhancedGameStatistics from './EnhancedGameStatistics'
import AdvancedAIIntegration from './AdvancedAIIntegration'
import ESP32BoardIntegration from './ESP32BoardIntegration'
import GameSettingsPanel from './GameSettingsPanel'
import ChallengeBanner from './ChallengeBanner'
import Breadcrumb from './Breadcrumb'
import MRTStation from './MRTStation'
import ActivitiesHub from './ActivitiesHub'
import { ConversationAnalysis, VideoAnalysis, RandomEvent, getRandomEvent } from '../utils/geminiApi'
import { useGameStore } from '../stores/gameStore'

interface Props {
  gameSession: GameSession
  onUpdateGame: (updates: Partial<GameSession>) => void
}

interface SingaporeLifeModule {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
  path: string
  rewards: {
    money: number
    points: number
    movement: number
    skills: string[]
  }
  isCompleted: boolean
  inProgress: boolean
  completedCount: number
}

interface GameStats {
  totalPlayTime: number
  featuresUsed: number
  challengesCompleted: number
  skillsLearned: string[]
  culturalKnowledge: number
}

interface Market {
  id: string
  name: string
  type: 'supermarket' | 'wet_market' | 'online'
  availability: number
  pricing: string
  queue: string
  special: string
  color: string
}

const GameplayInterface: React.FC<Props> = ({ gameSession, onUpdateGame }) => {
  const navigate = useNavigate()
  
  // ✅ FIX: Get family_budget from Zustand store (source of truth)
  const family_budget = useGameStore(state => state.family_budget)
  
  // ✅ FIX: Sync gameSession.family_budget with Zustand store on mount
  useEffect(() => {
    if (gameSession.family_budget !== undefined && gameSession.family_budget !== family_budget) {
      useGameStore.setState({ family_budget: gameSession.family_budget })
    }
  }, [gameSession.family_budget])
  
  // Core game state
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [showTikTokModal, setShowTikTokModal] = useState(false)
  const [showEZLinkModal, setShowEZLinkModal] = useState(false)
  const [showActivitiesHub, setShowActivitiesHub] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [pendingMovement, setPendingMovement] = useState<number>(0)
  const [movementReason, setMovementReason] = useState<string>('')

  // Notification system
  const showNotification = (message: string, type: 'success' | 'warning' | 'error') => {
    const notification = document.createElement('div')
    const color = type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'
    notification.className = `fixed top-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded-lg shadow-lg z-50`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }
  
  // ✅ SIMPLIFIED: Only 3 tabs - Main, Statistics, Settings
  const [activeTab, setActiveTab] = useState<'main' | 'stats' | 'settings'>('main')
  const [selectedModule, setSelectedModule] = useState<SingaporeLifeModule | null>(null)
  
  // ✅ Pull real stats from Zustand store
  const completedActivities = useGameStore(state => state.completedActivities)
  const collectedIngredients = useGameStore(state => state.collectedIngredients)
  const total_conversations = useGameStore(state => state.total_conversations)
  const bonding_level = useGameStore(state => state.bonding_level)
  
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPlayTime: 0,
    featuresUsed: 0,
    challengesCompleted: 0,
    skillsLearned: [],
    culturalKnowledge: 0
  })

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const cardHoverVariants = {
    hover: { 
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    })
  }

  // Singapore Life Modules - ALL FEATURES INTEGRATED
  const singaporeLifeModules: SingaporeLifeModule[] = [
    {
      id: 'delivery',
      name: 'Food Delivery Challenge',
      icon: Package,
      color: 'blue',
      description: 'Shop at Singapore\'s top supermarkets with delivery challenges',
      path: '/delivery',
      rewards: {
        money: 15,
        points: 10,
        movement: 2,
        skills: ['Shopping', 'Budgeting', 'Local Knowledge']
      },
      isCompleted: false,
      inProgress: false,
      completedCount: 0
    },
    {
      id: 'cooking',
      name: 'Heritage Recipes',
      icon: ChefHat,
      color: 'orange',
      description: 'Master traditional Singaporean dishes step by step',
      path: '/cooking',
      rewards: {
        money: 5,
        points: 20,
        movement: 1,
        skills: ['Cooking', 'Cultural Heritage', 'Family Bonding']
      },
      isCompleted: false,
      inProgress: false,
      completedCount: 0
    },
    {
      id: 'transport',
      name: 'Public Transport Master',
      icon: Bus,
      color: 'green',
      description: 'Navigate Singapore\'s transport system like a pro',
      path: '/bus',
      rewards: {
        money: 0,
        points: 15,
        movement: 3,
        skills: ['Navigation', 'Planning', 'Independence']
      },
      isCompleted: false,
      inProgress: false,
      completedCount: 0
    },
    {
      id: 'ezlink',
      name: 'Digital Payments',
      icon: CreditCard,
      color: 'purple',
      description: 'Master EZ-Link card management and transactions',
      path: '/ezlink',
      rewards: {
        money: 10,
        points: 12,
        movement: 1,
        skills: ['Financial Literacy', 'Technology', 'Planning']
      },
      isCompleted: false,
      inProgress: false,
      completedCount: 0
    }
  ]

  // Enhanced Markets with more Singapore locations
  const markets: Market[] = [
    {
      id: 'causeway',
      name: 'Causeway Point Supermarket',
      type: 'supermarket',
      availability: 85,
      pricing: 'Higher prices, premium quality',
      queue: 'Short queues, air-conditioned',
      special: '10% discount on weekends',
      color: 'bg-blue-500'
    },
    {
      id: 'wet_market',
      name: 'Toa Payoh Wet Market',
      type: 'wet_market', 
      availability: 95,
      pricing: 'Best prices, fresh daily',
      queue: 'Crowded mornings, authentic experience',
      special: 'Cash only, haggling welcome',
      color: 'bg-green-500'
    },
    {
      id: 'redmart',
      name: 'RedMart Online Delivery',
      type: 'online',
      availability: 70,
      pricing: 'Competitive online prices',
      queue: '2-hour same-day delivery',
      special: '$8 delivery fee, contactless',
      color: 'bg-red-500'
    },
    {
      id: 'sheng_siong',
      name: 'Sheng Siong Supermarket',
      type: 'supermarket',
      availability: 90,
      pricing: 'Value-for-money pricing',
      queue: 'Moderate crowds, local favorite',
      special: 'Member discounts, loyalty points',
      color: 'bg-yellow-500'
    }
  ]

  // Helper functions - No more turn-based system, all players can act simultaneously
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'grandfather': return Crown
      case 'grandmother': return Heart
      case 'son': return Users
      case 'daughter': return Sparkles
      default: return Users
    }
  }

  // Game mechanics
  const updatePlayer = (playerId: number, updates: Partial<FamilyMember>) => {
    const updatedMembers = gameSession.family_members.map((member, index) => 
      index === playerId ? { ...member, ...updates } : member
    )
    onUpdateGame({ family_members: updatedMembers })
  }

  // REMOVED: Turn-based system replaced with continuous roleplay
  // Movement is now conversation-based through AI analysis

  // Singapore Life Module handlers
  const startModule = (module: SingaporeLifeModule) => {
    setSelectedModule(module)
    // Navigate to the module
    navigate(module.path)
  }

  const completeModule = (moduleId: string, playerId?: number) => {
    const module = singaporeLifeModules.find(m => m.id === moduleId)
    if (!module) return

    // Apply rewards to all active players (collaborative roleplay)
    const updatedMembers = gameSession.family_members.map((member, index) => {
      // If specific player ID provided, only update that player
      if (playerId !== undefined && index !== playerId) return member
      return {
        ...member,
        cash: member.cash + module.rewards.money,
        points: member.points + module.rewards.points,
        position: Math.min(member.position + module.rewards.movement, 20)
      }
    })

    onUpdateGame({ 
      family_members: updatedMembers,
      family_budget: gameSession.family_budget + (module.rewards.money * 0.5)
    })

    // Update game stats
    setGameStats(prev => ({
      ...prev,
      featuresUsed: prev.featuresUsed + 1,
      challengesCompleted: prev.challengesCompleted + 1,
      skillsLearned: [...new Set([...prev.skillsLearned, ...module.rewards.skills])],
      culturalKnowledge: prev.culturalKnowledge + 10
    }))

    alert(`🎉 ${module.name} completed!\n�� Earned $${module.rewards.money}\n⭐ Gained ${module.rewards.points} points\n🚀 Moved ${module.rewards.movement} spaces\n📚 Learned: ${module.rewards.skills.join(', ')}`)
  }

  // AI Integration handlers
  const handleAudioAnalysis = (result: ConversationAnalysis) => {
    const updatedMembers = gameSession.family_members.map(member => ({
      ...member,
      position: Math.min(member.position + result.movement, 20),
      points: member.points + Math.floor(result.quality / 10),
    }))
    
    onUpdateGame({ 
      family_members: updatedMembers,
      family_budget: gameSession.family_budget + Math.floor(result.movement * 2)
    })
    
    setShowAudioModal(false)
    alert(`${result.feedback}\nFamily moved: ${result.movement} spaces\nBonding Level: ${result.bonding_level}`)
  }

  const handleTikTokEarnings = (result: VideoAnalysis) => {
    const earningsPerMember = Math.floor(result.earnings / gameSession.family_members.length)
    const updatedMembers = gameSession.family_members.map(member => ({
      ...member,
      cash: member.cash + earningsPerMember,
      points: member.points + Math.floor(result.performance_score / 10)
    }))
    
    onUpdateGame({ 
      family_members: updatedMembers,
      family_budget: gameSession.family_budget + result.earnings
    })
    
    setShowTikTokModal(false)
    alert(`${result.feedback}\nFamily earned: $${result.earnings}!\nCreativity: ${result.creativity_level}`)
  }

  const handleMarketShopping = (marketId: string, playerId: number) => {
    const market = markets.find(m => m.id === marketId)
    if (!market) return
    
    const player = gameSession.family_members[playerId]
    const cost = Math.floor(Math.random() * 30) + 20
    const earnings = Math.floor(cost * 0.1) + 5
    
    // FIXED: Use family_budget for family game (shared money pool)
    if (gameSession.family_budget >= cost) {
      onUpdateGame({
        family_budget: gameSession.family_budget - cost + earnings
      })
      showNotification(`🛒 ${player.name} shopped at ${market.name}! Spent $${cost}, earned $${earnings} for the family`, 'success')
    } else {
      showNotification(`❌ ${player.name} needs $${cost} but family only has $${gameSession.family_budget}`, 'error')
    }
  }

  // ✅ REVAMPED: Simplified Tab Navigation (Only 3 tabs)
  const TabNavigation = () => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg mb-6"
    >
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {[
          { id: 'main', label: 'Game Actions', icon: Gamepad2, color: 'from-blue-500 to-purple-500' },
          { id: 'stats', label: 'Statistics', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
          { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-slate-500' }
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all shadow-md ${
              activeTab === tab.id 
                ? `bg-gradient-to-r ${tab.color} text-white` 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-semibold text-sm sm:text-base">
              {tab.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-kopi-50 via-white to-talk-50">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Family Setup', path: undefined },
          { label: 'Board Setup', path: undefined },
          { label: 'Game', path: undefined, isActive: true }
        ]}
        onBack={() => navigate('/')}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                <span className="break-words">Today's Family Challenge!</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Cook Grandma's Secret Laksa Recipe Together</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Family Budget</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">${family_budget.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        {/* AI-Generated Dish Challenge Banner */}
        <ChallengeBanner />

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Family Bonding Indicator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-kopi-500 to-talk-500 rounded-2xl p-3 sm:p-4 shadow-lg mb-4 sm:mb-6 text-white"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Family Bonding Time</h2>
                <p className="opacity-90 text-xs sm:text-sm">Connect across generations through Singapore life!</p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm opacity-90">Active Players</p>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4" />
                <span className="font-medium">{gameSession.family_members.length} Members</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Players Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
            >
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                Family Members
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {gameSession.family_members.map((member, index) => {
                  const Icon = getRoleIcon(member.role)
                  
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 sm:p-4 rounded-xl border-2 border-gray-200 hover:border-kopi-300 transition-all touch-manipulation"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-kopi-600" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-2 truncate">
                            <span className="truncate">{member.name}</span>
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 capitalize">{member.role}</p>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-gradient-to-r from-kopi-500 to-talk-500 text-white">
                          ACTIVE
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <Wallet className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-gray-500 whitespace-nowrap">Cash:</span>
                          <span className="font-medium text-green-600 truncate">${member.cash}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-500 whitespace-nowrap">Pos:</span>
                          <span className="font-medium truncate">{member.position}/20</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-500 whitespace-nowrap">Pts:</span>
                          <span className="font-medium text-blue-600 truncate">{member.points}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-500 whitespace-nowrap">EZ:</span>
                          <span className="font-medium truncate">${member.ezlink_balance}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Main Content Panel */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            
            {/* Main Game Tab */}
            <AnimatePresence mode="wait">
            {activeTab === 'main' && (
              <motion.div 
                key="main-tab"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  All Game Actions
                </h2>
                
                {/* UNIFIED GAME ACTIONS GRID - ALL FEATURES IN ONE PLACE */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  
                  {/* CONVERSATION & BONDING */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowAudioModal(true)}
                    className="p-4 sm:p-5 bg-gradient-to-br from-talk-500 to-talk-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <Mic className="w-6 h-6 sm:w-7 sm:h-7 mb-2" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1">Audio Conversation</h3>
                    <p className="text-xs opacity-90">Record family chat • Move 1-5 tiles</p>
                  </motion.button>

                  {/* TIKTOK CONTENT */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowTikTokModal(true)}
                    className="p-4 sm:p-5 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <Camera className="w-6 h-6 sm:w-7 sm:h-7 mb-2" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1">TikTok Challenge</h3>
                    <p className="text-xs opacity-90">Create content • Earn $5-25</p>
                  </motion.button>

                  {/* DELIVERY APP */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => startModule(singaporeLifeModules.find(m => m.id === 'delivery')!)}
                    className="p-4 sm:p-5 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <Package className="w-6 h-6 sm:w-7 sm:h-7 mb-2" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1">Delivery App</h3>
                    <p className="text-xs opacity-90">Order groceries online</p>
                  </motion.button>

                  {/* SUPERMARKET SHOPPING */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/supermarket')}
                    className="p-4 sm:p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 mb-2" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1">Supermarket</h3>
                    <p className="text-xs opacity-90">Self-checkout shopping</p>
                  </motion.button>

                  {/* WET MARKET - TEMPORARILY DISABLED */}
                  {/* <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleMarketShopping('wet_market', 0)}
                    className="p-4 sm:p-5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 mb-2" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1">Wet Market</h3>
                    <p className="text-xs opacity-90">Traditional market visit</p>
                  </motion.button> */}

                  {/* AI COOKING GAME - ENHANCED */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/cooking-ai')}
                    className="p-4 sm:p-5 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">AI Cooking</h3>
                    <p className="text-xs opacity-90">Drag & drop with timers</p>
                  </motion.button>

                  {/* MRT TRANSPORT */}
                                    {/* ✅ UNIFIED EZ-LINK: MRT Travel + Card Management */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowEZLinkModal(true)}
                    className="p-4 sm:p-5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CreditCard className="w-6 h-6 sm:w-7 sm:h-7" />
                      <Train className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">EZ-Link</h3>
                    <p className="text-xs opacity-90">MRT travel & top-up</p>
                  </motion.button>

                  {/* ACTIVITIES HUB */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowActivitiesHub(true)}
                    className="p-4 sm:p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all touch-manipulation"
                  >
                    <Activity className="w-6 h-6 sm:w-7 sm:h-7 mb-2" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1">Activities Hub</h3>
                    <p className="text-xs opacity-90">Bonding activities</p>
                  </motion.button>
                </div>

                {/* MOVEMENT STATUS */}
                {pendingMovement > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 sm:p-5 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-7 h-7" />
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">Ready to Move!</h3>
                        <p className="text-sm opacity-90">
                          {movementReason || `You earned ${pendingMovement} tiles from your conversation`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Statistics Tab - ✅ Shows REAL data from Zustand store */}
            {activeTab === 'stats' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Game Statistics
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Mic className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{total_conversations}</div>
                    <div className="text-sm text-blue-600">Conversations</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{completedActivities.length}</div>
                    <div className="text-sm text-green-600">Activities Done</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <ShoppingCart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{collectedIngredients.length}</div>
                    <div className="text-sm text-purple-600">Ingredients</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <Heart className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{Math.round(bonding_level)}</div>
                    <div className="text-sm text-orange-600">Bonding Level</div>
                  </div>
                </div>

                {/* Family Budget & Money Earned */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Family Budget
                  </h3>
                  <div className="text-3xl font-bold text-green-600">${family_budget.toFixed(2)}</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Earned through conversations, activities, and challenges!
                  </p>
                </div>

                {/* Recent Activities */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Recent Activities</h3>
                  <div className="space-y-2">
                    {completedActivities.length > 0 ? completedActivities.slice(-5).reverse().map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 capitalize">{activity.type.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          +${activity.earnings.toFixed(2)}
                        </span>
                      </div>
                    )) : (
                      <p className="text-gray-500 italic text-center py-4">
                        Start playing to see your activities here!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <GameSettingsPanel 
                gameSession={gameSession}
                onSettingsUpdate={(settings) => {
                  console.log('Settings updated:', settings)
                  // Apply settings to the game
                }}
                onResetSettings={() => {
                  console.log('Settings reset to defaults')
                }}
                onExportData={() => {
                  // Export game data
                  const gameData = {
                    session: gameSession,
                    timestamp: new Date().toISOString(),
                    version: '1.0'
                  }
                  const dataStr = JSON.stringify(gameData, null, 2)
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
                  
                  const exportFileDefaultName = `singapore-board-game-${Date.now()}.json`
                  
                  const linkElement = document.createElement('a')
                  linkElement.setAttribute('href', dataUri)
                  linkElement.setAttribute('download', exportFileDefaultName)
                  linkElement.click()
                }}
                onImportData={(data) => {
                  console.log('Importing data:', data)
                  if (data.session) {
                    onUpdateGame(data.session)
                    showNotification('Game data imported successfully!', 'success')
                  }
                }}
              />
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AudioRecordingModal
        isOpen={showAudioModal}
        onClose={() => setShowAudioModal(false)}
        onAnalysisComplete={handleAudioAnalysis}
      />

      <TikTokRecordingModal
        isOpen={showTikTokModal}
        onClose={() => setShowTikTokModal(false)}
        onEarningsComplete={handleTikTokEarnings}
      />

      {/* Random Event Modal */}
      <AnimatePresence>
      {showEventModal && currentEvent && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEventModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-5xl sm:text-6xl mb-4"
              >
                {currentEvent.emoji}
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{currentEvent.title}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{currentEvent.description}</p>
              
              {currentEvent.effect && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-kopi-50 to-talk-50 rounded-xl p-4 mb-6"
                >
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    {currentEvent.effect.money && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-1 text-green-600"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>+${currentEvent.effect.money}</span>
                      </motion.div>
                    )}
                    {currentEvent.effect.movement && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-1 text-blue-600"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>+{currentEvent.effect.movement} spaces</span>
                      </motion.div>
                    )}
                    {currentEvent.effect.points && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-1 text-purple-600"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>+{currentEvent.effect.points} points</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEventModal(false)}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-kopi-500 to-talk-500 text-white text-sm sm:text-base rounded-xl hover:from-kopi-600 hover:to-talk-600 transition-all duration-300 touch-manipulation"
              >
                Continue Roleplay!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* ✅ UNIFIED EZ-LINK MODAL: MRT + Card Management */}
      {showEZLinkModal && (
        <MRTStation
          currentPlayerId={0}
          onClose={() => setShowEZLinkModal(false)}
          onTravelComplete={(destination) => {
            console.log('Travel complete to:', destination)
            // Update player position on board
            setShowEZLinkModal(false)
          }}
        />
      )}

      {/* ✅ ACTIVITIES HUB MODAL: Bonding Activities */}
      {showActivitiesHub && (
        <ActivitiesHub
          currentPlayerId={0}
          onClose={() => setShowActivitiesHub(false)}
        />
      )}
    </div>
  )
}

export default GameplayInterface
