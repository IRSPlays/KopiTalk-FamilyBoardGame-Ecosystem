import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, ChevronRight, DollarSign, CreditCard, Heart,
  Save, Menu, X, ShoppingCart, ChefHat, Bus, Store,
  Wallet, Activity, TrendingUp, Clock, Settings,
  ArrowLeft, LogOut
} from 'lucide-react'
import { GameSession } from '../types'
import { useGameStore } from '../stores/gameStore'

interface GameNavigationProps {
  currentPage: string
  gameSession?: GameSession
  showMoneyBar?: boolean
  showBondingMeter?: boolean
  allowExit?: boolean
  onExit?: () => void
}

const GameNavigation: React.FC<GameNavigationProps> = ({
  currentPage,
  gameSession,
  showMoneyBar = true,
  showBondingMeter = true,
  allowExit = true,
  onExit
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  // Get game state from store
  const family_budget = useGameStore(state => state.family_budget)
  const ezlink_balance = useGameStore(state => state.ezlink_balance)
  const bonding_level = useGameStore(state => state.bonding_level)
  const conversation_quality = useGameStore(state => state.conversation_quality)

  // Navigation items with icons and paths
  const navigationItems = [
    {
      name: 'Main Board',
      path: '/board-game',
      icon: Home,
      color: 'text-purple-600',
      description: 'Game board'
    },
    {
      name: 'Delivery App',
      path: '/delivery',
      icon: ShoppingCart,
      color: 'text-blue-600',
      description: 'Order online'
    },
    {
      name: 'Wet Market',
      path: '/wet-market',
      icon: Activity,
      color: 'text-green-600',
      description: 'Traditional market'
    },
    {
      name: 'Supermarket',
      path: '/supermarket-self-order',
      icon: Store,
      color: 'text-cyan-600',
      description: 'Self-checkout'
    },
    {
      name: 'Transport',
      path: '/mrt',
      icon: Bus,
      color: 'text-indigo-600',
      description: 'MRT & Bus'
    },
    {
      name: 'Cooking',
      path: '/cooking',
      icon: ChefHat,
      color: 'text-orange-600',
      description: 'Cook dishes'
    },
    {
      name: 'History',
      path: '/history',
      icon: Clock,
      color: 'text-gray-600',
      description: 'Game history'
    }
  ]

  // Generate breadcrumb trail
  const getBreadcrumbs = () => {
    const crumbs = [
      { name: 'Home', path: '/' }
    ]

    if (gameSession) {
      crumbs.push({ name: 'Board Game', path: '/board-game' })
    }

    if (currentPage && currentPage !== 'Board Game') {
      crumbs.push({ name: currentPage, path: location.pathname })
    }

    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Handle save and exit
  const handleSaveAndExit = () => {
    // Zustand automatically persists state
    setShowSaveNotification(true)
    setTimeout(() => {
      setShowSaveNotification(false)
      if (onExit) {
        onExit()
      } else {
        navigate('/')
      }
    }, 1500)
  }

  // Format money display
  const formatMoney = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  // Get bonding color
  const getBondingColor = (level: number) => {
    if (level >= 80) return 'text-pink-600 bg-pink-100'
    if (level >= 60) return 'text-purple-600 bg-purple-100'
    if (level >= 40) return 'text-blue-600 bg-blue-100'
    if (level >= 20) return 'text-gray-600 bg-gray-100'
    return 'text-gray-500 bg-gray-100'
  }

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-gradient-to-r from-kopi-500 to-talk-500 text-white shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Breadcrumbs & Stats */}
          <div className="flex items-center justify-between py-3 border-b border-white/20">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <ChevronRight className="w-4 h-4 opacity-60" />}
                  <Link
                    to={crumb.path}
                    className={`hover:underline transition-opacity ${
                      index === breadcrumbs.length - 1
                        ? 'font-semibold opacity-100'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </React.Fragment>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              {showMoneyBar && (
                <>
                  {/* Family Budget */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5"
                  >
                    <DollarSign className="w-4 h-4" />
                    <div>
                      <div className="text-xs opacity-80">Family Budget</div>
                      <div className="font-bold">{formatMoney(family_budget)}</div>
                    </div>
                  </motion.div>

                  {/* EZ-Link Balance */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <div>
                      <div className="text-xs opacity-80">EZ-Link</div>
                      <div className="font-bold">{formatMoney(ezlink_balance)}</div>
                    </div>
                  </motion.div>
                </>
              )}

              {showBondingMeter && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5"
                >
                  <Heart className="w-4 h-4" />
                  <div>
                    <div className="text-xs opacity-80">Bonding</div>
                    <div className="font-bold flex items-center gap-1">
                      {bonding_level}%
                      {conversation_quality === 'excellent' && (
                        <TrendingUp className="w-3 h-3 text-green-300" />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Bottom Row - Quick Links & Actions */}
          <div className="hidden md:flex items-center justify-between py-2">
            {/* Quick Links */}
            <div className="flex items-center gap-2">
              {navigationItems.map(item => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-kopi-600 font-semibold shadow-lg'
                        : 'hover:bg-white/20'
                    }`}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              {allowExit && (
                <button
                  onClick={handleSaveAndExit}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-kopi-600 hover:bg-opacity-90 rounded-lg font-semibold transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm">Save & Exit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-kopi-500 to-talk-500 text-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Menu</h3>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Stats */}
                <div className="space-y-2">
                  {showMoneyBar && (
                    <>
                      <div className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <span>Family Budget</span>
                        </div>
                        <span className="font-bold">{formatMoney(family_budget)}</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          <span>EZ-Link</span>
                        </div>
                        <span className="font-bold">{formatMoney(ezlink_balance)}</span>
                      </div>
                    </>
                  )}
                  {showBondingMeter && (
                    <div className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        <span>Bonding Level</span>
                      </div>
                      <span className="font-bold">{bonding_level}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2">
                {navigationItems.map(item => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-kopi-500 to-talk-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => {
                    navigate(-1)
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </button>

                {allowExit && (
                  <button
                    onClick={() => {
                      handleSaveAndExit()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-kopi-500 to-talk-500 text-white rounded-lg font-semibold transition-all shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    Save & Exit
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Save Notification */}
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50"
          >
            <Save className="w-6 h-6" />
            <span className="font-semibold">Game Saved Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GameNavigation
