# Integration Guide for All Activities

## 📋 Integration Tasks Remaining

### Task #1: Integrate Board Builder
**Location**: `BoardGame.tsx` or `GameplayInterface.tsx`
**What to add**:
- Add BoardBuilderModal step before game starts
- Save custom board to gameStore
- Pass customBoard to ESP32BoardIntegration

### Task #3: Integrate Delivery App with Dish Challenge
**Location**: `GameplayInterface.tsx`
**What to add**:
1. Import GameStartChallenge component
2. Show at game start to generate dish
3. Store dishChallenge in gameStore
4. Pass requiredIngredients to DeliveryApp when clicking delivery module

### Task #4: Integrate Supermarket Self Order
**Location**: `GameplayInterface.tsx`
**What to add**:
1. Import SupermarketSelfOrder component
2. Trigger when player at supermarket tile OR via button
3. Pass requiredIngredients from gameStore.dishChallenge
4. Pass playerCash from gameStore.players[currentPlayerId]

### Task #15: Expand Cooking Methods
**Location**: `CookingGameMode.tsx`
**Add 4 new methods**:
- Boil: Temperature monitoring + timing game
- Stir-fry: Wok tossing mechanics + heat control
- Grill: Flip timing + char mark avoidance
- Bake: Oven temperature + doneness checking

### Task #16: AI Topic Suggestions
**Location**: `AudioRecordingModal.tsx`
**What to add**:
1. Check current player tile location
2. Check collected ingredients
3. Generate 3-5 conversation starters with Gemini
4. Display before recording starts

### Task #17: ESP32 Custom Board Detection
**Location**: `ESP32BoardIntegration.tsx`
**What to add**:
1. Accept customBoard prop from gameStore
2. Train ArUco markers for custom grid size
3. Validate detected positions match custom layout

### Task #19: Weather & Price Challenges
**Location**: New `WeatherChallenge.tsx` component
**What to create**:
- Random event system (rain, heat, CNY surge, etc.)
- Price multipliers (stored in gameStore.weather.effects.priceMultiplier)
- Movement penalties
- Location closures
- AI-generated contextual descriptions

### Task #22: Game Victory Screen
**Location**: New `GameVictoryScreen.tsx` component  
**What to create**:
- Check win condition: allIngredientsCollected && cookingScore >= 70%
- Display summary: dish photo, total earnings, cultural knowledge
- Options: Save recipe, start new game, free play mode

---

## 🎯 Quick Integration for Activities Hub

### Step 1: Add ActivitiesHub to GameplayInterface.tsx

```tsx
import ActivitiesHub from './ActivitiesHub'

// Add state
const [showActivitiesHub, setShowActivitiesHub] = useState(false)

// Add button in main tab
<button
  onClick={() => setShowActivitiesHub(true)}
  className="w-full p-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl"
>
  <TrendingUp className="w-8 h-8 mb-2 mx-auto" />
  <h3 className="font-bold text-xl">Activities Hub</h3>
  <p className="text-sm opacity-90">Earn money through 10+ activities</p>
</button>

// Add modal rendering
{showActivitiesHub && (
  <ActivitiesHub
    currentPlayerId={gameSession.family_members[0]?.id || 0}
    onClose={() => setShowActivitiesHub(false)}
  />
)}
```

### Step 2: Add Dish Challenge at Game Start

```tsx
import GameStartChallenge from './GameStartChallenge'

// Add state
const [showDishChallenge, setShowDishChallenge] = useState(true) // Show at start
const [dishGenerated, setDishGenerated] = useState(false)

// Add component
{showDishChallenge && !dishGenerated && (
  <GameStartChallenge
    currentPlayerId={0}
    onClose={() => {
      setShowDishChallenge(false)
      setDishGenerated(true)
    }}
  />
)}
```

### Step 3: Connect Delivery App to Required Ingredients

```tsx
// Modify startModule for delivery
const startModule = (module: SingaporeLifeModule) => {
  if (module.id === 'delivery') {
    // Navigate to delivery with state
    navigate(module.path, {
      state: {
        requiredIngredients: useGameStore.getState().dishChallenge?.ingredients || []
      }
    })
  } else {
    navigate(module.path)
  }
}
```

### Step 4: Add MRT Station Integration

```tsx
import MRTStation from './MRTStation'

// Add state
const [showMRTStation, setShowMRTStation] = useState(false)

// Add button/trigger
<button onClick={() => setShowMRTStation(true)}>
  Use MRT Station
</button>

// Add component
{showMRTStation && (
  <MRTStation
    currentPlayerId={currentPlayer}
    onClose={() => setShowMRTStation(false)}
    onTravelComplete={(destination) => {
      // Handle fast travel
      console.log(`Traveled to ${destination}`)
    }}
  />
)}
```

---

## 🔄 Full Integration Flow

```
1. Game Start
   ↓
2. GameStartChallenge (AI generates dish)
   ↓
3. Board Setup (BoardBuilderModal)
   ↓
4. Main Game Loop:
   - Move on board (ESP32/manual)
   - Trigger activities at specific tiles
   - Open ActivitiesHub anytime
   - Use MRT for fast travel
   ↓
5. Shopping Phase:
   - DeliveryApp (start tiles)
   - SupermarketSelfOrder (supermarket tiles)  
   - WetMarketShopping (market tiles)
   ↓
6. Cooking Phase:
   - CookingGameMode (when all ingredients collected)
   ↓
7. Victory:
   - GameVictoryScreen (if cooking score >= 70%)
```

---

## 📦 Component Dependencies

### ActivitiesHub requires:
- All 10 activity components
- gameStore for completedActivities tracking
- currentPlayerId prop

### GameStartChallenge requires:
- @google/generative-ai (already installed)
- VITE_GEMINI_API_KEY (optional, has fallback)
- gameStore.setDishChallenge()

### All Activity Components require:
- gameStore.addCompletedActivity()
- currentPlayerId prop
- onClose callback

---

## ✅ Testing Checklist

- [ ] ActivitiesHub opens and shows all 10 activities
- [ ] Each activity can be completed and earns money
- [ ] Money is added to family_budget via gameStore
- [ ] GameStartChallenge generates dish at game start
- [ ] Dish ingredients stored in gameStore.dishChallenge
- [ ] DeliveryApp receives requiredIngredients
- [ ] SupermarketSelfOrder highlights required ingredients
- [ ] WetMarketShopping marks ingredients as collected
- [ ] MRTStation deducts EZ-Link balance correctly
- [ ] All components persist data to localStorage

---

**Next Action**: Begin with ActivitiesHub integration (easiest), then dish challenge, then shopping integrations.
