# 📱 Mobile Animations Usage Guide

## Quick Start

### 1. Import Mobile Animations

```tsx
import { 
  mobileAnimations, 
  isMobileDevice,
  getResponsiveAnimation,
  mobileSpring
} from '../utils/mobileAnimations'
import { motion } from 'framer-motion'
```

### 2. Use Pre-built Animation Variants

#### Button Animations
```tsx
<motion.button
  variants={mobileAnimations.button}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Click Me
</motion.button>
```

#### Card Entrance Animations
```tsx
{cards.map((card, index) => (
  <motion.div
    key={card.id}
    variants={mobileAnimations.card}
    initial="hidden"
    animate="visible"
    custom={index}
    className="p-4 bg-white rounded-lg shadow"
  >
    {card.content}
  </motion.div>
))}
```

#### Page Transitions
```tsx
<motion.div
  variants={mobileAnimations.page}
  initial="initial"
  animate="animate"
  exit="exit"
>
  <YourPageContent />
</motion.div>
```

#### Modal/Dialog Animations
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={mobileAnimations.modal}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg">
        Modal Content
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### 3. List Animations with Stagger

```tsx
<motion.ul
  variants={mobileAnimations.listContainer}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.li
      key={item.id}
      variants={mobileAnimations.listItem}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### 4. Bottom Sheet (Mobile UI Pattern)

```tsx
<AnimatePresence>
  {showBottomSheet && (
    <motion.div
      variants={mobileAnimations.bottomSheet}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6"
    >
      Bottom Sheet Content
    </motion.div>
  )}
</AnimatePresence>
```

### 5. Tab Animations

```tsx
{tabs.map((tab) => (
  <motion.button
    key={tab.id}
    variants={mobileAnimations.tab}
    animate={activeTab === tab.id ? 'active' : 'inactive'}
    onClick={() => setActiveTab(tab.id)}
  >
    {tab.label}
  </motion.button>
))}
```

## Advanced Usage

### Responsive Animations (Desktop vs Mobile)

```tsx
const buttonVariants = getResponsiveAnimation(
  {
    // Desktop animations
    hover: { scale: 1.1, y: -5 },
    tap: { scale: 0.9 }
  },
  mobileAnimations.button // Mobile animations
)

<motion.button variants={buttonVariants}>
  Responsive Button
</motion.button>
```

### Conditional Mobile Detection

```tsx
const isMobile = isMobileDevice()

<motion.div
  whileHover={isMobile ? {} : { scale: 1.05 }}
  whileTap={isMobile ? { scale: 0.95 } : {}}
>
  Content
</motion.div>
```

### Custom Spring Transitions

```tsx
<motion.div
  animate={{ x: 100 }}
  transition={mobileSpring}
>
  Smooth Mobile Animation
</motion.div>
```

### Swipe Gestures

```tsx
import { swipeConfidenceThreshold, swipePower } from '../utils/mobileAnimations'

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x)
    
    if (swipe < -swipeConfidenceThreshold) {
      // Swiped left
      nextSlide()
    } else if (swipe > swipeConfidenceThreshold) {
      // Swiped right
      previousSlide()
    }
  }}
>
  Swipeable Content
</motion.div>
```

### Icon Rotate Animation (Chevrons, Arrows)

```tsx
<motion.div
  variants={mobileAnimations.iconRotate}
  animate={isExpanded ? 'up' : 'down'}
>
  <ChevronDown />
</motion.div>
```

### Floating/Pulse Animations

```tsx
// Floating notification badge
<motion.div
  variants={mobileAnimations.floating}
  animate="float"
  className="absolute top-0 right-0"
>
  <NotificationBadge />
</motion.div>

// Pulsing badge
<motion.div
  variants={mobileAnimations.badgePulse}
  animate="pulse"
>
  New!
</motion.div>
```

### Shake Animation (Error Feedback)

```tsx
const [shake, setShake] = useState(false)

<motion.div
  variants={mobileAnimations.shake}
  animate={shake ? 'shake' : ''}
  onAnimationComplete={() => setShake(false)}
>
  <input 
    onInvalid={() => setShake(true)}
    type="email"
  />
</motion.div>
```

### Loading Spinner

```tsx
<motion.div
  variants={mobileAnimations.spinner}
  animate="spin"
  className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
/>
```

## Best Practices

### 1. Performance
- ✅ Use `transform` and `opacity` properties (GPU-accelerated)
- ✅ Avoid animating `width`, `height`, `top`, `left`
- ✅ Use `will-change` sparingly
- ✅ Disable animations for reduced motion:

```tsx
<motion.div
  variants={mobileAnimations.card}
  initial="hidden"
  animate="visible"
  whileHover={!prefersReducedMotion ? "hover" : undefined}
>
```

### 2. Touch Targets
- Ensure minimum 44x44px touch targets on mobile
- Add padding if needed:

```tsx
<motion.button
  variants={mobileAnimations.button}
  className="min-w-[44px] min-h-[44px]"
>
```

### 3. Accessibility
- Provide keyboard alternatives
- Use ARIA labels
- Respect reduced motion preferences

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.05 }}
>
```

## Animation Cheat Sheet

| Animation Type | Usage | Best For |
|---------------|-------|----------|
| `button` | Touch feedback | All interactive elements |
| `card` | Entrance | Lists, grids, cards |
| `slide` | Navigation | Page transitions, carousels |
| `modal` | Overlay | Dialogs, popups |
| `listContainer` + `listItem` | Stagger | Lists, menus |
| `bottomSheet` | Mobile UI | Mobile-first panels |
| `tab` | Selection | Tab bars, toggles |
| `floating` | Attention | Badges, notifications |
| `shake` | Error | Form validation |
| `spinner` | Loading | Async operations |

## Common Patterns

### Form Validation with Shake
```tsx
const handleSubmit = (e) => {
  e.preventDefault()
  if (!isValid) {
    setShake(true)
  }
}

<motion.form
  variants={mobileAnimations.shake}
  animate={shake ? 'shake' : ''}
  onSubmit={handleSubmit}
>
```

### Staggered List Load
```tsx
<motion.div
  variants={mobileAnimations.listContainer}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={mobileAnimations.listItem}
      custom={i}
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### Swipeable Cards
```tsx
const [[page, direction], setPage] = useState([0, 0])

<AnimatePresence initial={false} custom={direction}>
  <motion.div
    key={page}
    custom={direction}
    variants={mobileAnimations.slide}
    initial="enter"
    animate="center"
    exit="exit"
    drag="x"
    onDragEnd={(e, { offset, velocity }) => {
      const swipe = swipePower(offset.x, velocity.x)
      if (swipe < -swipeConfidenceThreshold) {
        setPage([page + 1, 1])
      } else if (swipe > swipeConfidenceThreshold) {
        setPage([page - 1, -1])
      }
    }}
  >
    <Card data={cards[page]} />
  </motion.div>
</AnimatePresence>
```

---

## 🎉 You're Ready!

All mobile animations are now available in your components. Simply import and use the pre-built variants for consistent, performant animations across all devices!
