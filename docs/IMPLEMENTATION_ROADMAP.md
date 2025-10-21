# 🚀 KopiTalk Implementation Roadmap

**Project**: KopiTalk - Physical D.I.Y. Board Game with Digital Logic Processor  
**Last Updated**: October 21, 2025  
**Status**: Phase 1-4 Complete ✅ | Phase 5-12 Pending

---

## 📌 CRITICAL CLARIFICATION: PHYSICAL D.I.Y. BOARD

**THE BOARD IS PHYSICAL, NOT VIRTUAL**

- Players physically build their custom board using provided tiles/parts
- The board includes physical components: markets, MRT stations, cooking stations, etc.
- **ESP32-CAM captures photos** of the physical board layout
- **BoardSetupModal** uploads and analyzes physical board photos using Gemini Vision
- **BoardBuilderModal** is for digital preview/planning only (optional helper tool)
- App serves as the **logic processor** for the physical roleplay experience

---

## ✅ PHASE 1: CRITICAL BUG FIXES (COMPLETED)

### Status: 100% Complete ✅

#### Fixed Issues:
- ✅ **Game Phase Mismatch**: "Unknown game phase: board_building" error
  - Changed gameStorage.ts initial phase from 'board_building' to 'family_setup'
  - Added BoardBuilderModal handler to BoardGame.tsx
  - Created board_building phase renderer
  - Updated phase validation array

- ✅ Missing EZLinkTopUp page (replaced with MRTStation)
- ✅ GameStore persistence (added ezlink_balance, activeWeatherChallenge)
- ✅ TypeScript errors in AdvancedAIIntegration (4 fixes)
- ✅ CSS class conflict in EnhancedGameStatistics
- ✅ Missing updateEzlinkBalance() implementation
- ✅ Added age property and grandparent role to FamilyMember

**Files Modified**:
- `kopitalk/src/utils/gameStorage.ts` - Line 80 changed to 'family_setup'
- `kopitalk/src/pages/BoardGame.tsx` - Added board_building phase support

---

## ✅ PHASE 2: BONDING METER & CONVERSATION STARTER (COMPLETED)

### Status: 100% Complete ✅

#### Completed Components:
- ✅ **BondingMeter.tsx** (245 lines)
  - Visual bonding level indicator (0-100)
  - 5 bonding stages with animations
  - Framer Motion progress animations
  - Milestone celebrations

- ✅ **ConversationStarter.tsx** (392 lines)
  - AI-powered topic suggestions
  - Location-based conversation prompts
  - 8 topic categories (cooking, family, culture, etc.)
  - Difficulty progression system

- ✅ **gameStore.ts** - Bonding tracking functions:
  - `updateBondingLevel(amount, reason)`
  - `increaseBondingLevel(amount, reason)`
  - `decreaseBondingLevel(amount, reason)`
  - `recordConversation(topic, duration, quality)`
  - `getBondingStatus()`

---

## ✅ PHASE 3: BOARD BUILDER VERIFICATION (COMPLETED)

### Status: 100% Complete ✅

**Component**: `BoardBuilderModal.tsx` (474 lines)

#### Features Verified:
- ✅ Drag-and-drop tile placement (Framer Motion)
- ✅ 9 tile types: start, wet_market, supermarket, mrt, bus_stop, cooking_station, delivery, challenge, tiktok_spot
- ✅ Grid size control (6x6 to 15x15)
- ✅ Validation (requires start, market, cooking station)
- ✅ Template boards (basic 10x10, Singapore-themed 12x12)
- ✅ Tile statistics display
- ✅ Save custom board to gameStore

**Note**: This is a **digital preview tool only**. The actual board is physical. This tool helps players plan their layout before building physically.

---

## ✅ PHASE 4: UNIFIED NAVIGATION (COMPLETED)

### Status: 100% Complete ✅

**Component**: `GameNavigation.tsx` (446 lines)

#### Features:
- ✅ Sticky top navigation bar
- ✅ Breadcrumb trail with icons
- ✅ Quick stats display (Family Budget, EZ-Link, Bonding Level)
- ✅ 7 navigation items: Home, Delivery, Wet Market, Supermarket, MRT, Cooking, History
- ✅ Mobile-responsive slide-out menu
- ✅ Save & Exit functionality
- ✅ Framer Motion animations

**Ready for integration**: Just import into page components.

---

## 🔄 PHASE 5: 8 MONEY-EARNING ACTIVITIES (HIGH PRIORITY)

### Status: Not Started 🔴

**Why**: Only TikTok trends exist. Need 8 activities that create intergenerational common ground.

### Activities to Implement:

#### 1. Story Exchange Sessions ($15-25)
**File**: `kopitalk/src/components/activities/StoryExchange.tsx`

Requirements:
- [ ] Record 5-10 minute story from elderly
- [ ] AI analyzes storytelling quality using Gemini
- [ ] Young person creates digital archive
- [ ] Bonus for thoughtful follow-up questions
- [ ] Save to Memory Bank
- [ ] Award $15-25 based on depth and engagement

**Technical Stack**:
- Use existing `AudioRecordingModal` component
- Gemini API for story analysis
- Store recordings in gameStore with metadata
- Increase bonding_level by 5-15 points

---

#### 2. Reverse Teaching ($10-30)
**File**: `kopitalk/src/components/activities/ReverseTeaching.tsx`

Categories:
- [ ] Wet market haggling techniques ($15)
- [ ] Traditional cooking methods ($20)
- [ ] Dialect phrases and pronunciation ($10)
- [ ] Fresh ingredient identification ($12)

**Technical Stack**:
- Quiz-based validation
- Photo upload for ingredient identification
- Audio recording for dialect pronunciation
- Progress tracking per category
- Increase bonding_level by 8-20 points

---

#### 3. Joint Shopping Challenges ($20-40)
**File**: `kopitalk/src/components/activities/JointShopping.tsx`

Scenarios:
- [ ] Elderly learns delivery app, youth visits wet market ($30)
- [ ] Both try supermarket self-checkout together ($20)
- [ ] Youth teaches PayNow digital payments ($15)
- [ ] Compare prices between markets ($10)

**Technical Stack**:
- Track time spent on each activity
- AI validates completion using Gemini
- Award patience bonus for elderly learners
- Cross-generational experience scoring
- Increase bonding_level by 15-25 points

---

#### 4. Recipe Recreation ($25-50)
**File**: `kopitalk/src/components/activities/RecipeRecreation.tsx`

Process:
- [ ] Elderly describes traditional family recipe
- [ ] Youth researches online version
- [ ] Both compare differences and discuss
- [ ] Optional: Cook both versions and compare
- [ ] Document final family version

**Technical Stack**:
- Text input for elderly's traditional recipe
- Recipe API integration (Edamam or similar)
- Side-by-side comparison interface
- Integration with CookingGameMode
- Save to family recipe collection
- Increase bonding_level by 20-30 points

---

#### 5. Neighborhood Photo Journal ($10-20)
**File**: `kopitalk/src/components/activities/PhotoJournal.tsx`

Requirements:
- [ ] Visit 3-5 locations on physical board
- [ ] Take photos together at each location
- [ ] Elderly shares memories about each place
- [ ] Youth creates digital photo album
- [ ] Add captions and stories

**Technical Stack**:
- Camera API integration
- Location tracking via ESP32
- Story recording per photo
- Gallery view with filters
- Export album as PDF
- Increase bonding_level by 10-15 points

---

#### 6. Language Bridge ($15-25)
**File**: `kopitalk/src/components/activities/LanguageBridge.tsx`

Activities:
- [ ] Elderly teaches Hokkien/Cantonese/Malay phrases
- [ ] Youth teaches internet slang and memes
- [ ] Create family dictionary with pronunciations
- [ ] Translation quiz game
- [ ] Daily phrase challenges

**Technical Stack**:
- Audio recording for pronunciation
- Word-by-word translation interface
- Quiz mode with scoring
- Dictionary export to JSON
- Pronunciation playback
- Increase bonding_level by 12-18 points

---

#### 7. Menu Planning Together ($20-35)
**File**: `kopitalk/src/components/activities/MenuPlanning.tsx`

Process:
- [ ] Elderly suggests traditional recipe
- [ ] Youth researches nutrition information
- [ ] Both adapt recipe for health considerations
- [ ] Calculate calories, protein, vitamins
- [ ] Plan weekly meal menu together

**Technical Stack**:
- Nutrition API integration (Nutritionix or USDA)
- Recipe input form with ingredient parser
- Health adaptation suggestions
- Calorie/macro calculator
- Export meal plan as PDF or calendar
- Increase bonding_level by 15-25 points

---

#### 8. Transport Tutorial Exchange ($12-25)
**File**: `kopitalk/src/components/activities/TransportTutorial.tsx`

Activities:
- [ ] Youth teaches bus app usage (SG Bus Tracker)
- [ ] Elderly shares route shortcuts and tips
- [ ] Compare traditional vs app-based navigation
- [ ] Route efficiency challenge
- [ ] Bonus for discovering new information

**Technical Stack**:
- LTA DataMall API for real-time bus data
- Route comparison algorithm
- Step-by-step tutorial mode
- Achievement tracking (first app usage, first shortcut shared)
- GPS integration for route validation
- Increase bonding_level by 10-20 points

---

### Integration Tasks:
- [ ] Create `kopitalk/src/components/activities/` directory
- [ ] Create index file: `kopitalk/src/components/activities/index.ts`
- [ ] Add activity cards to `ActivitiesHub.tsx`
- [ ] Update gameStore with activity completion tracking
- [ ] Add activity history to `GameHistory.tsx` page
- [ ] Create activity selection modal with recommendations

### Research Tools to Use:
- **Context7**: For React best practices, Zustand patterns, Framer Motion animations
- **GitHub MCP**: Search similar activity implementations in other projects
- **deepwiki**: Research Singapore culture, traditional activities, digital literacy programs

---

## 🛒 PHASE 6: SUPERMARKET SELF-ORDER ENHANCEMENTS (MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic self-checkout simulation exists at `kopitalk/src/pages/SupermarketSelfOrder.tsx`  
**Needed**: Intergenerational learning elements

### File to Modify:
`kopitalk/src/pages/SupermarketSelfOrder.tsx`

#### Features to Add:

##### Learning Mode for Elderly:
- [ ] Step-by-step tutorial overlay
- [ ] "I need help" button triggers young person assistance
- [ ] Highlight current UI element with glowing border
- [ ] Voice guidance option (text-to-speech)
- [ ] Slower pace mode
- [ ] Confirmation dialogs with clear instructions

##### Teaching Tracker for Youth:
- [ ] Track patience level (how well youth explains)
- [ ] Award bonus $5-10 for clear explanations
- [ ] Tips popup: "Effective teaching strategies"
- [ ] Measure explanation clarity (time taken, errors made)

##### Challenge Mode:
- [ ] Elderly challenges youth: "Be as fast as wet market!"
- [ ] Speed comparison metrics (self-order vs traditional checkout)
- [ ] Leaderboard (optional, non-competitive)

##### Price Comparison:
- [ ] Show wet market equivalent prices beside each item
- [ ] Calculate total savings/cost difference
- [ ] Discussion prompts: "Why do you think this is cheaper/more expensive?"
- [ ] Generate conversation topics about modern vs traditional shopping

#### New Components to Create:

**File**: `kopitalk/src/components/LearningPrompt.tsx`
```typescript
interface LearningPromptProps {
  forRole: 'elderly' | 'youth'
  message: string
  highlightElement?: string
  onHelp?: () => void
  voiceGuidance?: boolean
}
```

**File**: `kopitalk/src/components/GenerationalComparison.tsx`
```typescript
interface GenerationalComparisonProps {
  supermarketPrice: number
  wetMarketPrice: number
  deliveryPrice?: number
  discussionPrompt: string
}
```

### Success Criteria:
- ✅ Elderly can request help with clear button
- ✅ Youth patience tracked and rewarded
- ✅ Price comparisons visible and educational
- ✅ Discussion prompts appear automatically
- ✅ Completion awards $10-20 + bonding points

---

## 🚚 PHASE 7: ENHANCED DELIVERY APP (MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic delivery ordering exists at `kopitalk/src/pages/DeliveryApp.tsx`  
**Needed**: Learning features and generational comparison

### File to Modify:
`kopitalk/src/pages/DeliveryApp.tsx`

#### Features to Add:

##### Learning Mode Toggle:
- [ ] Elderly-friendly UI: larger buttons (min 60px height)
- [ ] Step-by-step tutorial with progress bar
- [ ] Voice search option (Web Speech API)
- [ ] Simplified navigation (fewer options visible)
- [ ] Clear "Back" and "Help" buttons always visible

##### Generational Comparison:
- [ ] "At wet market this would cost $X" badges
- [ ] Time comparison: delivery 2 hours vs walking to market 30 mins
- [ ] Freshness indicator (delivery 2-3 days old vs wet market same day)
- [ ] Environmental impact (delivery packaging vs reusable bags)
- [ ] Generate discussion prompts about modern convenience vs traditional methods

##### Digital Skills Progress Tracker:
- [ ] Track elderly player's app proficiency over sessions
- [ ] Award badges: "First Order", "Search Pro", "Cart Master", etc.
- [ ] Show improvement over time with line chart
- [ ] Celebrate milestones with animations

##### Collaboration Features:
- [ ] "Ask young person" button for elderly (triggers help mode)
- [ ] "Explain to grandparent" prompts for youth with teaching tips
- [ ] Shared cart that both can edit
- [ ] Review order together before confirming

### Success Criteria:
- ✅ Tutorial mode reduces elderly errors by 50%
- ✅ Price/time comparisons visible on every item
- ✅ Digital skills tracked across sessions
- ✅ Collaboration encouraged with UI prompts
- ✅ Completion awards $15-30 + bonding points

---

## 👨‍🍳 PHASE 8: COOPERATIVE COOKING GAME MODE (HIGH PRIORITY)

### Status: Partially Complete 🟡

**Current**: Solo cooking game exists at `kopitalk/src/pages/CookingGameMode.tsx`  
**Needed**: Complete overhaul for cooperative two-role system

### File to Modify:
`kopitalk/src/pages/CookingGameMode.tsx`

#### Complete Redesign Required:

##### Two-Role System:

**Role 1: Elderly - "Recipe Keeper"**
- [ ] Provide traditional cooking tips during gameplay
- [ ] Share family recipe secrets (recorded and saved)
- [ ] Record cooking memories for each step
- [ ] Approve each cooking step before proceeding
- [ ] Control for traditional techniques and timing

**Role 2: Young Person - "Timer Manager"**
- [ ] Track cooking times with multiple timers
- [ ] Monitor temperatures (oven, oil, water)
- [ ] Document process digitally (photos, notes)
- [ ] Ask questions about techniques (prompts provided)
- [ ] Manage digital recipe display

##### Cooking Methods Implementation:

**Steam (蒸)**:
- [ ] Water level checking (both players)
- [ ] Timer management by youth (countdown display)
- [ ] Technique explanation by elderly (recorded)
- [ ] Lid lifting animation
- [ ] Steam pressure indicator

**Fry (炒)**:
- [ ] Heat level guidance from elderly
- [ ] Timer and oil temperature tracking by youth
- [ ] Stirring rhythm collaboration (tap in sync)
- [ ] Sizzle sound effects
- [ ] Golden brown color indicator

**Boil (煮)**:
- [ ] Ingredient sequencing by elderly (drag order)
- [ ] Time tracking by youth (multiple timers)
- [ ] Broth tasting together (mini-game)
- [ ] Bubble animation intensity
- [ ] Simmer vs rolling boil control

**Stir-Fry (炒)**:
- [ ] Wok technique demonstration by elderly
- [ ] Timing coordination (both tap together)
- [ ] High heat management (youth controls)
- [ ] Wok hei meter (breath of wok)
- [ ] Rapid stirring animation

**Grill (烤)**:
- [ ] Temperature control (youth sets, elderly approves)
- [ ] Flip timing (elderly signals, youth executes)
- [ ] Doneness checking together (tap to check)
- [ ] Char marks visual feedback
- [ ] Internal temperature display

**Bake (烘)**:
- [ ] Oven management (youth preheats)
- [ ] Temperature precision (elderly verifies)
- [ ] Timing critical (both monitor)
- [ ] Rise animation (bread, cake)
- [ ] Golden brown detector

##### Conversation Prompts During Waiting:

Integrate prompts during idle time (e.g., steaming 30 mins, baking 45 mins):
- [ ] "While steaming, ask grandparent: What's your earliest cooking memory?"
- [ ] "Young person, explain: Why does the recipe app say to use olive oil instead of lard?"
- [ ] "Share a story about a cooking disaster you've experienced!"
- [ ] "Elderly: What ingredient was hard to find when you were young?"
- [ ] "Youth: How would you search for this recipe online?"

##### Technical Implementation:

```typescript
interface CooperativeCooking {
  elderlyPlayer: {
    role: 'Recipe Keeper'
    tasks: Task[]
    tipsShared: RecordedTip[]
    memoriesRecorded: Recording[]
    approvalsRequired: number
  }
  youngPlayer: {
    role: 'Timer Manager'
    tasks: Task[]
    questionsAsked: Question[]
    timersActive: Timer[]
    temperatureTracking: TempReading[]
  }
  sharedSteps: CookingStep[]
  conversationPrompts: ConversationPrompt[]
  currentMethod: 'steam' | 'fry' | 'boil' | 'stir-fry' | 'grill' | 'bake'
  cooperationScore: number // 0-100
}
```

### New Component:
**File**: `kopitalk/src/components/CooperativeCookingInterface.tsx`
- Split-screen interface (elderly left, youth right)
- Real-time synchronization of actions
- Conversation prompt overlay during waiting
- Success requires both players

### Success Criteria:
- ✅ Both players have distinct, meaningful roles
- ✅ Requires confirmation from both for each step
- ✅ Conversation prompts appear during 30+ second waits
- ✅ All 6 cooking methods implemented with unique mechanics
- ✅ Memory recording integrated throughout
- ✅ Cooperation score tracked (affects rewards)
- ✅ Completion awards $30-60 + 25-40 bonding points

---

## 🚇 PHASE 9: MRT STATION & EZ-LINK ENHANCEMENTS (MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic EZ-Link balance and MRT transactions exist  
**Needed**: Learning exchange and transport history integration

### File to Modify:
`kopitalk/src/pages/MRTStation.tsx`

#### Features to Add:

##### Did You Know? Section:
- [ ] Random Singapore transport facts database (50+ facts)
- [ ] Historical MRT trivia (opening dates, milestones)
- [ ] Singapore transport evolution timeline
- [ ] Display 1 random fact every visit
- [ ] Mark facts as "learned" in gameStore

**Example Facts**:
- "The first MRT line opened in 1987 with just 5 stations"
- "Singapore has over 200 bus routes covering the entire island"
- "EZ-Link cards use Near Field Communication (NFC) technology"

##### Generational Sharing Prompts:
- [ ] Elderly prompt: "Back in my day, we used paper tickets. Share your memory!"
- [ ] Youth prompt: "This app shows real-time arrivals. Explain how it works!"
- [ ] Record and save sharing to Memory Bank
- [ ] Award $5-10 for each sharing
- [ ] Increase bonding_level by 5-10 points

##### Transport Comparison Visualization:
- [ ] Interactive timeline: 1960s buses vs 2025 MRT
- [ ] Cost comparison: $0.10 (1980) vs $1.50 (2025) adjusted for inflation
- [ ] Time efficiency: 2-hour bus vs 45-min MRT
- [ ] Visual graphics with before/after photos

##### Knowledge Bonus System:
- [ ] Award $5-15 for sharing transport knowledge
- [ ] Quiz about MRT history (10 questions, $2 per correct)
- [ ] Route planning challenge (fastest/cheapest bonus)
- [ ] Station naming trivia

### File to Modify:
`kopitalk/src/pages/BusTimings.tsx`

#### Features to Add:
- [ ] Real-time bus arrival API (LTA DataMall)
- [ ] Route comparison: elderly shortcuts vs app recommendations
- [ ] Bus history quiz (bus models, route evolution)
- [ ] Elderly teaches youth: bus numbers and their destinations
- [ ] Award $8-15 for successful navigation

### Success Criteria:
- ✅ Transport facts visible and educational
- ✅ Generational sharing encouraged with prompts
- ✅ Knowledge bonuses awarded automatically
- ✅ MRT/bus history integrated seamlessly
- ✅ Real-time data works reliably

---

## 🤖 PHASE 10: AI DISH GENERATION & CHALLENGE SYSTEM (HIGH PRIORITY)

### Status: Not Started 🔴

**Why**: Core gameplay loop requires AI to generate random Singapore traditional dishes at game start.

### Files to Create/Modify:

#### 1. AI Dish Generator Utility
**File**: `kopitalk/src/utils/aiDishGenerator.ts` (NEW)

```typescript
interface DishChallenge {
  id: string
  name: string // e.g., "Hainanese Chicken Rice"
  nameInDialect?: string // e.g., "海南雞飯"
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: Ingredient[]
  cookingMethods: ('steam' | 'fry' | 'boil' | 'stir-fry' | 'grill' | 'bake')[]
  steps: CookingStep[]
  culturalStory: string
  timeRequired: number // minutes
  servings: number
  rewards: {
    money: number
    cultural_knowledge: number
    bonding_points: number
  }
  dynamicFactors: {
    weatherAffected: boolean
    currentWeather?: 'sunny' | 'rainy' | 'hazy'
    priceInflation?: number // percentage
    ingredientScarcity?: string[] // ingredient names
  }
}

interface Ingredient {
  name: string
  amount: number
  unit: string
  whereCanBuy: ('wet_market' | 'supermarket' | 'delivery')[]
  basePrice: number
  currentPrice: number // affected by weather/inflation
  collected: boolean
  alternatives?: string[]
}

interface CookingStep {
  stepNumber: number
  instruction: string
  elderlyRole: string // What recipe keeper does
  youthRole: string // What timer manager does
  duration?: number // seconds
  temperature?: number // celsius
  conversationPrompt?: string // During waiting
}

// Main function
async function generateRandomSingaporeDish(
  difficulty?: 'easy' | 'medium' | 'hard',
  weather?: 'sunny' | 'rainy' | 'hazy'
): Promise<DishChallenge>

// Helper to apply dynamic challenges
function applyDynamicChallenges(
  dish: DishChallenge,
  weather: string,
  randomEvents: string[]
): DishChallenge

// Cache to avoid regenerating same dish
const dishCache: Map<string, DishChallenge> = new Map()
```

#### 2. Gemini API Integration
**Enhance File**: `kopitalk/src/utils/geminiApi.ts`

Add new function:
```typescript
async function generateDishWithGemini(
  constraints: {
    difficulty: 'easy' | 'medium' | 'hard'
    cookingMethods: string[]
    weather: string
    budget: number
    playerPreferences?: string[]
  }
): Promise<DishChallenge> {
  const prompt = `
    Generate a traditional Singapore dish challenge with the following constraints:
    
    - Difficulty: ${constraints.difficulty}
    - Available cooking methods: ${constraints.cookingMethods.join(', ')}
    - Current weather: ${constraints.weather}
    - Family budget: $${constraints.budget}
    
    Return a JSON object with:
    - name: dish name in English
    - nameInDialect: dish name in dialect (Hokkien/Cantonese/Malay)
    - description: brief history (2-3 sentences)
    - culturalStory: detailed cultural significance (150-200 words)
    - ingredients: array of objects with:
      * name (string)
      * amount (number)
      * unit (string)
      * whereCanBuy (array: wet_market, supermarket, delivery)
      * basePrice (number, in SGD)
      * alternatives (array of substitute ingredients)
    - cookingMethods: array of methods needed (steam, fry, boil, stir-fry, grill, bake)
    - steps: array of step-by-step instructions with:
      * stepNumber (number)
      * instruction (string, clear and concise)
      * elderlyRole (what the recipe keeper does)
      * youthRole (what the timer manager does)
      * duration (seconds, if timed step)
      * temperature (celsius, if applicable)
      * conversationPrompt (question to discuss during this step)
    - timeRequired: total cooking time in minutes
    - servings: number of people
    - difficulty: easy/medium/hard
    - rewards: object with money, cultural_knowledge, bonding_points
    
    Make it authentic and educational. Include family cooking wisdom in the culturalStory.
  `
  
  // Call Gemini API
  const result = await callGeminiAPI(prompt)
  return JSON.parse(result) as DishChallenge
}
```

#### 3. Challenge System Component
**File**: `kopitalk/src/components/ChallengeSystem.tsx` (NEW)

Dynamic Challenge Types:
- [ ] **Weather Challenge**:
  - Rainy day: +15-25% ingredient prices, harder to visit wet market
  - Hot day: faster cooking times, ice needed
  - Hazy: some fresh ingredients unavailable
  - Affects ingredient prices in real-time

- [ ] **Price Inflation**:
  - Random ingredient becomes 20-40% more expensive
  - Must decide: substitute ingredient or pay premium?
  - Teaches budgeting and flexibility

- [ ] **Time Pressure**:
  - Elderly has appointment in X hours
  - Must complete dish before countdown ends
  - Increases difficulty, teaches time management

- [ ] **Ingredient Scarcity**:
  - Wet market out of stock of 1-2 ingredients
  - Must use supermarket (higher price) or delivery (waiting time)
  - Teaches adaptability

- [ ] **Festival Bonus**:
  - During Singapore festivals (Chinese New Year, Hari Raya, Deepavali, etc.)
  - Special festival ingredients available
  - Bonus rewards for festival dishes

#### 4. Game Start Challenge Display
**File**: `kopitalk/src/components/GameStartChallenge.tsx` (ENHANCE)

Current: Basic dish display  
Needed: Full challenge presentation

- [ ] Cinematic reveal animation (Framer Motion)
- [ ] Display dish name with dialect pronunciation
- [ ] Show cultural story with audio narration option
- [ ] Ingredient checklist with progress bars
- [ ] Dynamic challenge badges (weather, inflation, etc.)
- [ ] Estimated completion time
- [ ] Reward preview
- [ ] "Accept Challenge" button to begin

### Integration Flow:

```
Game Start (after board building)
  ↓
GameStartChallenge.tsx triggers
  ↓
aiDishGenerator.generateRandomSingaporeDish()
  ↓
Gemini API generates unique dish
  ↓
applyDynamicChallenges() adds weather/events
  ↓
Store in gameStore.main_dish_challenge
  ↓
Display challenge with cinematic presentation
  ↓
Players accept and begin ingredient collection
```

### Singapore Dishes Database (for variety):

**Easy Difficulty**:
- Hainanese Chicken Rice
- Kaya Toast with Soft-Boiled Eggs
- Mee Goreng
- Roti Prata with Curry
- Carrot Cake (Chai Tow Kway)

**Medium Difficulty**:
- Laksa (Curry or Asam)
- Nasi Lemak with Sides
- Char Kway Teow
- Bak Kut Teh
- Satay with Peanut Sauce
- Rojak
- Hokkien Mee

**Hard Difficulty**:
- Chilli Crab
- Beef Rendang
- Fish Head Curry
- Sambal Stingray
- Kueh Pie Tee
- Otak-Otak (from scratch)

### Success Criteria:
- ✅ AI generates unique dish every new game
- ✅ Ingredients realistic and purchasable in Singapore
- ✅ Cooking methods match available game mechanics
- ✅ Dynamic challenges add variety (weather, price, time)
- ✅ Cultural story educational and authentic
- ✅ Dish caching prevents exact repeats
- ✅ Generation takes <5 seconds

### Research Tools:
- **Context7**: Research Gemini API best practices, JSON parsing, error handling
- **deepwiki**: Singapore food culture, traditional dishes, cooking methods
- **GitHub MCP**: Search similar AI generation implementations

---

## 📊 PHASE 11: ENHANCED STATISTICS & MEMORY BANK (MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic game statistics exist at `kopitalk/src/components/EnhancedGameStatistics.tsx`  
**Needed**: Memory Bank and deeper analytics

### Files to Modify/Create:

#### 1. Enhanced Statistics Component
**File**: `kopitalk/src/components/EnhancedGameStatistics.tsx` (ENHANCE)

Add Analytics:
- [ ] **Bonding Score Trends**: Line chart showing bonding level over time
- [ ] **Most Successful Activities**: Bar chart of activities by bonding points earned
- [ ] **Conversation Quality Metrics**: Average quality, total conversations, best topics
- [ ] **Time Spent Together**: Total session time, longest session, average session
- [ ] **Money Earning Breakdown**: Pie chart showing earnings by activity type
- [ ] **Digital Skills Progress** (for elderly): Before/after comparison, skill areas improved
- [ ] **Teaching Effectiveness** (for youth): Patience score, successful explanations
- [ ] **Cultural Knowledge Gained**: Topics learned, facts discovered, recipes documented

**Technical Stack**:
- Use Recharts or Chart.js for visualizations
- Data from gameStore history
- Export as PDF report

---

#### 2. Memory Bank Component
**File**: `kopitalk/src/components/MemoryBank.tsx` (NEW)

Features:

##### Recorded Stories Section:
- [ ] Audio recordings from Story Exchange activities
- [ ] Playback with transcript
- [ ] Tag by speaker (elderly/youth)
- [ ] Search by keyword
- [ ] Share via WhatsApp/email

##### Photo Albums Section:
- [ ] Photos from Neighborhood Photo Journal
- [ ] Captions and stories for each photo
- [ ] Filter by location/date/person
- [ ] Create photo slideshows
- [ ] Print-ready layouts

##### Recipe Collection:
- [ ] Traditional recipes documented during gameplay
- [ ] Elderly's handwritten notes (photo uploads)
- [ ] Youth's digital versions
- [ ] Side-by-side comparison view
- [ ] Export as family cookbook PDF

##### Language Dictionary:
- [ ] Family-specific dialect/slang dictionary
- [ ] Audio pronunciations
- [ ] Example sentences
- [ ] Quiz mode to practice
- [ ] Add new words anytime

##### Cooking Memories:
- [ ] Recordings from cooperative cooking sessions
- [ ] Tips shared by elderly
- [ ] Questions asked by youth
- [ ] Funny moments captured
- [ ] Success celebrations

##### Achievement Timeline:
- [ ] Visual timeline of all activities completed
- [ ] Milestones (first TikTok, first cooking game, etc.)
- [ ] Badges earned
- [ ] Bonding level progression
- [ ] Cultural knowledge growth

**Technical Stack**:
```typescript
interface MemoryBank {
  stories: Recording[]
  photos: PhotoAlbum[]
  recipes: Recipe[]
  dictionary: DictionaryEntry[]
  cookingMemories: Recording[]
  achievements: Achievement[]
  timeline: TimelineEvent[]
}

interface Recording {
  id: string
  type: 'story' | 'cooking_memory' | 'language' | 'other'
  speaker: 'elderly' | 'youth' | 'both'
  audioUrl: string
  transcript?: string
  duration: number
  date: Date
  tags: string[]
}

interface PhotoAlbum {
  id: string
  name: string
  photos: Photo[]
  createdDate: Date
}

interface Photo {
  id: string
  imageUrl: string
  caption: string
  story: string
  location: string
  date: Date
  takenBy: 'elderly' | 'youth'
}

interface Recipe {
  id: string
  name: string
  source: 'elderly_traditional' | 'youth_digital' | 'collaborative'
  ingredients: string[]
  instructions: string[]
  notes: string
  photos: string[]
  dateDocumented: Date
}

interface DictionaryEntry {
  id: string
  word: string
  pronunciation: string
  audioUrl?: string
  meaning: string
  exampleSentence: string
  learnedBy: 'elderly' | 'youth'
  dateAdded: Date
}
```

---

#### 3. Export Functionality
**File**: `kopitalk/src/utils/memoryExport.ts` (NEW)

Export Options:
- [ ] **PDF Report**: Complete memory bank as formatted PDF
- [ ] **Video Montage**: Photos + audio stories combined (use FFmpeg.js)
- [ ] **WhatsApp Share**: Shareable links for individual memories
- [ ] **Print-Friendly**: Optimized layouts for physical printing
- [ ] **JSON Backup**: Complete data backup for archival

**Technical Stack**:
- jsPDF for PDF generation
- html2canvas for screenshots
- FFmpeg.js for video creation
- Web Share API for WhatsApp/social sharing

---

#### 4. Memory Bank Access
**File**: `kopitalk/src/pages/BoardGame.tsx` and `GameNavigation.tsx`

- [ ] Add "Memory Bank" button to navigation
- [ ] Route: `/board-game/:id/memory-bank`
- [ ] Show notification badge when new memories added
- [ ] Quick access from dashboard

### Success Criteria:
- ✅ All memories saved and organized by type
- ✅ Easy search and filter functionality
- ✅ Export to PDF works reliably
- ✅ Statistics show meaningful bonding trends
- ✅ Achievements visualized attractively
- ✅ Family can relive and share memories easily

---

## 🧪 PHASE 12: TESTING & POLISH (FINAL PHASE)

### Status: Not Started 🔴

### Unit Testing:

#### gameStore Tests:
- [ ] Test bonding level updates
- [ ] Test activity completion tracking
- [ ] Test persistence (localStorage)
- [ ] Test EZ-Link balance management
- [ ] Test custom board storage
- [ ] Test dish challenge storage

#### AI Functions Tests:
- [ ] Test conversation analysis accuracy
- [ ] Test dish generation variety
- [ ] Test board recognition from ESP32
- [ ] Test topic suggestion relevance
- [ ] Test error handling for API failures

#### Component Tests:
- [ ] Test all 8 money-earning activities
- [ ] Test BoardBuilderModal drag-drop
- [ ] Test CookingGameMode all 6 methods
- [ ] Test MRTStation route planning
- [ ] Test SupermarketSelfOrder checkout flow
- [ ] Test Memory Bank data display

---

### Integration Testing:

#### ESP32 Flow:
- [ ] ESP32-CAM captures physical board
- [ ] Server receives and processes image
- [ ] Gemini Vision analyzes layout
- [ ] App displays player positions correctly
- [ ] Position updates every 10 seconds
- [ ] Handle camera disconnection gracefully

#### Gemini API:
- [ ] Test conversation analysis response time (<3 seconds)
- [ ] Test dish generation quality and variety
- [ ] Test topic suggestions relevance
- [ ] Test rate limiting handling
- [ ] Test API key expiration handling
- [ ] Test offline fallback

#### Game Flow:
- [ ] Family setup → Board building → Dish generation
- [ ] Conversation → Movement → Activity completion
- [ ] Ingredient collection → Cooking game → Rewards
- [ ] MRT usage → EZ-Link deduction → Top-up
- [ ] Save/load game sessions
- [ ] Multi-session continuity

---

### User Acceptance Testing:

#### Elderly Users (65+):
- [ ] Can navigate delivery app without assistance
- [ ] Can complete supermarket self-order
- [ ] Can record TikTok videos with youth help
- [ ] Understand and use EZ-Link system
- [ ] Feel comfortable with app interface
- [ ] Report increased digital confidence

#### Youth Users (10-25):
- [ ] Understand wet market concepts
- [ ] Learn traditional cooking techniques
- [ ] Appreciate cultural stories
- [ ] Patient when teaching elderly
- [ ] Engaged throughout gameplay
- [ ] Report learning something new

#### Family Groups:
- [ ] Complete full gameplay (start to finish)
- [ ] Report increased family bonding
- [ ] Have meaningful conversations
- [ ] Create lasting memories
- [ ] Want to play again
- [ ] Recommend to other families

---

### Performance Testing:

#### Load Time:
- [ ] Initial app load <2 seconds
- [ ] Page transitions <500ms
- [ ] ESP32 image processing <2 seconds
- [ ] Gemini API responses <3 seconds
- [ ] Memory Bank loads <1 second

#### Bundle Size:
- [ ] Total bundle size <2MB
- [ ] Code splitting for routes
- [ ] Lazy loading for images
- [ ] Optimize Framer Motion animations
- [ ] Remove unused dependencies

#### Mobile Devices:
- [ ] Test on Android 10+ devices
- [ ] Test on iOS 14+ devices
- [ ] Responsive design (320px to 1920px)
- [ ] Touch interactions work smoothly
- [ ] Camera access works reliably

#### localStorage Limits:
- [ ] Test with 100+ recordings
- [ ] Test with 500+ photos
- [ ] Handle quota exceeded errors
- [ ] Implement data cleanup options
- [ ] Warn users when approaching limits

---

### Accessibility Testing:

#### Visual:
- [ ] High contrast mode for elderly
- [ ] Large text option (minimum 18px)
- [ ] Color-blind friendly palette
- [ ] Clear focus indicators
- [ ] Sufficient color contrast (WCAG AA)

#### Audio:
- [ ] Screen reader support (ARIA labels)
- [ ] Voice guidance option
- [ ] Audio captions for videos
- [ ] Volume controls accessible
- [ ] Alternative text for all images

#### Motor:
- [ ] Large touch targets (minimum 44x44px)
- [ ] No precise timing required
- [ ] Keyboard navigation support
- [ ] Gesture alternatives
- [ ] Undo/redo functionality

#### Language:
- [ ] English interface
- [ ] Mandarin Chinese option
- [ ] Dialect audio support (Hokkien, Cantonese)
- [ ] Simple language mode (lower reading level)
- [ ] Visual instructions (not just text)

---

### Browser Compatibility:

- [ ] Chrome 90+ (desktop and mobile)
- [ ] Safari 14+ (iOS and macOS)
- [ ] Firefox 88+
- [ ] Edge 90+
- [ ] Samsung Internet 14+

---

### Documentation Testing:

#### User Manual:
- [ ] Create comprehensive user manual (English)
- [ ] Translate to Mandarin
- [ ] Include screenshots and diagrams
- [ ] Step-by-step tutorials for each feature
- [ ] Troubleshooting section

#### Setup Guides:
- [ ] ESP32-CAM assembly guide (photos)
- [ ] Board building tutorial (video)
- [ ] Activity guide with examples
- [ ] Troubleshooting common issues
- [ ] FAQ section

#### Developer Docs:
- [ ] API documentation
- [ ] Component library docs
- [ ] State management guide
- [ ] Deployment instructions
- [ ] Contributing guidelines

---

### Success Criteria:

#### Technical:
- ✅ All tests passing (100% critical paths)
- ✅ Zero compilation errors
- ✅ Performance benchmarks met
- ✅ Accessibility WCAG AA compliant
- ✅ Documentation complete and accurate

#### User Experience:
- ✅ 90%+ task completion rate
- ✅ Average SUS score >80 (System Usability Scale)
- ✅ Elderly report increased digital confidence
- ✅ Youth report learning cultural knowledge
- ✅ Families report stronger bonds

#### Business:
- ✅ Ready for pilot testing with 10-20 families
- ✅ Feedback collection system in place
- ✅ Iteration plan based on feedback
- ✅ Marketing materials prepared
- ✅ Support system established

---

## 🎨 ONGOING: UI/UX IMPROVEMENTS

### Design System:

#### Color Palette:
- **Kopi Brown**: `#8B4513` (primary, warm, traditional)
- **Talk Teal**: `#20B2AA` (secondary, modern, digital)
- **Warmth Orange**: `#FF8C42` (accent, energy)
- **Heritage Gold**: `#FFD700` (highlights, achievements)
- **Neutral Gray**: `#F5F5F5` (backgrounds)
- **Text Dark**: `#2C3E50` (primary text)

#### Typography:
- **Headings**: Inter Bold (24px-48px)
- **Body**: Inter Regular (16px-18px for elderly, 14px-16px for youth)
- **Monospace**: Fira Code (for code/data display)
- **Minimum size**: 18px for elderly-focused screens

#### Spacing:
- Base unit: 8px
- Touch targets: minimum 44x44px
- Padding: 16px (mobile), 24px (tablet), 32px (desktop)
- Section gaps: 32px (mobile), 48px (tablet), 64px (desktop)

---

### Animations (Framer Motion):

#### Transitions:
- Page transitions: `duration: 0.3s, ease: "easeInOut"`
- Modal animations: `slide-in-out` from bottom
- Card hover: `scale: 1.05, duration: 0.2s`
- Button clicks: `scale: 0.95, duration: 0.1s`

#### Celebrations:
- Activity completion: Confetti animation
- Bonding milestone: Heart particles
- Dish completion: Fireworks effect
- Achievement unlock: Shine and bounce

#### Loading States:
- Skeleton screens for content loading
- Spinner for API calls
- Progress bars for long operations
- Optimistic UI updates

---

### Responsive Design:

#### Mobile First (320px-767px):
- Single column layout
- Bottom navigation
- Slide-out menus
- Large touch targets
- Simplified navigation

#### Tablet (768px-1023px):
- Two-column layout where appropriate
- Side navigation available
- Increased spacing
- More information density

#### Desktop (1024px+):
- Three-column layout for dashboards
- Persistent navigation
- Hover states
- Keyboard shortcuts
- Multi-window support

---

## 📅 RECOMMENDED SPRINT SCHEDULE

### Sprint 1 (Week 1-2): Foundation Complete + Planning
**Goal**: Complete documentation consolidation and plan Phase 5

**Tasks**:
- ✅ Create IMPLEMENTATION_ROADMAP.md (this document)
- ✅ Archive old TODO documents
- ✅ Update PROJECT_PURPOSE_AND_FLOW.md with physical board clarification
- ✅ Update instructions.instructions.md
- [ ] Research 8 money-earning activities using Context7, deepwiki, GitHub MCP
- [ ] Create activity implementation plan with wireframes
- [ ] Design Memory Bank interface mockups

**Deliverables**:
- Consolidated documentation
- Activity research report
- UI mockups for Phase 5-6

---

### Sprint 2 (Week 3-4): Money-Earning Activities (Part 1)
**Goal**: Implement first 4 activities

**Tasks**:
- [ ] Create `kopitalk/src/components/activities/` directory
- [ ] Implement StoryExchange.tsx
- [ ] Implement ReverseTeaching.tsx
- [ ] Implement JointShopping.tsx
- [ ] Implement RecipeRecreation.tsx
- [ ] Create activities index file
- [ ] Integrate with ActivitiesHub
- [ ] Test each activity end-to-end

**Deliverables**:
- 4 fully functional activities
- Activity completion tracking in gameStore
- Unit tests for activities

---

### Sprint 3 (Week 5-6): Money-Earning Activities (Part 2) + AI Dish Generation
**Goal**: Complete remaining 4 activities and AI dish generation

**Tasks**:
- [ ] Implement PhotoJournal.tsx
- [ ] Implement LanguageBridge.tsx
- [ ] Implement MenuPlanning.tsx
- [ ] Implement TransportTutorial.tsx
- [ ] Create aiDishGenerator.ts
- [ ] Enhance GameStartChallenge.tsx
- [ ] Integrate Gemini API for dishes
- [ ] Test dish generation variety (generate 50 dishes, check uniqueness)

**Deliverables**:
- 8 total activities complete
- AI dish generation working
- Dish database with 15+ Singapore dishes

---

### Sprint 4 (Week 7-8): Enhanced Shopping & Cooking
**Goal**: Improve supermarket, delivery app, and cooking game

**Tasks**:
- [ ] Enhance SupermarketSelfOrder.tsx with learning mode
- [ ] Enhance DeliveryApp.tsx with comparisons
- [ ] Complete overhaul of CookingGameMode.tsx
- [ ] Implement all 6 cooking methods
- [ ] Create CooperativeCookingInterface.tsx
- [ ] Add conversation prompts during cooking
- [ ] Test cooperative mechanics with 2+ players

**Deliverables**:
- Enhanced shopping experiences
- Cooperative cooking game complete
- All 6 cooking methods functional

---

### Sprint 5 (Week 9-10): MRT, Memory Bank, Statistics
**Goal**: Complete MRT enhancements, build Memory Bank, enhance statistics

**Tasks**:
- [ ] Enhance MRTStation.tsx with transport facts
- [ ] Enhance BusTimings.tsx with real-time data
- [ ] Create MemoryBank.tsx component
- [ ] Implement all memory sections (stories, photos, recipes, etc.)
- [ ] Create memoryExport.ts with PDF generation
- [ ] Enhance EnhancedGameStatistics.tsx with charts
- [ ] Add Memory Bank to navigation

**Deliverables**:
- Enhanced MRT experience
- Fully functional Memory Bank
- Advanced statistics dashboard

---

### Sprint 6 (Week 11-12): Testing, Polish, Documentation
**Goal**: Complete all testing, fix bugs, finalize documentation

**Tasks**:
- [ ] Write unit tests for all new components
- [ ] Conduct integration testing (ESP32, Gemini API, game flow)
- [ ] User acceptance testing with 5-10 families
- [ ] Performance optimization (bundle size, load times)
- [ ] Accessibility audit and fixes
- [ ] Create user manual (English + Mandarin)
- [ ] Create setup guides (ESP32, board building)
- [ ] Final bug fixes and polish

**Deliverables**:
- All tests passing
- User manual complete
- Bug-free release candidate
- Pilot testing feedback report

---

## 🔧 TECHNICAL STACK REFERENCE

### Frontend:
- **React** 18+ with TypeScript
- **Vite** 5+ for build tooling
- **Zustand** 4+ for state management (with persist middleware)
- **Framer Motion** 11+ for animations and drag-drop
- **Tailwind CSS** 3+ for styling
- **React Router** 6+ for navigation

### APIs & Integrations:
- **Google Gemini API** (gemini-2.0-flash-lite model)
  - API Key: `AIzaSyBybuyQNzcIMgM1vnrgsFOYJPLLQIC5UU0`
  - Usage: Conversation analysis, dish generation, board vision
- **ESP32-CAM** for player position tracking on physical board
- **LTA DataMall API** for real-time bus/MRT data
- **Nutrition API** (Nutritionix or USDA) for menu planning
- **Web Speech API** for voice guidance and search

### Backend:
- **FastAPI** (Python) for computer vision processing
- **Gemini Vision API** for ESP32 image analysis
- Server runs on separate port for ESP32 communication

### Development Tools:
- **Context7**: For library documentation and best practices
- **GitHub MCP**: For searching similar implementations
- **deepwiki**: For research on Singapore culture, food, digital literacy

### Best Practices:

#### Zustand State Management:
```typescript
// Colocated actions pattern
const useGameStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // State
      bonding_level: 0,
      family_budget: 0,
      
      // Actions
      increaseBondingLevel: (amount, reason) =>
        set((state) => ({
          bonding_level: Math.min(100, state.bonding_level + amount),
          bondingHistory: [...state.bondingHistory, { amount, reason, timestamp: Date.now() }]
        }))
    }),
    {
      name: 'game-store',
      partialize: (state) => ({
        bonding_level: state.bonding_level,
        family_budget: state.family_budget,
        // Only persist essential state
      })
    }
  )
)
```

#### Framer Motion Animations:
```typescript
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>

// Drag and drop
<motion.div
  drag
  dragConstraints={containerRef}
  dragElastic={0.1}
  whileDrag={{ scale: 1.1 }}
>
  {tile}
</motion.div>
```

#### TypeScript Best Practices:
- Use interfaces for all props and state
- Strict mode enabled
- No `any` types
- Comprehensive type definitions in `types.ts`

---

## 🐛 KNOWN ISSUES

### Critical:
- None currently ✅

### Non-Critical:
- CSS conflict in CRITICAL_FIXES_SUMMARY.md (line 142: duplicate `absolute` in `absolute top-2 left-2 absolute`)
  - Does not affect functionality
  - Can fix during polish phase

---

## 💡 FUTURE ENHANCEMENTS (Post-Launch)

### Phase 13+:

#### Multi-Language Support:
- [ ] Full Mandarin Chinese interface
- [ ] Malay language option
- [ ] Tamil language option
- [ ] Dialect audio (Hokkien, Cantonese, Teochew)

#### Remote Family Features:
- [ ] Video call integration (Zoom, Google Meet)
- [ ] Remote multiplayer (families in different locations)
- [ ] Async gameplay (take turns across days)
- [ ] Share Memory Bank across families

#### Advanced Technology:
- [ ] AR overlay for physical board (AR.js or WebXR)
- [ ] Voice control for hands-free operation
- [ ] AI-powered conversation partner (for solo practice)
- [ ] Smart home integration (Alexa, Google Home)

#### Community Features:
- [ ] Share custom boards with community
- [ ] Leaderboards (optional, non-competitive)
- [ ] Community recipe collection
- [ ] Featured family stories

#### Educational Partnerships:
- [ ] Singapore Tourism Board collaboration
- [ ] Hawker center real-life challenges
- [ ] Museum integration (cultural learning)
- [ ] School curriculum alignment

#### Gamification (Optional):
- [ ] Achievement badges with progress tracking
- [ ] Collectible Singapore landmarks
- [ ] Seasonal events (festivals, holidays)
- [ ] Daily challenges for continuous engagement

---

## 📞 SUPPORT & RESOURCES

### Documentation:
- **This File**: Complete implementation roadmap
- **PROJECT_PURPOSE_AND_FLOW.md**: Game design and flow
- **CRITICAL_FIXES_SUMMARY.md**: Bug fixes completed
- **instructions.instructions.md**: Project instructions and context

### External Resources:
- **Zustand**: https://github.com/pmndrs/zustand
- **Framer Motion**: https://www.framer.com/motion/
- **Gemini API**: https://ai.google.dev/gemini-api/docs
- **LTA DataMall**: https://datamall.lta.gov.sg/content/datamall/en.html
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs/

### Research Tools:
- **Context7 MCP**: `mcp_context7_resolve-library-id` and `mcp_context7_get-library-docs`
- **GitHub MCP**: `mcp_github_*` tools for searching repos
- **deepwiki MCP**: `mcp_cognitionai_d_ask_question` and `mcp_cognitionai_d_read_wiki_*`

### Team Communication:
- GitHub Issues for bug tracking
- Documentation in `/docs` folder
- Code reviews required for all PRs
- Use clear commit messages

---

## 🎯 SUCCESS METRICS

### Technical Metrics:
- ✅ All 12 phases completed
- ✅ Zero TypeScript errors
- ✅ All tests passing (95%+ coverage)
- ✅ Performance benchmarks met
- ✅ Documentation complete and accurate

### User Experience Metrics:
- ✅ Elderly can complete full gameplay with minimal assistance
- ✅ Youth report learning meaningful cultural knowledge
- ✅ Families complete average game in 2-4 hours
- ✅ 90%+ task completion rate across all activities
- ✅ Average bonding score increases by 40+ points per session

### Impact Metrics:
- ✅ 80%+ families report stronger intergenerational bonds
- ✅ Elderly digital confidence increases by 50%+
- ✅ Youth cultural knowledge increases by 60%+
- ✅ Common ground activities identified and practiced
- ✅ Families want to play again (90%+ retention)

---

## 📋 QUICK REFERENCE: NEXT ACTIONS

**Immediate Priority (Start Here)**:

1. ✅ **Documentation Consolidation** - COMPLETE
   - ✅ Create IMPLEMENTATION_ROADMAP.md
   - ✅ Archive COMPLETE_TODO_CHECKLIST.md
   - ✅ Update instructions with physical board clarification

2. 🔄 **Research Phase 5 Activities** - START NOW
   - [ ] Use Context7 to research React activity component patterns
   - [ ] Use deepwiki to research Singapore culture, intergenerational programs
   - [ ] Use GitHub MCP to find similar activity implementations
   - [ ] Create detailed implementation plan for each activity

3. ⏳ **Implement First Activity** - NEXT
   - [ ] Create `kopitalk/src/components/activities/` directory
   - [ ] Start with StoryExchange.tsx (simplest, uses existing AudioRecordingModal)
   - [ ] Test end-to-end before moving to next activity

4. ⏳ **Continue Phase 5** - AFTER FIRST ACTIVITY
   - [ ] Implement remaining 7 activities
   - [ ] Integrate with ActivitiesHub
   - [ ] Add to GameNavigation

5. ⏳ **Phase 10: AI Dish Generation** - HIGH PRIORITY
   - [ ] Create aiDishGenerator.ts
   - [ ] Enhance GameStartChallenge.tsx
   - [ ] Test dish variety and quality

---

**Status Legend**:
- ✅ Complete
- 🔄 In Progress
- ⏳ Next Up
- 🔴 Not Started
- 🟡 Partially Complete

---

**Last Updated**: October 21, 2025  
**Next Review**: After Phase 5 completion (8 activities)  
**Maintained By**: Development Team

---

*This is the single source of truth for KopiTalk implementation. All other TODO documents are archived or reference this file.*
