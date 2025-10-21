import React from 'react'
import { Routes, Route } from 'react-router-dom'
import GameHistory from './pages/GameHistory'
import BoardGame from './pages/BoardGame'
import DeliveryApp from './pages/DeliveryApp'
import CookingGame from './pages/CookingGame'
import BusTimings from './pages/BusTimings'
import MRTStation from './pages/MRTStation'
import SupermarketSelfOrder from './pages/SupermarketSelfOrder'
import CookingGameMode from './pages/CookingGameMode'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<GameHistory />} />
        <Route path="/game/:sessionId?" element={<BoardGame />} />
        <Route path="/delivery" element={<DeliveryApp />} />
        <Route path="/cooking" element={<CookingGame />} />
        <Route path="/bus" element={<BusTimings />} />
        <Route path="/ezlink" element={<MRTStation currentPlayerId={1} onClose={() => window.history.back()} />} />
        <Route path="/mrt" element={<MRTStation currentPlayerId={1} onClose={() => window.history.back()} />} />
        <Route path="/supermarket-self-order" element={<SupermarketSelfOrder />} />
        <Route path="/cooking-game" element={<CookingGameMode dish={{ 
          id: 'test',
          dish_name: 'Test Dish',
          dish_type: 'singapore_traditional',
          description: 'A test dish',
          difficulty: 'easy',
          ingredients: [],
          cooking_method: 'fry',
          cooking_steps: [],
          cultural_context: 'Test',
          estimated_time: 30,
          completion_reward: { money: 50, points: 100, cultural_knowledge: 30 }
        }} collectedIngredients={[]} onComplete={() => {}} />} />
      </Routes>
    </div>
  )
}

export default App