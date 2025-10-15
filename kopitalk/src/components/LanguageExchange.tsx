import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Volume2, CheckCircle, X, Trophy } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface LanguageExchangeProps {
  currentPlayerId: number
  onClose: () => void
}

type Phrase = {
  id: string
  dialect: string
  phrase: string
  pronunciation: string
  meaning: string
  modernEquivalent?: string
}

const LanguageExchange: React.FC<LanguageExchangeProps> = ({ currentPlayerId, onClose }) => {
  const [selectedDialect, setSelectedDialect] = useState<string>('')
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  const dialects = [
    {
      name: 'Hokkien',
      phrases: [
        { id: 'h1', dialect: 'Hokkien', phrase: '食飽未?', pronunciation: 'Jiak ba buay?', meaning: 'Have you eaten?', modernEquivalent: 'Sup?' },
        { id: 'h2', dialect: 'Hokkien', phrase: '歹勢', pronunciation: 'Pai seh', meaning: 'Sorry / Embarrassed', modernEquivalent: 'My bad' },
        { id: 'h3', dialect: 'Hokkien', phrase: '加油', pronunciation: 'Gia you', meaning: 'Add oil / Keep going', modernEquivalent: 'You got this!' },
      ]
    },
    {
      name: 'Teochew',
      phrases: [
        { id: 't1', dialect: 'Teochew', phrase: '呾乜个?', pronunciation: 'Dan mih gai?', meaning: 'What are you saying?', modernEquivalent: 'Huh?' },
        { id: 't2', dialect: 'Teochew', phrase: '識貨', pronunciation: 'Sai hoe', meaning: 'Knows quality', modernEquivalent: 'Has good taste' },
        { id: 't3', dialect: 'Teochew', phrase: '多謝', pronunciation: 'Doe sia', meaning: 'Thank you', modernEquivalent: 'Thanks!' },
      ]
    },
    {
      name: 'Cantonese',
      phrases: [
        { id: 'c1', dialect: 'Cantonese', phrase: '飲茶', pronunciation: 'Yum cha', meaning: 'Drink tea / Dim sum', modernEquivalent: 'Brunch' },
        { id: 'c2', dialect: 'Cantonese', phrase: '唔該', pronunciation: 'M goi', meaning: 'Thank you / Excuse me', modernEquivalent: 'Thanks' },
        { id: 'c3', dialect: 'Cantonese', phrase: '慢慢食', pronunciation: 'Man man sik', meaning: 'Eat slowly', modernEquivalent: 'Enjoy your meal' },
      ]
    }
  ]

  const currentDialectData = dialects.find(d => d.name === selectedDialect)
  const currentPhrase = currentDialectData?.phrases[currentPhraseIdx]

  const handleNext = () => {
    if (currentDialectData && currentPhraseIdx < currentDialectData.phrases.length - 1) {
      setCurrentPhraseIdx(currentPhraseIdx + 1)
      setScore(score + 1)
    } else {
      completeExchange()
    }
  }

  const completeExchange = () => {
    const earnings = 5 + Math.floor(score * 1.5)

    addCompletedActivity({
      id: `language-${Date.now()}`,
      type: 'language_exchange',
      timestamp: new Date().toISOString(),
      earnings,
      participants: [currentPlayerId],
      details: {
        dialect: selectedDialect,
        phrasesLearned: score + 1
      }
    })

    setCompleted(true)
  }

  const acceptReward = () => {
    const earnings = 5 + Math.floor(score * 1.5)
    alert(`🎉 Language exchange complete! Earned $${earnings}!`)
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
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Language Exchange</h2>
                  <p className="text-purple-100 text-sm">Dialects + Modern Slang</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!selectedDialect ? (
              <div className="space-y-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-purple-900">
                    🗣️ <strong>Bridge Generations:</strong> Learn traditional dialects from elderly, teach modern slang to them!
                  </p>
                </div>

                <div className="space-y-3">
                  {dialects.map((dialect) => (
                    <motion.button
                      key={dialect.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDialect(dialect.name)}
                      className="w-full bg-white border-2 border-gray-200 hover:border-purple-300 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900">{dialect.name}</h4>
                          <p className="text-sm text-gray-600">{dialect.phrases.length} phrases • $5-10</p>
                        </div>
                        <MessageCircle className="w-5 h-5 text-gray-400" />
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
                      setSelectedDialect('')
                      setCurrentPhraseIdx(0)
                      setScore(0)
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    ←
                  </button>
                  <h3 className="font-bold text-gray-900">{selectedDialect}</h3>
                  <div className="text-sm text-gray-600">
                    {currentPhraseIdx + 1}/{currentDialectData?.phrases.length}
                  </div>
                </div>

                {currentPhrase && (
                  <motion.div
                    key={currentPhrase.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
                      <p className="text-4xl font-bold text-purple-900 mb-4">{currentPhrase.phrase}</p>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Volume2 className="w-5 h-5 text-purple-600" />
                        <p className="text-xl text-purple-700">{currentPhrase.pronunciation}</p>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Traditional Meaning</p>
                        <p className="text-lg font-semibold text-gray-900">{currentPhrase.meaning}</p>
                      </div>
                      {currentPhrase.modernEquivalent && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Modern Equivalent</p>
                          <p className="text-lg font-semibold text-purple-600">{currentPhrase.modernEquivalent}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      {currentPhraseIdx < (currentDialectData?.phrases.length || 0) - 1 ? 'Next Phrase' : 'Complete Exchange'}
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Exchange Complete!</h3>
                  <p className="text-green-700">Language barriers bridged!</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">${5 + Math.floor(score * 1.5)}</p>
                  <p className="text-xs text-gray-600">{score + 1} phrases learned</p>
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

export default LanguageExchange
