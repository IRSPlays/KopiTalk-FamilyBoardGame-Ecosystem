# KopiTalk - AI-Powered Family Board Game

**KopiTalk** is an innovative board game ecosystem designed to bridge generational gaps within families. It combines a physical board game with a digital platform that uses AI-powered conversation analysis, computer vision, and interactive challenges to create meaningful and memorable family moments.

## ✨ Key Features

-   **AI-Powered Gameplay**: Utilizes Google Gemini for conversation analysis, board state detection, and dynamic challenge generation.
-   **Interactive Web App**: A mobile-first React application serves as the main interface for gameplay, challenges, and viewing game history.
-   **Real-time Board Recognition**: An ESP32-CAM module captures images of the physical game board, which are analyzed by a FastAPI backend to determine the game state.
-   **Engaging Mini-Games**: Includes integrated "Singapore Life" modules like a delivery app, cooking game, and transport challenges.
-   **Family Bonding Focus**: Features like AI-analyzed conversations and cooperative challenges are designed to encourage intergenerational communication and teamwork.

## 🏗️ Architecture

The KopiTalk ecosystem consists of three main components that work together:

1.  **`kopitalk` (Frontend)**: The main web application built with React and Vite. Players interact with this interface to manage the game, participate in challenges, and view AI-generated insights.
2.  **`server` (Backend)**: A Python FastAPI server that acts as the brain of the operation. It receives images from the ESP32, uses the Gemini Vision API to analyze them, and provides game state data to the frontend. It also includes an admin dashboard for monitoring.
3.  **`esp32` (Hardware)**: An ESP32-CAM module running Arduino code. Its sole purpose is to periodically capture images of the physical game board and send them to the backend server.

```
+----------------+      +------------------+      +-----------------+
|   ESP32-CAM    |----->|   FastAPI Server   |<---->|   KopiTalk App  |
| (Captures Image) |      | (Analyzes Image)   |      | (Game Interface)|
+----------------+      +------------------+      +-----------------+
                          |
                          |
                          v
+----------------+
| Google Gemini  |
| (Vision & AI)  |
+----------------+
```

## 🚀 Getting Started

This guide will walk you through setting up the entire KopiTalk ecosystem for local development.

### Prerequisites

-   **Node.js**: v18 or later
-   **Python**: v3.9 or later
-   **Docker**: (Optional, for running the server)
-   **Arduino IDE**: For flashing the ESP32-CAM firmware
-   **Google Gemini API Key**: Required for both the frontend and backend. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Environment Variable Setup

You need to create `.env` files for both the frontend and backend services.

**A. Frontend (`kopitalk/.env`)**

Create a file named `.env` inside the `kopitalk/` directory and add your API key:

```env
VITE_GEMINI_API_KEY=your_google_api_key_here
```

**B. Backend (`server/.env`)**

Create a file named `.env` inside the `server/` directory and add the same API key:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 2. Backend Server Setup

You can run the FastAPI server either with Docker (recommended) or locally with Python.

**Option A: Docker (Recommended)**

```bash
# From the root directory, build the Docker image
docker build -t kopitalk-server ./server

# Run the container with the .env file
docker run -d -p 8000:8000 --env-file server/.env --name kopitalk-server kopitalk-server
```

**Option B: Local Python Environment**

```bash
# Navigate to the server directory
cd server

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will be running at `http://localhost:8000`. You can view the admin panel at `http://localhost:8000/admin`.

### 3. Frontend Web App Setup

```bash
# Navigate to the frontend directory
cd kopitalk

# Install dependencies
npm install

# Run the development server
npm run dev
```

The KopiTalk web application will be available at `http://localhost:5173`.

### 4. ESP32-CAM Setup

1.  **Open Arduino IDE**: Load the sketch from `esp32/esp32_1.ino`.
2.  **Install Board**: Make sure you have the "ESP32" board manager installed. Select "AI Thinker ESP32-CAM" as your board.
3.  **Configure Sketch**:
    -   Update the `ssid` and `password` variables with your Wi-Fi credentials.
    -   Update the `server_url` to point to your computer's local IP address (e.g., `http://192.168.1.100:8000/esp32/submit-image`). **Do not use `localhost`**, as the ESP32 will not be able to resolve it.
4.  **Flash Firmware**: Connect your ESP32-CAM via a USB-to-serial programmer and upload the sketch.
5.  **Verify**: Once running, the ESP32 will start sending images to your server. You can verify this by checking the admin panel at `http://localhost:8000/admin`.

## ⚙️ Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
-   **Backend**: Python, FastAPI
-   **AI**: Google Gemini API
-   **Hardware**: ESP32-CAM

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.