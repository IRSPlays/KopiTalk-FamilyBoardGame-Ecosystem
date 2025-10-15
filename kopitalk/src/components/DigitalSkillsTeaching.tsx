import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, QrCode, CreditCard, ShoppingCart, X, CheckCircle, ArrowRight } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface DigitalSkillsTeachingProps {
  currentPlayerId: number
  onClose: () => void
}

type Lesson = {
  id: string
  title: string
  icon: React.ReactNode
  steps: string[]
  earnings: number
}

const DigitalSkillsTeaching: React.FC<DigitalSkillsTeachingProps> = ({ currentPlayerId, onClose }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const updatePlayer = useGameStore(state => state.updatePlayer)

  const lessons: Lesson[] = [
    {
      id: 'mobile-payment',
      title: 'Mobile Payment Apps',
      icon: <CreditCard className="w-6 h-6" />,
      steps: [
        'Open your banking app',
        'Select "PayNow" or "Scan QR"',
        'Point camera at merchant QR code',
        'Enter amount to pay',
        'Confirm with password/fingerprint',
        'Show payment confirmation'
      ],
      earnings: 12
    },
    {
      id: 'qr-scanning',
      title: 'QR Code Scanning',
      icon: <QrCode className="w-6 h-6" />,
      steps: [
        'Open camera app',
        'Point at QR code',
        'Tap notification that appears',
        'View menu or information',
        'Practice with SafeEntry QR'
      ],
      earnings: 10
    },
    {
      id: 'self-order',
      title: 'Self-Order Kiosks',
      icon: <ShoppingCart className="w-6 h-6" />,
      steps: [
        'Tap "Start Order" on screen',
        'Select meal category',
        'Choose items by tapping',
        'Review order in cart',
        'Select payment method',
        'Collect receipt number'
      ],
      earnings: 15
    },
    {
      id: 'app-nav',
      title: 'App Navigation Basics',
      icon: <Smartphone className="w-6 h-6" />,
      steps: [
        'Swipe to unlock phone',
        'Find app icon on home screen',
        'Tap to open app',
        'Use back button to return',
        'Swipe up to close app',
        'Check notifications'
      ],
      earnings: 10
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

    // Increase player's digital skills
    updatePlayer(currentPlayerId, {
      digital_skills: (useGameStore.getState().players.find(p => p.id === currentPlayerId)?.digital_skills || 0) + 5
    })

    setCompleted(true)
  }

  const acceptReward = () => {
    alert(`🎉 Lesson complete! Earned $${selectedLesson?.earnings}!`)
    onClose()
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
                  <h2 className="text-2xl font-bold">Digital Skills</h2>
                  <p className="text-blue-100 text-sm">Youth Teach Elderly</p>
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
                  <p className="text-sm text-blue-900">
                    👨‍🏫 <strong>Role Reversal:</strong> Youth teach elderly how to use digital services! Guide them step-by-step.
                  </p>
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <motion.button
                      key={lesson.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className="w-full bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {lesson.icon}
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">{lesson.steps.length} steps • ${lesson.earnings}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : !completed ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      setSelectedLesson(null)
                      setCurrentStep(0)
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    ←
                  </button>
                  <h3 className="font-bold text-gray-900">{selectedLesson.title}</h3>
                  <div className="text-sm text-gray-600">
                    Step {currentStep + 1}/{selectedLesson.steps.length}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {currentStep + 1}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedLesson.steps[currentStep]}</h4>
                  <div className="mt-6 flex gap-2">
                    {selectedLesson.steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-2 rounded-full ${
                          idx <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (currentStep < selectedLesson.steps.length - 1) {
                        setCurrentStep(currentStep + 1)
                      } else {
                        completeLesson()
                      }
                    }}
                    className={`${currentStep > 0 ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all`}
                  >
                    {currentStep < selectedLesson.steps.length - 1 ? 'Next Step' : 'Complete Lesson'}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h3>
                  <p className="text-green-700">Great teaching! Digital skills improved!</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">${selectedLesson.earnings}</p>
                  <p className="text-xs text-gray-600">+5 Digital Skills</p>
                </div>

                <button
                  onClick={acceptReward}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Collect Reward
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DigitalSkillsTeaching
