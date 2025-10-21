import { GameSession } from '../types'

const STORAGE_KEY = 'kopitalk_games'
const GAME_STATE_KEY = 'kopitalk_game_state'
const PLAYER_PROGRESS_KEY = 'kopitalk_player_progress'

export const gameStorage = {
  // Get all games
  getGames(): GameSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading games:', error)
      return []
    }
  },

  // Get a specific game
  getGame(sessionId: string): GameSession | null {
    try {
      const games = this.getGames()
      return games.find(game => game.id === sessionId) || null
    } catch (error) {
      console.error('Error loading game:', error)
      return null
    }
  },

  // Save a game (with automatic backup)
  saveGame(game: GameSession): void {
    try {
      const games = this.getGames()
      const existingIndex = games.findIndex(g => g.id === game.id)
      
      // Update last_updated timestamp
      game.last_updated = new Date().toISOString()
      
      if (existingIndex >= 0) {
        games[existingIndex] = game
      } else {
        games.push(game)
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
      
      // Also save current game state separately for quick access
      this.saveCurrentGameState(game)
      
      console.log('✅ Game saved successfully:', game.id)
    } catch (error) {
      console.error('❌ Error saving game:', error)
    }
  },

  // Create new game with proper initialization
  // PURPOSE: D.I.Y. roleplay board game - players start with ZERO money and earn through activities
  createGame(difficulty: string, players: any[]): GameSession {
    // REMOVED: Starting budget - all players start with $0 and earn through collaboration
    // Money is earned through: TikTok trends, photo challenges, story sharing, cultural activities
    
    const game: GameSession = {
      id: `game_${Date.now()}`,
      difficulty,
      family_budget: 0, // START WITH ZERO - earn through activities
      family_members: players.map((player, index) => ({
        ...player,
        position: 0, // Starting position on custom D.I.Y. board
        points: 0,
        cash: 0, // START WITH ZERO - earn through roleplay activities
        money: 0, // START WITH ZERO
        ezlink_balance: 0, // START WITH ZERO - must top up via app (separate from main money)
        ingredients: 0,
        social_points: 0,
        tikTokFollowers: 0,
        conversation_contributions: 0,
        cultural_knowledge_score: 0,
        index
      })),
      game_phase: 'family_setup', // First phase: family setup
      // REMOVED: current_player_index - no turn-based system, continuous roleplay
      game_scenario: null,
      challenges_completed: [],
      game_events: [],
      created_date: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      // NEW: Will be set during board building phase
      custom_board: undefined,
      // NEW: Will be AI-generated after board setup
      main_dish_challenge: undefined
    }

    this.saveGame(game)
    console.log('✅ New roleplay game created (zero money start):', game.id)
    return game
  },

  // Save current game state for persistence
  saveCurrentGameState(game: GameSession): void {
    try {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(game))
    } catch (error) {
      console.error('Error saving current game state:', error)
    }
  },

  // Load current game state
  getCurrentGameState(): GameSession | null {
    try {
      const stored = localStorage.getItem(GAME_STATE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error loading current game state:', error)
      return null
    }
  },

  // Save player progress (achievements, stats, etc.)
  savePlayerProgress(playerId: string, progress: any): void {
    try {
      const allProgress = this.getAllPlayerProgress()
      allProgress[playerId] = {
        ...allProgress[playerId],
        ...progress,
        last_updated: new Date().toISOString()
      }
      localStorage.setItem(PLAYER_PROGRESS_KEY, JSON.stringify(allProgress))
    } catch (error) {
      console.error('Error saving player progress:', error)
    }
  },

  // Get player progress
  getPlayerProgress(playerId: string): any {
    try {
      const allProgress = this.getAllPlayerProgress()
      return allProgress[playerId] || null
    } catch (error) {
      console.error('Error loading player progress:', error)
      return null
    }
  },

  // Get all player progress
  getAllPlayerProgress(): Record<string, any> {
    try {
      const stored = localStorage.getItem(PLAYER_PROGRESS_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error loading all player progress:', error)
      return {}
    }
  },

  // Update game challenge
  updateGameChallenge(sessionId: string, challenge: any): void {
    try {
      const game = this.getGame(sessionId)
      if (game) {
        if (!game.challenges_completed) {
          game.challenges_completed = []
        }
        game.challenges_completed.push({
          ...challenge,
          completed_at: new Date().toISOString()
        })
        this.saveGame(game)
      }
    } catch (error) {
      console.error('Error updating game challenge:', error)
    }
  },

  // Add game event
  addGameEvent(sessionId: string, event: any): void {
    try {
      const game = this.getGame(sessionId)
      if (game) {
        if (!game.game_events) {
          game.game_events = []
        }
        game.game_events.push({
          ...event,
          timestamp: new Date().toISOString()
        })
        this.saveGame(game)
      }
    } catch (error) {
      console.error('Error adding game event:', error)
    }
  },

  // Delete a game
  deleteGame(sessionId: string): void {
    try {
      const games = this.getGames()
      const filtered = games.filter(g => g.id !== sessionId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      console.log('✅ Game deleted:', sessionId)
    } catch (error) {
      console.error('Error deleting game:', error)
    }
  },

  // Clear all games (with confirmation)
  clearAllGames(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(GAME_STATE_KEY)
      localStorage.removeItem(PLAYER_PROGRESS_KEY)
      console.log('✅ All games cleared')
    } catch (error) {
      console.error('Error clearing games:', error)
    }
  },

  // Export game data (for backup)
  exportGames(): string {
    try {
      const games = this.getGames()
      const progress = this.getAllPlayerProgress()
      const exportData = {
        games,
        progress,
        exported_at: new Date().toISOString(),
        version: '1.0'
      }
      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Error exporting games:', error)
      return '{}'
    }
  },

  // Import game data (from backup)
  importGames(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData)
      if (importData.games) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.games))
      }
      if (importData.progress) {
        localStorage.setItem(PLAYER_PROGRESS_KEY, JSON.stringify(importData.progress))
      }
      console.log('✅ Games imported successfully')
      return true
    } catch (error) {
      console.error('❌ Error importing games:', error)
      return false
    }
  }
}