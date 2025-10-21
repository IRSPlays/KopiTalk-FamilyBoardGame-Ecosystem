import React, { useState } from 'react';
import { User, Mic, Video, ShoppingCart, Dices, Info, Flame, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navigateToGame } from '../utils/navigationHelper';

// --- Mock Data & Types (replace with your actual game state management) ---

type Player = {
  id: number;
  name: string;
  money: number;
  role: 'Grandparent' | 'Teenager';
};

const initialPlayers: Player[] = [
  { id: 1, name: 'Ah Gong', money: 150, role: 'Grandparent' },
  { id: 2, name: 'Brenda', money: 120, role: 'Teenager' },
];

const initialLog: string[] = [
  "Game started! Welcome to KopiTalk.",
  "Ah Gong is at the HDB Block (B2).",
  "Brenda is at the MRT Station (D4)."
];

// --- Reusable Sub-components for the Hub ---

const PlayerCard: React.FC<{ player: Player; isActive: boolean; onClick: () => void }> = ({ player, isActive, onClick }) => (
  <motion.div
    onClick={onClick}
    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
      isActive
        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <User className={`w-6 h-6 ${player.role === 'Grandparent' ? 'text-orange-500' : 'text-blue-500'}`} />
        </motion.div>
        <span className="font-bold text-lg">{player.name}</span>
      </div>
      <motion.span 
        className="text-xl font-semibold text-green-600 dark:text-green-400"
        key={player.money}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
      >
        ${player.money}
      </motion.span>
    </div>
  </motion.div>
);

const ActionButton: React.FC<{ icon: React.ElementType; label: string; onClick: () => void; disabled?: boolean }> = ({ icon: Icon, label, onClick, disabled }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Icon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
    <span className="text-sm font-medium text-center">{label}</span>
  </motion.button>
);

const GameLog: React.FC<{ logs: string[] }> = ({ logs }) => (
  <motion.div 
    className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Info className="w-5 h-5" />
      </motion.div>
      Game Log
    </h3>
    <div className="max-h-48 overflow-y-auto space-y-2">
      <AnimatePresence mode="popLayout">
        {logs.length === 0 ? (
          <motion.p
            key="empty-log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 dark:text-gray-400 text-sm italic"
          >
            No actions yet
          </motion.p>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={`log-${index}-${log}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="text-sm p-2 bg-gray-50 dark:bg-gray-600 rounded border-l-2 border-blue-500"
            >
              {log}
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

const BoardState: React.FC = () => (
  <motion.div 
    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <h3 className="font-bold mb-2 flex items-center justify-center gap-2">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      >
        <Flame className="w-5 h-5 text-red-500" />
      </motion.div>
      Live Board State
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Point the ESP32-CAM at the board. The latest state will appear here.
    </p>
    {/* This is where you would render the digital twin of the board */}
    <motion.div 
      className="mt-4 p-4 border-2 border-dashed rounded-lg h-32 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <motion.p 
        className="text-gray-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Awaiting data from server...
      </motion.p>
    </motion.div>
  </motion.div>
);

// --- Main GameHub Component ---

export const GameHub: React.FC = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [activePlayerId, setActivePlayerId] = useState<number | null>(1);
  const [logs, setLogs] = useState<string[]>(initialLog);

  const activePlayer = players.find(p => p.id === activePlayerId);

  // --- Action Handlers (to be implemented) ---
  const handleRecordConversation = () => {
    if (!activePlayer) return;
    console.log(`${activePlayer.name} is recording a conversation.`);
    // TODO: Open conversation recording modal
    setLogs(prev => [...prev, `${activePlayer.name} started a conversation.`]);
  };

  const handleFilmTikTok = () => {
    if (!activePlayer) return;
    console.log(`${activePlayer.name} is filming a TikTok.`);
    // TODO: Open TikTok recording modal
    setLogs(prev => [...prev, `${activePlayer.name} is filming a TikTok.`]);
  };

  const handleGoShopping = () => {
    if (!activePlayer) return;
    console.log(`${activePlayer.name} is going shopping.`);
    // TODO: Open market selection modal
    setLogs(prev => [...prev, `${activePlayer.name} went to the market.`]);
  };

  const handleRollDice = () => {
    if (!activePlayer) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    console.log(`${activePlayer.name} rolled a ${roll}.`);
    // TODO: Update game state based on roll
    setLogs(prev => [...prev, `${activePlayer.name} rolled a ${roll}! The physical piece should be moved.`]);
    
    // Example of automatically passing the turn
    const currentIndex = players.findIndex(p => p.id === activePlayerId);
    const nextPlayer = players[(currentIndex + 1) % players.length];
    setActivePlayerId(nextPlayer.id);
    setLogs(prev => [...prev, `It's now ${nextPlayer.name}'s turn.`]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Button */}
        <motion.button
          onClick={() => navigateToGame(navigate)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Main Game</span>
        </motion.button>

        {/* Header */}
        <motion.header 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold">KopiTalk Game Hub</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Your companion for the physical board game.</p>
        </motion.header>

        {/* Player Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-3">Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={player.id === activePlayerId}
                onClick={() => setActivePlayerId(player.id)}
              />
            ))}
          </div>
           <p className="text-center text-sm mt-2 text-gray-500">Tap a player to select them for an action.</p>
        </motion.section>

        {/* Player Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-3">
            {activePlayer ? `${activePlayer.name}'s Actions` : 'Select a Player'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionButton icon={Mic} label="Record Convo" onClick={handleRecordConversation} disabled={!activePlayer} />
            <ActionButton icon={Video} label="Film TikTok" onClick={handleFilmTikTok} disabled={!activePlayer} />
            <ActionButton icon={ShoppingCart} label="Go Shopping" onClick={handleGoShopping} disabled={!activePlayer} />
            <ActionButton icon={Dices} label="Roll Dice & End Turn" onClick={handleRollDice} disabled={!activePlayer} />
          </div>
        </motion.section>

        {/* Game State & Log */}
        <motion.section 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
            <BoardState />
            <GameLog logs={logs} />
        </motion.section>

      </div>
    </div>
  );
};

export default GameHub;
