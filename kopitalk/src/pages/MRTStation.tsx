import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Train, CreditCard, MapPin, Clock, Zap, DollarSign, Navigation } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface MRTStationProps {
  currentPlayerId: number
  onClose: () => void
  onTravelComplete?: (destination: { x: number; y: number }) => void
}

const MRTStation: React.FC<MRTStationProps> = ({ currentPlayerId, onClose, onTravelComplete }) => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState(10)

  const player = useGameStore(state => state.players.find(p => p.id === currentPlayerId))
  const familyBudget = useGameStore(state => state.family_budget)
  const topUpEzLink = useGameStore(state => state.topUpEzLink)
  const useEzLink = useGameStore(state => state.useEzLink)
  const updatePlayerPosition = useGameStore(state => state.updatePlayerPosition)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const customBoard = useGameStore(state => state.customBoard)

  if (!player) return null

  // MRT stations on the board (find all mrt tiles)
  const mrtStations = customBoard?.tiles.filter(t => t.type === 'mrt') || []

  const handleTopUp = () => {
    if (topUpEzLink(currentPlayerId, topUpAmount)) {
      alert(`✅ Topped up $${topUpAmount} to EZ-Link!`)
      setShowTopUp(false)
    } else {
      alert(`❌ Insufficient family budget! Need $${topUpAmount}, have $${familyBudget}`)
    }
  }

  const handleTravel = (stationId: string) => {
    const fare = 1.50
    const station = mrtStations.find(s => s.id === stationId)
    
    if (!station) return

    if (useEzLink(currentPlayerId, fare)) {
      // Update player position
      updatePlayerPosition(currentPlayerId, station.position)
      
      // Record activity
      addCompletedActivity({
        id: `mrt-${Date.now()}`,
        type: 'transport',
        timestamp: new Date().toISOString(),
        earnings: 0, // MRT travel costs money, doesn't earn
        participants: [currentPlayerId],
        details: {
          from: player.position,
          to: station.position,
          fare: fare
        }
      })

      alert(`🚇 Traveled to ${station.properties?.name || 'MRT Station'}! Fare: $${fare}`)
      
      if (onTravelComplete) {
        onTravelComplete(station.position)
      }
      
      onClose()
    } else {
      alert(`❌ Insufficient EZ-Link balance! Need $${fare}, have $${player.ezlink_balance.toFixed(2)}`)
      setShowTopUp(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="mb-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Train className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">MRT Station</h2>
              <p className="text-red-100">Fast Travel Around Singapore</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* EZ-Link Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                <span className="font-semibold">EZ-Link Card</span>
              </div>
              <Zap className="w-5 h-5 text-yellow-300" />
            </div>
            <div className="text-4xl font-bold mb-2">
              ${player.ezlink_balance.toFixed(2)}
            </div>
            <div className="flex items-center gap-4 text-sm text-purple-100">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>Family Budget: ${familyBudget}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTopUp(!showTopUp)}
              className="mt-4 w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl font-semibold transition"
            >
              Top Up EZ-Link
            </motion.button>
          </motion.div>

          {/* Top Up Panel */}
          <AnimatePresence>
            {showTopUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
              >
                <h4 className="font-bold text-gray-900 mb-3">Top Up Amount</h4>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[5, 10, 20, 50].map(amount => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTopUpAmount(amount)}
                      className={`py-3 rounded-lg font-semibold transition ${
                        topUpAmount === amount
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTopUp}
                  disabled={familyBudget < topUpAmount}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {familyBudget >= topUpAmount 
                    ? `Confirm Top Up $${topUpAmount}`
                    : `Insufficient Budget (need $${topUpAmount})`
                  }
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Travel Information */}
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Fast Travel Benefits:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Instant travel to any MRT station</li>
                  <li>Only $1.50 per trip</li>
                  <li>Experience digital payment (learn for elderly!)</li>
                  <li>Navigate Singapore efficiently</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Station Selection */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Available MRT Stations ({mrtStations.length})
            </h3>

            {mrtStations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Train className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No MRT stations on your custom board</p>
                <p className="text-sm mt-1">Add MRT tiles when building your board!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {mrtStations.map((station) => {
                  const isCurrentLocation = 
                    station.position.x === player.position.x && 
                    station.position.y === player.position.y

                  return (
                    <motion.button
                      key={station.id}
                      whileHover={!isCurrentLocation ? { scale: 1.02, x: 5 } : {}}
                      whileTap={!isCurrentLocation ? { scale: 0.98 } : {}}
                      onClick={() => !isCurrentLocation && handleTravel(station.id)}
                      disabled={isCurrentLocation}
                      className={`w-full rounded-xl p-4 text-left transition ${
                        isCurrentLocation
                          ? 'bg-green-50 border-2 border-green-300 cursor-not-allowed'
                          : 'bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCurrentLocation ? 'bg-green-200' : 'bg-red-100'
                          }`}>
                            {isCurrentLocation ? (
                              <Navigation className="w-5 h-5 text-green-700" />
                            ) : (
                              <Train className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {station.properties?.name || `MRT Station ${station.id}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Position: ({station.position.x}, {station.position.y})
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isCurrentLocation ? (
                            <span className="text-sm font-semibold text-green-700">
                              Current Location
                            </span>
                          ) : (
                            <span className="text-lg font-bold text-red-600">
                              $1.50
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Digital Skills Tip */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">👵👴</div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">💡 Teach Elderly:</p>
                <p>Show them how to use EZ-Link cards, tap payment, and navigate MRT stations. This is great for learning digital payment systems!</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MRTStation
