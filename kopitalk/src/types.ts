export interface GameSession {
  id: string
  difficulty: string
  family_budget: number // Starts at $0 - earned through activities
  family_members: FamilyMember[]
  game_phase: string
  // REMOVED: current_player_index - No turn-based system, roleplay is continuous
  game_scenario: any
  challenges_completed?: any[]
  game_events?: any[]
  created_date: string
  last_updated: string
  // NEW: D.I.Y. board configuration
  custom_board?: CustomBoard
  // NEW: AI-generated dish challenge
  main_dish_challenge?: DishChallenge
}

export interface FamilyMember {
  name: string
  role: 'son' | 'daughter' | 'grandfather' | 'grandmother' | 'parent' | 'child' | 'youth' | 'elderly'
  position: number // Position on custom D.I.Y. board
  points: number
  cash: number // Starts at $0 - earned through activities
  money: number // Starts at $0 - earned through activities
  ezlink_balance: number // Separate from main money - for MRT/Bus only
  ingredients?: number
  social_points?: number
  tikTokFollowers?: number
  // NEW: Track player's contribution to roleplay
  conversation_contributions?: number
  cultural_knowledge_score?: number
}

export interface Market {
  id: string
  name: string
  type: 'supermarket' | 'wet_market' | 'online'
  availability: number
  pricing_multiplier: number
  queue_length: number
  special_conditions: string[]
}

export interface TikTokTrend {
  id: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard'
  min_earnings: number
  max_earnings: number
  description: string
}

// Challenge System Types
export interface Challenge {
  id: string
  type: 'delivery' | 'cooking' | 'transport' | 'general' | 'tiktok' | 'social'
  title: string
  description: string
  target: number
  current: number
  requirements?: ChallengeRequirement[]
  reward: ChallengeReward
  difficulty: 'easy' | 'medium' | 'hard'
  time_limit?: number // in minutes
  family_cooperation_required: boolean
  status: 'pending' | 'active' | 'completed' | 'failed'
  isCompleted: boolean
  created_at: string
  completed_at?: string
}

export interface ChallengeRequirement {
  type: 'ingredient' | 'location' | 'action' | 'time' | 'money'
  description: string
  target: string | number
  current?: string | number
  completed: boolean
}

export interface ChallengeReward {
  money?: number
  points?: number
  movement?: number
  unlock_feature?: string
  special_bonus?: string
}

// TikTok Money System Types
export interface TikTokMoney {
  user_id: string
  total_earned: number
  total_spent: number
  current_balance: number
  earning_history: TikTokEarning[]
  spending_history: TikTokSpending[]
}

export interface TikTokEarning {
  id: string
  challenge_id: string
  amount: number
  video_url?: string
  creativity_score: number
  family_participation: boolean
  earned_at: string
}

export interface TikTokSpending {
  id: string
  amount: number
  description: string
  category: 'delivery' | 'cooking' | 'transport' | 'other'
  transaction_id?: string
  spent_at: string
}

// Delivery Challenge Types
export interface DeliveryChallenge extends Challenge {
  type: 'delivery'
  shop_requirements: ShopRequirement[]
  delivery_location: string
  time_bonus_available: boolean
  ingredient_multiplier: number
}

export interface ShopRequirement {
  shop_id: string
  shop_name: string
  required_items: RequiredItem[]
  budget_limit: number
  distance_from_start: number
}

export interface RequiredItem {
  name: string
  quantity: number
  estimated_cost: number
  alternatives?: string[]
  found: boolean
  actual_cost?: number
}

// Enhanced Game Session Types
export interface EnhancedGameSession extends GameSession {
  challenges?: Challenge[]
  tiktok_money?: TikTokMoney[]
  challenge_phase: 'pre_game' | 'during_game' | 'post_game'
  active_challenge_id?: string
  challenge_completion_rate: number
  family_cooperation_score: number
  achievements?: string[]
  totalRewards?: number
  streakCount?: number
  lastPlayDate?: string
  players: FamilyMember[]
}

// Singapore Life Module Types
export type SingaporeLifeModuleType = 'delivery' | 'cooking' | 'transport' | 'ezlink'

// UI Component Types
export interface CollapsibleChallengeProps {
  challenge: Challenge
  isCollapsed: boolean
  onToggle: () => void
  onStart?: () => void
  onComplete?: () => void
  onFail?: () => void
}

export interface ChallengeProgressProps {
  challenge: Challenge
  onRequirementUpdate: (requirementId: string, progress: number | string) => void
}

// Integration Types
export interface CheckoutIntegration {
  total_cost: number
  tiktok_money_available: number
  tiktok_money_used: number
  remaining_payment: number
  payment_methods: PaymentMethod[]
}

export interface PaymentMethod {
  type: 'tiktok_money' | 'family_budget' | 'ezlink' | 'cash'
  amount: number
  available: boolean
}

// D.I.Y. Board Building Types
export interface CustomBoard {
  id: string
  name: string
  grid_size: { width: number; height: number } // e.g., 10x10 grid
  tiles: BoardTile[]
  created_at: string
}

export interface BoardTile {
  id: string
  type: 'start' | 'market' | 'wet_market' | 'mrt' | 'bus_stop' | 'cooking_station' | 'photo_spot' | 'challenge' | 'empty'
  position: { x: number; y: number }
  properties?: {
    name?: string
    icon?: string
    action?: string
    reward?: number
  }
}

// AI-Generated Dish Challenge Types
export interface DishChallenge {
  id: string
  dish_name: string
  dish_type: 'singapore_traditional' | 'fusion' | 'hawker' | 'heritage'
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  ingredients: Ingredient[]
  cooking_method: 'steam' | 'fry' | 'boil' | 'bake' | 'stir_fry' | 'grill'
  cooking_steps: string[]
  cultural_context: string
  estimated_time: number // in minutes
  affected_by_weather?: boolean
  affected_by_price?: boolean
  completion_reward: {
    money: number
    points: number
    cultural_knowledge: number
  }
}

export interface Ingredient {
  name: string
  quantity: string
  unit: string
  category: 'vegetable' | 'meat' | 'seafood' | 'spice' | 'sauce' | 'grain' | 'other'
  is_collected: boolean
  source?: 'supermarket' | 'wet_market' | 'delivery' | 'already_owned'
  estimated_cost: number
  actual_cost?: number
}

// Conversation Topic Suggestion Types
export interface ConversationTopic {
  id: string
  topic: string
  category: 'cooking' | 'family' | 'culture' | 'technology' | 'tradition' | 'singapore_life'
  difficulty: 'easy' | 'medium' | 'hard'
  tailored_for_role?: 'elderly' | 'youth' | 'parent' | 'child'
  expected_movement_range: { min: number; max: number } // tiles (1-5)
  prompts: string[]
}

// Money Earning Activity Types
export interface MoneyEarningActivity {
  id: string
  name: string
  type: 'photo_challenge' | 'story_sharing' | 'recipe_guessing' | 'digital_payment_sim' | 'cultural_quiz' | 'cooking_tips' | 'market_bargaining' | 'transport_navigation' | 'healthy_eating' | 'language_exchange'
  description: string
  requires_collaboration: boolean
  reward: number
  difficulty: 'easy' | 'medium' | 'hard'
  completion_criteria: string
  creates_common_ground: string // How it bridges generations
}

// Roleplay State Types
export interface RoleplayState {
  active_players: string[] // Player IDs actively participating
  current_location: string // Current board position description
  ongoing_activities: string[]
  collaborative_score: number // 0-100
  conversation_quality: number // 0-100
}