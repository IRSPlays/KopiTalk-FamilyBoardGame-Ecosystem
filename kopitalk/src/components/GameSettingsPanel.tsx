import React, { useState, useEffect } from 'react'
import { GameSession } from '../types'
import { 
  Settings, Users, Clock, Volume2, Palette, 
  Smartphone, Monitor, Globe, Shield, Bell,
  Save, RotateCcw, Download, Upload, Trash2,
  Eye, EyeOff, Camera, Mic, Wifi, Battery,
  Zap, Brain, Target, Heart, BookOpen, Trophy,
  Home, Play, Gamepad2, MapPin, Star, Gift,
  Activity, BarChart3, Bus, AlertCircle, WifiOff, Cloud
} from 'lucide-react'

interface GameSettings {
  // Display Settings
  theme: 'light' | 'dark' | 'singapore' | 'family'
  language: 'english' | 'mandarin' | 'malay' | 'tamil'
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  colorBlindMode: boolean
  highContrast: boolean
  animations: boolean

  // Audio Settings
  soundEffects: boolean
  backgroundMusic: boolean
  voiceGuidance: boolean
  volume: number
  singaporeAccent: boolean

  // Gameplay Settings
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  gameSpeed: 'slow' | 'normal' | 'fast'
  autoSave: boolean
  tutorialMode: boolean
  culturalInsights: boolean
  familyMode: boolean

  // AI Features
  aiAssistant: boolean
  conversationAnalysis: boolean
  smartRecommendations: boolean
  challengeGeneration: boolean
  culturalGuidance: boolean
  
  // Hardware Integration
  esp32Enabled: boolean
  cameraDetection: boolean
  microphoneAccess: boolean
  notificationsEnabled: boolean
  autoSync: boolean

  // Privacy & Data
  dataCollection: boolean
  analytics: boolean
  familyDataSharing: boolean
  cloudSync: boolean
  offlineMode: boolean

  // Singapore Features
  realTimeData: boolean
  locationServices: boolean
  transportIntegration: boolean
  weatherIntegration: boolean
  culturalEvents: boolean
}

interface Props {
  gameSession: GameSession
  onSettingsUpdate: (settings: Partial<GameSettings>) => void
  onResetSettings: () => void
  onExportData: () => void
  onImportData: (data: any) => void
}

const GameSettingsPanel: React.FC<Props> = ({ 
  gameSession, 
  onSettingsUpdate, 
  onResetSettings,
  onExportData,
  onImportData 
}) => {
  const [settings, setSettings] = useState<GameSettings>({
    // Display Settings
    theme: 'singapore',
    language: 'english',
    fontSize: 'medium',
    colorBlindMode: false,
    highContrast: false,
    animations: true,

    // Audio Settings
    soundEffects: true,
    backgroundMusic: true,
    voiceGuidance: false,
    volume: 70,
    singaporeAccent: true,

    // Gameplay Settings
    difficulty: 'medium',
    gameSpeed: 'normal',
    autoSave: true,
    tutorialMode: true,
    culturalInsights: true,
    familyMode: true,

    // AI Features
    aiAssistant: true,
    conversationAnalysis: true,
    smartRecommendations: true,
    challengeGeneration: true,
    culturalGuidance: true,
    
    // Hardware Integration
    esp32Enabled: false,
    cameraDetection: false,
    microphoneAccess: true,
    notificationsEnabled: true,
    autoSync: false,

    // Privacy & Data
    dataCollection: true,
    analytics: true,
    familyDataSharing: false,
    cloudSync: true,
    offlineMode: false,

    // Singapore Features
    realTimeData: true,
    locationServices: false,
    transportIntegration: true,
    weatherIntegration: true,
    culturalEvents: true
  })

  const [activeTab, setActiveTab] = useState<'display' | 'audio' | 'gameplay' | 'ai' | 'hardware' | 'privacy' | 'singapore'>('display')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('singapore-board-game-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    setHasUnsavedChanges(true)
    onSettingsUpdate({ [key]: value })
  }

  const saveSettings = () => {
    localStorage.setItem('singapore-board-game-settings', JSON.stringify(settings))
    setHasUnsavedChanges(false)
    showNotification('Settings saved successfully!', 'success')
  }

  const resetSettings = () => {
    if (showResetConfirm) {
      // Reset to defaults
      const defaultSettings = {
        theme: 'singapore',
        language: 'english',
        fontSize: 'medium',
        difficulty: 'medium',
        volume: 70,
        // ... other defaults
      } as Partial<GameSettings>
      
      setSettings(prev => ({ ...prev, ...defaultSettings }))
      setHasUnsavedChanges(true)
      setShowResetConfirm(false)
      showNotification('Settings reset to defaults', 'success')
      onResetSettings()
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 3000)
    }
  }

  const showNotification = (message: string, type: 'success' | 'warning' | 'error') => {
    // Simple notification implementation
    const notification = document.createElement('div')
    const color = type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'
    notification.className = `fixed top-4 right-4 bg-${color}-500 text-white px-4 py-2 rounded-lg shadow-lg z-50`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 3000)
  }

  const tabs = [
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'gameplay', label: 'Gameplay', icon: Gamepad2 },
    { id: 'ai', label: 'AI Features', icon: Brain },
    { id: 'hardware', label: 'Hardware', icon: Camera },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'singapore', label: 'Singapore', icon: MapPin }
  ]

  const SettingGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  const ToggleSetting: React.FC<{ 
    label: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
    icon?: React.ComponentType<{ className?: string }>
  }> = ({ label, description, checked, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <div>
          <div className="font-medium text-gray-800">{label}</div>
          {description && <div className="text-sm text-gray-600">{description}</div>}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  )

  const SelectSetting: React.FC<{
    label: string
    description?: string
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
    icon?: React.ComponentType<{ className?: string }>
  }> = ({ label, description, value, options, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <div>
          <div className="font-medium text-gray-800">{label}</div>
          {description && <div className="text-sm text-gray-600">{description}</div>}
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )

  const SliderSetting: React.FC<{
    label: string
    description?: string
    value: number
    min: number
    max: number
    onChange: (value: number) => void
    icon?: React.ComponentType<{ className?: string }>
    unit?: string
  }> = ({ label, description, value, min, max, onChange, icon: Icon, unit }) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <div className="flex-1">
          <div className="font-medium text-gray-800">{label}</div>
          {description && <div className="text-sm text-gray-600">{description}</div>}
        </div>
        <span className="text-lg font-bold text-blue-600">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'display':
        return (
          <div>
            <SettingGroup title="Theme & Appearance">
              <SelectSetting
                label="Theme"
                description="Choose your preferred visual theme"
                value={settings.theme}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'singapore', label: 'Singapore (Default)' },
                  { value: 'family', label: 'Family Friendly' }
                ]}
                onChange={(value) => updateSetting('theme', value as any)}
                icon={Palette}
              />
              
              <SelectSetting
                label="Language"
                description="Game interface language"
                value={settings.language}
                options={[
                  { value: 'english', label: 'English' },
                  { value: 'mandarin', label: '中文 (Mandarin)' },
                  { value: 'malay', label: 'Bahasa Melayu' },
                  { value: 'tamil', label: 'தமிழ் (Tamil)' }
                ]}
                onChange={(value) => updateSetting('language', value as any)}
                icon={Globe}
              />

              <SelectSetting
                label="Font Size"
                description="Adjust text size for better readability"
                value={settings.fontSize}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                  { value: 'extra-large', label: 'Extra Large' }
                ]}
                onChange={(value) => updateSetting('fontSize', value as any)}
                icon={Eye}
              />
            </SettingGroup>

            <SettingGroup title="Accessibility">
              <ToggleSetting
                label="Color Blind Mode"
                description="Enhanced colors for color vision deficiency"
                checked={settings.colorBlindMode}
                onChange={(checked) => updateSetting('colorBlindMode', checked)}
                icon={Eye}
              />
              
              <ToggleSetting
                label="High Contrast"
                description="Increase contrast for better visibility"
                checked={settings.highContrast}
                onChange={(checked) => updateSetting('highContrast', checked)}
                icon={Eye}
              />
              
              <ToggleSetting
                label="Animations"
                description="Enable smooth animations and transitions"
                checked={settings.animations}
                onChange={(checked) => updateSetting('animations', checked)}
                icon={Zap}
              />
            </SettingGroup>
          </div>
        )

      case 'audio':
        return (
          <div>
            <SettingGroup title="Sound Settings">
              <ToggleSetting
                label="Sound Effects"
                description="Dice rolls, button clicks, and game sounds"
                checked={settings.soundEffects}
                onChange={(checked) => updateSetting('soundEffects', checked)}
                icon={Volume2}
              />
              
              <ToggleSetting
                label="Background Music"
                description="Ambient music during gameplay"
                checked={settings.backgroundMusic}
                onChange={(checked) => updateSetting('backgroundMusic', checked)}
                icon={Volume2}
              />
              
              <ToggleSetting
                label="Voice Guidance"
                description="Spoken instructions and feedback"
                checked={settings.voiceGuidance}
                onChange={(checked) => updateSetting('voiceGuidance', checked)}
                icon={Mic}
              />

              <SliderSetting
                label="Volume"
                description="Master volume level"
                value={settings.volume}
                min={0}
                max={100}
                onChange={(value) => updateSetting('volume', value)}
                icon={Volume2}
                unit="%"
              />
            </SettingGroup>

            <SettingGroup title="Localization">
              <ToggleSetting
                label="Singapore Accent"
                description="Use Singaporean English pronunciation for voice features"
                checked={settings.singaporeAccent}
                onChange={(checked) => updateSetting('singaporeAccent', checked)}
                icon={Globe}
              />
            </SettingGroup>
          </div>
        )

      case 'gameplay':
        return (
          <div>
            <SettingGroup title="Game Difficulty">
              <SelectSetting
                label="Difficulty Level"
                description="Adjust challenge complexity"
                value={settings.difficulty}
                options={[
                  { value: 'easy', label: 'Easy - Perfect for beginners' },
                  { value: 'medium', label: 'Medium - Balanced experience' },
                  { value: 'hard', label: 'Hard - More challenging' },
                  { value: 'expert', label: 'Expert - Maximum difficulty' }
                ]}
                onChange={(value) => updateSetting('difficulty', value as any)}
                icon={Target}
              />

              <SelectSetting
                label="Game Speed"
                description="Control game pacing"
                value={settings.gameSpeed}
                options={[
                  { value: 'slow', label: 'Slow - Take your time' },
                  { value: 'normal', label: 'Normal - Standard pace' },
                  { value: 'fast', label: 'Fast - Quick gameplay' }
                ]}
                onChange={(value) => updateSetting('gameSpeed', value as any)}
                icon={Clock}
              />
            </SettingGroup>

            <SettingGroup title="Learning Features">
              <ToggleSetting
                label="Tutorial Mode"
                description="Show helpful tips and guidance"
                checked={settings.tutorialMode}
                onChange={(checked) => updateSetting('tutorialMode', checked)}
                icon={BookOpen}
              />
              
              <ToggleSetting
                label="Cultural Insights"
                description="Learn about Singapore culture during gameplay"
                checked={settings.culturalInsights}
                onChange={(checked) => updateSetting('culturalInsights', checked)}
                icon={Star}
              />
              
              <ToggleSetting
                label="Family Mode"
                description="Enhanced features for family gameplay"
                checked={settings.familyMode}
                onChange={(checked) => updateSetting('familyMode', checked)}
                icon={Heart}
              />
            </SettingGroup>

            <SettingGroup title="Data Management">
              <ToggleSetting
                label="Auto Save"
                description="Automatically save game progress"
                checked={settings.autoSave}
                onChange={(checked) => updateSetting('autoSave', checked)}
                icon={Save}
              />
            </SettingGroup>
          </div>
        )

      case 'ai':
        return (
          <div>
            <SettingGroup title="AI Assistant">
              <ToggleSetting
                label="AI Assistant"
                description="Enable intelligent game assistance"
                checked={settings.aiAssistant}
                onChange={(checked) => updateSetting('aiAssistant', checked)}
                icon={Brain}
              />
              
              <ToggleSetting
                label="Conversation Analysis"
                description="Analyze family conversations for insights"
                checked={settings.conversationAnalysis}
                onChange={(checked) => updateSetting('conversationAnalysis', checked)}
                icon={Mic}
              />
              
              <ToggleSetting
                label="Smart Recommendations"
                description="Personalized activity suggestions"
                checked={settings.smartRecommendations}
                onChange={(checked) => updateSetting('smartRecommendations', checked)}
                icon={Target}
              />
            </SettingGroup>

            <SettingGroup title="Dynamic Content">
              <ToggleSetting
                label="Challenge Generation"
                description="AI-generated challenges based on family interests"
                checked={settings.challengeGeneration}
                onChange={(checked) => updateSetting('challengeGeneration', checked)}
                icon={Trophy}
              />
              
              <ToggleSetting
                label="Cultural Guidance"
                description="AI-powered cultural learning assistance"
                checked={settings.culturalGuidance}
                onChange={(checked) => updateSetting('culturalGuidance', checked)}
                icon={BookOpen}
              />
            </SettingGroup>
          </div>
        )

      case 'hardware':
        return (
          <div>
            <SettingGroup title="ESP32-CAM Integration">
              <ToggleSetting
                label="ESP32-CAM Support"
                description="Enable smart board detection (requires ESP32-CAM)"
                checked={settings.esp32Enabled}
                onChange={(checked) => updateSetting('esp32Enabled', checked)}
                icon={Camera}
              />
              
              <ToggleSetting
                label="Camera Detection"
                description="Automatically detect board state changes"
                checked={settings.cameraDetection}
                onChange={(checked) => updateSetting('cameraDetection', checked)}
                icon={Eye}
              />
              
              <ToggleSetting
                label="Auto Sync"
                description="Automatically sync detected changes to game"
                checked={settings.autoSync}
                onChange={(checked) => updateSetting('autoSync', checked)}
                icon={Wifi}
              />
            </SettingGroup>

            <SettingGroup title="Device Access">
              <ToggleSetting
                label="Microphone Access"
                description="Enable voice recording and analysis"
                checked={settings.microphoneAccess}
                onChange={(checked) => updateSetting('microphoneAccess', checked)}
                icon={Mic}
              />
              
              <ToggleSetting
                label="Notifications"
                description="Show system notifications"
                checked={settings.notificationsEnabled}
                onChange={(checked) => updateSetting('notificationsEnabled', checked)}
                icon={Bell}
              />
            </SettingGroup>
          </div>
        )

      case 'privacy':
        return (
          <div>
            <SettingGroup title="Data Collection">
              <ToggleSetting
                label="Analytics"
                description="Help improve the game with usage analytics"
                checked={settings.analytics}
                onChange={(checked) => updateSetting('analytics', checked)}
                icon={BarChart3}
              />
              
              <ToggleSetting
                label="Data Collection"
                description="Allow collection of gameplay data for improvements"
                checked={settings.dataCollection}
                onChange={(checked) => updateSetting('dataCollection', checked)}
                icon={Shield}
              />
              
              <ToggleSetting
                label="Family Data Sharing"
                description="Share family gameplay patterns (anonymized)"
                checked={settings.familyDataSharing}
                onChange={(checked) => updateSetting('familyDataSharing', checked)}
                icon={Users}
              />
            </SettingGroup>

            <SettingGroup title="Storage & Sync">
              <ToggleSetting
                label="Cloud Sync"
                description="Sync settings and progress across devices"
                checked={settings.cloudSync}
                onChange={(checked) => updateSetting('cloudSync', checked)}
                icon={Upload}
              />
              
              <ToggleSetting
                label="Offline Mode"
                description="Play without internet connection"
                checked={settings.offlineMode}
                onChange={(checked) => updateSetting('offlineMode', checked)}
                icon={WifiOff}
              />
            </SettingGroup>
          </div>
        )

      case 'singapore':
        return (
          <div>
            <SettingGroup title="Real-Time Integration">
              <ToggleSetting
                label="Real-Time Data"
                description="Use live Singapore data (transport, weather, etc.)"
                checked={settings.realTimeData}
                onChange={(checked) => updateSetting('realTimeData', checked)}
                icon={Activity}
              />
              
              <ToggleSetting
                label="Transport Integration"
                description="Real bus/MRT timings and route data"
                checked={settings.transportIntegration}
                onChange={(checked) => updateSetting('transportIntegration', checked)}
                icon={Bus}
              />
              
              <ToggleSetting
                label="Weather Integration"
                description="Current Singapore weather in gameplay"
                checked={settings.weatherIntegration}
                onChange={(checked) => updateSetting('weatherIntegration', checked)}
                icon={Cloud}
              />
            </SettingGroup>

            <SettingGroup title="Location & Events">
              <ToggleSetting
                label="Location Services"
                description="Use your location for neighborhood-specific content"
                checked={settings.locationServices}
                onChange={(checked) => updateSetting('locationServices', checked)}
                icon={MapPin}
              />
              
              <ToggleSetting
                label="Cultural Events"
                description="Include current Singapore festivals and events"
                checked={settings.culturalEvents}
                onChange={(checked) => updateSetting('culturalEvents', checked)}
                icon={Star}
              />
            </SettingGroup>
          </div>
        )

      default:
        return <div>Select a settings category</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Game Settings
          </h1>
          <div className="flex gap-3">
            {hasUnsavedChanges && (
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}
            <button
              onClick={resetSettings}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                showResetConfirm ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              {showResetConfirm ? 'Confirm Reset' : 'Reset to Defaults'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-xl p-6 shadow-lg min-h-[600px]">
        {renderTabContent()}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
        <div className="flex gap-3">
          <button
            onClick={onExportData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Game Data
          </button>
          <button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = '.json'
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    try {
                      const data = JSON.parse(e.target?.result as string)
                      onImportData(data)
                      showNotification('Data imported successfully!', 'success')
                    } catch (error) {
                      showNotification('Error importing data', 'error')
                    }
                  }
                  reader.readAsText(file)
                }
              }
              input.click()
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Game Data
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete all game data? This cannot be undone.')) {
                localStorage.clear()
                showNotification('All game data cleared', 'success')
                window.location.reload()
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          You have unsaved changes
        </div>
      )}
    </div>
  )
}

export default GameSettingsPanel