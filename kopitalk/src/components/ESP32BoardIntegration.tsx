import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { GameSession } from '../types'
import { 
  Camera, Wifi, Activity, AlertCircle, CheckCircle, 
  Settings, Zap, Target, MapPin, Users, Clock,
  Brain, Eye, Scan, Shield, Play, Pause, RotateCcw,
  Monitor, Smartphone, Tablet, WifiOff, Battery,
  RefreshCcw, Download, Upload, Signal, BellRing
} from 'lucide-react'
import { 
  containerVariants, 
  itemVariants, 
  fadeInUp, 
  scaleIn, 
  fadeInLeft, 
  fadeInRight 
} from '../utils/animations'

interface ESP32Status {
  isConnected: boolean
  signalStrength: number
  batteryLevel: number
  lastUpdate: string
  ipAddress?: string
}

interface BoardDetection {
  id: string
  timestamp: string
  confidence: number
  detectedObjects: DetectedObject[]
  boardState: {
    playerPositions: { [playerName: string]: number }
    diceVisible: boolean
    diceValue?: number
    gamePhase: 'setup' | 'playing' | 'paused' | 'complete'
  }
  environmentalFactors: {
    lighting: 'poor' | 'adequate' | 'good' | 'excellent'
    angle: 'poor' | 'adequate' | 'good' | 'optimal'
    clarity: number // 0-100
  }
}

interface DetectedObject {
  type: 'dice' | 'player_piece' | 'board' | 'card' | 'hand' | 'unknown'
  confidence: number
  position: { x: number, y: number, width: number, height: number }
  attributes?: {
    color?: string
    value?: number
    player?: string
  }
}

interface Props {
  gameSession: GameSession
  onBoardStateUpdate: (newState: any) => void
  onDetectionEvent: (event: BoardDetection) => void
}

const ESP32BoardIntegration: React.FC<Props> = ({ 
  gameSession, 
  onBoardStateUpdate, 
  onDetectionEvent 
}) => {
  const [esp32Status, setEsp32Status] = useState<ESP32Status>({
    isConnected: false,
    signalStrength: 0,
    batteryLevel: 100,
    lastUpdate: new Date().toISOString()
  })
  const [isDetecting, setIsDetecting] = useState(false)
  const [latestDetection, setLatestDetection] = useState<BoardDetection | null>(null)
  const [calibrationMode, setCalibrationMode] = useState(false)
  const [detectionHistory, setDetectionHistory] = useState<BoardDetection[]>([])
  const [settings, setSettings] = useState({
    detectionInterval: 5, // seconds
    confidenceThreshold: 0.75,
    autoSyncEnabled: true,
    notificationsEnabled: true
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate ESP32-CAM connection and detection
  useEffect(() => {
    simulateESP32Connection()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isDetecting && esp32Status.isConnected) {
      interval = setInterval(() => {
        performBoardDetection()
      }, settings.detectionInterval * 1000)
    }
    return () => clearInterval(interval)
  }, [isDetecting, esp32Status.isConnected, settings.detectionInterval])

  const simulateESP32Connection = () => {
    // Simulate connecting to ESP32-CAM
    setTimeout(() => {
      setEsp32Status({
        isConnected: true,
        signalStrength: 85,
        batteryLevel: 92,
        lastUpdate: new Date().toISOString(),
        ipAddress: '192.168.1.100'
      })
    }, 2000)

    // Simulate periodic status updates
    setInterval(() => {
      setEsp32Status(prev => ({
        ...prev,
        signalStrength: Math.max(60, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 10)),
        batteryLevel: Math.max(20, prev.batteryLevel - 0.1),
        lastUpdate: new Date().toISOString()
      }))
    }, 10000)
  }

  const performBoardDetection = () => {
    // Simulate AI-powered board state detection
    const mockDetection: BoardDetection = {
      id: `detection_${Date.now()}`,
      timestamp: new Date().toISOString(),
      confidence: 0.78 + Math.random() * 0.2,
      detectedObjects: [
        {
          type: 'dice',
          confidence: 0.92,
          position: { x: 300, y: 200, width: 40, height: 40 },
          attributes: { value: Math.floor(Math.random() * 6) + 1 }
        },
        ...gameSession.family_members.map((member, index) => ({
          type: 'player_piece' as const,
          confidence: 0.85 + Math.random() * 0.1,
          position: { 
            x: 100 + index * 80, 
            y: 150 + Math.random() * 100, 
            width: 30, 
            height: 30 
          },
          attributes: { 
            color: ['red', 'blue', 'green', 'yellow'][index],
            player: member.name 
          }
        })),
        {
          type: 'board',
          confidence: 0.95,
          position: { x: 50, y: 50, width: 500, height: 400 }
        }
      ],
      boardState: {
        playerPositions: gameSession.family_members.reduce((acc, member, index) => ({
          ...acc,
          [member.name]: member.position + Math.floor(Math.random() * 3) - 1
        }), {}),
        diceVisible: true,
        diceValue: Math.floor(Math.random() * 6) + 1,
        gamePhase: 'playing'
      },
      environmentalFactors: {
        lighting: ['adequate', 'good', 'excellent'][Math.floor(Math.random() * 3)] as any,
        angle: ['adequate', 'good', 'optimal'][Math.floor(Math.random() * 3)] as any,
        clarity: 75 + Math.random() * 25
      }
    }

    setLatestDetection(mockDetection)
    setDetectionHistory(prev => [mockDetection, ...prev.slice(0, 9)]) // Keep last 10
    onDetectionEvent(mockDetection)

    // Auto-sync if enabled and confidence is high enough
    if (settings.autoSyncEnabled && mockDetection.confidence > settings.confidenceThreshold) {
      syncBoardState(mockDetection)
    }
  }

  const syncBoardState = (detection: BoardDetection) => {
    // Update game state based on detection
    const updatedMembers = gameSession.family_members.map(member => {
      const detectedPosition = detection.boardState.playerPositions[member.name]
      if (detectedPosition !== undefined && Math.abs(detectedPosition - member.position) <= 2) {
        return { ...member, position: detectedPosition }
      }
      return member
    })

    onBoardStateUpdate({
      family_members: updatedMembers,
      // Add dice value if detected
      ...(detection.boardState.diceValue && { lastDiceRoll: detection.boardState.diceValue })
    })

    if (settings.notificationsEnabled) {
      showNotification('Board state synchronized successfully!', 'success')
    }
  }

  const showNotification = (message: string, type: 'success' | 'warning' | 'error') => {
    // Simple notification (in real app, use a proper toast system)
    const color = type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded-lg shadow-lg z-50`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 3000)
  }

  const startCalibration = () => {
    setCalibrationMode(true)
    // In real implementation, this would guide the user through board setup
    setTimeout(() => {
      setCalibrationMode(false)
      showNotification('Calibration completed successfully!', 'success')
    }, 5000)
  }

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-500'
    if (strength >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getBatteryColor = (level: number) => {
    if (level >= 60) return 'text-green-500'
    if (level >= 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getLightingColor = (lighting: string) => {
    switch (lighting) {
      case 'excellent': return 'text-green-500'
      case 'good': return 'text-blue-500'
      case 'adequate': return 'text-yellow-500'
      default: return 'text-red-500'
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ESP32-CAM Status Panel */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6"
        variants={fadeInUp}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <motion.h1 
            className="text-3xl font-bold flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Camera className="w-8 h-8" />
            </motion.div>
            Smart Board Detection
          </motion.h1>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div 
              className={`w-3 h-3 rounded-full ${esp32Status.isConnected ? 'bg-green-400' : 'bg-red-400'}`}
              animate={esp32Status.isConnected ? { 
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              } : {}}
              transition={{ 
                duration: 1.5,
                repeat: Infinity 
              }}
            />
            <span className="text-sm">
              {esp32Status.isConnected ? 'ESP32-CAM Connected' : 'Connecting...'}
            </span>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          <motion.div 
            className="text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <motion.div
                animate={{ 
                  y: [0, -3, 0],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Signal className={`w-4 h-4 ${getSignalStrengthColor(esp32Status.signalStrength)}`} />
              </motion.div>
              <span className="text-sm">Signal</span>
            </div>
            <motion.div 
              className="text-xl font-bold"
              key={esp32Status.signalStrength}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {esp32Status.signalStrength}%
            </motion.div>
          </motion.div>
          <motion.div 
            className="text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <motion.div
                animate={{ 
                  rotate: esp32Status.batteryLevel < 30 ? [0, -5, 5, 0] : 0
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: esp32Status.batteryLevel < 30 ? Infinity : 0
                }}
              >
                <Battery className={`w-4 h-4 ${getBatteryColor(esp32Status.batteryLevel)}`} />
              </motion.div>
              <span className="text-sm">Battery</span>
            </div>
            <motion.div 
              className="text-xl font-bold"
              key={esp32Status.batteryLevel}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {Math.round(esp32Status.batteryLevel)}%
            </motion.div>
          </motion.div>
          <motion.div 
            className="text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <motion.div
                animate={isDetecting ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                } : {}}
                transition={{ 
                  duration: 2,
                  repeat: isDetecting ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <Eye className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Status</span>
            </div>
            <motion.div 
              className="text-xl font-bold"
              animate={isDetecting ? { 
                color: ["#ffffff", "#93c5fd", "#ffffff"]
              } : {}}
              transition={{ 
                duration: 1.5,
                repeat: isDetecting ? Infinity : 0
              }}
            >
              {isDetecting ? 'Detecting' : 'Ready'}
            </motion.div>
          </motion.div>
          <motion.div 
            className="text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Updates</span>
            </div>
            <motion.div 
              className="text-xl font-bold"
              key={detectionHistory.length}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {detectionHistory.length}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Control Panel */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg"
        variants={fadeInUp}
        whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      >
        <motion.h2 
          className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Settings className="w-5 h-5 text-blue-500" />
          </motion.div>
          Detection Controls
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-6"
          variants={containerVariants}
        >
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detection Interval (seconds)
              </label>
              <motion.input
                type="range"
                min="1"
                max="30"
                value={settings.detectionInterval}
                onChange={(e) => setSettings(prev => ({ ...prev, detectionInterval: parseInt(e.target.value) }))}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              />
              <motion.span 
                className="text-sm text-gray-600"
                key={settings.detectionInterval}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {settings.detectionInterval}s
              </motion.span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Threshold
              </label>
              <motion.input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={settings.confidenceThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              />
              <motion.span 
                className="text-sm text-gray-600"
                key={settings.confidenceThreshold}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {Math.round(settings.confidenceThreshold * 100)}%
              </motion.span>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoSyncEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, autoSyncEnabled: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Auto-sync game state</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Enable notifications</span>
            </label>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => setIsDetecting(!isDetecting)}
            disabled={!esp32Status.isConnected}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
              isDetecting 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            } ${!esp32Status.isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDetecting ? (
              <>
                <Pause className="w-4 h-4" />
                Stop Detection
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Detection
              </>
            )}
          </motion.button>

          <motion.button
            onClick={startCalibration}
            disabled={calibrationMode}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {calibrationMode ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Activity className="w-4 h-4" />
                </motion.div>
                Calibrating...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Calibrate Board
              </>
            )}
          </motion.button>

          <motion.button
            onClick={() => performBoardDetection()}
            disabled={!esp32Status.isConnected}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Scan className="w-4 h-4" />
            Manual Scan
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Latest Detection Results */}
      <AnimatePresence mode="wait">
        {latestDetection && (
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Brain className="w-5 h-5 text-green-500" />
              </motion.div>
              Latest Detection Results
            </motion.h2>

            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              {/* Detection Confidence */}
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                <motion.div 
                  className="p-4 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Confidence</span>
                    <motion.span 
                      className="text-lg font-bold text-green-600"
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {Math.round(latestDetection.confidence * 100)}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${latestDetection.confidence * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  variants={itemVariants}
                >
                  <h4 className="font-semibold text-gray-800">Environmental Factors</h4>
                  <motion.div 
                    className="grid grid-cols-3 gap-2 text-sm"
                    variants={containerVariants}
                  >
                    <motion.div 
                      className="text-center p-2 bg-gray-50 rounded"
                      variants={scaleIn}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className={`font-medium ${getLightingColor(latestDetection.environmentalFactors.lighting)}`}>
                        {latestDetection.environmentalFactors.lighting.toUpperCase()}
                      </div>
                      <div className="text-gray-600">Lighting</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-2 bg-gray-50 rounded"
                      variants={scaleIn}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className={`font-medium ${getLightingColor(latestDetection.environmentalFactors.angle)}`}>
                        {latestDetection.environmentalFactors.angle.toUpperCase()}
                      </div>
                      <div className="text-gray-600">Angle</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-2 bg-gray-50 rounded"
                      variants={scaleIn}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="font-medium text-blue-600">
                        {Math.round(latestDetection.environmentalFactors.clarity)}%
                      </div>
                      <div className="text-gray-600">Clarity</div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Detected Objects */}
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                <h4 className="font-semibold text-gray-800">Detected Objects ({latestDetection.detectedObjects.length})</h4>
                <motion.div 
                  className="space-y-2 max-h-48 overflow-y-auto"
                  variants={containerVariants}
                >
                  {latestDetection.detectedObjects.map((obj, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.span 
                          className="text-2xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                          {obj.type === 'dice' ? '🎲' : obj.type === 'player_piece' ? '♟️' : obj.type === 'board' ? '🏁' : '❓'}
                        </motion.span>
                        <div>
                          <div className="font-medium text-gray-800">
                            {obj.type.replace('_', ' ').toUpperCase()}
                          </div>
                          {obj.attributes && (
                            <div className="text-xs text-gray-600">
                              {obj.attributes.player && `Player: ${obj.attributes.player}`}
                              {obj.attributes.value && ` | Value: ${obj.attributes.value}`}
                              {obj.attributes.color && ` | Color: ${obj.attributes.color}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <motion.span 
                        className="text-sm font-medium text-green-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        {Math.round(obj.confidence * 100)}%
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Board State */}
            <motion.div 
              className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-semibold text-blue-800 mb-3">Detected Board State</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                <h5 className="font-medium text-blue-700 mb-2">Player Positions</h5>
                <div className="space-y-1">
                  {Object.entries(latestDetection.boardState.playerPositions).map(([player, position]) => (
                    <div key={player} className="flex justify-between text-sm">
                      <span className="text-blue-600">{player}</span>
                      <span className="font-medium">Position {position}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-blue-700 mb-2">Game Status</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Dice Visible</span>
                    <span className="font-medium">{latestDetection.boardState.diceVisible ? 'Yes' : 'No'}</span>
                  </div>
                  {latestDetection.boardState.diceValue && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">Dice Value</span>
                      <span className="font-medium">{latestDetection.boardState.diceValue}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-blue-600">Phase</span>
                    <span className="font-medium capitalize">{latestDetection.boardState.gamePhase}</span>
                  </div>
                </div>
              </div>
            </div>

            {latestDetection.confidence > settings.confidenceThreshold && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={() => syncBoardState(latestDetection)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </motion.div>
                  Sync Game State
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Detection History */}
      <AnimatePresence>
        {detectionHistory.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.h2 
              className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Activity className="w-5 h-5 text-purple-500" />
              </motion.div>
              Detection History
            </motion.h2>
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
            >
              {detectionHistory.slice(0, 5).map((detection, index) => (
                <motion.div 
                  key={detection.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: "#e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <div>
                    <motion.div 
                      className="font-medium text-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                    >
                      Detection #{detectionHistory.length - index}
                    </motion.div>
                    <motion.div 
                      className="text-sm text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {new Date(detection.timestamp).toLocaleTimeString()} • {detection.detectedObjects.length} objects
                    </motion.div>
                  </div>
                  <div className="text-right">
                    <motion.div 
                      className="font-bold text-green-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      {Math.round(detection.confidence * 100)}%
                    </motion.div>
                    <motion.div 
                      className="text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {detection.environmentalFactors.lighting} lighting
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Setup Guide */}
      <AnimatePresence>
        {!esp32Status.isConnected && (
          <motion.div 
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
              ESP32-CAM Setup Guide
            </motion.h2>
            <motion.div 
              className="space-y-3 text-yellow-700"
              variants={containerVariants}
            >
              {[
                "1. Ensure your ESP32-CAM is powered on and connected to the same WiFi network",
                "2. Position the camera with a clear view of the game board",
                "3. Ensure adequate lighting for optimal detection accuracy",
                "4. Run the calibration process to establish board boundaries"
              ].map((step, index) => (
                <motion.p
                  key={index}
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {step}
                </motion.p>
              ))}
            </motion.div>
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button 
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Setup Instructions
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ESP32BoardIntegration