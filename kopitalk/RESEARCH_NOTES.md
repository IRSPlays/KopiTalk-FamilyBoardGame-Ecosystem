# 📚 Research Notes - Best Practices & Patterns

**Date**: October 14, 2025  
**Purpose**: Research findings for UI modernization project

---

## 🧩 Zustand State Management Best Practices

### ✅ Persist Middleware Patterns
Based on official Zustand docs and examples:

```typescript
// ✅ BEST PRACTICE: Proper persist setup with TypeScript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
  players: PlayerData[]
  family_budget: number
}

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      players: [],
      family_budget: 0,
      addPlayer: (player) => set((state) => ({
        players: [...state.players, player]
      })),
      earnMoney: (amount) => set((state) => ({
        family_budget: state.family_budget + amount
      }))
    }),
    {
      name: 'kopitalk-game-storage', // Unique name
      storage: createJSONStorage(() => localStorage),
      version: 1, // For migrations
      partialize: (state) => ({
        // Only persist what's needed
        players: state.players,
        family_budget: state.family_budget
      })
    }
  )
)
```

### ✅ Selector Best Practices
**Use selectors for performance optimization:**

```typescript
// ❌ BAD: Re-renders on every state change
const state = useGameStore()

// ✅ GOOD: Only re-renders when specific value changes
const budget = useGameStore(state => state.family_budget)
const earnMoney = useGameStore(state => state.earnMoney)

// ✅ EVEN BETTER: For multiple values, use shallow equality
import { shallow } from 'zustand/shallow'

const { budget, players } = useGameStore(
  state => ({ budget: state.family_budget, players: state.players }),
  shallow
)
```

### ✅ Tic-Tac-Toe Pattern (Multi-Step Game State)
From Zustand's tutorial - perfect for our board game:

```typescript
const useGameStore = create(
  combine(
    { 
      history: [Array(9).fill(null)], 
      currentMove: 0,
      xIsNext: true 
    },
    (set, get) => ({
      setHistory: (nextHistory) => {
        set((state) => ({
          history: typeof nextHistory === 'function'
            ? nextHistory(state.history)
            : nextHistory,
        }))
      },
      setCurrentMove: (nextMove) => {
        set((state) => ({
          currentMove: typeof nextMove === 'function'
            ? nextMove(state.currentMove)
            : nextMove,
        }))
      },
      jumpTo: (move) => set({ currentMove: move })
    })
  )
)
```

### ✅ Migrate Pattern (Version Management)
For breaking changes in store structure:

```typescript
const store = create(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'game-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from v0 to v1
          return {
            ...persistedState,
            newField: defaultValue
          }
        }
        if (version === 1) {
          // Migrate from v1 to v2
          return {
            ...persistedState,
            renamedField: persistedState.oldField
          }
        }
        return persistedState as GameState
      }
    }
  )
)
```

---

## 🎨 Framer Motion Mobile Optimization

### ✅ Performance-First Animation Patterns

```typescript
// ✅ BEST PRACTICE: Optimized appear animations
import { motion, startOptimizedAppearAnimation } from 'framer-motion'

// For SSR/hydration scenarios
const Component = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.3,
      ease: "easeOut"
    }}
    // Optimize for mobile
    style={{ willChange: "opacity, transform" }}
  >
    Content
  </motion.div>
)
```

### ✅ Spring Animations (Natural Motion)

```typescript
// Generate custom spring keyframes for complex animations
import { spring } from 'framer-motion'

const springConfig = {
  stiffness: 300,
  damping: 40,
  mass: 1
}

<motion.div
  animate={{ scale: 2, y: 100 }}
  transition={{ 
    type: "spring",
    ...springConfig
  }}
/>
```

### ✅ Mobile Touch Optimization

```typescript
// Reduce motion for accessibility and battery
import { useReducedMotion } from 'framer-motion'

const Component = () => {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.button
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
      transition={{ duration: 0.1 }}
    >
      Tap me
    </motion.button>
  )
}
```

### ✅ Gesture-Friendly Patterns

```typescript
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1 }}
  onDragEnd={(event, info) => {
    // info.offset.x, info.velocity.x
    console.log('Drag ended', info)
  }}
/>
```

### ✅ Layout Animations (No Jank)

```typescript
// Automatically animate layout changes
<motion.div layout>
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## ⚛️ React 18 Best Practices

### ✅ Concurrent Rendering with useTransition

```typescript
import { useTransition, useState } from 'react'

const Component = () => {
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState([])
  
  const handleExpensiveUpdate = (newItems) => {
    startTransition(() => {
      // Non-urgent update - can be interrupted
      setItems(newItems)
    })
  }
  
  return (
    <div>
      {isPending && <Spinner />}
      <List items={items} />
    </div>
  )
}
```

### ✅ useDeferredValue for Non-Urgent Updates

```typescript
import { useDeferredValue, useState } from 'react'

const SearchResults = ({ query }) => {
  const deferredQuery = useDeferredValue(query)
  // Use deferredQuery for expensive computation
  const results = searchExpensive(deferredQuery)
  
  return <ResultsList results={results} />
}
```

### ✅ React.memo for Expensive Components

```typescript
import { memo } from 'react'

// Only re-render when props change
const ExpensiveComponent = memo(({ data }) => {
  return <ComplexVisualization data={data} />
}, (prevProps, nextProps) => {
  // Custom comparison (optional)
  return prevProps.data.id === nextProps.data.id
})
```

### ✅ Component Design Patterns

```typescript
// ✅ GOOD: Small, focused components
const PlayerCard = ({ player, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={() => onSelect(player.id)}
  >
    <PlayerAvatar player={player} />
    <PlayerStats player={player} />
  </motion.div>
)

// ✅ GOOD: Custom hooks for reusable logic
const usePlayerActions = (playerId) => {
  const earnMoney = useGameStore(state => state.earnMoney)
  const updatePlayer = useGameStore(state => state.updatePlayer)
  
  const awardActivity = useCallback((activity, earnings) => {
    earnMoney(earnings)
    updatePlayer(playerId, { 
      activities: [...player.activities, activity]
    })
  }, [playerId, earnMoney, updatePlayer])
  
  return { awardActivity }
}
```

---

## 🇸🇬 Singapore Cultural Context (for UI/UX)

### 🏪 Wet Market Culture
- **Bargaining**: Expected and respectful (not aggressive)
- **Early morning**: Best time for fresh produce (6-9am)
- **Cash-only**: Traditional, elderly prefer cash
- **Vendors know regulars**: Relationship-based commerce
- **Dialect**: Hokkien, Cantonese, Teochew commonly used

### 🚇 MRT & Public Transport
- **EZ-Link card**: Tap in/out, stored value
- **Priority seats**: Reserved for elderly, pregnant, disabled
- **No eating/drinking**: Strictly enforced fine
- **Rush hours**: 7-9am, 5-7pm (crowded)
- **Announcements**: English + 3 languages (Mandarin, Malay, Tamil)

### 🎎 Chinese New Year (CNY) Customs
- **Price surging**: Markets, restaurants increase prices
- **Ang Pao**: Red packets with money (even numbers)
- **Food abundance**: Reunion dinner, symbolism in dishes
- **Lucky foods**: Fish (prosperity), Nian Gao (growth), Oranges (luck)
- **Hawker closures**: Many close 2-3 days for CNY

### 🍜 Hawker Center Etiquette
- **Chope seats**: Tissue packet = seat reserved
- **Return trays**: Encouraged but not always enforced
- **Ordering**: Queue at stall, pay, receive buzzer/number
- **Sharing tables**: Common practice during busy times

### 🗣️ Languages & Communication
- **Singlish**: Colloquial English with Malay/Chinese words
- **Code-switching**: Mix English, Mandarin, dialects
- **"Can/cannot"**: Universal question/answer
- **"Lah/leh/lor"**: Sentence particles for emphasis/softening

---

## 📱 Mobile UI/UX Best Practices

### ✅ Touch Target Sizing

```css
/* WCAG AAA Guidelines */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  /* Ideal: 48px × 48px */
}
```

### ✅ Tailwind Mobile-First Classes

```tsx
// Mobile-first responsive design
<button className="
  px-4 py-3          /* Mobile: comfortable touch */
  md:px-6 md:py-4   /* Tablet: slightly larger */
  lg:px-8 lg:py-5   /* Desktop: generous spacing */
  text-lg           /* Large, readable text */
  font-semibold
  rounded-xl        /* Friendly, modern corners */
  active:scale-95   /* Touch feedback */
  transition-transform
">
  Start Activity
</button>
```

### ✅ Safe Area Handling (iOS)

```css
/* Account for notch/home indicator */
.mobile-layout {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### ✅ Loading States & Skeletons

```tsx
// Prevent layout shift
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-24 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
)
```

---

## 🎮 Board Game State Management Patterns

### ✅ Turn-Based State

```typescript
interface GameState {
  currentTurn: number
  players: Player[]
  board: BoardTile[]
  history: GameAction[]
}

// Immutable action pattern
const executeAction = (action: GameAction) => {
  set((state) => ({
    history: [...state.history, action],
    currentTurn: state.currentTurn + 1,
    // Update affected state
  }))
}
```

### ✅ Real-Time Multiplayer (if needed)

```typescript
// Event-based state sync
const syncStore = create<GameState>()(
  subscribeWithSelector(
    persist(
      (set) => ({ /* state */ }),
      { name: 'game-sync' }
    )
  )
)

// Listen for external changes (e.g., from ESP32)
syncStore.subscribe(
  (state) => state.boardPosition,
  (position) => {
    // Update UI when physical board changes
    console.log('Player moved to:', position)
  }
)
```

---

## 🔑 Key Takeaways for Implementation

### DO ✅
1. **Use selectors everywhere** - Prevent unnecessary re-renders
2. **Persist only essential data** - Use `partialize` option
3. **Spring animations** - More natural than linear
4. **Mobile-first sizing** - 44px+ touch targets
5. **Combine middleware** - `devtools(persist(...))`
6. **Version your store** - Plan for migrations
7. **Immutable updates** - Always spread state
8. **useTransition for heavy updates** - Keep UI responsive

### DON'T ❌
1. **Don't use `any` types** - TypeScript safety is key
2. **Don't store derived state** - Calculate in selectors
3. **Don't persist everything** - Only critical game data
4. **Don't use inline animations** - Define reusable variants
5. **Don't ignore reduced motion** - Accessibility matters
6. **Don't forget willChange** - Hint browser for optimization
7. **Don't update state in render** - Use effects/handlers
8. **Don't call hooks conditionally** - Rules of Hooks

---

## 📊 Performance Targets

### Loading
- **Initial Load**: < 3s on 3G
- **Time to Interactive**: < 5s
- **First Contentful Paint**: < 1.8s

### Runtime
- **Animations**: 60fps (16.6ms/frame)
- **State Updates**: < 100ms perceived
- **localStorage**: < 5MB total

### Mobile
- **Touch Response**: < 100ms
- **Scroll Performance**: 60fps
- **Battery Impact**: Minimal (no constant polling)

---

## 🛠️ Tools & Extensions

### Development
- **React DevTools**: Component profiler
- **Redux DevTools**: Zustand devtools middleware
- **Lighthouse**: Performance audits
- **Chrome DevTools**: Mobile emulation

### Testing
- **Mobile Devices**: Real iOS + Android
- **Screen Readers**: Accessibility validation
- **Network Throttling**: 3G/4G testing
- **Battery Saver Mode**: Animation degradation

---

**Next Steps**: Apply these patterns to Phase 1 component remakes (DeliveryApp, SupermarketSelfOrder, GameHub, BoardGame)
