import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Bus, Clock, MapPin, RefreshCw, Navigation, Star, 
  CreditCard, DollarSign, History, Smartphone, Train, CheckCircle, 
  AlertCircle, Users, BookOpen, TrendingUp, Gamepad2, HelpCircle,
  Plus, Minus, Zap, Trophy, Target
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { navigateToGame } from '../utils/navigationHelper'

interface BusService {
  service_no: string
  operator: string
  route: string
  next_bus: string
  subsequent_bus: string
  status: 'Operating' | 'Not Operating'
  fare: number
}

interface BusStop {
  id: string
  name: string
  road: string
  services: BusService[]
  is_favorite: boolean
}

interface Transaction {
  id: string
  type: 'top_up' | 'deduction' | 'journey'
  amount: number
  description: string
  location: string
  datetime: string
  balance_after: number
  earnings?: number
}

type TutorialStep = 'welcome' | 'check_balance' | 'top_up' | 'find_bus' | 'plan_journey' | 'tap_in' | 'tap_out' | 'complete'
type ActiveTab = 'balance' | 'topup' | 'journey' | 'history'

const BusTimings: React.FC = () => {
  const navigate = useNavigate()
  
  // Zustand selectors for optimal performance
  const ezlink_balance = useGameStore(state => state.ezlink_balance)
  const updateEzlinkBalance = useGameStore(state => state.updateEzlinkBalance)
  const family_budget = useGameStore(state => state.family_budget)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const players = useGameStore(state => state.players)
  const activeWeatherChallenge = useGameStore(state => state.activeWeatherChallenge)
  
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [favoriteStops, setFavoriteStops] = useState<string[]>(['01012', '01013'])
  const [activeTab, setActiveTab] = useState<ActiveTab>('balance')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('welcome')
  const [tutorialActive, setTutorialActive] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<Set<TutorialStep>>(new Set())
  const [currentJourney, setCurrentJourney] = useState<{start: string, destination: string, fare: number} | null>(null)
  const [journeyHistory, setJourneyHistory] = useState<Transaction[]>([])

  // Enhanced bus stops with fare information
  const busStops: BusStop[] = useMemo(() => {
    const weatherMultiplier = activeWeatherChallenge?.effects.priceMultiplier || 1
    return [
      {
        id: '01012',
        name: 'Opp Raffles Hotel',
        road: 'Beach Rd',
        is_favorite: true,
        services: [
          { service_no: '7', operator: 'SBST', route: 'Marina Centre ⟷ Changi Airport', next_bus: '3 min', subsequent_bus: '12 min', status: 'Operating', fare: 1.20 * weatherMultiplier },
          { service_no: '36', operator: 'SBST', route: 'Orchard ⟷ Changi Airport', next_bus: '8 min', subsequent_bus: '18 min', status: 'Operating', fare: 1.50 * weatherMultiplier },
          { service_no: '56', operator: 'SBST', route: 'Orchard ⟷ Changi Airport', next_bus: '15 min', subsequent_bus: '25 min', status: 'Operating', fare: 1.80 * weatherMultiplier },
          { service_no: '75', operator: 'SBST', route: 'Bishan Int ⟷ Changi Airport', next_bus: '6 min', subsequent_bus: '16 min', status: 'Operating', fare: 2.20 * weatherMultiplier }
        ]
      },
      {
        id: '01013',
        name: 'Raffles Hotel',
        road: 'Beach Rd',
        is_favorite: true,
        services: [
          { service_no: '7', operator: 'SBST', route: 'Marina Centre ⟷ Changi Airport', next_bus: '5 min', subsequent_bus: '14 min', status: 'Operating', fare: 1.20 * weatherMultiplier },
          { service_no: '36', operator: 'SBST', route: 'Orchard ⟷ Changi Airport', next_bus: '10 min', subsequent_bus: '20 min', status: 'Operating', fare: 1.50 * weatherMultiplier },
          { service_no: '56', operator: 'SBST', route: 'Orchard ⟷ Changi Airport', next_bus: '17 min', subsequent_bus: '27 min', status: 'Operating', fare: 1.80 * weatherMultiplier },
          { service_no: '75', operator: 'SBST', route: 'Bishan Int ⟷ Changi Airport', next_bus: '2 min', subsequent_bus: '12 min', status: 'Operating', fare: 2.20 * weatherMultiplier }
        ]
      },
      {
        id: '04168',
        name: 'Marina Bay Sands',
        road: 'Bayfront Ave',
        is_favorite: false,
        services: [
          { service_no: '97', operator: 'SBST', route: 'Toa Payoh Int ⟷ Marina Bay', next_bus: '4 min', subsequent_bus: '12 min', status: 'Operating', fare: 1.60 * weatherMultiplier },
          { service_no: '106', operator: 'SBST', route: 'Shenton Way ⟷ Marina Bay', next_bus: '7 min', subsequent_bus: '15 min', status: 'Operating', fare: 1.40 * weatherMultiplier },
          { service_no: '133', operator: 'SBST', route: 'Ang Mo Kio ⟷ Marina Bay', next_bus: '9 min', subsequent_bus: '19 min', status: 'Operating', fare: 1.90 * weatherMultiplier }
        ]
      },
      {
        id: '02031',
        name: 'Orchard Towers',
        road: 'Orchard Rd',
        is_favorite: false,
        services: [
          { service_no: '14', operator: 'SBST', route: 'Bedok Int ⟷ Orchard', next_bus: '6 min', subsequent_bus: '16 min', status: 'Operating', fare: 1.70 * weatherMultiplier },
          { service_no: '16', operator: 'SBST', route: 'Bedok North Depot ⟷ Orchard', next_bus: '11 min', subsequent_bus: '21 min', status: 'Operating', fare: 1.80 * weatherMultiplier },
          { service_no: '65', operator: 'SBST', route: 'Tampines Int ⟷ Orchard', next_bus: '3 min', subsequent_bus: '13 min', status: 'Operating', fare: 1.50 * weatherMultiplier },
          { service_no: '111', operator: 'SBST', route: 'Ghim Moh Depot ⟷ Orchard', next_bus: '8 min', subsequent_bus: '18 min', status: 'Operating', fare: 1.30 * weatherMultiplier }
        ]
      },
      {
        id: '50009',
        name: 'Chinatown Point',
        road: 'New Bridge Rd',
        is_favorite: false,
        services: [
          { service_no: '61', operator: 'SBST', route: 'Eunos Int ⟷ Chinatown', next_bus: '5 min', subsequent_bus: '15 min', status: 'Operating', fare: 1.40 * weatherMultiplier },
          { service_no: '124', operator: 'SBST', route: 'Punggol Temp Int ⟷ Chinatown', next_bus: '12 min', subsequent_bus: '22 min', status: 'Operating', fare: 2.00 * weatherMultiplier },
          { service_no: '143', operator: 'SBST', route: 'Upper East Coast ⟷ Chinatown', next_bus: '7 min', subsequent_bus: '17 min', status: 'Operating', fare: 1.60 * weatherMultiplier }
        ]
      },
      {
        id: '28009',
        name: 'Bugis Junction',
        road: 'Victoria St',
        is_favorite: false,
        services: [
          { service_no: '2', operator: 'SBST', route: 'Changi Village ⟷ Genting Lane', next_bus: '4 min', subsequent_bus: '14 min', status: 'Operating', fare: 1.90 * weatherMultiplier },
          { service_no: '12', operator: 'SBST', route: 'Jurong East Int ⟷ Bugis', next_bus: '9 min', subsequent_bus: '19 min', status: 'Operating', fare: 2.10 * weatherMultiplier },
          { service_no: '51', operator: 'SBST', route: 'Tampines Int ⟷ Bugis', next_bus: '6 min', subsequent_bus: '16 min', status: 'Operating', fare: 1.70 * weatherMultiplier },
          { service_no: '63', operator: 'SBST', route: 'Eunos Int ⟷ Bugis', next_bus: '11 min', subsequent_bus: '21 min', status: 'Operating', fare: 1.50 * weatherMultiplier }
        ]
      }
    ]
  }, [activeWeatherChallenge])

  const topUpAmounts = [5, 10, 20, 30, 50, 100]

  const filteredStops = busStops.filter(stop => 
    stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stop.road.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stop.services.some(service => service.service_no.includes(searchQuery))
  )

  // Tutorial system
  const tutorialSteps = {
    welcome: {
      title: "Learn Singapore Public Transport! 🚌",
      content: "Hi! Let's learn how to use Singapore's amazing public transport system together. I'll teach you how to check EZ-Link balance, top up, plan journeys, and earn money by helping each other navigate!",
      highlight: "",
      action: "Let's Start!"
    },
    check_balance: {
      title: "Step 1: Check Your EZ-Link Balance",
      content: "First, let's check how much money is on your EZ-Link card. This is very important before any journey!",
      highlight: "balance-tab",
      action: "Check Balance!"
    },
    top_up: {
      title: "Step 2: Top Up Your Card",
      content: "If your balance is low, let's add money to your EZ-Link card. You can do this at MRT stations, 7-Eleven, or using mobile apps!",
      highlight: "topup-tab",
      action: "Learn Top Up!"
    },
    find_bus: {
      title: "Step 3: Find Your Bus",
      content: "Now let's find which bus to take. You can search by bus number or location. Each bus has different routes and timing!",
      highlight: "bus-search",
      action: "Find Bus!"
    },
    plan_journey: {
      title: "Step 4: Plan Your Journey",
      content: "Choose your starting point and destination. The app will show you the fare and help you plan the best route!",
      highlight: "journey-tab",
      action: "Plan Journey!"
    },
    tap_in: {
      title: "Step 5: Tap In When Boarding",
      content: "When you board the bus, tap your EZ-Link card on the reader near the driver. You'll hear a beep and see the fare deducted!",
      highlight: "tap-in",
      action: "Tap In!"
    },
    tap_out: {
      title: "Step 6: Tap Out When Alighting",
      content: "Before leaving the bus, tap your card again at the exit. This ensures you pay the correct fare for your journey!",
      highlight: "tap-out",
      action: "Tap Out!"
    },
    complete: {
      title: "Congratulations! You're a Transport Expert! 🎉",
      content: "You've successfully learned how to use Singapore's public transport system! These skills will help you travel independently and teach others too.",
      highlight: "",
      action: "Complete!"
    }
  }

  const currentTutorial = tutorialSteps[tutorialStep]

  const nextTutorialStep = () => {
    const steps: TutorialStep[] = ['welcome', 'check_balance', 'top_up', 'find_bus', 'plan_journey', 'tap_in', 'tap_out', 'complete']
    const currentIndex = steps.indexOf(tutorialStep)
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      setTutorialStep(nextStep)
      setCompletedSteps(prev => new Set([...prev, tutorialStep]))
    }
  }

  const refreshTimings = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      if (tutorialActive && tutorialStep === 'find_bus') {
        nextTutorialStep()
      }
    }, 1500)
  }

  const toggleFavorite = (stopId: string) => {
    setFavoriteStops(prev => 
      prev.includes(stopId) 
        ? prev.filter(id => id !== stopId)
        : [...prev, stopId]
    )
  }

  const handleTopUp = async () => {
    const amount = selectedAmount || parseFloat(customAmount)
    if (!amount || amount < 1 || amount > 500) {
      alert('Please select or enter a valid amount between $1 and $500')
      return
    }

    if (amount > family_budget) {
      alert(`❌ Not enough budget! Need $${amount.toFixed(2)} but only have $${family_budget.toFixed(2)}`)
      return
    }

    setIsProcessing(true)
    
    setTimeout(() => {
      // Update balances
      updateEzlinkBalance(ezlink_balance + amount)
      updateFamilyBudget(family_budget - amount)
      
      // Calculate earnings for teaching digital skills
      const earnings = Math.floor(amount * 0.1) + 5 // 10% of top-up + $5 bonus
      updateFamilyBudget(family_budget - amount + earnings)

      // Track activity
      addCompletedActivity({
        id: `ezlink-topup-${Date.now()}`,
        type: 'transport',
        earnings,
        timestamp: new Date().toISOString(),
        participants: players.map(p => p.id),
        details: `Successfully topped up EZ-Link card with $${amount.toFixed(2)} - earned digital skills bonus`
      })

      // Add to journey history
      const newTransaction: Transaction = {
        id: `topup-${Date.now()}`,
        type: 'top_up',
        amount,
        description: 'EZ-Link Top-up via App',
        location: 'Mobile App',
        datetime: new Date().toLocaleString(),
        balance_after: ezlink_balance + amount,
        earnings
      }
      setJourneyHistory(prev => [newTransaction, ...prev])

      setIsProcessing(false)
      setShowSuccess(true)
      setSelectedAmount(null)
      setCustomAmount('')
      
      if (tutorialActive && tutorialStep === 'top_up') {
        nextTutorialStep()
      }

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 2000)
  }

  const handleJourney = (service: BusService, stop: BusStop) => {
    if (service.fare > ezlink_balance) {
      alert(`❌ Insufficient EZ-Link balance! Need $${service.fare.toFixed(2)} but only have $${ezlink_balance.toFixed(2)}`)
      return
    }

    // Simulate tap in
    const journeyStart = {
      start: stop.name,
      destination: service.route.split('⟷')[1].trim(),
      fare: service.fare
    }
    setCurrentJourney(journeyStart)

    if (tutorialActive && tutorialStep === 'tap_in') {
      nextTutorialStep()
    }
  }

  const completeTapOut = () => {
    if (!currentJourney) return

    // Deduct fare from EZ-Link balance
    updateEzlinkBalance(ezlink_balance - currentJourney.fare)

    // Calculate earnings for completing transport activity
    const earnings = Math.floor(Math.random() * 8) + 10 // $10-18 for transport teaching
    updateFamilyBudget(family_budget + earnings)

    // Track activity
    addCompletedActivity({
      id: `bus-journey-${Date.now()}`,
      type: 'transport',
      earnings,
      timestamp: new Date().toISOString(),
      participants: players.map(p => p.id),
      details: `Completed bus journey from ${currentJourney.start} - taught elderly digital transport skills`
    })

    // Add to journey history
    const newTransaction: Transaction = {
      id: `journey-${Date.now()}`,
      type: 'journey',
      amount: -currentJourney.fare,
      description: `Bus Journey to ${currentJourney.destination}`,
      location: currentJourney.start,
      datetime: new Date().toLocaleString(),
      balance_after: ezlink_balance - currentJourney.fare,
      earnings
    }
    setJourneyHistory(prev => [newTransaction, ...prev])

    setCurrentJourney(null)
    
    if (tutorialActive && tutorialStep === 'tap_out') {
      nextTutorialStep()
    }
  }

  const getTimingColor = (timing: string) => {
    if (timing.includes('Arr') || timing === 'Arriving') return 'text-green-600'
    const minutes = parseInt(timing)
    if (minutes <= 3) return 'text-orange-600'
    if (minutes <= 8) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getOperatorColor = (operator: string) => {
    switch (operator) {
      case 'SBST': return 'bg-blue-100 text-blue-800'
      case 'SMRT': return 'bg-red-100 text-red-800'
      case 'Tower Transit': return 'bg-green-100 text-green-800'
      case 'Go-Ahead': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBalanceColor = (balance: number) => {
    if (balance < 5) return 'text-red-600'
    if (balance < 15) return 'text-yellow-600'
    return 'text-green-600'
  }

  useEffect(() => {
    busStops.forEach(stop => {
      stop.is_favorite = favoriteStops.includes(stop.id)
    })
  }, [favoriteStops, busStops])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative">
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {tutorialActive && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center justify-center mb-4">
                <Bus className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{currentTutorial.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{currentTutorial.content}</p>
              
              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-6">
                {Object.keys(tutorialSteps).map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded ${
                      completedSteps.has(step as TutorialStep) || step === tutorialStep
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setTutorialActive(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold min-h-[44px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skip Tutorial
                </motion.button>
                <motion.button
                  onClick={nextTutorialStep}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold min-h-[44px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentTutorial.action}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Top-up Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your EZ-Link card has been topped up and you earned a digital skills bonus!
                </p>
                <motion.button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium min-h-[44px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Learning
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={() => navigateToGame(navigate)}
            className="flex items-center gap-2 px-4 py-3 bg-white/80 hover:bg-white rounded-xl transition-colors text-lg min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Back to Game</span>
          </motion.button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Singapore Transport</h1>
                <p className="text-gray-600">Learn public transport together!</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">EZ-Link Balance</p>
                  <p className={`text-xl font-bold ${getBalanceColor(ezlink_balance)}`}>
                    ${ezlink_balance.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Family Budget</p>
                  <p className="text-xl font-bold text-green-600">${family_budget.toFixed(2)}</p>
                </div>
                <motion.button
                  onClick={() => setTutorialActive(true)}
                  className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors min-h-[44px] min-w-[44px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HelpCircle className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Journey Status */}
        {currentJourney && (
          <motion.div
            className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 mb-6 border border-green-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 flex items-center gap-2">
                  <Bus className="w-5 h-5" />
                  Journey in Progress
                </h3>
                <p className="text-green-800">
                  From {currentJourney.start} to {currentJourney.destination}
                </p>
                <p className="text-sm text-green-700">Fare: ${currentJourney.fare.toFixed(2)}</p>
              </div>
              <motion.button
                onClick={completeTapOut}
                className={`px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold min-h-[44px] ${
                  tutorialStep === 'tap_out' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Tap Out
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('balance')
                if (tutorialActive && tutorialStep === 'check_balance') {
                  nextTutorialStep()
                }
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium text-sm min-h-[44px] ${
                activeTab === 'balance'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              } ${
                tutorialStep === 'check_balance' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Balance & Info
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('topup')
                if (tutorialActive && tutorialStep === 'top_up') {
                  nextTutorialStep()
                }
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium text-sm min-h-[44px] ${
                activeTab === 'topup'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              } ${
                tutorialStep === 'top_up' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Top Up
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('journey')
                if (tutorialActive && tutorialStep === 'plan_journey') {
                  nextTutorialStep()
                }
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium text-sm min-h-[44px] ${
                activeTab === 'journey'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              } ${
                tutorialStep === 'plan_journey' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Plan Journey
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-shrink-0 px-6 py-4 font-medium text-sm min-h-[44px] ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Journey History
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'balance' && (
              <div className="space-y-6">
                {/* EZ-Link Card Display */}
                <motion.div
                  className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">EZ-Link Card</h3>
                      <p className="text-blue-100">Adult</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-blue-200" />
                  </div>
                  <div className="mb-6">
                    <p className="text-blue-100 text-sm mb-1">Current Balance</p>
                    <p className="font-mono text-3xl font-bold">${ezlink_balance.toFixed(2)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-100">Status</p>
                      <p className="font-semibold">Active</p>
                    </div>
                    <div>
                      <p className="text-blue-100">Card Type</p>
                      <p className="font-semibold">Adult</p>
                    </div>
                  </div>
                </motion.div>

                {/* Balance Warning */}
                {ezlink_balance < 5 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 font-semibold">Low Balance Warning</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      Your EZ-Link balance is low. Top up soon to avoid inconvenience during your journey!
                    </p>
                  </div>
                )}

                {/* Transport Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What can you do with EZ-Link?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Bus className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Public Buses</span>
                      </div>
                      <p className="text-blue-800 text-sm">
                        Pay for bus rides across Singapore with automatic fare deduction
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Train className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">MRT & LRT</span>
                      </div>
                      <p className="text-green-800 text-sm">
                        Seamless travel on Singapore's rail network with distance-based pricing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'topup' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Up Amount</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                    {topUpAmounts.map((amount) => (
                      <motion.button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount)
                          setCustomAmount('')
                        }}
                        className={`p-3 rounded-lg border-2 font-semibold transition-colors min-h-[44px] ${
                          selectedAmount === amount
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ${amount}
                      </motion.button>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="1"
                        max="500"
                        step="0.01"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          setSelectedAmount(null)
                        }}
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: $1.00, Maximum: $500.00
                    </p>
                  </div>

                  <motion.button
                    onClick={handleTopUp}
                    disabled={isProcessing || (!selectedAmount && !customAmount) || (selectedAmount || parseFloat(customAmount)) > family_budget}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 min-h-[44px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-5 h-5" />
                        Top Up ${selectedAmount || customAmount || '0.00'}
                      </>
                    )}
                  </motion.button>

                  {((selectedAmount || parseFloat(customAmount)) > family_budget) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-800 text-sm font-medium">Insufficient Budget</span>
                      </div>
                      <p className="text-red-700 text-xs mt-1">
                        You need ${((selectedAmount || parseFloat(customAmount)) - family_budget).toFixed(2)} more in your family budget
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Learning Rewards
                  </h4>
                  <p className="text-green-800 text-sm mb-2">
                    Every top-up earns you bonus money for teaching digital skills!
                  </p>
                  <div className="text-green-700 text-sm">
                    • Base bonus: $5.00
                    • Digital skills bonus: 10% of top-up amount
                    • Youth teaching elderly: Extra reward points
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'journey' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className={`bg-gray-50 rounded-lg p-4 ${
                  tutorialStep === 'find_bus' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                }`}>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search bus stops or services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
                    />
                    <Bus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      onClick={refreshTimings}
                      disabled={isRefreshing}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 min-h-[44px]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh Timings
                    </motion.button>
                  </div>
                </div>

                {/* Bus Stops List */}
                <div className="grid lg:grid-cols-2 gap-4">
                  {filteredStops.map((stop) => (
                    <motion.div
                      key={stop.id}
                      className="bg-white rounded-xl border border-gray-200 p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{stop.name}</h4>
                            {favoriteStops.includes(stop.id) && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{stop.road}</p>
                          <p className="text-xs text-gray-500">Stop ID: {stop.id}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(stop.id)}
                          className="p-1 hover:bg-gray-100 rounded min-h-[44px] min-w-[44px]"
                        >
                          <Star className={`w-4 h-4 ${
                            favoriteStops.includes(stop.id) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {stop.services.map((service) => (
                          <div
                            key={service.service_no}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                                  <span className="font-bold text-gray-900">{service.service_no}</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getOperatorColor(service.operator)}`}>
                                  {service.operator}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-blue-600">${service.fare.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">fare</p>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mb-2">{service.route}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Next: </span>
                                  <span className={`font-semibold ${getTimingColor(service.next_bus)}`}>
                                    {service.next_bus}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Following: </span>
                                  <span className={`font-semibold ${getTimingColor(service.subsequent_bus)}`}>
                                    {service.subsequent_bus}
                                  </span>
                                </div>
                              </div>
                              
                              <motion.button
                                onClick={() => handleJourney(service, stop)}
                                disabled={service.fare > ezlink_balance}
                                className={`px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm rounded font-medium min-h-[44px] ${
                                  tutorialStep === 'tap_in' && !currentJourney ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span className="flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  Tap In
                                </span>
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {journeyHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Journey History</h3>
                    <p className="text-gray-600">
                      Start using public transport to see your journey history here
                    </p>
                  </div>
                ) : (
                  journeyHistory.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="p-2 rounded-lg bg-blue-50">
                        {tx.type === 'top_up' ? (
                          <Plus className="w-5 h-5 text-green-600" />
                        ) : (
                          <Bus className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{tx.description}</div>
                        <div className="text-sm text-gray-500">{tx.location} • {tx.datetime}</div>
                        {tx.earnings && (
                          <div className="text-sm text-green-600 font-medium">
                            +${tx.earnings.toFixed(2)} earned
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`font-mono text-lg font-bold ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Balance: ${tx.balance_after.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Teaching Tips Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Intergenerational Learning: Transport Skills
              </h3>
              <p className="text-purple-800 mb-3">
                This transport tutorial helps bridge the digital divide by teaching elderly family members 
                modern transport apps while learning traditional navigation wisdom from them.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Youth teaches:
                  </strong>
                  <ul className="text-purple-800 mt-1 text-xs space-y-1">
                    <li>• Digital payment systems</li>
                    <li>• Bus timing apps</li>
                    <li>• Route planning</li>
                    <li>• EZ-Link top-up methods</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <strong className="text-purple-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Elderly shares:
                  </strong>
                  <ul className="text-purple-800 mt-1 text-xs space-y-1">
                    <li>• Traditional bus routes knowledge</li>
                    <li>• Landmark-based navigation</li>
                    <li>• Budget-friendly travel tips</li>
                    <li>• Cultural transport stories</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal for Tutorial Completion */}
        <AnimatePresence>
          {tutorialStep === 'complete' && !tutorialActive && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Transport Expert! 🚌</h2>
                <p className="text-gray-600 mb-4">
                  You've mastered Singapore's public transport system! You can now navigate independently and teach others.
                </p>
                <div className="bg-yellow-100 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">Skills Unlocked</span>
                  </div>
                  <ul className="text-sm text-yellow-700 mt-2 text-left">
                    <li>• Digital transport apps</li>
                    <li>• EZ-Link card management</li>
                    <li>• Journey planning & fare calculation</li>
                    <li>• Tap in/out mechanics</li>
                    <li>• Teaching transport skills to others</li>
                  </ul>
                </div>
                <motion.button
                  onClick={() => navigateToGame(navigate)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 min-h-[44px]"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Gamepad2 className="w-5 h-5" />
                  Back to Game
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BusTimings
