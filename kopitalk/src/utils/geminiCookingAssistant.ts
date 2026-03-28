import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export interface CookingStep {
  stepNumber: number
  instruction: string
  requiredIngredients: string[]
  requiredAppliance: string
  prepActions?: string[] // e.g., ['wash', 'chop', 'marinate']
  estimatedTime: number // seconds
  culturalContext?: string
  tips?: string[]
  combinationsNeeded?: string[] // e.g., ['marinade', 'curry paste']
}

export interface CookingRecipe {
  dishName: string
  totalSteps: number
  steps: CookingStep[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  culturalBackground: string
  estimatedTotalTime: number // minutes
  servings: number
}

export interface IngredientCombination {
  name: string
  ingredients: string[]
  result: string
  culturalNote: string
}

/**
 * Generate step-by-step cooking instructions using Gemini AI
 */
export async function generateCookingInstructions(
  dishName: string,
  ingredients: string[]
): Promise<CookingRecipe> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          dishName: { type: SchemaType.STRING },
          totalSteps: { type: SchemaType.NUMBER },
          difficulty: {
            type: SchemaType.STRING,
            format: 'enum' as const,
            enum: ['beginner', 'intermediate', 'advanced']
          },
          culturalBackground: { type: SchemaType.STRING },
          estimatedTotalTime: { type: SchemaType.NUMBER },
          servings: { type: SchemaType.NUMBER },
          steps: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                stepNumber: { type: SchemaType.NUMBER },
                instruction: { type: SchemaType.STRING },
                requiredIngredients: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING }
                },
                requiredAppliance: { type: SchemaType.STRING },
                prepActions: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING }
                },
                estimatedTime: { type: SchemaType.NUMBER },
                culturalContext: { type: SchemaType.STRING },
                tips: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING }
                },
                combinationsNeeded: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING }
                }
              },
              required: ['stepNumber', 'instruction', 'requiredIngredients', 'requiredAppliance', 'estimatedTime']
            }
          }
        },
        required: ['dishName', 'totalSteps', 'steps', 'difficulty', 'culturalBackground', 'estimatedTotalTime', 'servings']
      }
    }
  })
  
  const prompt = `You are a Singapore heritage cooking instructor teaching families how to prepare traditional dishes in a digital cooking game for intergenerational bonding.

Dish: ${dishName}
Available Ingredients: ${ingredients.join(', ')}

Generate a detailed, step-by-step cooking recipe optimized for teaching elderly and youth players together. Include:

1. **Preparation Steps**: washing, cutting, marinating (specify which appliances: cutting board, mixing bowl)
2. **Combination Steps**: creating marinades, pastes, sauces before cooking
3. **Cooking Steps**: specific cooking actions with timing (appliances: wok, rice cooker, steamer, oven, microwave, blender, stove, grill)
4. **Plating/Assembly**: final presentation steps

Requirements:
- Break down into 8-12 clear, sequential steps suitable for beginner cooks
- Specify exact appliances needed for each step
- Include prep actions like "wash", "chop", "marinate", "mix" where appropriate
- Mention if ingredients need to be combined first (e.g., "marinade" = soy sauce + garlic + ginger)
- Provide timing estimates for each step
- Add cultural context about traditional Singapore/Malaysian/Peranakan cooking methods
- Include helpful tips for beginners and elderly learners (e.g., "Ask youth to help with chopping", "Elderly can share traditional techniques")

Focus on making instructions clear for intergenerational bonding - young teaching digital skills and old teaching traditional wisdom.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    const recipe: CookingRecipe = JSON.parse(response)
    
    console.log(`🤖 [AI COOKING] Generated recipe for ${dishName}:`, recipe)
    return recipe
    
  } catch (error) {
    console.error('❌ [AI COOKING] Error generating instructions:', error)
    throw new Error(`Failed to generate cooking instructions: ${error}`)
  }
}

/**
 * Validate if player action matches current step
 */
export async function validateCookingAction(
  currentStep: CookingStep,
  playerAction: {
    appliance: string
    ingredients: string[]
    prepAction?: string
  }
): Promise<{ valid: boolean; feedback: string; score: number }> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          valid: { type: SchemaType.BOOLEAN },
          feedback: { type: SchemaType.STRING },
          score: { type: SchemaType.NUMBER }
        },
        required: ['valid', 'feedback', 'score']
      }
    }
  })
  
  const prompt = `As a cooking instructor, validate if the player's action is correct for this cooking step.

Current Step: "${currentStep.instruction}"
Required Ingredients: ${currentStep.requiredIngredients.join(', ')}
Required Appliance: ${currentStep.requiredAppliance}
${currentStep.prepActions ? `Prep Actions: ${currentStep.prepActions.join(', ')}` : ''}

Player Action:
- Used Appliance: ${playerAction.appliance}
- Used Ingredients: ${playerAction.ingredients.join(', ')}
${playerAction.prepAction ? `- Prep Action: ${playerAction.prepAction}` : ''}

Validation Rules:
1. Check if appliance matches (allow similar appliances like "wok" = "stir-fry pan")
2. Check if all required ingredients are present
3. Check if prep action is appropriate (if specified)

Return:
- valid: true if action is correct or close enough, false if significantly wrong
- feedback: Encouraging message if correct (mention intergenerational learning), helpful guidance if wrong (don't just say it's wrong, explain what to do)
- score: 0-100 based on accuracy (100 = perfect, 80-99 = close, 50-79 = partial, 0-49 = incorrect)`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    return JSON.parse(response)
  } catch (error) {
    console.error('❌ [AI COOKING] Error validating action:', error)
    return { 
      valid: false, 
      feedback: 'Unable to validate action, please try again.', 
      score: 0 
    }
  }
}

/**
 * Get hint for stuck players (3-level hint system)
 */
export async function getCookingHint(
  currentStep: CookingStep,
  hintLevel: 1 | 2 | 3
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  
  const hintPrompts = {
    1: 'Give a subtle hint without revealing the answer directly. Focus on the type of action or appliance needed.',
    2: 'Provide more specific guidance. Mention the general ingredients and appliance type.',
    3: 'Explain exactly what to do step by step. Be very detailed and clear for beginners.'
  }
  
  const prompt = `Current cooking step: "${currentStep.instruction}"
Required: ${currentStep.requiredIngredients.join(', ')} using ${currentStep.requiredAppliance}

The player is stuck and needs help. ${hintPrompts[hintLevel]}

Context: This is an intergenerational cooking game where elderly and youth cook together. 
${hintLevel === 3 ? 'Suggest how elderly can share traditional wisdom and youth can help with modern techniques.' : ''}

Respond with a single helpful hint (2-4 sentences max). Be warm and encouraging.`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('❌ [AI COOKING] Error getting hint:', error)
    return 'Try focusing on the ingredients and appliance mentioned in the step. Ask your family member for help!'
  }
}

/**
 * Suggest ingredient substitutions for missing items
 */
export async function suggestSubstitutions(
  missingIngredient: string,
  dishContext: string
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      }
    }
  })
  
  const prompt = `In the context of cooking "${dishContext}", the player is missing "${missingIngredient}".

Suggest 3 common Singapore household substitutions that would work well. Consider:
- Availability in local supermarkets
- Similar flavor/texture profile
- Cultural appropriateness for Singapore dishes

Return only an array of 3 substitution suggestions (just the ingredient names).`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    return JSON.parse(response)
  } catch (error) {
    console.error('❌ [AI COOKING] Error getting substitutions:', error)
    return []
  }
}

/**
 * Get ingredient combinations for current dish
 */
export async function getIngredientCombinations(
  dishName: string,
  availableIngredients: string[]
): Promise<IngredientCombination[]> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            ingredients: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            result: { type: SchemaType.STRING },
            culturalNote: { type: SchemaType.STRING }
          },
          required: ['name', 'ingredients', 'result', 'culturalNote']
        }
      }
    }
  })
  
  const prompt = `For cooking "${dishName}" with available ingredients: ${availableIngredients.join(', ')}

Identify 2-4 ingredient combinations that should be prepared before cooking. Examples:
- Marinades (soy sauce + garlic + ginger)
- Curry pastes (turmeric + chili + shallots)
- Sambal (chili + shrimp paste + garlic)
- Spice mixes

Focus on Singapore/Malaysian/Peranakan cuisine traditions. Each combination should:
- Use only available ingredients
- Be authentic to the dish's cultural origin
- Have 2-5 ingredients per combination

Return combinations with cultural context explaining their traditional significance.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    return JSON.parse(response)
  } catch (error) {
    console.error('❌ [AI COOKING] Error getting combinations:', error)
    return []
  }
}

/**
 * Analyze cooking mistakes and provide recovery suggestions
 */
export async function analyzeMistake(
  stepDescription: string,
  mistakeType: 'wrong_appliance' | 'wrong_ingredient' | 'overcooking' | 'wrong_order',
  details: string
): Promise<{ canRecover: boolean; suggestion: string; culturalTip?: string }> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          canRecover: { type: SchemaType.BOOLEAN },
          suggestion: { type: SchemaType.STRING },
          culturalTip: { type: SchemaType.STRING }
        },
        required: ['canRecover', 'suggestion']
      }
    }
  })
  
  const prompt = `A player made a cooking mistake:

Step: ${stepDescription}
Mistake Type: ${mistakeType}
Details: ${details}

Analyze if this mistake can be recovered from and provide educational guidance:
1. Can this mistake be fixed? (canRecover: true/false)
2. If yes, how? If no, what can be learned?
3. Include traditional Singapore cooking wisdom if relevant

Be encouraging and educational rather than critical. This is an intergenerational learning experience.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    return JSON.parse(response)
  } catch (error) {
    console.error('❌ [AI COOKING] Error analyzing mistake:', error)
    return {
      canRecover: true,
      suggestion: 'Every cook makes mistakes! Try again and ask your family member for advice.'
    }
  }
}

/**
 * Generate cultural context for the dish
 */
export async function getDishCulturalContext(
  dishName: string
): Promise<{
  origin: string
  significance: string
  traditionalMethod: string
  modernAdaptation: string
  familyTraditions: string[]
}> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          origin: { type: SchemaType.STRING },
          significance: { type: SchemaType.STRING },
          traditionalMethod: { type: SchemaType.STRING },
          modernAdaptation: { type: SchemaType.STRING },
          familyTraditions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          }
        },
        required: ['origin', 'significance', 'traditionalMethod', 'modernAdaptation', 'familyTraditions']
      }
    }
  })
  
  const prompt = `Provide rich cultural context about "${dishName}" for an intergenerational cooking game in Singapore:

1. Origin: Where does this dish come from? (Malay, Chinese, Peranakan, Indian heritage)
2. Significance: Why is this dish important in Singapore culture? (festivals, daily life, hawker culture)
3. Traditional Method: How did grandparents cook this? (charcoal, clay pots, traditional tools)
4. Modern Adaptation: How do young people cook this today? (pressure cookers, air fryers, shortcuts)
5. Family Traditions: List 3-5 traditions or customs around this dish that families can discuss

Make it engaging for both elderly (nostalgic) and youth (educational) players.`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    return JSON.parse(response)
  } catch (error) {
    console.error('❌ [AI COOKING] Error getting cultural context:', error)
    return {
      origin: 'Singapore heritage cuisine',
      significance: 'A beloved traditional dish',
      traditionalMethod: 'Cooked with patience and love',
      modernAdaptation: 'Now made with modern appliances',
      familyTraditions: ['Share stories while cooking', 'Pass down family recipes', 'Cook together during festivals']
    }
  }
}
