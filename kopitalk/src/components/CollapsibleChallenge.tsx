import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, Trophy, Users, Star, CheckCircle, Play, AlertCircle } from 'lucide-react'
import { Challenge, ChallengeRequirement } from '../types'

interface CollapsibleChallengeProps {
  challenge: Challenge
  isCollapsed: boolean
  onToggle: () => void
  onStart?: () => void
  onComplete?: () => void
  onFail?: () => void
  onRequirementUpdate?: (requirementIndex: number, completed: boolean) => void
}

const CollapsibleChallenge: React.FC<CollapsibleChallengeProps> = ({
  challenge,
  isCollapsed,
  onToggle,
  onStart,
  onComplete,
  onFail,
  onRequirementUpdate
}) => {
  const [localRequirements, setLocalRequirements] = useState<ChallengeRequirement[]>(
    challenge.requirements || []
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery': return '🚚'
      case 'cooking': return '👨‍🍳'
      case 'transport': return '🚌'
      case 'tiktok': return '📱'
      default: return '🎯'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-600 bg-gray-100'
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleRequirementToggle = (index: number) => {
    const updated = [...localRequirements]
    updated[index].completed = !updated[index].completed
    setLocalRequirements(updated)
    onRequirementUpdate?.(index, updated[index].completed)
  }

  const completedRequirements = localRequirements.filter(req => req.completed).length
  const totalRequirements = localRequirements.length
  const progressPercentage = totalRequirements > 0 ? (completedRequirements / totalRequirements) * 100 : 0

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Challenge Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(challenge.type)}</span>
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                {challenge.title}
                {challenge.family_cooperation_required && (
                  <Users className="w-4 h-4 text-purple-500" aria-label="Family Cooperation Required" />
                )}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                  {challenge.status}
                </span>
                {challenge.time_limit && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {challenge.time_limit}m
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Progress Indicator */}
            {totalRequirements > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {completedRequirements}/{totalRequirements}
                </span>
              </div>
            )}
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="border-t border-gray-100">
          {/* Challenge Description */}
          <div className="p-4 bg-gray-50">
            <p className="text-gray-700 mb-3">{challenge.description}</p>
            
            {/* Singapore Cultural Context */}
            {(challenge as any).singapore_cultural_context && (
              <div className="bg-gradient-to-r from-red-50 to-white p-3 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇸🇬</span>
                  <h4 className="font-medium text-red-800">Singapore Cultural Connection</h4>
                </div>
                <p className="text-sm text-red-700">{(challenge as any).singapore_cultural_context}</p>
              </div>
            )}
          </div>

          {/* Requirements */}
          {localRequirements.length > 0 && (
            <div className="p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Requirements
              </h4>
              <div className="space-y-2">
                {localRequirements.map((requirement, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      requirement.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => handleRequirementToggle(index)}
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        requirement.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {requirement.completed && <CheckCircle className="w-3 h-3" />}
                    </button>
                    <div className="flex-grow">
                      <p className={`font-medium ${requirement.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                        {requirement.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Target: {requirement.target}
                        {requirement.current && ` • Current: ${requirement.current}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rewards */}
          {challenge.reward && (
            <div className="p-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Rewards
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {challenge.reward.money && challenge.reward.money > 0 && (
                  <div className="bg-green-50 p-2 rounded-lg text-center">
                    <div className="text-lg">💰</div>
                    <div className="text-sm font-medium text-green-800">${challenge.reward.money}</div>
                  </div>
                )}
                {challenge.reward.points && challenge.reward.points > 0 && (
                  <div className="bg-blue-50 p-2 rounded-lg text-center">
                    <div className="text-lg">⭐</div>
                    <div className="text-sm font-medium text-blue-800">{challenge.reward.points} pts</div>
                  </div>
                )}
                {challenge.reward.movement && challenge.reward.movement > 0 && (
                  <div className="bg-purple-50 p-2 rounded-lg text-center">
                    <div className="text-lg">🚀</div>
                    <div className="text-sm font-medium text-purple-800">+{challenge.reward.movement} moves</div>
                  </div>
                )}
                {challenge.reward.special_bonus && (
                  <div className="bg-yellow-50 p-2 rounded-lg text-center">
                    <div className="text-lg">🎁</div>
                    <div className="text-xs font-medium text-yellow-800">{challenge.reward.special_bonus}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-2 flex-wrap">
              {challenge.status === 'pending' && onStart && (
                <button
                  onClick={onStart}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start Challenge
                </button>
              )}
              
              {challenge.status === 'active' && progressPercentage === 100 && onComplete && (
                <button
                  onClick={onComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Challenge
                </button>
              )}
              
              {challenge.status === 'active' && onFail && (
                <button
                  onClick={onFail}
                  className="flex items-center gap-2 px-2 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Give Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollapsibleChallenge