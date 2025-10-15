import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Trophy, X, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'

interface CulturalQuizProps {
  currentPlayerId: number
  onClose: () => void
}

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  category: string
}

const CulturalQuiz: React.FC<CulturalQuizProps> = ({ currentPlayerId, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const addCompletedActivity = useGameStore(state => state.addCompletedActivity)

  const questions: QuizQuestion[] = [
    {
      question: 'What is the traditional method of cooking Hainanese Chicken Rice?',
      options: ['Deep frying', 'Poaching in broth', 'Grilling', 'Steaming'],
      correctIndex: 1,
      explanation: 'The chicken is poached in chicken broth to keep it tender and moist!',
      category: 'Cooking Technique'
    },
    {
      question: 'Which spice paste is essential for making authentic Laksa?',
      options: ['Garam Masala', 'Rempah', 'Five Spice', 'Curry Powder'],
      correctIndex: 1,
      explanation: 'Rempah is the aromatic spice paste that gives Laksa its signature flavor!',
      category: 'Ingredients'
    },
    {
      question: 'What does "Kopi O" mean in Singapore?',
      options: ['Coffee with milk', 'Black coffee with sugar', 'Iced coffee', 'Coffee with condensed milk'],
      correctIndex: 1,
      explanation: 'Kopi O is black coffee with sugar - "O" means black in Hokkien!',
      category: 'Beverages'
    },
    {
      question: 'Which vegetable is commonly used in Char Kway Teow?',
      options: ['Broccoli', 'Bean Sprouts', 'Spinach', 'Cabbage'],
      correctIndex: 1,
      explanation: 'Bean sprouts add crunch and freshness to the dish!',
      category: 'Ingredients'
    },
    {
      question: 'What is the key to making perfect Carrot Cake (Chai Tow Kway)?',
      options: ['Using real carrots', 'High heat wok', 'Steaming first', 'Adding eggs'],
      correctIndex: 1,
      explanation: 'High heat (wok hei) gives the carrot cake its crispy edges and smoky flavor!',
      category: 'Cooking Technique'
    }
  ]

  React.useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleNext()
    }
  }, [timeLeft, showResult, quizCompleted])

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    if (index === questions[currentQuestion].correctIndex) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(15)
    } else {
      setQuizCompleted(true)
    }
  }

  const completeQuiz = () => {
    const perfectScore = score === questions.length
    const earnings = 5 + Math.floor((score / questions.length) * 10) + (perfectScore ? 5 : 0)

    addCompletedActivity({
      id: `quiz-${Date.now()}`,
      type: 'quiz',
      timestamp: new Date().toISOString(),
      earnings,
      participants: [currentPlayerId],
      details: {
        score,
        totalQuestions: questions.length,
        perfectScore
      }
    })

    alert(`🎉 Quiz Complete! Score: ${score}/${questions.length}\nEarned: $${earnings}${perfectScore ? ' (Perfect bonus!)' : ''}`)
    onClose()
  }

  const currentQ = questions[currentQuestion]

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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Cultural Quiz</h2>
                  <p className="text-indigo-100 text-sm">Singapore Food Heritage</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!quizCompleted && (
              <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                <div>
                  <p className="text-xs text-indigo-100">Question</p>
                  <p className="font-bold">{currentQuestion + 1} / {questions.length}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-100">Score</p>
                  <p className="font-bold">{score}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-100">Time</p>
                  <p className={`font-bold flex items-center gap-1 ${timeLeft < 5 ? 'text-red-300' : ''}`}>
                    <Clock className="w-4 h-4" />
                    {timeLeft}s
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            {!quizCompleted ? (
              <div className="space-y-4">
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6">
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold mb-3">
                    {currentQ.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{currentQ.question}</h3>
                </div>

                <div className="space-y-3">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === currentQ.correctIndex
                    const showFeedback = showResult && isSelected

                    return (
                      <motion.button
                        key={index}
                        whileHover={!showResult ? { scale: 1.02 } : {}}
                        whileTap={!showResult ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          showFeedback
                            ? isCorrect
                              ? 'bg-green-50 border-green-500'
                              : 'bg-red-50 border-red-500'
                            : showResult && isCorrect
                            ? 'bg-green-50 border-green-500'
                            : 'bg-white border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{option}</span>
                          {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {showFeedback && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${
                      selectedAnswer === currentQ.correctIndex
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-blue-50 border-2 border-blue-200'
                    }`}
                  >
                    <p className="text-sm text-gray-700">
                      {selectedAnswer === currentQ.correctIndex ? '✅ Correct! ' : '💡 '} 
                      {currentQ.explanation}
                    </p>
                    <button
                      onClick={handleNext}
                      className="mt-3 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
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
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                  <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                  <p className="text-3xl font-bold text-indigo-600 mb-1">
                    {score} / {questions.length}
                  </p>
                  <p className="text-gray-600">{Math.round((score / questions.length) * 100)}% Correct</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">You Earned</p>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    ${5 + Math.floor((score / questions.length) * 10) + (score === questions.length ? 5 : 0)}
                  </p>
                  {score === questions.length && (
                    <p className="text-xs text-green-700 font-semibold">🎉 Perfect Score Bonus!</p>
                  )}
                </div>

                <button
                  onClick={completeQuiz}
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

export default CulturalQuiz
