export interface GameSession {
  id: string
  difficulty: string
  family_budget: number
  family_members: FamilyMember[]
  game_phase: string
  current_player_index: number
  game_scenario: any
  challenges_completed?: any[]
  total_turns?: number
  game_events?: any[]
  created_date: string
  last_updated: string
}

export interface FamilyMember {
  name: string
  role: 'son' | 'daughter' | 'grandfather' | 'grandmother'
  position: number
  points: number
  cash: number
  money: number
  ezlink_balance: number
  ingredients?: number
  social_points?: number
  tikTokFollowers?: number
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