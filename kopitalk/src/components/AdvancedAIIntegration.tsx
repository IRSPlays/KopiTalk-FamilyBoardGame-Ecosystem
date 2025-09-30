import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameSession } from '../types'
import { analyzeConversation } from '../utils/geminiApi'
import { 
  Brain, MessageCircle, Lightbulb, Target, Users, 
  Star, Heart, TrendingUp, AlertCircle, CheckCircle,
  Sparkles, Zap, BookOpen, Gift, Award, ArrowRight,
  Clock, Activity, Map, ChefHat, Bus, Package,
  Camera, Mic, FileText, BarChart3, Headphones
} from 'lucide-react'
import {
  containerVariants,
  itemVariants,
  cardHoverVariants,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn
} from '../utils/animations'

interface AIInsight {
  id: string
  type: 'recommendation' | 'observation' | 'challenge' | 'celebration'
  category: 'family_bonding' | 'cultural_learning' | 'skill_development' | 'game_strategy'
  title: string
  description: string
  confidence: number
  actionable: boolean
  priority: 'low' | 'medium' | 'high'
  suggestedActions?: string[]
  relatedModules?: string[]
  estimatedImpact: {
    familyBonding: number
    culturalKnowledge: number
    gameProgress: number
  }
}

interface ConversationAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative'
  engagement: number
  topics: string[]
  culturalElements: string[]
  learningOpportunities: string[]
  familyDynamics: {
    cooperation: number
    communication: number
    shared_interest: number
  }
  recommendations: AIInsight[]
}

interface SmartRecommendation {
  id: string
  title: string
  description: string
  module: string
  difficulty: 'easy' | 'medium' | 'hard'
  benefits: string[]
  timeEstimate: number
  familyMembers: string[]
  culturalFocus: string
}

interface Props {
  gameSession: GameSession
  onApplyRecommendation: (recommendation: SmartRecommendation) => void
  onStartAIChallenge: (challenge: any) => void
}

const AdvancedAIIntegration: React.FC<Props> = ({ 
  gameSession, 
  onApplyRecommendation, 
  onStartAIChallenge 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [conversationAnalysis, setConversationAnalysis] = useState<ConversationAnalysis | null>(null)
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([])
  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendation[]>([])
  const [audioRecording, setAudioRecording] = useState(false)
  const [selectedInsightType, setSelectedInsightType] = useState<'all' | 'recommendations' | 'observations' | 'challenges'>('all')

  // Initialize AI insights and recommendations
  useEffect(() => {
    generateAIInsights()
    generateSmartRecommendations()
  }, [gameSession])

  const generateAIInsights = () => {
    // Simulate AI-generated insights based on game state
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'recommendation',
        category: 'family_bonding',
        title: 'Enhance Family Cooking Sessions',
        description: 'Your family shows great engagement during cooking activities. Consider exploring more traditional recipes together to strengthen cultural connections.',
        confidence: 87,
        actionable: true,
        priority: 'high',
        suggestedActions: [
          'Try cooking Hainanese Chicken Rice together',
          'Record family stories while cooking',
          'Create a family recipe collection'
        ],
        relatedModules: ['Cooking Game'],
        estimatedImpact: {
          familyBonding: 25,
          culturalKnowledge: 30,
          gameProgress: 15
        }
      },
      {
        id: '2',
        type: 'observation',
        category: 'cultural_learning',
        title: 'Strong Interest in Singapore History',
        description: 'Analysis shows family members frequently discuss Singapore\'s development and cultural heritage during gameplay.',
        confidence: 92,
        actionable: false,
        priority: 'medium',
        estimatedImpact: {
          familyBonding: 15,
          culturalKnowledge: 40,
          gameProgress: 10
        }
      },
      {
        id: '3',
        type: 'challenge',
        category: 'skill_development',
        title: 'Improve Transport Planning Skills',
        description: 'Family could benefit from more strategic transport planning. Current efficiency is below optimal levels.',
        confidence: 78,
        actionable: true,
        priority: 'medium',
        suggestedActions: [
          'Practice multi-modal journey planning',
          'Learn about transport optimization',
          'Use real-time data more effectively'
        ],
        relatedModules: ['Bus Timings', 'EZ-Link TopUp'],
        estimatedImpact: {
          familyBonding: 10,
          culturalKnowledge: 20,
          gameProgress: 30
        }
      },
      {
        id: '4',
        type: 'celebration',
        category: 'game_strategy',
        title: 'Excellent Delivery Coordination',
        description: 'Your family demonstrates outstanding teamwork in delivery challenges, consistently achieving high scores.',
        confidence: 95,
        actionable: false,
        priority: 'low',
        estimatedImpact: {
          familyBonding: 20,
          culturalKnowledge: 10,
          gameProgress: 25
        }
      }
    ]

    setAIInsights(mockInsights)
  }

  const generateSmartRecommendations = () => {
    const mockRecommendations: SmartRecommendation[] = [
      {
        id: 'rec1',
        title: 'Heritage Food Tour Challenge',
        description: 'Explore Singapore\'s diverse food heritage through targeted delivery orders from different ethnic quarters.',
        module: 'Delivery App',
        difficulty: 'medium',
        benefits: [
          'Learn about Singapore\'s multicultural food scene',
          'Practice navigation skills across different neighborhoods',
          'Strengthen family decision-making through food choices'
        ],
        timeEstimate: 45,
        familyMembers: gameSession.family_members.map(m => m.name),
        culturalFocus: 'Multicultural Heritage'
      },
      {
        id: 'rec2',
        title: 'Grandparents\' Recipe Revival',
        description: 'Document and recreate traditional family recipes while sharing generational stories.',
        module: 'Cooking Game',
        difficulty: 'hard',
        benefits: [
          'Preserve family culinary traditions',
          'Create lasting family memories',
          'Learn authentic cooking techniques'
        ],
        timeEstimate: 90,
        familyMembers: gameSession.family_members.filter(m => m.role === 'grandparent' || m.role === 'parent').map(m => m.name),
        culturalFocus: 'Family Heritage'
      },
      {
        id: 'rec3',
        title: 'Singapore Stories Documentary',
        description: 'Create a family video documenting your Singapore experiences and cultural observations.',
        module: 'TikTok Creator',
        difficulty: 'hard',
        benefits: [
          'Develop digital storytelling skills',
          'Capture family perspectives on Singapore',
          'Create shareable cultural content'
        ],
        timeEstimate: 120,
        familyMembers: gameSession.family_members.map(m => m.name),
        culturalFocus: 'Contemporary Culture'
      },
      {
        id: 'rec4',
        title: 'Efficient Commuter Challenge',
        description: 'Master Singapore\'s transport system through strategic route planning and timing optimization.',
        module: 'Bus Timings',
        difficulty: 'medium',
        benefits: [
          'Become efficient Singapore commuters',
          'Learn about urban planning',
          'Develop time management skills'
        ],
        timeEstimate: 30,
        familyMembers: gameSession.family_members.filter(m => m.age >= 12).map(m => m.name),
        culturalFocus: 'Urban Living'
      }
    ]

    setSmartRecommendations(mockRecommendations)
  }

  const analyzeCurrentConversation = async () => {
    setIsAnalyzing(true)
    
    try {
      // Simulate conversation analysis (in real app, this would use actual audio/text)
      const mockConversation = `
        Family discussing their day in Singapore, sharing experiences about trying local food,
        using public transport, and learning about different cultures. High engagement and
        positive sentiment throughout the conversation.
      `

      const analysis = await analyzeConversation(mockConversation)
      
      // Mock analysis result
      const mockAnalysis: ConversationAnalysis = {
        sentiment: 'positive',
        engagement: 85,
        topics: ['Local Food', 'Transport', 'Cultural Learning', 'Family Time'],
        culturalElements: ['Hawker Centers', 'MRT System', 'Racial Harmony', 'Singapore History'],
        learningOpportunities: ['Cooking Skills', 'Navigation', 'Cultural Awareness', 'Language Learning'],
        familyDynamics: {
          cooperation: 90,
          communication: 87,
          shared_interest: 92
        },
        recommendations: []
      }

      setConversationAnalysis(mockAnalysis)
      
      // Generate new insights based on analysis
      generateContextualInsights(mockAnalysis)
      
    } catch (error) {
      console.error('Error analyzing conversation:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateContextualInsights = (analysis: ConversationAnalysis) => {
    // Generate insights based on conversation analysis
    const contextualInsights: AIInsight[] = [
      {
        id: 'ctx1',
        type: 'recommendation',
        category: 'cultural_learning',
        title: 'Explore Mentioned Cultural Elements',
        description: `Your conversation highlighted interest in ${analysis.culturalElements.join(', ')}. Consider exploring these topics more deeply.`,
        confidence: 85,
        actionable: true,
        priority: 'high',
        suggestedActions: analysis.culturalElements.map(element => `Learn more about ${element}`),
        estimatedImpact: {
          familyBonding: 15,
          culturalKnowledge: 35,
          gameProgress: 20
        }
      }
    ]

    setAIInsights(prev => [...prev, ...contextualInsights])
  }

  const startAudioAnalysis = () => {
    setAudioRecording(true)
    // Simulate recording for 5 seconds
    setTimeout(() => {
      setAudioRecording(false)
      analyzeCurrentConversation()
    }, 5000)
  }

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'recommendation': return Lightbulb
      case 'observation': return Brain
      case 'challenge': return Target
      case 'celebration': return Star
      default: return AlertCircle
    }
  }

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'recommendation': return 'border-blue-300 bg-blue-50'
      case 'observation': return 'border-green-300 bg-green-50'
      case 'challenge': return 'border-orange-300 bg-orange-50'
      case 'celebration': return 'border-purple-300 bg-purple-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const filteredInsights = selectedInsightType === 'all' 
    ? aiInsights 
    : aiInsights.filter(insight => insight.type === selectedInsightType)

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* AI Control Panel */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-4 sm:p-6 shadow-xl"
        variants={fadeInUp}
        whileHover={{ boxShadow: "0 25px 50px rgba(139, 92, 246, 0.3)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Brain className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.div>
            AI Learning Assistant
          </motion.h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <motion.button
              onClick={startAudioAnalysis}
              disabled={isAnalyzing || audioRecording}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-none ${
                audioRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : isAnalyzing 
                    ? 'bg-yellow-500 cursor-not-allowed' 
                    : 'bg-white/20 hover:bg-white/30'
              }`}
              whileHover={!isAnalyzing && !audioRecording ? { scale: 1.05 } : {}}
              whileTap={!isAnalyzing && !audioRecording ? { scale: 0.95 } : {}}
            >
              <AnimatePresence mode="wait">
                {audioRecording ? (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div 
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    Recording...
                  </motion.div>
                ) : isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Activity className="w-4 h-4" />
                    </motion.div>
                    Analyzing...
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    Analyze Conversation
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center"
          variants={containerVariants}
        >
          {[
            { value: aiInsights.length, label: 'AI Insights', icon: Sparkles, color: 'from-yellow-400 to-orange-500' },
            { value: smartRecommendations.length, label: 'Recommendations', icon: Lightbulb, color: 'from-blue-400 to-cyan-500' },
            { value: conversationAnalysis ? `${conversationAnalysis.engagement}%` : '-', label: 'Engagement Score', icon: TrendingUp, color: 'from-green-400 to-emerald-500' },
            { value: conversationAnalysis ? conversationAnalysis.sentiment.toUpperCase() : '-', label: 'Mood Analysis', icon: Heart, color: 'from-pink-400 to-rose-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
            >
              <motion.div
                className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <stat.icon className="w-5 h-5" />
                {stat.value}
              </motion.div>
              <div className="text-xs sm:text-sm opacity-90 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Conversation Analysis Results */}
      <AnimatePresence>
        {conversationAnalysis && (
          <motion.div 
            className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Latest Conversation Analysis
            </h2>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-4 sm:gap-6"
              variants={containerVariants}
            >
              <motion.div 
                className="space-y-4"
                variants={fadeInLeft}
              >
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Discussion Topics</h3>
                <motion.div 
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {conversationAnalysis.topics.map((topic, index) => (
                    <motion.span 
                      key={topic} 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm"
                      variants={scaleIn}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: "#93c5fd" }}
                    >
                      {topic}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-4"
                variants={fadeInUp}
              >
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Cultural Elements</h3>
                <motion.div 
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {conversationAnalysis.culturalElements.map((element, index) => (
                    <motion.span 
                      key={element} 
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm"
                      variants={scaleIn}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: "#fed7aa" }}
                    >
                      {element}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-4"
                variants={fadeInRight}
              >
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Family Dynamics</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Cooperation', value: conversationAnalysis.familyDynamics.cooperation },
                    { label: 'Communication', value: conversationAnalysis.familyDynamics.communication },
                    { label: 'Shared Interest', value: conversationAnalysis.familyDynamics.shared_interest }
                  ].map((dynamic, index) => (
                    <motion.div
                      key={dynamic.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-xs sm:text-sm text-gray-600">{dynamic.label}</span>
                        <motion.span 
                          className="font-medium text-sm sm:text-base"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          {dynamic.value}%
                        </motion.span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${dynamic.value}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insight Filter */}
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-2 touch-pan-x"
        variants={fadeInUp}
      >
        {[
          { key: 'all', label: 'All Insights', count: aiInsights.length },
          { key: 'recommendations', label: 'Recommendations', count: aiInsights.filter(i => i.type === 'recommendations').length },
          { key: 'observations', label: 'Observations', count: aiInsights.filter(i => i.type === 'observations').length },
          { key: 'challenges', label: 'Challenges', count: aiInsights.filter(i => i.type === 'challenges').length }
        ].map((filter, index) => (
          <motion.button
            key={filter.key}
            onClick={() => setSelectedInsightType(filter.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${
              selectedInsightType === filter.key
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
            <motion.span 
              className="px-2 py-1 bg-white/20 rounded-full text-xs"
              layout
            >
              {filter.count}
            </motion.span>
          </motion.button>
        ))}
      </motion.div>

      {/* AI Insights */}
      <motion.div 
        className="space-y-3 sm:space-y-4"
        variants={containerVariants}
      >
        <AnimatePresence mode="popLayout">
          {filteredInsights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type)
            return (
            <motion.div 
              key={insight.id} 
              className={`bg-white rounded-xl p-4 sm:p-6 shadow-lg border-2 ${getInsightColor(insight.type)}`}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              layout
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{insight.title}</h3>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">{insight.description}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                      <motion.span 
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        {insight.priority.toUpperCase()} PRIORITY
                      </motion.span>
                      <motion.span 
                        className="text-xs sm:text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {insight.confidence}% confidence
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Prediction */}
              <motion.div 
                className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Estimated Impact</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { icon: Heart, label: 'Family Bonding', value: insight.estimatedImpact.familyBonding, color: 'text-red-600' },
                    { icon: BookOpen, label: 'Cultural Knowledge', value: insight.estimatedImpact.culturalKnowledge, color: 'text-blue-600' },
                    { icon: TrendingUp, label: 'Game Progress', value: insight.estimatedImpact.gameProgress, color: 'text-green-600' }
                  ].map((impact, idx) => (
                    <motion.div 
                      key={impact.label}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
                    >
                      <impact.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${impact.color.replace('text-', 'text-').replace('-600', '-500')} mx-auto mb-1`} />
                      <div className="text-xs sm:text-sm font-medium truncate">{impact.label.split(' ')[0]}</div>
                      <div className={`text-base sm:text-lg font-bold ${impact.color}`}>+{impact.value}%</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Suggested Actions */}
              {insight.suggestedActions && (
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Suggested Actions</h4>
                  <ul className="space-y-2">
                    {insight.suggestedActions.map((action, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start gap-2 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                      >
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{action}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Related Modules */}
              {insight.relatedModules && (
                <motion.div 
                  className="flex gap-2 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {insight.relatedModules.map((module, idx) => (
                    <motion.span 
                      key={module} 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.1 }}
                    >
                      📱 {module}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )
        })}
        </AnimatePresence>
      </motion.div>

      {/* Smart Recommendations */}
      <motion.div 
        className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
        variants={fadeInUp}
        whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          AI-Curated Recommendations
        </h2>
        
        <motion.div 
          className="space-y-4 sm:space-y-6"
          variants={containerVariants}
        >
          {smartRecommendations.map((rec, index) => (
            <motion.div 
              key={rec.id} 
              className="border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-300 transition-all"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: "#93c5fd" }}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                <div className="w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{rec.title}</h3>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">{rec.description}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                    <motion.span 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                      whileHover={{ scale: 1.1 }}
                    >
                      📱 {rec.module}
                    </motion.span>
                    <motion.span 
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
                      whileHover={{ scale: 1.1 }}
                    >
                      🎯 {rec.culturalFocus}
                    </motion.span>
                    <motion.span 
                      className="flex items-center gap-1 text-xs sm:text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Clock className="w-4 h-4" />
                      {rec.timeEstimate} min
                    </motion.span>
                  </div>
                </div>
              </div>

              <motion.div 
                className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Benefits</h4>
                  <ul className="space-y-1">
                    {rec.benefits.map((benefit, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-center gap-2 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="break-words">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Participants</h4>
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {rec.familyMembers.map((member, idx) => (
                      <motion.span 
                        key={member} 
                        className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + idx * 0.05, type: "spring" }}
                        whileHover={{ scale: 1.1 }}
                      >
                        👤 {member}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              <motion.button
                onClick={() => onApplyRecommendation(rec)}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Apply Recommendation
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default AdvancedAIIntegration