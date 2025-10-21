/**
 * State Persistence Test Script
 * 
 * This script helps verify that game state saves correctly to localStorage
 * and persists across page refreshes.
 * 
 * HOW TO USE:
 * 1. Open the app in browser (npm run dev)
 * 2. Open DevTools → Console
 * 3. Copy and paste this script
 * 4. Run commands to inspect state
 * 
 * COMMANDS:
 * - checkStorage() - View current localStorage state
 * - verifyPersistence() - Check if key fields are persisted
 * - clearStorage() - Clear all game state
 * - testSave() - Test saving sample data
 */

// Check if localStorage has game state
function checkStorage() {
  console.log('🔍 CHECKING LOCALSTORAGE...')
  console.log('=' .repeat(60))
  
  const key = 'singaplaygo-game-storage'
  const raw = localStorage.getItem(key)
  
  if (!raw) {
    console.log('❌ No game state found in localStorage')
    console.log('   Key:', key)
    return null
  }
  
  try {
    const parsed = JSON.parse(raw)
    console.log('✅ Game state found!')
    console.log('   Key:', key)
    console.log('   Size:', (raw.length / 1024).toFixed(2), 'KB')
    console.log('\n📊 STATE CONTENTS:')
    console.log('   - customBoard:', parsed.state?.customBoard ? '✅ Set' : '❌ Not set')
    console.log('   - dishChallenge:', parsed.state?.dishChallenge ? '✅ Set' : '❌ Not set')
    console.log('   - players:', parsed.state?.players?.length || 0, 'players')
    console.log('   - family_budget:', `$${parsed.state?.family_budget || 0}`)
    console.log('   - ezlink_balance:', `$${parsed.state?.ezlink_balance || 0}`)
    console.log('   - collectedIngredients:', parsed.state?.collectedIngredients?.length || 0)
    console.log('   - completedActivities:', parsed.state?.completedActivities?.length || 0)
    console.log('   - bonding_level:', parsed.state?.bonding_level || 0)
    console.log('   - gameStarted:', parsed.state?.gameStarted ? '✅' : '❌')
    console.log('\n💾 FULL STATE:')
    console.log(parsed)
    console.log('=' .repeat(60))
    
    return parsed
  } catch (error) {
    console.error('❌ Failed to parse localStorage data:', error)
    return null
  }
}

// Verify persistence is working
function verifyPersistence() {
  console.log('🧪 VERIFYING PERSISTENCE...')
  console.log('=' .repeat(60))
  
  const state = checkStorage()
  if (!state) {
    console.log('❌ PERSISTENCE TEST FAILED: No state found')
    console.log('\n📋 TROUBLESHOOTING:')
    console.log('   1. Make sure you\'ve started the game')
    console.log('   2. Check that the app is running')
    console.log('   3. Try adding some data (e.g., create family, generate challenge)')
    return false
  }
  
  const checks = {
    'Persistence key exists': !!state,
    'State object exists': !!state.state,
    'Board can be persisted': state.state?.customBoard !== undefined,
    'Challenge can be persisted': state.state?.dishChallenge !== undefined,
    'Budget is persisted': typeof state.state?.family_budget === 'number',
    'Players are persisted': Array.isArray(state.state?.players),
    'Ingredients are persisted': Array.isArray(state.state?.collectedIngredients),
    'Activities are persisted': Array.isArray(state.state?.completedActivities),
  }
  
  console.log('\n✅ PERSISTENCE CHECKS:')
  let allPassed = true
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`   ${passed ? '✅' : '❌'} ${check}`)
    if (!passed) allPassed = false
  }
  
  console.log('\n' + '=' .repeat(60))
  console.log(allPassed ? '✅ ALL CHECKS PASSED!' : '❌ SOME CHECKS FAILED!')
  console.log('=' .repeat(60))
  
  return allPassed
}

// Clear all game state
function clearStorage() {
  console.log('🗑️  CLEARING STORAGE...')
  const key = 'singaplaygo-game-storage'
  localStorage.removeItem(key)
  console.log('✅ Storage cleared!')
  console.log('   Refresh the page to reset the app')
}

// Test saving sample data
function testSave() {
  console.log('🧪 TESTING SAVE...')
  console.log('=' .repeat(60))
  
  const key = 'singaplaygo-game-storage'
  const testData = {
    state: {
      customBoard: { name: 'Test Board', tiles: [] },
      dishChallenge: {
        id: 'test-1',
        dish_name: 'Test Chicken Rice',
        ingredients: [
          { name: 'Chicken', quantity: 1, unit: 'whole', collected: false },
          { name: 'Rice', quantity: 400, unit: 'grams', collected: false }
        ]
      },
      players: [
        { id: 0, name: 'Test Player', role: 'teenager', position: 0, cash: 0 }
      ],
      family_budget: 100,
      ezlink_balance: 20,
      collectedIngredients: [],
      completedActivities: [],
      bonding_level: 50,
      gameStarted: true,
    },
    version: 0
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(testData))
    console.log('✅ Test data saved!')
    console.log('   Refresh the page to load it')
    console.log('\n📊 Saved data:')
    console.log(testData)
  } catch (error) {
    console.error('❌ Failed to save test data:', error)
  }
  
  console.log('=' .repeat(60))
}

// Export for console usage
window.gameStorageTest = {
  checkStorage,
  verifyPersistence,
  clearStorage,
  testSave
}

console.log('🔧 STATE PERSISTENCE TEST UTILITIES LOADED')
console.log('=' .repeat(60))
console.log('Available commands:')
console.log('  gameStorageTest.checkStorage()     - View current state')
console.log('  gameStorageTest.verifyPersistence() - Run all checks')
console.log('  gameStorageTest.clearStorage()     - Clear state')
console.log('  gameStorageTest.testSave()         - Save test data')
console.log('=' .repeat(60))
