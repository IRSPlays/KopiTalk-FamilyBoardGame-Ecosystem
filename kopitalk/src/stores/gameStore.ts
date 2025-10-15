import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CustomBoard } from '../types'

// Core game state types
export interface Ingredient {
  name: string
  quantity: number
  unit: string
  collected: boolean
  collectionMethod?: 'delivery' | 'supermarket' | 'wet_market' | null
}

export interface DishChallenge {
  id: string
  dish_name: string
  description: string
  ingredients: Ingredient[]
  cooking_method: 'steam' | 'fry' | 'boil' | 'stir-fry' | 'grill' | 'bake'
  difficulty_level: 'easy' | 'medium' | 'hard'
  estimated_time: number // minutes
  cultural_context: string
  completion_reward: {
    money: number
    points: number
    cultural_knowledge: number
  }
}

export interface CompletedActivity {
  id: string
  type: 'photo' | 'story' | 'quiz' | 'digital_skills' | 'language' | 'cooking_tips' | 'market_roleplay' | 'transport' | 'healthy_eating' | 'recipe_challenge'
  timestamp: string
  earnings: number
  participants: number[] // player indices
  details: any
}

export type WeatherChallenge = {
  type: 'rain' | 'heat' | 'cny_surge' | 'hawker_closed' | 'mrt_delay'
  description: string
  active: boolean
  effects: {
    priceMultiplier?: number
    movementPenalty?: number
    closedLocations?: string[]
  }
}

export interface PlayerData {
  id: number
  name: string
  age: number
  role: 'elder' | 'youth'
  position: { x: number; y: number }
  cash: number
  ezlink_balance: number
  cultural_knowledge: number
  digital_skills: number
}

// Main game store state
interface GameState {
  // Board & Challenge
  customBoard: CustomBoard | null
  dishChallenge: DishChallenge | null
  
  // Players
  players: PlayerData[]
  
  // Economy
  family_budget: number
  ezlink_balance: number // Global family EZ-Link balance
  
  // Progression
  collectedIngredients: Ingredient[]
  completedActivities: CompletedActivity[]
  
  // Challenges
  activeWeatherChallenge: WeatherChallenge | null
  
  // Game status
  gameStarted: boolean
  gameCompleted: boolean
  cookingScore: number | null
  
  // Timestamp
  sessionStartTime: string | null
}

// Actions interface
interface GameActions {
  // Board & Challenge Setup
  setCustomBoard: (board: CustomBoard) => void
  setDishChallenge: (challenge: DishChallenge) => void
  
  // Player Management
  addPlayer: (player: PlayerData) => void
  updatePlayer: (playerId: number, updates: Partial<PlayerData>) => void
  updatePlayerPosition: (playerId: number, position: { x: number; y: number }) => void
  
  // Economy
  updateFamilyBudget: (amount: number) => void
  deductFamilyBudget: (amount: number) => boolean // returns false if insufficient funds
  updateEzlinkBalance: (amount: number) => void // Global EZ-Link balance update
  topUpEzLink: (playerId: number, amount: number) => boolean
  useEzLink: (playerId: number, amount: number) => boolean
  
  // Ingredients
  markIngredientCollected: (ingredientName: string, method: 'delivery' | 'supermarket' | 'wet_market') => void
  resetIngredients: () => void
  getAllRequiredIngredients: () => Ingredient[]
  getMissingIngredients: () => Ingredient[]
  
  // Activities
  addCompletedActivity: (activity: CompletedActivity) => void
  getTotalEarnings: () => number
  
  // Challenges
  setWeatherChallenge: (challenge: WeatherChallenge | null) => void
  clearWeatherChallenge: () => void
  
  // Game Flow
  startGame: () => void
  completeGame: (score: number) => void
  resetGame: () => void
  
  // Utilities
  canAfford: (playerId: number, amount: number) => boolean
  spendMoney: (playerId: number, amount: number) => boolean
  earnMoney: (playerId: number, amount: number) => void
}

// Combined store type
type GameStore = GameState & GameActions

// Initial state
const initialState: GameState = {
  customBoard: null,
  dishChallenge: null,
  players: [],
  family_budget: 0, // Start with zero money - must earn through activities!
  collectedIngredients: [],
  completedActivities: [],
  activeWeatherChallenge: null,
  gameStarted: false,
  gameCompleted: false,
  cookingScore: null,
  sessionStartTime: null,
}

// Create the store with persistence
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Board & Challenge Setup
      setCustomBoard: (board) => set({ customBoard: board }),
      
      setDishChallenge: (challenge) => {
        set({ 
          dishChallenge: challenge,
          collectedIngredients: challenge.ingredients.map(ing => ({
            ...ing,
            collected: false,
            collectionMethod: null
          }))
        })
      },
      
      // Player Management
      addPlayer: (player) => set(state => ({
        players: [...state.players, player]
      })),
      
      updatePlayer: (playerId, updates) => set(state => ({
        players: state.players.map(p => 
          p.id === playerId ? { ...p, ...updates } : p
        )
      })),
      
      updatePlayerPosition: (playerId, position) => set(state => ({
        players: state.players.map(p =>
          p.id === playerId ? { ...p, position } : p
        )
      })),
      
      // Economy
      updateFamilyBudget: (amount) => set(state => ({
        family_budget: Math.max(0, state.family_budget + amount)
      })),
      
      deductFamilyBudget: (amount) => {
        const state = get()
        if (state.family_budget >= amount) {
          set({ family_budget: state.family_budget - amount })
          return true
        }
        return false
      },
      
      topUpEzLink: (playerId, amount) => {
        const state = get()
        const player = state.players.find(p => p.id === playerId)
        if (player && state.family_budget >= amount) {
          set(s => ({
            family_budget: s.family_budget - amount,
            players: s.players.map(p =>
              p.id === playerId
                ? { ...p, ezlink_balance: p.ezlink_balance + amount }
                : p
            )
          }))
          return true
        }
        return false
      },
      
      useEzLink: (playerId, amount) => {
        const state = get()
        const player = state.players.find(p => p.id === playerId)
        if (player && player.ezlink_balance >= amount) {
          set(s => ({
            players: s.players.map(p =>
              p.id === playerId
                ? { ...p, ezlink_balance: p.ezlink_balance - amount }
                : p
            )
          }))
          return true
        }
        return false
      },
      
      // Ingredients
      markIngredientCollected: (ingredientName, method) => set(state => ({
        collectedIngredients: state.collectedIngredients.map(ing =>
          ing.name.toLowerCase() === ingredientName.toLowerCase()
            ? { ...ing, collected: true, collectionMethod: method }
            : ing
        )
      })),
      
      resetIngredients: () => set(state => ({
        collectedIngredients: state.dishChallenge?.ingredients.map(ing => ({
          ...ing,
          collected: false,
          collectionMethod: null
        })) || []
      })),
      
      getAllRequiredIngredients: () => {
        const state = get()
        return state.collectedIngredients
      },
      
      getMissingIngredients: () => {
        const state = get()
        return state.collectedIngredients.filter(ing => !ing.collected)
      },
      
      // Activities
      addCompletedActivity: (activity) => set(state => ({
        completedActivities: [...state.completedActivities, activity],
        family_budget: state.family_budget + activity.earnings
      })),
      
      getTotalEarnings: () => {
        const state = get()
        return state.completedActivities.reduce((sum, act) => sum + act.earnings, 0)
      },
      
      // Challenges
      setWeatherChallenge: (challenge) => set({ activeWeatherChallenge: challenge }),
      clearWeatherChallenge: () => set({ activeWeatherChallenge: null }),
      
      // Game Flow
      startGame: () => set({ 
        gameStarted: true, 
        sessionStartTime: new Date().toISOString() 
      }),
      
      completeGame: (score) => set({ 
        gameCompleted: true, 
        cookingScore: score 
      }),
      
      resetGame: () => set({ 
        ...initialState,
        customBoard: get().customBoard, // Keep the board they built
      }),
      
      // Utilities
      canAfford: (playerId, amount) => {
        const player = get().players.find(p => p.id === playerId)
        return player ? player.cash >= amount : false
      },
      
      spendMoney: (playerId, amount) => {
        const state = get()
        const player = state.players.find(p => p.id === playerId)
        if (player && player.cash >= amount) {
          set(s => ({
            players: s.players.map(p =>
              p.id === playerId
                ? { ...p, cash: p.cash - amount }
                : p
            )
          }))
          return true
        }
        return false
      },
      
      earnMoney: (playerId, amount) => set(state => ({
        players: state.players.map(p =>
          p.id === playerId
            ? { ...p, cash: p.cash + amount }
            : p
        )
      })),
    }),
    {
      name: 'singaplaygo-game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist everything except temporary UI state
        customBoard: state.customBoard,
        dishChallenge: state.dishChallenge,
        players: state.players,
        family_budget: state.family_budget,
        collectedIngredients: state.collectedIngredients,
        completedActivities: state.completedActivities,
        gameStarted: state.gameStarted,
        gameCompleted: state.gameCompleted,
        cookingScore: state.cookingScore,
        sessionStartTime: state.sessionStartTime,
      }),
    }
  )
)

// Selector hooks for better performance
export const useCustomBoard = () => useGameStore(state => state.customBoard)
export const useDishChallenge = () => useGameStore(state => state.dishChallenge)
export const usePlayers = () => useGameStore(state => state.players)
export const useFamilyBudget = () => useGameStore(state => state.family_budget)
export const useCollectedIngredients = () => useGameStore(state => state.collectedIngredients)
export const useMissingIngredients = () => useGameStore(state => state.getMissingIngredients())
export const useCompletedActivities = () => useGameStore(state => state.completedActivities)
export const useWeatherChallenge = () => useGameStore(state => state.activeWeatherChallenge)
export const useGameStatus = () => useGameStore(state => ({
  started: state.gameStarted,
  completed: state.gameCompleted,
  score: state.cookingScore
}))
