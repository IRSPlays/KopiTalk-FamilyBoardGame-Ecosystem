import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Save, RotateCcw, Grid3x3, ShoppingBag, MapPin, 
  Home, Bus, ChefHat, Camera, Package, AlertCircle,
  CheckCircle, Info, Sparkles, Eye, Plus, Minus
} from 'lucide-react'
import { CustomBoard, BoardTile } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (board: CustomBoard) => void
  existingBoard?: CustomBoard
}

type TileType = 'empty' | 'start' | 'market' | 'wet_market' | 'mrt' | 'bus_stop' | 'cooking_station' | 'photo_spot' | 'challenge'

interface TilePaletteItem {
  type: TileType
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description: string
  required: boolean
  maxCount?: number
}

const BoardBuilderModal: React.FC<Props> = ({ isOpen, onClose, onSave, existingBoard }) => {
  const [gridSize, setGridSize] = useState(existingBoard?.grid_size.width || 10)
  const [tiles, setTiles] = useState<BoardTile[]>(existingBoard?.tiles || initializeEmptyBoard(10))
  const [selectedTileType, setSelectedTileType] = useState<TileType>('empty')
  const [isDragging, setIsDragging] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  // Tile palette with all available tile types
  const tilePalette: TilePaletteItem[] = [
    { type: 'empty', name: 'Empty', icon: Grid3x3, color: 'text-gray-400', bgColor: 'bg-gray-100', description: 'Empty space', required: false },
    { type: 'start', name: 'Start', icon: Home, color: 'text-green-600', bgColor: 'bg-green-100', description: 'Starting position (required)', required: true, maxCount: 1 },
    { type: 'market', name: 'Supermarket', icon: ShoppingBag, color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Modern supermarket (required)', required: true },
    { type: 'wet_market', name: 'Wet Market', icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-100', description: 'Traditional wet market', required: false },
    { type: 'mrt', name: 'MRT Station', icon: MapPin, color: 'text-purple-600', bgColor: 'bg-purple-100', description: 'MRT transport hub', required: false },
    { type: 'bus_stop', name: 'Bus Stop', icon: Bus, color: 'text-yellow-600', bgColor: 'bg-yellow-100', description: 'Bus stop', required: false },
    { type: 'cooking_station', name: 'Cooking Station', icon: ChefHat, color: 'text-red-600', bgColor: 'bg-red-100', description: 'Cooking area (required)', required: true, maxCount: 1 },
    { type: 'photo_spot', name: 'Photo Spot', icon: Camera, color: 'text-pink-600', bgColor: 'bg-pink-100', description: 'Photo challenge location', required: false },
    { type: 'challenge', name: 'Challenge', icon: Sparkles, color: 'text-indigo-600', bgColor: 'bg-indigo-100', description: 'Activity challenge spot', required: false }
  ]

  // Initialize empty board
  function initializeEmptyBoard(size: number): BoardTile[] {
    const board: BoardTile[] = []
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        board.push({
          id: `tile-${x}-${y}`,
          position: { x, y },
          type: 'empty',
          properties: {
            name: `Tile ${x}-${y}`
          }
        })
      }
    }
    return board
  }

  // Change grid size
  const handleGridSizeChange = (newSize: number) => {
    if (newSize < 6 || newSize > 15) return
    setGridSize(newSize)
    setTiles(initializeEmptyBoard(newSize))
    setValidationErrors([])
  }

  // Place tile on board
  const handleTilePlacement = (row: number, col: number) => {
    setTiles(prevTiles => {
      const newTiles = [...prevTiles]
      const index = row * gridSize + col
      
      if (index < newTiles.length) {
        // Check max count for tiles with limits
        const paletteItem = tilePalette.find(p => p.type === selectedTileType)
        if (paletteItem?.maxCount) {
          const existingCount = newTiles.filter(t => t.type === selectedTileType).length
          if (existingCount >= paletteItem.maxCount && newTiles[index].type !== selectedTileType) {
            setValidationErrors([`Maximum ${paletteItem.maxCount} ${paletteItem.name} allowed`])
            setTimeout(() => setValidationErrors([]), 3000)
            return prevTiles
          }
        }

        newTiles[index] = {
          id: `tile-${col}-${row}`,
          position: { x: col, y: row },
          type: selectedTileType,
          properties: {
            name: tilePalette.find(t => t.type === selectedTileType)?.name || 'Tile'
          }
        }
      }
      return newTiles
    })
  }

  // Mouse drag handlers
  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true)
    handleTilePlacement(row, col)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      handleTilePlacement(row, col)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Validate board before saving
  const validateBoard = (): boolean => {
    const errors: string[] = []
    
    // Check for required tiles
    const hasStart = tiles.some(t => t.type === 'start')
    const hasMarket = tiles.some(t => t.type === 'market')
    const hasCookingStation = tiles.some(t => t.type === 'cooking_station')
    
    if (!hasStart) errors.push('Missing Start tile (required)')
    if (!hasMarket) errors.push('Missing at least one Supermarket (required)')
    if (!hasCookingStation) errors.push('Missing Cooking Station (required)')
    
    // Check for reasonable number of empty tiles
    const emptyCount = tiles.filter(t => t.type === 'empty').length
    const totalTiles = tiles.length
    if (emptyCount === totalTiles) {
      errors.push('Board is completely empty')
    } else if (emptyCount > totalTiles * 0.8) {
      errors.push('Board has too many empty tiles (less than 20% filled)')
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  // Save board
  const handleSave = () => {
    if (!validateBoard()) return

    const customBoard: CustomBoard = {
      id: `board-${Date.now()}`,
      name: `Custom Board ${gridSize}x${gridSize}`,
      grid_size: { width: gridSize, height: gridSize },
      tiles: tiles,
      created_at: new Date().toISOString()
    }

    onSave(customBoard)
  }

  // Reset board
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the board? All changes will be lost.')) {
      setTiles(initializeEmptyBoard(gridSize))
      setValidationErrors([])
    }
  }

  // Load template board
  const loadTemplate = (templateName: string) => {
    let templateTiles: BoardTile[] = []

    if (templateName === 'basic') {
      // Basic 10x10 template
      templateTiles = initializeEmptyBoard(10)
      // Add start at (0, 0)
      templateTiles[0] = { id: 'start', position: { x: 0, y: 0 }, type: 'start', properties: { name: 'Start' } }
      // Add market at (5, 5)
      templateTiles[55] = { id: 'market-1', position: { x: 5, y: 5 }, type: 'market', properties: { name: 'Supermarket' } }
      // Add cooking station at (9, 9)
      templateTiles[99] = { id: 'cooking-1', position: { x: 9, y: 9 }, type: 'cooking_station', properties: { name: 'Cooking Station' } }
      // Add MRT at (3, 7)
      templateTiles[37] = { id: 'mrt-1', position: { x: 7, y: 3 }, type: 'mrt', properties: { name: 'MRT Station' } }
      // Add wet market at (7, 3)
      templateTiles[73] = { id: 'wet-1', position: { x: 3, y: 7 }, type: 'wet_market', properties: { name: 'Wet Market' } }
    } else if (templateName === 'singapore') {
      // Singapore-themed 12x12 template
      setGridSize(12)
      templateTiles = initializeEmptyBoard(12)
      // More elaborate Singapore layout
      templateTiles[0] = { id: 'start', position: { x: 0, y: 0 }, type: 'start', properties: { name: 'Start' } }
      templateTiles[66] = { id: 'market-1', position: { x: 6, y: 5 }, type: 'market', properties: { name: 'Supermarket' } }
      templateTiles[143] = { id: 'cooking-1', position: { x: 11, y: 11 }, type: 'cooking_station', properties: { name: 'Cooking Station' } }
      templateTiles[40] = { id: 'mrt-1', position: { x: 4, y: 3 }, type: 'mrt', properties: { name: 'MRT Station' } }
      templateTiles[85] = { id: 'wet-1', position: { x: 1, y: 7 }, type: 'wet_market', properties: { name: 'Wet Market' } }
      templateTiles[110] = { id: 'photo-1', position: { x: 2, y: 9 }, type: 'photo_spot', properties: { name: 'Photo Spot' } }
      templateTiles[75] = { id: 'challenge-1', position: { x: 3, y: 6 }, type: 'challenge', properties: { name: 'Challenge' } }
    }

    setTiles(templateTiles)
    setShowTemplates(false)
    setValidationErrors([])
  }

  // Get tile statistics
  const getTileStats = () => {
    const stats: Record<TileType, number> = {
      empty: 0, start: 0, market: 0, wet_market: 0, mrt: 0,
      bus_stop: 0, cooking_station: 0, photo_spot: 0, challenge: 0
    }
    tiles.forEach(tile => {
      stats[tile.type]++
    })
    return stats
  }

  const tileStats = getTileStats()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-kopi-500 to-talk-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Grid3x3 className="w-6 h-6" />
                  D.I.Y. Board Builder
                </h2>
                <p className="text-sm opacity-90 mt-1">Build your personalized game board</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Left Panel: Tile Palette */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Tile Palette
                  </h3>
                  
                  <div className="space-y-2">
                    {tilePalette.map(tile => (
                      <motion.button
                        key={tile.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTileType(tile.type)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedTileType === tile.type
                            ? 'border-kopi-500 bg-kopi-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <tile.icon className={`w-5 h-5 ${tile.color}`} />
                          <span className="font-medium text-sm">{tile.name}</span>
                          {tile.required && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Required</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{tile.description}</p>
                        {tileStats[tile.type] > 0 && (
                          <p className="text-xs font-medium text-gray-700 mt-1">
                            Count: {tileStats[tile.type]}
                            {tile.maxCount && ` / ${tile.maxCount}`}
                          </p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Grid Size Control */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Grid Size: {gridSize}x{gridSize}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGridSizeChange(gridSize - 1)}
                      disabled={gridSize <= 6}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="6"
                      max="15"
                      value={gridSize}
                      onChange={(e) => handleGridSizeChange(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => handleGridSizeChange(gridSize + 1)}
                      disabled={gridSize >= 15}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Range: 6x6 to 15x15</p>
                </div>

                {/* Templates */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Quick Templates</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => loadTemplate('basic')}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left"
                    >
                      Basic Layout (10x10)
                    </button>
                    <button
                      onClick={() => loadTemplate('singapore')}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-left"
                    >
                      Singapore Theme (12x12)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel: Board Grid */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Board Preview ({gridSize}x{gridSize})
                    </h3>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>

                  {/* Board Grid */}
                  <div
                    className="inline-block bg-white border-2 border-gray-300 rounded-lg overflow-hidden"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div
                      className="grid gap-0.5"
                      style={{
                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
                      }}
                    >
                      {tiles.map((tile, index) => {
                        const paletteItem = tilePalette.find(p => p.type === tile.type)
                        const Icon = paletteItem?.icon || Grid3x3
                        
                        return (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.1, zIndex: 10 }}
                            onMouseDown={() => handleMouseDown(tile.position.y, tile.position.x)}
                            onMouseEnter={() => handleMouseEnter(tile.position.y, tile.position.x)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 ${paletteItem?.bgColor} border border-gray-200 flex items-center justify-center cursor-pointer transition-all`}
                            title={tile.properties?.name || 'Tile'}
                          >
                            {tile.type !== 'empty' && (
                              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${paletteItem?.color}`} />
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-3">
                    <Info className="w-3 h-3 inline mr-1" />
                    Click or drag to place tiles. Select a tile type from the palette first.
                  </p>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">Validation Errors</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (validateBoard()) {
                    alert('✅ Board is valid! Ready to save.')
                  }
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Validate
              </button>
              
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-kopi-500 to-talk-500 text-white rounded-lg hover:from-kopi-600 hover:to-talk-600 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Board
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BoardBuilderModal
