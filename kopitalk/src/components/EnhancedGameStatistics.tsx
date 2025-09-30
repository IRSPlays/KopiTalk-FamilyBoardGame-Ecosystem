import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion'
import { GameSession } from '../types'
import { 
  BarChart3, TrendingUp, Users, Clock, Trophy, Target, 
  Star, Heart, DollarSign, MapPin, ChefHat, Package,
  Bus, CreditCard, Calendar, Zap, Award, Sparkles,
  Activity, PieChart, LineChart, ArrowUp, ArrowDown,
  Medal, Gift, Brain, BookOpen, Home, Gamepad2
} from 'lucide-react'
import { 
  containerVariants, 
  itemVariants, 
  cardHoverVariants,
  fadeInUp,
  scaleIn,
  counterVariants
} from '../utils/animations'

interface GameStats {
  totalGamesPlayed: number
  totalPlayTime: number
  averageGameDuration: number
  totalPointsEarned: number
  totalMoneyEarned: number
  challengesCompleted: number
  familyBondingScore: number
  culturalKnowledgeGained: number
  skillsLearned: string[]
  favoriteModule: string
  streakDays: number
  achievements: Achievement[]
  weeklyProgress: WeeklyProgress[]
  moduleUsageStats: ModuleStats[]
  playerPerformance: PlayerStats[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt: string
  category: string
}

interface WeeklyProgress {
  week: string
  gamesPlayed: number
  pointsEarned: number
  challengesCompleted: number
  culturalKnowledge: number
}

interface ModuleStats {
  module: string
  icon: string
  timesUsed: number
  averageScore: number
  favoriteFeature: string
  totalTimeSpent: number
  completionRate: number
}

interface PlayerStats {
  playerName: string
  level: number
  totalPoints: number
  favoriteSkill: string
  strongestArea: string
  improvementArea: string
  achievements: number
}

interface Props {
  gameSession: GameSession
  onViewDetail: (section: string) => void
}

// Animated counter component
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ 
  value, 
  duration = 1.5, 
  suffix = '' 
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [displayValue, setDisplayValue] = useState(0)

  React.useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const increment = end / (duration * 60) // 60fps
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayValue(end)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [isInView, value, duration])

  return <div ref={ref}>{displayValue.toLocaleString()}{suffix}</div>
}

// Animated progress bar
const AnimatedProgressBar: React.FC<{ progress: number; color: string }> = ({ progress, color }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${progress}%` } : { width: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  )
}

const EnhancedGameStatistics: React.FC<Props> = ({ gameSession, onViewDetail }) => {
  const [stats, setStats] = useState<GameStats>({
    totalGamesPlayed: 0,
    totalPlayTime: 0,
    averageGameDuration: 0,
    totalPointsEarned: 0,
    totalMoneyEarned: 0,
    challengesCompleted: 0,
    familyBondingScore: 0,
    culturalKnowledgeGained: 0,
    skillsLearned: [],
    favoriteModule: '',
    streakDays: 0,
    achievements: [],
    weeklyProgress: [],
    moduleUsageStats: [],
    playerPerformance: []
  })
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week')
  const [selectedCategory, setSelectedCategory] = useState<'overview' | 'modules' | 'players' | 'achievements'>('overview')

  // Load and calculate statistics
  useEffect(() => {
    calculateGameStatistics()
  }, [gameSession, selectedTimeframe])

  const calculateGameStatistics = () => {
    // Mock comprehensive statistics (in real app, this would come from game storage)
    const mockStats: GameStats = {
      totalGamesPlayed: 23,
      totalPlayTime: 14400, // 4 hours in seconds
      averageGameDuration: 626, // ~10 minutes
      totalPointsEarned: 2450,
      totalMoneyEarned: 485,
      challengesCompleted: 12,
      familyBondingScore: 87,
      culturalKnowledgeGained: 76,
      skillsLearned: ['Local Cuisine', 'Navigation', 'Digital Ordering', 'Content Creation', 'Family Traditions', 'Time Management', 'Urban Planning', 'Cultural Awareness'],
      favoriteModule: 'Delivery App',
      streakDays: 5,
      achievements: [
        { id: '1', title: 'Singapore Explorer', description: 'Completed first delivery challenge', icon: '🗺️', rarity: 'common', unlockedAt: '2024-01-15', category: 'Exploration' },
        { id: '2', title: 'Heritage Chef', description: 'Cooked 3 traditional recipes', icon: '👨‍🍳', rarity: 'rare', unlockedAt: '2024-01-18', category: 'Cooking' },
        { id: '3', title: 'Transport Master', description: 'Used all transport modes in one game', icon: '🚇', rarity: 'epic', unlockedAt: '2024-01-20', category: 'Transport' },
        { id: '4', title: 'Family Bond Builder', description: 'Achieved 90+ family bonding score', icon: '👨‍👩‍👧‍👦', rarity: 'legendary', unlockedAt: '2024-01-22', category: 'Family' },
        { id: '5', title: 'Cultural Bridge', description: 'Gained 75+ cultural knowledge', icon: '🌉', rarity: 'epic', unlockedAt: '2024-01-24', category: 'Culture' }
      ],
      weeklyProgress: [
        { week: 'Week 1', gamesPlayed: 5, pointsEarned: 450, challengesCompleted: 2, culturalKnowledge: 15 },
        { week: 'Week 2', gamesPlayed: 8, pointsEarned: 720, challengesCompleted: 4, culturalKnowledge: 28 },
        { week: 'Week 3', gamesPlayed: 6, pointsEarned: 680, challengesCompleted: 3, culturalKnowledge: 18 },
        { week: 'Week 4', gamesPlayed: 4, pointsEarned: 600, challengesCompleted: 3, culturalKnowledge: 15 }
      ],
      moduleUsageStats: [
        { module: 'Delivery App', icon: '📦', timesUsed: 12, averageScore: 85, favoriteFeature: 'Hawker Food Orders', totalTimeSpent: 3600, completionRate: 92 },
        { module: 'Cooking Game', icon: '🍳', timesUsed: 8, averageScore: 78, favoriteFeature: 'Recipe Collection', totalTimeSpent: 4200, completionRate: 87 },
        { module: 'Bus Timings', icon: '🚌', timesUsed: 15, averageScore: 91, favoriteFeature: 'Real-time Updates', totalTimeSpent: 1800, completionRate: 95 },
        { module: 'EZ-Link TopUp', icon: '💳', timesUsed: 6, averageScore: 89, favoriteFeature: 'Balance Tracking', totalTimeSpent: 900, completionRate: 100 },
        { module: 'TikTok Creator', icon: '🎬', timesUsed: 4, averageScore: 72, favoriteFeature: 'Family Content', totalTimeSpent: 2700, completionRate: 75 }
      ],
      playerPerformance: gameSession.family_members.map((member, index) => ({
        playerName: member.name,
        level: 3 + index,
        totalPoints: 400 + (index * 150),
        favoriteSkill: ['Local Cuisine', 'Navigation', 'Content Creation', 'Cultural Awareness'][index] || 'General Gaming',
        strongestArea: ['Cooking', 'Transport', 'Social Media', 'Family Bonding'][index] || 'General',
        improvementArea: ['Time Management', 'Planning', 'Cultural Knowledge', 'Digital Skills'][index] || 'Overall',
        achievements: 3 + index
      }))
    }
    
    setStats(mockStats)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getProgressColor = (score: number): string => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    if (score >= 50) return 'text-orange-500'
    return 'text-red-500'
  }

  const renderOverviewStats = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Key Metrics Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 sm:p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Total Games</p>
              <p className="text-xl sm:text-2xl font-bold">
                <AnimatedCounter value={stats.totalGamesPlayed} />
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
            </motion.div>
          </div>
          <motion.div 
            className="mt-2 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ArrowUp className="w-3 h-3" />
            <span className="text-xs text-blue-100">+3 this week</span>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 sm:p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm">Total Points</p>
              <p className="text-xl sm:text-2xl font-bold">
                <AnimatedCounter value={stats.totalPointsEarned} />
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
            </motion.div>
          </div>
          <motion.div 
            className="mt-2 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ArrowUp className="w-3 h-3" />
            <span className="text-xs text-green-100">+450 this week</span>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-3 sm:p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">Family Bonding</p>
              <p className="text-xl sm:text-2xl font-bold">
                <AnimatedCounter value={stats.familyBondingScore} suffix="%" />
              </p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            >
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
            </motion.div>
          </div>
          <motion.div 
            className="mt-2 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ArrowUp className="w-3 h-3" />
            <span className="text-xs text-purple-100">+5% this week</span>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-3 sm:p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs sm:text-sm">Cultural Score</p>
              <p className="text-xl sm:text-2xl font-bold">
                <AnimatedCounter value={stats.culturalKnowledgeGained} suffix="%" />
              </p>
            </div>
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-orange-200" />
            </motion.div>
          </div>
          <motion.div 
            className="mt-2 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ArrowUp className="w-3 h-3" />
            <span className="text-xs text-orange-100">+12% this week</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Weekly Progress Chart */}
      <motion.div 
        className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
        variants={fadeInUp}
        whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-blue-500" />
          Weekly Progress Trends
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {stats.weeklyProgress.map((week, index) => (
            <motion.div 
              key={week.week} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ backgroundColor: "#e5e7eb", scale: 1.02 }}
            >
              <div className="font-medium text-gray-900 mb-2 sm:mb-0">{week.week}</div>
              <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-blue-500" />
                  <AnimatedCounter value={week.gamesPlayed} suffix=" games" />
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-green-500" />
                  <AnimatedCounter value={week.pointsEarned} suffix=" pts" />
                </div>
                <div className="flex items-center gap-2 hidden sm:flex">
                  <Target className="w-4 h-4 text-purple-500" />
                  <AnimatedCounter value={week.challengesCompleted} suffix=" done" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skills & Achievements */}
      <motion.div 
        className="grid md:grid-cols-2 gap-6 sm:gap-8"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-green-500" />
            Skills Learned ({stats.skillsLearned.length})
          </h3>
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.skillsLearned.map((skill, index) => (
              <motion.span 
                key={skill} 
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                variants={scaleIn}
                whileHover={{ scale: 1.1, backgroundColor: "#86efac" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {stats.achievements.slice(-3).map((achievement, index) => (
              <motion.div 
                key={achievement.id} 
                className={`p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    {achievement.icon}
                  </motion.span>
                  <div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-xs opacity-75">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )

  const renderModuleStats = () => (
    <div className="space-y-6">
      {stats.moduleUsageStats.map(module => (
        <div key={module.module} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                {module.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{module.module}</h3>
                <p className="text-gray-600">Most used feature: {module.favoriteFeature}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{module.averageScore}</div>
              <div className="text-sm text-gray-500">Avg Score</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{module.timesUsed}</div>
              <div className="text-sm text-gray-600">Times Used</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{formatDuration(module.totalTimeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-bold ${getProgressColor(module.completionRate)}`}>
                {module.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {Math.round(module.totalTimeSpent / module.timesUsed / 60)}m
              </div>
              <div className="text-sm text-gray-600">Avg Session</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Mastery Level</span>
              <span>{module.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${module.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderPlayerStats = () => (
    <div className="space-y-6">
      {stats.playerPerformance.map((player, index) => (
        <div key={player.playerName} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${index === 0 ? 'bg-yellow-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{index === 0 ? '👑' : '👤'}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{player.playerName}</h3>
                <p className="text-gray-600">Level {player.level} • {player.achievements} achievements</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{player.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Points</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800">Favorite Skill</span>
              </div>
              <p className="text-green-700">{player.favoriteSkill}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Strongest Area</span>
              </div>
              <p className="text-blue-700">{player.strongestArea}</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-orange-800">Focus Area</span>
              </div>
              <p className="text-orange-700">{player.improvementArea}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderAchievements = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {stats.achievements.map(achievement => (
        <div key={achievement.id} className={`p-6 rounded-xl border-2 ${getRarityColor(achievement.rarity)}`}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{achievement.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">{achievement.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm opacity-75 mb-2">{achievement.description}</p>
              <div className="flex items-center gap-4 text-xs">
                <span>📅 {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                <span>📂 {achievement.category}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Game Analytics Dashboard
          </h1>
          <div className="flex gap-2">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{formatDuration(stats.totalPlayTime)}</div>
            <div className="text-sm opacity-90">Total Play Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.challengesCompleted}</div>
            <div className="text-sm opacity-90">Challenges Done</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${stats.totalMoneyEarned}</div>
            <div className="text-sm opacity-90">Money Earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.streakDays}</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.achievements.length}</div>
            <div className="text-sm opacity-90">Achievements</div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'modules', label: 'Modules', icon: Package },
          { key: 'players', label: 'Players', icon: Users },
          { key: 'achievements', label: 'Achievements', icon: Trophy }
        ].map(category => {
          const Icon = category.icon
          return (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedCategory === category.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          )
        })}
      </div>

      {/* Dynamic Content */}
      <div className="min-h-[400px]">
        {selectedCategory === 'overview' && renderOverviewStats()}
        {selectedCategory === 'modules' && renderModuleStats()}
        {selectedCategory === 'players' && renderPlayerStats()}
        {selectedCategory === 'achievements' && renderAchievements()}
      </div>

      {/* Export/Share Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Progress</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
            📊 Export Report
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
            📱 Share on Social
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
            🏆 Compare with Friends
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnhancedGameStatistics