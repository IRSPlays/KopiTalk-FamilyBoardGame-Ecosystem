import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gameStorage } from '../utils/gameStorage'
import { GameSession } from '../types'
import FamilySetup from '../components/FamilySetup'
// import BoardBuilderModal from '../components/BoardBuilderModal' // TEMPORARILY DISABLED - drag-and-drop phase removed
import BoardSetupModal from '../components/BoardSetupModal'
import GameplayInterface from '../components/GameplayInterface'
import GameStartChallenge from '../components/GameStartChallenge'
import { useGameStore } from '../stores/gameStore'

const BoardGame: React.FC = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const { setDishChallenge } = useGameStore()

  useEffect(() => {
    if (sessionId) {
      // Load existing game
      const game = gameStorage.getGame(sessionId)
      if (game) {
        setGameSession(game)
      } else {
        // Game not found, redirect to home
        navigate('/')
        return
      }
    } else {
      // Create new game - start with family setup
      setGameSession({
        id: `game_${Date.now()}`,
        difficulty: 'medium',
        family_budget: 0, // Start with zero money - earn through activities
        family_members: [],
        game_phase: 'family_setup',
        game_scenario: null,
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      })
    }
    setLoading(false)
  }, [sessionId, navigate])

  const updateGameSession = (updates: Partial<GameSession>) => {
    if (!gameSession) return
    
    const updatedGame = {
      ...gameSession,
      ...updates,
      last_updated: new Date().toISOString()
    }
    
    setGameSession(updatedGame)
    gameStorage.saveGame(updatedGame)
    
    // Update URL if we just created a new game
    if (!sessionId && updatedGame.id) {
      navigate(`/game/${updatedGame.id}`, { replace: true })
    }
  }

  const handleFamilySetupComplete = (difficulty: string, players: any[]) => {
    const budgetMap: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
      expert: 0
    }

    updateGameSession({
      difficulty,
      family_budget: budgetMap[difficulty],
      family_members: players.map((player, index) => ({
        ...player,
        position: 0,
        points: 0,
        cash: 0,
        ezlink_balance: 0,
        conversation_contributions: 0,
        cultural_knowledge_score: 0
      })),
      game_phase: 'board_setup' // SKIP board_building, go directly to photo upload
    })
  }

  // REMOVED: handleBoardBuildingComplete - drag-and-drop building removed as per user request
  // User: "Remove board game setup which is the one i drag and drop temporarily"
  // New flow: family_setup → board_setup (photo only) → challenge → gameplay

  const handleBoardSetupComplete = () => {
    // FIXED: Show challenge generation modal after board setup, before gameplay
    setShowChallengeModal(true)
  }

  const handleChallengeGenerated = (challenge: any) => {
    // Save challenge to game store for use across pages
    setDishChallenge(challenge)
    
    // Close modal and proceed to gameplay
    setShowChallengeModal(false)
    updateGameSession({
      game_phase: 'gameplay'
    })
  }

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-kopi-50 to-talk-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <motion.div 
            className="relative mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-12 w-12 border-4 border-kopi-200 border-t-kopi-500 rounded-full"></div>
          </motion.div>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading game...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  if (!gameSession) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-kopi-50 to-talk-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.p 
            className="text-red-600 text-lg mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Game not found
          </motion.p>
          <motion.button
            onClick={() => navigate('/')}
            className="bg-kopi-500 text-white px-6 py-2 rounded-lg hover:bg-kopi-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return Home
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  // Render based on game phase
  return (
    <AnimatePresence mode="wait">
      {gameSession.game_phase === 'family_setup' && (
        <motion.div
          key="family_setup"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <FamilySetup onSetupComplete={handleFamilySetupComplete} />
        </motion.div>
      )}

      {/* REMOVED: board_building phase - drag-and-drop UI temporarily disabled */}
      {/* User request: "Remove board game setup which is the one i drag and drop temporarily" */}
      {/* New simplified flow: family_setup → board_setup (photo upload) → gameplay */}
      
      {gameSession.game_phase === 'board_setup' && (
        <motion.div
          key="board_setup"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <BoardSetupModal
            difficulty={gameSession.difficulty}
            onSetupComplete={handleBoardSetupComplete}
          />
        </motion.div>
      )}
      
      {/* FIXED: Challenge generation modal after board setup, before gameplay */}
      {showChallengeModal && (
        <motion.div
          key="challenge_generation"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <GameStartChallenge
            onClose={() => {
              // Skip challenge generation - go straight to gameplay
              setShowChallengeModal(false)
              updateGameSession({ game_phase: 'gameplay' })
            }}
            onChallengeGenerated={handleChallengeGenerated}
          />
        </motion.div>
      )}
      
      {gameSession.game_phase === 'gameplay' && (
        <motion.div
          key="gameplay"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <GameplayInterface
            gameSession={gameSession}
            onUpdateGame={updateGameSession}
          />
        </motion.div>
      )}
      
      {!['family_setup', 'board_setup', 'gameplay'].includes(gameSession.game_phase) && (
        <motion.div 
          key="unknown"
          className="min-h-screen bg-gradient-to-br from-kopi-50 to-talk-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Unknown game phase: {gameSession.game_phase}</p>
            <motion.button
              onClick={() => navigate('/')}
              className="bg-kopi-500 text-white px-6 py-2 rounded-lg hover:bg-kopi-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Return Home
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BoardGame