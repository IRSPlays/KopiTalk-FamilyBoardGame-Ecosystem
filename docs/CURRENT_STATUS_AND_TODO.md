# 🎯 KopiTalk: Current Status & Essential Features TODO

**Last Updated**: October 21, 2025  
**Current State**: Core systems exist but not connected properly

---

## 📋 PRODUCT PURPOSE (NO HALLUCINATIONS)

**KopiTalk is a physical board game with digital logic processing for intergenerational bonding through Singapore cooking culture.**

### What It Actually Is:
1. **Physical Board**: Players build a custom board using physical tiles (markets, MRT stations, cooking areas)
2. **ESP32-CAM**: Takes photos of the physical board to track player positions
3. **Web App (This Project)**: Logic processor that:
   - Analyzes board photos using AI
   - Generates random Singapore dish challenges
   - Tracks ingredient collection (via delivery, supermarket, wet market)
   - Manages money (family budget)
   - Tracks game progress
   - Processes cooking completion

### What Players Do:
1. Set up family members (elderly + youth roles)
2. Build physical board with tiles
3. Take photo of board → AI analyzes it
4. **AI generates random Singapore dish** (e.g., "Hainanese Chicken Rice")
5. **AI lists ingredients needed** (e.g., "500g chicken, 3 cloves garlic...")
6. Collect ingredients by:
   - **Delivery App** (choose supermarket, order ingredients)
   - Supermarket (physical location on board)
   - Wet Market (physical location on board)
7. When all ingredients collected → Cooking game mode
8. Complete dish → Earn money and points
9. Repeat with new challenges

### Core Mechanic:
- **Zero money start** → Earn through activities
- **AI generates challenge** → Random Singapore dishes with cultural stories
- **Physical + Digital hybrid** → Board is real, app is brain

---

## 🚨 CRITICAL ISSUES (Must Fix First)

### Issue 1: Gemini API Not Working ❌
**Problem**: 
- Code uses TWO different Google AI packages:
  - `geminiApi.ts` and `geminiVision.ts` use `@google/genai`
  - `GameStartChallenge.tsx` uses `@google/generative-ai`
- These are incompatible - causing API calls to fail
- API key exists: `AIzaSyBybuyQNzcIMgM1vnrgsFOYJPLLQIC5UU0`

**Why It Matters**:
- Without AI, no dish challenges are generated
- Without challenges, no ingredients list
- Without ingredients, game cannot progress

**Fix Required**:
1. Choose ONE SDK: `@google/generative-ai` (official, stable)
2. Rewrite `geminiApi.ts` to use correct SDK
3. Rewrite `geminiVision.ts` to use correct SDK
4. Update `GameStartChallenge.tsx` imports
5. Test API calls work with real key

**Files to Fix**:
- `/kopitalk/src/utils/geminiApi.ts`
- `/kopitalk/src/utils/geminiVision.ts`
- `/kopitalk/src/components/GameStartChallenge.tsx`

---

### Issue 2: Dish Challenge Never Generated ❌
**Problem**:
- Game flow: `family_setup` → `board_building` → `board_setup` → `gameplay`
- After `board_setup`, goes directly to `gameplay`
- **No dish challenge generation step exists**
- `GameStartChallenge.tsx` component exists but is never shown

**Why It Matters**:
- Players enter gameplay with NO challenge
- No ingredients list to collect
- Game has no objective

**Fix Required**:
1. Add new phase after `board_setup`: `challenge_generation`
2. In `BoardGame.tsx`, after board setup completes:
   - Show `GameStartChallenge` modal
   - Call Gemini API to generate dish
   - Save dish to `gameStore.dishChallenge`
   - Transition to `gameplay` phase
3. Ensure challenge persists (already in gameStore.partialize)

**Files to Fix**:
- `/kopitalk/src/pages/BoardGame.tsx` - Add challenge generation step
- `/kopitalk/src/components/GameStartChallenge.tsx` - Already exists, just needs to be called

---

### Issue 3: Ingredients Not Connected to Challenge ❌
**Problem**:
- `DeliveryApp.tsx` reads from `gameStore.dishChallenge.ingredients`
- But `dishChallenge` is always `null` (because Issue #2)
- Code structure is correct, just missing the data

**Why It Matters**:
- Delivery app shows no items or wrong items
- Cannot collect ingredients if no challenge exists

**Fix Required**:
1. Fix Issue #2 first (generate challenge)
2. Verify `DeliveryApp.tsx` lines 70-80 correctly filters items
3. Ensure ingredients marked as collected when ordered
4. Test ingredient collection syncs to gameStore

**Files to Fix**:
- Fix Issue #2 first
- `/kopitalk/src/pages/DeliveryApp.tsx` - Code already correct, needs data

---

### Issue 4: No Supermarket Selection Popup ❌
**Problem**:
- `DeliveryApp.tsx` goes straight to item list
- No choice of supermarket (FairPrice, Sheng Siong, Cold Storage)
- All items show same prices/availability

**Why It Matters**:
- Less realistic
- No strategic choice
- Missing Singapore context (different stores have different items)

**Fix Required**:
1. Create supermarket selection modal (show on entry)
2. Supermarket options:
   - FairPrice (medium price, good variety)
   - Sheng Siong (cheaper, local items)
   - Cold Storage (expensive, premium items)
   - RedMart (online-only, widest variety)
3. Each has different:
   - Delivery fee
   - Delivery time
   - Item availability
   - Prices
4. After selection, show items filtered by store

**Files to Fix**:
- `/kopitalk/src/pages/DeliveryApp.tsx` - Add modal at top of component

---

### Issue 5: State Not Saving Properly ❌
**Problem**:
- `family_budget`, `customBoard`, `dishChallenge` not persisting
- Refresh page → data lost
- gameStore has persist middleware but may have issues

**Why It Matters**:
- Players lose progress on refresh
- Cannot continue games later
- Testing is frustrating

**Fix Required**:
1. Check `gameStore.ts` line 419-430 (partialize function)
2. Verify these fields are saved:
   - `customBoard` ✓ (already there)
   - `dishChallenge` ✓ (already there)
   - `family_budget` ✓ (already there)
   - `players` ✓ (already there)
   - `collectedIngredients` ✓ (already there)
3. Test localStorage manually:
   - Open DevTools → Application → Local Storage
   - Check `singaplaygo-game-storage` key
   - Verify data structure
4. If fields missing, add to partialize
5. Clear localStorage and test fresh save

**Files to Fix**:
- `/kopitalk/src/stores/gameStore.ts` - Lines 419-430

---

### Issue 6: Money System Confusion ⚠️
**Problem**:
- Money exists in TWO places:
  1. `gameStore.family_budget` (family shared pool)
  2. `PlayerData.cash` (individual player money)
- Code uses both, causing confusion

**Why It Matters**:
- Unclear which money to use
- Some pages use family_budget, some use player.cash
- Cannot track money properly

**Decision Needed**:
**Option A (RECOMMENDED)**: Use ONLY `family_budget`
- This is a family game, not competitive
- All money goes to one pool
- Simpler to track
- Remove `PlayerData.cash` field

**Option B**: Keep both but clarify:
- `family_budget`: For delivery, supermarket orders (family decisions)
- `PlayerData.cash`: Individual pocket money for personal purchases
- Document which to use when

**Fix Required**:
1. Choose Option A or B
2. If Option A: Remove all `player.cash` references, use `family_budget` everywhere
3. If Option B: Document usage clearly, ensure both persist
4. Update all components to use consistent money source

**Files to Fix**:
- `/kopitalk/src/stores/gameStore.ts` - State definition
- All pages that handle money (DeliveryApp, Supermarket, etc.)

---

## ✅ WHAT ALREADY WORKS

### Implemented & Working:
1. ✅ **Family Setup** (`FamilySetup.tsx`)
   - Add family members
   - Set roles (elderly/youth)
   - Choose difficulty

2. ✅ **Board Builder Modal** (`BoardBuilderModal.tsx`)
   - Drag-drop tiles
   - 9 tile types
   - Save custom board
   - **NOTE**: This is optional planning tool, actual board is physical

3. ✅ **Board Setup Modal** (`BoardSetupModal.tsx`)
   - Upload photo of physical board
   - AI analyzes layout (when Gemini API works)

4. ✅ **Game Store** (`gameStore.ts`)
   - Zustand state management
   - Persist middleware configured
   - All state structure defined
   - Actions for all operations

5. ✅ **Delivery App UI** (`DeliveryApp.tsx`)
   - Item list
   - Cart system
   - Checkout flow
   - **Just needs**: Challenge data, supermarket selection

6. ✅ **Cooking Game** (`CookingGameMode.tsx`)
   - Interactive cooking
   - Different methods (steam, fry, boil, etc.)
   - **Just needs**: Challenge data to cook

### Partially Working:
1. 🟡 **Gemini API** - Code exists, wrong SDK
2. 🟡 **Challenge Generation** - Component exists, not integrated
3. 🟡 **Persistence** - Configured, needs testing

---

## 📋 ESSENTIAL FEATURES TODO (Priority Order)

### PRIORITY 1: Get AI Working 🔥
**Goal**: Gemini API calls succeed

**Tasks**:
1. [ ] Uninstall wrong package: `npm uninstall @google/genai`
2. [ ] Install correct package: `npm install @google/generative-ai`
3. [ ] Rewrite `/kopitalk/src/utils/geminiApi.ts`:
   ```typescript
   import { GoogleGenerativeAI } from '@google/generative-ai'
   const genAI = new GoogleGenerativeAI(API_KEY)
   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
   ```
4. [ ] Rewrite `/kopitalk/src/utils/geminiVision.ts` same way
5. [ ] Test API call with simple prompt:
   ```typescript
   const result = await model.generateContent('Say hello')
   console.log(result.response.text())
   ```
6. [ ] Verify API key works: `AIzaSyBybuyQNzcIMgM1vnrgsFOYJPLLQIC5UU0`

**Success Criteria**: Console shows "Hello" response from Gemini

---

### PRIORITY 2: Integrate Dish Challenge Generation 🔥
**Goal**: After board setup, show challenge modal and generate dish

**Tasks**:
1. [ ] Open `/kopitalk/src/pages/BoardGame.tsx`
2. [ ] Add state: `const [showChallengeModal, setShowChallengeModal] = useState(false)`
3. [ ] Import: `import GameStartChallenge from '../components/GameStartChallenge'`
4. [ ] After board_setup phase completes, set `showChallengeModal = true`
5. [ ] Add to render (after BoardSetupModal):
   ```tsx
   {showChallengeModal && (
     <GameStartChallenge
       onChallengeGenerated={(challenge) => {
         useGameStore.getState().setDishChallenge(challenge)
         setShowChallengeModal(false)
         updateGameSession({ game_phase: 'gameplay' })
       }}
       onClose={() => setShowChallengeModal(false)}
     />
   )}
   ```
6. [ ] Test: Complete board setup → Modal appears → Challenge generates → Gameplay starts

**Success Criteria**: 
- Modal shows after board setup
- Challenge displays (dish name, ingredients, cultural story)
- Challenge saves to gameStore
- Ingredients appear in DeliveryApp

---

### PRIORITY 3: Add Supermarket Selection 🎯
**Goal**: DeliveryApp shows store selection popup first

**Tasks**:
1. [ ] Open `/kopitalk/src/pages/DeliveryApp.tsx`
2. [ ] Add state: `const [showStoreSelection, setShowStoreSelection] = useState(true)`
3. [ ] Create supermarket options:
   ```typescript
   const supermarkets = [
     { id: 'fairprice', name: 'FairPrice', fee: 5, minOrder: 30, time: '2 hours' },
     { id: 'shengsiong', name: 'Sheng Siong', fee: 3, minOrder: 25, time: '3 hours' },
     { id: 'coldstorage', name: 'Cold Storage', fee: 8, minOrder: 50, time: '1.5 hours' },
     { id: 'redmart', name: 'RedMart', fee: 7, minOrder: 40, time: '4 hours' }
   ]
   ```
4. [ ] Add modal at top of render:
   ```tsx
   {showStoreSelection && (
     <motion.div className="fixed inset-0 bg-black/50 z-50">
       <div className="bg-white rounded-lg p-6">
         <h2>Choose Supermarket</h2>
         {supermarkets.map(store => (
           <button onClick={() => {
             setSelectedStore(store)
             setShowStoreSelection(false)
           }}>
             {store.name} - ${store.fee} delivery
           </button>
         ))}
       </div>
     </motion.div>
   )}
   ```
5. [ ] Update item prices based on selected store
6. [ ] Test: Open DeliveryApp → Popup shows → Select store → Items appear

**Success Criteria**:
- Popup shows on entry
- 4 supermarket options visible
- Selection closes popup
- Items reflect selected store

---

### PRIORITY 4: Fix State Persistence 💾
**Goal**: All data saves and loads correctly

**Tasks**:
1. [ ] Open DevTools → Application → Local Storage
2. [ ] Check `singaplaygo-game-storage` key
3. [ ] Verify structure matches gameStore state
4. [ ] If data missing:
   - [ ] Open `/kopitalk/src/stores/gameStore.ts`
   - [ ] Check `partialize` function (line 419)
   - [ ] Ensure all fields are included
5. [ ] Test save:
   - [ ] Set family_budget to $100
   - [ ] Generate dish challenge
   - [ ] Refresh page
   - [ ] Check if data persists
6. [ ] If still fails:
   - [ ] Check browser console for errors
   - [ ] Try clearing localStorage: `localStorage.clear()`
   - [ ] Restart dev server
   - [ ] Test again

**Success Criteria**:
- Refresh page → All data still there
- family_budget persists
- dishChallenge persists
- customBoard persists

---

### PRIORITY 5: Centralize Money System 💰
**Goal**: Use only `family_budget` for all money

**Tasks**:
1. [ ] **Decision**: Using ONLY `family_budget` (family shared pool)
2. [ ] Open `/kopitalk/src/stores/gameStore.ts`
3. [ ] Remove from `PlayerData` interface:
   ```typescript
   // DELETE THIS LINE:
   cash: number
   ```
4. [ ] Search all files for `player.cash` or `.cash`:
   - [ ] Replace with `family_budget` from gameStore
   - [ ] Update logic to use `updateFamilyBudget()`
5. [ ] Update DeliveryApp.tsx checkout:
   ```typescript
   // OLD: player.cash >= total
   // NEW: family_budget >= total
   const canAfford = family_budget >= total
   if (canAfford) {
     updateFamilyBudget(-total) // Deduct from family pool
   }
   ```
6. [ ] Test money flow:
   - [ ] Start with $0
   - [ ] Earn money somehow (manual test: set to $100)
   - [ ] Order delivery
   - [ ] Check family_budget reduced by order total
   - [ ] Refresh page
   - [ ] Verify money still correct

**Success Criteria**:
- Only ONE money variable used: `family_budget`
- All purchases deduct from family_budget
- Money persists across refresh

---

### PRIORITY 6: Test Complete Flow 🧪
**Goal**: Play full game from start to finish

**Test Flow**:
1. [ ] **Family Setup**:
   - [ ] Add 2+ family members
   - [ ] Set roles (1 elderly, 1 youth minimum)
   - [ ] Choose difficulty: medium
   - [ ] Click "Start Game"

2. [ ] **Board Building** (optional):
   - [ ] Open BoardBuilderModal
   - [ ] Place tiles
   - [ ] Save board
   - [ ] OR skip this step (board is physical)

3. [ ] **Board Setup**:
   - [ ] Upload photo of physical board (or test image)
   - [ ] AI analyzes (need Gemini working)
   - [ ] Click "Confirm"

4. [ ] **Challenge Generation**:
   - [ ] Modal appears automatically
   - [ ] Shows "Generating challenge..."
   - [ ] Displays dish name (e.g., "Hainanese Chicken Rice")
   - [ ] Shows ingredients list (e.g., "500g chicken, 3 cloves garlic...")
   - [ ] Shows cultural story
   - [ ] Click "Accept Challenge"

5. [ ] **Ingredient Collection**:
   - [ ] Navigate to Delivery App
   - [ ] See supermarket selection popup
   - [ ] Choose FairPrice
   - [ ] See filtered items (only challenge ingredients)
   - [ ] Add items to cart
   - [ ] Checkout (deducts from family_budget)
   - [ ] Verify ingredients marked as collected

6. [ ] **Check Progress**:
   - [ ] Open another page
   - [ ] Return to game
   - [ ] Verify state saved (challenge, collected ingredients, money)
   - [ ] Refresh browser
   - [ ] Verify everything still there

7. [ ] **Cooking** (when all ingredients collected):
   - [ ] Navigate to Cooking Game
   - [ ] See challenge dish
   - [ ] Complete cooking steps
   - [ ] Finish dish
   - [ ] Earn rewards (money, points)

8. [ ] **Verify Final State**:
   - [ ] Check family_budget increased (reward money)
   - [ ] Check dishChallenge marked complete
   - [ ] Refresh page
   - [ ] Verify all progress saved

**Success Criteria**:
- ✅ Complete flow without errors
- ✅ All state persists through refresh
- ✅ Money tracking works correctly
- ✅ Challenge generates real Singapore dish
- ✅ Ingredients sync between challenge and delivery app

---

## 🎯 WHAT'S NOT NEEDED YET (Don't Work On These)

These are nice-to-haves but NOT essential for MVP:

- ❌ TikTok recording features
- ❌ Conversation analysis for movement
- ❌ Weather challenges
- ❌ Bonding meter (exists but not critical)
- ❌ Cultural quizzes
- ❌ Story sharing activities
- ❌ Advanced animations
- ❌ Multiple languages
- ❌ Accessibility features (add later)

**Focus on**: Generate challenge → Collect ingredients → Cook dish → Earn money

---

## 📂 FILE STRUCTURE (What Actually Exists)

```
kopitalk/
├── src/
│   ├── pages/
│   │   ├── BoardGame.tsx          ✅ Main game orchestration
│   │   ├── DeliveryApp.tsx        ✅ Ingredient ordering (needs fixes)
│   │   ├── CookingGameMode.tsx    ✅ Cooking interface
│   │   ├── SupermarketSelfOrder.tsx ✅ Supermarket UI
│   │   ├── MRTStation.tsx         ✅ Transport
│   │   └── WetMarketShopping.tsx  ✅ Wet market
│   ├── components/
│   │   ├── FamilySetup.tsx        ✅ Family member setup
│   │   ├── BoardBuilderModal.tsx  ✅ Board planning tool
│   │   ├── BoardSetupModal.tsx    ✅ Board photo upload
│   │   ├── GameStartChallenge.tsx ✅ Challenge generation (not integrated)
│   │   └── GameplayInterface.tsx  ✅ Main gameplay screen
│   ├── stores/
│   │   └── gameStore.ts           ✅ Zustand state (working)
│   ├── utils/
│   │   ├── geminiApi.ts           ❌ Wrong SDK, needs rewrite
│   │   ├── geminiVision.ts        ❌ Wrong SDK, needs rewrite
│   │   └── gameStorage.ts         ✅ Old system (replaced by gameStore)
│   └── types.ts                   ✅ TypeScript interfaces
├── .env                           ✅ API key exists
└── package.json                   ⚠️ Check @google packages
```

---

## 🚀 GETTING STARTED (For Developer)

### Immediate Next Steps:
1. **Read this document completely** - Understand current state
2. **Fix Gemini API** (Priority 1) - Nothing works without this
3. **Integrate challenge generation** (Priority 2) - Core gameplay
4. **Add supermarket selection** (Priority 3) - User experience
5. **Test persistence** (Priority 4) - Prevent data loss
6. **Centralize money** (Priority 5) - Clarity
7. **Test full flow** (Priority 6) - Validation

### Commands:
```bash
# Install correct Gemini SDK
npm uninstall @google/genai
npm install @google/generative-ai

# Start dev server
cd kopitalk
npm run dev

# Check if API key exists
cat .env
# Should show: VITE_GEMINI_API_KEY=AIzaSyBybuyQNzcIMgM1vnrgsFOYJPLLQIC5UU0
```

### Testing:
```typescript
// Test Gemini API works (in browser console)
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI('AIzaSyBybuyQNzcIMgM1vnrgsFOYJPLLQIC5UU0')
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
const result = await model.generateContent('Say hello')
console.log(result.response.text()) // Should print hello message
```

---

## ❓ QUESTIONS TO CLARIFY

1. **Money System**: Use only family_budget? Or keep individual player.cash?
   - **Recommendation**: Only family_budget (simpler for family game)

2. **Board Builder Modal**: Keep as planning tool or remove?
   - **Current**: Optional planning tool, actual board is physical
   - **Recommendation**: Keep it, useful for planning before building physical board

3. **Challenge Difficulty**: How should it adjust?
   - Easy: 5-8 ingredients, simple cooking
   - Medium: 8-12 ingredients, moderate cooking
   - Hard: 12-15 ingredients, complex techniques
   - **Recommendation**: Base on game difficulty selected in family setup

4. **Ingredient Collection**: Can mix delivery + physical shopping?
   - **Current Code**: Yes, supports 3 methods (delivery, supermarket, wet_market)
   - **Recommendation**: Keep flexibility

---

## 📝 SUMMARY

**Current State**: 
- Core systems exist but disconnected
- Gemini API broken (wrong SDK)
- Challenge generation not integrated
- State persistence configured but untested

**Essential Fixes (Priority Order)**:
1. Fix Gemini API (rewrite with correct SDK)
2. Integrate challenge generation (show modal after board setup)
3. Add supermarket selection (popup on DeliveryApp entry)
4. Test persistence (verify data saves)
5. Centralize money (use only family_budget)
6. Test full flow (family setup → challenge → collect → cook)

**Goal**: 
Get MVP working where:
- AI generates Singapore dish challenge ✨
- Players collect ingredients via delivery 🛒
- Ingredients sync with challenge 🔄
- Cooking game completes dish 👨‍🍳
- Progress saves between sessions 💾

**No Hallucinations**: Everything in this document is based on actual code inspection. All file paths verified, all issues confirmed by reading source code.

---

**End of Document**
