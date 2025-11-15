import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Camera, X, CheckCircle, XCircle, Target, Smartphone, 
  Zap, Award, TrendingUp, Clock, Sparkles
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import toast from 'react-hot-toast'

interface QRCodeScannerProps {
  currentPlayerId: number
  onClose: () => void
}

type QRType = 'payment' | 'menu' | 'safeentry' | 'wifi' | 'delivery' | 'kiosk'
type DifficultyLevel = 'easy' | 'medium' | 'hard'

interface QRChallenge {
  type: QRType
  data: string
  description: string
  icon: string
  difficulty: DifficultyLevel
  earnings: number
  timeLimit: number // seconds
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ currentPlayerId, onClose }) => {
  const [currentChallenge, setCurrentChallenge] = useState<QRChallenge | null>(null)
  const [scanMode, setScanMode] = useState<'practice' | 'timed' | 'complete'>('practice')
  const [attempts, setAttempts] = useState(0)
  const [successes, setSuccesses] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [totalEarnings, setTotalEarnings] = useState(0)
  
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const updatePlayer = useGameStore(state => state.updatePlayer)
  
  // QR Challenge templates
  const challenges: QRChallenge[] = [
    {
      type: 'payment',
      data: 'paynow://pay?mobile=98765432&amount=5.50',
      description: 'Scan PayNow QR code to pay at coffee shop',
      icon: '💳',
      difficulty: 'easy',
      earnings: 10,
      timeLimit: 30
    },
    {
      type: 'menu',
      data: 'https://menu.hawker.sg/stall/123',
      description: 'Scan menu QR at hawker center',
      icon: '🍜',
      difficulty: 'easy',
      earnings: 8,
      timeLimit: 25
    },
    {
      type: 'safeentry',
      data: 'https://temperaturepass.ndi.gov.sg/login/SAFEENTRY-123',
      description: 'SafeEntry check-in at shopping mall',
      icon: '✅',
      difficulty: 'medium',
      earnings: 12,
      timeLimit: 20
    },
    {
      type: 'wifi',
      data: 'WIFI:T:WPA;S:SingTel_WiFi;P:password123;;',
      description: 'Connect to public WiFi at community center',
      icon: '📶',
      difficulty: 'medium',
      earnings: 10,
      timeLimit: 25
    },
    {
      type: 'delivery',
      data: 'https://grab.com/order/tracking/ABC123XYZ',
      description: 'Scan delivery code to receive food order',
      icon: '📦',
      difficulty: 'hard',
      earnings: 15,
      timeLimit: 15
    },
    {
      type: 'kiosk',
      data: 'https://kiosk.mcd.sg/order/start',
      description: 'Scan to start self-order at fast food kiosk',
      icon: '🍔',
      difficulty: 'hard',
      earnings: 15,
      timeLimit: 18
    }
  ]
  
  // Timer countdown
  useEffect(() => {
    if (scanMode === 'timed' && timeRemaining > 0 && currentChallenge) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [scanMode, timeRemaining, currentChallenge])
  
  // Generate new challenge
  const generateChallenge = () => {
    const availableChallenges = scanMode === 'practice' 
      ? challenges 
      : challenges.filter(c => c.difficulty !== 'easy')
    
    const challenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)]
    
    // Randomize data to make each QR unique
    const uniqueData = `${challenge.data}?t=${Date.now()}`
    
    setCurrentChallenge({
      ...challenge,
      data: uniqueData
    })
    
    if (scanMode === 'timed') {
      setTimeRemaining(challenge.timeLimit)
    }
  }
  
  // Start practice mode
  const startPractice = () => {
    setScanMode('practice')
    setAttempts(0)
    setSuccesses(0)
    setStreak(0)
    setTotalEarnings(0)
    generateChallenge()
  }
  
  // Start timed mode
  const startTimed = () => {
    setScanMode('timed')
    setAttempts(0)
    setSuccesses(0)
    setStreak(0)
    setTotalEarnings(0)
    generateChallenge()
  }
  
  // Handle scan attempt
  const handleScan = () => {
    if (!currentChallenge) return
    
    setScanning(true)
    setAttempts(prev => prev + 1)
    
    // Simulate scanning delay
    setTimeout(() => {
      // Success rate based on difficulty and streak
      const baseSuccessRate = {
        easy: 0.90,
        medium: 0.75,
        hard: 0.60
      }[currentChallenge.difficulty]
      
      const streakBonus = Math.min(streak * 0.05, 0.20) // Max 20% bonus
      const successRate = Math.min(baseSuccessRate + streakBonus, 0.95)
      
      const success = Math.random() < successRate
      
      if (success) {
        handleSuccess()
      } else {
        handleFailure()
      }
      
      setScanning(false)
    }, 1500)
  }
  
  // Handle successful scan
  const handleSuccess = () => {
    if (!currentChallenge) return
    
    setSuccesses(prev => prev + 1)
    setStreak(prev => prev + 1)
    
    const earnings = currentChallenge.earnings
    const streakBonus = Math.floor(streak * 2)
    const totalReward = earnings + streakBonus
    
    setTotalEarnings(prev => prev + totalReward)
    
    toast.success(
      <div>
        <p className="font-bold">✅ Scan Successful!</p>
        <p className="text-sm">Earned ${totalReward} {streakBonus > 0 && `(+$${streakBonus} streak bonus!)`}</p>
      </div>,
      { duration: 3000 }
    )
    
    // Generate next challenge
    setTimeout(() => {
      if (scanMode === 'timed') {
        generateChallenge()
      } else {
        // In practice mode, let user decide
        setCurrentChallenge(null)
      }
    }, 2000)
  }
  
  // Handle failed scan
  const handleFailure = () => {
    setStreak(0)
    
    toast.error(
      <div>
        <p className="font-bold">❌ Scan Failed</p>
        <p className="text-sm">Hold steady and try again!</p>
      </div>,
      { duration: 2000 }
    )
  }
  
  // Handle timeout
  const handleTimeout = () => {
    toast.error('⏰ Time\'s up! Moving to next challenge...', { duration: 2000 })
    setTimeout(generateChallenge, 1500)
  }
  
  // Complete session
  const completeSession = () => {
    if (successes === 0) {
      toast('Complete at least one scan to earn rewards!', { icon: '💡' })
      return
    }
    
    // Award earnings
    updateFamilyBudget(totalEarnings)
    
    // Update player digital skills
    updatePlayer(currentPlayerId, {
      digital_skills: Math.min((currentChallenge?.difficulty === 'hard' ? 15 : 10), 100)
    })
    
    // Record activity
    addCompletedActivity({
      id: `qr-scanner-${Date.now()}`,
      type: 'digital_skills',
      timestamp: new Date().toISOString(),
      earnings: totalEarnings,
      participants: [currentPlayerId],
      details: {
        mode: scanMode,
        attempts,
        successes,
        successRate: ((successes / attempts) * 100).toFixed(1),
        maxStreak: streak
      }
    })
    
    setScanMode('complete')
    
    toast.success(
      <div>
        <p className="font-bold">🎉 Session Complete!</p>
        <p className="text-sm">Total earned: ${totalEarnings}</p>
      </div>,
      { duration: 4000 }
    )
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white sticky top-0 z-10 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">QR Code Scanner</h2>
                  <p className="text-blue-100 text-sm">Master digital payments & check-ins</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Stats Bar */}
            {(scanMode === 'practice' || scanMode === 'timed') && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-100">Attempts</p>
                  <p className="text-xl font-bold">{attempts}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-100">Success</p>
                  <p className="text-xl font-bold text-green-300">{successes}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-100">Streak</p>
                  <p className="text-xl font-bold text-yellow-300">{streak}🔥</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-100">Earned</p>
                  <p className="text-xl font-bold text-green-300">${totalEarnings}</p>
                </div>
              </div>
            )}
            
            {/* Timer (Timed Mode) */}
            {scanMode === 'timed' && timeRemaining > 0 && (
              <motion.div 
                className={`mt-3 p-3 rounded-lg text-center ${
                  timeRemaining <= 5 
                    ? 'bg-red-500/30 border-2 border-red-300' 
                    : 'bg-white/10'
                }`}
                animate={timeRemaining <= 5 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Clock className={`w-5 h-5 inline mr-2 ${timeRemaining <= 5 ? 'animate-pulse' : ''}`} />
                <span className="text-2xl font-bold">{timeRemaining}s</span>
              </motion.div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Mode Selection */}
            {!currentChallenge && scanMode !== 'complete' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Practice Mode</h3>
                  <p className="text-gray-600">Learn to scan QR codes like the young generation!</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startPractice}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="text-xl font-bold mb-1">Practice Mode</h4>
                      <p className="text-sm text-green-100">No time limit • Learn at your own pace</p>
                    </div>
                    <Sparkles className="w-8 h-8" />
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startTimed}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="text-xl font-bold mb-1">Timed Challenge</h4>
                      <p className="text-sm text-orange-100">Beat the clock • Higher rewards</p>
                    </div>
                    <Zap className="w-8 h-8" />
                  </div>
                </motion.button>
                
                {/* Tips */}
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Tips for Scanning QR Codes:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1 ml-6">
                    <li>• Hold your phone steady and centered over the QR code</li>
                    <li>• Make sure there's enough light</li>
                    <li>• Keep the camera at the right distance (not too close!)</li>
                    <li>• Wait for the green frame to appear</li>
                    <li>• Ask a youth family member if you need help! 👨‍👩‍👧</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Active Challenge */}
            {currentChallenge && scanMode !== 'complete' && (
              <div className="space-y-6">
                {/* Challenge Description */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{currentChallenge.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{currentChallenge.description}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          currentChallenge.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
                          currentChallenge.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {currentChallenge.difficulty.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-600">
                          Reward: ${currentChallenge.earnings}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* QR Code Display */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={scanning ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3, repeat: scanning ? Infinity : 0 }}
                      className={`p-4 bg-white rounded-xl border-4 ${
                        scanning ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <QRCodeSVG 
                        value={currentChallenge.data}
                        size={220}
                        level="H"
                        includeMargin
                        fgColor="#1f2937"
                        bgColor="#ffffff"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Scan Status */}
                  {scanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-blue-600 font-semibold"
                    >
                      <Camera className="w-6 h-6 inline animate-pulse mr-2" />
                      Scanning...
                    </motion.div>
                  )}
                </div>
                
                {/* Scan Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scanning ? (
                    <>Scanning...</>
                  ) : (
                    <>
                      <Camera className="w-6 h-6 inline mr-2" />
                      Scan QR Code
                    </>
                  )}
                </motion.button>
                
                {scanMode === 'practice' && (
                  <button
                    onClick={generateChallenge}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    Try Different QR Code
                  </button>
                )}
                
                {successes >= 3 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={completeSession}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                  >
                    <Award className="w-6 h-6 inline mr-2" />
                    Complete Session & Collect Rewards
                  </motion.button>
                )}
              </div>
            )}
            
            {/* Completion Screen */}
            {scanMode === 'complete' && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                >
                  <Award className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-gray-900">Excellent Work!</h3>
                <p className="text-gray-600">You've mastered QR code scanning!</p>
                
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-3xl font-bold text-green-700">
                        {attempts > 0 ? Math.round((successes / attempts) * 100) : 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Earned</p>
                      <p className="text-3xl font-bold text-green-700">${totalEarnings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-900">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    <strong>Keep practicing!</strong> The more you scan, the easier it becomes. 
                    Soon you'll be as fast as the young generation!
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setScanMode('practice')
                      setCurrentChallenge(null)
                      setAttempts(0)
                      setSuccesses(0)
                      setStreak(0)
                      setTotalEarnings(0)
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
                  >
                    Practice Again
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QRCodeScanner
