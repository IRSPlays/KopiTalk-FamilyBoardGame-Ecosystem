import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Users, Crown, TrendingUp, MessageCircle } from 'lucide-react'

interface BondingMeterProps {
  level: number // 0-100 bonding score
  suggestion?: string
  conversationQuality?: 'excellent' | 'good' | 'fair' | 'needs_improvement'
  lastInteractionTime?: Date
  showDetails?: boolean
}

export const BondingMeter: React.FC<BondingMeterProps> = ({
  level,
  suggestion,
  conversationQuality = 'good',
  lastInteractionTime,
  showDetails = true
}) => {
  const getBondingColor = (score: number) => {
    if (score >= 80) return 'from-pink-500 to-rose-500'
    if (score >= 60) return 'from-purple-500 to-pink-500'
    if (score >= 40) return 'from-blue-500 to-purple-500'
    if (score >= 20) return 'from-gray-500 to-blue-500'
    return 'from-gray-400 to-gray-500'
  }

  const getBondingLabel = (score: number) => {
    if (score >= 80) return 'Excellent Bonding!'
    if (score >= 60) return 'Great Connection'
    if (score >= 40) return 'Good Progress'
    if (score >= 20) return 'Getting Started'
    return 'Keep Talking!'
  }

  const getBondingIcon = (score: number) => {
    if (score >= 80) return Sparkles
    if (score >= 60) return Crown
    if (score >= 40) return Heart
    if (score >= 20) return Users
    return MessageCircle
  }

  const Icon = getBondingIcon(level)

  const getTimeSinceLastInteraction = () => {
    if (!lastInteractionTime) return null
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastInteractionTime.getTime()) / 1000 / 60) // minutes
    
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff} min ago`
    const hours = Math.floor(diff / 60)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  const qualityColors = {
    excellent: 'text-green-600 bg-green-100',
    good: 'text-blue-600 bg-blue-100',
    fair: 'text-yellow-600 bg-yellow-100',
    needs_improvement: 'text-red-600 bg-red-100'
  }

  const qualityLabels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    needs_improvement: 'Needs Work'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-pink-500"
          >
            <Icon className="w-8 h-8" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Bonding Meter</h3>
            <p className="text-sm text-gray-600">{getBondingLabel(level)}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-pink-600">{level}%</div>
          {lastInteractionTime && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {getTimeSinceLastInteraction()}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getBondingColor(level)} relative`}
        >
          {/* Animated shimmer effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          />
        </motion.div>
        
        {/* Milestone markers */}
        <div className="absolute inset-0 flex justify-between items-center px-2">
          {[20, 40, 60, 80].map(milestone => (
            <div
              key={milestone}
              className="w-0.5 h-full bg-white opacity-50"
              style={{ marginLeft: `${milestone - 2}%` }}
            />
          ))}
        </div>
      </div>

      {/* Conversation Quality Badge */}
      {showDetails && conversationQuality && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-600">Last Conversation:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${qualityColors[conversationQuality]}`}>
            {qualityLabels[conversationQuality]}
          </span>
        </div>
      )}

      {/* Suggestion Box */}
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200"
        >
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">Bonding Tip:</p>
              <p className="text-sm text-gray-700">{suggestion}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bonding Milestones */}
      {showDetails && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { threshold: 20, label: 'Started', emoji: '👋' },
            { threshold: 40, label: 'Connected', emoji: '🤝' },
            { threshold: 60, label: 'Close', emoji: '💬' },
            { threshold: 80, label: 'Family', emoji: '❤️' }
          ].map(milestone => (
            <div
              key={milestone.threshold}
              className={`text-center p-2 rounded-lg transition-all ${
                level >= milestone.threshold
                  ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                  : 'bg-gray-100 text-gray-400 border border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{milestone.emoji}</div>
              <div className="text-xs font-semibold">{milestone.label}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default BondingMeter
