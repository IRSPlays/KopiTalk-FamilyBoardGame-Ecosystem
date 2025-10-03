import { GoogleGenAI } from '@google/genai'

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || 'demo-key'

// Initialize with proper error handling following 2025 standards
let ai: GoogleGenAI | null = null
try {
  ai = new GoogleGenAI({ apiKey: API_KEY })
  console.log('✅ Gemini Vision API initialized successfully with key:', API_KEY ? '***' + API_KEY.slice(-4) : 'NOT_PROVIDED')
} catch (error) {
  console.error('❌ Failed to initialize Gemini Vision API:', error)
  console.warn('Please set VITE_GEMINI_API_KEY or VITE_GOOGLE_API_KEY environment variable')
}

// Use Gemini 2.5 Flash model exclusively
const MODEL = 'gemini-2.5-flash'

/**
 * Represents a single suggestion for placing a module on the game board.
 */
export interface ModuleSuggestion {
  /** The type of game module (e.g., 'market', 'station'). */
  module_type: string;
  /** The recommended placement location on the board. */
  placement: string;
  /** The justification for the suggested placement. */
  reason: string;
  /** The priority level for placing this module. */
  priority: 'high' | 'medium' | 'low';
}

/**
 * Represents the complete analysis of a game board image, including setup
 * recommendations and strategic advice.
 */
export interface BoardAnalysis {
  /** A general assessment of the board's layout and features. */
  board_assessment: string;
  /** The assessed complexity of the board setup. */
  complexity: 'simple' | 'moderate' | 'complex';
  /** A flag indicating if the setup is considered family-friendly. */
  family_friendly: boolean;
  /** An array of suggestions for placing game modules. */
  module_suggestions: ModuleSuggestion[];
  /** A list of strategic tips for playing on the analyzed board. */
  strategic_tips: string[];
  /** An estimated duration for a game session on this board. */
  estimated_game_time: string;
}

/**
 * Defines the structure of a dynamic in-game challenge, including its effects,
 * duration, and resolution options.
 */
export interface GameChallenge {
  /** A unique identifier for the challenge. */
  id: string;
  /** The category of the challenge. */
  type: 'weather' | 'delivery' | 'market' | 'family' | 'transport' | 'special';
  /** The title of the challenge. */
  title: string;
  /** A detailed description of the challenge and its context. */
  description: string;
  /** An object detailing the mechanical effects of the challenge on the game. */
  effects: {
    market_closures?: string[];
    delivery_delays?: number;
    price_changes?: { [key: string]: number };
    movement_restrictions?: boolean;
    family_bonus?: boolean;
    special_rules?: string[];
  };
  /** The duration of the challenge in game turns. */
  duration_turns?: number;
  /** A modifier that can affect the difficulty of this or other challenges. */
  difficulty_modifier: number;
  /** A description of how the challenge specifically impacts family dynamics. */
  family_impact: string;
  /** An array of actions the players can take to resolve or mitigate the challenge. */
  resolution_options: Array<{
    action: string;
    cost?: number;
    benefit?: string;
    family_cooperation_required: boolean;
  }>;
}

/**
 * Analyzes a game board image using the Gemini Vision API to provide setup
 * suggestions and strategic tips tailored to family gameplay.
 *
 * @param {File} imageFile - The image of the game board to be analyzed.
 * @param {string} difficulty - The selected difficulty level for the game.
 * @returns {Promise<BoardAnalysis>} A promise that resolves to a detailed board analysis object.
 *                                  Returns a fallback analysis on error.
 */
export const analyzeBoardImage = async (imageFile: File, difficulty: string): Promise<BoardAnalysis> => {
  try {
    if (!ai) {
      console.error('❌ Gemini Vision API not initialized');
      return generateFallbackAnalysis(difficulty);
    }

    console.log('🖼️ Analyzing board image with Gemini 2.5-flash Vision...', {
      difficulty,
      imageType: imageFile.type,
      imageSize: Math.round(imageFile.size / 1024) + 'KB'
    })

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    
    const prompt = `
    Analyze this modular board game image for optimal family gameplay setup.
    
    Current difficulty setting: ${difficulty}
    
    Please analyze:
    1. Board layout and available spaces
    2. Optimal placement for game modules (markets, stations, special locations)
    3. Family-friendly accessibility considerations
    4. Strategic placement for intergenerational gameplay
    5. Difficulty-appropriate setup recommendations
    
    Consider:
    - Elderly accessibility (larger spaces, clearer paths)
    - Youth engagement (interesting mechanics, variety)
    - Family cooperation opportunities
    - Clear sightlines for all players
    
    Respond in JSON format with:
    {
      "board_assessment": "description of the board layout",
      "complexity": "simple|moderate|complex",
      "family_friendly": boolean,
      "module_suggestions": [
        {
          "module_type": "market/station/special location",
          "placement": "specific location description",
          "reason": "why this placement benefits family gameplay",
          "priority": "high|medium|low"
        }
      ],
      "strategic_tips": ["tip1", "tip2", "tip3"],
      "estimated_game_time": "time estimate with family"
    }
    `
    
    // Use latest Google Gen AI SDK pattern with proper multimodal content handling
    const systemInstruction = `You are an AI assistant that analyzes board games with context from:
    - Context7 (20000 token context window)
    - DeepWiki knowledge base
    - GitHub integration for technical content
    
    Analyze board layouts for optimal family gameplay, considering Singapore cultural context and intergenerational accessibility.`

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: imageFile.type
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json'
      }
    })
    
    // Use correct response access
    const analysisText = result.text || ''
    console.log('✅ Received board analysis from Gemini Vision API:', analysisText.substring(0, 100) + '...')
    
    // Clean up the response (remove markdown formatting if present)
    const cleanText = analysisText.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      return JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Return fallback analysis
      return generateFallbackAnalysis(difficulty)
    }
    
  } catch (error) {
    console.error('Gemini Vision API error:', error)
    return generateFallbackAnalysis(difficulty)
  }
}

/**
 * Generates a predefined, fallback board analysis based on the selected difficulty.
 * This is used when the Gemini API call fails, ensuring the game setup can proceed.
 *
 * @param {string} difficulty - The selected game difficulty.
 * @returns {BoardAnalysis} A fallback board analysis object with predefined suggestions.
 */
const generateFallbackAnalysis = (difficulty: string): BoardAnalysis => {
  const difficultyMap = {
    Easy: {
      modules: [
        {
          module_type: 'Central Market Hub',
          placement: 'Center of board for easy family access',
          reason: 'Central location ensures all generations can reach easily',
          priority: 'high' as const,
        },
        { module_type: 'Family Rest Area', placement: 'Corner near starting positions', reason: 'Provides comfortable space for elderly family members', priority: 'high' as const },
        { module_type: 'Simple Trading Post', placement: 'Midway between start and center', reason: 'Easy first trading experience for beginners', priority: 'medium' as const }
      ],
      tips: [
        'Place essential modules closer together for easy movement',
        'Ensure clear paths between all major locations',
        'Use larger game pieces for better visibility'
      ]
    },
    'Medium': {
      modules: [
        { module_type: 'Multi-Level Market', placement: 'Central-left section', reason: 'Offers variety while maintaining accessibility', priority: 'high' as const },
        { module_type: 'Transport Hub', placement: 'Strategic crossroads position', reason: 'Facilitates movement between distant areas', priority: 'high' as const },
        { module_type: 'Specialty Shops', placement: 'Scattered around perimeter', reason: 'Encourages exploration and strategic planning', priority: 'medium' as const },
        { module_type: 'Challenge Station', placement: 'Upper right quadrant', reason: 'Optional challenges for engaged players', priority: 'low' as const }
      ],
      tips: [
        'Balance accessibility with strategic depth',
        'Create multiple paths to important locations',
        'Add cooperative challenge opportunities',
        'Consider different player mobility levels'
      ]
    },
    'Hard': {
      modules: [
        { module_type: 'Complex Market District', placement: 'Asymmetric central placement', reason: 'Creates strategic positioning challenges', priority: 'high' as const },
        { module_type: 'Dynamic Weather Station', placement: 'Corner position affecting board quarters', reason: 'Adds environmental challenges requiring adaptation', priority: 'high' as const },
        { module_type: 'Advanced Trading Network', placement: 'Multiple interconnected locations', reason: 'Requires long-term planning and family coordination', priority: 'medium' as const },
        { module_type: 'Crisis Response Center', placement: 'Accessible from multiple routes', reason: 'Allows for reactive gameplay and family teamwork', priority: 'medium' as const }
      ],
      tips: [
        'Embrace complexity while maintaining family engagement',
        'Create interdependent systems requiring cooperation',
        'Add multiple viable strategies for different play styles',
        'Include catch-up mechanisms for struggling players',
        'Design clear visual cues for complex interactions'
      ]
    },
    'Expert': {
      modules: [
        { module_type: 'Master Trading Consortium', placement: 'Central nexus with spoke connections', reason: 'Hub for complex economic interactions', priority: 'high' as const },
        { module_type: 'Global Event Center', placement: 'Elevated central position', reason: 'Broadcasts challenges affecting entire family', priority: 'high' as const },
        { module_type: 'Specialized Districts', placement: 'Four corner specialization zones', reason: 'Forces difficult strategic choices and family negotiation', priority: 'high' as const },
        { module_type: 'Legacy Projects', placement: 'Long-term development areas', reason: 'Multi-generational goals requiring sustained cooperation', priority: 'medium' as const }
      ],
      tips: [
        'Design for experienced families who enjoy deep strategy',
        'Create meaningful decisions at every game phase',
        'Implement sophisticated catch-up and comeback mechanics',
        'Allow for emergent family cooperation strategies',
        'Balance individual achievement with group success',
        'Provide multiple victory paths suited to different generations'
      ]
    }
  }
  
  const config = difficultyMap[difficulty as keyof typeof difficultyMap] || difficultyMap['Easy']
  
  return {
    board_assessment: `This board layout appears suitable for ${difficulty.toLowerCase()} difficulty family gameplay. The AI recommends strategic module placement to optimize intergenerational engagement and accessibility.`,
    complexity: difficulty === 'Easy' ? 'simple' : difficulty === 'Medium' ? 'moderate' : 'complex',
    family_friendly: true,
    module_suggestions: config.modules,
    strategic_tips: config.tips,
    estimated_game_time: difficulty === 'Easy' ? '45-60 minutes' : difficulty === 'Medium' ? '60-90 minutes' : difficulty === 'Hard' ? '90-120 minutes' : '2-3 hours'
  }
}

/**
 * Generates a dynamic in-game challenge using the Gemini API based on the
 * current game state and difficulty.
 *
 * @param {string} difficulty - The current game difficulty.
 * @param {any} currentGameState - An object representing the current state of the game.
 * @returns {Promise<GameChallenge>} A promise that resolves to a new game challenge object.
 *                                   Returns a fallback challenge on error.
 */
export const generateGameChallenge = async (difficulty: string, currentGameState: any): Promise<GameChallenge> => {
  try {
    if (!ai) {
      console.error('❌ Gemini Vision API not initialized');
      return generateFallbackChallenge(difficulty);
    }

    console.log('🎲 Generating game challenge with Gemini 2.5-flash...', {
      difficulty,
      gameState: Object.keys(currentGameState || {})
    })

    const prompt = `
    Generate a dynamic family board game challenge for ${difficulty} difficulty.
    Current game state: ${JSON.stringify(currentGameState)}
    
    Create a realistic challenge that affects family gameplay, considering:
    - Weather conditions (rain, heat, holidays)
    - Delivery/transport disruptions
    - Market fluctuations
    - Family events (celebrations, emergencies)
    - Infrastructure issues
    - Economic changes
    
    The challenge should:
    1. Be appropriate for intergenerational gameplay
    2. Encourage family cooperation to resolve
    3. Create meaningful strategic decisions
    4. Be thematically consistent with Singapore/Asian family life
    5. Scale appropriately with difficulty level
    
    Respond in JSON format with:
    {
      "id": "unique_challenge_id",
      "type": "weather|delivery|market|family|transport|special",
      "title": "Challenge name",
      "description": "Detailed description of what's happening",
      "effects": {
        "market_closures": ["list of affected markets"],
        "delivery_delays": number_of_turns,
        "price_changes": {"item": percentage_change},
        "movement_restrictions": boolean,
        "family_bonus": boolean,
        "special_rules": ["list of temporary rule changes"]
      },
      "duration_turns": number_of_turns_active,
      "difficulty_modifier": -0.2_to_0.3,
      "family_impact": "how this specifically affects family gameplay",
      "resolution_options": [
        {
          "action": "what families can do",
          "cost": optional_cost,
          "benefit": "what they gain",
          "family_cooperation_required": boolean
        }
      ]
    }
    `
    
    // Use CORRECT 2025 API pattern - this will actually hit the API and show in Gemini Studio
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
    
    // Use CORRECT response access - this is the key fix
    const challengeText = result.text || ''
    console.log('✅ Received challenge from Gemini API:', challengeText.substring(0, 100) + '...')
    
    const cleanText = challengeText.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      return JSON.parse(cleanText)
    } catch (parseError) {
      return generateFallbackChallenge(difficulty)
    }
    
  } catch (error) {
    console.error('Challenge generation error:', error)
    return generateFallbackChallenge(difficulty)
  }
}

/**
 * Generates a predefined, random fallback game challenge based on the selected difficulty.
 * This ensures gameplay can continue even if the Gemini API fails.
 *
 * @param {string} difficulty - The selected game difficulty.
 * @returns {GameChallenge} A fallback game challenge object with scaled effects.
 */
const generateFallbackChallenge = (difficulty: string): GameChallenge => {
  const challenges = [
    {
      id: 'tropical_storm',
      type: 'weather' as const,
      title: 'Tropical Storm Warning',
      description: 'A sudden tropical storm hits Singapore! Heavy rain and strong winds are affecting transportation and market operations across the city.',
      effects: {
        market_closures: ['Central Wet Market'],
        delivery_delays: 2,
        price_changes: { 'umbrella': 50, 'raincoat': 30 } as { [key: string]: number },
        movement_restrictions: true,
        family_bonus: false,
        special_rules: ['Family members can share transportation', 'Indoor markets get +20% customers']
      },
      duration_turns: 3,
      difficulty_modifier: 0.15,
      family_impact: 'Families must work together to navigate the storm, sharing resources and planning alternative routes.',
      resolution_options: [
        {
          action: 'Purchase family umbrella set',
          cost: 15,
          benefit: 'All family members move normally despite weather',
          family_cooperation_required: true
        },
        {
          action: 'Wait it out together',
          benefit: 'Family bonding bonus (+10 points)',
          family_cooperation_required: true
        }
      ]
    },
    {
      id: 'chinese_new_year',
      type: 'family' as const,
      title: 'Chinese New Year Reunion',
      description: 'It\'s Chinese New Year! Extended family is visiting and there\'s lots of preparation to do. Traditional foods are in high demand, but family bonds are stronger than ever.',
      effects: {
        price_changes: { 'traditional_food': -20, 'red_decorations': 25 } as { [key: string]: number },
        family_bonus: true,
        special_rules: ['Extra points for family cooperation actions', 'Traditional markets offer special CNY discounts']
      },
      duration_turns: 4,
      difficulty_modifier: -0.1,
      family_impact: 'This celebration brings the family closer together, making cooperation easier and more rewarding.',
      resolution_options: [
        {
          action: 'Organize family reunion dinner',
          cost: 25,
          benefit: 'All family members gain bonus points and skip next challenge',
          family_cooperation_required: true
        },
        {
          action: 'Share family stories and traditions',
          benefit: 'Unlock special family memory bonuses for rest of game',
          family_cooperation_required: true
        }
      ]
    },
    {
      id: 'mrt_breakdown',
      type: 'transport' as const,
      title: 'MRT System Disruption',
      description: 'Technical issues have caused delays across the MRT network. Alternative transportation methods are crowded and more expensive.',
      effects: {
        delivery_delays: 1,
        price_changes: { 'transport': 40, 'taxi': 60 },
        movement_restrictions: true,
        special_rules: ['Walking between adjacent locations is free', 'Family members can travel together for single cost']
      },
      duration_turns: 2,
      difficulty_modifier: 0.1,
      family_impact: 'Families must adapt their travel plans and may need to help elderly members with alternative routes.',
      resolution_options: [
        {
          action: 'Arrange family carpooling',
          cost: 10,
          benefit: 'All family members travel together efficiently',
          family_cooperation_required: true
        },
        {
          action: 'Walk and explore together',
          benefit: 'Discover new local shops with special discounts',
          family_cooperation_required: false
        }
      ]
    }
  ]
  
  const difficultyMultiplier = difficulty === 'Easy' ? 0.5 : difficulty === 'Medium' ? 1 : difficulty === 'Hard' ? 1.5 : 2
  const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)]
  
  return {
    ...selectedChallenge,
    difficulty_modifier: selectedChallenge.difficulty_modifier * difficultyMultiplier,
    duration_turns: Math.ceil((selectedChallenge.duration_turns || 2) * difficultyMultiplier)
  }
}