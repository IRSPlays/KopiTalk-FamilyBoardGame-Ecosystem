import { GameSession } from '../types'

const STORAGE_KEY = 'kopitalk_games'
const GAME_STATE_KEY = 'kopitalk_game_state'
const PLAYER_PROGRESS_KEY = 'kopitalk_player_progress'

/**
 * @file Manages all interactions with the browser's localStorage for game data,
 * including game sessions, current state, and player progress.
 */

/**
 * An object that encapsulates all methods for game data persistence.
 */
export const gameStorage = {
  /**
   * Retrieves all game sessions from localStorage.
   * @returns {GameSession[]} An array of game sessions. Returns an empty array on error.
   */
  getGames(): GameSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading games:', error);
      return [];
    }
  },

  /**
   * Retrieves a single game session by its ID.
   * @param {string} sessionId - The ID of the game session to retrieve.
   * @returns {GameSession | null} The found game session, or null if not found or on error.
   */
  getGame(sessionId: string): GameSession | null {
    try {
      const games = this.getGames();
      return games.find((game) => game.id === sessionId) || null;
    } catch (error) {
      console.error('Error loading game:', error);
      return null;
    }
  },

  /**
   * Saves a game session to localStorage. If the game already exists, it's updated.
   * Otherwise, it's added to the list. Also saves the state to a separate key for
   * quick access.
   * @param {GameSession} game - The game session object to save.
   */
  saveGame(game: GameSession): void {
    try {
      const games = this.getGames();
      const existingIndex = games.findIndex((g) => g.id === game.id);

      // Update last_updated timestamp
      game.last_updated = new Date().toISOString();

      if (existingIndex >= 0) {
        games[existingIndex] = game;
      } else {
        games.push(game);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));

      // Also save current game state separately for quick access
      this.saveCurrentGameState(game);

      console.log('✅ Game saved successfully:', game.id);
    } catch (error) {
      console.error('❌ Error saving game:', error);
    }
  },

  /**
   * Creates a new game session with initialized values, saves it, and returns it.
   * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard', 'expert').
   * @param {any[]} players - An array of player objects to be initialized.
   * @returns {GameSession} The newly created game session object.
   */
  createGame(difficulty: string, players: any[]): GameSession {
    const budgetMap: Record<string, number> = {
      easy: 100,
      medium: 75,
      hard: 50,
      expert: 25
    }

    const game: GameSession = {
      id: `game_${Date.now()}`,
      difficulty,
      family_budget: budgetMap[difficulty] || 75,
      family_members: players.map((player, index) => ({
        ...player,
        position: 0,
        points: 0,
        cash: budgetMap[difficulty] || 75,
        ezlink_balance: 10,
        inventory: [],
        conversation_count: 0,
        video_count: 0,
        delivery_count: 0,
        index
      })),
      game_phase: 'family_setup',
      current_player_index: 0,
      game_scenario: null,
      challenges_completed: [],
      total_turns: 0,
      game_events: [],
      created_date: new Date().toISOString(),
      last_updated: new Date().toISOString()
    }

    this.saveGame(game)
    console.log('✅ New game created:', game.id)
    return game
  },

  /**
   * Saves the current game state to a dedicated key in localStorage for quick access
   * without iterating through the full list of games.
   * @param {GameSession} game - The active game session to save.
   */
  saveCurrentGameState(game: GameSession): void {
    try {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(game));
    } catch (error) {
      console.error('Error saving current game state:', error);
    }
  },

  /**
   * Loads the current game state from localStorage.
   * @returns {GameSession | null} The current game session, or null if none is stored or on error.
   */
  getCurrentGameState(): GameSession | null {
    try {
      const stored = localStorage.getItem(GAME_STATE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading current game state:', error);
      return null;
    }
  },

  /**
   * Saves or updates progress data for a specific player.
   * @param {string} playerId - The ID of the player whose progress is being saved.
   * @param {any} progress - The progress object to save. It will be merged with existing progress.
   */
  savePlayerProgress(playerId: string, progress: any): void {
    try {
      const allProgress = this.getAllPlayerProgress();
      allProgress[playerId] = {
        ...allProgress[playerId],
        ...progress,
        last_updated: new Date().toISOString(),
      };
      localStorage.setItem(PLAYER_PROGRESS_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving player progress:', error);
    }
  },

  /**
   * Retrieves the progress data for a specific player.
   * @param {string} playerId - The ID of the player.
   * @returns {any | null} The player's progress object, or null if not found or on error.
   */
  getPlayerProgress(playerId: string): any {
    try {
      const allProgress = this.getAllPlayerProgress();
      return allProgress[playerId] || null;
    } catch (error) {
      console.error('Error loading player progress:', error);
      return null;
    }
  },

  /**
   * Retrieves all player progress data from localStorage.
   * @returns {Record<string, any>} An object where keys are player IDs and values
   *                                are their progress objects. Returns an empty object on error.
   */
  getAllPlayerProgress(): Record<string, any> {
    try {
      const stored = localStorage.getItem(PLAYER_PROGRESS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading all player progress:', error);
      return {};
    }
  },

  /**
   * Adds a completed challenge to a game session's record.
   * @param {string} sessionId - The ID of the game session to update.
   * @param {any} challenge - The challenge object that has been completed.
   */
  updateGameChallenge(sessionId: string, challenge: any): void {
    try {
      const game = this.getGame(sessionId);
      if (game) {
        if (!game.challenges_completed) {
          game.challenges_completed = [];
        }
        game.challenges_completed.push({
          ...challenge,
          completed_at: new Date().toISOString(),
        });
        this.saveGame(game);
      }
    } catch (error) {
      console.error('Error updating game challenge:', error);
    }
  },

  /**
   * Adds a new event to the game session's event log.
   * @param {string} sessionId - The ID of the game session to update.
   * @param {any} event - The event object to add to the log.
   */
  addGameEvent(sessionId: string, event: any): void {
    try {
      const game = this.getGame(sessionId);
      if (game) {
        if (!game.game_events) {
          game.game_events = [];
        }
        game.game_events.push({
          ...event,
          timestamp: new Date().toISOString(),
        });
        this.saveGame(game);
      }
    } catch (error) {
      console.error('Error adding game event:', error);
    }
  },

  /**
   * Deletes a specific game session from localStorage.
   * @param {string} sessionId - The ID of the game to delete.
   */
  deleteGame(sessionId: string): void {
    try {
      const games = this.getGames();
      const filtered = games.filter((g) => g.id !== sessionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      console.log('✅ Game deleted:', sessionId);
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  },

  /**
   * Clears all game-related data from localStorage, including all sessions,
   * the current game state, and all player progress.
   */
  clearAllGames(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(GAME_STATE_KEY);
      localStorage.removeItem(PLAYER_PROGRESS_KEY);
      console.log('✅ All games cleared');
    } catch (error)
      console.error('Error clearing games:', error);
    }
  },

  /**
   * Exports all game and player progress data to a JSON string for backup purposes.
   * @returns {string} A JSON string representing the exported data. Returns an
   *                   empty object string on error.
   */
  exportGames(): string {
    try {
      const games = this.getGames();
      const progress = this.getAllPlayerProgress();
      const exportData = {
        games,
        progress,
        exported_at: new Date().toISOString(),
        version: '1.0',
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting games:', error);
      return '{}';
    }
  },

  /**
   * Imports game data from a JSON string, overwriting existing data.
   * @param {string} jsonData - The JSON string containing the game and progress data.
   * @returns {boolean} True if the import was successful, false otherwise.
   */
  importGames(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      if (importData.games) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.games));
      }
      if (importData.progress) {
        localStorage.setItem(PLAYER_PROGRESS_KEY, JSON.stringify(importData.progress));
      }
      console.log('✅ Games imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing games:', error);
      return false;
    }
  },
};