import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Coffee, MessageCircle, Users, Camera, Mic, ShoppingCart, ChefHat, 
  MapPin, CreditCard, Clock, Trophy, Play, Settings, History,
  Zap, Target, Heart, Star, Sparkles, Home, GamepadIcon,
  BarChart3, TrendingUp, Wifi, WifiOff, Activity
} from 'lucide-react'
import { gameStorage } from '../utils/gameStorage'
import { GameSession } from '../types'

interface DashboardStats {
  totalGames: number
  totalPlayTime: number
  challengesCompleted: number
  familyEngagement: number
}

const GameDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [games, setGames] = useState<GameSession[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalPlayTime: 0,
    challengesCompleted: 0,
    familyEngagement: 85
  })
  const [isServerConnected, setIsServerConnected] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-kopi-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-talk-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
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
              <div className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isServerConnected ? 'Board Connected' : 'Board Offline'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <History className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <GamepadIcon className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalGames}</h3>
            <p className="text-sm text-gray-600">Games Played</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-green-500" />
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatTime(stats.totalPlayTime)}</h3>
            <p className="text-sm text-gray-600">Total Play Time</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.challengesCompleted}</h3>
            <p className="text-sm text-gray-600">Challenges Done</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-red-500" />
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.familyEngagement}%</h3>
            <p className="text-sm text-gray-600">Family Bond</p>
          </div>
        </div>

        {/* Main Action Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Primary Game Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start New Game */}
              <button
                onClick={startNewGame}
                className="group bg-gradient-to-br from-kopi-500 to-talk-500 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <Play className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <Zap className="w-6 h-6 opacity-75" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start New Game</h3>
                <p className="opacity-90 text-sm">Begin a fresh family adventure</p>
              </button>

              {/* AI Conversation */}
              <button
                onClick={() => navigate('/game')}
                className="group bg-gradient-to-br from-blue-500 to-purple-500 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <MessageCircle className="w-6 h-6 opacity-75" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Conversation</h3>
                <p className="opacity-90 text-sm">Record family discussions</p>
              </button>

              {/* TikTok Challenge */}
              <button
                onClick={() => navigate('/game')}
                className="group bg-gradient-to-br from-pink-500 to-rose-500 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <Camera className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <TrendingUp className="w-6 h-6 opacity-75" />
                </div>
                <h3 className="text-xl font-bold mb-2">TikTok Challenge</h3>
                <p className="opacity-90 text-sm">Create viral content & earn</p>
              </button>

              {/* Board Setup */}
              <button
                onClick={() => navigate('/game')}
                className="group bg-gradient-to-br from-green-500 to-teal-500 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <Home className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  {isServerConnected ? <Wifi className="w-6 h-6 opacity-75" /> : <WifiOff className="w-6 h-6 opacity-75" />}
                </div>
                <h3 className="text-xl font-bold mb-2">Board Setup</h3>
                <p className="opacity-90 text-sm">Connect physical board</p>
              </button>
            </div>
          </div>

          {/* Recent Games */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Games</h2>
            <div className="space-y-4">
              {games.slice(0, 3).map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => continueGame(game.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900">
                        {game.family_members?.length || 0} Players
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(game.last_updated)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {game.difficulty}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">
                      {game.game_phase.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}

              {games.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <GamepadIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No games yet</p>
                  <p className="text-sm">Start your first family adventure!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Modules */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Singapore Life Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShoppingCart, label: 'Delivery Apps', color: 'blue', path: '/delivery' },
              { icon: ChefHat, label: 'Cooking Game', color: 'orange', path: '/cooking' },
              { icon: MapPin, label: 'Bus Timings', color: 'green', path: '/bus' },
              { icon: CreditCard, label: 'EZ-Link Top-up', color: 'purple', path: '/ezlink' }
            ].map((module, index) => (
              <button
                key={index}
                onClick={() => navigate(module.path)}
                className={`p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 hover:border-${module.color}-200 group`}
              >
                <div className={`w-12 h-12 bg-${module.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <module.icon className={`w-6 h-6 text-${module.color}-600`} />
                </div>
                <p className="font-medium text-gray-800">{module.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>KopiTalk • Bridging Generations Through Play</p>
          <p className="mt-1">Physical board game meets digital intelligence</p>
        </footer>
      </div>
    </div>
  )
}

export default GameDashboard