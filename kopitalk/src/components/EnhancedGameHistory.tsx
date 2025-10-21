import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Coffee, MessageCircle, Users, Camera, Mic, ShoppingCart, ChefHat, 
  MapPin, CreditCard, Clock, Trophy, Play, Settings, History,
  Zap, Target, Heart, Star, Sparkles, Home, GamepadIcon,
  BarChart3, TrendingUp, Wifi, WifiOff, Activity, Plus
} from 'lucide-react'
import { gameStorage } from '../utils/gameStorage'
import { GameSession } from '../types'
import { navigateToGame } from '../utils/navigationHelper'

interface DashboardStats {
  totalGames: number
  totalPlayTime: number
  challengesCompleted: number
  familyEngagement: number
}

interface FeatureModule {
  icon: any
  label: string
  color: string
  path: string
  description: string
  isNew?: boolean
}

const EnhancedGameHistory: React.FC = () => {
  const navigate = useNavigate()
  const [games, setGames] = useState<GameSession[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalPlayTime: 0,
    challengesCompleted: 0,
    familyEngagement: 85
  })
  const [isServerConnected, setIsServerConnected] = useState(false)
  const [activeView, setActiveView] = useState<'dashboard' | 'games' | 'features'>('dashboard')

  useEffect(() => {
    const loadedGames = gameStorage.getGames()
    setGames(loadedGames)
    
    // Calculate stats
    setStats({
      totalGames: loadedGames.length,
      totalPlayTime: loadedGames.length * 45, // Estimated 45min per game
      challengesCompleted: Math.floor(loadedGames.length * 2.3), // ~2-3 challenges per game
      familyEngagement: 85 + Math.min(loadedGames.length * 2, 15) // Boost with experience
    })

    // Check server connection (simulated)
    checkServerConnection()
  }, [])

  const checkServerConnection = async () => {
    try {
      // Check if FastAPI server is running
      const response = await fetch('http://localhost:8000/admin/status')
      setIsServerConnected(response.ok)
    } catch {
      setIsServerConnected(false)
    }
  }

  const startNewGame = () => {
    navigate('/game')
  }

  const continueGame = (sessionId: string) => {
    navigate(`/game/${sessionId}`)
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const featureModules: FeatureModule[] = [
    { 
      icon: ShoppingCart, 
      label: 'Delivery Apps', 
      color: 'blue', 
      path: '/delivery',
      description: 'Shop at Singapore\'s top supermarkets with delivery challenges',
    },
    { 
      icon: ChefHat, 
      label: 'Cooking Game', 
      color: 'orange', 
      path: '/cooking',
      description: 'Follow step-by-step recipes for traditional dishes',
    },
    { 
      icon: MapPin, 
      label: 'Bus Timings', 
      color: 'green', 
      path: '/bus',
      description: 'Real-time Singapore public transport information',
    },
    { 
      icon: CreditCard, 
      label: 'EZ-Link Top-up', 
      color: 'purple', 
      path: '/ezlink',
      description: 'Simulate card transactions and balance management',
    }
  ]

  const gameActions = [
    {
      icon: Play,
      label: 'Start New Game',
      description: 'Begin a fresh family adventure',
      gradient: 'from-kopi-500 to-talk-500',
      action: startNewGame,
      accent: Zap
    },
    {
      icon: Mic,
      label: 'AI Conversation',
      description: 'Record family discussions for analysis',
      gradient: 'from-blue-500 to-purple-500',
      action: () => navigate('/game'),
      accent: MessageCircle
    },
    {
      icon: Camera,
      label: 'TikTok Challenge',
      description: 'Create viral content & earn rewards',
      gradient: 'from-pink-500 to-rose-500',
      action: () => navigate('/game'),
      accent: TrendingUp
    },
    {
      icon: Home,
      label: 'Board Setup',
      description: 'Connect & configure physical board',
      gradient: 'from-green-500 to-teal-500',
      action: () => navigate('/game'),
      accent: isServerConnected ? Wifi : WifiOff
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-kopi-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-talk-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8 text-kopi-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-kopi-600 to-talk-600 bg-clip-text text-transparent">
                KopiTalk
              </h1>
              <MessageCircle className="w-8 h-8 text-talk-500" />
            </div>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <div className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm text-gray-600">
                {isServerConnected ? 'Board Connected' : 'Board Offline'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex bg-white rounded-lg p-1 shadow-md">
              {[
                { key: 'dashboard', icon: Home, label: 'Dashboard' },
                { key: 'games', icon: History, label: 'Games' },
                { key: 'features', icon: Star, label: 'Features' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveView(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeView === tab.key 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden lg:block">{tab.label}</span>
                </button>
              ))}
            </div>
            <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Bridge generations through meaningful conversations and fun challenges. 
                A digital companion for real-life family bonding.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                {/* Kopi (Traditional) Card */}
                <div className="bg-gradient-to-br from-kopi-500 to-kopi-600 p-8 rounded-2xl text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <Coffee className="w-12 h-12 mb-4 mx-auto opacity-90" />
                  <h3 className="text-2xl font-bold mb-3">Kopi</h3>
                  <p className="opacity-90 mb-4">Traditional connections through storytelling, wisdom sharing, and cultural heritage.</p>
                  <div className="flex items-center justify-center gap-2 text-kopi-100">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Cultural Storytelling</span>
                  </div>
                </div>

                {/* Talk (Modern) Card */}
                <div className="bg-gradient-to-br from-talk-500 to-talk-600 p-8 rounded-2xl text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <MessageCircle className="w-12 h-12 mb-4 mx-auto opacity-90" />
                  <h3 className="text-2xl font-bold mb-3">Talk</h3>
                  <p className="opacity-90 mb-4">Modern conversations with AI-powered topics, TikTok trends, and digital challenges.</p>
                  <div className="flex items-center justify-center gap-2 text-talk-100">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">AI-Powered Analysis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <GamepadIcon className="w-8 h-8 text-blue-500" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalGames}</h3>
                <p className="text-sm text-gray-600">Games Played</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-green-500" />
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{formatTime(stats.totalPlayTime)}</h3>
                <p className="text-sm text-gray-600">Total Play Time</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.challengesCompleted}</h3>
                <p className="text-sm text-gray-600">Challenges Done</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-8 h-8 text-red-500" />
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.familyEngagement}%</h3>
                <p className="text-sm text-gray-600">Family Bond</p>
              </div>
            </div>

            {/* Main Game Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gameActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`group bg-gradient-to-br ${action.gradient} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <action.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <action.accent className="w-5 h-5 opacity-75" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{action.label}</h3>
                    <p className="opacity-90 text-sm">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Games View */}
        {activeView === 'games' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Game History</h2>
              <button
                onClick={startNewGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-kopi-500 to-talk-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                New Game
              </button>
            </div>

            <div className="grid gap-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-blue-200"
                  onClick={() => continueGame(game.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <GamepadIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Game Session {game.id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {game.family_members?.length || 0} players • {formatDate(game.last_updated)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {game.difficulty}
                      </span>
                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        {game.game_phase.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{game.family_members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span>Level {game.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>~45min</span>
                    </div>
                  </div>
                </div>
              ))}

              {games.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <GamepadIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No games yet</h3>
                  <p className="mb-6">Start your first family adventure!</p>
                  <button
                    onClick={startNewGame}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-kopi-500 to-talk-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Play className="w-5 h-5" />
                    Start First Game
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features View */}
        {activeView === 'features' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Singapore Life Modules</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featureModules.map((module, index) => (
                <button
                  key={index}
                  onClick={() => navigate(module.path)}
                  className={`group p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-${module.color}-200 text-left`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-${module.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <module.icon className={`w-8 h-8 text-${module.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{module.label}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>
                      {module.isNew && (
                        <span className="inline-block mt-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          New Feature
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
              <p className="mb-6 opacity-90">
                We're constantly adding new features to enhance your family gaming experience. 
                Stay tuned for weather integration, location-based challenges, and more!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Target, label: 'Weather Challenges' },
                  { icon: MapPin, label: 'GPS Adventures' },
                  { icon: Star, label: 'Achievement System' },
                  { icon: Users, label: 'Family Leaderboard' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 opacity-75">
                    <feature.icon className="w-5 h-5" />
                    <span className="text-sm">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>KopiTalk • Bridging Generations Through Play</p>
          <p className="mt-1">Physical board game meets digital intelligence</p>
        </footer>
      </div>
    </div>
  )
}

export default EnhancedGameHistory