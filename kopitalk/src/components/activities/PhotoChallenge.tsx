import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Upload, CheckCircle, AlertCircle, Sparkles, DollarSign } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onComplete: (earnings: number, story: string) => void
  playerName: string
}

interface PhotoChallengeLocation {
  id: string
  name: string
  description: string
  baseReward: number
  keywords: string[]
}

const PhotoChallenge: React.FC<Props> = ({ isOpen, onClose, onComplete, playerName }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [story, setStory] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{ earnings: number; feedback: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const locations: PhotoChallengeLocation[] = [
    {
      id: 'wet_market',
      name: 'Wet Market',
      description: 'Capture the vibrant traditional market atmosphere',
      baseReward: 15,
      keywords: ['stall', 'fresh', 'vegetables', 'fish', 'vendor', 'bustling']
    },
    {
      id: 'supermarket',
      name: 'Modern Supermarket',
      description: 'Show the digital shopping experience',
      baseReward: 10,
      keywords: ['aisle', 'products', 'shelves', 'cart', 'checkout', 'modern']
    },
    {
      id: 'mrt',
      name: 'MRT Station',
      description: 'Showcase Singapore\'s transport system',
      baseReward: 12,
      keywords: ['platform', 'train', 'commuters', 'signs', 'escalator', 'clean']
    },
    {
      id: 'hawker',
      name: 'Hawker Center',
      description: 'Document the local food culture',
      baseReward: 18,
      keywords: ['food', 'stalls', 'cooking', 'crowd', 'dishes', 'authentic']
    },
    {
      id: 'cooking',
      name: 'Cooking at Home',
      description: 'Share your cooking process',
      baseReward: 20,
      keywords: ['ingredients', 'cooking', 'preparation', 'dish', 'family', 'homemade']
    }
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzePhoto = () => {
    if (!selectedLocation || !photoFile || !story.trim()) {
      alert('Please select a location, upload a photo, and add a story')
      return
    }

    setIsAnalyzing(true)

    // Simulate AI analysis (in real app, this would call Gemini Vision API)
    setTimeout(() => {
      const location = locations.find(l => l.id === selectedLocation)!
      const storyWords = story.toLowerCase().split(' ')
      
      // Check for keywords in story
      const keywordMatches = location.keywords.filter(keyword => 
        storyWords.some(word => word.includes(keyword))
      ).length

      // Calculate earnings based on story quality
      const qualityMultiplier = 1 + (keywordMatches * 0.2) // 20% bonus per keyword match
      const storyLengthBonus = Math.min(story.length / 100, 1) // Up to 100% bonus for longer stories
      const collaborationBonus = story.toLowerCase().includes(playerName.toLowerCase()) ? 1.2 : 1
      
      const earnings = Math.round(
        location.baseReward * qualityMultiplier * (1 + storyLengthBonus * 0.5) * collaborationBonus
      )

      const feedback = earnings >= location.baseReward * 1.5
        ? '🌟 Excellent! Your photo and story show great intergenerational collaboration!'
        : earnings >= location.baseReward * 1.2
        ? '👍 Good work! Your photo captures the essence of the location.'
        : '✨ Nice try! Consider adding more details about what you learned.'

      setResult({ earnings, feedback })
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleComplete = () => {
    if (result) {
      onComplete(result.earnings, story)
      handleReset()
    }
  }

  const handleReset = () => {
    setSelectedLocation(null)
    setPhotoFile(null)
    setPhotoPreview(null)
    setStory('')
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Photo Challenge
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  Capture moments and earn money through storytelling
                </p>
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
            {!result ? (
              <div className="space-y-6">
                {/* Step 1: Select Location */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Step 1: Choose a Location
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {locations.map(location => (
                      <motion.button
                        key={location.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLocation(location.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedLocation === location.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-800 mb-1">{location.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span>${location.baseReward}+ reward</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Upload Photo */}
                {selectedLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-purple-500" />
                      Step 2: Upload Your Photo
                    </h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      {photoPreview ? (
                        <div className="space-y-4">
                          <img 
                            src={photoPreview} 
                            alt="Preview" 
                            className="mx-auto max-h-64 rounded-lg shadow-md"
                          />
                          <button
                            onClick={() => {
                              setPhotoFile(null)
                              setPhotoPreview(null)
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Change photo
                          </button>
                        </div>
                      ) : (
                        <>
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label
                            htmlFor="photo-upload"
                            className="inline-block px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 cursor-pointer transition-colors"
                          >
                            Take or Upload Photo
                          </label>
                          <p className="text-sm text-gray-600 mt-2">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Write Story */}
                {photoFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Step 3: Tell Your Story
                    </h3>
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder={`What did ${playerName} learn from this experience? How did it bridge generations? What was special about this moment?`}
                      className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {story.length}/500 characters • Mention experiences from both generations
                    </p>
                  </motion.div>
                )}

                {/* Analyze Button */}
                {photoFile && story.trim() && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={analyzePhoto}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze & Earn
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            ) : (
              /* Result Display */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Challenge Complete!</h3>
                  <p className="text-gray-600">{result.feedback}</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">You earned</p>
                  <div className="flex items-center justify-center gap-2 text-4xl font-bold text-green-600">
                    <DollarSign className="w-8 h-8" />
                    <span>{result.earnings}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Added to family budget</p>
                </div>

                {photoPreview && (
                  <img 
                    src={photoPreview} 
                    alt="Your photo" 
                    className="mx-auto max-h-48 rounded-lg shadow-md"
                  />
                )}

                <div className="bg-gray-50 rounded-xl p-4 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-1">Your Story:</p>
                  <p className="text-sm text-gray-600 italic">"{story}"</p>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Complete & Return to Game
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PhotoChallenge
