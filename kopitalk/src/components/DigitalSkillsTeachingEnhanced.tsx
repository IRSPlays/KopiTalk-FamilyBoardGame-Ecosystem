import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, QrCode, CreditCard, ShoppingCart, X, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import QRCodeScanner from './QRCodeScanner'
import toast from 'react-hot-toast'

interface DigitalSkillsTeachingEnhancedProps {
  currentPlayerId: number
  onClose: () => void
}

type Lesson = {
  id: string
  title: string
  icon: React.ReactNode
  type: 'simulation' | 'qr-scanner' | 'kiosk' | 'quiz'
  earnings: number
}

// Mobile Payment Simulation Component
const MobilePaymentSimulation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const steps = [
    { title: 'Open PayNow', description: 'Tap the PayNow icon in your banking app' },
    { title: 'Scan QR Code', description: 'Point your camera at the merchant QR code' },
    { title: 'Enter Amount', description: 'Type the payment amount' },
    { title: 'Enter PIN', description: 'Enter your 6-digit PIN' },
    { title: 'Confirm Payment', description: 'Review and confirm the transaction' }
  ]

  const handleNextStep = () => {
    if (step === 2 && (!amount || parseFloat(amount) <= 0)) {
      toast.error('Please enter a valid amount')
      return
    }
    if (step === 3 && pin.length !== 6) {
      toast.error('PIN must be 6 digits')
      return
    }
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setShowSuccess(true)
      setTimeout(() => {
        toast.success('Payment successful!')
        onComplete()
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((s, idx) => (
          <div key={idx} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              idx <= step ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-8 h-1 ${idx < step ? 'bg-blue-500' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{steps[step].title}</h3>
        <p className="text-gray-600 mb-4">{steps[step].description}</p>

        {/* Step-specific UI */}
        {step === 0 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl mx-auto flex items-center justify-center text-white"
          >
            <CreditCard className="w-16 h-16" />
          </motion.div>
        )}

        {step === 1 && (
          <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center">
            <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border-4 border-dashed border-blue-500">
              <QrCode className="w-24 h-24 text-gray-400" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Payment Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-3 gap-2">
              {['10', '20', '50'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold text-blue-900"
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Security PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              placeholder="••••••"
              className="w-full px-4 py-3 text-2xl font-bold text-center tracking-widest border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 text-center">Enter any 6-digit PIN for this simulation</p>
          </div>
        )}

        {step === 4 && !showSuccess && (
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Amount:</span>
              <span className="font-bold text-gray-900">${amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Merchant:</span>
              <span className="font-bold text-gray-900">Hawker Center Stall #12</span>
            </div>
            <div className="border-t-2 border-blue-200 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-blue-600 text-xl">${amount}</span>
            </div>
          </div>
        )}

        {showSuccess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Transaction completed</p>
          </motion.div>
        )}
      </div>

      {/* Action Button */}
      {!showSuccess && (
        <button
          onClick={handleNextStep}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
        >
          {step < steps.length - 1 ? 'Next Step' : 'Confirm Payment'}
        </button>
      )}
    </div>
  )
}

// Self-Order Kiosk Simulation Component
const SelfOrderKioskSimulation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'menu' | 'cart' | 'payment' | 'complete'>('menu')
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; qty: number }>>([])

  const menuItems = [
    { id: '1', name: 'Chicken Rice', price: 4.50, category: 'Mains' },
    { id: '2', name: 'Laksa', price: 5.50, category: 'Mains' },
    { id: '3', name: 'Iced Milo', price: 2.00, category: 'Drinks' },
    { id: '4', name: 'Kaya Toast', price: 2.50, category: 'Sides' }
  ]

  const addToCart = (item: typeof menuItems[0]) => {
    const existing = cart.find(c => c.id === item.id)
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
    toast.success(`Added ${item.name} to cart`)
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const completeOrder = () => {
    setStep('complete')
    setTimeout(() => {
      toast.success('Order placed successfully!')
      onComplete()
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {/* Kiosk Screen Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-t-xl p-4 text-white">
        <h2 className="text-2xl font-bold">Self-Order Kiosk</h2>
        <p className="text-sm opacity-90">Select items by tapping</p>
      </div>

      {step === 'menu' && (
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map(item => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(item)}
                className="bg-white border-2 border-gray-300 hover:border-orange-500 rounded-xl p-4 text-left transition-colors"
              >
                <h4 className="font-bold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">${item.price.toFixed(2)}</p>
              </motion.button>
            ))}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-2">Your Cart ({cart.length} items)</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span>{item.name} x{item.qty}</span>
                  <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t-2 border-orange-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep('cart')}
            disabled={cart.length === 0}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors"
          >
            Review Order
          </button>
        </div>
      )}

      {step === 'cart' && (
        <div className="space-y-4 p-4">
          <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white rounded-lg p-3 border-2 border-gray-200">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                </div>
                <p className="font-bold text-orange-600">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-100 rounded-xl p-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('menu')}
              className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-xl"
            >
              Back
            </button>
            <button
              onClick={() => setStep('payment')}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-4 p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={completeOrder}
              className="w-full p-4 bg-white border-2 border-blue-300 hover:border-blue-500 rounded-xl text-left"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600">Tap or insert card</p>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={completeOrder}
              className="w-full p-4 bg-white border-2 border-green-300 hover:border-green-500 rounded-xl text-left"
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">PayNow / QR Payment</p>
                  <p className="text-sm text-gray-600">Scan to pay</p>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={completeOrder}
              className="w-full p-4 bg-white border-2 border-purple-300 hover:border-purple-500 rounded-xl text-left"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-bold text-gray-900">Contactless Payment</p>
                  <p className="text-sm text-gray-600">Apple Pay / Google Pay</p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center justify-center py-12 px-4"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Order Successful!</h3>
          <p className="text-gray-600 mb-4">Order Number: #A{Math.floor(Math.random() * 1000)}</p>
          <div className="text-6xl font-bold text-orange-600 mb-2">A{Math.floor(Math.random() * 100)}</div>
          <p className="text-gray-600">Please collect at the counter</p>
        </motion.div>
      )}
    </div>
  )
}

// App Navigation Quiz Component
const AppNavigationQuiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: 'How do you unlock your smartphone?',
      options: ['Shake the phone', 'Swipe up or press power button', 'Say "Open"', 'Tap the screen 3 times'],
      correct: 1
    },
    {
      question: 'Where can you find installed apps?',
      options: ['In the calculator', 'On the home screen or app drawer', 'In the camera', 'In settings only'],
      correct: 1
    },
    {
      question: 'How do you return to the previous screen?',
      options: ['Press the home button', 'Turn off the phone', 'Use the back button/gesture', 'Close all apps'],
      correct: 2
    },
    {
      question: 'How do you close an app completely?',
      options: ['Swipe up from bottom and swipe app away', 'Press power button', 'Tap home button', 'Just leave it running'],
      correct: 0
    },
    {
      question: 'Where do you check notifications?',
      options: ['In the camera app', 'Swipe down from top of screen', 'In the gallery', 'In the calculator'],
      correct: 1
    }
  ]

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
      toast.success('Correct! ✓')
    } else {
      toast.error('Incorrect. Try again!')
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
        setTimeout(() => {
          onComplete()
        }, 3000)
      }
    }, 1500)
  }

  if (showResult) {
    const percentage = (score / questions.length) * 100
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
          percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <span className="text-4xl font-bold">{score}/{questions.length}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
        <p className="text-gray-600 mb-4">You scored {percentage}%</p>
        <p className="text-gray-700">
          {percentage >= 80 ? '🎉 Excellent! You know your way around apps!' :
           percentage >= 60 ? '👍 Good job! Keep practicing!' :
           '💪 Keep learning! Practice makes perfect!'}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
        <span className="text-sm font-semibold text-blue-600">Score: {score}</span>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{questions[currentQuestion].question}</h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(idx)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 text-left rounded-xl border-2 font-semibold transition-all ${
              selectedAnswer === null
                ? 'bg-white border-gray-300 hover:border-indigo-500'
                : selectedAnswer === idx
                ? idx === questions[currentQuestion].correct
                  ? 'bg-green-100 border-green-500 text-green-900'
                  : 'bg-red-100 border-red-500 text-red-900'
                : idx === questions[currentQuestion].correct
                ? 'bg-green-100 border-green-500 text-green-900'
                : 'bg-gray-100 border-gray-300 text-gray-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedAnswer === idx
                  ? idx === questions[currentQuestion].correct
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span>{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Main Component
const DigitalSkillsTeachingEnhanced: React.FC<DigitalSkillsTeachingEnhancedProps> = ({ currentPlayerId, onClose }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [completed, setCompleted] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const updatePlayer = useGameStore(state => state.updatePlayer)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)

  const lessons: Lesson[] = [
    {
      id: 'mobile-payment',
      title: 'Mobile Payment Simulation',
      icon: <CreditCard className="w-6 h-6" />,
      type: 'simulation',
      earnings: 15
    },
    {
      id: 'qr-scanning',
      title: 'QR Code Scanning Practice',
      icon: <QrCode className="w-6 h-6" />,
      type: 'qr-scanner',
      earnings: 12
    },
    {
      id: 'self-order',
      title: 'Self-Order Kiosk',
      icon: <ShoppingCart className="w-6 h-6" />,
      type: 'kiosk',
      earnings: 18
    },
    {
      id: 'app-nav',
      title: 'App Navigation Quiz',
      icon: <Smartphone className="w-6 h-6" />,
      type: 'quiz',
      earnings: 12
    }
  ]

  const completeLesson = () => {
    if (!selectedLesson) return

    addCompletedActivity({
      id: `digital-skills-${Date.now()}`,
      type: 'digital_skills',
      timestamp: new Date().toISOString(),
      earnings: selectedLesson.earnings,
      participants: [currentPlayerId],
      details: {
        lessonId: selectedLesson.id,
        lessonTitle: selectedLesson.title
      }
    })

    updatePlayer(currentPlayerId, {
      digital_skills: (useGameStore.getState().players.find(p => p.id === currentPlayerId)?.digital_skills || 0) + 10
    })

    updateFamilyBudget(selectedLesson.earnings)
    toast.success(`Earned $${selectedLesson.earnings}! Digital skills +10`)
    
    setCompleted(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (showQRScanner) {
    return <QRCodeScanner currentPlayerId={currentPlayerId} onClose={() => setShowQRScanner(false)} />
  }

  return (
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
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Digital Skills Training</h2>
                  <p className="text-blue-100 text-sm">Interactive Hands-On Practice</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!selectedLesson ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-blue-900 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Interactive Training:</strong> Youth guide elderly through real simulations! Complete actual tasks, not just read instructions.
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <motion.button
                      key={lesson.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (lesson.type === 'qr-scanner') {
                          setShowQRScanner(true)
                        } else {
                          setSelectedLesson(lesson)
                        }
                      }}
                      className="w-full bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {lesson.icon}
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">
                              {lesson.type === 'simulation' && '🎮 Interactive Simulation'}
                              {lesson.type === 'qr-scanner' && '📸 Real QR Practice'}
                              {lesson.type === 'kiosk' && '🖥️ Virtual Kiosk'}
                              {lesson.type === 'quiz' && '❓ Knowledge Test'}
                              {' • '}${lesson.earnings}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {selectedLesson.type === 'simulation' && (
                  <MobilePaymentSimulation onComplete={completeLesson} />
                )}
                {selectedLesson.type === 'kiosk' && (
                  <SelfOrderKioskSimulation onComplete={completeLesson} />
                )}
                {selectedLesson.type === 'quiz' && (
                  <AppNavigationQuiz onComplete={completeLesson} />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DigitalSkillsTeachingEnhanced
