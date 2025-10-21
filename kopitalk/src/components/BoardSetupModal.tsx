import React, { useState, useRef, useEffect } from 'react'
import { Camera, Upload, Sparkles, CheckCircle, AlertCircle, Image, RefreshCw, Zap, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { analyzeBoardImage, BoardAnalysis } from '../utils/geminiVision'

interface Props {
  difficulty: string
  onSetupComplete: () => void
}

const BoardSetupModal: React.FC<Props> = ({ difficulty, onSetupComplete }) => {
  const [boardImage, setBoardImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<BoardAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDragAccept, setIsDragAccept] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // ✅ Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, GIF)')
      toast.error('Invalid file type', { icon: '⚠️' })
      return
    }

    // ✅ Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 10MB')
      toast.error('File too large!', { icon: '📦' })
      return
    }

    // ✅ Revoke old preview URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setBoardImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError(null)
    setAnalysis(null)
    toast.success('Image loaded successfully!', { icon: '🖼️', duration: 2000 })
  }

  // ✅ Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
    
    // ✅ Check if dragged item is an image
    const hasImageFile = Array.from(e.dataTransfer.items).some(
      item => item.type.startsWith('image/')
    )
    setIsDragAccept(hasImageFile)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setIsDragAccept(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setIsDragAccept(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    } else {
      toast.error('No files detected', { icon: '❌' })
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const analyzeBoard = async () => {
    if (!boardImage) return

    setIsAnalyzing(true)
    setError(null)
    setAnalysisProgress(0)
    
    // ✅ Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    toast.loading('Analyzing your board...', { id: 'analyzing', icon: '🔍' })

    try {
      const result = await analyzeBoardImage(boardImage, difficulty)
      setAnalysis(result)
      setAnalysisProgress(100)
      toast.success('Analysis complete!', { id: 'analyzing', icon: '✨', duration: 2000 })
    } catch (err) {
      const errorMessage = 'Failed to analyze board. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage, { id: 'analyzing', icon: '❌' })
      console.error('Analysis error:', err)
    } finally {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const handleComplete = () => {
    if (analysis) {
      toast.success('Board setup complete! Starting game...', { icon: '🎮', duration: 2000 })
      setTimeout(() => {
        onSetupComplete()
      }, 500)
    }
  }

  const handleResetImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setBoardImage(null)
    setPreviewUrl(null)
    setAnalysis(null)
    setError(null)
    toast('Upload a new image', { icon: '🔄' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kopi-50 via-white to-talk-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl font-bold gradient-text mb-4 flex items-center justify-center gap-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Camera className="w-10 h-10 text-kopi-500" />
              AI Board Setup
            </motion.h1>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Upload an image of your empty board for AI-powered analysis and strategic module placement suggestions
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Upload Area */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5 text-kopi-500" />
                  Upload Board Image
                </h3>
                
                <motion.div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 relative overflow-hidden ${
                    isDragOver && isDragAccept
                      ? 'border-green-500 bg-green-50'
                      : isDragOver && !isDragAccept
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  whileHover={{ scale: previewUrl ? 1 : 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <AnimatePresence mode="wait">
                    {previewUrl ? (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key="preview"
                      >
                        <div className="relative group">
                          <motion.img
                            src={previewUrl}
                            alt="Board preview"
                            className="max-w-full h-64 object-contain mx-auto rounded-lg shadow-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <motion.button
                              onClick={handleResetImage}
                              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <motion.button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-kopi-500 text-white rounded-lg hover:bg-kopi-600 transition-colors font-medium flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <RefreshCw className="w-4 h-4" />
                            Change Image
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        key="upload"
                      >
                        <motion.div
                          animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Upload className={`mx-auto h-16 w-16 ${
                            isDragOver && isDragAccept ? 'text-green-500' :
                            isDragOver && !isDragAccept ? 'text-red-500' :
                            'text-gray-400'
                          }`} />
                        </motion.div>
                        <div>
                          <p className="text-gray-600 mb-2">
                            {isDragOver && isDragAccept && '✅ Drop your image here!'}
                            {isDragOver && !isDragAccept && '❌ Only image files are accepted'}
                            {!isDragOver && (
                              <>
                                Drag and drop your board image here, or{' '}
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="text-kopi-500 hover:text-kopi-600 font-medium underline"
                                >
                                  browse files
                                </button>
                              </>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            Supports JPG, PNG, GIF, WEBP (Max 10MB)
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  aria-label="Upload board image"
                />

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      role="alert"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Analyze Button */}
              <AnimatePresence>
                {boardImage && !analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <motion.button
                      onClick={analyzeBoard}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-kopi-500 to-talk-500 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
                      whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
                      whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
                    >
                      {isAnalyzing ? (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          />
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Zap className="h-5 w-5" />
                          </motion.div>
                          <span>Analyzing Board... {analysisProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          <span>Analyze Board with AI</span>
                          <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          >
                            ✨
                          </motion.span>
                        </>
                      )}
                    </motion.button>

                    {/* Progress Bar */}
                    {isAnalyzing && analysisProgress > 0 && (
                      <motion.div 
                        className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-kopi-500 to-talk-500"
                          initial={{ width: '0%' }}
                          animate={{ width: `${analysisProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {analysis ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {/* Board Assessment */}
                    <motion.div 
                      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                        Board Analysis Complete
                      </h3>
                      
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h4 className="font-medium text-gray-800 mb-2">Assessment</h4>
                          <p className="text-gray-600 text-sm">{analysis.board_assessment}</p>
                        </motion.div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          {[
                            { label: 'Complexity', value: analysis.complexity },
                            { label: 'Family Friendly', value: analysis.family_friendly ? 'Yes' : 'No' },
                            { label: 'Game Time', value: analysis.estimated_game_time }
                          ].map((stat, index) => (
                            <motion.div
                              key={stat.label}
                              className="p-3 bg-gray-50 rounded-lg"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                              whileHover={{ scale: 1.05, backgroundColor: '#f0f9ff' }}
                            >
                              <p className="font-medium text-gray-800">{stat.label}</p>
                              <p className="text-sm text-gray-600 capitalize">{stat.value}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Module Suggestions */}
                    <motion.div 
                      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-kopi-500" />
                        Module Placement Suggestions
                      </h3>
                      <div className="space-y-3">
                        {analysis.module_suggestions.map((suggestion: any, index: number) => (
                          <motion.div 
                            key={index} 
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                  {suggestion.module_type}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{suggestion.placement}</p>
                                <p className="text-xs text-gray-500 mt-2">{suggestion.reason}</p>
                              </div>
                              <motion.span 
                                className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                                  suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                              >
                                {suggestion.priority}
                              </motion.span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Strategic Tips */}
                    <motion.div 
                      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Strategic Tips
                      </h3>
                      <ul className="space-y-3">
                        {analysis.strategic_tips.map((tip: string, index: number) => (
                          <motion.li 
                            key={index} 
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <motion.div 
                              className="w-2 h-2 rounded-full bg-kopi-500 mt-2 flex-shrink-0"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1 + index * 0.1, type: "spring" }}
                            />
                            <span className="text-sm text-gray-600 flex-1">{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Complete Setup Button */}
                    <motion.button
                      onClick={handleComplete}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      />
                      <CheckCircle className="h-5 w-5" />
                      <span>Complete Board Setup</span>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      >
                        🎮
                      </motion.span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="bg-white rounded-2xl p-6 shadow-lg"
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      >
                        <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      </motion.div>
                      <p className="text-gray-500 text-lg">Upload and analyze your board to see AI suggestions</p>
                      <p className="text-gray-400 text-sm mt-2">Get personalized module placement recommendations</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardSetupModal