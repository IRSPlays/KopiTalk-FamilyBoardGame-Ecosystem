import React from 'react'
import { Routes, Route } from 'react-router-dom'
import GameHistory from './pages/GameHistory'
import BoardGame from './pages/BoardGame'
import DeliveryApp from './pages/DeliveryApp'
import CookingGame from './pages/CookingGame'
import BusTimings from './pages/BusTimings'
import EZLinkTopUp from './pages/EZLinkTopUp'

/**
 * The main application component that sets up the routing for the entire app.
 * It uses `react-router-dom` to define the different URL paths and maps each
 * path to its corresponding page component. This component acts as the root
 * container for all page-level views.
 *
 * @returns {JSX.Element} The rendered application with its defined routes.
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<GameHistory />} />
        <Route path="/game/:sessionId?" element={<BoardGame />} />
        <Route path="/delivery" element={<DeliveryApp />} />
        <Route path="/cooking" element={<CookingGame />} />
        <Route path="/bus" element={<BusTimings />} />
        <Route path="/ezlink" element={<EZLinkTopUp />} />
      </Routes>
    </div>
  )
}

export default App