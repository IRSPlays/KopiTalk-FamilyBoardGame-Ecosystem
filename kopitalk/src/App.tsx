import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import GameHistory from './pages/GameHistory'
import BoardGame from './pages/BoardGame'
import DeliveryApp from './pages/DeliveryApp'
import BusTimings from './pages/BusTimings'
import MRTStation from './pages/MRTStation'
import SupermarketSelfOrder from './pages/SupermarketSelfOrder'
import SupermarketShopping from './components/SupermarketShopping'
import CookingGameAIEnhanced from './components/CookingGameAIEnhanced'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Global Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: '#ef4444',
              color: '#ffffff',
            },
          },
        }}
      />
      
      {/* ✅ Global Error Boundary - Catches errors in any route */}
      <ErrorBoundary
        fallbackMessage="We encountered an error while navigating. Your game progress is safely saved."
        onReset={() => window.location.reload()}
      >
        <Routes>
          <Route path="/" element={<GameHistory />} />
          <Route path="/game/:sessionId?" element={<BoardGame />} />
          <Route path="/delivery" element={<DeliveryApp />} />
          <Route path="/cooking" element={<CookingGameAIEnhanced />} />
          <Route path="/cooking-challenge" element={<CookingGameAIEnhanced />} />
          <Route path="/cooking-ai" element={<CookingGameAIEnhanced />} />
          <Route path="/bus" element={<BusTimings />} />
          <Route path="/ezlink" element={<MRTStation currentPlayerId={1} onClose={() => window.history.back()} />} />
          <Route path="/mrt" element={<MRTStation currentPlayerId={1} onClose={() => window.history.back()} />} />
          <Route path="/supermarket" element={<SupermarketShopping />} />
          <Route path="/supermarket-self-order" element={<SupermarketSelfOrder />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App