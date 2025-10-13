/**
 * Gemini API Integration for Text and Audio Processing
 * 
 * Documentation Sources (October 2025):
 * - Context7: 20,000 tokens from googleapis/js-genai SDK documentation
 * - DeepWiki: googleapis/js-genai repository structure and examples
 * - GitHub MCP: Live examples and integration patterns
 * 
 * Key SDK Features Used:
 * - Text generation with system instructions and configuration
 * - Multimodal audio processing with inlineData format
 * - Structured JSON outputs with responseMimeType
 * - Proper contents format (string or ContentListUnion)
 * 
 * Latest SDK Patterns (from Context7/DeepWiki/GitHub):
 * - Simplified contents: accepts string directly for text-only requests
 * - Multimodal contents: array with inlineData objects for media
 * - System instructions: comprehensive context via config.systemInstruction
 * - Response access: response.text for generated content
 * 
 * @see https://github.com/googleapis/js-genai
 * @see https://googleapis.github.io/js-genai/release_docs/
 */
import { GoogleGenAI } from '@google/genai'

// Initialize Gemini API using the latest @google/genai SDK (October 2025)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || 'demo-key'

// Initialize with proper error handling following latest Google Gen AI SDK patterns
let ai: GoogleGenAI | null = null
try {
  ai = new GoogleGenAI({ apiKey: API_KEY })
  console.log('✅ Gemini API initialized successfully with @google/genai SDK')
} catch (error) {
  console.error('❌ Failed to initialize Gemini API:', error)
  console.warn('⚠️ Please set VITE_GEMINI_API_KEY or VITE_GOOGLE_API_KEY environment variable')
}

// Use Gemini 2.0 Flash Lite model (lightweight, cost-effective model as of October 2025)
// Research from Context7 (20k tokens), DeepWiki, GitHub: gemini-2.0-flash-lite is the lite variant
const MODEL = 'gemini-2.0-flash-lite'

export interface ConversationAnalysis {
  quality: number // 1-100
  movement: number // 1-5 moves
  earnings: number // $0 for audio (movement only)
  feedback: string
  topics_covered: string[]
  bonding_level: 'low' | 'medium' | 'high' | 'excellent'
}

export interface VideoAnalysis {
  performance_score: number // 1-100
  earnings: number // $5-$10
  feedback: string
  creativity_level: 'basic' | 'good' | 'great' | 'amazing'
}

export interface RandomEvent {
  type: 'positive' | 'negative' | 'funny_face' | 'funny_dance' | 'snack_time' | 'drink_time'
  title: string
  description: string
  emoji: string
  effect?: {
    money?: number
    movement?: number
    points?: number
  }
}

// Conversation topics for intergenerational bonding
export const conversationTopics = [
  "Share a childhood memory from your generation",
  "What technology surprised you the most in your lifetime?",
  "Tell me about your favorite family tradition",
  "What advice would you give to someone from a different generation?",
  "Describe how family meals were different when you were young",
  "What song or music brings back special memories?",
  "Share a story about your first job or school experience",
  "What games did you play as a child?",
  "Tell me about a historical event you remember",
  "What's the biggest change you've seen in your neighborhood?",
  "Share a funny family story or embarrassing moment",
  "What skills do you think each generation should learn from the other?"
]

// Random events that happen after conversations
const randomEvents: RandomEvent[] = [
  {
    type: 'positive',
    title: 'Positive Card',
    description: 'Your heartfelt conversation touched everyone! Bonus points for emotional connection.',
    emoji: '😔',
    effect: { points: 10, money: 5 }
  },
  {
    type: 'negative', 
    title: 'Negative Card',
    description: 'Someone got a bit grumpy during the discussion. Take it with humor!',
    emoji: '🤪',
    effect: { points: -5 }
  },
  {
    type: 'funny_face',
    title: 'Funny Face',
    description: 'Someone made such a funny expression! Everyone bursts into laughter.',
    emoji: '💃',
    effect: { points: 8, movement: 1 }
  },
  {
    type: 'funny_dance',
    title: 'Funny Dance',
    description: 'The conversation got so lively, someone started dancing! Move ahead extra spaces.',
    emoji: '💃',
    effect: { movement: 2, points: 12 }
  },
  {
    type: 'snack_time',
    title: 'Snack Time',
    description: 'All this talking made everyone hungry! Time for some family snacks.',
    emoji: '🍿',
    effect: { points: 5 }
  },
  {
    type: 'drink_time',
    title: 'Drink Time', 
    description: 'The conversation was so engaging, everyone needs a drink break!',
    emoji: '🥤',
    effect: { points: 5 }
  }
]

export const getRandomTopic = (): string => {
  return conversationTopics[Math.floor(Math.random() * conversationTopics.length)]
}

export const getRandomEvent = (): RandomEvent => {
  return randomEvents[Math.floor(Math.random() * randomEvents.length)]
}

export const generateText = async (prompt: string): Promise<string> => {
  try {
    // Check if API is properly initialized
    if (!ai) {
      throw new Error('❌ Gemini API not initialized. Please check your API key configuration.')
    }

    console.log(`📝 Generating text with Gemini ${MODEL}...`)

    // Use latest Google Gen AI SDK pattern based on Context7, DeepWiki & GitHub documentation
    // Source: https://github.com/googleapis/js-genai (Context7: 20000 tokens)
    // Proper contents structure: string or array with role/parts format
    const systemInstruction = `You are an AI assistant with extensive knowledge from:
    - Context7 (20000 token context window from googleapis/js-genai documentation)
    - DeepWiki knowledge base (googleapis/js-genai repository structure)
    - GitHub MCP server integration (live examples and best practices)
    
    You specialize in Singapore family dynamics, intergenerational relationships, and cultural contexts.
    Provide helpful, culturally appropriate responses for family gaming experiences.`

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt, // Simplified format: string or ContentListUnion
      config: {
        systemInstruction,
        temperature: 0.8,
        maxOutputTokens: 2000,
        topK: 40,
        topP: 0.95
      }
    })

    // Use correct response access pattern from SDK documentation
    if (!response || !response.text) {
      throw new Error('Empty response from Gemini API')
    }

    console.log('✅ Received text response from Gemini API')
    return response.text

  } catch (error) {
    console.error('❌ Gemini API text generation error:', error)
    
    // Show error popup to user
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert(`🚨 Gemini API Error (generateText)\n\nModel: ${MODEL}\nError: ${errorMessage}\n\nPlease check:\n✓ API key is valid\n✓ Model name is correct\n✓ Internet connection\n\nSee console for details.`)
    
    // Fallback response
    return `AI text generation temporarily unavailable. Please check your API configuration.`
  }
}

export const generatePreGameChallenge = async (gameSession: any, boardAnalysis: any): Promise<any> => {
  try {
    // Check if API is properly initialized
    if (!ai) {
      throw new Error('❌ Gemini API not initialized. Please check your API key configuration.')
    }

    console.log(`🎯 Generating pre-game challenge with Gemini ${MODEL}...`)

    const prompt = `
    Generate a pre-game challenge for a Singapore family board game session.
    
    Game Session Details:
    - Difficulty: ${gameSession.difficulty}
    - Family Budget: $${gameSession.family_budget}
    - Family Members: ${gameSession.family_members.map((m: any) => `${m.name} (${m.role})`).join(', ')}
    
    Board Analysis:
    - Complexity: ${boardAnalysis.complexity}
    - Family Friendly: ${boardAnalysis.family_friendly}
    - Estimated Game Time: ${boardAnalysis.estimated_game_time}
    
    Create a challenge that:
    1. Happens BEFORE the main game starts (after AI board setup)
    2. Involves family cooperation and Singapore cultural context
    3. Can include delivery ingredients, cooking tasks, transport challenges, or TikTok trends
    4. Has clear requirements and rewards (money, points, movement bonuses)
    5. Is appropriate for intergenerational play
    
    Respond in JSON format with:
    {
      "challenge": {
        "id": "unique_id",
        "type": "delivery|cooking|transport|general|tiktok",
        "title": "Challenge title",
        "description": "Detailed description",
        "requirements": [
          {
            "type": "ingredient|location|action|time|money",
            "description": "What needs to be done",
            "target": "specific target value",
            "completed": false
          }
        ],
        "rewards": {
          "money": 0,
          "points": 0,
          "movement": 0,
          "special_bonus": "optional special reward"
        },
        "difficulty": "easy|medium|hard",
        "time_limit": 30,
        "family_cooperation_required": true,
        "singapore_cultural_context": "How this relates to Singapore culture"
      }
    }
    `
    
    // Use correct Google Gen AI SDK pattern based on Context7, DeepWiki & GitHub documentation
    // Source: googleapis/js-genai - proper structured JSON output with responseMimeType
    const systemInstruction = `You are an AI challenge generator with extensive knowledge from:
    - Context7 (20000 token context window from googleapis/js-genai documentation)
    - DeepWiki knowledge base for Singapore culture and family dynamics
    - GitHub MCP server integration with real-world examples
    
    You create engaging, culturally appropriate challenges for Singapore families.
    Focus on intergenerational bonding, local context (hawker centers, MRT, HDB flats, local foods), 
    and challenges that bring different generations together through shared activities.`

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt, // Simplified: accepts string directly
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 2000,
        responseMimeType: "application/json" // Ensures structured JSON output
      }
    })

    // Use correct response access
    if (!response || !response.text) {
      throw new Error('Empty response from Gemini API')
    }

    console.log('✅ Received challenge response from Gemini API:', response.text.substring(0, 200) + '...')
    
    // Clean up JSON response (remove markdown formatting if present)
    const cleanText = response.text.replace(/```json\n?|\n?```/g, '').trim()
    
    let challenge
    try {
      const parsed = JSON.parse(cleanText)
      challenge = parsed.challenge || parsed
    } catch (parseError) {
      console.warn('⚠️ Failed to parse JSON response, using fallback challenge. Raw text:', cleanText)
      challenge = generateFallbackChallenge(gameSession)
    }
    
    return challenge

  } catch (error) {
    console.error('❌ Gemini API pre-game challenge generation error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Show error popup to user
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert(`🚨 Gemini API Error (generatePreGameChallenge)\n\nModel: ${MODEL}\nError: ${errorMessage}\n\nUsing fallback challenge instead.\n\nSee console for details.`)
    
    // Fallback challenge
    return generateFallbackChallenge(gameSession)
  }
}

const generateFallbackChallenge = (gameSession: any): any => {
  const fallbackChallenges = [
    {
      id: `fallback_${Date.now()}`,
      type: 'delivery',
      title: 'Hawker Center Ingredient Hunt',
      description: 'Before starting the game, the family must work together to gather ingredients for a traditional Singapore dish from different hawker stalls.',
      requirements: [
        {
          type: 'ingredient',
          description: 'Find rice for chicken rice',
          target: '1 packet',
          completed: false
        },
        {
          type: 'ingredient',
          description: 'Get fresh vegetables',
          target: '3 types',
          completed: false
        }
      ],
      rewards: {
        money: 15,
        points: 20,
        movement: 2,
        special_bonus: 'Extra family cooperation points'
      },
      difficulty: gameSession.difficulty || 'medium',
      time_limit: 25,
      family_cooperation_required: true,
      singapore_cultural_context: 'Experiencing Singapore\'s hawker culture and traditional cooking ingredients'
    },
    {
      id: `fallback_tiktok_${Date.now()}`,
      type: 'tiktok',
      title: 'Generational Dance Challenge',
      description: 'Create a TikTok video showing different generations doing their favorite dance moves together.',
      requirements: [
        {
          type: 'action',
          description: 'Record 30-second video',
          target: '1 video',
          completed: false
        },
        {
          type: 'action',
          description: 'Include all family members',
          target: `${gameSession.family_members?.length || 2} people`,
          completed: false
        }
      ],
      rewards: {
        money: 25,
        points: 30,
        movement: 1,
        special_bonus: 'TikTok money for shopping'
      },
      difficulty: gameSession.difficulty || 'easy',
      time_limit: 20,
      family_cooperation_required: true,
      singapore_cultural_context: 'Bridging generational gaps through modern social media and traditional dance'
    }
  ]
  
  return fallbackChallenges[Math.floor(Math.random() * fallbackChallenges.length)]
}

export const analyzeConversation = async (audioBlob: Blob, duration: number): Promise<ConversationAnalysis> => {
  try {
    // Check if API is properly initialized
    if (!ai) {
      throw new Error('❌ Gemini API not initialized. Please check your API key configuration.')
    }

  console.log(`🎙️ Analyzing conversation with Gemini model=${MODEL} (multimodal)...`, {
      duration: duration + 's',
      audioType: audioBlob.type,
      audioSize: Math.round(audioBlob.size / 1024) + 'KB',
      maxSizeSupported: '20MB',
      supportedFormats: ['audio/wav', 'audio/mp3', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac']
    })

    // Validate audio blob
    if (audioBlob.size === 0) {
      throw new Error('Empty audio blob received')
    }

    // FIXED: Reduce size limit to 5MB to prevent stack overflow
    // The spread operator causes "Maximum call stack size exceeded" for large files
    if (audioBlob.size > 5 * 1024 * 1024) { // 5MB limit (safer than 20MB)
      throw new Error(`Audio file too large: ${Math.round(audioBlob.size / (1024 * 1024))}MB (max 5MB). Please record shorter audio.`)
    }

    // Convert audio to base64 using chunked approach to avoid stack overflow
    console.log('🔄 Converting audio to base64 (chunked method)...')
    const arrayBuffer = await audioBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // FIXED: Use chunked conversion instead of spread operator to prevent stack overflow
    let binaryString = ''
    const chunkSize = 8192 // Process 8KB at a time
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length))
      binaryString += String.fromCharCode.apply(null, Array.from(chunk))
    }
    const base64Audio = btoa(binaryString)
    
    console.log('✅ Base64 conversion complete, length:', base64Audio.length, 'chunks:', Math.ceil(uint8Array.length / chunkSize))
    
    const prompt = `
    Analyze this family conversation recording for intergenerational bonding quality.
    Audio duration: ${duration} seconds
    
    Please evaluate:
    1. Quality of conversation (1-100)
    2. Intergenerational engagement level
    3. Topics discussed
    4. Emotional connection observed
    5. Family bonding effectiveness
    
    Focus on how well different generations (elderly and young) are connecting and sharing.
    Return a quality score and suggest movement (1-5 spaces) based on conversation depth.
    
    Respond in JSON format with: quality, movement, feedback, topics_covered, bonding_level
    `
    
    // Use correct Google Gen AI SDK multimodal pattern from Context7, DeepWiki & GitHub docs
    // Source: googleapis/js-genai - multimodal content with audio inlineData
    // Format: contents array with mixed text and media parts
    const systemInstruction = `You are an AI assistant that analyzes family conversations with extensive knowledge from:
    - Context7 (20000 token context window from googleapis/js-genai documentation)
    - DeepWiki knowledge base (googleapis/js-genai multimodal examples)
    - GitHub MCP server integration (live audio processing patterns)
    
    Analyze conversations for intergenerational bonding, cultural exchange, and meaningful connections.
    Consider Singapore cultural context and family dynamics.`

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          inlineData: {
            mimeType: audioBlob.type || 'audio/webm',
            data: base64Audio
          }
        },
        prompt
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json" // Ensures structured JSON output for parsing
      }
    })

    // Use correct response access with proper error handling
    console.log('📨 Raw API response received:', response)
    
    if (!response || !response.text) {
      throw new Error('Empty response from Gemini API')
    }
    
    const analysisText = response.text
    if (!analysisText) {
      throw new Error('No text content in Gemini API response')
    }
    
    console.log('✅ Received analysis from Gemini API (length:', analysisText.length, '):', analysisText.substring(0, 200) + '...')
    
    // Clean up JSON response (remove markdown formatting if present)
    const cleanText = analysisText.replace(/```json\n?|\n?```/g, '').trim()
    
    let analysis
    try {
      analysis = JSON.parse(cleanText)
    } catch (parseError) {
      console.warn('⚠️ Failed to parse JSON response, using fallback. Raw text:', cleanText)
      throw new Error(`Invalid JSON response: ${parseError}`)
    }
    
    return {
      quality: analysis.quality || Math.floor(Math.random() * 40) + 60,
      movement: analysis.movement || Math.floor(Math.random() * 5) + 1,
      earnings: 0, // Audio gives movement, not money
      feedback: analysis.feedback || "Great family conversation! Keep sharing stories across generations.",
      topics_covered: analysis.topics_covered || ["family memories", "generational differences"],
      bonding_level: analysis.bonding_level || 'medium'
    }
    
  } catch (error) {
    console.error('❌ Gemini API conversation analysis error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      duration,
      audioSize: audioBlob.size,
      audioType: audioBlob.type
    })
    
    // Show error popup to user
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert(`🚨 Gemini API Error (analyzeConversation)\n\nModel: ${MODEL}\nAudio: ${Math.round(audioBlob.size / 1024)}KB, ${duration}s\nError: ${errorMessage}\n\nUsing fallback analysis.\n\nSee console for details.`)
    
    // Enhanced fallback analysis based on duration and realistic patterns
    const baseQuality = Math.random() * 40 + 50 // 50-90%
    const durationBonus = Math.min(duration / 60, 1) // Up to 1 minute bonus
    const quality = Math.min(baseQuality + (durationBonus * 20), 100)
    
    const fallbackAnalysis: ConversationAnalysis = {
      quality: Math.round(quality),
      movement: Math.floor(quality / 20) + 1, // 1-5 based on quality
      earnings: 0, // Audio gives movement, not money
      feedback: `AI analysis temporarily unavailable. Duration: ${duration}s suggests ${quality > 80 ? 'excellent' : quality > 60 ? 'good' : 'basic'} engagement level.`,
      topics_covered: ["family stories", "shared memories", "generational wisdom", "life experiences"],
      bonding_level: quality > 80 ? 'excellent' : quality > 60 ? 'high' : quality > 40 ? 'medium' : 'low'
    }
    
    console.log('🔄 Using fallback analysis:', fallbackAnalysis)
    return fallbackAnalysis
  }
}

export const analyzeVideo = async (videoBlob: Blob, description: string): Promise<VideoAnalysis> => {
  try {
    // Check if API is properly initialized
    if (!ai) {
      throw new Error('❌ Gemini API not initialized. Please check your API key configuration.')
    }

  console.log(`📹 Analyzing TikTok video with Gemini model=${MODEL} (multimodal vision)...`, {
      description,
      videoType: videoBlob.type,
      videoSize: Math.round(videoBlob.size / 1024) + 'KB',
      maxSizeSupported: '20MB',
      supportedFormats: ['video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp']
    })

    // Validate video blob
    if (videoBlob.size === 0) {
      throw new Error('Empty video blob received')
    }

    // FIXED: Reduce size limit to 10MB to prevent stack overflow
    if (videoBlob.size > 10 * 1024 * 1024) { // 10MB limit (safer than 20MB)
      throw new Error(`Video file too large: ${Math.round(videoBlob.size / (1024 * 1024))}MB (max 10MB). Please record shorter video.`)
    }

    if (!description.trim()) {
      throw new Error('Video description is required for analysis')
    }

    // Convert video to base64 using chunked approach to avoid stack overflow
    console.log('🔄 Converting video to base64 (chunked method)...')
    const arrayBuffer = await videoBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // FIXED: Use chunked conversion instead of spread operator to prevent stack overflow
    let binaryString = ''
    const chunkSize = 8192 // Process 8KB at a time
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length))
      binaryString += String.fromCharCode.apply(null, Array.from(chunk))
    }
    const base64Video = btoa(binaryString)
    
    console.log('✅ Video base64 conversion complete, length:', base64Video.length, 'chunks:', Math.ceil(uint8Array.length / chunkSize))
    
    const prompt = `
    Analyze this TikTok trend video for creativity and family engagement.
    Description: "${description}"
    
    Evaluate:
    1. Creativity and effort (1-100)
    2. Family participation and fun
    3. Trend execution quality
    4. Intergenerational bonding visible
    
    Award earnings between $5-$10 based on performance.
    Focus on how well different generations participate together.
    
    Respond in JSON format with: performance_score, earnings, feedback, creativity_level
    `
    
    // Use correct Google Gen AI SDK pattern with context integration
    const systemInstruction = `You are an AI assistant that analyzes TikTok videos with context from:
    - Context7 (2000 token context window)
    - DeepWiki knowledge base
    - GitHub integration for technical content
    
    Analyze videos for creativity, family engagement, and trend execution quality.
    Consider Singapore cultural context and intergenerational participation.`

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          inlineData: {
            mimeType: videoBlob.type || 'video/webm',
            data: base64Video
          }
        },
        prompt
      ],
      config: {
        systemInstruction: systemInstruction
      }
    })

    // Use correct response access with proper error handling
    console.log('📨 Raw video API response received:', response)
    
    if (!response || !response.text) {
      throw new Error('Empty response from Gemini Video API')
    }
    
    const analysisText = response.text
    if (!analysisText) {
      throw new Error('No text content in Gemini Video API response')
    }
    console.log('✅ Received video analysis from Gemini API (length:', analysisText.length, '):', analysisText.substring(0, 200) + '...')
    
    // Clean up JSON response (remove markdown formatting if present)
    const cleanText = analysisText.replace(/```json\n?|\n?```/g, '').trim()
    
    let analysis
    try {
      analysis = JSON.parse(cleanText)
    } catch (parseError) {
      console.warn('⚠️ Failed to parse video JSON response, using fallback. Raw text:', cleanText)
      throw new Error(`Invalid JSON response: ${parseError}`)
    }
    
    return {
      performance_score: analysis.performance_score || Math.floor(Math.random() * 40) + 60,
      earnings: Math.max(5, Math.min(10, analysis.earnings || (Math.floor(Math.random() * 6) + 5))),
      feedback: analysis.feedback || "Great creativity! The family participation shows wonderful bonding.",
      creativity_level: analysis.creativity_level || 'good'
    }
    
  } catch (error) {
    console.error('❌ Gemini API video analysis error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      description,
      videoSize: videoBlob.size,
      videoType: videoBlob.type
    })
    
    // Show error popup to user
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert(`🚨 Gemini API Error (analyzeVideo)\n\nModel: ${MODEL}\nVideo: ${Math.round(videoBlob.size / (1024 * 1024))}MB\nError: ${errorMessage}\n\nUsing fallback analysis.\n\nSee console for details.`)
    
    // Enhanced fallback analysis
    const videoSize = videoBlob.size / (1024 * 1024) // MB
    const descriptionLength = description.length
    
    let performance = Math.random() * 0.4 + 0.5 // 50-90% base
    
    // Bonus for longer description (shows effort)
    if (descriptionLength > 50) performance += 0.1
    if (descriptionLength > 100) performance += 0.1
    
    // Bonus for reasonable video size (shows actual recording)
    if (videoSize > 0.5) performance += 0.1
    if (videoSize > 2) performance += 0.1
    
    performance = Math.min(performance, 1)
    
    const earnings = Math.floor(performance * 6) + 5 // $5-10
    const performanceScore = Math.round(performance * 100)
    
    const fallbackAnalysis: VideoAnalysis = {
      performance_score: performanceScore,
      earnings,
      feedback: `AI analysis temporarily unavailable. Based on video metrics (${Math.round(videoSize)}MB, ${descriptionLength} chars): ${performanceScore}% creativity score with great family bonding potential!`,
      creativity_level: performance > 0.8 ? 'amazing' : performance > 0.6 ? 'great' : performance > 0.4 ? 'good' : 'basic'
    }
    
    console.log('🔄 Using video fallback analysis:', fallbackAnalysis)
    return fallbackAnalysis
  }
}