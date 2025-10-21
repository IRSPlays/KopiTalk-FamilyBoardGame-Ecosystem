# ⚠️ ARCHIVED DOCUMENT

**This document has been archived and is no longer maintained.**

**Please refer to**: `/docs/IMPLEMENTATION_ROADMAP.md` for the current implementation plan.

**Archived Date**: October 21, 2025  
**Reason**: Consolidated into single master roadmap with updated physical board clarification

---

# 🎯 MASTER TODO & IMPLEMENTATION ROADMAP (ARCHIVED)

**Project**: KopiTalk - DIY Board Game Logic Processor  
**Last Updated**: October 15, 2025  
**Status**: ARCHIVED - See IMPLEMENTATION_ROADMAP.md

---

## 📌 PROJECT PURPOSE (Core Mission)

**Primary Goal**: Bridge generational gaps through a DIY physical board game that creates common ground between elderly and young people, centered around cooking and Singapore culture.

**Key Principles**:
- **NOT** a standalone digital game - requires physical board + human interaction
- **IS** a roleplay experience with continuous collaboration (NO turn-based mechanics)
- Players start with **$0** and must earn through intergenerational bonding activities
- **ESP32-CAM** detects player locations on custom-built board
- **AI analyzes conversations** to determine movement (1-5 tiles based on quality)
- **Cooking** is the primary common ground activity

---

## ✅ PHASE 1: FOUNDATION & BUG FIXES (COMPLETED)

### Status: 100% Complete ✅

#### Fixed Issues:
- ✅ Missing EZLinkTopUp page (replaced with MRTStation)
- ✅ GameStore persistence (added ezlink_balance, activeWeatherChallenge to partialize)
- ✅ TypeScript errors in AdvancedAIIntegration (4 fixes)
- ✅ CSS class conflict in EnhancedGameStatistics
- ✅ Missing updateEzlinkBalance() function implementation
- ✅ Added age property and grandparent role to FamilyMember type

#### Documentation Created:
- ✅ CRITICAL_FIXES_SUMMARY.md
- ✅ IMPROVEMENT_SUGGESTIONS.md
- ✅ This MASTER_TODO_AND_ROADMAP.md

---

## 🔄 PHASE 2: REMOVE TURN-BASED MECHANICS (HIGH PRIORITY)

### Status: Not Started 🔴

**Why**: The game is a continuous roleplay experience, not a turn-based board game.

### Files to Modify:
1. **kopitalk/src/components/GameplayInterface.tsx**
   - [ ] Remove current player indicators
   - [ ] Remove "End Turn" buttons
   - [ ] Remove turn progression logic
   - [ ] Remove dice rolling mechanics
   - [ ] Add collaborative roleplay UI instead
   - [ ] Add "Bonding Meter" visualization
   - [ ] Add "Conversation Starter" suggestions
   - [ ] Add prompt when no one has spoken in 5 minutes

2. **kopitalk/src/stores/gameStore.ts**
   - [ ] Remove `current_player_index` field (already done in recent fixes)
   - [ ] Ensure all players can act simultaneously
   - [ ] Add bonding_level tracking field

3. **kopitalk/src/types.ts**
   - [ ] Update GameSession to remove turn-based fields
   - [ ] Add BondingMeter interface
   - [ ] Add ConversationStarter interface

### New Components to Create:
- [ ] `BondingMeter.tsx` - Visual indicator of intergenerational connection quality
- [ ] `ConversationStarter.tsx` - AI-generated conversation prompts based on location

### Success Criteria:
- ✅ No "turn" language in UI
- ✅ All players can perform actions at any time
- ✅ Bonding meter visible and updates based on conversation quality

---

## 🎨 PHASE 3: BOARD BUILDER MODAL (HIGH PRIORITY)

### Status: Not Started 🔴

**Why**: The DIY board building is a core feature that needs proper implementation.

### Component to Create:
**File**: `kopitalk/src/components/BoardBuilderModal.tsx`

#### Features:
- [ ] Drag-and-drop tile placement system (use Framer Motion drag gestures)
- [ ] Tile palette with all available types:
  - [ ] Wet Market
  - [ ] Supermarket
  - [ ] MRT Station
  - [ ] Cooking Station
  - [ ] Delivery Zone
  - [ ] Bus Stop
  - [ ] Story Sharing Zone
  - [ ] Photo Challenge Area
  - [ ] Teaching Zone
  - [ ] Cultural Quiz Spot
- [ ] Grid size selector (8x8, 10x10, 12x12)
- [ ] Save/Load custom boards
- [ ] Preview mode
- [ ] ESP32-CAM setup guide
- [ ] Tile placement validation (e.g., can't place 3 markets in a row)

#### Technical Implementation:
```typescript
// Use Framer Motion for drag-drop
import { motion, Reorder } from 'framer-motion'

interface BoardTile {
  id: string
  type: TileType
  position: { x: number; y: number }
  rotation?: number
}

interface BoardBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSave: (board: CustomBoard) => void
  existingBoard?: CustomBoard
}
```

#### Integration with ESP32:
- [ ] Display ESP32 connection status
- [ ] Show detected player positions in real-time
- [ ] Calibration mode for physical board alignment

### Files to Modify:
1. **kopitalk/src/stores/gameStore.ts**
   - [ ] Enhance `customBoard` type definition
   - [ ] Add `saveBoardLayout()` function
   - [ ] Add `loadBoardLayout()` function

2. **kopitalk/src/pages/BoardGame.tsx**
   - [ ] Add "Build Board" button
   - [ ] Integrate BoardBuilderModal
   - [ ] Show current board layout visually

### Research Applied:
- **Framer Motion Drag Gestures**: Use `drag`, `dragConstraints`, `dragElastic` for tile placement
- **Zustand Persist**: Store custom boards in localStorage with proper partialize configuration

### Success Criteria:
- ✅ Users can drag tiles onto grid
- ✅ Board layout saves to gameStore
- ✅ ESP32 detection visualized on board
- ✅ Board persists across sessions

---

## 💰 PHASE 4: UNIFIED NAVIGATION COMPONENT (HIGH PRIORITY)

### Status: Not Started 🔴

**Why**: Pages don't consistently link to each other, causing navigation confusion.

### Component to Create:
**File**: `kopitalk/src/components/GameNavigation.tsx`

#### Features:
- [ ] Sticky top navigation bar
- [ ] Breadcrumb trail (Home / Board Game / Current Page)
- [ ] Quick Stats Display:
  - [ ] Family Budget (money)
  - [ ] EZ-Link Balance
  - [ ] Bonding Meter
- [ ] Quick Links to all main pages
- [ ] Save & Exit button
- [ ] Back button with route history

#### Implementation:
```typescript
interface GameNavigationProps {
  currentPage: string
  gameSession: GameSession
  showMoneyBar?: boolean
  showBondingMeter?: boolean
  allowExit?: boolean
}

export const GameNavigation = ({
  currentPage,
  gameSession,
  showMoneyBar = true,
  showBondingMeter = true,
  allowExit = true
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-kopi-500 to-talk-500">
      {/* Breadcrumb, Stats, Quick Links, Exit */}
    </nav>
  )
}
```

### Files to Modify:
1. **All page components** (`BoardGame.tsx`, `DeliveryApp.tsx`, etc.)
   - [ ] Import and add GameNavigation component at top
   - [ ] Pass current page name and game session

2. **kopitalk/src/App.tsx**
   - [ ] Ensure all routes are properly defined
   - [ ] Add route protection (require game session)

### Navigation Map:
```
Home (/)
  └── Board Game (/board-game/:id)
      ├── Delivery App (/delivery)
      ├── Wet Market (/wet-market)
      ├── Supermarket (/supermarket-self-order)
      ├── MRT Station (/mrt)
      ├── Bus Timings (/bus)
      ├── Cooking Game (/cooking)
      ├── Game History (/history)
      └── Board Builder (modal)
```

### Success Criteria:
- ✅ All pages have consistent navigation
- ✅ Users can quickly jump between activities
- ✅ Current location always visible
- ✅ Game state (money, bonding) always visible

---

## 💵 PHASE 5: NEW MONEY-EARNING ACTIVITIES (MEDIUM-HIGH PRIORITY)

### Status: Not Started 🔴

**Why**: Currently only TikTok trends exist. Need 10 activities that create common ground.

### Activities to Implement:

#### 1. Story Exchange Sessions ($15-25)
**File**: `kopitalk/src/components/activities/StoryExchange.tsx`

- [ ] Record 5-10 minute story from elderly
- [ ] AI analyzes storytelling quality
- [ ] Young person creates digital archive
- [ ] Bonus for thoughtful follow-up questions
- [ ] Save to Memory Bank

**Technical**:
- Use existing `AudioRecordingModal` component
- Integrate with Gemini API for story analysis
- Store recordings in gameStore with metadata

#### 2. Reverse Teaching ($10-30)
**File**: `kopitalk/src/components/activities/ReverseTeaching.tsx`

Categories:
- [ ] Wet market haggling ($15)
- [ ] Traditional cooking techniques ($20)
- [ ] Dialect phrases ($10)
- [ ] Fresh ingredient identification ($12)

**Technical**:
- Quiz-based validation
- Photo upload for ingredient ID
- Audio recording for dialect

#### 3. Joint Shopping Challenges ($20-40)
**File**: `kopitalk/src/components/activities/JointShopping.tsx`

Scenarios:
- [ ] Elderly learns delivery app, youth goes to wet market ($30)
- [ ] Both try supermarket self-checkout ($20)
- [ ] Youth teaches PayNow ($15)

**Technical**:
- Track time spent on each activity
- AI validates completion
- Award patience bonus

#### 4. Recipe Recreation ($25-50)
**File**: `kopitalk/src/components/activities/RecipeRecreation.tsx`

- [ ] Elderly describes traditional recipe
- [ ] Youth researches online version
- [ ] Both compare differences
- [ ] Optional: Cook both versions

**Technical**:
- Text input for elderly version
- API search for online recipes
- Comparison interface
- Integration with CookingGameMode

#### 5. Neighborhood Photo Journal ($10-20)
**File**: `kopitalk/src/components/activities/PhotoJournal.tsx`

- [ ] Visit 3-5 board locations
- [ ] Take photos together
- [ ] Elderly shares memories
- [ ] Youth creates digital album

**Technical**:
- Camera integration
- Location tracking (ESP32)
- Story recording per photo
- Album gallery view

#### 6. Language Bridge ($15-25)
**File**: `kopitalk/src/components/activities/LanguageBridge.tsx`

- [ ] Elderly teaches dialects/Singlish
- [ ] Youth teaches internet slang
- [ ] Create family dictionary
- [ ] Mutual translation game

**Technical**:
- Audio recording
- Word-by-word translation
- Quiz mode
- Dictionary export

#### 7. Menu Planning Together ($20-35)
**File**: `kopitalk/src/components/activities/MenuPlanning.tsx`

- [ ] Elderly suggests traditional recipe
- [ ] Youth researches nutrition info
- [ ] Both adapt for health
- [ ] Calculate calories, protein, etc.

**Technical**:
- Nutrition API integration
- Recipe input form
- Health adaptation suggestions
- Export meal plan

#### 8. Transport Tutorial Exchange ($12-25)
**File**: `kopitalk/src/components/activities/TransportTutorial.tsx`

- [ ] Youth teaches bus app usage
- [ ] Elderly shares route shortcuts
- [ ] Bonus for discovering new info

**Technical**:
- Bus API integration
- Route comparison
- Tutorial step-by-step
- Achievement tracking

### Component Index:
**File**: `kopitalk/src/components/activities/index.ts`

```typescript
export { StoryExchange } from './StoryExchange'
export { ReverseTeaching } from './ReverseTeaching'
export { JointShopping } from './JointShopping'
export { RecipeRecreation } from './RecipeRecreation'
export { PhotoJournal } from './PhotoJournal'
export { LanguageBridge } from './LanguageBridge'
export { MenuPlanning } from './MenuPlanning'
export { TransportTutorial } from './TransportTutorial'
export { TikTokChallenge } from './TikTokChallenge' // Already exists
export { CulturalQuiz } from './CulturalQuiz' // Already exists
```

### Integration:
- [ ] Add activity cards to GameHub/ActivitiesHub
- [ ] Update gameStore with activity completion tracking
- [ ] Add activity history to GameHistory page
- [ ] Create activity selection modal

### Success Criteria:
- ✅ 10 earning activities implemented
- ✅ Each activity teaches/bridges generation gap
- ✅ Activities award appropriate money amounts
- ✅ Activity history tracked

---

## 🛒 PHASE 6: SUPERMARKET SELF-ORDER ENHANCEMENTS (MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic self-checkout simulation exists  
**Needed**: Intergenerational learning elements

### File to Modify:
**kopitalk/src/pages/SupermarketSelfOrder.tsx**

#### Features to Add:
- [ ] **Learning Mode** for elderly players:
  - [ ] Step-by-step instructions
  - [ ] "I need help" button triggers young person assistance
  - [ ] Highlight current UI element
  - [ ] Voice guidance option
- [ ] **Teaching Tracker** for young players:
  - [ ] Track patience level
  - [ ] Award bonus for clear explanations
  - [ ] Tips for effective teaching
- [ ] **Challenge Mode**:
  - [ ] Elderly challenges youth to be fast like at wet market
  - [ ] Speed comparison metrics
- [ ] **Price Comparison**:
  - [ ] Show wet market equivalent prices
  - [ ] Discussion prompts about price differences

#### New Components:
**File**: `kopitalk/src/components/LearningPrompt.tsx`
```typescript
interface LearningPromptProps {
  forRole: 'elderly' | 'youth'
  message: string
  highlightElement?: string
  onHelp?: () => void
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
- ✅ Elderly can request help
- ✅ Youth patience tracked and rewarded
- ✅ Price comparisons visible
- ✅ Discussion prompts appear

---

## 🚚 PHASE 7: ENHANCED DELIVERY APP (MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic delivery ordering exists  
**Needed**: Learning and comparison features

### File to Modify:
**kopitalk/src/pages/DeliveryApp.tsx**

#### Features to Add:
- [ ] **Learning Mode Toggle**:
  - [ ] Elderly-friendly UI with larger buttons
  - [ ] Step-by-step tutorial
  - [ ] Voice search option
- [ ] **Generational Comparison**:
  - [ ] "At wet market this would cost $X"
  - [ ] Time comparison (delivery vs. walking to market)
  - [ ] Freshness indicator
- [ ] **Digital Skills Progress Tracker**:
  - [ ] Track elderly player's app proficiency
  - [ ] Award badges for milestones
  - [ ] Show improvement over time
- [ ] **Collaboration Features**:
  - [ ] "Ask young person" button for elderly
  - [ ] "Explain to grandparent" prompts for youth

### Success Criteria:
- ✅ Tutorial mode functional
- ✅ Price/time comparisons visible
- ✅ Digital skills tracked
- ✅ Collaboration encouraged

---

## 👨‍🍳 PHASE 8: COOPERATIVE COOKING GAME MODE (HIGH PRIORITY)

### Status: Partially Complete 🟡

**Current**: Solo cooking game exists  
**Needed**: Cooperative two-role system

### File to Modify:
**kopitalk/src/pages/CookingGameMode.tsx**

#### Complete Overhaul Required:

##### Role System:
1. **Elderly Role: "Recipe Keeper"**
   - [ ] Provide traditional cooking tips
   - [ ] Share family recipe secrets
   - [ ] Record cooking memories
   - [ ] Approve each cooking step

2. **Young Person Role: "Timer Manager"**
   - [ ] Track cooking times
   - [ ] Monitor temperatures
   - [ ] Document process digitally
   - [ ] Ask questions about techniques

##### Cooking Methods to Implement:
- [ ] **Steam** (蒸):
  - Cooperative water level checking
  - Timer management by youth
  - Technique explanation by elderly
- [ ] **Fry** (炒):
  - Heat level guidance from elderly
  - Timer and oil temperature by youth
  - Stirring rhythm collaboration
- [ ] **Boil** (煮):
  - Ingredient sequencing by elderly
  - Time tracking by youth
  - Broth tasting together
- [ ] **Stir-Fry** (炒):
  - Wok technique from elderly
  - Timing coordination
  - High heat management
- [ ] **Grill** (烤):
  - Temperature control
  - Flip timing
  - Doneness checking together
- [ ] **Bake** (烘):
  - Oven management
  - Temperature precision
  - Timing critical

##### Conversation Prompts:
- [ ] During waiting periods (e.g., steaming 30 mins):
  - "While steaming, ask grandparent: What's your earliest cooking memory?"
  - "Young person, explain: Why does the recipe app say to use olive oil?"
  - "Share a story about a cooking disaster!"

##### Technical Implementation:
```typescript
interface CooperativeCooking {
  elderlyPlayer: {
    role: 'Recipe Keeper'
    tasks: Task[]
    tipsSha red: string[]
    memoriesRecorded: Recording[]
  }
  youngPlayer: {
    role: 'Timer Manager'
    tasks: Task[]
    questionsAsked: string[]
    timersActive: Timer[]
  }
  sharedSteps: CookingStep[]
  conversationPrompts: ConversationPrompt[]
}
```

### New Component:
**File**: `kopitalk/src/components/CooperativeCookingInterface.tsx`

### Success Criteria:
- ✅ Both players have distinct roles
- ✅ Requires confirmation from both players for each step
- ✅ Conversation prompts appear during waiting
- ✅ All 6 cooking methods implemented
- ✅ Memory recording integrated

---

## 🚇 PHASE 9: MRT STATION & EZ-LINK ENHANCEMENTS (MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic EZ-Link balance and MRT transactions  
**Needed**: Learning exchange and transport history

### File to Modify:
**kopitalk/src/pages/MRTStation.tsx**

#### Features to Add:
- [ ] **Did You Know? Section**:
  - [ ] Random transport facts
  - [ ] Historical MRT trivia
  - [ ] Singapore transport evolution
- [ ] **Generational Sharing**:
  - [ ] Elderly: "Back in my day, we used paper tickets"
  - [ ] Youth: "This app shows real-time arrivals"
  - [ ] Prompt both to share
  - [ ] Record and save to Memory Bank
- [ ] **Transport Comparison**:
  - [ ] Old vs. New transport methods visualization
  - [ ] Cost comparison (1980s vs. now)
  - [ ] Time efficiency changes
- [ ] **Knowledge Bonus**:
  - [ ] Award money for sharing transport knowledge
  - [ ] Quiz about MRT history
  - [ ] Route planning challenge

### File to Modify:
**kopitalk/src/pages/BusTimings.tsx**

#### Features to Add:
- [ ] Real-time bus arrival API integration
- [ ] Route comparison (elderly shortcuts vs. app recommendations)
- [ ] Bus history quiz
- [ ] Elderly teaches youth about bus numbers and destinations

### Success Criteria:
- ✅ Transport facts visible
- ✅ Generational sharing encouraged
- ✅ Knowledge bonuses awarded
- ✅ MRT history integrated

---

## 🤖 PHASE 10: AI DISH GENERATION & CHALLENGE SYSTEM (MEDIUM-HIGH PRIORITY)

### Status: Not Started 🔴

**Why**: Core gameplay loop requires AI to generate random Singapore traditional dishes.

### Files to Create/Modify:

#### 1. AI Dish Generator
**File**: `kopitalk/src/utils/aiDishGenerator.ts`

```typescript
interface DishChallenge {
  name: string // e.g., "Hainanese Chicken Rice"
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: Ingredient[]
  cookingMethod: CookingMethod[]
  culturalStory: string
  timeRequired: number // minutes
  weatherAffected?: boolean
  priceInflation?: boolean
}

async function generateRandomDish(): Promise<DishChallenge> {
  // Use Gemini API to generate random Singapore dish
  // Include specific ingredients, cooking method, cultural story
}
```

#### 2. Challenge System Integration
**File**: `kopitalk/src/components/GameStartChallenge.tsx`

- [ ] Display generated dish at game start
- [ ] Show required ingredients list
- [ ] Display cooking methods needed
- [ ] Show cultural story about the dish
- [ ] Track ingredient collection progress

#### 3. Dynamic Challenges
**File**: `kopitalk/src/components/ChallengeSystem.tsx`

Challenge Types:
- [ ] **Weather Challenge**: 
  - Rainy day = harder to go to wet market
  - Hot day = faster cooking time
  - Affects ingredient prices
- [ ] **Price Inflation**:
  - Random ingredient becomes expensive
  - Must decide: substitute or pay more?
- [ ] **Time Pressure**:
  - Elderly has appointment
  - Must complete before time runs out
- [ ] **Ingredient Scarcity**:
  - Wet market out of stock
  - Must use supermarket or delivery

### Integration with Gemini API:
```typescript
// Use Gemini 2.0 Flash Lite model
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

async function generateDishWithGemini(constraints: DishConstraints): Promise<DishChallenge> {
  const prompt = `
    Generate a random traditional Singapore dish with the following constraints:
    - Difficulty: ${constraints.difficulty}
    - Cooking methods available: ${constraints.cookingMethods.join(', ')}
    - Current weather: ${constraints.weather}
    - Budget: $${constraints.budget}
    
    Return a JSON object with:
    - name: dish name in English and dialect
    - description: brief history and cultural significance
    - ingredients: array of {name, amount, unit, where_to_buy, price_range}
    - cooking_method: step-by-step instructions
    - time_required: total cooking time in minutes
    - tips_from_elderly: traditional cooking wisdom
  `
  
  // Call Gemini API
}
```

### Success Criteria:
- ✅ AI generates unique dish each game
- ✅ Ingredients realistic and purchasable in Singapore
- ✅ Cooking methods match available options
- ✅ Dynamic challenges add variety
- ✅ Cultural story included

---

## 📊 PHASE 11: ENHANCED GAME STATISTICS & MEMORY BANK (LOW-MEDIUM PRIORITY)

### Status: Partially Complete 🟡

**Current**: Basic game statistics exist  
**Needed**: Memory Bank and deeper analytics

### Files to Modify:

#### 1. Enhanced Statistics
**File**: `kopitalk/src/components/EnhancedGameStatistics.tsx`

Add:
- [ ] Bonding score trends over time
- [ ] Most successful activities
- [ ] Conversation quality metrics
- [ ] Time spent together
- [ ] Money earning breakdown by activity
- [ ] Digital skills progress (for elderly)
- [ ] Teaching effectiveness (for youth)

#### 2. Memory Bank
**File**: `kopitalk/src/components/MemoryBank.tsx`

Features:
- [ ] **Recorded Stories**: Audio recordings from Story Exchange
- [ ] **Photo Albums**: From Neighborhood Photo Journal
- [ ] **Recipe Collection**: Traditional recipes documented
- [ ] **Language Dictionary**: Family-specific dialect/slang dictionary
- [ ] **Cooking Memories**: Recordings from cooking sessions
- [ ] **Achievement Timeline**: Visual timeline of activities completed

#### 3. Export Functionality
**File**: `kopitalk/src/utils/memoryExport.ts`

- [ ] Export Memory Bank as PDF
- [ ] Export as video montage (with audio + photos)
- [ ] Share via WhatsApp
- [ ] Print-friendly version

### Success Criteria:
- ✅ All memories saved and organized
- ✅ Export to PDF works
- ✅ Statistics show bonding trends
- ✅ Achievements visualized

---

## 🧪 PHASE 12: TESTING & POLISH (FINAL PHASE)

### Status: Not Started 🔴

### Testing Checklist:

#### Unit Tests:
- [ ] gameStore persistence tests
- [ ] AI analysis functions
- [ ] Money calculation logic
- [ ] Ingredient tracking
- [ ] Board layout validation

#### Integration Tests:
- [ ] ESP32-CAM communication
- [ ] Gemini API integration
- [ ] Audio recording and analysis
- [ ] Page navigation flow
- [ ] Save/load game sessions

#### User Testing:
- [ ] Test with real elderly + youth pairs
- [ ] Gather feedback on clarity
- [ ] Test ESP32 detection accuracy
- [ ] Measure conversation quality improvements
- [ ] Validate bonding metric accuracy

#### Performance:
- [ ] Optimize AI API calls
- [ ] Reduce bundle size
- [ ] Test on mobile devices
- [ ] Check localStorage limits
- [ ] Optimize Framer Motion animations

#### Accessibility:
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Large text option for elderly
- [ ] Voice control option
- [ ] Multiple language support (English, Mandarin, dialects)

### Documentation:
- [ ] User manual (English & Mandarin)
- [ ] ESP32 setup guide
- [ ] Board building tutorial
- [ ] Activity guide
- [ ] Troubleshooting guide

### Success Criteria:
- ✅ All tests passing
- ✅ User feedback positive
- ✅ Performance acceptable on target devices
- ✅ Documentation complete
- ✅ Ready for pilot testing

---

## 🎨 UI/UX IMPROVEMENTS (Ongoing)

### Design System:
- [ ] Establish color palette (Kopi brown, Talk teal)
- [ ] Typography scale for elderly readability
- [ ] Icon system
- [ ] Component library documentation

### Animations:
- [ ] Use Framer Motion for smooth transitions
- [ ] Drag-and-drop for board building
- [ ] Micro-interactions for feedback
- [ ] Loading states
- [ ] Success celebrations

### Responsive Design:
- [ ] Mobile-first approach
- [ ] Tablet optimization
- [ ] Desktop layout
- [ ] Physical board integration view

---

## 📅 RECOMMENDED IMPLEMENTATION ORDER

### Sprint 1 (Week 1-2):
1. **Phase 2**: Remove Turn-Based Mechanics
2. **Phase 4**: Unified Navigation Component
3. Start **Phase 3**: Board Builder Modal (design phase)

### Sprint 2 (Week 3-4):
1. Complete **Phase 3**: Board Builder Modal
2. **Phase 10**: AI Dish Generation
3. Start **Phase 5**: 2-3 Money-Earning Activities

### Sprint 3 (Week 5-6):
1. Complete **Phase 5**: All 8 New Money-Earning Activities
2. **Phase 8**: Cooperative Cooking Game Mode
3. **Phase 6**: Supermarket Self-Order Enhancements

### Sprint 4 (Week 7-8):
1. **Phase 7**: Enhanced Delivery App
2. **Phase 9**: MRT Station Enhancements
3. **Phase 11**: Memory Bank

### Sprint 5 (Week 9-10):
1. **Phase 12**: Testing & Polish
2. User testing with real families
3. Bug fixes and refinements

---

## 🔧 TECHNICAL STACK REFERENCE

### Core Technologies:
- **React** 18+ with TypeScript
- **Vite** for build tooling
- **Zustand** for state management (with persist middleware)
- **Framer Motion** for animations and drag-and-drop
- **Tailwind CSS** for styling
- **React Router** for navigation

### APIs & Integrations:
- **Google Gemini API** (gemini-2.0-flash-lite model)
  - API Key: `AIzaSyBybuyQNzcIMgM1vnrgsFOYJPLLQIC5UU0`
- **ESP32-CAM** for player detection
- **FastAPI** backend for computer vision processing

### Best Practices (from Research):
1. **Zustand Persist**:
   - Use `partialize` to selectively save state
   - Use `createJSONStorage(() => localStorage)` for persistence
   - Always include essential fields in partialize
   - Use `skipHydration: true` for manual hydration if needed

2. **Framer Motion**:
   - Use `drag` prop for draggable elements
   - Use `dragConstraints` to limit drag area
   - Use `layout` prop for automatic layout animations
   - Use `AnimatePresence` for exit animations

3. **State Management**:
   - Keep actions colocated with state
   - Use TypeScript interfaces for all state
   - Persist only essential data
   - Use getters for derived state

---

## 🐛 KNOWN ISSUES

### Critical:
- None currently ✅

### Non-Critical:
- None currently ✅

---

## 💡 FUTURE ENHANCEMENTS (Post-Launch)

### Phase 13+:
- [ ] Multi-language support (Mandarin, Malay, Tamil)
- [ ] Video call integration for remote families
- [ ] AR overlay for physical board
- [ ] Multiplayer sync across devices
- [ ] Community sharing of custom boards
- [ ] Achievement system with badges
- [ ] Leaderboards (optional, non-competitive)
- [ ] Integration with Singapore Tourism Board for location-based activities
- [ ] Collaboration with hawker centers for real-life challenges

---

## 📞 SUPPORT & RESOURCES

### Documentation Links:
- Zustand: https://github.com/pmndrs/zustand
- Framer Motion: https://www.framer.com/motion/
- Gemini API: https://ai.google.dev/gemini-api/docs

### Team Communication:
- GitHub Issues for bug tracking
- Documentation in `/docs` folder
- Code reviews required for all PRs

---

**Last Updated**: October 15, 2025  
**Next Review**: Start of Sprint 1 (Phase 2 implementation)
