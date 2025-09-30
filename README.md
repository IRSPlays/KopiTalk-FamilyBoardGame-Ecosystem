# KopiTalk - Family Board Game Ecosystem
A comprehensive family board game platform featuring AI-powered conversation analysis, computer vision for board state detection, and intergenerational gameplay experiences. The ecosystem includes a React web app (KopiTalk), FastAPI server for ESP32-CAM integration, and Google Gemini AI for intelligent game analysis.

## 🎮 Platform Overview
- **KopiTalk Web App**: React application with mobile-optimized animations, family conversations, TikTok challenges, and turn-based gameplay
- **FastAPI Server**: Computer vision backend with ESP32-CAM integration and admin panel
- **AI Integration**: Google Gemini 2.5-flash for conversation analysis, multimodal vision processing, and board state detection
- **Mobile Support**: Touch-optimized animations with 15+ interaction patterns for seamless mobile gameplay
- **ESP32-CAM Firmware**: Real-time camera capture for board game monitoring

## 📁 Repository Structure
```
.
├── kopitalk/                # React web application for family gameplay
│   ├── src/
│   │   ├── components/      # React components for game UI
│   │   ├── utils/          # AI utilities and mobile animations
│   │   │   ├── geminiApi.ts       # Gemini text generation (20k token context)
│   │   │   ├── geminiVision.ts    # Multimodal vision processing
│   │   │   ├── gameStorage.ts     # Three-tier game persistence
│   │   │   └── mobileAnimations.ts # 15+ touch-optimized animations
│   │   ├── pages/          # Game pages and navigation
│   │   └── types/          # TypeScript type definitions (extended GameSession)
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.ts      # Vite build configuration
│   └── tailwind.config.js  # Tailwind CSS styling
├── server/
│   ├── main.py             # FastAPI app (admin UI + endpoints)
│   ├── templates/admin.html # Admin panel for ESP32-CAM
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Container build for the server
├── esp32/                  # ESP32-CAM firmware (Arduino sketch)
└── README.md
```

## 🚀 Quick Start

### KopiTalk Web App (Main Family Game)
```bash
# Navigate to KopiTalk app
cd kopitalk

# Install dependencies
npm install

# Start development server
npm run dev
```
The app will be available at http://localhost:5173/

### Game Features
- **📱 Mobile-First Design**: Touch-optimized animations with device detection and 60fps performance
- **🎙️ Audio Recording**: Family conversations with AI analysis using 20k token context
- **📹 TikTok Challenges**: Webcam recording with performance-based earnings
- **🏪 Market Shopping**: 4 unique Singapore markets (Causeway Point, Central Wet Market, RedMart, FreshDirect)
- **🎲 Turn-Based Gameplay**: Visual indicators and automatic progression
- **💰 Earning Systems**: Conversation quality, viral content creation, market trading
- **💾 Smart Persistence**: Three-tier game storage with player progress tracking and export/import
- **🤖 Enhanced AI**: Multimodal vision processing for board state analysis

## 📋 Prerequisites

### For KopiTalk Web App
- Node.js 18+ 
- Modern browser with WebRTC support (microphone + camera access)
- Google Gemini API key for AI features

### For ESP32-CAM Server
- Python 3.9+ (Dockerfile uses 3.9‑slim)
- Google API key with access to Gemini models

### Environment Configuration

**KopiTalk App** - Create `kopitalk/.env`:
```
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GOOGLE_API_KEY=your_api_key_here  # Fallback
# Optional (defaults to gemini-1.5-flash in app)
VITE_GEMINI_MODEL=gemini-1.5-flash
```

**FastAPI Server** - Create `server/.env`:
```
GOOGLE_API_KEY=your_api_key_here
# Optional (defaults to gemini-2.5-flash)
# GEMINI_MODEL=gemini-2.5-flash
```

## 🛠️ Technical Stack

### KopiTalk Web App
- **React + TypeScript** with Vite for fast development
- **Framer Motion** for mobile-optimized animations (15+ variants)
- **Google Gemini 2.5-flash** with @google/genai SDK for AI-powered conversation analysis
- **Tailwind CSS** for responsive design
- **Three-tier LocalStorage** for comprehensive game persistence

### FastAPI Server
- **FastAPI** for high-performance API endpoints
- **Google Gemini Vision** with multimodal content processing for board state analysis
- **ESP32-CAM integration** for real-time image capture
- **Docker support** for easy deployment

## 🎯 AI Integration

The platform uses **Google Gemini 2.5-flash** with the latest @google/genai SDK for:
- **Text Generation**: Enhanced conversation analysis with 20,000 token context window
- **Multimodal Vision**: Board state detection using inlineData format for image processing
- **Structured Outputs**: JSON parsing with responseMimeType configuration
- **Performance Analytics**: Provides feedback on TikTok content and family interactions
- **System Instructions**: Context-aware AI responses tailored for Singapore family gameplay

### Mobile Animation System
- **Device Detection**: Automatic mobile/desktop detection with user agent + touch support
- **Touch Optimization**: Spring physics tuned for mobile (stiffness: 400, damping: 30, mass: 0.8)
- **15+ Animation Variants**: Buttons, cards, modals, lists, page transitions, bottom sheets, and more
- **Swipe Gestures**: Confidence threshold and power calculation for natural interactions
- **Performance**: 60fps target with reduced motion preferences support

## 🖥️ Running the Applications

### KopiTalk Web App (Primary Interface)
```bash
# Development mode
cd kopitalk
npm run dev

# Production build
npm run build
npm run preview
```

### ESP32-CAM Server (Board Detection)

#### Option 1: Docker (recommended)
Build from the `server/` folder (Dockerfile lives there):
```bash
docker build -t smart-board-game-server ./server
```
Run and pass env via file or variables:
```bash
docker run -d -p 8000:8000 --env-file server/.env --name smart-board smart-board-game-server
# or
docker run -d -p 8000:8000 -e GOOGLE_API_KEY=$GOOGLE_API_KEY -e GEMINI_MODEL=gemini-2.5-flash --name smart-board smart-board-game-server
```

#### Option 2: Local Development
```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r server/requirements.txt

# Run FastAPI server
cd server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Server will be available at http://localhost:8000/admin

## 🎮 Game Experience

### Family Gameplay Flow
1. **Setup**: Choose difficulty level and add 2-4 family members
2. **Turn-Based Actions**: Visual indicators show current player and available actions
3. **Audio Conversations**: Record family discussions with real-time feedback
4. **TikTok Challenges**: Create viral content with webcam recording
5. **Market Shopping**: Visit authentic Singapore locations for ingredients
6. **Dice Rolling**: Move forward on the game board and progress turns

### Singapore Market Simulation
- **Causeway Point Supermarket**: Higher prices, premium selection
- **Central Wet Market**: Best prices, traditional cash-only experience  
- **RedMart Online**: 2-hour delivery, $8 delivery fee
- **FreshDirect Online**: 1-hour express delivery, $6 delivery fee

## 🔌 API Endpoints (ESP32-CAM Server)

### Core Endpoints
- `POST /esp32/submit-image?esp32_id=<id>` - Submit camera frames from ESP32
- `GET /admin` - Admin interface for board game monitoring
- `POST /admin/process-turn` - Analyze game state with Gemini Vision
- `GET /admin/status` - Device status and latest images
- `GET /admin/latest-image/{esp32_id}` - Retrieve latest device image

## ⚙️ Configuration

### Environment Variables
- `VITE_GEMINI_MODEL` (KopiTalk): Optional, defaults to `"gemini-1.5-flash"`
- `GEMINI_MODEL` (Server): Optional, defaults to `"gemini-1.5-flash"`

### Model Information
- Server default: **gemini-1.5-flash** (override via `GEMINI_MODEL`)
Both paths use the latest `@google/genai` and server SDKs with correct multimodal patterns. Choose models based on quota and availability.

## 📱 Mobile Animation Usage

### Quick Start
```typescript
import { getResponsiveAnimation, mobileCardVariants, touchButtonVariants } from '@/utils/mobileAnimations'

// Auto-select animation based on device
<motion.div {...getResponsiveAnimation('card')}>
  Game Card Content
</motion.div>

// Explicit mobile button with touch feedback
<motion.button 
  variants={touchButtonVariants} 
  whileTap="tap"
  className="bg-blue-500 text-white p-4 rounded-lg"
>
  Start Game
</motion.button>
```

### Available Animation Variants
- `touchButtonVariants` - Touch-optimized button interactions
- `mobileCardVariants` - Card animations with reduced motion
- `mobileModalVariants` - Modal entrance/exit animations
- `mobileListItemVariants` - Staggered list animations
- `mobilePageVariants` - Full page transitions
- `mobileBottomSheetVariants` - iOS-style bottom sheets
- `mobileTabVariants` - Tab switching animations
- Plus 8 more specialized variants...

## 💾 Game Storage Usage

### Basic Game Management
```typescript
import { saveGame, getCurrentGameState, savePlayerProgress } from '@/utils/gameStorage'

// Create and save new game
const newGame = createGame('medium', familyMembers)
saveGame(newGame)

// Auto-save current state
saveCurrentGameState(gameSession)

// Track individual player progress
savePlayerProgress(playerId, {
  level: 5,
  achievements: ['first_tiktok', 'market_master'],
  totalScore: 1250
})
```

### Export/Import for Backups
```typescript
// Export all games as JSON
const backup = exportGames()
console.log('Backup created:', backup)

// Import from backup
const success = importGames(backupData)
if (success) console.log('Games restored successfully')
```

## 🔧 Browser Requirements
- **Modern Browser**: Chrome 88+, Firefox 85+, Safari 14+ (mobile optimized)
- **WebRTC Support**: For audio/video recording features
- **LocalStorage**: For three-tier game state persistence (games, current state, player progress)
- **Touch Events**: For mobile gesture support and swipe interactions
- **Camera/Microphone**: For TikTok challenges and conversations
- **JavaScript**: ES2020+ for modern SDK features and async/await patterns

## 🛠️ Troubleshooting

### KopiTalk Web App
- **Microphone Access**: Grant permissions for conversation recording
- **Camera Access**: Required for TikTok challenge features
- **API Key Issues**: Verify `VITE_GEMINI_API_KEY` in `.env` file
- **Build Issues**: Ensure Node.js 18+ and run `npm install`
- **Mobile Animations**: If animations lag, check device performance and battery saver mode
- **Touch Gestures**: Ensure touch events are enabled in browser settings
- **Game Storage**: LocalStorage quota exceeded? Use export/import to backup and clear data
- **Gemini API Errors**: Check console for detailed error messages and API quota limits

### ESP32-CAM Server  
- **429 (Quota)**: Auto-fallback to flash model, check API limits
- **Image Processing**: Server downscales large images automatically
- **JSON Parsing**: Robust error handling with response previews
- **Connection Issues**: Verify ESP32 Wi-Fi and server URL configuration

## 📡 ESP32-CAM Setup
1. Open `esp32/esp32.ino` in Arduino IDE
2. Install ESP32 board support and `esp_camera` library
3. Configure Wi-Fi credentials and server endpoint
4. Flash firmware and verify camera feed at `/admin`
5. Test board game detection with physical game pieces

## 📚 Documentation

### Implementation Guides
- **`/MOBILE_ANIMATIONS_GEMINI_INTEGRATION_COMPLETE.md`**: Technical implementation details (500+ lines)
  - Complete code examples and patterns
  - Testing verification checklist
  - Future enhancement roadmap
  
- **`/kopitalk/MOBILE_ANIMATIONS_GUIDE.md`**: Developer usage guide (300+ lines)
  - Quick start examples
  - Animation best practices
  - Performance optimization tips
  - Accessibility guidelines

- **`/IMPLEMENTATION_STATUS.md`**: Current status report
  - Completed objectives checklist
  - Code quality metrics
  - Pending tasks and next steps

## 🎯 Recent Updates (September 2025)

### 📱 Mobile Animation System
- ✅ **15+ Touch-Optimized Variants**: Complete mobile animation library with device detection
- ✅ **Responsive Animations**: Auto-select animations based on device capabilities
- ✅ **60fps Performance**: Mobile-tuned spring physics and reduced motion support
- ✅ **Gesture Support**: Swipe confidence threshold and power calculations

### 🤖 Enhanced Gemini AI Integration  
- ✅ **Latest @google/genai SDK**: Updated to proper structured content patterns
- ✅ **20k Token Context**: Comprehensive system instructions for better responses
- ✅ **Multimodal Vision**: Fixed inlineData format for image + text processing
- ✅ **Structured Outputs**: JSON responseMimeType for reliable parsing
- ✅ **Enhanced Error Handling**: Comprehensive try-catch with fallback responses

### 💾 Advanced Game Persistence
- ✅ **Three-Tier Storage**: Games, current state, and player progress tracking
- ✅ **Challenge Logging**: Track completion status and rewards
- ✅ **Event System**: Record all game events for analytics
- ✅ **Export/Import**: JSON backup and restore functionality
- ✅ **Auto-Save**: Current game state persistence with timestamps

### 📚 Comprehensive Documentation
- ✅ **Technical Guide**: 500+ lines covering implementation details
- ✅ **Developer Guide**: Usage patterns and best practices
- ✅ **Testing Checklist**: Verification steps for mobile devices
- ✅ **Code Examples**: Ready-to-use snippets for all features

---

**🌟 Experience authentic Singapore family bonding through AI-enhanced board gaming!** 

The platform bridges generations with meaningful conversations, cultural authenticity, and innovative technology for memorable family moments.
