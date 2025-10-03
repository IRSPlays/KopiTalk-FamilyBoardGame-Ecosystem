import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gameStorage } from '../utils/gameStorage'
import { GameSession } from '../types'
import FamilySetup from '../components/FamilySetup'
import BoardSetupModal from '../components/BoardSetupModal'
import GameplayInterface from '../components/GameplayInterface'

/**
 * @file This component acts as the main controller for a board game session.
 * It functions as a state machine, managing the game's progression through
 * different phases: family setup, board setup, and active gameplay.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gameStorage } from '../utils/gameStorage';
import { GameSession } from '../types';
import FamilySetup from '../components/FamilySetup';
import BoardSetupModal from '../components/BoardSetupModal';
import GameplayInterface from '../components/GameplayInterface';

/**
 * The BoardGame component orchestrates the entire lifecycle of a game.
 * It loads a session based on the URL, or initializes a new one. It then
 * renders the appropriate UI component based on the current `game_phase`.
 *
 * @returns {JSX.Element} The rendered component for the current game phase.
 */
const BoardGame: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  /** State for the current game session object. */
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  /** State to manage the initial loading process. */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Load an existing game from storage.
      const game = gameStorage.getGame(sessionId);
      if (game) {
        setGameSession(game);
      } else {
        // If no game is found for the ID, redirect to the home page.
        navigate('/');
        return;
      }
    } else {
      // If no session ID is present, initialize a new game session object
      // starting at the 'family_setup' phase.
      setGameSession({
        id: `game_${Date.now()}`,
        difficulty: 'medium',
        family_budget: 100,
        family_members: [],
        game_phase: 'family_setup',
        current_player_index: 0,
        game_scenario: null,
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      });
    }
    setLoading(false);
  }, [sessionId, navigate]);

  /**
   * Updates the game session state, saves it to local storage, and handles
   * URL updates for newly created games.
   * @param {Partial<GameSession>} updates - An object containing the properties of the game session to update.
   */
  const updateGameSession = (updates: Partial<GameSession>) => {
    if (!gameSession) return;

    const updatedGame = {
      ...gameSession,
      ...updates,
      last_updated: new Date().toISOString(),
    };

    setGameSession(updatedGame);
    gameStorage.saveGame(updatedGame);

    // If this is a new game, update the URL to include its new session ID.
    if (!sessionId && updatedGame.id) {
      navigate(`/game/${updatedGame.id}`, { replace: true });
    }
  };

  /**
   * Handles the completion of the family setup phase. It updates the game session
   * with the selected difficulty and player information, and transitions the game
   * to the 'board_setup' phase.
   * @param {string} difficulty - The chosen difficulty level.
   * @param {any[]} players - The array of configured players.
   */
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
        ezlink_balance: 0
      })),
      game_phase: 'board_setup',
      current_player_index: 0
    })
  }

  /**
   * Handles the completion of the board setup phase. Transitions the game
   * to the 'gameplay' phase.
   */
  const handleBoardSetupComplete = () => {
    updateGameSession({
      game_phase: 'gameplay',
    });
  };

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