import React, { useState } from 'react'
import { Users, Sparkles, Crown, Heart, UserPlus, X, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Player {
  name: string
  role: 'son' | 'daughter' | 'grandfather' | 'grandmother'
}

interface Props {
  onSetupComplete: (difficulty: string, players: Player[]) => void
}

const FamilySetup: React.FC<Props> = ({ onSetupComplete }) => {
  const [difficulty, setDifficulty] = useState('medium')
  const [players, setPlayers] = useState<Player[]>([
    { name: '', role: 'grandfather' },
    { name: '', role: 'son' }
  ])
  const [focusedInput, setFocusedInput] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<number, string>>({})

  const difficulties = [
    { id: 'easy', label: 'Easy', budget: 0, color: 'bg-green-500', description: 'Perfect for first-time players' },
    { id: 'medium', label: 'Medium', budget: 0, color: 'bg-yellow-500', description: 'Balanced challenge for most families' },
    { id: 'hard', label: 'Hard', budget: 0, color: 'bg-orange-500', description: 'Requires strategic thinking' },
    { id: 'expert', label: 'Expert', budget: 0, color: 'bg-red-500', description: 'For experienced players only' }
  ]

  const roles = [
    { id: 'grandfather', label: 'Grandfather', icon: Crown, type: 'senior' },
    { id: 'grandmother', label: 'Grandmother', icon: Heart, type: 'senior' },
    { id: 'son', label: 'Son', icon: Users, type: 'young' },
    { id: 'daughter', label: 'Daughter', icon: Sparkles, type: 'young' }
  ]

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = { ...newPlayers[index], [field]: value }
    setPlayers(newPlayers)
    
    // ✅ Clear error when user types
    if (field === 'name' && value.trim()) {
      const newErrors = { ...errors }
      delete newErrors[index]
      setErrors(newErrors)
    }
  }

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { name: '', role: 'son' }])
      toast.success('Player slot added!', { icon: '👤', duration: 2000 })
    } else {
      toast.error('Maximum 4 players allowed', { icon: '⚠️' })
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const playerName = players[index].name || 'Player'
      setPlayers(players.filter((_, i) => i !== index))
      toast(`${playerName} removed`, { icon: '👋' })
      // Clear errors for this player
      const newErrors = { ...errors }
      delete newErrors[index]
      setErrors(newErrors)
    } else {
      toast.error('Minimum 2 players required', { icon: '⚠️' })
    }
  }

  const canStart = () => {
    const allNamed = players.every(p => p.name.trim().length > 0)
    const hasYoung = players.some(p => ['son', 'daughter'].includes(p.role))
    const hasSenior = players.some(p => ['grandfather', 'grandmother'].includes(p.role))
    return allNamed && hasYoung && hasSenior
  }

  const handleStart = () => {
    // ✅ Validate all fields
    const newErrors: Record<number, string> = {}
    players.forEach((player, index) => {
      if (!player.name.trim()) {
        newErrors[index] = 'Name is required'
      } else if (player.name.trim().length < 2) {
        newErrors[index] = 'Name must be at least 2 characters'
      } else if (player.name.trim().length > 30) {
        newErrors[index] = 'Name must be less than 30 characters'
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fix the errors before starting', { icon: '⚠️' })
      return
    }
    
    if (!canStart()) {
      toast.error('Please ensure you have both young and senior members', { icon: '👨‍👩‍👧‍👦' })
      return
    }
    
    // ✅ Success feedback
    toast.success('Starting your family adventure!', { icon: '🎉', duration: 2000 })
    setTimeout(() => {
      onSetupComplete(difficulty, players)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kopi-50 via-white to-talk-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl font-bold gradient-text mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              Family Setup
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Configure your family for the KopiTalk adventure
            </motion.p>
          </motion.div>

          {/* Difficulty Selection */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-kopi-500" />
              Choose Difficulty
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {difficulties.map((diff, index) => (
                <motion.button
                  key={diff.id}
                  onClick={() => {
                    setDifficulty(diff.id)
                    toast.success(`${diff.label} mode selected!`, { icon: '🎯', duration: 1500 })
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    difficulty === diff.id
                      ? 'border-kopi-500 bg-kopi-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div 
                      className={`w-3 h-3 rounded-full ${diff.color}`}
                      animate={difficulty === diff.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: difficulty === diff.id ? Infinity : 0, duration: 1.5 }}
                    />
                    <span className="font-medium text-gray-800">{diff.label}</span>
                    {difficulty === diff.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check className="w-4 h-4 text-kopi-500" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">${diff.budget} starting budget</p>
                  <p className="text-xs text-gray-500">{diff.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Player Setup */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg mb-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-kopi-500" />
                Family Members
              </h2>
              {players.length < 4 && (
                <motion.button
                  onClick={addPlayer}
                  className="flex items-center gap-2 px-4 py-2 bg-kopi-500 text-white rounded-lg hover:bg-kopi-600 transition-colors font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="w-4 h-4" />
                  Add Player
                </motion.button>
              )}
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {players.map((player, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-3 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter name"
                          value={player.name}
                          onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                          onFocus={() => setFocusedInput(index)}
                          onBlur={() => setFocusedInput(null)}
                          aria-invalid={errors[index] ? 'true' : 'false'}
                          aria-describedby={errors[index] ? `error-${index}` : undefined}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                            errors[index] 
                              ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                              : focusedInput === index
                              ? 'border-kopi-500 focus:ring-2 focus:ring-kopi-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        />
                        {player.name && !errors[index] && (
                          <motion.div
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <Check className="w-5 h-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      <AnimatePresence>
                        {errors[index] && (
                          <motion.p 
                            id={`error-${index}`}
                            className="text-sm text-red-600 flex items-center gap-1"
                            role="alert"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors[index]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex-1">
                      <select
                        value={player.role}
                        onChange={(e) => updatePlayer(index, 'role', e.target.value as any)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kopi-500 focus:border-kopi-500 transition-all duration-200 hover:border-gray-300"
                      >
                        {roles.map((role) => {
                          const Icon = role.icon
                          return (
                            <option key={role.id} value={role.id}>
                              {role.label}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    
                    {players.length > 2 && (
                      <motion.button
                        onClick={() => removePlayer(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Remove player"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Validation Message */}
            <AnimatePresence>
              {!canStart() && players.every(p => p.name.trim()) && (
                <motion.div 
                  className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Please ensure you have at least one <strong>young member</strong> (Son/Daughter) and one <strong>senior member</strong> (Grandfather/Grandmother).
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Start Button */}
          <motion.button
            onClick={handleStart}
            disabled={!canStart()}
            className={`w-full py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              canStart()
                ? 'bg-gradient-to-r from-kopi-500 to-talk-500 hover:shadow-xl cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed opacity-50'
            }`}
            whileHover={canStart() ? { scale: 1.02 } : {}}
            whileTap={canStart() ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Sparkles className="w-5 h-5" />
            Start Family Adventure
            <motion.span
              animate={canStart() ? { rotate: [0, 360] } : {}}
              transition={{ repeat: canStart() ? Infinity : 0, duration: 2, ease: "linear" }}
            >
              ✨
            </motion.span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default FamilySetup