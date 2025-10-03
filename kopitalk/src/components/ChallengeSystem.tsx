import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameSession } from '../types'
import { 
  Trophy, Clock, Users, Star, Gift, CheckCircle, 
  AlertCircle, Zap, Target, Heart, ChefHat, Package,
  Bus, CreditCard, MapPin, Sparkles, DollarSign, ArrowRight
} from 'lucide-react'

/**
 * Represents a single in-game challenge with all its properties and state.
 */
export interface Challenge {
  /** A unique identifier for the challenge. */
  id: string;
  /** The category of the challenge. */
  type: 'delivery' | 'cooking' | 'transport' | 'general' | 'tiktok' | 'family';
  /** The game phase during which this challenge is available. */
  phase: 'pre_game' | 'during_game' | 'post_game';
  /** The title of the challenge. */
  title: string;
  /** A detailed description of the challenge's objectives. */
  description: string;
  /** Text explaining the challenge's relevance to Singaporean culture. */
  culturalContext: string;
  /** An array of specific tasks required to complete the challenge. */
  requirements: ChallengeRequirement[];
  /** The rewards granted upon completion. */
  rewards: ChallengeReward;
  /** An optional time limit in seconds. */
  timeLimit?: number;
  /** The difficulty level of the challenge. */
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  /** A flag indicating if multiple players must cooperate. */
  familyCooperationRequired: boolean;
  /** The current status of the challenge. */
  status: 'available' | 'active' | 'completed' | 'failed';
  /** The completion progress of the challenge, as a percentage. */
  progress: number;
  /** A list of player names who completed the challenge. */
  completedBy?: string[];
  /** The timestamp when the challenge was started. */
  startedAt?: string;
  /** The timestamp when the challenge was completed. */
  completedAt?: string;
}

/**
 * Represents a single requirement or task within a challenge.
 */
interface ChallengeRequirement {
  /** The type of action or item required. */
  type: 'ingredient' | 'location' | 'action' | 'time' | 'money' | 'conversation' | 'video';
  /** A description of the requirement. */
  description: string;
  /** The target value or state needed to fulfill the requirement. */
  target: string | number;
  /** A flag indicating if this requirement has been met. */
  completed: boolean;
  /** The current progress towards the target, if applicable. */
  progress?: number;
}

/**
 * Defines the structure of rewards given for completing a challenge.
 */
interface ChallengeReward {
  /** The amount of in-game money awarded. */
  money: number;
  /** The number of points awarded. */
  points: number;
  /** The number of bonus spaces to move on the board. */
  movement: number;
  /** A list of skills improved or acquired. */
  skills: string[];
  /** The amount of cultural knowledge points gained. */
  culturalKnowledge: number;
  /** A bonus score for family bonding. */
  familyBondingBonus: number;
  /** A list of any special features or items unlocked. */
  specialUnlocks?: string[];
}

/**
 * Props for the ChallengeSystem component.
 */
interface Props {
  /** The current game session data. */
  gameSession: GameSession;
  /** A callback function to update the main game session state. */
  onUpdateGame: (updates: Partial<GameSession>) => void;
  /** A callback invoked when a challenge is successfully completed. */
  onCompleteChallenge: (challengeId: string, rewards: ChallengeReward) => void;
}

/**
 * A component that manages the lifecycle of in-game challenges, including their
 * generation, activation, progress tracking, and completion.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} The rendered challenge system UI.
 */
const ChallengeSystem: React.FC<Props> = ({ gameSession, onUpdateGame, onCompleteChallenge }) => {
  /** State to hold the list of challenges currently in progress. */
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  /** State for challenges that are available to be started. */
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  /** State for challenges that have been successfully completed. */
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  /** State to hold the currently selected challenge for detailed view. */
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  /**
   * Generates a static list of predefined challenges for the game.
   * In a real application, this might fetch challenges from a server or use a more
   * dynamic generation algorithm.
   * @returns {Challenge[]} An array of challenge objects.
   */
  const generateChallenges = (): Challenge[] => {
    const challenges: Challenge[] = [
      // Delivery Challenges
      {
        id: 'sg_delivery_hawker',
        type: 'delivery',
        phase: 'during_game',
        title: 'Hawker Center Delivery Challenge',
        description: 'Order and deliver authentic hawker food to family members across Singapore',
        culturalContext: 'Experience Singapore\'s vibrant hawker culture and food delivery ecosystem',
        requirements: [
          { type: 'action', description: 'Visit Delivery App', target: 'complete_delivery_task', completed: false },
          { type: 'money', description: 'Spend at least $25 on food delivery', target: 25, completed: false },
          { type: 'location', description: 'Order from 3 different hawker centers', target: 3, completed: false, progress: 0 }
        ],
        rewards: {
          money: 15,
          points: 25,
          movement: 2,
          skills: ['Local Cuisine', 'Digital Ordering', 'Logistics Planning'],
          culturalKnowledge: 20,
          familyBondingBonus: 15,
          specialUnlocks: ['Hawker Heritage Badge']
        },
        difficultyLevel: 'medium',
        familyCooperationRequired: true,
        status: 'available',
        progress: 0,
        timeLimit: 1800 // 30 minutes
      },

      // Cooking Challenges
      {
        id: 'sg_heritage_recipes',
        type: 'cooking',
        phase: 'pre_game',
        title: 'Grandma\'s Secret Recipe Revival',
        description: 'Learn and cook a traditional Singaporean dish with family guidance',
        culturalContext: 'Preserve culinary heritage by learning recipes passed down through generations',
        requirements: [
          { type: 'action', description: 'Access Cooking Game module', target: 'open_cooking_app', completed: false },
          { type: 'conversation', description: 'Record family cooking story', target: 'family_recipe_discussion', completed: false },
          { type: 'action', description: 'Complete recipe step-by-step', target: 'finish_cooking_challenge', completed: false }
        ],
        rewards: {
          money: 5,
          points: 35,
          movement: 1,
          skills: ['Culinary Heritage', 'Family Traditions', 'Cooking Techniques'],
          culturalKnowledge: 30,
          familyBondingBonus: 25,
          specialUnlocks: ['Heritage Chef Badge', 'Family Recipe Collection']
        },
        difficultyLevel: 'hard',
        familyCooperationRequired: true,
        status: 'available',
        progress: 0
      },

      // Transport Challenges
      {
        id: 'sg_transport_master',
        type: 'transport',
        phase: 'during_game',
        title: 'Singapore Transport Navigator',
        description: 'Plan and execute efficient multi-modal transport routes across Singapore',
        culturalContext: 'Master Singapore\'s world-class public transport system',
        requirements: [
          { type: 'action', description: 'Use Bus Timing app', target: 'check_bus_schedules', completed: false },
          { type: 'location', description: 'Plan route using MRT and bus', target: 'multimodal_journey', completed: false },
          { type: 'money', description: 'Manage EZ-Link balance efficiently', target: 'ezlink_optimization', completed: false }
        ],
        rewards: {
          money: 0,
          points: 20,
          movement: 4,
          skills: ['Navigation', 'Urban Planning', 'Time Management'],
          culturalKnowledge: 25,
          familyBondingBonus: 10,
          specialUnlocks: ['Transport Expert Badge']
        },
        difficultyLevel: 'medium',
        familyCooperationRequired: false,
        status: 'available',
        progress: 0
      },

      // TikTok/Cultural Challenges
      {
        id: 'sg_cultural_content',
        type: 'tiktok',
        phase: 'during_game',
        title: 'Singapore Heritage Creator',
        description: 'Create engaging content showcasing Singapore\'s unique culture',
        culturalContext: 'Share Singapore\'s rich cultural diversity through modern media',
        requirements: [
          { type: 'video', description: 'Record Singapore culture TikTok', target: 'cultural_video_creation', completed: false },
          { type: 'conversation', description: 'Include family members in content', target: 'intergenerational_content', completed: false },
          { type: 'action', description: 'Achieve creativity score above 80', target: 80, completed: false }
        ],
        rewards: {
          money: 30,
          points: 40,
          movement: 2,
          skills: ['Content Creation', 'Cultural Awareness', 'Digital Marketing'],
          culturalKnowledge: 35,
          familyBondingBonus: 30,
          specialUnlocks: ['Cultural Ambassador Badge', 'Viral Content Creator']
        },
        difficultyLevel: 'expert',
        familyCooperationRequired: true,
        status: 'available',
        progress: 0
      },

      // Family Bonding Challenges
      {
        id: 'sg_family_stories',
        type: 'family',
        phase: 'pre_game',
        title: 'Singapore Stories Across Generations',
        description: 'Share and document family stories about life in Singapore',
        culturalContext: 'Preserve family history and Singapore\'s transformation over generations',
        requirements: [
          { type: 'conversation', description: 'Record 10-minute family discussion', target: 600, completed: false },
          { type: 'action', description: 'Share stories from different decades', target: 'multigenerational_stories', completed: false },
          { type: 'conversation', description: 'Achieve family bonding score above 90', target: 90, completed: false }
        ],
        rewards: {
          money: 10,
          points: 50,
          movement: 3,
          skills: ['Family History', 'Storytelling', 'Cultural Preservation'],
          culturalKnowledge: 40,
          familyBondingBonus: 50,
          specialUnlocks: ['Family Historian Badge', 'Singapore Memory Keeper']
        },
        difficultyLevel: 'medium',
        familyCooperationRequired: true,
        status: 'available',
        progress: 0
      },

      // Advanced Integration Challenge
      {
        id: 'sg_life_master',
        type: 'general',
        phase: 'post_game',
        title: 'Singapore Life Master Challenge',
        description: 'Complete all aspects of Singapore living in one comprehensive challenge',
        culturalContext: 'Demonstrate mastery of modern Singapore life skills',
        requirements: [
          { type: 'action', description: 'Complete all feature modules', target: 'all_modules_complete', completed: false },
          { type: 'money', description: 'Manage $100 budget efficiently', target: 100, completed: false },
          { type: 'conversation', description: 'Record reflective family discussion', target: 'reflection_session', completed: false },
          { type: 'action', description: 'Achieve 95% cultural knowledge', target: 95, completed: false }
        ],
        rewards: {
          money: 50,
          points: 100,
          movement: 5,
          skills: ['Singapore Mastery', 'Life Skills', 'Cultural Fluency', 'Family Leadership'],
          culturalKnowledge: 50,
          familyBondingBonus: 75,
          specialUnlocks: ['Singapore Life Master', 'Cultural Bridge Builder', 'Family Game Champion']
        },
        difficultyLevel: 'expert',
        familyCooperationRequired: true,
        status: 'available',
        progress: 0
      }
    ]

    return challenges
  }

  /**
   * Effect hook to generate the list of available challenges when the component
   * mounts or the game session changes.
   */
  useEffect(() => {
    const challenges = generateChallenges();
    setAvailableChallenges(challenges.filter((c) => c.status === 'available'));
  }, [gameSession]);

  /**
   * Starts a challenge, moving it from the available list to the active list.
   * @param {Challenge} challenge - The challenge object to start.
   */
  const startChallenge = (challenge: Challenge) => {
    const updatedChallenge = {
      ...challenge,
      status: 'active' as const,
      startedAt: new Date().toISOString(),
    };

    setActiveChallenges((prev) => [...prev, updatedChallenge]);
    setAvailableChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
    setSelectedChallenge(updatedChallenge);
  };

  /**
   * Updates the progress of a specific requirement within an active challenge.
   * It recalculates the overall challenge progress based on completed requirements.
   * @param {string} challengeId - The ID of the challenge to update.
   * @param {number} requirementIndex - The index of the requirement to update.
   * @param {boolean | number} progress - The new progress value (boolean for completion, number for partial progress).
   */
  const updateChallengeProgress = (challengeId: string, requirementIndex: number, progress: boolean | number) => {
    setActiveChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.id !== challengeId) return challenge;

        const updatedRequirements = [...challenge.requirements];
        if (typeof progress === 'boolean') {
          updatedRequirements[requirementIndex].completed = progress;
        } else {
          updatedRequirements[requirementIndex].progress = progress;
          updatedRequirements[requirementIndex].completed =
            progress >= (updatedRequirements[requirementIndex].target as number);
        }

        const overallProgress = (updatedRequirements.filter((r) => r.completed).length / updatedRequirements.length) * 100;

        return {
          ...challenge,
          requirements: updatedRequirements,
          progress: overallProgress,
        };
      }),
    );
  };

  /**
   * Marks a challenge as complete, moves it to the completed list, and triggers
   * the `onCompleteChallenge` callback to grant rewards.
   * @param {string} challengeId - The ID of the challenge to complete.
   */
  const completeChallenge = (challengeId: string) => {
    const challenge = activeChallenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const completedChallenge = {
      ...challenge,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
      completedBy: gameSession.family_members.map((m) => m.name),
    };

    setActiveChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    setCompletedChallenges((prev) => [...prev, completedChallenge]);

    onCompleteChallenge(challengeId, challenge.rewards);

    // Show completion notification
    alert(
      `🎉 Challenge Complete!\n\n"${challenge.title}"\n\n🏆 Rewards:\n💰 $${challenge.rewards.money}\n⭐ ${challenge.rewards.points} points\n🚀 +${challenge.rewards.movement} spaces\n📚 Skills: ${challenge.rewards.skills.join(', ')}\n🏛️ Cultural Knowledge: +${challenge.rewards.culturalKnowledge}%\n❤️ Family Bonding: +${challenge.rewards.familyBondingBonus}`,
    );
  };

  /**
   * Returns the appropriate Lucide icon component for a given challenge type.
   * @param {Challenge['type']} type - The type of the challenge.
   * @returns {React.ElementType} The corresponding icon component.
   */
  const getChallengeTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'delivery':
        return Package;
      case 'cooking':
        return ChefHat;
      case 'transport':
        return Bus;
      case 'tiktok':
        return Star;
      case 'family':
        return Heart;
      default:
        return Trophy;
    }
  };

  /**
   * Returns Tailwind CSS classes for styling a difficulty badge.
   * @param {string} difficulty - The difficulty level of the challenge.
   * @returns {string} The CSS classes for styling the badge.
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'expert':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Challenge Summary */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl p-4 sm:p-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          Singapore Life Challenges
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="text-xl sm:text-2xl font-bold">{availableChallenges.length}</div>
            <div className="text-xs sm:text-sm opacity-90">Available</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="text-xl sm:text-2xl font-bold">{activeChallenges.length}</div>
            <div className="text-xs sm:text-sm opacity-90">Active</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="text-xl sm:text-2xl font-bold">{completedChallenges.length}</div>
            <div className="text-xs sm:text-sm opacity-90">Completed</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Active Challenges */}
      <AnimatePresence>
      {activeChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            Active Challenges
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {activeChallenges.map((challenge, index) => {
              const Icon = getChallengeTypeIcon(challenge.type)
              return (
                <motion.div 
                  key={challenge.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-blue-200 touch-manipulation"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base sm:text-lg text-gray-900 break-words">{challenge.title}</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1 break-words">{challenge.description}</p>
                        <p className="text-blue-600 text-xs mt-2 italic break-words">{challenge.culturalContext}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${getDifficultyColor(challenge.difficultyLevel)}`}>
                        {challenge.difficultyLevel.toUpperCase()}
                      </div>
                      <div className="mt-2 text-xs sm:text-sm text-gray-500">
                        {Math.round(challenge.progress)}% Complete
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${challenge.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm sm:text-base text-gray-800 mb-2">Requirements:</h5>
                    <div className="space-y-2">
                      {challenge.requirements.map((req, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`flex items-center gap-2 p-2 rounded-lg ${req.completed ? 'bg-green-50' : 'bg-gray-50'}`}
                        >
                          {req.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0" />
                          )}
                          <span className={`text-xs sm:text-sm flex-1 break-words ${req.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                            {req.description}
                          </span>
                          {req.progress && typeof req.target === 'number' && (
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {req.progress}/{req.target}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Rewards Preview */}
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h5 className="font-semibold text-xs sm:text-sm text-yellow-800 mb-2 flex items-center gap-1">
                      <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                      Completion Rewards:
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <span className="flex items-center gap-1 text-green-600">
                        <DollarSign className="w-3 h-3" />
                        ${challenge.rewards.money}
                      </span>
                      <span className="flex items-center gap-1 text-purple-600">
                        <Trophy className="w-3 h-3" />
                        {challenge.rewards.points}pts
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <ArrowRight className="w-3 h-3" />
                        +{challenge.rewards.movement}
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <Heart className="w-3 h-3" />
                        +{challenge.rewards.familyBondingBonus}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {challenge.progress === 100 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => completeChallenge(challenge.id)}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-all font-medium touch-manipulation"
                      >
                        ✓ Complete Challenge
                      </motion.button>
                    )}
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-all touch-manipulation"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Available Challenges */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          Available Challenges
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {availableChallenges.map(challenge => {
            const Icon = getChallengeTypeIcon(challenge.type)
            return (
              <div key={challenge.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:border-gray-300 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">{challenge.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
                    <p className="text-blue-600 text-xs mt-2 italic">{challenge.culturalContext}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficultyLevel)}`}>
                    {challenge.difficultyLevel.toUpperCase()}
                  </div>
                </div>

                {/* Quick rewards preview */}
                <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                    <span>${challenge.rewards.money}</span>
                    <span>{challenge.rewards.points}pts</span>
                    <span>+{challenge.rewards.movement}</span>
                    <span>{challenge.requirements.length} tasks</span>
                  </div>
                </div>

                {/* Family cooperation indicator */}
                {challenge.familyCooperationRequired && (
                  <div className="mb-4 p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-orange-700 text-xs font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Requires Family Cooperation
                    </span>
                  </div>
                )}

                <button
                  onClick={() => startChallenge(challenge)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
                >
                  Start Challenge
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Completed Challenges
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {completedChallenges.map(challenge => {
              const Icon = getChallengeTypeIcon(challenge.type)
              return (
                <div key={challenge.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 text-sm">{challenge.title}</h4>
                      <p className="text-green-700 text-xs">
                        Completed {challenge.completedAt && new Date(challenge.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {challenge.rewards.specialUnlocks && (
                    <div className="mt-2">
                      {challenge.rewards.specialUnlocks.map(unlock => (
                        <span key={unlock} className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full mr-1 mb-1">
                          🏆 {unlock}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChallengeSystem