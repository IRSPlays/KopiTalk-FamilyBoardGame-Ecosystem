/**
 * Represents the state of a single game session.
 */
export interface GameSession {
  /** A unique identifier for the game session. */
  id: string;
  /** The selected difficulty level (e.g., 'easy', 'hard'). */
  difficulty: string;
  /** The starting budget for the family. */
  family_budget: number;
  /** An array of family members participating in the game. */
  family_members: FamilyMember[];
  /** The current phase of the game (e.g., 'setup', 'in_progress', 'finished'). */
  game_phase: string;
  /** The index of the current player in the `family_members` array. */
  current_player_index: number;
  /** The specific scenario or context for the game. */
  game_scenario: any;
  /** A list of challenges that have been completed. */
  challenges_completed?: any[];
  /** The total number of turns taken in the game. */
  total_turns?: number;
  /** A log of significant events that have occurred during the game. */
  game_events?: any[];
  /** The timestamp when the game session was created. */
  created_date: string;
  /** The timestamp when the game session was last updated. */
  last_updated: string;
}

/**
 * Represents a single family member within the game.
 */
export interface FamilyMember {
  /** The name of the family member. */
  name: string;
  /** The role of the family member within the family. */
  role: 'son' | 'daughter' | 'grandfather' | 'grandmother';
  /** The current position of the member on the game board. */
  position: number;
  /** The number of points accumulated by the member. */
  points: number;
  /** The amount of cash the member is holding. */
  cash: number;
  /** An alias for cash, potentially for different contexts. */
  money: number;
  /** The balance on the member's EZ-Link card for transport. */
  ezlink_balance: number;
  /** The quantity of ingredients held by the member. */
  ingredients?: number;
  /** Points related to social interactions or challenges. */
  social_points?: number;
  /** The number of followers on the TikTok platform. */
  tikTokFollowers?: number;
}

/**
 * Represents a market where players can buy items.
 */
export interface Market {
  /** A unique identifier for the market. */
  id: string;
  /** The name of the market. */
  name: string;
  /** The type of market. */
  type: 'supermarket' | 'wet_market' | 'online';
  /** A measure of item availability or stock levels. */
  availability: number;
  /** A multiplier affecting the prices of items in this market. */
  pricing_multiplier: number;
  /** The length of the queue, potentially affecting time costs. */
  queue_length: number;
  /** Any special rules or conditions that apply to this market. */
  special_conditions: string[];
}

/**
 * Represents a trending challenge or topic on TikTok.
 */
export interface TikTokTrend {
  /** A unique identifier for the trend. */
  id: string;
  /** The name of the trend. */
  name: string;
  /** The difficulty level of participating in the trend. */
  difficulty: 'easy' | 'medium' | 'hard';
  /** The minimum potential earnings from this trend. */
  min_earnings: number;
  /** The maximum potential earnings from this trend. */
  max_earnings: number;
  /** A brief description of the trend. */
  description: string;
}

// Challenge System Types
/**
 * Defines the structure for a game challenge.
 */
export interface Challenge {
  /** A unique identifier for the challenge. */
  id: string;
  /** The category of the challenge. */
  type: 'delivery' | 'cooking' | 'transport' | 'general' | 'tiktok' | 'social';
  /** The title of the challenge. */
  title: string;
  /** A detailed description of the challenge objectives. */
  description: string;
  /** The target value or goal to complete the challenge. */
  target: number;
  /** The current progress towards the target. */
  current: number;
  /** An array of specific requirements to fulfill the challenge. */
  requirements?: ChallengeRequirement[];
  /** The reward granted upon successful completion of the challenge. */
  reward: ChallengeReward;
  /** The difficulty level of the challenge. */
  difficulty: 'easy' | 'medium' | 'hard';
  /** An optional time limit for the challenge, in minutes. */
  time_limit?: number;
  /** A flag indicating if multiple family members must cooperate. */
  family_cooperation_required: boolean;
  /** The current status of the challenge. */
  status: 'pending' | 'active' | 'completed' | 'failed';
  /** A boolean indicating if the challenge has been completed. */
  isCompleted: boolean;
  /** The timestamp when the challenge was created. */
  created_at: string;
  /** The timestamp when the challenge was completed, if applicable. */
  completed_at?: string;
}

/**
 * Represents a single, specific requirement within a challenge.
 */
export interface ChallengeRequirement {
  /** The type of the requirement. */
  type: 'ingredient' | 'location' | 'action' | 'time' | 'money';
  /** A description of what is required. */
  description: string;
  /** The target value or state for this requirement. */
  target: string | number;
  /** The current value or state of this requirement. */
  current?: string | number;
  /** A flag indicating if this specific requirement has been met. */
  completed: boolean;
}

/**
 * Defines the rewards for completing a challenge.
 */
export interface ChallengeReward {
  /** The amount of money awarded. */
  money?: number;
  /** The number of points awarded. */
  points?: number;
  /** The number of extra spaces to move on the board. */
  movement?: number;
  /** A feature or ability unlocked by this reward. */
  unlock_feature?: string;
  /** A special, non-standard bonus. */
  special_bonus?: string;
}

// TikTok Money System Types
/**
 * Represents the financial account for a user within the TikTok mini-game.
 */
export interface TikTokMoney {
  /** The unique identifier of the user this account belongs to. */
  user_id: string;
  /** The total amount of money earned through TikTok challenges. */
  total_earned: number;
  /** The total amount of money spent. */
  total_spent: number;
  /** The current available balance. */
  current_balance: number;
  /** A history of all earnings. */
  earning_history: TikTokEarning[];
  /** A history of all spending. */
  spending_history: TikTokSpending[];
}

/**
 * Represents a single instance of earning money from a TikTok challenge.
 */
export interface TikTokEarning {
  /** A unique identifier for this earning event. */
  id: string;
  /** The ID of the challenge that generated these earnings. */
  challenge_id: string;
  /** The amount of money earned. */
  amount: number;
  /** An optional URL to the TikTok video that was created. */
  video_url?: string;
  /** A score representing the creativity of the video. */
  creativity_score: number;
  /** A flag indicating if other family members participated. */
  family_participation: boolean;
  /** The timestamp when the money was earned. */
  earned_at: string;
}

/**
 * Represents a single instance of spending money earned from TikTok.
 */
export interface TikTokSpending {
  /** A unique identifier for this spending event. */
  id:string;
  /** The amount of money spent. */
  amount: number;
  /** A description of what the money was spent on. */
  description: string;
  /** The category of the spending. */
  category: 'delivery' | 'cooking' | 'transport' | 'other';
  /** An optional ID for the transaction. */
  transaction_id?: string;
  /** The timestamp when the money was spent. */
  spent_at: string;
}

// Delivery Challenge Types
/**
 * Extends the base `Challenge` interface for delivery-specific tasks.
 */
export interface DeliveryChallenge extends Challenge {
  /** Specifies the challenge type as 'delivery'. */
  type: 'delivery';
  /** An array of shops that must be visited and items that must be purchased. */
  shop_requirements: ShopRequirement[];
  /** The final location where the delivery must be completed. */
  delivery_location: string;
  /** A flag indicating if a time-based bonus is available. */
  time_bonus_available: boolean;
  /** A multiplier for ingredient-related rewards or points. */
  ingredient_multiplier: number;
}

/**
 * Defines the requirements for a single shop visit within a delivery challenge.
 */
export interface ShopRequirement {
  /** The unique identifier for the shop. */
  shop_id: string;
  /** The name of the shop. */
  shop_name: string;
  /** A list of items that must be purchased from this shop. */
  required_items: RequiredItem[];
  /** The maximum amount of money that can be spent at this shop. */
  budget_limit: number;
  /** The distance of the shop from the starting point, affecting travel time or cost. */
  distance_from_start: number;
}

/**
 * Represents a single item that needs to be acquired during a delivery challenge.
 */
export interface RequiredItem {
  /** The name of the item. */
  name: string;
  /** The required quantity of the item. */
  quantity: number;
  /** The estimated cost of the item, for planning purposes. */
  estimated_cost: number;
  /** A list of alternative items that can be substituted. */
  alternatives?: string[];
  /** A flag indicating whether the item has been successfully acquired. */
  found: boolean;
  /** The actual cost of the item, recorded after purchase. */
  actual_cost?: number;
}

// Enhanced Game Session Types
/**
 * Extends the base `GameSession` with additional features for more complex
 * gameplay, including challenges and the TikTok mini-game.
 */
export interface EnhancedGameSession extends GameSession {
  /** An array of all challenges available or active in the session. */
  challenges?: Challenge[];
  /** An array of TikTok money accounts, typically one per player. */
  tiktok_money?: TikTokMoney[];
  /** The current phase of the challenge system within the game. */
  challenge_phase: 'pre_game' | 'during_game' | 'post_game';
  /** The ID of the currently active challenge. */
  active_challenge_id?: string;
  /** The percentage of challenges that have been successfully completed. */
  challenge_completion_rate: number;
  /** A score representing how well the family is cooperating on challenges. */
  family_cooperation_score: number;
  /** A list of achievements unlocked during the session. */
  achievements?: string[];
  /** The total value of all rewards earned. */
  totalRewards?: number;
  /** The number of consecutive play sessions or completed challenges. */
  streakCount?: number;
  /** The date of the last time the game was played. */
  lastPlayDate?: string;
  /** An array of family members, duplicating the base session for easier access. */
  players: FamilyMember[];
}

// Singapore Life Module Types
/**
 * Defines the valid types for different "Singapore Life" mini-game modules.
 */
export type SingaporeLifeModuleType = 'delivery' | 'cooking' | 'transport' | 'ezlink';

// UI Component Types
/**
 * Defines the props for the `CollapsibleChallenge` component.
 */
export interface CollapsibleChallengeProps {
  /** The challenge object to display. */
  challenge: Challenge;
  /** A boolean to control whether the component is collapsed or expanded. */
  isCollapsed: boolean;
  /** A callback function to toggle the collapsed state. */
  onToggle: () => void;
  /** An optional callback for when the challenge is started. */
  onStart?: () => void;
  /** An optional callback for when the challenge is completed. */
  onComplete?: () => void;
  /** An optional callback for when the challenge is failed. */
  onFail?: () => void;
}

/**
 * Defines the props for the `ChallengeProgress` component.
 */
export interface ChallengeProgressProps {
  /** The challenge whose progress is being displayed. */
  challenge: Challenge;
  /** A callback function to update the progress of a specific requirement. */
  onRequirementUpdate: (requirementId: string, progress: number | string) => void;
}

// Integration Types
/**
 * Represents the data structure for the checkout integration, summarizing costs
 * and payment options.
 */
export interface CheckoutIntegration {
  /** The total cost of the items or services being purchased. */
  total_cost: number;
  /** The total amount of TikTok money available to the user. */
  tiktok_money_available: number;
  /** The amount of TikTok money being used for this transaction. */
  tiktok_money_used: number;
  /** The remaining balance to be paid after applying TikTok money. */
  remaining_payment: number;
  /** An array of available payment methods. */
  payment_methods: PaymentMethod[];
}

/**
 * Represents a single method of payment available at checkout.
 */
export interface PaymentMethod {
  /** The type of payment method. */
  type: 'tiktok_money' | 'family_budget' | 'ezlink' | 'cash';
  /** The amount to be paid with this method. */
  amount: number;
  /** A flag indicating if this payment method is available for use. */
  available: boolean;
}