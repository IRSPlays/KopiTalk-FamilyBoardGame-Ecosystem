import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { GameSession, FamilyMember } from '../types'
import { 
  Users, Mic, Camera, ShoppingCart, ChefHat, Bus, CreditCard,
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Crown, Heart,
  Sparkles, DollarSign, ArrowRight, Package, Timer, Trophy,
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
import { ConversationAnalysis, VideoAnalysis, RandomEvent, getRandomEvent } from '../utils/geminiApi'

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
  
  // Core game state
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [showTikTokModal, setShowTikTokModal] = useState(false)
  const [diceRoll, setDiceRoll] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)

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
  
  // Enhanced features state
  const [activeTab, setActiveTab] = useState<'main' | 'features' | 'challenges' | 'stats' | 'ai' | 'advanced' | 'board' | 'settings'>('main')
  const [selectedModule, setSelectedModule] = useState<SingaporeLifeModule | null>(null)
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

  const diceRollVariants = {
    rolling: {
      rotate: [0, 360, 720, 1080],
      scale: [1, 1.2, 1, 1.2, 1],
      transition: { 
        duration: 1, 
        ease: [0.25, 0.1, 0.25, 1] as any
      }
    },
    stopped: {
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3 }
    }
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

  const currentPlayer = gameSession.family_members[gameSession.current_player_index]
  const nextPlayerIndex = (gameSession.current_player_index + 1) % gameSession.family_members.length

  // Helper functions
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'grandfather': return Crown
      case 'grandmother': return Heart
      case 'son': return Users
      case 'daughter': return Sparkles
      default: return Users
    }
  }

  const getDiceIcon = (number: number | null) => {
    if (!number) return Dice1
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    return icons[number - 1]
  }

  // Game mechanics
  const updatePlayer = (playerId: number, updates: Partial<FamilyMember>) => {
    const updatedMembers = gameSession.family_members.map((member, index) => 
      index === playerId ? { ...member, ...updates } : member
    )
    onUpdateGame({ family_members: updatedMembers })
  }

  const nextTurn = () => {
    onUpdateGame({ 
      current_player_index: nextPlayerIndex,
      last_updated: new Date().toISOString()
    })
    setDiceRoll(null)
  }

  const rollDice = () => {
    setIsRolling(true)
    
    let count = 0
    const interval = setInterval(() => {
      setDiceRoll(Math.floor(Math.random() * 6) + 1)
      count++
      
      if (count > 10) {
        clearInterval(interval)
        const finalRoll = Math.floor(Math.random() * 6) + 1
        setDiceRoll(finalRoll)
        setIsRolling(false)
        
        // Move current player
        const newPosition = Math.min(currentPlayer.position + finalRoll, 20)
        updatePlayer(gameSession.current_player_index, { position: newPosition })
        
        // Trigger random event
        const event = getRandomEvent()
        setCurrentEvent(event)
        setShowEventModal(true)
      }
    }, 100)
  }

  // Singapore Life Module handlers
  const startModule = (module: SingaporeLifeModule) => {
    setSelectedModule(module)
    // Navigate to the module
    navigate(module.path)
  }

  const completeModule = (moduleId: string) => {
    const module = singaporeLifeModules.find(m => m.id === moduleId)
    if (!module) return

    // Apply rewards to current player
    const updatedPlayer = {
      ...currentPlayer,
      cash: currentPlayer.cash + module.rewards.money,
      points: currentPlayer.points + module.rewards.points,
      position: Math.min(currentPlayer.position + module.rewards.movement, 20)
    }

    updatePlayer(gameSession.current_player_index, updatedPlayer)
    
    // Update family budget
    onUpdateGame({
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

  const handleMarketShopping = (marketId: string) => {
    const market = markets.find(m => m.id === marketId)
    if (!market) return
    
    const cost = Math.floor(Math.random() * 30) + 20
    const earnings = Math.floor(cost * 0.1) + 5
    
    if (currentPlayer.cash >= cost) {
      updatePlayer(gameSession.current_player_index, {
        cash: currentPlayer.cash - cost + earnings
      })
      alert(`🛒 Shopped at ${market.name}!\n💸 Spent: $${cost}\n💰 Earned from reselling: $${earnings}`)
    } else {
      alert(`❌ Not enough cash! You need $${cost} but only have $${currentPlayer.cash}`)
    }
  }

  // Tab Navigation Component
  const TabNavigation = () => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl p-2 sm:p-4 shadow-lg mb-4 sm:mb-6 overflow-x-auto"
    >
      <div className="flex items-center gap-1 sm:gap-2 min-w-max sm:min-w-0">
        {[
          { id: 'main', label: 'Main', fullLabel: 'Main Game', icon: Gamepad2 },
          { id: 'features', label: 'Life', fullLabel: 'Singapore Life', icon: MapPin },
          { id: 'challenges', label: 'Tasks', fullLabel: 'Challenges', icon: Trophy },
          { id: 'stats', label: 'Stats', fullLabel: 'Statistics', icon: TrendingUp },
          { id: 'ai', label: 'AI', fullLabel: 'AI Assistant', icon: Brain },
          { id: 'advanced', label: 'Extra', fullLabel: 'Advanced', icon: Zap },
          { id: 'board', label: 'Board', fullLabel: 'Smart Board', icon: Eye },
          { id: 'settings', label: 'Settings', fullLabel: 'Settings', icon: Settings }
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl transition-all touch-manipulation ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-kopi-500 to-talk-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">{tab.fullLabel}</span>
              <span className="sm:hidden">{tab.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-kopi-50 via-white to-talk-50">
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
              <p className="text-xl sm:text-2xl font-bold text-green-600">${gameSession.family_budget}</p>
            </div>
          </div>
        </motion.div>

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
                  const isCurrentPlayer = index === gameSession.current_player_index
                  
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all touch-manipulation ${
                        isCurrentPlayer 
                          ? 'border-kopi-400 bg-gradient-to-r from-kopi-50 to-talk-50 shadow-md' 
                          : 'border-gray-200 hover:border-kopi-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${isCurrentPlayer ? 'text-kopi-600' : 'text-gray-500'}`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-2 truncate">
                            <span className="truncate">{member.name}</span>
                            {isCurrentPlayer && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 capitalize">{member.role}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          isCurrentPlayer 
                            ? 'bg-gradient-to-r from-kopi-500 to-talk-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isCurrentPlayer ? 'PLAYING' : 'WAITING'}
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
                  Game Actions
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  
                  {/* Audio Recording */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowAudioModal(true)}
                    className="p-4 sm:p-6 bg-gradient-to-br from-talk-500 to-talk-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow touch-manipulation"
                  >
                    <Mic className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Record Conversation</h3>
                    <p className="text-xs sm:text-sm opacity-90">Have a family discussion and move 1-5 spaces</p>
                  </motion.button>

                  {/* TikTok Recording */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setShowTikTokModal(true)}
                    className="p-4 sm:p-6 bg-gradient-to-br from-kopi-500 to-kopi-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow touch-manipulation"
                  >
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">TikTok Challenge</h3>
                    <p className="text-xs sm:text-sm opacity-90">Create Singapore content and earn $5-25</p>
                  </motion.button>

                  {/* Dice Roll */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={rollDice}
                    disabled={isRolling}
                    className="p-4 sm:p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl disabled:opacity-50 shadow-md hover:shadow-lg transition-shadow touch-manipulation"
                  >
                    <motion.div
                      animate={isRolling ? "rolling" : "stopped"}
                      variants={diceRollVariants}
                    >
                      {React.createElement(getDiceIcon(diceRoll), { 
                        className: "w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3"
                      })}
                    </motion.div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                      {isRolling ? 'Rolling...' : diceRoll ? `Rolled ${diceRoll}!` : 'Roll Dice'}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      {diceRoll ? 'Turn ending...' : 'Move forward and end turn'}
                    </p>
                  </motion.button>

                  {/* End Turn Button */}
                  <motion.button
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={nextTurn}
                    className="p-4 sm:p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow touch-manipulation"
                  >
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">End Turn</h3>
                    <p className="text-xs sm:text-sm opacity-90">Pass to next family member</p>
                  </motion.button>
                </div>

                {/* Markets Grid */}
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Singapore Markets
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {markets.map((market, index) => (
                      <motion.button
                        key={market.id}
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMarketShopping(market.id)}
                        className="p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left transition-all hover:shadow-md touch-manipulation"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${market.color} flex-shrink-0`} />
                          <h4 className="font-semibold text-gray-800 text-xs sm:text-sm truncate flex-1">{market.name}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 truncate">{market.pricing}</p>
                        <p className="text-xs text-gray-500 truncate">{market.queue}</p>
                        <p className="text-xs text-green-600 font-medium mt-1 truncate">{market.special}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <div className={`w-2 h-2 rounded-full ${market.availability > 80 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                          <span className="text-xs text-gray-500">{market.availability}% available</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Singapore Life Features Tab */}
            {activeTab === 'features' && (
              <motion.div
                key="features-tab"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  Singapore Life Modules
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {singaporeLifeModules.map((module) => (
                    <div
                      key={module.id}
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <module.icon className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 mb-2">{module.name}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">{module.description}</p>
                          
                          {/* Rewards Preview */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${module.rewards.money}
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {module.rewards.points}pts
                            </span>
                            <span className="flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              +{module.rewards.movement}
                            </span>
                          </div>

                          {/* Skills Preview */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {module.rewards.skills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => startModule(module)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
                        >
                          Start Challenge
                        </button>
                        
                        <button
                          onClick={() => completeModule(module.id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        >
                          ✓ Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Singapore Culture Learning Section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl border border-red-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Gift className="w-6 h-6 text-red-500" />
                    Cultural Learning Bonus
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Complete all Singapore Life modules to unlock special cultural knowledge bonuses and family heritage achievements!
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-red-200">
                      <strong className="text-red-900">Heritage Master:</strong> Master all traditional recipes and cooking techniques
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <strong className="text-blue-900">Transport Expert:</strong> Navigate Singapore like a true local
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <strong className="text-green-900">Digital Citizen:</strong> Master modern Singapore living skills
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Family Challenges
                </h2>
                
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">Dynamic Challenges Coming Soon!</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    AI-generated family challenges based on your conversations and Singapore cultural activities will appear here.
                  </p>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Game Statistics
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{gameStats.totalPlayTime}m</div>
                    <div className="text-sm text-blue-600">Play Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{gameStats.featuresUsed}</div>
                    <div className="text-sm text-green-600">Features Used</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{gameStats.challengesCompleted}</div>
                    <div className="text-sm text-purple-600">Challenges</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <Sparkles className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{gameStats.culturalKnowledge}%</div>
                    <div className="text-sm text-orange-600">Culture Score</div>
                  </div>
                </div>

                {/* Skills Learned */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Skills Learned</h3>
                  <div className="flex flex-wrap gap-2">
                    {gameStats.skillsLearned.length > 0 ? gameStats.skillsLearned.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    )) : (
                      <p className="text-gray-500 italic">Start completing challenges to learn new skills!</p>
                    )}
                  </div>
                </div>

                {/* Progress Chart Placeholder */}
                <div className="p-6 bg-gray-50 rounded-xl text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-600 mb-2">Progress Analytics</h4>
                  <p className="text-gray-500 text-sm">Detailed progress charts and family engagement metrics coming soon!</p>
                </div>
              </div>
            )}

            {/* AI Assistant Tab */}
            {activeTab === 'ai' && (
              <AdvancedAIIntegration 
                gameSession={gameSession}
                onApplyRecommendation={(recommendation) => {
                  // Handle AI recommendation application
                  console.log('Applying recommendation:', recommendation)
                  // You could add logic here to automatically trigger the recommended module
                }}
                onStartAIChallenge={(challenge) => {
                  // Handle AI-generated challenge
                  console.log('Starting AI challenge:', challenge)
                }}
              />
            )}

            {/* Advanced Features Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                {/* Enhanced Challenge System */}
                <ChallengeSystem 
                  gameSession={gameSession}
                  onUpdateGame={onUpdateGame}
                  onCompleteChallenge={(challengeId, rewards) => {
                    // Apply challenge rewards to family members
                    const updatedMembers = gameSession.family_members.map(member => ({
                      ...member,
                      money: member.money + Math.floor(rewards.money / gameSession.family_members.length),
                      points: member.points + Math.floor(rewards.points / gameSession.family_members.length)
                    }))
                    
                    onUpdateGame({ 
                      family_members: updatedMembers
                    })
                    
                    // Show completion message
                    alert(`🎉 Challenge completed!\n\n💰 Each family member earned $${Math.floor(rewards.money / gameSession.family_members.length)}\n⭐ Each family member earned ${Math.floor(rewards.points / gameSession.family_members.length)} points!\n📚 Cultural Knowledge: +${rewards.culturalKnowledge}%\n❤️ Family Bonding: +${rewards.familyBondingBonus}`)
                  }}
                />
                
                {/* Enhanced Statistics Dashboard */}
                <EnhancedGameStatistics 
                  gameSession={gameSession}
                  onViewDetail={(section) => {
                    console.log('Viewing detailed stats for:', section)
                    // Could open a detailed modal or navigate to a specific section
                  }}
                />
              </div>
            )}

            {/* Smart Board Integration Tab */}
            {activeTab === 'board' && (
              <ESP32BoardIntegration 
                gameSession={gameSession}
                onBoardStateUpdate={(newState) => {
                  onUpdateGame(newState)
                  showNotification('Board state updated from camera!', 'success')
                }}
                onDetectionEvent={(detection) => {
                  console.log('Board detection event:', detection)
                  // Could trigger specific game events based on detection
                }}
              />
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
                onClick={() => { setShowEventModal(false); setTimeout(() => nextTurn(), 300) }}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-kopi-500 to-talk-500 text-white text-sm sm:text-base rounded-xl hover:from-kopi-600 hover:to-talk-600 transition-all duration-300 touch-manipulation"
              >
                Continue Family Time!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default GameplayInterface
