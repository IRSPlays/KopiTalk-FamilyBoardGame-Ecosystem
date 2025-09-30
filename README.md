# KopiTalk - Family Board Game Ecosystem
A comprehensive family board game platform featuring AI-powered conversation analysis, computer vision for board state detection, and intergenerational gameplay experiences. The ecosystem includes a React web app (KopiTalk), FastAPI server for ESP32-CAM integration, and Google Gemini AI for intelligent game analysis.

## 🎮 Platform Overview
- **KopiTalk Web App**: React application for family conversations, TikTok challenges, and turn-based gameplay
- **FastAPI Server**: Computer vision backend with ESP32-CAM integration and admin panel
- **AI Integration**: Google Gemini 2.5-flash for conversation analysis and board state detection
- **ESP32-CAM Firmware**: Real-time camera capture for board game monitoring

## 📁 Repository Structure
```
.
├── kopitalk/                # React web application for family gameplay
│   ├── src/
│   │   ├── components/      # React components for game UI
│   │   ├── utils/          # AI utilities (geminiApi.ts, geminiVision.ts)
│   │   ├── pages/          # Game pages and navigation
│   │   └── types/          # TypeScript type definitions
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
- **🎙️ Audio Recording**: Family conversations with AI analysis
- **📹 TikTok Challenges**: Webcam recording with performance-based earnings
- **🏪 Market Shopping**: 4 unique Singapore markets (Causeway Point, Central Wet Market, RedMart, FreshDirect)
- **🎲 Turn-Based Gameplay**: Visual indicators and automatic progression
- **💰 Earning Systems**: Conversation quality, viral content creation, market trading

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
- **Google Gemini** for AI-powered conversation analysis

### FastAPI Server
- **FastAPI** for high-performance API endpoints
- **Google Gemini Vision** for board state analysis
- **ESP32-CAM integration** for real-time image capture
- **Docker support** for easy deployment

## 🎯 AI Integration

The platform uses **Google Gemini** for:
- **Performance Analytics**: Provides feedback on TikTok content and family interactions

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

## 🔧 Browser Requirements
- **Modern Browser**: Chrome 88+, Firefox 85+, Safari 14+
- **WebRTC Support**: For audio/video recording features
- **LocalStorage**: For game state persistence
- **Camera/Microphone**: For TikTok challenges and conversations

## 🛠️ Troubleshooting

### KopiTalk Web App
- **Microphone Access**: Grant permissions for conversation recording
- **Camera Access**: Required for TikTok challenge features
- **API Key Issues**: Verify `VITE_GEMINI_API_KEY` in `.env` file
- **Build Issues**: Ensure Node.js 18+ and run `npm install`

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

## 🎯 Recent Updates
- ✅ **Correct API Calls**: Fixed `ai.models.generateContent()` and `response.text` access
- ✅ **Enhanced Error Handling**: Robust fallback mechanisms with detailed logging
- ✅ **Performance Optimizations**: Faster response times and better reliability
- ✅ **Family-Friendly AI**: Improved conversation analysis for intergenerational gameplay

---

**🌟 Experience authentic Singapore family bonding through AI-enhanced board gaming!** 

The platform bridges generations with meaningful conversations, cultural authenticity, and innovative technology for memorable family moments.
