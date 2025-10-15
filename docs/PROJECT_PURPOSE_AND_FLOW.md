# 🎮 KopiTalk - D.I.Y. Roleplay Board Game

## 🎯 Project Purpose

**KopiTalk is a D.I.Y. (Do It Yourself) roleplay board game designed to create common ground between generations (elderly and youth) through cooking and authentic Singapore experiences.**

### Core Objectives
1. **Bridge Generational Gap**: Create meaningful interactions between elderly and youth
2. **Common Ground Through Cooking**: Use food and traditional recipes as the primary bonding activity
3. **Cultural Exchange**: Elderly experience digital life, youth experience traditional markets
4. **No Role Switching**: Players maintain their roles (elderly/youth/parent/child) throughout gameplay
5. **Collaborative, Not Competitive**: Focus on family bonding, not winning

---

## 🏗️ Complete Game Flow

### Phase 1: D.I.Y. Board Building
**Players physically build their own custom game board**

- Provide parts/tiles for markets, MRT stations, wet markets, supermarkets, cooking stations
- Players arrange tiles in their preferred layout
- ESP32-CAM captures the custom board configuration
- App stores the custom board layout for position tracking

**Component**: `BoardBuilderModal.tsx` (To be created)

---

### Phase 2: AI Dish Challenge Generation
**After board is built, AI creates a random Singapore dish challenge**

**Traditional Dishes Examples**:
- Hainanese Chicken Rice
- Laksa
- Nasi Lemak
- Char Kway Teow
- Bak Kut Teh
- Chilli Crab

**Challenge Includes**:
- Dish name and description
- Specific ingredients with quantities
- Cultural context and history
- Cooking method (steam, fry, boil, etc.)
- Step-by-step cooking instructions
- Completion rewards (money, cultural knowledge, points)

**Dynamic Factors** (affected by random events):
- Weather conditions (affects market prices)
- Ingredient availability (supply issues)
- Price fluctuations
- Festival/holiday seasons

**Component**: Uses `geminiApi.ts` and `geminiVision.ts`

---

### Phase 3: Conversation-Based Movement
**Players move around the custom board through AI-analyzed conversations**

#### Before Recording:
- **AI suggests conversation topic** related to:
  - Cooking and recipes
  - Family traditions
  - Cultural heritage
  - Singapore life experiences
  - Technology and social media (bridging generations)

#### During Recording:
- Players have conversations about suggested topics
- **Can stop recording any time**
- Focus on quality, not length
- Elderly and youth share perspectives

#### After Recording:
- **AI analyzes conversation quality**:
  - Bonding level (how well generations connected)
  - Cultural knowledge shared
  - Participation from all family members
  - Topic relevance to cooking/culture

- **AI determines movement**: 1-5 tiles based on:
  - Conversation depth
  - Intergenerational engagement
  - Cultural insights shared
  - Topic coverage

- **Movement is for the speaking player** (not turn-based)

**Component**: `AudioRecordingModal.tsx`, `geminiApi.ts`

---

### Phase 4: Money Earning (All Start with $0)

#### Primary Method: TikTok Trends
**Purpose**: Introduce elderly to social media, create digital common ground

- Record TikTok videos together
- Teach elderly about viral trends
- Youth help with filming/editing
- Earnings: $10-60 based on creativity and family participation

**Component**: `TikTokRecordingModal.tsx`

#### Additional Money-Earning Activities:

1. **Photo Challenges** ($5-15)
   - Take photos at traditional + modern locations together
   - Wet market + supermarket comparison shots
   - AI rates photo quality and story

2. **Story Sharing** ($10-20)
   - Record family stories about Singapore food/places
   - Elderly share memories, youth document them
   - Cultural preservation

3. **Recipe Guessing Game** ($5-10)
   - Guess ingredients in traditional dishes
   - Both generations collaborate
   - Educational + fun

4. **Digital Payment Simulation** ($8-12)
   - Help elderly use digital wallets
   - Practice QR code payments
   - Supermarket self-order kiosk training

5. **Cultural Quiz** ($5-15)
   - Questions about Singapore culture, food, history
   - Multiple difficulty levels
   - Learn together

6. **Cooking Tips Exchange** ($10-20)
   - Youth teach digital cooking hacks
   - Elderly share traditional techniques
   - Document unique tips

7. **Market Bargaining Roleplay** ($8-15)
   - Simulate wet market negotiations
   - Elderly teach bargaining skills
   - AI judges success

8. **Public Transport Navigation** ($10-18)
   - Plan MRT/bus routes together
   - Use EZ-Link on app
   - Efficiency rewards

9. **Healthy Eating Challenge** ($5-12)
   - Choose healthier ingredient options
   - Nutritional knowledge bonus
   - Collaborative decisions

10. **Language Exchange** ($5-10 per word)
    - Teach Singlish phrases/dialect words
    - Youth learn traditional language
    - Elderly learn modern slang

**Components**: To be created as separate modules

---

### Phase 5: Ingredient Collection

#### Option A: Delivery App (Supermarket Delivery)
**Component**: `DeliveryApp.tsx` (Enhanced)

- Shows AI-generated dish ingredients as shopping list
- Highlight required items
- Track collection progress
- 2-hour delivery, $8 fee
- Elderly practice mobile app ordering

#### Option B: Physical Markets
**Visit actual markets on the board**

**Wet Market** (Traditional Experience)
- Youth experience where elderly shop
- Learn about fresh ingredients
- Cash-only payments
- Bargaining practice
- Cultural immersion

**Supermarket Self-Order**
**Component**: `SupermarketSelfOrder.tsx` (To be created)
- Touch-screen kiosk simulation
- Product scanning
- Cart management
- Payment options (cash/card/digital)
- Accessibility features for elderly
- Award money for successful completion

---

### Phase 6: MRT Station & EZ-Link

**EZ-Link Balance** (Separate from Main Money)
- Starts at $0
- Top up via app using earned money
- Deducted for MRT/Bus usage
- Must manage separate balance

**Component**: `MRTStation.tsx` (To be created)
- Station selection
- Route planning
- EZ-Link payment
- Balance display
- Top-up prompts
- Navigation rewards

**Existing**: `EZLinkTopUp.tsx`, `BusTimings.tsx`

---

### Phase 7: Digital Cooking Game Mode

**Component**: `CookingGameMode.tsx` (To be created)

**After collecting all ingredients**:
1. Click "Start Cooking" button
2. App validates all required ingredients collected
3. Enter digital cooking interface
4. **Interactive Steps**:
   - Drag ingredients into pot
   - Follow cooking method (steam/fry/boil)
   - Complete step-by-step instructions
   - Timing challenges
   - Temperature control

5. **Completion**:
   - Dish completion animation
   - Rewards distributed
   - Cultural knowledge gained
   - Family bonding score increased

**Different Cooking Methods**:
- **Steam**: Maintain water level, timing
- **Fry**: Temperature control, flipping
- **Boil**: Ingredient order, simmer time
- **Stir-fry**: Wok movements, quick actions

---

## 🔧 Technical Architecture

### ESP32-CAM Integration
**Purpose**: Detect player positions on custom D.I.Y. board

**Flow**:
1. ESP32 captures board image every 10 seconds
2. Sends to FastAPI server
3. Gemini Vision API analyzes:
   - Custom board layout
   - Player piece positions
   - Module locations (markets, MRT, etc.)
4. Updates player positions in app

**Files**:
- `esp32/esp32_1.ino`
- `server/main.py`
- `kopitalk/src/components/ESP32BoardIntegration.tsx`

---

### AI Integration (Google Gemini)

#### Text Analysis (`geminiApi.ts`)
- Conversation topic suggestions
- Speech quality analysis
- Movement determination (1-5 tiles)
- Cultural knowledge scoring
- Bonding level assessment

#### Vision Processing (`geminiVision.ts`)
- Board layout recognition
- Player position tracking
- Custom board validation
- Ingredient verification

---

### Data Flow

```
1. Board Building
   ↓
2. ESP32 captures → AI validates layout
   ↓
3. AI generates dish challenge
   ↓
4. Gameplay Loop:
   - AI suggests conversation topic
   - Players record conversation
   - AI analyzes → determines movement
   - Players earn money through activities
   - Collect ingredients (delivery or markets)
   - Use MRT (EZ-Link balance)
   ↓
5. All ingredients collected
   ↓
6. Digital cooking game mode
   ↓
7. Dish completion → Rewards → Family bonding achieved!
```

---

## 🚫 What Was Removed (Conflicting with Purpose)

### ❌ Turn-Based Mechanics
- **Removed**: `current_player_index`
- **Removed**: Player turn indicators
- **Removed**: "End Turn" buttons
- **Removed**: Automatic turn switching
- **Reason**: Conflicts with continuous roleplay. Players should collaborate simultaneously, not take turns.

### ❌ Dice Rolling
- **Removed**: Dice rolling animations
- **Removed**: Random movement mechanics
- **Reason**: Movement should be based on conversation quality (meaningful), not luck (random).

### ❌ Starting Money
- **Changed**: All players now start with $0
- **Reason**: Players must earn money through collaborative activities, emphasizing the value of intergenerational bonding.

### ❌ Competitive Scoring
- **Removed**: Winner determination
- **Removed**: Individual victory conditions
- **Reason**: Focus is on family bonding and cultural learning, not competition.

### ❌ Pre-defined Board Layouts
- **Removed**: Fixed board designs
- **Reason**: Players should build their own unique D.I.Y. boards for personalized experiences.

---

## 📊 Success Metrics

### Family Bonding
- Conversation quality scores
- Cultural knowledge gained
- Activities completed together
- Common ground created

### Intergenerational Learning
- Elderly digital skills improved (delivery apps, self-order kiosks, TikTok)
- Youth traditional knowledge gained (wet markets, cooking techniques, cultural history)
- Language exchange achievements

### Collaborative Achievements
- Money earned together
- Dish successfully cooked
- All ingredients collected
- MRT routes navigated

---

## 🎯 Key Design Principles

1. **Collaboration Over Competition**: No winners, only shared achievements
2. **Meaningful Movement**: Based on conversation quality, not dice luck
3. **Zero to Hero**: Start with nothing, earn through bonding
4. **Cultural Bridge**: Digital meets traditional
5. **Continuous Roleplay**: No turn-taking, natural family interaction
6. **Custom Experience**: D.I.Y. board makes each game unique
7. **Real-World Skills**: Practical learning for both generations

---

## 🔄 Next Steps (Implementation TODO)

See main `TODO.md` for complete implementation checklist. Priority items:

1. ✅ Update types for roleplay structure
2. ✅ Remove turn-based mechanics
3. ✅ Start with zero money
4. 🔄 Create BoardBuilderModal component
5. 🔄 Enhance conversation system with AI topic suggestions
6. 🔄 Implement 10 new money-earning activities
7. 🔄 Create SupermarketSelfOrder game mode
8. 🔄 Build MRTStation component
9. 🔄 Create CookingGameMode component
10. 🔄 Update all documentation

---

**This document defines the core purpose and complete gameplay flow of KopiTalk as a D.I.Y. roleplay board game focused on intergenerational bonding through cooking and Singapore cultural experiences.**
