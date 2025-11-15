import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2, X, CheckCircle, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import toast from 'react-hot-toast'

interface LanguageExchangeEnhancedProps {
  currentPlayerId: number
  onClose: () => void
}

type DialectPhrase = {
  id: string
  dialect: string
  phrase: string
  pronunciation: string
  meaning: string
  difficulty: 'easy' | 'medium' | 'hard'
  alternativeWords: string[]
}

type SlangPhrase = {
  id: string
  slang: string
  meaning: string
  usage: string
  difficulty: 'easy' | 'medium' | 'hard'
  expectedWords: string[]
}

const LanguageExchangeEnhanced: React.FC<LanguageExchangeEnhancedProps> = ({ currentPlayerId, onClose }) => {
  const [mode, setMode] = useState<'select' | 'dialect' | 'slang' | null>(null)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)
  const updateFamilyBudget = useGameStore(state => state.updateFamilyBudget)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const dialectPhrases: DialectPhrase[] = [
    {
      id: '1',
      dialect: 'Hokkien',
      phrase: 'Jiak ba buay?',
      pronunciation: 'Jee-ak bah boo-ay',
      meaning: 'Have you eaten?',
      difficulty: 'easy',
      alternativeWords: ['jiak', 'ba', 'buay', 'eat', 'eaten']
    },
    {
      id: '2',
      dialect: 'Hokkien',
      phrase: 'Mai gong kong',
      pronunciation: 'My gong kong',
      meaning: "Don't talk nonsense",
      difficulty: 'medium',
      alternativeWords: ['mai', 'gong', 'kong', 'talk', 'nonsense']
    },
    {
      id: '3',
      dialect: 'Cantonese',
      phrase: 'Yum cha',
      pronunciation: 'Yum chah',
      meaning: 'Drink tea (go for dim sum)',
      difficulty: 'easy',
      alternativeWords: ['yum', 'cha', 'tea', 'drink']
    },
    {
      id: '4',
      dialect: 'Hokkien',
      phrase: 'Bo bian',
      pronunciation: 'Bo bee-an',
      meaning: 'No choice / Cannot be helped',
      difficulty: 'medium',
      alternativeWords: ['bo', 'bian', 'choice', 'help']
    },
    {
      id: '5',
      dialect: 'Teochew',
      phrase: 'Hor mai',
      pronunciation: 'Hor my',
      meaning: 'Very good',
      difficulty: 'easy',
      alternativeWords: ['hor', 'mai', 'good', 'very']
    }
  ]

  const slangPhrases: SlangPhrase[] = [
    {
      id: '1',
      slang: 'Shiok',
      meaning: 'Awesome, fantastic, pleasurable',
      usage: 'This laksa is so shiok!',
      difficulty: 'easy',
      expectedWords: ['shiok', 'awesome', 'good', 'nice']
    },
    {
      id: '2',
      slang: 'Paiseh',
      meaning: 'Embarrassed, shy, or sorry',
      usage: "Paiseh ah, I'm late!",
      difficulty: 'easy',
      expectedWords: ['paiseh', 'sorry', 'shy', 'embarrassed']
    },
    {
      id: '3',
      slang: 'Kiasu',
      meaning: 'Fear of losing out, overly competitive',
      usage: 'He so kiasu, always want to be first in line',
      difficulty: 'medium',
      expectedWords: ['kiasu', 'afraid', 'lose', 'competitive']
    },
    {
      id: '4',
      slang: 'Kan cheong',
      meaning: 'Nervous, anxious, stressed',
      usage: 'Why you so kan cheong? Exam next week only',
      difficulty: 'medium',
      expectedWords: ['kan', 'cheong', 'nervous', 'anxious', 'stress']
    },
    {
      id: '5',
      slang: 'Chope',
      meaning: 'Reserve a seat or place',
      usage: 'Can you chope my seat with tissue packet?',
      difficulty: 'easy',
      expectedWords: ['chope', 'reserve', 'save', 'keep']
    }
  ]

  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening()
    }
  }, [])

  const startListening = () => {
    resetTranscript()
    setIsRecording(true)
    setAttempts(attempts + 1)
    SpeechRecognition.startListening({ continuous: false, language: 'en-SG' })
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    setIsRecording(false)
  }

  const checkPronunciation = (phrase: DialectPhrase) => {
    if (!transcript) {
      toast.error('No speech detected. Try again!')
      return
    }

    const transcriptLower = transcript.toLowerCase()
    const matchedWords = phrase.alternativeWords.filter(word => 
      transcriptLower.includes(word.toLowerCase())
    )

    const accuracy = (matchedWords.length / phrase.alternativeWords.length) * 100
    
    if (accuracy >= 60) {
      const points = phrase.difficulty === 'easy' ? 10 : phrase.difficulty === 'medium' ? 15 : 20
      setScore(score + points)
      toast.success(`Great pronunciation! +${points} points`)
      
      setTimeout(() => {
        if (currentPhraseIndex < dialectPhrases.length - 1) {
          setCurrentPhraseIndex(currentPhraseIndex + 1)
          resetTranscript()
          setAttempts(0)
        } else {
          finishActivity()
        }
      }, 2000)
    } else {
      toast.error(`Try again! Accuracy: ${Math.round(accuracy)}%`)
      if (attempts >= 3) {
        toast('💡 Hint: Listen carefully and repeat slowly', { duration: 4000 })
      }
    }
  }

  const checkSlangUsage = (phrase: SlangPhrase) => {
    if (!transcript) {
      toast.error('No speech detected. Try again!')
      return
    }

    const transcriptLower = transcript.toLowerCase()
    const matchedWords = phrase.expectedWords.filter(word => 
      transcriptLower.includes(word.toLowerCase())
    )

    const accuracy = (matchedWords.length / phrase.expectedWords.length) * 100
    
    if (accuracy >= 50 || transcriptLower.includes(phrase.slang.toLowerCase())) {
      const points = phrase.difficulty === 'easy' ? 10 : phrase.difficulty === 'medium' ? 15 : 20
      setScore(score + points)
      toast.success(`Perfect! You used "${phrase.slang}" correctly! +${points} points`)
      
      setTimeout(() => {
        if (currentPhraseIndex < slangPhrases.length - 1) {
          setCurrentPhraseIndex(currentPhraseIndex + 1)
          resetTranscript()
          setAttempts(0)
        } else {
          finishActivity()
        }
      }, 2000)
    } else {
      toast.error('Try using the slang word in your sentence!')
      if (attempts >= 2) {
        toast(`💡 Hint: ${phrase.usage}`, { duration: 5000 })
      }
    }
  }

  const finishActivity = () => {
    setShowResult(true)
    const earnings = Math.round(score * 0.5) // Convert score to money
    
    addCompletedActivity({
      id: `language-exchange-${Date.now()}`,
      type: 'language',
      timestamp: new Date().toISOString(),
      earnings: earnings,
      participants: [currentPlayerId],
      details: {
        mode: mode,
        score: score,
        phrasesCompleted: currentPhraseIndex + 1
      }
    })

    updateFamilyBudget(earnings)
    toast.success(`Earned $${earnings}!`)

    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-SG'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-center mb-2">Speech Recognition Not Supported</h3>
          <p className="text-gray-600 text-center mb-4">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    )
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
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Language Exchange</h2>
                  <p className="text-purple-100 text-sm">Speech Recognition Practice</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Mode Selection */}
            {!mode && !showResult && (
              <div className="space-y-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-purple-900 flex items-start gap-2">
                    <Mic className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Voice Practice:</strong> Elderly teach dialect phrases or slang. Youth record and repeat for AI scoring!
                    </span>
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode('dialect')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Learn Dialect Phrases</h3>
                      <p className="text-sm opacity-90">Hokkien, Cantonese, Teochew</p>
                      <p className="text-xs opacity-75 mt-2">5 phrases • Voice recognition</p>
                    </div>
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode('slang')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Singapore Slang</h3>
                      <p className="text-sm opacity-90">Shiok, Paiseh, Kiasu & more</p>
                      <p className="text-xs opacity-75 mt-2">5 words • Usage practice</p>
                    </div>
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </motion.button>
              </div>
            )}

            {/* Dialect Learning Mode */}
            {mode === 'dialect' && !showResult && (
              <div className="space-y-4">
                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Phrase {currentPhraseIndex + 1} of {dialectPhrases.length}</span>
                  <span className="text-sm font-semibold text-purple-600">Score: {score}</span>
                </div>

                {/* Current Phrase */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                      {dialectPhrases[currentPhraseIndex].dialect}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">
                      {dialectPhrases[currentPhraseIndex].difficulty}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{dialectPhrases[currentPhraseIndex].phrase}</h3>
                  <p className="text-lg opacity-90 mb-2">{dialectPhrases[currentPhraseIndex].pronunciation}</p>
                  <p className="text-sm opacity-75">{dialectPhrases[currentPhraseIndex].meaning}</p>
                </div>

                {/* Listen Button */}
                <button
                  onClick={() => playAudio(dialectPhrases[currentPhraseIndex].phrase)}
                  className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Listen to Pronunciation
                </button>

                {/* Recording Area */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Your Recording:</h4>
                  
                  {/* Microphone Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={isRecording ? stopListening : startListening}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 mb-3 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : listening 
                        ? 'bg-yellow-500' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                    {isRecording ? 'Recording... (Tap to stop)' : 'Hold to Record'}
                  </motion.button>

                  {/* Transcript Display */}
                  {transcript && (
                    <div className="bg-white rounded-lg p-4 mb-3 border-2 border-purple-300">
                      <p className="text-sm text-gray-600 mb-1">You said:</p>
                      <p className="font-semibold text-gray-900">{transcript}</p>
                    </div>
                  )}

                  {/* Check Button */}
                  {transcript && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => checkPronunciation(dialectPhrases[currentPhraseIndex])}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                      >
                        Check Pronunciation
                      </button>
                      <button
                        onClick={() => {
                          resetTranscript()
                          setAttempts(0)
                        }}
                        className="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-xl"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {attempts > 0 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Attempt {attempts}/3 {attempts >= 3 && '(Hint available)'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Slang Learning Mode */}
            {mode === 'slang' && !showResult && (
              <div className="space-y-4">
                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Word {currentPhraseIndex + 1} of {slangPhrases.length}</span>
                  <span className="text-sm font-semibold text-purple-600">Score: {score}</span>
                </div>

                {/* Current Slang */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">
                      {slangPhrases[currentPhraseIndex].difficulty}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{slangPhrases[currentPhraseIndex].slang}</h3>
                  <p className="text-lg opacity-90 mb-3">{slangPhrases[currentPhraseIndex].meaning}</p>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm opacity-75 mb-1">Example:</p>
                    <p className="text-base">{slangPhrases[currentPhraseIndex].usage}</p>
                  </div>
                </div>

                {/* Challenge */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  <h4 className="font-bold text-yellow-900 mb-2">🎯 Your Challenge:</h4>
                  <p className="text-sm text-yellow-800">
                    Use the word "<strong>{slangPhrases[currentPhraseIndex].slang}</strong>" in a sentence and record it!
                  </p>
                </div>

                {/* Recording Area */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Your Sentence:</h4>
                  
                  {/* Microphone Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={isRecording ? stopListening : startListening}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 mb-3 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : listening 
                        ? 'bg-yellow-500' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                    {isRecording ? 'Recording... (Tap to stop)' : 'Hold to Record'}
                  </motion.button>

                  {/* Transcript Display */}
                  {transcript && (
                    <div className="bg-white rounded-lg p-4 mb-3 border-2 border-purple-300">
                      <p className="text-sm text-gray-600 mb-1">You said:</p>
                      <p className="font-semibold text-gray-900">{transcript}</p>
                    </div>
                  )}

                  {/* Check Button */}
                  {transcript && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => checkSlangUsage(slangPhrases[currentPhraseIndex])}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                      >
                        Check Usage
                      </button>
                      <button
                        onClick={() => {
                          resetTranscript()
                          setAttempts(0)
                        }}
                        className="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-xl"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {attempts > 0 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Attempt {attempts}/3 {attempts >= 2 && '(Hint available)'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Results Screen */}
            {showResult && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center justify-center py-12 px-4"
              >
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-purple-600 mb-2">Excellent Work!</h3>
                <p className="text-gray-600 mb-2">Final Score: {score} points</p>
                <p className="text-gray-600 mb-4">Phrases Completed: {currentPhraseIndex + 1}</p>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${Math.round(score * 0.5)}
                </div>
                <p className="text-gray-600">Earned from language practice!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LanguageExchangeEnhanced
