import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Train, MapPin, CreditCard, DollarSign, ArrowRight, Clock, 
  TrendingUp, Zap, X, CheckCircle, AlertCircle 
} from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface MRTStationProps {
  currentPlayerId: number
  onClose: () => void
  onTravelComplete: (destination: { x: number; y: number }) => void
}

interface MRTLine {
  name: string
  color: string
  stations: string[]
}

const MRTStation: React.FC<MRTStationProps> = ({
  currentPlayerId,
  onClose,
  onTravelComplete
}) => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState(10)
  
  const player = useGameStore(state => state.players.find(p => p.id === currentPlayerId))
  const family_budget = useGameStore(state => state.family_budget)
  const topUpEzLink = useGameStore(state => state.topUpEzLink)
  const useEzLink = useGameStore(state => state.useEzLink)
  const customBoard = useGameStore(state => state.customBoard)
  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  const mrtLines: MRTLine[] = [
    {
      name: 'North-South Line',
      color: 'bg-red-500',
      stations: ['Jurong East', 'Bishan', 'Ang Mo Kio', 'Yishun', 'Woodlands']
    },
    {
      name: 'East-West Line',
      color: 'bg-green-500',
      stations: ['Pasir Ris', 'Tampines', 'Bedok', 'Paya Lebar', 'City Hall', 'Jurong East']
    },
    {
      name: 'Circle Line',
      color: 'bg-yellow-500',
      stations: ['HarbourFront', 'Chinatown', 'Dhoby Ghaut', 'Serangoon', 'Bishan']
    },
    {
      name: 'Downtown Line',
      color: 'bg-blue-500',
      stations: ['Bukit Panjang', 'Sixth Avenue', 'Botanic Gardens', 'Downtown', 'Chinatown']
    }
  ]

  // Find MRT tiles on the custom board
  const mrtTiles = customBoard?.tiles.filter(tile => tile.type === 'mrt') || []
  
  const baseFare = 1.50
  const estimatedTime = 15 // minutes

  const handleTopUp = () => {
    if (topUpEzLink(currentPlayerId, topUpAmount)) {
      alert(`Successfully topped up $${topUpAmount} to EZ-Link!`)
      setShowTopUp(false)
    } else {
      alert(`Insufficient family budget! Need $${topUpAmount}, have $${family_budget}`)
    }
  }

  const handleTravel = () => {
    if (!selectedStation || !player) return

    if (useEzLink(currentPlayerId, baseFare)) {
      // Random MRT tile selection (in real game, would map to station name)
      const targetTile = mrtTiles[Math.floor(Math.random() * mrtTiles.length)]
      
      if (targetTile) {
        onTravelComplete(targetTile.position)
        
        // Add activity record
        addCompletedActivity({
          id: `mrt-${Date.now()}`,
          type: 'transport',
          timestamp: new Date().toISOString(),
          earnings: 0, // No earnings for MRT travel itself
          participants: [currentPlayerId],
          details: {
            station: selectedStation,
            fare: baseFare
          }
        })

        alert(`✅ Traveled to ${selectedStation}! EZ-Link deducted $${baseFare.toFixed(2)}`)
        onClose()
      } else {
        alert('No MRT destination found on this board!')
      }
    } else {
      alert(`Insufficient EZ-Link balance! Need $${baseFare.toFixed(2)}, have $${player.ezlink_balance.toFixed(2)}`)
      setShowTopUp(true)
    }
  }

  if (!player) return null

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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">MRT Station</h2>
                  <p className="text-blue-100 text-sm">Singapore Mass Rapid Transit</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Player Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <p className="text-xs text-blue-100">EZ-Link Balance</p>
                </div>
                <p className="text-2xl font-bold">${player.ezlink_balance.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <p className="text-xs text-blue-100">Family Budget</p>
                </div>
                <p className="text-2xl font-bold">${useGameStore.getState().family_budget.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {showTopUp ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Top Up EZ-Link</h3>
                  <button
                    onClick={() => setShowTopUp(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Top up from Family Budget</p>
                      <p className="text-sm text-blue-700">
                        Family Budget: ${family_budget.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Select Amount</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[5, 10, 20, 50].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setTopUpAmount(amount)}
                        className={`py-3 rounded-xl font-semibold transition-all ${
                          topUpAmount === amount
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleTopUp}
                  disabled={family_budget < topUpAmount}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Top Up ${topUpAmount}
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTopUp(true)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Top Up EZ-Link
                  </button>
                </div>

                {/* Fare Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base Fare</span>
                    <span className="font-bold text-gray-900">${baseFare.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Time</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {estimatedTime} min
                    </span>
                  </div>
                </div>

                {/* MRT Lines */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Select Destination
                  </h3>

                  {mrtLines.map((line, lineIdx) => (
                    <div key={lineIdx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-1 h-6 ${line.color} rounded-full`} />
                        <h4 className="font-semibold text-gray-800 text-sm">{line.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-4">
                        {line.stations.map((station, stationIdx) => (
                          <button
                            key={stationIdx}
                            onClick={() => setSelectedStation(station)}
                            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              selectedStation === station
                                ? `${line.color} text-white shadow-lg`
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {station}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Travel Button */}
                <button
                  onClick={handleTravel}
                  disabled={!selectedStation || player.ezlink_balance < baseFare}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Travel to {selectedStation || 'Station'}
                  {selectedStation && ` (${baseFare.toFixed(2)})`}
                </button>

                {player.ezlink_balance < baseFare && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700">
                      Insufficient EZ-Link balance. Please top up first.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MRTStation
