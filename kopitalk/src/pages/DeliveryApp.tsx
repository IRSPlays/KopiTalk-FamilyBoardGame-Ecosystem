import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Package, Clock, MapPin, Truck, Star, Home, Gamepad2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Order {
  id: string
  restaurant: string
  items: string[]
  address: string
  distance: string
  estimatedTime: string
  price: number
  rating: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
}

const DeliveryApp: React.FC = () => {
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const mockOrders: Order[] = [
    {
      id: '1',
      restaurant: 'Old Chang Kee',
      items: ['Curry Puff', 'Ice Cream Puff', 'Sardine Puff'],
      address: 'Causeway Point, Woodlands',
      distance: '2.3 km',
      estimatedTime: '25-35 min',
      price: 8.50,
      rating: 4.5,
      status: 'preparing'
    },
    {
      id: '2', 
      restaurant: 'Ya Kun Kaya Toast',
      items: ['Kaya Toast Set', 'Kopi O', 'Half-boiled Eggs'],
      address: 'Junction 8, Bishan',
      distance: '4.1 km',
      estimatedTime: '30-40 min', 
      price: 12.80,
      rating: 4.7,
      status: 'ready'
    },
    {
      id: '3',
      restaurant: 'Hawker Centre',
      items: ['Chicken Rice', 'Laksa', 'Ice Kachang'],
      address: 'Toa Payoh Central',
      distance: '3.8 km',
      estimatedTime: '35-45 min',
      price: 15.20,
      rating: 4.3,
      status: 'pending'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'preparing': return Package
      case 'ready': return Truck
      case 'delivered': return Home
      default: return Clock
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <motion.h1 
              className="text-2xl font-bold text-gray-900"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: "linear-gradient(90deg, #111827, #3b82f6, #111827)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Singapore Delivery
            </motion.h1>
            <p className="text-gray-600">Track your family's food orders</p>
          </div>
          
          {/* Back to Game Button */}
          <motion.button
            onClick={() => navigate('/game')}
            className="ml-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Gamepad2 className="w-4 h-4" />
            </motion.div>
            Back to Game
          </motion.button>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Orders List */}
          <div className="space-y-4">
            <motion.h2 
              className="text-lg font-semibold text-gray-800 mb-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Active Orders
            </motion.h2>
            
            {mockOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status)
              
              return (
                <motion.div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.restaurant}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{order.rating}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{order.distance}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Items:</p>
                    <p className="text-sm text-gray-800">{order.items.join(', ')}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-2 text-sm text-gray-600"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <MapPin className="w-4 h-4" />
                      {order.address}
                    </motion.div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{order.estimatedTime}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Order Details */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {selectedOrder ? (
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedOrder.restaurant}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{selectedOrder.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{selectedOrder.distance} away</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items Ordered</h4>
                    <div className="space-y-1">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${(selectedOrder.price * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-gray-900">${(selectedOrder.price * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>${selectedOrder.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Estimated Delivery</span>
                    </div>
                    <p className="text-blue-800">{selectedOrder.estimatedTime}</p>
                    <p className="text-sm text-blue-600 mt-1">To: {selectedOrder.address}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Order</h3>
                <p className="text-gray-500">Click on an order from the left to view details</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-gray-50 rounded-xl p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Singapore Family Favorites</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Chicken Rice', time: '20-30 min', price: '$4.50' },
              { name: 'Laksa', time: '25-35 min', price: '$6.80' },
              { name: 'Char Kway Teow', time: '22-32 min', price: '$5.50' },
              { name: 'Bak Kut Teh', time: '30-40 min', price: '$8.90' }
            ].map((dish, index) => (
              <motion.div 
                key={index} 
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="font-medium text-gray-900 text-sm">{dish.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{dish.time}</p>
                <p className="text-sm font-semibold text-blue-600 mt-1">{dish.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DeliveryApp
