import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, CheckCircle, X, Clock } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface TransportNavigationProps {
  currentPlayerId: number
  onClose: () => void
}

type Challenge = {
  id: string
  from: string
  to: string
  correctRoute: string[]
  accessibilityNotes: string[]
  estimatedTime: number
}

const TransportNavigation: React.FC<TransportNavigationProps> = ({ currentPlayerId, onClose }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [selectedStops, setSelectedStops] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  const challenges: Challenge[] = [
    {
      id: 'c1',
      from: 'Jurong East',
      to: 'Raffles Place',
      correctRoute: ['Jurong East (NS/EW)', 'Transfer at Outram Park', 'Raffles Place (NS/EW)'],
      accessibilityNotes: ['Elevator at Jurong East Exit A', 'Wide gates at Outram Park', 'Ramp access at Raffles Place'],
      estimatedTime: 35
    },
    {
      id: 'c2',
      from: 'Woodlands',
      to: 'Chinatown',
      correctRoute: ['Woodlands (NS)', 'Direct to City Hall', 'Transfer to NE Line', 'Chinatown (NE)'],
      accessibilityNotes: ['Elevator at Woodlands checkpoint', 'Barrier-free City Hall', 'Escalator + lift at Chinatown'],
      estimatedTime: 40
    },
    {
      id: 'c3',
      from: 'Changi Airport',
      to: 'Orchard',
      correctRoute: ['Changi Airport (CG)', 'Transfer at Tanah Merah', 'EW Line to City Hall', 'Transfer to NS Line', 'Orchard (NS)'],
      accessibilityNotes: ['Airport accessible design', 'Travelators at Tanah Merah', 'Multiple elevators at Orchard'],
      estimatedTime: 50
    }
  ]

  const completeNavigation = () => {
    if (!selectedChallenge) return

    const correct = JSON.stringify(selectedStops) === JSON.stringify(selectedChallenge.correctRoute)
    setIsCorrect(correct)

    const earnings = correct ? 18 : 10

    addCompletedActivity({
      id: `transport-${Date.now()}`,
      type: 'transport_navigation',
      timestamp: new Date().toISOString(),
      earnings,
      participants: [currentPlayerId],
      details: {
        from: selectedChallenge.from,
        to: selectedChallenge.to,
        correct
      }
    })

    setCompleted(true)
  }

  const acceptReward = () => {
    const earnings = isCorrect ? 18 : 10
    alert(`🎉 Navigation challenge complete! Earned $${earnings}!`)
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
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Transport Navigation</h2>
                  <p className="text-green-100 text-sm">Plan Routes Together</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!selectedChallenge ? (
              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-green-900">
                    🚇 <strong>Route Planning:</strong> Work together to find the best route. Discuss accessibility features!
                  </p>
                </div>

                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <motion.button
                      key={challenge.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedChallenge(challenge)}
                      className="w-full bg-white border-2 border-gray-200 hover:border-green-300 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900">{challenge.from} → {challenge.to}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>~{challenge.estimatedTime} mins</span>
                          </div>
                        </div>
                        <MapPin className="w-5 h-5 text-gray-400" />
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
                      setSelectedChallenge(null)
                      setSelectedStops([])
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    ←
                  </button>
                  <h3 className="font-bold text-gray-900">Plan Your Route</h3>
                  <div className="text-sm text-gray-600">
                    {selectedStops.length} stops
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">From</p>
                      <p className="text-xl font-bold text-gray-900">{selectedChallenge.from}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      →
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">To</p>
                      <p className="text-xl font-bold text-gray-900">{selectedChallenge.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Clock className="w-4 h-4" />
                    <span>Estimated: {selectedChallenge.estimatedTime} minutes</span>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 mb-2">♿ Accessibility Features</h4>
                  <ul className="space-y-1">
                    {selectedChallenge.accessibilityNotes.map((note, idx) => (
                      <li key={idx} className="text-sm text-blue-700">• {note}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-900">
                    💡 <strong>Tip:</strong> Discuss the route together! Consider transfers, accessibility, and travel time.
                  </p>
                </div>

                <button
                  onClick={completeNavigation}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Complete Planning
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className={`border-2 rounded-2xl p-6 text-center ${
                  isCorrect ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                }`}>
                  <CheckCircle className={`w-16 h-16 mx-auto mb-3 ${isCorrect ? 'text-green-500' : 'text-yellow-500'}`} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isCorrect ? 'Perfect Route!' : 'Route Completed!'}
                  </h3>
                  <p className={isCorrect ? 'text-green-700' : 'text-yellow-700'}>
                    {isCorrect ? 'Great navigation skills!' : 'Good effort! Keep practicing!'}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">${isCorrect ? 18 : 10}</p>
                  <p className="text-xs text-gray-600">{isCorrect ? 'Perfect bonus!' : 'Participation reward'}</p>
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

export default TransportNavigation
